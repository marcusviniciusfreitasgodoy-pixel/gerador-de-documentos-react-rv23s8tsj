import { useState, useRef } from 'react'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Loader2,
  Download,
  User,
  UserCheck,
  FileText,
  DollarSign,
  Home,
  Landmark,
  Scale,
  Settings2,
  FileSearch,
  Plus,
  Trash2,
  HeartHandshake,
} from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
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
import { maskCurrency, maskCpfCnpj } from '@/lib/utils'
import { regimeSeAplica } from '@/lib/form-helpers'
import {
  distratoSchema,
  type DistratoValues,
  distratoMockData,
  distratoEmptyData,
  emptyParty,
} from '@/lib/distratoHelpers'
import { buildDistratoTemplateData } from '@/lib/distratoTemplate'
import { generateDistratoDocx, getDistratoText } from '@/lib/distratoDocx'
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
import {
  garantirNegocioDaOperacao,
  operacaoDoFormulario,
  PAPEIS_VENDA,
} from '@/lib/negocioAutomatico'

// C4: fora do componente para estabilidade de referência — um array literal
// inline em cada render anularia a memoização de `calcular` dentro de
// useNegocioSync.
const GRUPOS_DISTRATO = ['vendedores', 'compradores', 'anuentes'] as const

function sugerirPapelVendedor(regime?: string, estadoCivil?: string): string {
  const quem = estadoCivil === 'União estável' ? 'companheiro(a)' : 'cônjuge'
  if (regime === 'Separação total')
    return `Separação total: em regra dispensa anuência, mas inclua o ${quem} se ele participou do contrato original.`
  return `Comunhão de bens: inclua o ${quem} como CO-VENDEDOR (se era parte) ou como ANUENTE (para consentir no distrato).`
}

const Checkbox = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <input
    type="checkbox"
    className="h-4 w-4 accent-[var(--primary)]"
    checked={checked}
    onChange={(e) => onChange(e.target.checked)}
  />
)

