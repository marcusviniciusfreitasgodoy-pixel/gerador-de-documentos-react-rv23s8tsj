import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Plus, Save, Trash2, User, Building2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { AutoPreencherDialog } from '@/components/AutoPreencherDialog'
import { getNegocio, updateNegocio, mesclarPartes } from '@/lib/negocios'
import { IntroPagina } from '@/components/Layout'
import type { Negocio, ParteNegocio, PapelParte } from '@/lib/negocios'
import { mergeResults, emptyImovel } from '@/lib/extraction-types'
import type {
  ExtracaoResult,
  PessoaRole,
  PessoaExtraida,
  ImovelExtraido,
} from '@/lib/extraction-types'

const PAPEL_LABELS: Record<PapelParte, string> = {
  vendedor: 'Vendedor(a)',
  comprador: 'Comprador(a)',
  anuente: 'Anuente (cônjuge)',
}

export default function NegocioDetalhePage() {
  const { id } = useParams<{ id: string }>()
  const [negocio, setNegocio] = useState<Negocio | null>(null)
  const [partes, setPartes] = useState<ParteNegocio[]>([])
  const [imovel, setImovel] = useState<ImovelExtraido>({ ...emptyImovel })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    getNegocio(id)
      .then((n) => {
        if (cancelled) return
        setNegocio(n)
        setPartes(n.partes)
        setImovel(n.imovel)
      })
      .catch(() => {
        if (!cancelled) toast.error('Negócio não encontrado.')
      })
    return () => {
      cancelled = true
    }
  }, [id])

  // O AutoPreencherDialog devolve { pessoas, imovel } + os papéis escolhidos.
  // As pessoas são mescladas por mesclarPartes (que reusa a MESMA regra de
  // identidade do mergeResults) — o papel e o conjuge_de de cada parte já
  // existente viajam no próprio registro através da fusão, não são
  // reatribuídos por chave depois. O imóvel continua fundido por mergeResults.
  const handleAplicarExtracao = (data: ExtracaoResult, roles: Record<number, PessoaRole>) => {
    if (!negocio) return

    const novas = data.pessoas
      .map((p, i) => ({ pessoa: p, papel: roles[i] }))
      .filter((x): x is { pessoa: PessoaExtraida; papel: PapelParte } => x.papel !== 'ignorar')

    const imovelMerged = mergeResults([
      { pessoas: [], imovel },
      { pessoas: [], imovel: data.imovel },
    ]).imovel

    const { partes: partesMescladas, conflitosDePapel } = mesclarPartes(partes, novas)
    setPartes(partesMescladas)
    setImovel(imovelMerged)
    setDialogOpen(false)

    for (const c of conflitosDePapel) {
      toast.info(
        `${c.nome} já estava no dossiê como ${PAPEL_LABELS[c.papelMantido]}; o papel foi mantido. Troque no seletor se quiser mudar.`,
      )
    }
    toast.success('Documentos processados. Revise os dados abaixo e salve.')
  }

  const updateParte = (i: number, campo: keyof ParteNegocio, valor: string) => {
    setPartes((prev) =>
      prev.map((p, idx) => (idx === i ? ({ ...p, [campo]: valor } as ParteNegocio) : p)),
    )
  }

  const removerParte = (i: number) =>
    setPartes((prev) => {
      const removidoId = prev[i]?._id
      return prev
        .filter((_, idx) => idx !== i)
        .map((p) => (p.conjuge_de === removidoId ? { ...p, conjuge_de: undefined } : p))
    })

  const updateImovel = (campo: keyof ImovelExtraido, valor: string) =>
    setImovel((prev) => ({ ...prev, [campo]: valor }))

  const handleSalvar = async () => {
    if (!id) return
    setSalvando(true)
    try {
      // Guarda de concorrência: esta tela substitui `partes` e `imovel` INTEIROS
      // — é o editor do registro, e remover uma parte só se expressa assim. Por
      // isso ela NÃO usa patch como os documentos (ver `gravar` em
      // CarregarDeNegocio.tsx). Se o dossiê mudou em outro lugar depois que
      // carregamos, salvar agora apagaria essa mudança em silêncio. Como as
      // edições desta tela estão à vista do corretor, parar é seguro: ele
      // recarrega e refaz.
      const atual = await getNegocio(id)
      if (negocio && atual.updated !== negocio.updated) {
        toast.error(
          'Este negócio foi alterado em outro lugar depois que você abriu esta tela. Recarregue a página antes de salvar, senão o que mudou lá seria sobrescrito.',
        )
        return
      }
      const gravado = await updateNegocio(id, { partes, imovel })
      // Guarda o registro devolvido: sem isto o `updated` de referência ficaria
      // velho e o PRÓXIMO salvamento acusaria conflito com a nossa própria
      // gravação — um falso alarme a cada segundo save, do tipo que ensina o
      // corretor a ignorar o aviso.
      setNegocio(gravado)
      toast.success('Negócio salvo.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível salvar.')
    } finally {
      setSalvando(false)
    }
  }

  if (!negocio) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const vendedores = partes.filter((p) => p.papel === 'vendedor')

  return (
    <div className="w-full max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/negocios"
            className="text-sm text-muted-foreground flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="h-3 w-3" /> Negócios
          </Link>
          <h1 className="text-2xl font-bold">{negocio.titulo}</h1>
          <div className="mt-1 max-w-2xl">
            <IntroPagina
              frase="Este é o dossiê da operação: tudo que os documentos usam vem daqui. Mantenha os dados corretos e todos os documentos saem corretos."
              passos={[
                'Cadastre as partes (vendedores, compradores, anuentes) e o imóvel, ou suba os documentos e deixe a IA extrair.',
                'Todos os documentos do app leem estes dados na hora de gerar.',
                'Uma correção feita aqui vale para todos os próximos documentos deste negócio.',
              ]}
            />
          </div>
        </div>
        <Button onClick={handleSalvar} disabled={salvando}>
          {salvando ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Salvar
        </Button>
      </div>

      <Button variant="outline" onClick={() => setDialogOpen(true)} className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Adicionar documentos (escritura, RG, CNH...)
      </Button>
      <p className="text-xs text-muted-foreground -mt-4">
        Os arquivos são lidos e descartados. Só os dados extraídos e revisados ficam salvos.
      </p>

      <div className="space-y-3">
        <h2 className="font-semibold flex items-center gap-2">
          <User className="h-4 w-4 text-primary" /> Partes ({partes.length})
        </h2>
        {!partes.length && (
          <Card className="p-6 text-center text-sm text-muted-foreground">
            Nenhuma parte ainda. Adicione documentos acima.
          </Card>
        )}
        {partes.map((p, i) => (
          <Card key={p._id} className="p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Select value={p.papel} onValueChange={(v) => updateParte(i, 'papel', v)}>
                <SelectTrigger className="w-44 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PAPEL_LABELS).map(([val, label]) => (
                    <SelectItem key={val} value={val}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {p.papel === 'anuente' && (
                <Select
                  value={p.conjuge_de || ''}
                  onValueChange={(v) => updateParte(i, 'conjuge_de', v)}
                >
                  <SelectTrigger className="flex-1 h-8">
                    <SelectValue placeholder="Cônjuge de..." />
                  </SelectTrigger>
                  <SelectContent>
                    {vendedores.map((v) => (
                      <SelectItem key={v._id} value={v._id}>
                        {v.nome || '(sem nome)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Button
                size="icon"
                variant="ghost"
                className="ml-auto"
                onClick={() => removerParte(i)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Input
                placeholder="Nome"
                value={p.nome}
                onChange={(e) => updateParte(i, 'nome', e.target.value)}
              />
              <Input
                placeholder="CPF"
                value={p.cpf}
                onChange={(e) => updateParte(i, 'cpf', e.target.value)}
              />
              <Input
                placeholder="RG"
                value={p.rg}
                onChange={(e) => updateParte(i, 'rg', e.target.value)}
              />
              <Input
                placeholder="Órgão emissor"
                value={p.orgao_emissor}
                onChange={(e) => updateParte(i, 'orgao_emissor', e.target.value)}
              />
              <Input
                placeholder="Nacionalidade"
                value={p.nacionalidade}
                onChange={(e) => updateParte(i, 'nacionalidade', e.target.value)}
              />
              <Input
                placeholder="Profissão"
                value={p.profissao}
                onChange={(e) => updateParte(i, 'profissao', e.target.value)}
              />
              <Input
                placeholder="Estado civil"
                value={p.estado_civil}
                onChange={(e) => updateParte(i, 'estado_civil', e.target.value)}
              />
              <Input
                placeholder="Regime de bens"
                value={p.regime_bens}
                onChange={(e) => updateParte(i, 'regime_bens', e.target.value)}
              />
              <Input
                placeholder="Endereço"
                value={p.endereco}
                onChange={(e) => updateParte(i, 'endereco', e.target.value)}
                className="md:col-span-2"
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" /> Imóvel
        </h2>
        <Card className="p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Input
              placeholder="Descrição"
              value={imovel.descricao}
              onChange={(e) => updateImovel('descricao', e.target.value)}
              className="md:col-span-2"
            />
            <Input
              placeholder="Endereço"
              value={imovel.endereco}
              onChange={(e) => updateImovel('endereco', e.target.value)}
              className="md:col-span-2"
            />
            <Input
              placeholder="Bairro"
              value={imovel.bairro}
              onChange={(e) => updateImovel('bairro', e.target.value)}
            />
            <Input
              placeholder="Cidade"
              value={imovel.cidade}
              onChange={(e) => updateImovel('cidade', e.target.value)}
            />
            <Input
              placeholder="UF"
              value={imovel.uf}
              onChange={(e) => updateImovel('uf', e.target.value)}
            />
            <Input
              placeholder="CEP"
              value={imovel.cep}
              onChange={(e) => updateImovel('cep', e.target.value)}
            />
            <Input
              placeholder="Matrícula"
              value={imovel.matricula}
              onChange={(e) => updateImovel('matricula', e.target.value)}
            />
            <Input
              placeholder="RGI"
              value={imovel.rgi}
              onChange={(e) => updateImovel('rgi', e.target.value)}
            />
            <Input
              placeholder="IPTU"
              value={imovel.iptu}
              onChange={(e) => updateImovel('iptu', e.target.value)}
            />
            <Input
              placeholder="Fração ideal"
              value={imovel.fracao_ideal}
              onChange={(e) => updateImovel('fracao_ideal', e.target.value)}
            />
            <Input
              placeholder="Vagas (qtd)"
              value={imovel.vagas_qtd}
              onChange={(e) => updateImovel('vagas_qtd', e.target.value)}
            />
            <Input
              placeholder="Vagas (descrição)"
              value={imovel.vagas_descricao}
              onChange={(e) => updateImovel('vagas_descricao', e.target.value)}
            />
            <Input
              placeholder="Origem da aquisição"
              value={imovel.origem_aquisicao}
              onChange={(e) => updateImovel('origem_aquisicao', e.target.value)}
              className="md:col-span-2"
            />
            <Input
              placeholder="Origem do registro"
              value={imovel.origem_registro}
              onChange={(e) => updateImovel('origem_registro', e.target.value)}
              className="md:col-span-2"
            />
          </div>
        </Card>
      </div>

      <AutoPreencherDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onApply={handleAplicarExtracao}
      />
    </div>
  )
}
