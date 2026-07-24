import { useState, useEffect, useMemo, useRef } from 'react'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Loader2,
  Download,
  User,
  UserCheck,
  Building2,
  DollarSign,
  ArrowLeftRight,
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
import { Switch } from '@/components/ui/switch'
import { maskCurrency, maskCpfCnpj, maskCep } from '@/lib/utils'
import {
  parseCurrency,
  formatCurrency,
  cleanCurrencyMask,
  calcComissao,
  ARRAS_OPTIONS,
  getArrasResumo,
} from '@/lib/form-helpers'
import {
  promessaDacaoSchema,
  type PromessaDacaoValues,
  promessaDacaoMockData,
  promessaDacaoEmptyData,
  emptyParty,
  FORMA_PAGAMENTO_OPTIONS,
  COMISSAO_RESPONSAVEL_OPTIONS,
} from '@/lib/promessaDacaoHelpers'
import { buildPromessaDacaoTemplateData } from '@/lib/promessaDacaoTemplate'
import { generatePromessaDacaoDocx, getPromessaDacaoText } from '@/lib/promessaDacaoDocx'
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
const GRUPOS_DACAO = ['vendedores', 'compradores', 'anuentes'] as const

function sugerirPapel(regime?: string): string {
  if (regime === 'Comunhão universal')
    return 'Sugerido: CO-VENDEDOR (comunhão universal: o cônjuge é meeiro do imóvel).'
  if (regime === 'Separação total')
    return 'Separação total: em regra dispensa a outorga (art. 1.647). Inclua o cônjuge só se quiser reforço.'
  if (regime === 'Comunhão parcial')
    return 'Comunhão parcial: imóvel adquirido DEPOIS do casamento → co-vendedor; adquirido ANTES (bem particular) → anuente.'
  return 'Selecione o regime de bens para a sugestão. Na dúvida, inclua o cônjuge como anuente.'
}

