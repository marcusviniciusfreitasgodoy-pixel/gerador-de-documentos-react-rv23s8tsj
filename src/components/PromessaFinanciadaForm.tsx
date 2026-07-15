import { useState, useEffect, useMemo, useRef } from 'react'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Loader2,
  Download,
  Wand2,
  User,
  UserCheck,
  Building2,
  DollarSign,
  Landmark,
  Settings2,
  Users,
  AlertCircle,
  FileSearch,
  Plus,
  Trash2,
  HeartHandshake,
} from 'lucide-react'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
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
import { Switch } from '@/components/ui/switch'
import { maskCurrency, maskCpfCnpj, maskCep } from '@/lib/utils'
import { parseCurrency, formatCurrency, cleanCurrencyMask } from '@/lib/form-helpers'
import {
  promessaFinanciadaSchema,
  type PromessaFinanciadaValues,
  promessaFinanciadaMockData,
  emptyParty,
  FORMA_PAGAMENTO_OPTIONS,
  COMISSAO_RESPONSAVEL_OPTIONS,
} from '@/lib/promessaFinanciadaHelpers'
import { buildPromessaFinanciadaTemplateData } from '@/lib/promessaFinanciadaTemplate'
import {
  generatePromessaFinanciadaDocx,
  getPromessaFinanciadaText,
} from '@/lib/promessaFinanciadaDocx'
import { getBrokerProfile, getBrokerDisplay } from '@/services/broker-profile'
import { CompromissoPartySection } from '@/components/CompromissoPartySection'
import { CarregarDeNegocio } from '@/components/CarregarDeNegocio'

function sugerirPapel(regime?: string): string {
  if (regime === 'Comunh√£o universal')
    return 'Sugerido: CO-VENDEDOR (comunh√£o universal ‚Äî o c√¥njuge √© meeiro do im√≥vel).'
  if (regime === 'Separa√ß√£o total')
    return 'Separa√ß√£o total: em regra dispensa a outorga (art. 1.647). Inclua o c√¥njuge s√≥ se quiser refor√ßo.'
  if (regime === 'Comunh√£o parcial')
    return 'Comunh√£o parcial: im√≥vel adquirido DEPOIS do casamento ‚Üí co-vendedor; adquirido ANTES (bem particular) ‚Üí anuente.'
  return 'Selecione o regime de bens para a sugest√£o. Na d√∫vida, inclua o c√¥njuge como anuente.'
}

