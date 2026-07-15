import { useState, useEffect, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Loader2,
  Download,
  Wand2,
  User,
  Building2,
  DollarSign,
  Settings2,
  UserCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { CarregarDeNegocio } from '@/components/CarregarDeNegocio'
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
import { parseCurrency, formatCurrency, cleanCurrencyMask } from '@/lib/form-helpers'
import {
  promiseSchema,
  type PromiseValues,
  ESTADO_CIVIL_OPTIONS,
  SALDO_PAGAMENTO_OPTIONS,
  promiseMockData,
  buildPromiseTemplateData,
} from '@/lib/promise-helpers'
import { generatePromiseDocx } from '@/lib/promise-docx'
import { getBrokerProfile, type BrokerProfile } from '@/services/broker-profile'

const fmtCurrency = (v: number) => cleanCurrencyMask(formatCurrency(v))

export function PromiseForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [broker, setBroker] = useState<BrokerProfile | null>(null)

  const form = useForm<PromiseValues>({
    resolver: zodResolver(promiseSchema),
    defaultValues: {
      vendedor_nome: '',
      vendedor_nacionalidade: 'brasileiro(a)',
      vendedor_estado_civil: '',
      vendedor_profissao: '',
      vendedor_cpf: '',
      vendedor_endereco: '',
      comprador_nome: '',
      comprador_nacionalidade: 'brasileiro(a)',
      comprador_estado_civil: '',
      comprador_profissao: '',
      comprador_cpf: '',
      comprador_endereco: '',
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
      tipo_arras: 'confirmatoria',
      saldo_pagamento: 'Recursos Próprios',
    },
  })

  const { control, setValue } = form

  useEffect(() => {
    getBrokerProfile()
      .then((profile) => {
        setBroker(profile)
        if (profile?.commission_rate) {
          setValue('comissao_percentual', String(profile.commission_rate))
        }
      })
      .catch(() => {})
  }, [setValue])

  const valorVenda = useWatch({ control, name: 'valor_venda' })
  const valorSinal = useWatch({ control, name: 'valor_sinal' })
  const comissaoPct = useWatch({ control, name: 'comissao_percentual' })
  const hasInterveniente = useWatch({ control, name: 'has_interveniente' })

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

  const onSubmit = async (data: PromiseValues) => {
    setIsGenerating(true)
    try {
      await new Promise((r) => setTimeout(r, 800))
      generatePromiseDocx(buildPromiseTemplateData(data, broker))
      toast.success('Documento gerado com sucesso!')
      form.reset()
    } catch (error) {
      console.error('Erro ao gerar documento:', error)
      toast.error('Ocorreu um erro ao gerar o documento.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CarregarDeNegocio form={form} aplicar={(n) => aplicarPromise(form.setValue, n)} />
        <PartySection
          control={control}
          prefix="vendedor"
          title="Promitente Vendedor(a)"
          icon={<User className="h-5 w-5 text-primary" />}
        />
        <PartySection
          control={control}
          prefix="comprador"
          title="Promitente Comprador(a)"
          icon={<User className="h-5 w-5 text-primary" />}
        />

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
                      <SelectItem value="confirmatoria">Arras Confirmatória</SelectItem>
                      <SelectItem value="penitencial">Arras Penitencial</SelectItem>
                    </SelectContent>
                  </Select>
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
          variant="outline"
          className="w-full"
          onClick={() => form.reset(promiseMockData)}
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
