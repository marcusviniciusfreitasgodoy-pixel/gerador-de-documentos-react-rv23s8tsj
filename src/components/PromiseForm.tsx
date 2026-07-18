import { useState, useEffect, useMemo, useRef } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Loader2,
  Download,
  Wand2,
  FileSearch,
  User,
  Building2,
  DollarSign,
  Settings2,
  UserCheck,
  HeartHandshake,
} from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { CarregarDeNegocio, DocumentoGerado } from '@/components/CarregarDeNegocio'
import { aplicarPromise } from '@/lib/aplicar-negocio'
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
import { Switch } from '@/components/ui/switch'
import { maskCurrency, maskCpfCnpj } from '@/lib/utils'
import {
  parseCurrency,
  formatCurrency,
  cleanCurrencyMask,
  ARRAS_OPTIONS,
  getArrasResumo,
} from '@/lib/form-helpers'
import {
  promiseSchema,
  type PromiseValues,
  ESTADO_CIVIL_OPTIONS,
  REGIME_BENS_OPTIONS,
  SALDO_PAGAMENTO_OPTIONS,
  PAPEL_CONJUGE_VENDEDOR,
  PAPEL_CONJUGE_COMPRADOR,
  promiseMockData,
  buildPromiseTemplateData,
  sugerirPapelConjuge,
  sugerirPapelConjugeComprador,
} from '@/lib/promise-helpers'
import { generatePromiseDocx, getPromiseText } from '@/lib/promise-docx'
import { getBrokerProfile, type BrokerProfile } from '@/services/broker-profile'

const fmtCurrency = (v: number) => cleanCurrencyMask(formatCurrency(v))