export function PromessaFinanciadaForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [brokerLoaded, setBrokerLoaded] = useState(false)
  const [hasBroker, setHasBroker] = useState(false)
  const navigate = useNavigate()

  const form = useForm<PromessaFinanciadaValues>({
    resolver: zodResolver(promessaFinanciadaSchema),
    defaultValues: promessaFinanciadaMockData,
  })
  const { control, setValue, getValues } = form
  const ctrl = control as any

  const {
    fields: vendedorFields,
    append: appendVendedor,
    remove: removeVendedor,
    replace: replaceVendedores,
  } = useFieldArray({ control, name: 'vendedores' })
  const {
    fields: anuenteFields,
    append: appendAnuente,
    remove: removeAnuente,
    replace: replaceAnuentes,
  } = useFieldArray({ control, name: 'anuentes' })
  const {
    fields: compradorFields,
    append: appendComprador,
    remove: removeComprador,
    replace: replaceCompradores,
  } = useFieldArray({ control, name: 'compradores' })

  useEffect(() => {
    let cancelled = false
    getBrokerProfile()
      .then((profile) => {
        if (cancelled) return
        const display = getBrokerDisplay(profile)
        if (display) {
          setHasBroker(true)
          setValue('comissao_beneficiario', display.nome)
          setValue('comissao_documento', display.documento)
          setValue('comissao_creci', display.creci)
          setValue('comissao_pix', display.pix)
          if (profile?.commission_rate) {
            setValue('comissao_percentual', String(profile.commission_rate))
          }
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

  const valorTotal = useWatch({ control, name: 'valor_total' })
  const comissaoPct = useWatch({ control, name: 'comissao_percentual' })
  const entradaParcelada = useWatch({ control, name: 'entrada_parcelada' })
  const quitaDivida = useWatch({ control, name: 'quita_divida_existente' })
  const usaFgts = useWatch({ control, name: 'usa_fgts' })
  const vendedoresW =
    (useWatch({ control, name: 'vendedores' }) as PromessaFinanciadaValues['vendedores']) || []

  const comissaoValor = useMemo(() => {
    const t = parseCurrency(valorTotal || '')
    const pct = parseFloat(comissaoPct || '0') || 0
    return t * (pct / 100)
  }, [valorTotal, comissaoPct])

  const fmt = (v: number) => cleanCurrencyMask(formatCurrency(v))

  const addConjugeCoVendedor = (i: number) => {
    const v = getValues(`vendedores.${i}`)
    appendVendedor({
      ...emptyParty,
      estado_civil: 'Casado(a)',
      regime_bens: v?.regime_bens || '',
      nacionalidade: v?.nacionalidade || 'brasileiro(a)',
      endereco: v?.endereco || '',
    })
    toast.success('C√¥njuge adicionado como co-vendedor. Preencha os dados dele(a).')
  }

  const addConjugeAnuente = (i: number) => {
    const v = getValues(`vendedores.${i}`)
    appendAnuente({
      ...emptyParty,
      conjuge_de: v?.nome || '',
      estado_civil: 'Casado(a)',
      regime_bens: v?.regime_bens || '',
      nacionalidade: v?.nacionalidade || 'brasileiro(a)',
      endereco: v?.endereco || '',
    })
    toast.success('C√¥njuge adicionado como anuente. Preencha os dados dele(a).')
  }

  // Outorga conjugal autom√°tica (CAS002): vendedor Casado em regime de comunh√£o + com nome
  // preenchido -> cria o bloco do c√¥njuge-anuente automaticamente (1x por parte, via ref-guard).
  const autoLinkedRef = useRef<Set<string>>(new Set())
  useEffect(() => {
    const anuentesNow = (getValues('anuentes') || []) as { conjuge_de?: string }[]
    vendedoresW.forEach((v, i) => {
      const key = `${i}:${v?.nome || ''}`
      if (
        v?.estado_civil === 'Casado(a)' &&
        (v?.regime_bens === 'Comunh√£o parcial' || v?.regime_bens === 'Comunh√£o universal') &&
        v?.nome &&
        !autoLinkedRef.current.has(key) &&
        !anuentesNow.some((a) => a.conjuge_de === v.nome)
      ) {
        autoLinkedRef.current.add(key)
        appendAnuente({
          ...emptyParty,
          conjuge_de: v.nome,
          estado_civil: 'Casado(a)',
          regime_bens: v.regime_bens || '',
          nacionalidade: v.nacionalidade || 'brasileiro(a)',
          endereco: v.endereco || '',
        })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendedoresW])

  const onSubmit = async (data: PromessaFinanciadaValues) => {
    if (!hasBroker) {
      toast.error('Preencha seu Perfil em Meu Perfil')
      return
    }
    setIsGenerating(true)
    try {
      await generatePromessaFinanciadaDocx(buildPromessaFinanciadaTemplateData(data))
      toast.success('Documento gerado com sucesso!')
      form.reset()
    } catch (error) {
      console.error('Erro ao gerar documento:', error)
      toast.error('Ocorreu um erro ao gerar o documento.')
    } finally {
      setIsGenerating(false)
    }
  }

  const onValidate = async () => {
    if (!hasBroker) {
      toast.error('Preencha seu Perfil em Meu Perfil')
      return
    }
    setIsValidating(true)
    try {
      const texto = await getPromessaFinanciadaText(
        buildPromessaFinanciadaTemplateData(getValues()),
      )
      navigate('/validar', { state: { texto, tipo: 'Promessa/Compromisso' } })
    } catch (error) {
      console.error('Erro ao preparar valida√ß√£o:', error)
      toast.error('N√£o foi poss√≠vel preparar a valida√ß√£o.')
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CarregarDeNegocio
          form={form}
          imovel={true}
          replaceVendedores={replaceVendedores}
          replaceCompradores={replaceCompradores}
          replaceAnuentes={replaceAnuentes}
        />
        {brokerLoaded && !hasBroker && (
          <div className="flex items-start gap-3 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800 animate-fade-in-up">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1">Perfil n√£o cadastrado</p>
              <p className="mb-2">
                Preencha seu Perfil em Meu Perfil para preencher automaticamente os dados de
                comiss√£o.
              </p>
              <Link
                to="/perfil"
                className="inline-flex items-center gap-1 font-semibold underline hover:text-yellow-900"
              >
                Ir para Meu Perfil
              </Link>
            </div>
          </div>
        )}

        {/* VENDEDORES */}
        <div className="space-y-4">
          {vendedorFields.map((f, i) => (
            <div key={f.id} className="rounded-lg border border-border/60 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground">
                  Vendedor(a) {i + 1}
                </span>
                {vendedorFields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeVendedor(i)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <CompromissoPartySection
                control={ctrl}
                prefix={`vendedores.${i}`}
                sep="."
                title={`Dados do Vendedor(a) ${i + 1}`}
                icon={<User className="h-5 w-5 text-primary" />}
              />
              {vendedoresW[i]?.estado_civil === 'Casado(a)' && (
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-2">
                  <p className="text-sm font-medium text-primary flex items-center gap-1.5">
                    <HeartHandshake className="h-4 w-4" /> Participa√ß√£o do c√¥njuge deste vendedor
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {sugerirPapel(vendedoresW[i]?.regime_bens)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addConjugeCoVendedor(i)}
                    >
                      <Plus className="mr-1 h-3 w-3" /> C√¥njuge como co-vendedor
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addConjugeAnuente(i)}
                    >
                      <Plus className="mr-1 h-3 w-3" /> C√¥njuge como anuente
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => appendVendedor({ ...emptyParty })}
          >
            <Plus className="mr-1 h-4 w-4" /> Adicionar vendedor
          </Button>
        </div>

        {/* ANUENTES */}
        {anuenteFields.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-primary">Anuentes (c√¥njuges que consentem)</h3>
            </div>
            <Separator />
            {anuenteFields.map((f, i) => (
              <div key={f.id} className="rounded-lg border border-border/60 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">
                    Anuente {i + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAnuente(i)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <FormField
                  control={control}
                  name={`anuentes.${i}.conjuge_de`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>C√¥njuge de qual vendedor?</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do vendedor" {...field} />
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

        {/* COMPRADORES */}
        <div className="space-y-4">
          {compradorFields.map((f, i) => (
            <div key={f.id} className="rounded-lg border border-border/60 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground">
                  Comprador(a) {i + 1}
                </span>
                {compradorFields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeComprador(i)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <CompromissoPartySection
                control={ctrl}
                prefix={`compradores.${i}`}
                sep="."
                title={`Dados do Comprador(a) ${i + 1}`}
                icon={<User className="h-5 w-5 text-primary" />}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => appendComprador({ ...emptyParty })}
          >
            <Plus className="mr-1 h-4 w-4" /> Adicionar comprador
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Dados do Im√≥vel</h3>
          </div>
          <Separator />
          <FormField
            control={control}
            name="imovel_descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descri√ß√£o *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ex: Apartamento n¬∫ 801..."
                    className="resize-none"
                    rows={2}
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
              name="imovel_endereco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endere√ßo *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="imovel_bairro"
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
              name="imovel_cidade"
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
              name="imovel_uf"
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
              name="imovel_cep"
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
              name="imovel_fracao_ideal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fra√ß√£o Ideal</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="imovel_vagas_qtd"
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
              name="imovel_vagas_descricao"
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
              name="imovel_rgi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RGI (Cart√≥rio)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="imovel_matricula"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matr√≠cula *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="imovel_iptu"
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
            <FormField
              control={control}
              name="imovel_origem_aquisicao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Origem da Aquisi√ß√£o</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: compra e venda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={control}
            name="imovel_origem_registro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registro de Origem</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: escritura p√∫blica..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Pre√ßo e Entrada (recursos pr√≥prios)</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="valor_total"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Total (R$) *</FormLabel>
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
            <FormField
              control={control}
              name="valor_entrada"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entrada / Sinal ‚Äî Parte A (R$) *</FormLabel>
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
            <FormField
              control={control}
              name="forma_pagamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forma de Pagamento (entrada) *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FORMA_PAGAMENTO_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="dados_recebimento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dados de Pagamento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: PIX para a chave..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border/60 p-3">
            <div>
              <p className="text-sm font-medium">Entrada parcelada (refor√ßo de sinal)</p>
              <p className="text-xs text-muted-foreground">
                Ative se houver um refor√ßo com recursos pr√≥prios antes do financiamento.
              </p>
            </div>
            <FormField
              control={control}
              name="entrada_parcelada"
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>
          {entradaParcelada && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="valor_reforco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Refor√ßo ‚Äî Parte B (R$) *</FormLabel>
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
              <FormField
                control={control}
                name="prazo_reforco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data do Refor√ßo *</FormLabel>
                    <FormControl>
                      <Input type="date" value={field.value || ''} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Financiamento (saldo)</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="valor_financiamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Saldo Financiado (R$) *</FormLabel>
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
            <FormField
              control={control}
              name="instituicao_financeira"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institui√ß√£o Financeira *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Banco Ita√∫ Unibanco S.A." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="prazo_financiamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prazo p/ obter o cr√©dito (dias) *</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="prazo_liberacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prazo p/ libera√ß√£o/dep√≥sito (dias) *</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border/60 p-3">
            <div>
              <p className="text-sm font-medium">Quitar d√≠vida existente pelo banco</p>
              <p className="text-xs text-muted-foreground">
                Ative se h√° gravame/saldo devedor (aliena√ß√£o fiduci√°ria, cons√≥rcio) que o
                agente financeiro quitar√° diretamente.
              </p>
            </div>
            <FormField
              control={control}
              name="quita_divida_existente"
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>
          {quitaDivida && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="credor_divida"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credor da d√≠vida *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Ita√∫ Adm. de Cons√≥rcios Ltda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="valor_divida"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor da d√≠vida (R$) *</FormLabel>
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
          )}
          <div className="flex items-center justify-between rounded-lg border border-border/60 p-3">
            <div>
              <p className="text-sm font-medium">Usar FGTS na composi√ß√£o</p>
              <p className="text-xs text-muted-foreground">
                Ative se parte do pre√ßo ser√° paga com recursos da conta vinculada do FGTS.
              </p>
            </div>
            <FormField
              control={control}
              name="usa_fgts"
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>
          {usaFgts && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="valor_fgts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do FGTS (R$) *</FormLabel>
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
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Comiss√£o</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="comissao_beneficiario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Benefici√°rio</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="comissao_documento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documento (CPF/CNPJ)</FormLabel>
                  <FormControl>
                    <Input
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
              name="comissao_pix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PIX</FormLabel>
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
                  <FormLabel>Comiss√£o (%)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Comiss√£o (Calculado)</FormLabel>
              <FormControl>
                <Input disabled value={fmt(comissaoValor)} />
              </FormControl>
            </FormItem>
            <FormField
              control={control}
              name="comissao_responsavel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Respons√°vel pelo Pagamento *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COMISSAO_RESPONSAVEL_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o === 'vendedor' ? 'Vendedor(a)' : 'Comprador(a)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Prazos e Datas</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="prazo_certidoes_dias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prazo Certid√µes (dias)</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
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
                  <FormLabel>Data do Documento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="tipo_arras"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Natureza das Arras *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="confirmatoria">Confirmat√≥rias (arts. 417-419)</SelectItem>
                      <SelectItem value="penitencial">Penitenciais (art. 420)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Testemunhas</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="testemunha1_nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome 1¬™ Testemunha</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="testemunha1_cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF 1¬™ Testemunha</FormLabel>
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
                  <FormLabel>Nome 2¬™ Testemunha</FormLabel>
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
                  <FormLabel>CPF 2¬™ Testemunha</FormLabel>
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

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => form.reset(promessaFinanciadaMockData)}
        >
          <Wand2 className="mr-2 h-4 w-4" />
          Preencher dados de teste
        </Button>
        <Button
          type="submit"
          disabled={isGenerating}
          className="w-full h-12 text-base font-medium shadow-sm transition-all active:scale-[0.98] group"
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
          className="w-full"
          disabled={isValidating || isGenerating}
          onClick={onValidate}
        >
          {isValidating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Preparando valida√ß√£o...
            </>
          ) : (
            <>
              <FileSearch className="mr-2 h-4 w-4" />
              Validar esta minuta
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