export function DistratoForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const navigate = useNavigate()
  // Fase 4: tela de sucesso + re-aplicar negócio no "Gerar outro deste negócio".
  const [gerado, setGerado] = useState(false)
  const reaplicarNegocioRef = useRef<(() => void) | null>(null)

  const form = useForm<DistratoValues>({
    resolver: zodResolver(distratoSchema),
    defaultValues: distratoEmptyData,
  })
  const { control, getValues } = form

  // Fase 2b: autosalva o rascunho e oferece recuperar ao voltar (F5 / fechar aba).
  const { limparRascunho } = useFormDraft(form, 'distrato')
  // C4: volta pro dossiê — registra o Negócio carregado, calcula o diff no
  // submit e grava a confirmação do corretor.
  const { registrarNegocio, calcular, gravar, negocioAtual } = useNegocioSync(form, GRUPOS_DISTRATO)
  const [voltaPendente, setVoltaPendente] = useState<ResultadoVolta | null>(null)
  const ctrl = control as any

  const {
    fields: vendedorFields,
    append: appendVendedor,
    remove: removeVendedor,
    replace: replaceVendedores,
  } = useFieldArray({ control, name: 'vendedores' })
  const {
    fields: compradorFields,
    append: appendComprador,
    remove: removeComprador,
    replace: replaceCompradores,
  } = useFieldArray({ control, name: 'compradores' })
  const {
    fields: anuenteFields,
    append: appendAnuente,
    remove: removeAnuente,
    replace: replaceAnuentes,
  } = useFieldArray({ control, name: 'anuentes' })

  const vendedoresW =
    (useWatch({ control, name: 'vendedores' }) as DistratoValues['vendedores']) || []
  const semValores = useWatch({ control, name: 'sem_valores' })
  const temRetencao = useWatch({ control, name: 'tem_retencao' })
  const devolveImovel = useWatch({ control, name: 'devolve_imovel' })
  const trataComissao = useWatch({ control, name: 'trata_comissao' })
  const comissaoDestino = useWatch({ control, name: 'comissao_destino' })
  const baixaAverbacao = useWatch({ control, name: 'baixa_averbacao' })

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

  const onSubmit = async (data: DistratoValues) => {
    setIsGenerating(true)
    try {
      await generateDistratoDocx(buildDistratoTemplateData(data))
      toast.success('Documento gerado com sucesso!')
      setGerado(true)
      // C4: o documento JÁ saiu. Só agora oferecemos atualizar o dossiê —
      // se isto falhar, o corretor não perde o trabalho.
      setVoltaPendente(calcular())
      limparRascunho()
      // O documento JA saiu e a volta ao dossie ja foi oferecida: so agora o
      // negocio da operacao e garantido. `garantirNegocioDaOperacao` nunca
      // lanca, entao falha de rede aqui nao chega ao corretor, que ja tem o
      // arquivo na maquina. Com um negocio carregado ela nao faz nada: quem
      // grava as correcoes continua sendo o `gravar` do useNegocioSync.
      await garantirNegocioDaOperacao(
        operacaoDoFormulario(data as unknown as Record<string, unknown>, { grupos: PAPEIS_VENDA }),
        negocioAtual(),
      )
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

  const handleGerarOutro = () => {
    form.reset()
    reaplicarNegocioRef.current?.()
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
          imovel={false}
          replaceVendedores={replaceVendedores}
          replaceCompradores={replaceCompradores}
          replaceAnuentes={replaceAnuentes}
          onNegocioAplicado={(fn) => {
            reaplicarNegocioRef.current = fn
          }}
          onNegocioCarregado={registrarNegocio}
          negocioAtual={negocioAtual}
        />
        {/* PROMITENTES VENDEDORES */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Promitente(s) Vendedor(es)</h3>
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
              {regimeSeAplica(vendedoresW[i]?.estado_civil) && (
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-2">
                  <p className="text-sm font-medium text-primary flex items-center gap-1.5">
                    <HeartHandshake className="h-4 w-4" /> Participação do cônjuge/companheiro deste
                    vendedor
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {sugerirPapelVendedor(
                      vendedoresW[i]?.regime_bens,
                      vendedoresW[i]?.estado_civil,
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addConjugeCoVendedor(i)}
                    >
                      <Plus className="mr-1 h-3 w-3" /> Cônjuge/companheiro como co-vendedor
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addConjugeAnuente(i)}
                    >
                      <Plus className="mr-1 h-3 w-3" /> Cônjuge/companheiro como anuente
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

        {/* PROMITENTES COMPRADORES */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Promitente(s) Comprador(es)</h3>
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

        {/* CONTRATO ORIGINÁRIO */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Contrato Originário (que será desfeito)</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="contrato_originario_tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo do contrato *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Instrumento Particular de Promessa de Compra e Venda"
                      {...field}
                    />
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
                  <FormLabel>Data do contrato original *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 10 de janeiro de 2026" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={control}
            name="contrato_originario_objeto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Objeto do contrato (imóvel / descrição) *</FormLabel>
                <FormControl>
                  <Textarea
                    rows={2}
                    className="resize-none"
                    placeholder="Ex: o Apartamento nº 801..., matrícula nº 78.456 do 6º RGI"
                    {...field}
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Descreva o imóvel como está no contrato que se desfaz, para não restar dúvida
                  sobre o que está sendo distratado.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ACERTO DE VALORES */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Acerto de Valores</h3>
          </div>
          <Separator />
          <FormField
            control={control}
            name="sem_valores"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox checked={!!field.value} onChange={field.onChange} />
                </FormControl>
                <FormLabel className="!mt-0 cursor-pointer">
                  Não houve pagamento de valores (nada a devolver)
                </FormLabel>
              </FormItem>
            )}
          />
          {!semValores && (
            <div className="rounded-lg border border-border/60 p-4 space-y-4">
              <FormField
                control={control}
                name="valor_pago"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor já pago pelo comprador (R$) *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="R$ 0,00"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(maskCurrency(e.target.value))}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Tudo o que o comprador já pagou. A devolução é calculada a partir daqui.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="tem_retencao"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={!!field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0 cursor-pointer">
                      Haverá retenção de parte do valor
                    </FormLabel>
                  </FormItem>
                )}
              />
              {temRetencao && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="retencao_valor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor retido (R$) *</FormLabel>
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
                    name="retencao_titulo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>A título de *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: arras, a título de perdas e danos" {...field} />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          Justificativa da retenção, como sai no distrato. Ex.: despesas
                          administrativas, comissão de corretagem.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="devolucao_prazo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prazo de devolução *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 10 (dez) dias" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="devolucao_forma"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Forma de devolução *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: transferência via PIX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                O valor a devolver é calculado automaticamente (valor pago − retenção).
              </p>
            </div>
          )}
        </div>

        {/* DEVOLUÇÃO DO IMÓVEL */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Devolução do Imóvel (se houve posse)</h3>
          </div>
          <Separator />
          <FormField
            control={control}
            name="devolve_imovel"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox checked={!!field.value} onChange={field.onChange} />
                </FormControl>
                <FormLabel className="!mt-0 cursor-pointer">
                  Incluir cláusula de devolução do imóvel
                </FormLabel>
              </FormItem>
            )}
          />
          {devolveImovel && (
            <div className="rounded-lg border border-border/60 p-4 space-y-4">
              <FormField
                control={control}
                name="imovel_devolucao_descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição do imóvel a restituir *</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={2}
                        className="resize-none"
                        placeholder="Ex: o Apartamento nº 801 do Edifício Solar"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="imovel_desocupacao_prazo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prazo para desocupação *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 15 (quinze) dias" {...field} />
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
            <h3 className="font-semibold text-primary">Comissão de Intermediação</h3>
          </div>
          <Separator />
          <FormField
            control={control}
            name="trata_comissao"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox checked={!!field.value} onChange={field.onChange} />
                </FormControl>
                <FormLabel className="!mt-0 cursor-pointer">
                  Incluir cláusula sobre a comissão
                </FormLabel>
              </FormItem>
            )}
          />
          {trataComissao && (
            <div className="rounded-lg border border-border/60 p-4 space-y-4">
              <FormField
                control={control}
                name="comissao_destino"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destino da comissão *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="retida">
                          Retida pelo corretor (serviço prestado)
                        </SelectItem>
                        <SelectItem value="devolvida">Devolvida a quem pagou</SelectItem>
                        <SelectItem value="por_conta">Por conta de uma das partes</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {(comissaoDestino === 'retida' || comissaoDestino === 'devolvida') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="comissao_valor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor da comissão (R$) *</FormLabel>
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
                    name="comissao_corretor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Corretor / imobiliária</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do corretor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              {comissaoDestino === 'devolvida' && (
                <FormField
                  control={control}
                  name="comissao_prazo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prazo da devolução *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 10 (dez) dias" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {comissaoDestino === 'por_conta' && (
                <FormField
                  control={control}
                  name="comissao_responsavel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Por conta de quem? *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: PROMITENTES VENDEDORES" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          )}
        </div>

        {/* BAIXA DE AVERBAÇÃO */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Baixa da Averbação no RGI</h3>
          </div>
          <Separator />
          <FormField
            control={control}
            name="baixa_averbacao"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox checked={!!field.value} onChange={field.onChange} />
                </FormControl>
                <FormLabel className="!mt-0 cursor-pointer">
                  O contrato original foi registrado/averbado na matrícula
                </FormLabel>
              </FormItem>
            )}
          />
          {baixaAverbacao && (
            <div className="rounded-lg border border-border/60 p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={control}
                name="matricula_numero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matrícula nº *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Só é preciso quando o contrato original chegou à matrícula: o distrato
                      autoriza a baixa da averbação.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="rgi_numero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RGI *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 6º RGI" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="averbacao_custas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custas por conta de *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: ambas as partes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        {/* RENÚNCIA */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Renúncia a Perdas e Danos</h3>
          </div>
          <Separator />
          <FormField
            control={control}
            name="renuncia_perdas"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox checked={!!field.value} onChange={field.onChange} />
                </FormControl>
                <FormLabel className="!mt-0 cursor-pointer">
                  Incluir renúncia expressa a indenização / perdas e danos
                </FormLabel>
              </FormItem>
            )}
          />
        </div>

        {/* FORO / FECHO */}
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
              name="vias_qtd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nº de vias</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 2 (duas)" {...field} />
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

        <BotaoDadosTeste onClick={() => form.reset(distratoMockData)} />
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
