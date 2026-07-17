import { useState, useEffect, useMemo } from 'react'
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
import { CarregarDeNegocio } from '@/components/CarregarDeNegocio'

function sugerirPapel(regime?: string): string {
  if (regime === 'Comunhão universal')
    return 'Sugerido: CO-VENDEDOR (comunhão universal — o cônjuge é meeiro do imóvel).'
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
  const navigate = useNavigate()

  const form = useForm<PromessaDacaoValues>({
    resolver: zodResolver(promessaDacaoSchema),
    defaultValues: promessaDacaoEmptyData,
  })
  const { control, setValue, getValues } = form

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

  const comissaoValor = useMemo(() => {
    const t = parseCurrency(valorTotal || '')
    const pct = parseFloat(comissaoPct || '0') || 0
    return t * (pct / 100)
  }, [valorTotal, comissaoPct])

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
      const texto = await getPromessaDacaoText(buildPromessaDacaoTemplateData(form.getValues()))
      navigate('/validar', { state: { texto, tipo: 'Promessa/Compromisso' } })
    } catch (error) {
      console.error('Erro ao preparar validação:', error)
      toast.error('Não foi possível preparar a validação.')
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