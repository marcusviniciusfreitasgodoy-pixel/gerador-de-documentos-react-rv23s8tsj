import { useState, useEffect, useRef } from 'react'
import { useForm, useFieldArray, useWatch, type Control } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Loader2,
  Download,
  User,
  UserCheck,
  Building2,
  Home,
  DollarSign,
  Repeat,
  Scale,
  Settings2,
  FileSearch,
  Plus,
  Trash2,
  HeartHandshake,
} from 'lucide-react'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { BotaoDadosTeste } from '@/components/Layout'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { maskCurrency, maskCpfCnpj, maskCep } from '@/lib/utils'
import {
  permutaSchema,
  type PermutaValues,
  permutaMockData,
  permutaEmptyData,
  emptyParty,
} from '@/lib/permutaHelpers'
import { buildPermutaTemplateData } from '@/lib/permutaTemplate'
import { generatePermutaDocx, getPermutaText } from '@/lib/permutaDocx'
import { ARRAS_OPTIONS, getArrasResumo, regimeSeAplica } from '@/lib/form-helpers'
import { getBrokerProfile, getBrokerDisplay } from '@/services/broker-profile'
import { CompromissoPartySection } from '@/components/CompromissoPartySection'
import {
  CarregarDeNegocio,
  DocumentoGerado,
  useFormDraft,
  useNegocioSync,
} from '@/components/CarregarDeNegocio'
import type { ResultadoVolta } from '@/lib/aplicar-negocio'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

// C4: fora do componente para estabilidade de referência — um array literal
// inline em cada render anularia a memoização de `calcular` dentro de
// useNegocioSync.
const GRUPOS_PERMUTA = ['primeiros', 'segundos', 'anuentes'] as const

const Checkbox = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <input
    type="checkbox"
    className="h-4 w-4 accent-[var(--primary)]"
    checked={checked}
    onChange={(e) => onChange(e.target.checked)}
  />
)

