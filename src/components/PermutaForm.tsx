import { useState, useEffect, useMemo } from 'react'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Loader2,
  Download,
  Wand2,
  User,
  UserCheck,
  FileText,
  DollarSign,
  Home,
  ArrowLeftRight,
  Settings2,
  FileSearch,
  Plus,
  Trash2,
  HeartHandshake,
  Building2,
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
import { maskCurrency, maskCpfCnpj } from '@/lib/utils'
import { parseCurrency, formatCurrency, cleanCurrencyMask } from '@/lib/form-helpers'
import {
  permutaSchema,
  type PermutaValues,
  permutaMockData,
  emptyParty,
  TORNA_DEVEDOR_OPTIONS,
  TORNA_FORMA_OPTIONS,
} from '@/lib/permutaHelpers'
import { buildPermutaTemplateData } from '@/lib/permutaTemplate'
import { generatePermutaDocx, getPermutaText } from '@/lib/permutaDocx'
import { CompromissoPartySection } from '@/components/CompromissoPartySection'
import { getBrokerProfile } from '@/services/broker-profile'

const Checkbox = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <input
    type="checkbox"
    className="h-4 w-4 accent-[var(--primary)]"
    checked={checked}
    onChange={(e) => onChange(e.target.checked)}
  />
)

function PropertySection({
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
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-semibold text-primary">{title}</h3>
      </div>
      <Separator />
      <FormField
        control={control}
        name={`${prefix}_descricao`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição do Imóvel *</FormLabel>
            <FormControl>
              <Textarea
                rows={2}
                className="resize-none"
                placeholder="Ex: Apartamento nº 801..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${prefix}_endereco`}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name={`${prefix}_matricula`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Matrícula nº *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}_rgi`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>RGI *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}_iptu`}
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
      <FormField
        control={control}
        name={`${prefix}`.replace('imovel', 'valor')}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Valor do Imóvel (R$) *</FormLabel>
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
  )
}

export function PermutaForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const navigate = useNavigate()

  const form = useForm<PermutaValues>({
    resolver: zodResolver(permutaSchema),
    defaultValues: permutaMockData,
  })
  const { control, getValues, setValue } = form
  const ctrl = control as any

  const {
    fields: primeiroFields,
    append: appendPrimeiro,
    remove: removePrimeiro,
  } = useFieldArray({ control, name: 'primeiros' })
  const {
    fields: segundoFields,
    append: appendSegundo,
    remove: removeSegundo,
  } = useFieldArray({ control, name: 'segundos' })
  const {
    fields: anuenteFields,
    append: appendAnuente,
    remove: removeAnuente,
  } = useFieldArray({ control, name: 'anuentes' })

  const hasTorna = useWatch({ control, name: 'has_torna' })
  const valorA = useWatch({ control, name: 'valor_a' })
  const valorB = useWatch({ control, name: 'valor_b' })
  const comissaoPercentual = useWatch({ control, name: 'comissao_percentual' })

  const comissaoCalc = useMemo(() => {
    const total = parseCurrency(valorA || '0') + parseCurrency(valorB || '0')
    const pct = parseFloat(comissaoPercentual || '0') || 0
    return { total, comissao: (total * pct) / 100 }
  }, [valorA, valorB, comissaoPercentual])

  useEffect(() => {
    getBrokerProfile()
      .then((profile) => {
        if (!profile) return
        setValue(
          'comissao_beneficiario',
          profile.tipo_perfil === 'imobiliaria' ? profile.razao_social : profile.nome,
        )
        setValue(
          'comissao_documento',
          profile.tipo_perfil === 'imobiliaria' ? profile.cnpj : profile.cpf,
        )
        setValue(
          'comissao_creci',
          profile.tipo_perfil === 'imobiliaria' ? profile.creci_juridico : profile.creci,
        )
        setValue('comissao_pix', profile.pix || '')
      })
      .catch(() => {})
  }, [setValue])

  const onSubmit = async (data: PermutaValues) => {
    setIsGenerating(true)
    try {
      await generatePermutaDocx(buildPermutaTemplateData(data))
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
      const texto = await getPermutaText(buildPermutaTemplateData(getValues()))
      navigate('/validar', { state: { texto, tipo: 'Permuta' } })
    } catch (error) {
      console.error('Erro ao preparar validação:', error)
      toast.error('Não foi possível preparar a validação.')
    } finally {
      setIsValidating(false)
    }
  }

  const addConjugeAnuente = (party: 'primeiros' | 'segundos', i: number) => {
    const p = getValues(`${party}.${i}`)
    appendAnuente({
      ...emptyParty,
      conjuge_de: p?.nome || '',
      estado_civil: 'Casado(a)',
      regime_bens: p?.regime_bens || '',
      nacionalidade: p?.nacionalidade || 'brasileiro(a)',
      endereco: p?.endereco || '',
    })
    toast.success('Cônjuge adicionado como anuente.')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* PRIMEIROS PERMUTANTES */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Primeiros Permutantes</h3>
          </div>
          <Separator />
          {primeiroFields.map((f, i) => (
            <div key={f.id} className="rounded-lg border border-border/60 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground">
                  Permutante {i + 1}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addConjugeAnuente('primeiros', i)}
                  >
                    <HeartHandshake className="mr-1 h-3 w-3" /> Cônjuge anuente
                  </Button>
                  {primeiroFields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePrimeiro(i)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <CompromissoPartySection
                control={ctrl}
                prefix={`primeiros.${i}`}
                sep="."
                title={`Dados do Permutante ${i + 1}`}
                icon={<User className="h-5 w-5 text-primary" />}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => appendPrimeiro({ ...emptyParty })}
          >
            <Plus className="mr-1 h-4 w-4" /> Adicionar permutante
          </Button>
        </div>

        {/* SEGUNDOS PERMUTANTES */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Segundos Permutantes</h3>
          </div>
          <Separator />
          {segundoFields.map((f, i) => (
            <div key={f.id} className="rounded-lg border border-border/60 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground">
                  Permutante {i + 1}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addConjugeAnuente('segundos', i)}
                  >
                    <HeartHandshake className="mr-1 h-3 w-3" /> Cônjuge anuente
                  </Button>
                  {segundoFields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSegundo(i)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <CompromissoPartySection
                control={ctrl}
                prefix={`segundos.${i}`}
                sep="."
                title={`Dados do Permutante ${i + 1}`}
                icon={<UserCheck className="h-5 w-5 text-primary" />}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => appendSegundo({ ...emptyParty })}
          >
            <Plus className="mr-1 h-4 w-4" /> Adicionar permutante
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

        {/* IMÓVEL A */}
        <PropertySection
          control={control}
          prefix="imovel_a"
          title="Imóvel A (dos Primeiros Permutantes)"
          icon={<Building2 className="h-5 w-5 text-primary" />}
        />

        {/* IMÓVEL B */}
        <PropertySection
          control={control}
          prefix="imovel_b"
          title="Imóvel B (dos Segundos Permutantes)"
          icon={<Home className="h-5 w-5 text-primary" />}
        />

        {/* TORNA */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Torna (Compensação Monetária)</h3>
          </div>
          <Separator />
          <FormField
            control={control}
            name="has_torna"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox checked={!!field.value} onChange={field.onChange} />
                </FormControl>
                <FormLabel className="!mt-0 cursor-pointer">
                  Haverá torna (diferença em dinheiro entre os imóveis)
                </FormLabel>
              </FormItem>
            )}
          />
          {hasTorna && (
            <div className="rounded-lg border border-border/60 p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="torna_valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor da Torna (R$) *</FormLabel>
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
                  name="torna_devedor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Devedor da Torna *</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TORNA_DEVEDOR_OPTIONS.map((o) => (
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="torna_forma_pagamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Forma de Pagamento *</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TORNA_FORMA_OPTIONS.map((o) => (
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
                  name="torna_prazo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prazo de Pagamento *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 30 (trinta) dias" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={control}
                name="torna_garantia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Garantia (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Hipoteca sobre o imóvel B" {...field} />
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
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Comissão de Corretagem</h3>
          </div>
          <Separator />
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-sm text-muted-foreground">
            Total dos imóveis:{' '}
            <strong className="text-primary">
              {cleanCurrencyMask(formatCurrency(comissaoCalc.total))}
            </strong>{' '}
            &middot; Comissão ({comissaoPercentual || 0}%):{' '}
            <strong className="text-primary">
              {cleanCurrencyMask(formatCurrency(comissaoCalc.comissao))}
            </strong>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="comissao_percentual"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Percentual da Comissão (%) *</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} placeholder="Ex: 5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="comissao_beneficiario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beneficiário (Corretor/Imobiliária)</FormLabel>
                  <FormControl>
                    <Input placeholder="Auto-preenchido pelo perfil" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={control}
              name="comissao_documento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF/CNPJ</FormLabel>
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
              name="comissao_pix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chave PIX</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* FORO / FECHO */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Foro, Local e Data</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <FormLabel>Cidade *</FormLabel>
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
                  <FormLabel>Data *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
          onClick={() => form.reset(permutaMockData)}
        >
          <Wand2 className="mr-2 h-4 w-4" /> Preencher dados de teste
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
