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
import { Button } from '@/components/ui/button'
import { BotaoDadosTeste } from '@/components/Layout'
import { CarregarDeNegocio, DocumentoGerado, useFormDraft } from '@/components/CarregarDeNegocio'
import { aplicarAutorizacao } from '@/lib/aplicar-negocio'
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
import { getBrokerProfile, type BrokerProfile } from '@/services/broker-profile'

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
