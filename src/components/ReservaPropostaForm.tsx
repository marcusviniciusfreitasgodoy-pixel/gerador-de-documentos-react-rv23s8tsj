import { useState, useEffect, useRef } from 'react'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Loader2,
  Download,
  User,
  UserCheck,
  Building2,
  DollarSign,
  Settings2,
  ClipboardCheck,
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
import { maskCurrency, maskCpfCnpj, maskCep } from '@/lib/utils'
import { regimeSeAplica } from '@/lib/form-helpers'
import {
  reservaPropostaSchema,
  type ReservaPropostaValues,
  reservaPropostaMockData,
  reservaPropostaEmptyData,
  emptyParty,
  COMISSAO_RESPONSAVEL_OPTIONS,
} from '@/lib/reservaPropostaHelpers'
import { buildReservaPropostaTemplateData } from '@/lib/reservaPropostaTemplate'
import { generateReservaPropostaDocx, getReservaPropostaText } from '@/lib/reservaPropostaDocx'
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
import {
  garantirNegocioDaOperacao,
  operacaoDoFormulario,
  PAPEIS_RESERVA,
} from '@/lib/negocioAutomatico'

// C4: fora do componente para estabilidade de referência — um array literal
// inline em cada render anularia a memoização de `calcular` dentro de
// useNegocioSync.
const GRUPOS_RESERVA = ['proponentes', 'proprietarios', 'anuentes'] as const

function sugerirPapelProponente(regime?: string, estadoCivil?: string): string {
  const quem = estadoCivil === 'União estável' ? 'companheiro(a)' : 'cônjuge'
  if (regime === 'Comunhão universal' || regime === 'Comunhão parcial')
    return `Comunhão de bens: o imóvel entrará no patrimônio comum: inclua o ${quem} como CO-PROPONENTE (co-comprador).`
  if (regime === 'Separação total')
    return `Separação total: a aquisição não integra o patrimônio do outro. Inclua o ${quem} só se comprarem juntos.`
  return `Na dúvida, se pretendem adquirir em conjunto, inclua o ${quem} como co-proponente.`
}

