import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Save, Sparkles, Plus, Trash2, Building2, User, Loader2 } from 'lucide-react'
import {
  getNegocio,
  updateNegocio,
  mesclarPartes,
  genId,
  type Negocio,
  type NegocioParte,
} from '@/lib/negocios'
import { AutoPreencherDialog } from '@/components/AutoPreencherDialog'
import type { ExtracaoResult, PessoaRole } from '@/lib/extraction-types'
import { emptyImovel } from '@/lib/extraction-types'

const ROLE_LABELS: Record<PessoaRole, string> = {
  vendedor: 'Vendedor(a)',
  comprador: 'Comprador(a)',
  anuente: 'Anuente',
  ignorar: 'Ignorar',
}

export default function NegocioDetalhePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [negocio, setNegocio] = useState<Negocio | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [autoOpen, setAutoOpen] = useState(false)
  const [titulo, setTitulo] = useState('')

  useEffect(() => {
    if (!id) return
    getNegocio(id)
      .then((n) => {
        setNegocio(n)
        setTitulo(n.titulo)
      })
      .catch(() => {
        toast.error('Negócio não encontrado.')
        navigate('/negocios')
      })
      .finally(() => setLoading(false))
  }, [id, navigate])

  const updateImovel = (field: string, value: string) => {
    setNegocio((prev) => (prev ? { ...prev, imovel: { ...prev.imovel, [field]: value } } : null))
  }

  const updateParte = (idx: number, field: keyof NegocioParte, value: string) => {
    setNegocio((prev) => {
      if (!prev) return null
      const partes = [...prev.partes]
      partes[idx] = { ...partes[idx], [field]: value }
      return { ...prev, partes }
    })
  }

  const updateParteRole = (idx: number, role: PessoaRole) => {
    setNegocio((prev) => {
      if (!prev) return null
      const partes = [...prev.partes]
      partes[idx] = { ...partes[idx], role }
      return { ...prev, partes }
    })
  }

  const addParte = () => {
    setNegocio((prev) => {
      if (!prev) return null
      const novaParte: NegocioParte = {
        id: genId(),
        role: 'ignorar',
        nome: '',
        cpf: '',
        rg: '',
        orgao_emissor: '',
        nacionalidade: 'brasileiro(a)',
        estado_civil: '',
        regime_bens: '',
        profissao: '',
        endereco: '',
        email: '',
        _confianca: 'baixa',
        _fonte: 'manual',
        conjuge_de: '',
      }
      return { ...prev, partes: [...prev.partes, novaParte] }
    })
  }

  const removeParte = (idx: number) => {
    setNegocio((prev) => {
      if (!prev) return null
      return { ...prev, partes: prev.partes.filter((_, i) => i !== idx) }
    })
  }

  const handleAutoApply = (data: ExtracaoResult, roles: Record<number, PessoaRole>) => {
    setNegocio((prev) => {
      if (!prev) return null
      const novasPartes = mesclarPartes(prev.partes, data.pessoas, roles)
      const imovel = { ...prev.imovel }
      const imovelKeys = Object.keys(emptyImovel) as (keyof typeof emptyImovel)[]
      for (const key of imovelKeys) {
        if (key === '_confianca') continue
        if (!imovel[key] && data.imovel[key]) {
          ;(imovel as any)[key] = (data.imovel as any)[key]
        }
      }
      return { ...prev, partes: novasPartes, imovel }
    })
    toast.success('Dados extraídos integrados ao negócio.')
  }

  const handleSave = async () => {
    if (!negocio || !id) return
    setSaving(true)
    try {
      await updateNegocio(id, {
        titulo,
        partes: negocio.partes,
        imovel: negocio.imovel,
      })
      toast.success('Negócio salvo!')
    } catch {
      toast.error('Erro ao salvar negócio.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!negocio) return null

  const imovelFields: { key: string; label: string; full?: boolean }[] = [
    { key: 'endereco', label: 'Endereço', full: true },
    { key: 'bairro', label: 'Bairro' },
    { key: 'cidade', label: 'Cidade' },
    { key: 'uf', label: 'UF' },
    { key: 'cep', label: 'CEP' },
    { key: 'matricula', label: 'Matrícula' },
    { key: 'rgi', label: 'RGI' },
    { key: 'iptu', label: 'IPTU' },
    { key: 'fracao_ideal', label: 'Fração Ideal' },
    { key: 'vagas_qtd', label: 'Qtd. Vagas' },
    { key: 'vagas_descricao', label: 'Desc. Vagas' },
    { key: 'origem_aquisicao', label: 'Origem da Aquisição' },
    { key: 'origem_registro', label: 'Registro de Origem', full: true },
  ]

  const parteFields: { key: keyof NegocioParte; label: string; full?: boolean }[] = [
    { key: 'nome', label: 'Nome' },
    { key: 'cpf', label: 'CPF' },
    { key: 'rg', label: 'RG' },
    { key: 'nacionalidade', label: 'Nacionalidade' },
    { key: 'estado_civil', label: 'Estado Civil' },
    { key: 'regime_bens', label: 'Regime de Bens' },
    { key: 'profissao', label: 'Profissão' },
    { key: 'email', label: 'E-mail' },
    { key: 'endereco', label: 'Endereço', full: true },
  ]

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate('/negocios')}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Salvando...
            </>
          ) : (
            <>
              <Save className="mr-1 h-4 w-4" /> Salvar
            </>
          )}
        </Button>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-lg">Título do Negócio</CardTitle>
        </CardHeader>
        <CardContent>
          <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full" onClick={() => setAutoOpen(true)}>
        <Sparkles className="mr-2 h-4 w-4" /> Auto-Preencher a partir de Documentos
      </Button>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" /> Dados do Imóvel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Descrição do imóvel"
            className="resize-none"
            rows={2}
            value={negocio.imovel.descricao}
            onChange={(e) => updateImovel('descricao', e.target.value)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {imovelFields.map((f) => (
              <Input
                key={f.key}
                placeholder={f.label}
                value={(negocio.imovel as any)[f.key] || ''}
                onChange={(e) => updateImovel(f.key, e.target.value)}
                className={f.full ? 'md:col-span-2' : ''}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Partes Envolvidas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {negocio.partes.map((p, i) => (
            <div key={p.id} className="rounded-lg border border-border/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground">Parte {i + 1}</span>
                <div className="flex items-center gap-2">
                  <Select value={p.role} onValueChange={(v) => updateParteRole(i, v as PessoaRole)}>
                    <SelectTrigger className="w-36 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ROLE_LABELS).map(([val, label]) => (
                        <SelectItem key={val} value={val}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => removeParte(i)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {parteFields.map((f) => (
                  <Input
                    key={f.key}
                    placeholder={f.label}
                    value={(p as any)[f.key] || ''}
                    onChange={(e) => updateParte(i, f.key, e.target.value)}
                    className={f.full ? 'md:col-span-2' : ''}
                  />
                ))}
              </div>
              {p.role === 'anuente' && (
                <Select
                  value={p.conjuge_de || 'none'}
                  onValueChange={(v) => updateParte(i, 'conjuge_de', v === 'none' ? '' : v)}
                >
                  <SelectTrigger className="w-full h-8">
                    <SelectValue placeholder="Cônjuge de qual parte?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    {negocio.partes
                      .filter((other) => other.id !== p.id && other.role !== 'ignorar')
                      .map((other) => (
                        <SelectItem key={other.id} value={other.id}>
                          {other.nome || `Parte ${negocio.partes.indexOf(other) + 1}`}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
          <Button variant="outline" className="w-full" onClick={addParte}>
            <Plus className="mr-1 h-4 w-4" /> Adicionar parte
          </Button>
        </CardContent>
      </Card>

      <Button
        onClick={handleSave}
        disabled={saving}
        className="w-full h-12 text-base font-medium shadow-sm transition-all active:scale-[0.98] group"
      >
        {saving ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Salvando...
          </>
        ) : (
          <>
            <Save className="mr-2 h-5 w-5 group-hover:animate-bounce" />
            Salvar Negócio
          </>
        )}
      </Button>

      <AutoPreencherDialog open={autoOpen} onOpenChange={setAutoOpen} onApply={handleAutoApply} />
    </div>
  )
}
