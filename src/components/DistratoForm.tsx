import { useState, useMemo } from 'react'
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
  Settings2,
  FileSearch,
  Plus,
  Trash2,
  HeartHandshake,
  FileText,
  ClipboardCheck,
  ShieldOff,
} from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
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
import { maskCurrency, maskCpfCnpj, maskCep } from '@/lib/utils'
import { parseCurrency, formatCurrency, cleanCurrencyMask } from '@/lib/form-helpers'
import {
  distratoSchema,
  type DistratoValues,
  distratoMockData,
  emptyParty,
  COMISSAO_DESTINO_OPTIONS,
} from '@/lib/distratoHelpers'
import { buildDistratoTemplateData } from '@/lib/distratoTemplate'
import { generateDistratoDocx, getDistratoText } from '@/lib/distratoDocx'
import { CompromissoPartySection } from '@/components/CompromissoPartySection'

const COMISSAO_DESTINO_LABELS: Record<string, string> = {
  retida_corretor: 'Retida pelo corretor',
  devolvida_pagador: 'Devolvida ao pagador',
  paga_especifico: 'Paga por parte específica',
}

function sugerirPapelConjuge(regime?: string, estadoCivil?: string): string {
  if (estadoCivil !== 'Casado(a)')
    return 'Casado(a) em comunhão de bens? Considere incluir o cônjuge como co-vendedor/co-comprador ou anuente.'
  if (regime === 'Comunhão universal' || regime === 'Comunhão parcial')
    return 'Comunhão de bens: o imóvel integra o patrimônio comum — inclua o cônjuge como co-vendedor ou anuente.'
  if (regime === 'Separação total')
    return 'Separação total: a alienação não exige anuência do cônjuge, mas pode ser incluído como anuente.'
  return 'Na dúvida, se ambos participam do contrato, inclua o cônjuge como anuente.'
}

