import { useState, useEffect, useRef } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Loader2,
  Download,
  User,
  Building2,
  DollarSign,
  Settings2,
  AlertCircle,
  FileSearch,
} from 'lucide-react'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { BotaoDadosTeste } from '@/components/Layout'
import { CarregarDeNegocio, DocumentoGerado, useFormDraft } from '@/components/CarregarDeNegocio'
import { aplicarAutorizacao, aplicarReciboComissao, aplicarCorretagem } from '@/lib/aplicar-negocio'
import { Textarea } from '@/components/ui/textarea'
import {
  generateReciboComissaoDocx,
  getReciboComissaoText,
  generateCorretagemDocx,
  getCorretagemText,
} from '@/lib/docx-generator'
import { currencyToWords } from '@/lib/currency-to-words'
import { formatDateLower } from '@/lib/compromisso-helpers'
import { parseCurrency, formatCurrency, cleanCurrencyMask } from '@/lib/form-helpers'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { maskCurrency, maskCpfCnpj, maskPhone, maskCep } from '@/lib/utils'
import {
  intermediationSchema,
  type IntermediationValues,
  TIPO_EXCLUSIVIDADE_OPTIONS,
  intermediationMockData,
  buildIntermediationTemplateData,
  type BrokerInfo,
} from '@/lib/intermediation-helpers'
import { generateIntermediationDocx, getIntermediationText } from '@/lib/intermediation-docx'
import {
  getBrokerProfile,
  getBrokerDisplay,
  type BrokerProfile,
  type BrokerDisplay,
} from '@/services/broker-profile'