function ImovelSection({
  control,
  prefix,
  titulo,
}: {
  control: Control<PermutaValues>
  prefix: 'imovel_a' | 'imovel_b'
  titulo: string
}) {
  const f = (n: string) => `${prefix}.${n}` as any
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Home className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-primary">{titulo}</h3>
      </div>
      <Separator />
      <FormField
        control={control}
        name={f('descricao')}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição *</FormLabel>
            <FormControl>
              <Textarea
                rows={2}
                className="resize-none"
                placeholder="Ex: Apartamento nº 101 do Edifício Solar"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name={f('endereco')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={f('bairro')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={f('cidade')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={f('uf')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>UF *</FormLabel>
              <FormControl>
                <Input maxLength={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={f('cep')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP</FormLabel>
              <FormControl>
                <Input
                  placeholder="00000-000"
                  value={field.value || ''}
                  onChange={(e) => field.onChange(maskCep(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={f('fracao_ideal')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fração Ideal</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={f('vagas_qtd')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qtd. Vagas</FormLabel>
              <FormControl>
                <Input type="number" min={0} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={f('vagas_descricao')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Desc. Vagas</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={f('rgi')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>RGI (Cartório)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={f('matricula')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Matrícula *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={f('iptu')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>IPTU</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

export function PermutaForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [brokerLoaded, setBrokerLoaded] = useState(false)
  const [hasBroker, setHasBroker] = useState(false)
  const navigate = useNavigate()
  // Fase 4: tela de sucesso + re-aplicar negócio no "Gerar outro deste negócio".
  const [gerado, setGerado] = useState(false)
  const reaplicarNegocioRef = useRef<(() => void) | null>(null)

  const form = useForm<PermutaValues>({
    resolver: zodResolver(permutaSchema),
    defaultValues: permutaEmptyData,
  })
  const { control, setValue, getValues } = form

  // Fase 2b: autosalva o rascunho e oferece recuperar ao voltar (F5 / fechar aba).
  const { limparRascunho } = useFormDraft(form, 'permuta')
  // C4: volta pro dossiê — registra o Negócio carregado, calcula o diff no
  // submit e grava a confirmação do corretor.
  const { registrarNegocio, calcular, gravar, negocioAtual } = useNegocioSync(form, GRUPOS_PERMUTA)
  const [voltaPendente, setVoltaPendente] = useState<ResultadoVolta | null>(null)
  const ctrl = control as any

  const primeiroFA = useFieldArray({ control, name: 'primeiros' })
  const segundoFA = useFieldArray({ control, name: 'segundos' })
  const anuenteFA = useFieldArray({ control, name: 'anuentes' })

  // C3: guarda o perfil do corretor para RE-APLICAR depois de cada reset. Antes,
  // o broker era escrito uma unica vez no useEffect de carga e qualquer
  // form.reset() o apagava para sempre — o contrato saia com a clausula de
  // corretagem em branco ("devida a , inscrito(a) no , CRECI ,").
  const brokerRef = useRef<{
    nome: string
    documento: string
    creci: string
    pix: string
    rate?: number
  } | null>(null)
  const aplicarBroker = () => {
    const b = brokerRef.current
    if (!b) return
    setValue('comissao_beneficiario', b.nome)
    setValue('comissao_documento', b.documento)
    setValue('comissao_creci', b.creci)
    setValue('comissao_pix', b.pix)
    if (b.rate) setValue('comissao_percentual', String(b.rate))
  }

  useEffect(() => {
    let cancelled = false
    getBrokerProfile()
      .then((profile) => {
        if (cancelled) return
        const display = getBrokerDisplay(profile)
        if (display) {
          setHasBroker(true)
          brokerRef.current = { ...display }
          aplicarBroker()
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setBrokerLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [setValue])

  const primeirosW = (useWatch({ control, name: 'primeiros' }) as PermutaValues['primeiros']) || []
  const segundosW = (useWatch({ control, name: 'segundos' }) as PermutaValues['segundos']) || []
  const temTorna = useWatch({ control, name: 'tem_torna' })
  const tornaAPrazo = useWatch({ control, name: 'torna_a_prazo' })

  const requiresConsent = (regime?: string) =>
    regime === 'Comunhão parcial' || regime === 'Comunhão universal'

  const addConjugeAnuente = (nome: string, regime?: string, nac?: string, end?: string) => {
    const anuentesNow = (getValues('anuentes') || []) as { conjuge_de?: string }[]
    if (nome && anuentesNow.some((a) => a.conjuge_de === nome)) {
      toast.info('Este cônjuge já está listado como anuente.')
      return
    }
    anuenteFA.append({
      ...emptyParty,
      conjuge_de: nome || '',
      estado_civil: 'Casado(a)',
      regime_bens: regime || '',
      nacionalidade: nac || 'brasileiro(a)',
      endereco: end || '',
    })
    toast.success('Cônjuge adicionado como anuente. Preencha os dados dele(a).')
  }

  // Outorga conjugal automática (CAS002): quando um permutante fica Casado em regime de
  // comunhão e tem nome preenchido, cria o bloco do cônjuge-anuente automaticamente.
  // O ref-guard garante que só adiciona 1x por parte (não re-adiciona se você remover).
  const autoLinkedRef = useRef<Set<string>>(new Set())
  useEffect(() => {
    const anuentesNow = (getValues('anuentes') || []) as { conjuge_de?: string }[]
    const groups: [string, PermutaValues['primeiros']][] = [
      ['primeiros', primeirosW],
      ['segundos', segundosW],
    ]
    for (const [which, list] of groups) {
      list.forEach((p, i) => {
        const key = `${which}.${i}:${p?.nome || ''}`
        if (
          regimeSeAplica(p?.estado_civil) &&
          requiresConsent(p?.regime_bens) &&
          p?.nome &&
          !autoLinkedRef.current.has(key) &&
          !anuentesNow.some((a) => a.conjuge_de === p.nome)
        ) {
          autoLinkedRef.current.add(key)
          anuenteFA.append({
            ...emptyParty,
            conjuge_de: p.nome,
            estado_civil: 'Casado(a)',
            regime_bens: p.regime_bens || '',
            nacionalidade: p.nacionalidade || 'brasileiro(a)',
            endereco: p.endereco || '',
          })
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primeirosW, segundosW])

  const onSubmit = async (data: PermutaValues) => {
    setIsGenerating(true)
    try {
      await generatePermutaDocx(buildPermutaTemplateData(data))
      toast.success('Documento gerado com sucesso!')
      setGerado(true)
      // C4: o documento JÁ saiu. Só agora oferecemos atualizar o dossiê —
      // se isto falhar, o corretor não perde o trabalho.
      setVoltaPendente(calcular())
      limparRascunho()
    } catch (error) {
      console.error('Erro ao gerar documento:', error)
      toast.error('Ocorreu um erro ao gerar o documento.')
    } finally {
      setIsGenerating(false)
    }
  }

  const onValidate = async () => {
    setIsValidating(true)
    try {
      const texto = await getPermutaText(buildPermutaTemplateData(getValues()))
      navigate('/validar', { state: { texto, tipo: 'Permuta' } })
    } catch (error) {
      console.error('Erro ao preparar validação:', error)
      toast.error('Não foi possível preparar a validação.')
    } finally {
      setIsValidating(false)
    }
  }

  const renderParty = (
    which: 'primeiros' | 'segundos',
    fa: any,
    watched: PermutaValues['primeiros'],
    label: string,
  ) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <User className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-primary">{label}</h3>
      </div>
      <Separator />
      {fa.fields.map((f, i) => (
        <div key={f.id} className="rounded-lg border border-border/60 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground">
              {label} {i + 1}
            </span>
            {fa.fields.length > 1 && (
              <Button type="button" variant="ghost" size="icon" onClick={() => fa.remove(i)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <CompromissoPartySection
            control={ctrl}
            prefix={`${which}.${i}`}
            sep="."
            title={`Dados: ${label} ${i + 1}`}
            icon={<User className="h-5 w-5 text-primary" />}
          />
          {regimeSeAplica(watched[i]?.estado_civil) && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-2">
              <p className="text-sm font-medium text-primary flex items-center gap-1.5">
                <HeartHandshake className="h-4 w-4" /> Participação do cônjuge/companheiro
              </p>
              <p className="text-xs text-muted-foreground">
                {requiresConsent(watched[i]?.regime_bens)
                  ? 'Regime de comunhão: o cônjuge foi adicionado automaticamente como ANUENTE abaixo (basta preencher os dados dele[a]). Se preferir, inclua-o como co-permutante na lista.'
                  : 'A anuência do cônjuge pode ser exigida. Se aplicável, inclua-o como anuente.'}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  addConjugeAnuente(
                    watched[i]?.nome,
                    watched[i]?.regime_bens,
                    watched[i]?.nacionalidade,
                    watched[i]?.endereco,
                  )
                }
              >
                <Plus className="mr-1 h-3 w-3" /> Cônjuge/companheiro como anuente
              </Button>
            </div>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => fa.append({ ...emptyParty })}
      >
        <Plus className="mr-1 h-4 w-4" /> Adicionar {label.toLowerCase()}
      </Button>
    </div>
  )

  const handleGerarOutro = () => {
    form.reset()
    reaplicarNegocioRef.current?.()
    aplicarBroker()
    limparRascunho()
    setGerado(false)
  }

  if (gerado) {
    return (
      <>
        <DocumentoGerado
          onValidar={onValidate}
          onGerarOutro={handleGerarOutro}
          validando={isValidating}
          onVoltar={() => navigate('/')}
        />
        <AlertDialog open={!!voltaPendente} onOpenChange={(o) => !o && setVoltaPendente(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Atualizar o Negócio?</AlertDialogTitle>
              <AlertDialogDescription>
                Documento gerado. Estes são os {voltaPendente?.alteracoes.length} dado(s) que você
                alterou aqui:
              </AlertDialogDescription>
            </AlertDialogHeader>
            <ul className="max-h-60 space-y-2 overflow-y-auto text-sm">
              {voltaPendente?.alteracoes.map((a, i) => (
                <li key={i} className="border-l-2 border-muted pl-3">
                  <div className="font-medium">{a.rotulo}</div>
                  <div className="text-muted-foreground">
                    <span className="line-through">{a.de || '(vazio)'}</span>
                    {' → '}
                    <span className="text-foreground">{a.para || '(vazio)'}</span>
                  </div>
                </li>
              ))}
            </ul>
            <AlertDialogFooter>
              <AlertDialogCancel>Agora não</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  const r = voltaPendente
                  setVoltaPendente(null)
                  if (!r) return
                  try {
                    await gravar(r)
                    toast.success('Negócio atualizado.')
                  } catch (e) {
                    console.error('Erro ao atualizar o Negócio:', e)
                    const mensagem = e instanceof Error ? e.message : String(e)
                    toast.error(
                      `Documento pronto, mas não consegui atualizar o Negócio. Tente pela tela do dossiê. ${mensagem}`,
                    )
                  }
                }}
              >
                Atualizar o Negócio
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CarregarDeNegocio
          form={form}
          imovel
          imovelDuplo
          replaceVendedores={primeiroFA.replace}
          replaceCompradores={segundoFA.replace}
          replaceAnuentes={anuenteFA.replace}
          onNegocioAplicado={(fn) => {
            reaplicarNegocioRef.current = fn
          }}
          onNegocioCarregado={registrarNegocio}
          negocioAtual={negocioAtual}
        />
        {brokerLoaded && !hasBroker && (
          <div className="flex items-start gap-3 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800">
            <div className="text-sm">
              <p className="font-semibold mb-1">Perfil não cadastrado</p>
              <p className="mb-2">
                Preencha seu Perfil em Meu Perfil para preencher a comissão automaticamente.
              </p>
              <Link to="/perfil" className="inline-flex items-center gap-1 font-semibold underline">
                Ir para Meu Perfil
              </Link>
            </div>
          </div>
        )}

        {renderParty('primeiros', primeiroFA, primeirosW, 'Primeiro(s) Permutante(s)')}
        {renderParty('segundos', segundoFA, segundosW, 'Segundo(s) Permutante(s)')}

        {anuenteFA.fields.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-primary">Anuentes (cônjuges que consentem)</h3>
            </div>
            <Separator />
            {anuenteFA.fields.map((f, i) => (
              <div key={f.id} className="rounded-lg border border-border/60 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">
                    Anuente {i + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => anuenteFA.remove(i)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <FormField
                  control={control}
                  name={`anuentes.${i}.conjuge_de`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cônjuge de qual permutante?</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do permutante" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <CompromissoPartySection
                  control={ctrl}
                  prefix={`anuentes.${i}`}
                  sep="."
                  title={`Dados do Anuente ${i + 1}`}
                  icon={<UserCheck className="h-5 w-5 text-primary" />}
                />
              </div>
            ))}
          </div>
        )}

        <ImovelSection
          control={control}
          prefix="imovel_a"
          titulo="Imóvel A: do Primeiro Permutante"
        />
        <ImovelSection
          control={control}
          prefix="imovel_b"
          titulo="Imóvel B: do Segundo Permutante"
        />

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Valores dos Imóveis</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="valor_a"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor do Imóvel A (R$) *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="R$ 0,00"
                      value={field.value}
                      onChange={(e) => field.onChange(maskCurrency(e.target.value))}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Valor atribuído a cada imóvel. A diferença entre os dois é a torna, e a comissão
                    incide sobre a soma.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="valor_b"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor do Imóvel B (R$) *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="R$ 0,00"
                      value={field.value}
                      onChange={(e) => field.onChange(maskCurrency(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Repeat className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Torna (diferença em dinheiro)</h3>
          </div>
          <Separator />
          <FormField
            control={control}
            name="tem_torna"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox checked={!!field.value} onChange={field.onChange} />
                </FormControl>
                <FormLabel className="!mt-0 cursor-pointer">
                  Há torna (imóveis de valores distintos)
                </FormLabel>
              </FormItem>
            )}
          />
          {temTorna && (
            <div className="rounded-lg border border-border/60 p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="torna_pagador"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quem paga a torna *</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="primeiro">Primeiro(s) Permutante(s)</SelectItem>
                          <SelectItem value="segundo">Segundo(s) Permutante(s)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Quem recebe o imóvel de maior valor paga a diferença ao outro permutante.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="torna_valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor da torna (R$) *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="R$ 0,00"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(maskCurrency(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={control}
                name="torna_a_prazo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={!!field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0 cursor-pointer">
                      Torna a prazo (parcelada)
                    </FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="torna_forma"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {tornaAPrazo ? 'Forma / parcelas *' : 'Forma de pagamento *'}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          tornaAPrazo
                            ? 'Ex: 3 parcelas mensais de R$ 50.000,00'
                            : 'Ex: transferência PIX no ato'
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {tornaAPrazo && (
                <FormField
                  control={control}
                  name="torna_garantia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Garantia da torna (opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={2}
                          className="resize-none"
                          placeholder="Ex: a escritura do IMÓVEL A só será outorgada após a quitação integral da torna"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Opcional, e só faz sentido em torna parcelada. Ex.: nota promissória,
                        alienação fiduciária do próprio imóvel.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Arras</h3>
          </div>
          <Separator />
          <FormField
            control={control}
            name="arras_tipo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Natureza das arras</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ARRAS_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* A consequência da escolha fica na tela: as arras são a
                    engenharia de risco do contrato, não uma formalidade. */}
                {field.value && (
                  <p className="text-xs leading-relaxed text-muted-foreground pt-1">
                    {getArrasResumo(field.value)}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Comissão de Corretagem</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="comissao_beneficiario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Corretor(a)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="comissao_creci"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CRECI</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="comissao_percentual"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comissão (%)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="0.1" placeholder="Ex: 6" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="comissao_responsavel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comissão a cargo de *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="primeiro">Primeiro(s) Permutante(s)</SelectItem>
                      <SelectItem value="segundo">Segundo(s) Permutante(s)</SelectItem>
                      <SelectItem value="ambos">Ambos (em partes iguais)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Quem paga a corretagem sai nominalmente na cláusula da comissão.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            A comissão em R$ é calculada automaticamente (% sobre a soma dos valores dos imóveis).
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Foro, Local e Data</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="foro_comarca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comarca do foro *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Rio de Janeiro/RJ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="cidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade (local da assinatura) *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Rio de Janeiro/RJ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="data_documento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data do Documento *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Testemunhas</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="testemunha1_nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome 1ª Testemunha</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Com duas testemunhas o contrato vira título executivo extrajudicial (art. 784,
                    III, do CPC): dá para cobrar direto, sem precisar antes provar a dívida em
                    juízo.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="testemunha1_cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF 1ª Testemunha</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="000.000.000-00"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(maskCpfCnpj(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="testemunha2_nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome 2ª Testemunha</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="testemunha2_cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF 2ª Testemunha</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="000.000.000-00"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(maskCpfCnpj(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <BotaoDadosTeste
          onClick={() => {
            form.reset(permutaMockData)
            aplicarBroker()
          }}
        />
        {/* Barra de ação FIXA: num formulário longo, Gerar/Validar ficam sempre
            alcançáveis. -mx-6/px-6 acompanham o padding do CardContent. */}
        <div className="sticky bottom-0 z-10 -mx-6 flex flex-col sm:flex-row gap-2 border-t border-border bg-card/95 px-6 py-3 backdrop-blur-sm">
          <Button
            type="submit"
            disabled={isGenerating}
            className="flex-1 h-11 text-base font-medium shadow-sm transition-all active:scale-[0.98] group"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                Gerar documento
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 sm:w-auto"
            disabled={isValidating || isGenerating}
            onClick={onValidate}
          >
            {isValidating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Preparando validação...
              </>
            ) : (
              <>
                <FileSearch className="mr-2 h-4 w-4" />
                Validar esta minuta
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