export function DistratoForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const navigate = useNavigate()

  const form = useForm<DistratoValues>({
    resolver: zodResolver(distratoSchema),
    defaultValues: distratoMockData,
  })
  const { control, setValue, getValues } = form
  const ctrl = control as any

  const {
    fields: vendedorFields,
    append: appendVendedor,
    remove: removeVendedor,
  } = useFieldArray({ control, name: 'vendedores' })
  const {
    fields: compradorFields,
    append: appendComprador,
    remove: removeComprador,
  } = useFieldArray({ control, name: 'compradores' })
  const {
    fields: anuenteFields,
    append: appendAnuente,
    remove: removeAnuente,
  } = useFieldArray({ control, name: 'anuentes' })

  const vendedoresW =
    (useWatch({ control, name: 'vendedores' }) as DistratoValues['vendedores']) || []
  const compradoresW =
    (useWatch({ control, name: 'compradores' }) as DistratoValues['compradores']) || []
  const semValores = useWatch({ control, name: 'sem_valores' })
  const valorPago = useWatch({ control, name: 'valor_pago' })
  const retencaoValor = useWatch({ control, name: 'retencao_valor' })
  const temComissao = useWatch({ control, name: 'tem_comissao' })
  const temDevolucaoImovel = useWatch({ control, name: 'tem_devolucao_imovel' })
  const temRgiCancelamento = useWatch({ control, name: 'tem_rgi_cancelamento' })
  const temRenunciaPerdas = useWatch({ control, name: 'tem_renuncia_perdas' })

  const valorDevolucao = useMemo(() => {
    if (semValores) return 0
    const pago = parseCurrency(valorPago || '0')
    const retencao = parseCurrency(retencaoValor || '0')
    return Math.max(0, pago - retencao)
  }, [semValores, valorPago, retencaoValor])

  const fmt = (v: number) => cleanCurrencyMask(formatCurrency(v))

  const addConjugeVendedor = (i: number) => {
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

  const addConjugeAnuenteVendedor = (i: number) => {
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

  const addConjugeComprador = (i: number) => {
    const v = getValues(`compradores.${i}`)
    appendComprador({
      ...emptyParty,
      estado_civil: 'Casado(a)',
      regime_bens: v?.regime_bens || '',
      nacionalidade: v?.nacionalidade || 'brasileiro(a)',
      endereco: v?.endereco || '',
    })
    toast.success('Cônjuge adicionado como co-comprador. Preencha os dados dele(a).')
  }

  const addConjugeAnuenteComprador = (i: number) => {
    const v = getValues(`compradores.${i}`)
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

  const onSubmit = async (data: DistratoValues) => {
    setIsGenerating(true)
    try {
      await generateDistratoDocx(buildDistratoTemplateData(data))
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
    setIsValidating(true)
    try {
      const texto = await getDistratoText(buildDistratoTemplateData(getValues()))
      navigate('/validar', { state: { texto, tipo: 'Distrato' } })
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
        {/* VENDEDORES */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Vendedor(es)</h3>
          </div>
          <Separator />
          {vendedorFields.map((f, i) => (
            <div key={f.id} className="rounded-lg border border-border/60 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground">
                  Vendedor {i + 1}
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
                title={`Dados do Vendedor ${i + 1}`}
                icon={<User className="h-5 w-5 text-primary" />}
              />
              {vendedoresW[i]?.estado_civil === 'Casado(a)' && (
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-2">
                  <p className="text-sm font-medium text-primary flex items-center gap-1.5">
                    <HeartHandshake className="h-4 w-4" /> Participação do cônjuge
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {sugerirPapelConjuge(vendedoresW[i]?.regime_bens, vendedoresW[i]?.estado_civil)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addConjugeVendedor(i)}
                    >
                      <Plus className="mr-1 h-3 w-3" /> Cônjuge como co-vendedor
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addConjugeAnuenteVendedor(i)}
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
                      <FormLabel>Cônjuge de qual parte?</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da parte" {...field} />
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
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Comprador(es)</h3>
          </div>
          <Separator />
          {compradorFields.map((f, i) => (
            <div key={f.id} className="rounded-lg border border-border/60 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground">
                  Comprador {i + 1}
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
                title={`Dados do Comprador ${i + 1}`}
                icon={<UserCheck className="h-5 w-5 text-primary" />}
              />
              {compradoresW[i]?.estado_civil === 'Casado(a)' && (
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-2">
                  <p className="text-sm font-medium text-primary flex items-center gap-1.5">
                    <HeartHandshake className="h-4 w-4" /> Participação do cônjuge
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {sugerirPapelConjuge(
                      compradoresW[i]?.regime_bens,
                      compradoresW[i]?.estado_civil,
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addConjugeComprador(i)}
                    >
                      <Plus className="mr-1 h-3 w-3" /> Cônjuge como co-comprador
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addConjugeAnuenteComprador(i)}
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
            onClick={() => appendComprador({ ...emptyParty })}
          >
            <Plus className="mr-1 h-4 w-4" /> Adicionar comprador
          </Button>
        </div>

        {/* CONTRATO ORIGINÁRIO */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Contrato Originário</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="contrato_originario_tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo do Contrato Originário *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Promessa de Compra e Venda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="contrato_originario_data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data do Contrato Originário *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={control}
            name="contrato_originario_registro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registro / Referência</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Escritura pública lavrada no..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* IMÓVEL */}
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
          </div>
        </div>

        {/* LIQUIDAÇÃO FINANCEIRA */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Liquidação Financeira</h3>
          </div>
          <Separator />
          <FormField
            control={control}
            name="sem_valores"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2 space-y-0">
                <FormControl>
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-[var(--primary)]"
                    checked={!!field.value}
                    onChange={(e) => {
                      field.onChange(e.target.checked)
                      if (e.target.checked) {
                        setValue('valor_pago', '')
                        setValue('retencao_valor', '')
                        setValue('forma_devolucao', '')
                      }
                    }}
                  />
                </FormControl>
                <FormLabel className="!mt-0 cursor-pointer">
                  Nenhum valor foi pago — sem devolução
                </FormLabel>
              </FormItem>
            )}
          />
          {!semValores && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="valor_pago"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Pago (R$) *</FormLabel>
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
                name="retencao_valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Retenção (R$) *</FormLabel>
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
              <FormItem>
                <FormLabel>Valor a Devolver (Calculado)</FormLabel>
                <FormControl>
                  <Input disabled value={fmt(valorDevolucao)} />
                </FormControl>
              </FormItem>
              <FormField
                control={control}
                name="forma_devolucao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forma de Devolução *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: PIX em até 30 dias" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        {/* COMISSÃO */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-primary">Comissão</h3>
            </div>
            <FormField
              control={control}
              name="tem_comissao"
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {field.value ? 'Ativo' : 'Inativo'}
                  </span>
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-[var(--primary)]"
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                </div>
              )}
            />
          </div>
          {temComissao && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="comissao_destino"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destino da Comissão *</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {COMISSAO_DESTINO_OPTIONS.map((o) => (
                            <SelectItem key={o} value={o}>
                              {COMISSAO_DESTINO_LABELS[o]}
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
              </div>
            </>
          )}
        </div>

        {/* CLÁUSULAS OPCIONAIS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Cláusulas Adicionais</h3>
          </div>
          <Separator />
          <div className="space-y-3">
            <FormField
              control={control}
              name="tem_devolucao_imovel"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-[var(--primary)]"
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0 cursor-pointer flex items-center gap-1.5">
                    <ClipboardCheck className="h-4 w-4" /> Devolução do Imóvel
                  </FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="tem_rgi_cancelamento"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-[var(--primary)]"
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0 cursor-pointer flex items-center gap-1.5">
                    <FileText className="h-4 w-4" /> Cancelamento no RGI
                  </FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="tem_renuncia_perdas"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-[var(--primary)]"
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0 cursor-pointer flex items-center gap-1.5">
                    <ShieldOff className="h-4 w-4" /> Renúncia a Perdas e Danos
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* PRAZOS E FORO */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Datas e Foro</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="data_documento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data do Distrato *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                  <FormLabel>Fórum/Comarca *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Rio de Janeiro/RJ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* TESTEMUNHAS */}
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

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => form.reset(distratoMockData)}
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
              Preparando validação...
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