export function IntermediationForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [brokerProfile, setBrokerProfile] = useState<BrokerProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const navigate = useNavigate()
  // Fase 4: tela de sucesso + re-aplicar negócio no "Gerar outro deste negócio".
  const [gerado, setGerado] = useState(false)
  const reaplicarNegocioRef = useRef<(() => void) | null>(null)

  const form = useForm<IntermediationValues>({
    resolver: zodResolver(intermediationSchema),
    defaultValues: {
      contratante_nome: '',
      contratante_cpf: '',
      contratante_orgao_emissor: '',
      contratante_telefone: '',
      contratante_email: '',
      imovel_endereco: '',
      imovel_bairro: '',
      imovel_cidade: 'Rio de Janeiro',
      imovel_cep: '',
      imovel_condominio: '',
      imovel_iptu: '',
      imovel_vagas: '',
      imovel_quartos: '',
      valor_avaliacao: '',
      valor_venda: '',
      tipo_exclusividade: 'COM GESTÃO EXCLUSIVA',
      prazo_vigencia_dias: '90',
      comissao_percentual: '5',
      foro_comarca: 'Rio de Janeiro',
    },
  })

  const { control } = form

  // Fase 2b: autosalva o rascunho e oferece recuperar ao voltar (F5 / fechar aba).
  const { limparRascunho } = useFormDraft(form, 'intermediacao')

  // Foro acompanha a cidade do imóvel — mas para de acompanhar assim que o usuário
  // digita nele. `dirtyFields` é o sinal: setValue sem shouldDirty não suja o campo,
  // então o auto-preenchimento nunca se confunde com uma escolha do corretor.
  const imovelCidade = useWatch({ control, name: 'imovel_cidade' })
  const foroEditadoNaMao = !!form.formState.dirtyFields.foro_comarca
  useEffect(() => {
    if (!foroEditadoNaMao) form.setValue('foro_comarca', imovelCidade || '')
  }, [imovelCidade, foroEditadoNaMao, form])

  // C3: guarda a taxa do corretor para RE-APLICAR depois de cada reset — o
  // form.reset() zerava o percentual carregado do perfil e ele nunca voltava.
  const brokerRateRef = useRef<number | null>(null)
  const aplicarBroker = () => {
    if (brokerRateRef.current) {
      form.setValue('comissao_percentual', String(brokerRateRef.current))
    }
  }

  useEffect(() => {
    let cancelled = false
    const loadProfile = async () => {
      try {
        const profile = await getBrokerProfile()
        if (cancelled) return
        setBrokerProfile(profile)
        if (profile?.commission_rate) {
          brokerRateRef.current = profile.commission_rate
          aplicarBroker()
        }
      } catch {
        if (!cancelled) setBrokerProfile(null)
      } finally {
        if (!cancelled) setProfileLoading(false)
      }
    }
    loadProfile()
    return () => {
      cancelled = true
    }
  }, [form])

  const hasProfile = !!brokerProfile?.name

  const buildData = (data: IntermediationValues): Record<string, string> => {
    const isImobiliaria = brokerProfile?.tipo_perfil === 'imobiliaria'
    const broker: BrokerInfo = {
      name: isImobiliaria
        ? brokerProfile?.razao_social || brokerProfile?.name || ''
        : brokerProfile?.nome || brokerProfile?.name || '',
      document: isImobiliaria ? brokerProfile?.cnpj || '' : brokerProfile?.cpf || '',
      creci: [
        isImobiliaria
          ? brokerProfile?.creci_juridico || brokerProfile?.creci || ''
          : brokerProfile?.creci || '',
        brokerProfile?.creci_uf || '',
      ]
        .filter(Boolean)
        .join(' ')
        .trim(),
    }
    return buildIntermediationTemplateData(data, broker)
  }

  const onSubmit = async (data: IntermediationValues) => {
    if (!hasProfile) {
      toast.error('Complete seu perfil antes de gerar o documento.')
      return
    }
    setIsGenerating(true)
    try {
      await generateIntermediationDocx(buildData(data))
      toast.success('Documento gerado com sucesso!')
      setGerado(true)
      limparRascunho()
    } catch (error) {
      console.error('Erro ao gerar documento:', error)
      toast.error('Ocorreu um erro ao gerar o documento.')
    } finally {
      setIsGenerating(false)
    }
  }

  const onValidate = async () => {
    if (!hasProfile) {
      toast.error('Complete seu perfil antes de validar o documento.')
      return
    }
    setIsValidating(true)
    try {
      const texto = await getIntermediationText(buildData(form.getValues()))
      navigate('/validar', { state: { texto, tipo: 'Autorização de Intermediação' } })
    } catch (error) {
      console.error('Erro ao preparar validação:', error)
      toast.error('Não foi possível preparar a validação.')
    } finally {
      setIsValidating(false)
    }
  }

  const handleGerarOutro = () => {
    form.reset()
    reaplicarNegocioRef.current?.()
    aplicarBroker()
    limparRascunho()
    setGerado(false)
  }

  if (gerado) {
    return (
      <DocumentoGerado
        onValidar={onValidate}
        onGerarOutro={handleGerarOutro}
        validando={isValidating}
      />
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CarregarDeNegocio
          form={form}
          aplicar={(n) => aplicarAutorizacao(form.setValue, n)}
          onNegocioAplicado={(fn) => {
            reaplicarNegocioRef.current = fn
          }}
        />
        {!profileLoading && !hasProfile && (
          <div className="flex items-start gap-3 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800 animate-fade-in-up">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1">Perfil não cadastrado</p>
              <p className="mb-2">
                Você precisa preencher seu perfil profissional para que os dados do CONTRATADO sejam
                incluídos no documento.
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

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Contratante</h3>
          </div>
          <Separator />
          <FormField
            control={control}
            name="contratante_nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo *</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: João Silva" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="contratante_cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF/CNPJ *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="000.000.000-00"
                      value={field.value}
                      onChange={(e) => field.onChange(maskCpfCnpj(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="contratante_orgao_emissor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Órgão Emissor</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: DETRO/RJ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="contratante_telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(21) 99999-9999"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(maskPhone(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="contratante_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="exemplo@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Dados do Imóvel</h3>
          </div>
          <Separator />
          <FormField
            control={control}
            name="imovel_endereco"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço *</FormLabel>
                <FormControl>
                  <Input placeholder="Rua, nº, Apto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField
              control={control}
              name="imovel_condominio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condomínio (R$)</FormLabel>
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
              name="imovel_iptu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IPTU (R$)</FormLabel>
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
              name="imovel_vagas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vagas</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="imovel_quartos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quartos</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Valores</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="valor_avaliacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor de Avaliação (R$)</FormLabel>
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
              name="valor_venda"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor de Venda (R$) *</FormLabel>
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
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Condições</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={control}
              name="tipo_exclusividade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Exclusividade *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TIPO_EXCLUSIVIDADE_OPTIONS.map((o) => (
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
              name="prazo_vigencia_dias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prazo de Vigência (dias)</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
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
          </div>
        </div>

        <BotaoDadosTeste
          onClick={() => {
            form.reset(intermediationMockData)
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

// ── Recibo de Comissão de Corretagem ────────────────────────────────────────
// Mora neste arquivo por parentesco: a Autorização de Venda é onde a comissão
// é combinada, e este recibo é onde ela é quitada. (O editor do Skip não cria
// arquivo novo, então componentes irmãos dividem o mesmo arquivo.)
//
// O que o concorrente erra e aqui não: o recibo dele PROVA o recebimento mas
// não DÁ QUITAÇÃO. Sem a fórmula de quitação o documento não extingue a
// obrigação de forma inequívoca, que é a razão de existir de um recibo.
const reciboComissaoSchema = z
  .object({
    pagador_nome: z.string().min(3, 'Nome obrigatório'),
    pagador_qualificacao: z.string().min(1, 'Obrigatório'),
    pagador_documento: z.string().min(1, 'Obrigatório'),
    pagador_endereco: z.string().min(1, 'Obrigatório'),
    imovel_descricao: z.string().min(1, 'Obrigatório'),
    imovel_matricula: z.string().min(1, 'Obrigatório'),
    imovel_ri_numero: z.string().min(1, 'Obrigatório'),
    imovel_comarca: z.string().min(1, 'Obrigatório'),
    imovel_iptu: z.string().min(1, 'Obrigatório'),
    valor_recebido: z.string().refine((v) => parseCurrency(v) > 0, 'Maior que zero'),
    forma_pagamento: z.string().min(1, 'Obrigatório'),
    data_pagamento: z.string().min(1, 'Obrigatório'),
    referencia_parcela: z.string().min(1, 'Obrigatório'),
    tipo_quitacao: z.enum(['total', 'parcial']),
    valor_saldo_comissao: z.string().optional(),
    vencimento_saldo_comissao: z.string().optional(),
    valor_negocio: z.string().refine((v) => parseCurrency(v) > 0, 'Maior que zero'),
    data_negocio: z.string().min(1, 'Obrigatório'),
    data_contrato_corretagem: z.string().min(1, 'Obrigatório'),
    tem_rateio: z.enum(['nao', 'sim']),
    percentual_rateio: z.string().optional(),
    cidade_uf: z.string().min(1, 'Obrigatório'),
  })
  // Quitação parcial sem saldo declarado deixaria o corretor sem prova do que
  // ainda tem a receber: é justamente o caso em que o documento mais importa.
  .refine((d) => d.tipo_quitacao === 'total' || parseCurrency(d.valor_saldo_comissao || '') > 0, {
    message: 'Informe o saldo que ainda falta receber',
    path: ['valor_saldo_comissao'],
  })
  .refine((d) => d.tipo_quitacao === 'total' || !!d.vencimento_saldo_comissao?.trim(), {
    message: 'Informe quando o saldo será pago',
    path: ['vencimento_saldo_comissao'],
  })
  .refine((d) => d.tem_rateio === 'nao' || !!d.percentual_rateio?.trim(), {
    message: 'Informe o percentual que cabe a você',
    path: ['percentual_rateio'],
  })
  // O recibo não pode dizer que se recebeu mais do que o negócio inteiro.
  .refine((d) => parseCurrency(d.valor_recebido) <= parseCurrency(d.valor_negocio), {
    message: 'A comissão recebida não pode ser maior que o valor do negócio',
    path: ['valor_recebido'],
  })

type ReciboComissaoValues = z.infer<typeof reciboComissaoSchema>

const reciboComissaoMock: ReciboComissaoValues = {
  pagador_nome: 'Roberto Mendes Araújo',
  pagador_qualificacao: 'brasileiro, casado, médico',
  pagador_documento: '456.789.123-00',
  pagador_endereco: 'Rua Voluntários da Pátria, 200, Botafogo, Rio de Janeiro/RJ',
  imovel_descricao: 'Apartamento nº 801, Edifício Solar, 8º andar, com 2 vagas de garagem',
  imovel_matricula: '78.456',
  imovel_ri_numero: '6',
  imovel_comarca: 'Rio de Janeiro',
  imovel_iptu: '001.234.567-8',
  valor_recebido: '60.000,00',
  forma_pagamento: 'PIX',
  data_pagamento: '2026-09-23',
  referencia_parcela: 'parcela única',
  tipo_quitacao: 'total',
  valor_saldo_comissao: '',
  vencimento_saldo_comissao: '',
  valor_negocio: '1.200.000,00',
  data_negocio: '2026-07-25',
  data_contrato_corretagem: '2026-07-20',
  tem_rateio: 'nao',
  percentual_rateio: '',
  cidade_uf: 'Rio de Janeiro/RJ',
}

const reciboComissaoEmpty: ReciboComissaoValues = {
  ...reciboComissaoMock,
  pagador_nome: '',
  pagador_qualificacao: '',
  pagador_documento: '',
  pagador_endereco: '',
  imovel_descricao: '',
  imovel_matricula: '',
  imovel_ri_numero: '',
  imovel_comarca: '',
  imovel_iptu: '',
  valor_recebido: '',
  forma_pagamento: '',
  data_pagamento: '',
  referencia_parcela: 'parcela única',
  valor_saldo_comissao: '',
  vencimento_saldo_comissao: '',
  valor_negocio: '',
  data_negocio: '',
  data_contrato_corretagem: '',
  percentual_rateio: '',
  cidade_uf: '',
}

export function ReciboComissaoForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [brokerLoaded, setBrokerLoaded] = useState(false)
  const [hasBroker, setHasBroker] = useState(false)
  const [broker, setBroker] = useState<BrokerDisplay | null>(null)
  // O BrokerDisplay resume o perfil para exibicao e nao carrega endereco, que o
  // recibo precisa para qualificar quem assina. Por isso guardamos os dois.
  const [perfilCru, setPerfilCru] = useState<BrokerProfile | null>(null)
  const navigate = useNavigate()
  const [gerado, setGerado] = useState(false)
  const reaplicarNegocioRef = useRef<(() => void) | null>(null)

  const form = useForm<ReciboComissaoValues>({
    resolver: zodResolver(reciboComissaoSchema),
    defaultValues: reciboComissaoEmpty,
  })
  const { limparRascunho } = useFormDraft(form, 'recibo-comissao')

  const tipoQuitacao = useWatch({ control: form.control, name: 'tipo_quitacao' })
  const temRateio = useWatch({ control: form.control, name: 'tem_rateio' })

  useEffect(() => {
    let cancelled = false
    getBrokerProfile()
      .then((profile) => {
        if (cancelled) return
        const display = getBrokerDisplay(profile)
        if (display) {
          setHasBroker(true)
          setBroker(display)
          setPerfilCru(profile)
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setBrokerLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const buildData = (data: ReciboComissaoValues): Record<string, string> => {
    // O perfil guarda o documento ja rotulado ("CNPJ nº 58.409..."), e o recibo
    // escreve "inscrito no CPF/CNPJ sob o nº" antes dele. Sem limpar o rotulo E o
    // "nº", sai "sob o nº nº 58.409...". Mesmo defeito que o concorrente comete.
    const stripPrefix = (val: string) =>
      val
        .replace(/^\s*(CPF\/CNPJ|CPF|CNPJ)\s*/i, '')
        .replace(/^n[ºo°]?\.?\s*/i, '')
        .trim()
    const recebido = parseCurrency(data.valor_recebido)
    const negocio = parseCurrency(data.valor_negocio)
    const saldo = parseCurrency(data.valor_saldo_comissao || '')
    // A máscara devolve "R$ 30.000,00" quando o corretor digita, mas os dados de
    // teste entram sem o símbolo. Como o documento já escreve "R$" antes do
    // valor, o texto saía "R$ R$ 30.000,00". Normaliza tudo para só o número.
    const fmt = (v: number) => cleanCurrencyMask(formatCurrency(v))
    const dataBR = (iso: string) => {
      if (!iso) return ''
      const [a, m, d] = iso.split('-')
      return d && m && a ? `${d}/${m}/${a}` : iso
    }

    // Pessoa jurídica assina por um representante; pessoa física assina sozinha.
    // A vírgula final emenda no "doravante denominado" do template.
    const representacao =
      broker?.tipo === 'imobiliaria' && broker.responsavel_nome
        ? `neste ato representada por ${broker.responsavel_nome}, CPF nº ${broker.responsavel_cpf}, CRECI ${broker.responsavel_creci}, `
        : ''

    const amplitude =
      data.tipo_quitacao === 'total'
        ? 'plena, geral, rasa e irrevogável quitação da comissão de corretagem devida pela intermediação do negócio acima descrito'
        : 'quitação da parcela ora recebida, permanecendo em aberto o saldo indicado na Cláusula 3ª, sem que este recibo importe quitação da totalidade da comissão'

    const saldoTexto =
      data.tipo_quitacao === 'total'
        ? 'A comissão de corretagem encontra-se integralmente quitada, nada remanescendo a pagar a este título.'
        : `Remanesce em aberto o saldo de R$ ${fmt(saldo)} (${currencyToWords(saldo)}), a ser pago ${data.vencimento_saldo_comissao}, na forma do contrato de corretagem.`

    const rateioTexto =
      data.tem_rateio === 'nao'
        ? 'A comissão foi recebida integralmente pelo RECEBEDOR, não havendo rateio com outros corretores quanto ao valor ora quitado.'
        : `O valor ora recebido corresponde à quota-parte do RECEBEDOR na comissão, equivalente a ${data.percentual_rateio} do total, na forma ajustada entre os corretores participantes.`

    return {
      pagador_nome: data.pagador_nome,
      pagador_qualificacao: data.pagador_qualificacao,
      pagador_documento: stripPrefix(data.pagador_documento),
      pagador_endereco: data.pagador_endereco,
      imovel_descricao: data.imovel_descricao,
      imovel_matricula: data.imovel_matricula,
      imovel_ri_numero: data.imovel_ri_numero.replace(/^\D+/, '').trim(),
      imovel_comarca: data.imovel_comarca,
      imovel_iptu: data.imovel_iptu,
      valor_recebido: fmt(recebido),
      valor_recebido_extenso: currencyToWords(recebido),
      forma_pagamento: data.forma_pagamento,
      data_pagamento: dataBR(data.data_pagamento),
      referencia_parcela: data.referencia_parcela,
      amplitude_quitacao: amplitude,
      saldo_comissao: saldoTexto,
      rateio_recibo: rateioTexto,
      valor_negocio: fmt(negocio),
      valor_negocio_extenso: currencyToWords(negocio),
      data_negocio: dataBR(data.data_negocio),
      data_contrato_corretagem: dataBR(data.data_contrato_corretagem),
      cidade_uf: data.cidade_uf,
      data_extenso: formatDateLower(new Date()),
      corretor_nome: broker?.nome || '',
      corretor_documento: stripPrefix(broker?.documento || ''),
      corretor_creci: broker?.creci || '',
      corretor_endereco: [perfilCru?.endereco, perfilCru?.cidade, perfilCru?.uf]
        .filter(Boolean)
        .join(', '),
      corretor_representacao: representacao,
      broker_nome_marca: broker?.nome.toUpperCase() || '',
      broker_creci_linha: broker?.creci || '',
    }
  }

  const onSubmit = async (data: ReciboComissaoValues) => {
    if (!hasBroker) {
      toast.error('Preencha seu Perfil em Meu Perfil')
      return
    }
    setIsGenerating(true)
    try {
      await generateReciboComissaoDocx(buildData(data))
      toast.success('Documento gerado com sucesso!')
      setGerado(true)
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
      const texto = await getReciboComissaoText(buildData(form.getValues()))
      navigate('/validar', { state: { texto, tipo: 'Recibo de Comissão de Corretagem' } })
    } catch (error) {
      console.error('Erro ao preparar validação:', error)
      toast.error('Não foi possível preparar a validação.')
    } finally {
      setIsValidating(false)
    }
  }

  const handleGerarOutro = () => {
    form.reset()
    reaplicarNegocioRef.current?.()
    limparRascunho()
    setGerado(false)
  }

  if (gerado) {
    return (
      <DocumentoGerado
        onValidar={onValidate}
        onGerarOutro={handleGerarOutro}
        validando={isValidating}
      />
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CarregarDeNegocio
          form={form}
          aplicar={(n) => aplicarReciboComissao(form.setValue, n)}
          onNegocioAplicado={(fn) => {
            reaplicarNegocioRef.current = fn
          }}
        />
        {brokerLoaded && !hasBroker && (
          <div className="flex items-start gap-3 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800 animate-fade-in-up">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1">Perfil não cadastrado</p>
              <p className="mb-2">
                Quem assina o recibo é você. Preencha seu Perfil para que nome, CPF ou CNPJ, CRECI e
                PIX entrem no documento.
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

        {brokerLoaded && hasBroker && (
          <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
            <p className="font-medium text-foreground">Quem assina este recibo</p>
            <p className="text-muted-foreground mt-1">
              {broker?.nome} · {broker?.documento} · {broker?.creci}
            </p>
            <p className="text-xs text-muted-foreground/80 mt-1.5">
              Vem do seu Perfil. Para mudar, edite em Meu Perfil.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Quem pagou a comissão</h3>
          </div>
          <Separator />
          <p className="text-xs text-muted-foreground">
            Em regra a comissão é paga por quem contratou você. Se no negócio o combinado foi outro,
            troque o nome aqui.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="pagador_nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do pagador *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Roberto Mendes Araújo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pagador_documento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF ou CNPJ *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="000.000.000-00"
                      {...field}
                      onChange={(e) => field.onChange(maskCpfCnpj(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="pagador_qualificacao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qualificação *</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: brasileiro, casado, médico" {...field} />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Sai no recibo logo depois do nome, como no cabeçalho de um contrato.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pagador_endereco"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço *</FormLabel>
                <FormControl>
                  <Input placeholder="Rua, número, bairro, cidade/UF" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Imóvel</h3>
          </div>
          <Separator />
          <FormField
            control={form.control}
            name="imovel_descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição do imóvel *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ex: Apartamento nº 801, Edifício Solar, 8º andar, com 2 vagas"
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Não inclua matrícula nem inscrição do IPTU aqui: eles têm campo próprio abaixo e
                  sairiam repetidos no recibo.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="imovel_matricula"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matrícula *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 78.456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imovel_ri_numero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nº do Registro de Imóveis *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 6" {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Só o número. O recibo escreve o resto: "6º Registro de Imóveis de...".
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imovel_comarca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comarca do registro *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Rio de Janeiro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imovel_iptu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inscrição municipal (IPTU) *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 001.234.567-8" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">O que você recebeu</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="valor_recebido"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor recebido (R$) *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="60.000,00"
                      {...field}
                      onChange={(e) => field.onChange(maskCurrency(e.target.value))}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    O recibo escreve o valor por extenso sozinho.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="referencia_parcela"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>A que se refere *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: parcela única, 1ª de 2, saldo final" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="forma_pagamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forma de pagamento *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: PIX, TED, depósito" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data_pagamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data do pagamento *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="tipo_quitacao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Este recibo quita a comissão inteira? *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="total">Sim, quitação total</SelectItem>
                    <SelectItem value="parcial">Não, ainda falta receber uma parte</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Na quitação total o recibo diz que você dá plena e geral quitação, e nada mais é
                  devido. Na parcial ele registra o saldo que continua em aberto.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          {tipoQuitacao === 'parcial' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
              <FormField
                control={form.control}
                name="valor_saldo_comissao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Saldo que ainda falta (R$) *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="30.000,00"
                        {...field}
                        onChange={(e) => field.onChange(maskCurrency(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vencimento_saldo_comissao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quando o saldo será pago *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: na assinatura da escritura" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <FormField
            control={form.control}
            name="tem_rateio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>A comissão é dividida com outro corretor? *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="nao">Não, recebi o valor integral</SelectItem>
                    <SelectItem value="sim">Sim, este valor é a minha parte</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {temRateio === 'sim' && (
            <FormField
              control={form.control}
              name="percentual_rateio"
              render={({ field }) => (
                <FormItem className="animate-fade-in-up">
                  <FormLabel>Percentual que cabe a você *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 50%" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Negócio de origem</h3>
          </div>
          <Separator />
          <p className="text-xs text-muted-foreground">
            O recibo amarra a comissão ao negócio e ao contrato de corretagem que a originou. É o
            que impede a discussão futura sobre a que pagamento ele se referia.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="valor_negocio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor do negócio (R$) *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1.200.000,00"
                      {...field}
                      onChange={(e) => field.onChange(maskCurrency(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data_negocio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data do negócio *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data_contrato_corretagem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data do contrato de corretagem *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Se não houve contrato escrito, use a data da Autorização de Venda.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cidade_uf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade/UF da assinatura *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Rio de Janeiro/RJ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <BotaoDadosTeste onClick={() => form.reset(reciboComissaoMock)} />
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

// ── Contrato de Corretagem (Honorários) ─────────────────────────────────────
// Terceiro documento de comissão deste arquivo: a Autorização é onde o dono
// autoriza a venda, este é onde a remuneração é combinada, e o Recibo acima é
// onde ela é quitada. Ficam juntos porque quem mexe em comissão mexe nos três.
//
// As cláusulas 3ª e 4ª são o motivo de o documento existir e são justamente as
// que faltam no contrato do concorrente: garantem a comissão quando o resultado
// foi conseguido, ainda que o negócio não se feche por arrependimento das
// partes (art. 725) ou seja fechado por fora depois (art. 727).
const corretagemSchema = z
  .object({
    contratante_nome: z.string().min(3, 'Nome obrigatório'),
    contratante_qualificacao: z.string().min(1, 'Obrigatório'),
    contratante_rg: z.string().min(1, 'Obrigatório'),
    contratante_documento: z.string().min(1, 'Obrigatório'),
    contratante_endereco: z.string().min(1, 'Obrigatório'),
    imovel_descricao: z.string().min(1, 'Obrigatório'),
    imovel_matricula: z.string().min(1, 'Obrigatório'),
    imovel_ri_numero: z.string().min(1, 'Obrigatório'),
    imovel_comarca: z.string().min(1, 'Obrigatório'),
    imovel_iptu: z.string().min(1, 'Obrigatório'),
    tipo_negocio: z.string().min(1, 'Obrigatório'),
    valor_negocio: z.string().refine((v) => parseCurrency(v) > 0, 'Maior que zero'),
    percentual_comissao: z.string().min(1, 'Obrigatório'),
    vencimento_comissao: z.string().min(1, 'Obrigatório'),
    forma_pagamento_comissao: z.string().min(1, 'Obrigatório'),
    exclusividade: z.enum(['com', 'sem']),
    tem_rateio: z.enum(['nao', 'sim']),
    lista_rateio: z.string().optional(),
    prazo_vigencia: z.string().min(1, 'Obrigatório'),
    aviso_previo_rescisao: z.string().min(1, 'Obrigatório'),
    foro_comarca: z.string().min(1, 'Obrigatório'),
    testemunha1_nome: z.string().optional(),
    testemunha1_cpf: z.string().optional(),
    testemunha2_nome: z.string().optional(),
    testemunha2_cpf: z.string().optional(),
    cidade_uf: z.string().min(1, 'Obrigatório'),
  })
  .refine((d) => d.tem_rateio === 'nao' || !!d.lista_rateio?.trim(), {
    message: 'Liste os corretores e os percentuais',
    path: ['lista_rateio'],
  })

type CorretagemValues = z.infer<typeof corretagemSchema>

const corretagemMock: CorretagemValues = {
  contratante_nome: 'Roberto Mendes Araújo',
  contratante_qualificacao: 'brasileiro, casado, médico',
  contratante_rg: 'MG-15.234.567 SSP/MG',
  contratante_documento: '456.789.123-00',
  contratante_endereco: 'Rua Voluntários da Pátria, 200, Botafogo, Rio de Janeiro/RJ',
  imovel_descricao: 'Apartamento nº 801, Edifício Solar, 8º andar, com 2 vagas de garagem',
  imovel_matricula: '78.456',
  imovel_ri_numero: '6',
  imovel_comarca: 'Rio de Janeiro',
  imovel_iptu: '001.234.567-8',
  tipo_negocio: 'a venda do imóvel',
  valor_negocio: '1.200.000,00',
  percentual_comissao: '5%',
  vencimento_comissao: 'no ato do recebimento do saldo do preço pelo CONTRATANTE',
  forma_pagamento_comissao: 'PIX',
  exclusividade: 'com',
  tem_rateio: 'nao',
  lista_rateio: '',
  prazo_vigencia: '90 (noventa) dias',
  aviso_previo_rescisao: '15 (quinze) dias',
  foro_comarca: 'Rio de Janeiro',
  testemunha1_nome: 'Pedro Alves Lima',
  testemunha1_cpf: '111.222.333-44',
  testemunha2_nome: 'Maria Fernanda Rocha',
  testemunha2_cpf: '555.666.777-88',
  cidade_uf: 'Rio de Janeiro/RJ',
}

const corretagemEmpty: CorretagemValues = {
  ...corretagemMock,
  contratante_nome: '',
  contratante_qualificacao: '',
  contratante_rg: '',
  contratante_documento: '',
  contratante_endereco: '',
  imovel_descricao: '',
  imovel_matricula: '',
  imovel_ri_numero: '',
  imovel_comarca: '',
  imovel_iptu: '',
  valor_negocio: '',
  foro_comarca: '',
  testemunha1_nome: '',
  testemunha1_cpf: '',
  testemunha2_nome: '',
  testemunha2_cpf: '',
  cidade_uf: '',
}

export function CorretagemForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [brokerLoaded, setBrokerLoaded] = useState(false)
  const [hasBroker, setHasBroker] = useState(false)
  const [broker, setBroker] = useState<BrokerDisplay | null>(null)
  const [perfilCru, setPerfilCru] = useState<BrokerProfile | null>(null)
  const navigate = useNavigate()
  const [gerado, setGerado] = useState(false)
  const reaplicarNegocioRef = useRef<(() => void) | null>(null)

  const form = useForm<CorretagemValues>({
    resolver: zodResolver(corretagemSchema),
    defaultValues: corretagemEmpty,
  })
  const { limparRascunho } = useFormDraft(form, 'corretagem')

  const temRateio = useWatch({ control: form.control, name: 'tem_rateio' })
  const valorNegocio = useWatch({ control: form.control, name: 'valor_negocio' })
  const percentual = useWatch({ control: form.control, name: 'percentual_comissao' })

  // Prévia da comissão: o corretor vê o valor antes de gerar, e não descobre um
  // erro de percentual só depois de abrir o Word.
  const comissaoPrevia = (() => {
    const base = parseCurrency(valorNegocio || '')
    const pct =
      parseFloat(
        String(percentual || '0')
          .replace('%', '')
          .replace(',', '.'),
      ) || 0
    if (!base || !pct) return null
    return base * (pct / 100)
  })()

  useEffect(() => {
    let cancelled = false
    getBrokerProfile()
      .then((profile) => {
        if (cancelled) return
        const display = getBrokerDisplay(profile)
        if (display) {
          setHasBroker(true)
          setBroker(display)
          setPerfilCru(profile)
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setBrokerLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const buildData = (data: CorretagemValues): Record<string, string> => {
    const stripPrefix = (val: string) =>
      val
        .replace(/^\s*(CPF\/CNPJ|CPF|CNPJ)\s*/i, '')
        .replace(/^n[ºo°]?\.?\s*/i, '')
        .trim()
    const base = parseCurrency(data.valor_negocio)
    const pct =
      parseFloat(
        String(data.percentual_comissao || '0')
          .replace('%', '')
          .replace(',', '.'),
      ) || 0
    const comissao = base * (pct / 100)
    const fmt = (v: number) => cleanCurrencyMask(formatCurrency(v))

    const representacao =
      broker?.tipo === 'imobiliaria' && broker.responsavel_nome
        ? `neste ato representada por ${broker.responsavel_nome}, CPF nº ${broker.responsavel_cpf}, CRECI ${broker.responsavel_creci}, `
        : ''

    const exclusividadeTexto =
      data.exclusividade === 'com'
        ? 'A intermediação é contratada EM CARÁTER DE EXCLUSIVIDADE. Nos termos do art. 726 do Código Civil, ajustada a corretagem com exclusividade, a comissão será integralmente devida ao CORRETOR ainda que o negócio se realize sem a sua mediação, salvo se comprovada sua inércia ou ociosidade durante a vigência deste contrato.'
        : 'A intermediação é contratada SEM EXCLUSIVIDADE, podendo o CONTRATANTE valer-se de outros corretores. A comissão será devida ao CORRETOR que houver dado causa ao resultado útil do negócio, na forma das Cláusulas 3ª e 4ª.'

    const rateioTexto =
      data.tem_rateio === 'nao'
        ? 'Concluído o negócio com a participação de mais de um corretor, a remuneração será dividida entre eles, nos termos do art. 728 do Código Civil, sem acréscimo do valor total devido pelo CONTRATANTE.'
        : `A intermediação é realizada em conjunto pelos corretores adiante indicados, cabendo a cada um o percentual da comissão a seguir discriminado, sem qualquer acréscimo ao valor total devido pelo CONTRATANTE: ${data.lista_rateio}. Aplica-se, no que couber, o art. 728 do Código Civil.`

    const dadosPagamento = [broker?.nome, broker?.pix ? `PIX ${broker.pix}` : '']
      .filter(Boolean)
      .join(', ')

    return {
      contratante_nome: data.contratante_nome,
      contratante_qualificacao: data.contratante_qualificacao,
      contratante_rg: data.contratante_rg,
      contratante_documento: stripPrefix(data.contratante_documento),
      contratante_endereco: data.contratante_endereco,
      imovel_descricao: data.imovel_descricao,
      imovel_matricula: data.imovel_matricula,
      imovel_ri_numero: data.imovel_ri_numero.replace(/^\D+/, '').trim(),
      imovel_comarca: data.imovel_comarca,
      imovel_iptu: data.imovel_iptu,
      tipo_negocio: data.tipo_negocio,
      valor_negocio: fmt(base),
      valor_negocio_extenso: currencyToWords(base),
      percentual_comissao: data.percentual_comissao.includes('%')
        ? data.percentual_comissao
        : `${data.percentual_comissao}%`,
      valor_comissao: fmt(comissao),
      valor_comissao_extenso: currencyToWords(comissao),
      vencimento_comissao: data.vencimento_comissao,
      forma_pagamento_comissao: data.forma_pagamento_comissao,
      dados_pagamento_corretor: dadosPagamento,
      regime_exclusividade: exclusividadeTexto,
      rateio_corretores: rateioTexto,
      prazo_vigencia: data.prazo_vigencia,
      aviso_previo_rescisao: data.aviso_previo_rescisao,
      foro_comarca: data.foro_comarca,
      testemunha1_nome: data.testemunha1_nome || '',
      testemunha1_cpf: data.testemunha1_cpf || '',
      testemunha2_nome: data.testemunha2_nome || '',
      testemunha2_cpf: data.testemunha2_cpf || '',
      cidade_uf: data.cidade_uf,
      data_extenso: formatDateLower(new Date()),
      corretor_nome: broker?.nome || '',
      corretor_documento: stripPrefix(broker?.documento || ''),
      corretor_creci: broker?.creci || '',
      corretor_endereco: [perfilCru?.endereco, perfilCru?.cidade, perfilCru?.uf]
        .filter(Boolean)
        .join(', '),
      corretor_representacao: representacao,
      broker_nome_marca: broker?.nome.toUpperCase() || '',
      broker_creci_linha: broker?.creci || '',
    }
  }

  const onSubmit = async (data: CorretagemValues) => {
    if (!hasBroker) {
      toast.error('Preencha seu Perfil em Meu Perfil')
      return
    }
    setIsGenerating(true)
    try {
      await generateCorretagemDocx(buildData(data))
      toast.success('Documento gerado com sucesso!')
      setGerado(true)
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
      const texto = await getCorretagemText(buildData(form.getValues()))
      navigate('/validar', { state: { texto, tipo: 'Contrato de Corretagem' } })
    } catch (error) {
      console.error('Erro ao preparar validação:', error)
      toast.error('Não foi possível preparar a validação.')
    } finally {
      setIsValidating(false)
    }
  }

  const handleGerarOutro = () => {
    form.reset()
    reaplicarNegocioRef.current?.()
    limparRascunho()
    setGerado(false)
  }

  if (gerado) {
    return (
      <DocumentoGerado
        onValidar={onValidate}
        onGerarOutro={handleGerarOutro}
        validando={isValidating}
      />
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CarregarDeNegocio
          form={form}
          aplicar={(n) => aplicarCorretagem(form.setValue, n)}
          onNegocioAplicado={(fn) => {
            reaplicarNegocioRef.current = fn
          }}
        />
        {brokerLoaded && !hasBroker && (
          <div className="flex items-start gap-3 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800 animate-fade-in-up">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1">Perfil não cadastrado</p>
              <p className="mb-2">
                Você é o CORRETOR deste contrato. Preencha seu Perfil para que nome, CPF ou CNPJ,
                CRECI e PIX entrem no documento.
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

        {brokerLoaded && hasBroker && (
          <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
            <p className="font-medium text-foreground">Você, como CORRETOR contratado</p>
            <p className="text-muted-foreground mt-1">
              {broker?.nome} · {broker?.documento} · {broker?.creci}
            </p>
            <p className="text-xs text-muted-foreground/80 mt-1.5">
              Vem do seu Perfil. Para mudar, edite em Meu Perfil.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Quem contrata você</h3>
          </div>
          <Separator />
          <p className="text-xs text-muted-foreground">
            Em regra é o proprietário que quer vender. É ele quem se obriga a pagar a comissão.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contratante_nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do contratante *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Roberto Mendes Araújo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contratante_documento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF ou CNPJ *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="000.000.000-00"
                      {...field}
                      onChange={(e) => field.onChange(maskCpfCnpj(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contratante_rg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identidade *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: MG-15.234.567 SSP/MG" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contratante_qualificacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qualificação *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: brasileiro, casado, médico" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="contratante_endereco"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço *</FormLabel>
                <FormControl>
                  <Input placeholder="Rua, número, bairro, cidade/UF" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Imóvel e negócio</h3>
          </div>
          <Separator />
          <FormField
            control={form.control}
            name="imovel_descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição do imóvel *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ex: Apartamento nº 801, Edifício Solar, 8º andar, com 2 vagas"
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Não inclua matrícula nem inscrição do IPTU aqui: eles têm campo próprio e sairiam
                  repetidos no contrato.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="imovel_matricula"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matrícula *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 78.456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imovel_ri_numero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nº do Registro de Imóveis *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 6" {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Só o número. O contrato escreve "6º Registro de Imóveis de...".
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imovel_comarca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comarca do registro *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Rio de Janeiro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imovel_iptu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inscrição municipal (IPTU) *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 001.234.567-8" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tipo_negocio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Negócio pretendido *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: a venda do imóvel" {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Sai no contrato como "NEGÓCIO PRETENDIDO: a venda do imóvel, pelo valor de...".
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="valor_negocio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor de referência (R$) *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1.200.000,00"
                      {...field}
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
            <DollarSign className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Sua comissão</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="percentual_comissao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Percentual *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 5%" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="forma_pagamento_comissao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forma de pagamento *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: PIX, TED, depósito" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {comissaoPrevia !== null && (
            <div className="rounded-md bg-primary/5 border border-primary/20 px-3 py-2.5 text-sm animate-fade-in-up">
              <span className="text-muted-foreground">Comissão que vai sair no contrato: </span>
              <span className="font-semibold text-foreground">
                R$ {cleanCurrencyMask(formatCurrency(comissaoPrevia))}
              </span>
              <span className="text-muted-foreground"> ({currencyToWords(comissaoPrevia)})</span>
            </div>
          )}
          <FormField
            control={form.control}
            name="vencimento_comissao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quando a comissão é paga *</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: no ato do recebimento do saldo do preço" {...field} />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Entra na cláusula de remuneração exatamente como escrito aqui. Se a comissão é
                  paga em parcelas, descreva as duas datas nesta mesma frase.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="exclusividade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Regime de exclusividade *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="com">Com exclusividade</SelectItem>
                    <SelectItem value="sem">Sem exclusividade</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Com exclusividade, o art. 726 do Código Civil garante a comissão integral mesmo se
                  o negócio for fechado sem você, salvo se ficar provado que você ficou inerte. Sem
                  exclusividade, a comissão é de quem deu causa ao resultado.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tem_rateio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>A comissão é dividida com outro corretor? *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="nao">Não, só eu intermedio</SelectItem>
                    <SelectItem value="sim">Sim, em parceria</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {temRateio === 'sim' && (
            <FormField
              control={form.control}
              name="lista_rateio"
              render={({ field }) => (
                <FormItem className="animate-fade-in-up">
                  <FormLabel>Corretores e percentuais *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Marcus Godoy, CRECI 11841 RJ, 60%; João Silva, CRECI 22222 RJ, 40%"
                      className="min-h-[70px]"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    O rateio divide a mesma comissão: não aumenta o valor que o contratante paga.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Prazo, foro e assinatura</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="prazo_vigencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prazo de vigência *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 90 (noventa) dias" {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    O fim do prazo não apaga o seu direito à comissão se o negócio fechar depois por
                    causa do seu trabalho: é o que diz a cláusula 4ª.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aviso_previo_rescisao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aviso prévio para rescindir *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 15 (quinze) dias" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
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
              control={form.control}
              name="cidade_uf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade/UF da assinatura *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Rio de Janeiro/RJ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="testemunha1_nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Testemunha 1</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="testemunha1_cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF da testemunha 1</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="000.000.000-00"
                      {...field}
                      onChange={(e) => field.onChange(maskCpfCnpj(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="testemunha2_nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Testemunha 2</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="testemunha2_cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF da testemunha 2</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="000.000.000-00"
                      {...field}
                      onChange={(e) => field.onChange(maskCpfCnpj(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <BotaoDadosTeste onClick={() => form.reset(corretagemMock)} />
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