export function PromessaDacaoForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [brokerLoaded, setBrokerLoaded] = useState(false)
  const [hasBroker, setHasBroker] = useState(false)
  // Fase 4: tela de sucesso (guarda o nome do arquivo baixado).
  const [gerado, setGerado] = useState<string | null>(null)
  // Re-aplica o negócio carregado no "Gerar outro deste negócio".
  const reaplicarNegocioRef = useRef<(() => void) | null>(null)
  const navigate = useNavigate()

  const form = useForm<PromessaDacaoValues>({
    resolver: zodResolver(promessaDacaoSchema),
    defaultValues: promessaDacaoEmptyData,
  })
  const { control, setValue, getValues } = form

  // Fase 2b: autosalva o rascunho e oferece recuperar ao voltar (F5 / fechar aba).
  const { limparRascunho } = useFormDraft(form, 'dacao')
  // C4: volta pro dossiê — registra o Negócio carregado, calcula o diff no
  // submit e grava a confirmação do corretor.
  const { registrarNegocio, calcular, gravar, negocioAtual } = useNegocioSync(form, GRUPOS_DACAO)
  const [voltaPendente, setVoltaPendente] = useState<ResultadoVolta | null>(null)

  // Foro acompanha a cidade do imóvel — e para de acompanhar assim que o corretor digita
  // nele. `dirtyFields` é o sinal: setValue sem shouldDirty não suja o campo, então o
  // auto-preenchimento nunca se confunde com uma escolha deliberada.
  const imovelCidadeForo = useWatch({ control, name: 'imovel_cidade' })
  const foroEditadoNaMao = !!form.formState.dirtyFields.foro_comarca
  useEffect(() => {
    if (!foroEditadoNaMao) setValue('foro_comarca', imovelCidadeForo || '')
  }, [imovelCidadeForo, foroEditadoNaMao, setValue])
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
          brokerRef.current = { ...display, rate: profile?.commission_rate }
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

  const valorTotal = useWatch({ control, name: 'valor_total' })
  const valorEntrada = useWatch({ control, name: 'valor_entrada' })
  const valorReforco = useWatch({ control, name: 'valor_reforco' })
  const valorDacao = useWatch({ control, name: 'valor_dacao' })
  const comissaoPct = useWatch({ control, name: 'comissao_percentual' })
  const entradaParcelada = useWatch({ control, name: 'entrada_parcelada' })

  const saldo = useMemo(() => {
    const t = parseCurrency(valorTotal || '')
    const e = parseCurrency(valorEntrada || '')
    const r = parseCurrency(valorReforco || '')
    const d = parseCurrency(valorDacao || '')
    return Math.max(0, t - e - r - d)
  }, [valorTotal, valorEntrada, valorReforco, valorDacao])

  const comissaoValor = useMemo(
    () => calcComissao(parseCurrency(valorTotal || ''), comissaoPct),
    [valorTotal, comissaoPct],
  )

  const fmt = (v: number) => cleanCurrencyMask(formatCurrency(v))

  const vendedoresW =
    (useWatch({ control, name: 'vendedores' }) as PromessaDacaoValues['vendedores']) || []

  const addConjugeCoVendedor = (i: number) => {
    const v = getValues(`vendedores.${i}`)
    appendVendedor({
      ...emptyParty,
      estado_civil: 'Casado(a)',
      regime_bens: v?.regime_bens || '',
      nacionalidade: v?.nacionalidade || 'brasileiro(a)',
      endereco: v?.endereco || '',
    })
    toast.success('Cônjuge adicionado como co-vendedor. Preencha os dados dele(a).')
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
    toast.success('Cônjuge adicionado como anuente. Preencha os dados dele(a).')
  }

  const onSubmit = async (data: PromessaDacaoValues) => {
    if (!hasBroker) {
      toast.error('Preencha seu Perfil em Meu Perfil')
      return
    }
    setIsGenerating(true)
    try {
      await generatePromessaDacaoDocx(buildPromessaDacaoTemplateData(data))
      toast.success('Documento gerado com sucesso!')
      setGerado('promessa-de-compra-e-venda-dacao.docx')
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
    if (!hasBroker) {
      toast.error('Preencha seu Perfil em Meu Perfil')
      return
    }
    setIsValidating(true)
    try {
      const texto = await getPromessaDacaoText(buildPromessaDacaoTemplateData(form.getValues()))
      navigate('/validar', { state: { texto, tipo: 'Promessa/Compromisso' } })
    } catch (error) {
      console.error('Erro ao preparar validação:', error)
      toast.error('Não foi possível preparar a validação.')
    } finally {
      setIsValidating(false)
    }
  }

  const handleGerarOutro = () => {
    form.reset(promessaDacaoEmptyData)
    reaplicarNegocioRef.current?.()
    aplicarBroker()
    limparRascunho()
    setGerado(null)
  }

  if (gerado) {
    return (
      <>
        <DocumentoGerado
          nomeArquivo={gerado}
          onValidar={onValidate}
          onGerarOutro={handleGerarOutro}
          validando={isValidating}
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
          imovel={true}
          replaceVendedores={replaceVendedores}
          replaceCompradores={replaceCompradores}
          replaceAnuentes={replaceAnuentes}
          onNegocioAplicado={(fn) => {
            reaplicarNegocioRef.current = fn
          }}
          onNegocioCarregado={registrarNegocio}
          negocioAtual={negocioAtual}
        />
        {brokerLoaded && !hasBroker && (
          <div className="flex items-start gap-3 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800 animate-fade-in-up">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1">Perfil não cadastrado</p>
              <p className="mb-2">
                Preencha seu Perfil em Meu Perfil para preencher automaticamente os dados de
                comissão.
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
                    <HeartHandshake className="h-4 w-4" /> Participação do cônjuge deste vendedor
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
                      <Plus className="mr-1 h-3 w-3" /> Cônjuge como co-vendedor
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addConjugeAnuente(i)}
                    >
                      <Plus className="mr-1 h-3 w-3" /> Cônjuge como anuente
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
              <h3 className="font-semibold text-primary">Anuentes (cônjuges que consentem)</h3>
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
                      <FormLabel>Cônjuge de qual vendedor?</FormLabel>
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
            <h3 className="font-semibold text-primary">Dados do Imóvel</h3>
          </div>
          <Separator />
          <FormField
            control={control}
            name="imovel_descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ex: Apartamento nº 801..."
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
              name="foro_comarca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comarca do foro *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Rio de Janeiro" {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Segue a cidade do imóvel. Edite se quiser outro foro.
                  </p>
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
              name="imovel_matricula"
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
                  <FormLabel>Origem da Aquisição</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Escritura lavrada em 22/08/2007, livro 5053, fls. 158"
                      {...field}
                    />
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
                <FormLabel>Ato de Registro na Matrícula</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: R-9 (só o ato; a matrícula já foi citada)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Preço e Entrada (recursos próprios)</h3>
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
                  <FormLabel>Entrada / Sinal: Parte A (R$) *</FormLabel>
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
                  <FormLabel>Forma de Pagamento (recursos próprios) *</FormLabel>
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
              <p className="text-sm font-medium">Entrada parcelada (reforço de sinal)</p>
              <p className="text-xs text-muted-foreground">
                Ative se houver um reforço com recursos próprios.
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
                    <FormLabel>Reforço: Parte B (R$) *</FormLabel>
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
                    <FormLabel>Data do Reforço *</FormLabel>
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
            <ArrowLeftRight className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Dação em Pagamento e Saldo</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="valor_dacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da Dação (R$) *</FormLabel>
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
            <FormItem>
              <FormLabel>Saldo à vista: recursos próprios (Calculado)</FormLabel>
              <FormControl>
                <Input disabled value={fmt(saldo)} />
              </FormControl>
            </FormItem>
          </div>
          <FormField
            control={control}
            name="bem_dacao_descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bem dado em pagamento: descrição *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ex: imóvel na Av. Tim Maia nº 7285, apto 101 bl 5, matrícula 406458 do 9º RGI"
                    className="resize-none"
                    rows={2}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="data_limite_escritura"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data Limite da Escritura (saldo) *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Comissão</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="comissao_beneficiario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beneficiário</FormLabel>
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
                  <FormLabel>Comissão (%)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Comissão (Calculado)</FormLabel>
              <FormControl>
                <Input disabled value={fmt(comissaoValor)} />
              </FormControl>
            </FormItem>
            <FormField
              control={control}
              name="comissao_responsavel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsável pelo Pagamento *</FormLabel>
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
                  <FormLabel>Prazo Certidões (dias)</FormLabel>
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
                      {ARRAS_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <FormLabel>Nome 1ª Testemunha</FormLabel>
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
            form.reset(promessaDacaoMockData)
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