export function PromiseForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const navigate = useNavigate()
  // Fase 4: tela de sucesso + re-aplicar negócio no "Gerar outro deste negócio".
  const [gerado, setGerado] = useState(false)
  const reaplicarNegocioRef = useRef<(() => void) | null>(null)
  const [broker, setBroker] = useState<BrokerProfile | null>(null)

  const form = useForm<PromiseValues>({
    resolver: zodResolver(promiseSchema),
    defaultValues: {
      vendedor_nome: '',
      vendedor_nacionalidade: 'brasileiro(a)',
      vendedor_estado_civil: '',
      vendedor_regime_bens: '',
      vendedor_profissao: '',
      vendedor_cpf: '',
      vendedor_endereco: '',
      conjuge_vendedor_papel: 'nenhum',
      conjuge_vendedor_nome: '',
      conjuge_vendedor_nacionalidade: 'brasileiro(a)',
      conjuge_vendedor_profissao: '',
      conjuge_vendedor_cpf: '',
      conjuge_vendedor_endereco: '',
      comprador_nome: '',
      comprador_nacionalidade: 'brasileiro(a)',
      comprador_estado_civil: '',
      comprador_regime_bens: '',
      comprador_profissao: '',
      comprador_cpf: '',
      comprador_endereco: '',
      conjuge_comprador_papel: 'nenhum',
      conjuge_comprador_nome: '',
      conjuge_comprador_nacionalidade: 'brasileiro(a)',
      conjuge_comprador_profissao: '',
      conjuge_comprador_cpf: '',
      conjuge_comprador_endereco: '',
      has_interveniente: false,
      interveniente_nome: '',
      interveniente_cpf: '',
      imovel_descricao: '',
      imovel_endereco: '',
      imovel_matricula: '',
      imovel_cidade: '',
      imovel_estado: '',
      valor_venda: '',
      valor_sinal: '',
      comissao_percentual: '5',
      prazo_certidoes_dias: '10',
      tipo_arras: 'confirmatoria',
      saldo_pagamento: 'Recursos Próprios',
    },
  })

  const { control, setValue } = form

  // C3: guarda a taxa do corretor para RE-APLICAR depois de cada reset — o
  // form.reset() zerava o percentual carregado do perfil e ele nunca voltava.
  const brokerRateRef = useRef<number | null>(null)
  const aplicarBroker = () => {
    if (brokerRateRef.current) {
      setValue('comissao_percentual', String(brokerRateRef.current))
    }
  }

  useEffect(() => {
    getBrokerProfile()
      .then((profile) => {
        setBroker(profile)
        if (profile?.commission_rate) {
          brokerRateRef.current = profile.commission_rate
          aplicarBroker()
        }
      })
      .catch(() => {})
  }, [setValue])

  const valorVenda = useWatch({ control, name: 'valor_venda' })
  const valorSinal = useWatch({ control, name: 'valor_sinal' })
  const comissaoPct = useWatch({ control, name: 'comissao_percentual' })
  const hasInterveniente = useWatch({ control, name: 'has_interveniente' })
  const vendedorEstadoCivil = useWatch({ control, name: 'vendedor_estado_civil' })
  const vendedorRegime = useWatch({ control, name: 'vendedor_regime_bens' })
  const compradorEstadoCivil = useWatch({ control, name: 'comprador_estado_civil' })
  const compradorRegime = useWatch({ control, name: 'comprador_regime_bens' })

  const saldo = useMemo(() => {
    const venda = parseCurrency(valorVenda || '')
    const sinal = parseCurrency(valorSinal || '')
    return Math.max(0, venda - sinal)
  }, [valorVenda, valorSinal])

  const comissao = useMemo(() => {
    const venda = parseCurrency(valorVenda || '')
    const pct = parseFloat(comissaoPct || '0') || 0
    return venda * (pct / 100)
  }, [valorVenda, comissaoPct])

  // Mesma minuta que seria baixada, renderizada em memória e enviada ao Validador.
  // Tipo "Promessa/Compromisso": a régua da promessa se aplica a esta minuta.
  const onValidate = async () => {
    setIsValidating(true)
    try {
      const texto = getPromiseText(buildPromiseTemplateData(form.getValues(), broker))
      navigate('/validar', { state: { texto, tipo: 'Promessa/Compromisso' } })
    } catch (error) {
      console.error('Erro ao preparar validação:', error)
      toast.error('Não foi possível preparar a validação.')
    } finally {
      setIsValidating(false)
    }
  }

  const onSubmit = async (data: PromiseValues) => {
    setIsGenerating(true)
    try {
      await new Promise((r) => setTimeout(r, 800))
      generatePromiseDocx(buildPromiseTemplateData(data, broker))
      toast.success('Documento gerado com sucesso!')
      setGerado(true)
    } catch (error) {
      console.error('Erro ao gerar documento:', error)
      toast.error('Ocorreu um erro ao gerar o documento.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGerarOutro = () => {
    form.reset()
    reaplicarNegocioRef.current?.()
    aplicarBroker()
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
          aplicar={(n) => aplicarPromise(form.setValue, n)}
          onNegocioAplicado={(fn) => {
            reaplicarNegocioRef.current = fn
          }}
        />
        <PartySection
          control={control}
          prefix="vendedor"
          title="Promitente Vendedor(a)"
          icon={<User className="h-5 w-5 text-primary" />}
        />
        {vendedorEstadoCivil === 'Casado(a)' && (
          <ConjugeSection
            control={control}
            lado="vendedor"
            titulo="Cônjuge do Promitente Vendedor(a)"
            dica={sugerirPapelConjuge(vendedorRegime)}
            papeis={PAPEL_CONJUGE_VENDEDOR}
          />
        )}
        <PartySection
          control={control}
          prefix="comprador"
          title="Promitente Comprador(a)"
          icon={<User className="h-5 w-5 text-primary" />}
        />
        {compradorEstadoCivil === 'Casado(a)' && (
          <ConjugeSection
            control={control}
            lado="comprador"
            titulo="Cônjuge do Promitente Comprador(a)"
            dica={sugerirPapelConjugeComprador(compradorRegime)}
            papeis={PAPEL_CONJUGE_COMPRADOR}
          />
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-primary">Interveniente Anuente</h3>
            </div>
            <FormField
              control={control}
              name="has_interveniente"
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {field.value ? 'Ativo' : 'Inativo'}
                  </span>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </div>
              )}
            />
          </div>
          <Separator />
          {hasInterveniente && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="interveniente_nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome / Razão Social *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="interveniente_cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF/CNPJ *</FormLabel>
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
            </div>
          )}
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
                  <Input placeholder="Ex: Apartamento nº 801..." {...field} />
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
              name="imovel_estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado (UF) *</FormLabel>
                  <FormControl>
                    <Input maxLength={2} {...field} />
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
              name="valor_venda"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor de Venda (R$) *</FormLabel>
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
              name="valor_sinal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sinal/Entrada (R$) *</FormLabel>
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
              <FormLabel>Saldo (Calculado)</FormLabel>
              <FormControl>
                <Input disabled value={fmtCurrency(saldo)} />
              </FormControl>
            </FormItem>
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
          </div>
          <FormItem>
            <FormLabel>Comissão (Calculado)</FormLabel>
            <FormControl>
              <Input disabled value={fmtCurrency(comissao)} />
            </FormControl>
          </FormItem>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Condições</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <FormField
              control={control}
              name="prazo_certidoes_dias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prazo p/ apresentar certidões (dias) *</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="saldo_pagamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pagamento do Saldo *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SALDO_PAGAMENTO_OPTIONS.map((o) => (
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
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground shrink-0 w-fit"
          onClick={() => {
            form.reset(promiseMockData)
            aplicarBroker()
          }}
        >
          <Wand2 className="mr-1.5 h-3.5 w-3.5" />
          Preencher dados de teste
        </Button>

        {/* Barra de ação FIXA: Gerar/Validar sempre alcançáveis no formulário longo. */}
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

function PartySection({
  control,
  prefix,
  title,
  icon,
}: {
  control: any
  prefix: string
  title: string
  icon: React.ReactNode
}) {
  const fName = (f: string) => `${prefix}_${f}` as any
  const estadoCivil = useWatch({ control, name: fName('estado_civil') })
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-semibold text-primary">{title}</h3>
      </div>
      <Separator />
      <FormField
        control={control}
        name={fName('nome')}
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
          name={fName('nacionalidade')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nacionalidade</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={fName('profissao')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profissão</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name={fName('estado_civil')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado Civil *</FormLabel>
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ESTADO_CIVIL_OPTIONS.map((o) => (
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
          name={fName('regime_bens')}
          render={({ field }) => (
            <FormItem className={estadoCivil === 'Casado(a)' ? '' : 'hidden'}>
              <FormLabel>Regime de Bens *</FormLabel>
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {REGIME_BENS_OPTIONS.map((o) => (
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
          name={fName('cpf')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF/CNPJ *</FormLabel>
              <FormControl>
                <Input
                  value={field.value}
                  onChange={(e) => field.onChange(maskCpfCnpj(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name={fName('endereco')}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Endereço Completo *</FormLabel>
            <FormControl>
              <Input placeholder="Rua, nº, Bairro, Cidade/UF, CEP" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

// Bloco do cônjuge. Aparece só quando a parte é Casada. O PAPEL importa juridicamente:
// co-vendedor/co-comprador = o cônjuge É parte; anuente = não é parte, só autoriza a
// alienação (art. 1.647, I). O regime NÃO é perguntado aqui: é o mesmo casamento, então
// herda o da parte — perguntar duas vezes convidaria a divergência.
function ConjugeSection({
  control,
  lado,
  titulo,
  dica,
  papeis,
}: {
  control: any
  lado: 'vendedor' | 'comprador'
  titulo: string
  dica: string
  papeis: readonly string[]
}) {
  const fName = (f: string) => `conjuge_${lado}_${f}` as any
  const papel = useWatch({ control, name: fName('papel') })
  const ROTULO: Record<string, string> = {
    nenhum: 'Não participa do documento',
    co_vendedor: 'Co-vendedor(a) — é parte e aliena junto',
    anuente: 'Anuente — não é parte, apenas autoriza a venda',
    co_comprador: 'Co-comprador(a) — adquire junto',
  }
  return (
    <div className="space-y-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
      <div className="flex items-center gap-2">
        <HeartHandshake className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-primary">{titulo}</h3>
      </div>
      <p className="text-xs text-muted-foreground">{dica}</p>
      <FormField
        control={control}
        name={fName('papel')}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Participação no documento *</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {papeis.map((p) => (
                  <SelectItem key={p} value={p}>
                    {ROTULO[p]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      {papel !== 'nenhum' && (
        <>
          <FormField
            control={control}
            name={fName('nome')}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name={fName('nacionalidade')}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nacionalidade *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={fName('profissao')}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profissão *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={fName('cpf')}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF *</FormLabel>
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
              name={fName('endereco')}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço Completo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Rua, nº, Bairro, Cidade/UF, CEP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </>
      )}
    </div>
  )
}