export function ReservaPropostaForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [brokerLoaded, setBrokerLoaded] = useState(false)
  const [hasBroker, setHasBroker] = useState(false)
  const navigate = useNavigate()
  // Fase 4: tela de sucesso + re-aplicar negócio no "Gerar outro deste negócio".
  const [gerado, setGerado] = useState(false)
  const reaplicarNegocioRef = useRef<(() => void) | null>(null)

  const form = useForm<ReservaPropostaValues>({
    resolver: zodResolver(reservaPropostaSchema),
    defaultValues: reservaPropostaEmptyData,
  })
  const { control, setValue, getValues } = form

  // Fase 2b: autosalva o rascunho e oferece recuperar ao voltar (F5 / fechar aba).
  const { limparRascunho } = useFormDraft(form, 'reserva')
  // C4: volta pro dossiê — registra o Negócio carregado, calcula o diff no
  // submit e grava a confirmação do corretor.
  const { registrarNegocio, calcular, gravar, negocioAtual } = useNegocioSync(form, GRUPOS_RESERVA)
  const [voltaPendente, setVoltaPendente] = useState<ResultadoVolta | null>(null)
  const ctrl = control as any

  const {
    fields: proponenteFields,
    append: appendProponente,
    remove: removeProponente,
    replace: replaceProponentes,
  } = useFieldArray({ control, name: 'proponentes' })
  const {
    fields: anuenteFields,
    append: appendAnuente,
    remove: removeAnuente,
    replace: replaceAnuentes,
  } = useFieldArray({ control, name: 'anuentes' })
  const {
    fields: proprietarioFields,
    append: appendProprietario,
    remove: removeProprietario,
    replace: replaceProprietarios,
  } = useFieldArray({ control, name: 'proprietarios' })

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
          brokerRef.current = { ...display }
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

  const proponentesW =
    (useWatch({ control, name: 'proponentes' }) as ReservaPropostaValues['proponentes']) || []
  const temContingencias = useWatch({ control, name: 'tem_contingencias' })

  const addConjugeCoProponente = (i: number) => {
    const v = getValues(`proponentes.${i}`)
    appendProponente({
      ...emptyParty,
      estado_civil: 'Casado(a)',
      regime_bens: v?.regime_bens || '',
      nacionalidade: v?.nacionalidade || 'brasileiro(a)',
      endereco: v?.endereco || '',
    })
    toast.success('Cônjuge adicionado como co-proponente. Preencha os dados dele(a).')
  }

  const addConjugeAnuente = (i: number) => {
    const v = getValues(`proponentes.${i}`)
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

  const onSubmit = async (data: ReservaPropostaValues) => {
    if (!hasBroker) {
      toast.error('Preencha seu Perfil em Meu Perfil')
      return
    }
    setIsGenerating(true)
    try {
      await generateReservaPropostaDocx(buildReservaPropostaTemplateData(data))
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
        operacaoDoFormulario(data as unknown as Record<string, unknown>, {
          grupos: PAPEIS_RESERVA,
        }),
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
    if (!hasBroker) {
      toast.error('Preencha seu Perfil em Meu Perfil')
      return
    }
    setIsValidating(true)
    try {
      const texto = await getReservaPropostaText(buildReservaPropostaTemplateData(getValues()))
      navigate('/validar', { state: { texto, tipo: 'Proposta/Reserva' } })
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
          imovel
          incluirAnuentes={false}
          replaceVendedores={replaceProprietarios}
          replaceCompradores={replaceProponentes}
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

        {/* PROPONENTES */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Proponente(s): quem faz a proposta</h3>
          </div>
          <Separator />
          {proponenteFields.map((f, i) => (
            <div key={f.id} className="rounded-lg border border-border/60 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground">
                  Proponente {i + 1}
                </span>
                {proponenteFields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeProponente(i)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <CompromissoPartySection
                control={ctrl}
                prefix={`proponentes.${i}`}
                sep="."
                title={`Dados do Proponente ${i + 1}`}
                icon={<User className="h-5 w-5 text-primary" />}
              />
              {regimeSeAplica(proponentesW[i]?.estado_civil) && (
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-2">
                  <p className="text-sm font-medium text-primary flex items-center gap-1.5">
                    <HeartHandshake className="h-4 w-4" /> Participação do cônjuge/companheiro deste
                    proponente
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {sugerirPapelProponente(
                      proponentesW[i]?.regime_bens,
                      proponentesW[i]?.estado_civil,
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addConjugeCoProponente(i)}
                    >
                      <Plus className="mr-1 h-3 w-3" /> Cônjuge/companheiro como co-proponente
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
            onClick={() => appendProponente({ ...emptyParty })}
          >
            <Plus className="mr-1 h-4 w-4" /> Adicionar proponente
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
                      <FormLabel>Cônjuge de qual proponente?</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do proponente" {...field} />
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

        {/* PROPRIETÁRIOS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">
              Proprietário(s): a quem a proposta é dirigida
            </h3>
          </div>
          <Separator />
          {proprietarioFields.map((f, i) => (
            <div key={f.id} className="rounded-lg border border-border/60 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground">
                  Proprietário(a) {i + 1}
                </span>
                {proprietarioFields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeProprietario(i)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <CompromissoPartySection
                control={ctrl}
                prefix={`proprietarios.${i}`}
                sep="."
                title={`Dados do Proprietário(a) ${i + 1}`}
                icon={<UserCheck className="h-5 w-5 text-primary" />}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => appendProprietario({ ...emptyParty })}
          >
            <Plus className="mr-1 h-4 w-4" /> Adicionar proprietário
          </Button>
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
                <p className="text-xs text-muted-foreground">
                  Copie da matrícula. É a única descrição que sai na cláusula do objeto: endereço,
                  vagas e fração ideal abaixo alimentam o dossiê e os outros documentos. Não repita
                  matrícula, RGI nem IPTU aqui, que têm campo próprio.
                </p>
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
                  <p className="text-xs text-muted-foreground">
                    Escreva o cartório por extenso, como entra na frase "registrado no ... sob a
                    matrícula nº". Ex.: 6º Oficial de Registro de Imóveis.
                  </p>
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
          </div>
        </div>

        {/* PROPOSTA / SINAL */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Proposta e Sinal</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="valor_proposto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Proposto (R$) *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="R$ 0,00"
                      value={field.value}
                      onChange={(e) => field.onChange(maskCurrency(e.target.value))}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Quanto o comprador está oferecendo. É este valor que vai ao vendedor para
                    aceite, e sobre ele se calcula a comissão.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="valor_sinal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sinal / Reserva (R$) *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="R$ 0,00"
                      value={field.value}
                      onChange={(e) => field.onChange(maskCurrency(e.target.value))}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Entregue agora para reservar o imóvel. Aceita a proposta, vira parte do preço.
                    Recusada, volta integral, sem retenção nem correção.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={control}
            name="forma_pagamento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condições de Pagamento *</FormLabel>
                <FormControl>
                  <Textarea
                    rows={2}
                    className="resize-none"
                    placeholder="Ex: sinal de R$ 50.000,00 na assinatura e saldo na escritura, à vista"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="dados_recebimento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Como o sinal é pago *</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: PIX para a chave..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* CONTINGÊNCIAS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Condições Suspensivas (contingências)</h3>
          </div>
          <Separator />
          <FormField
            control={control}
            name="tem_contingencias"
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
                <FormLabel className="!mt-0 cursor-pointer">
                  Incluir cláusula de condições suspensivas
                </FormLabel>
              </FormItem>
            )}
          />
          {temContingencias && (
            <div className="rounded-lg border border-border/60 p-4 space-y-3">
              <FormField
                control={control}
                name="cont_financiamento"
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
                    <FormLabel className="!mt-0 cursor-pointer font-normal">
                      Aprovação de financiamento imobiliário
                    </FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="cont_certidoes"
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
                    <FormLabel className="!mt-0 cursor-pointer font-normal">
                      Análise e aprovação das certidões / documentação
                    </FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="cont_vistoria"
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
                    <FormLabel className="!mt-0 cursor-pointer font-normal">
                      Vistoria do imóvel aprovada
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        {/* PRAZOS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Prazos e Datas</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="prazo_validade_dias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Validade da proposta (dias) *</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Dentro desse prazo a proposta é irretratável e prende o comprador (art. 427 do
                    Código Civil). Passado sem resposta, ela caduca.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="prazo_devolucao_dias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Devolução do sinal se recusada (dias) *</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Prazo para devolver o sinal, contado da recusa ou do fim da validade.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="prazo_promessa_dias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prazo p/ firmar a Promessa após aceite (dias) *</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Prazo para assinar a promessa ou a escritura depois do aceite.
                  </p>
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
          </div>
        </div>

        {/* COMISSÃO */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Intermediação / Comissão</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="comissao_beneficiario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Corretor(a)</FormLabel>
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
              name="comissao_percentual"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comissão (%)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="0.1" placeholder="Ex: 5" {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Percentual sobre o preço total. O contrato calcula o valor em reais e escreve
                    por extenso.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="comissao_responsavel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comissão a cargo de *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COMISSAO_RESPONSAVEL_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o === 'proprietario' ? 'Proprietário(s)' : 'Proponente(s)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Quem paga a corretagem sai nominalmente na cláusula da intermediação.
                  </p>
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

        <BotaoDadosTeste
          onClick={() => {
            form.reset(reservaPropostaMockData)
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
