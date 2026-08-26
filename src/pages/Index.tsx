import { useState, useEffect, useRef } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Loader2,
  ArrowLeft,
  Download,
  Building2,
  FileCheck2,
  Users,
  FileSignature,
  FileSearch,
  Briefcase,
  CheckCircle2,
  Circle,
} from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate, Link } from 'react-router-dom'
import {
  IntermediationForm,
  ReciboComissaoForm,
  CorretagemForm,
} from '@/components/IntermediationForm'
import { PromiseForm } from '@/components/PromiseForm'
import { PromessaAvistaForm } from '@/components/PromessaAvistaForm'
import { PromessaFinanciadaForm } from '@/components/PromessaFinanciadaForm'
import { TermoChavesForm, ChavesPosseForm } from '@/components/TermoChavesForm'
import { TermoPosseForm } from '@/components/TermoPosseForm'
import { ChecklistForm } from '@/components/ChecklistForm'
import {
  CarregarDeNegocio,
  DocumentoGerado,
  useNegocioSyncPlano,
} from '@/components/CarregarDeNegocio'
import { aplicarRecibo, MAPA_RECIBO } from '@/lib/aplicar-negocio'
import type { ResultadoVolta } from '@/lib/aplicar-negocio'
import { garantirNegocioDaOperacao, operacaoDoFormularioPlano } from '@/lib/negocioAutomatico'
import { PromessaFgtsForm } from '@/components/PromessaFgtsForm'
import { PromessaDacaoForm } from '@/components/PromessaDacaoForm'
import { reciboMockData } from '@/lib/form-helpers'
import pb from '@/lib/pocketbase/client'
import { getBrokerProfile } from '@/services/broker-profile'

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
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
import { PartyFields } from '@/components/PartyFields'
import { maskCurrency, maskCpf } from '@/lib/utils'
import {
  formSchema,
  type FormValues,
  FORMA_PAGAMENTO_OPTIONS,
  buildTemplateData,
  ARRAS_OPTIONS,
  getArrasResumo,
} from '@/lib/form-helpers'
import { generateDocx, getReciboText } from '@/lib/docx-generator'

type DocKey =
  | 'recibo'
  | 'intermediation'
  | 'promise'
  | 'compromisso'
  | 'compromissoFinanciado'
  | 'compromissoFgts'
  | 'compromissoDacao'
  | 'corretagem'
  | 'reciboComissao'
  | 'chavesPosse'
  | 'termoChaves'
  | 'termoPosse'
  | 'checklist'

interface DocDef {
  key?: DocKey
  href?: string
  title: string
  // uma linha, em português simples — é o que o card mostra sempre.
  desc: string
  // 1–2 frases que EXPLICAM o documento para quem não é do ramo (o que é, quando
  // usar); aparece ao passar o mouse / focar o card. Sem ela, o card fica só com
  // o `desc`. A separação existe para o card ficar enxuto E o leigo ter onde
  // entender o termo, sem poluir a grade.
  ajuda?: string
  // Ocupa a linha inteira da grade (usado no Distrato, que fecha o negócio e
  // sobra sozinho na última fila — cheio, não fica um card órfão à esquerda).
  wide?: boolean
}

// Registro único dos documentos: alimenta o hub E o título do formulário.
// Fonte única de verdade, substitui o ternário de títulos (que errava a
// financiada) e garante que todo documento tenha entrada no hub.
// Ordem = a jornada real da operação, da captação ao encerramento. O `hint` de
// cada grupo situa quem não conhece a taxonomia jurídica. O `desc` de cada
// documento é português do dia a dia; o termo técnico (arras, dação, tradição)
// mora no `ajuda`, explicado — não no rótulo que o leigo lê primeiro.
// Exportada para as páginas de rota própria (Permuta, Proposta, Distrato)
// reusarem a MESMA explicação leiga do hub, sem segunda cópia de redação.
// O FAQ da pagina /ajuda listava os documentos numa frase escrita a mao, que ja
// tinha divergido do hub (citava "Compromisso particular" e "Autorizacao de
// Intermediacao", nomes que nao existem aqui). Agora ele monta a resposta a
// partir DESTA lista, entao um documento novo aparece no FAQ sozinho.
export function listarDocumentosPorGrupo(): { grupo: string; titulos: string[] }[] {
  return DOC_GROUPS.map((g) => ({ grupo: g.label, titulos: g.docs.map((d) => d.title) }))
}

export function ajudaDoc(href: string): string | undefined {
  for (const g of DOC_GROUPS) for (const d of g.docs) if (d.href === href) return d.ajuda
  return undefined
}

const DOC_GROUPS: { label: string; hint: string; docs: DocDef[] }[] = [
  {
    label: 'Captação e pré-contrato',
    hint: 'Onde a operação começa',
    docs: [
      {
        key: 'intermediation',
        title: 'Autorização de Venda',
        desc: 'O dono autoriza você a vender o imóvel',
        ajuda:
          'O primeiro passo: o proprietário autoriza você, corretor, a anunciar e vender o imóvel dele. Pode ser exclusiva (só você vende) ou não, e já define sua comissão e o prazo.',
      },
      {
        href: '/proposta-reserva',
        title: 'Proposta e Reserva',
        desc: 'O comprador faz a oferta e reserva o imóvel',
        ajuda:
          'Quando alguém decide comprar, este documento registra a oferta (valor e condições) e segura o imóvel para essa pessoa, em geral com um sinal. É o passo antes da promessa.',
      },
      {
        key: 'recibo',
        title: 'Recibo de Sinal',
        desc: 'Comprova o pagamento da entrada (sinal)',
        ajuda:
          'Comprova que o comprador pagou o sinal, o valor de entrada que confirma o compromisso. Se alguém desistir, o sinal define quem perde ou devolve quanto (na lei, as "arras", arts. 417 a 420).',
      },
      {
        key: 'corretagem',
        title: 'Contrato de Corretagem',
        desc: 'Combina por escrito quanto e quando você recebe',
        ajuda:
          'O contrato dos seus honorários. Fixa o percentual, o vencimento e a exclusividade, e garante a comissão mesmo se as partes se arrependerem depois de o negócio estar fechado (arts. 725 e 727 do Código Civil).',
      },
      {
        key: 'checklist',
        title: 'Checklist Documental',
        desc: 'Lista para conferir os documentos da operação',
        ajuda:
          'Uma lista para conferir se todos os documentos das partes e do imóvel estão reunidos e corretos antes de fechar. Evita surpresas na hora do cartório.',
      },
    ],
  },
  {
    label: 'Promessas de compra e venda',
    hint: 'O núcleo do negócio',
    docs: [
      {
        key: 'compromisso',
        title: 'À vista',
        desc: 'Pagamento com recursos próprios, sem banco',
        ajuda:
          'O comprador paga o imóvel com dinheiro próprio (normalmente sinal, reforço e saldo), sem financiamento. É a promessa de venda mais direta.',
      },
      {
        key: 'compromissoFinanciado',
        title: 'Financiada',
        desc: 'Parte do pagamento vem de financiamento bancário',
        ajuda:
          'O comprador paga uma parte com recursos próprios e o restante com financiamento de um banco. A promessa acompanha o processo até o banco liberar o valor.',
      },
      {
        key: 'compromissoFgts',
        title: 'Com FGTS',
        desc: 'O comprador usa o saldo do FGTS na compra',
        ajuda:
          'O comprador usa o dinheiro da conta do FGTS para pagar o imóvel, sem financiamento bancário. Comum na compra do primeiro imóvel.',
      },
      {
        key: 'compromissoDacao',
        title: 'Com dação em pagamento',
        desc: 'Parte do preço é paga com outro bem',
        ajuda:
          'Em vez de pagar tudo em dinheiro, o comprador entrega outro bem (um carro, outro imóvel) como parte do pagamento. "Dação" quer dizer dar um bem no lugar do dinheiro.',
      },
      {
        key: 'promise',
        title: 'Simplificada',
        desc: 'Versão enxuta da promessa, para casos diretos',
        ajuda:
          'Uma promessa de compra e venda mais curta, só com as cláusulas essenciais. Boa para negócios simples que não precisam de todas as previsões de um contrato completo.',
      },
      {
        href: '/permuta',
        title: 'Permuta',
        desc: 'Troca de um imóvel por outro',
        ajuda:
          'Duas partes trocam imóveis entre si. Se um vale mais que o outro, a diferença é paga em dinheiro, a chamada "torna".',
      },
    ],
  },
  {
    label: 'Execução e encerramento',
    hint: 'Depois de assinado. Na dúvida entre os três termos de entrega, use o combinado: ele cobre o caso normal, em que chaves e posse saem no mesmo dia',
    docs: [
      {
        key: 'chavesPosse',
        title: 'Entrega de Chaves e Posse',
        desc: 'Entrega as chaves e passa a posse no mesmo ato',
        ajuda:
          'O caso mais comum: o comprador quitou, recebe as chaves e assume o imóvel na mesma data. Um documento só, com a relação de chaves, a leitura dos medidores e a autorização de mudança para mostrar na portaria.',
      },
      {
        key: 'termoChaves',
        title: 'Entrega das Chaves',
        desc: 'Só a entrega física, sem passar a posse',
        ajuda:
          'Use quando o comprador precisa entrar no imóvel mas ainda não assume a posse: acesso para reforma, medição ou vistoria técnica. Registra chaves e medidores, sem transmitir posse.',
      },
      {
        key: 'termoPosse',
        title: 'Transmissão da Posse',
        desc: 'Só a posse, quando as chaves já foram entregues',
        ajuda:
          'Use quando a posse é passada em momento diferente da entrega das chaves, como na posse antecipada, em que o comprador entra antes de quitar o preço.',
      },
      {
        key: 'reciboComissao',
        title: 'Recibo de Comissão',
        desc: 'Comprova que você recebeu a sua corretagem',
        ajuda:
          'O comprovante de que a comissão foi paga a você. Dá quitação ao pagador, registra o valor e a forma, e amarra o pagamento ao negócio que o gerou. Use um a cada parcela recebida.',
      },
      {
        href: '/distrato',
        title: 'Distrato',
        desc: 'Desfaz o negócio, de comum acordo entre as partes',
        ajuda:
          'Quando as duas partes concordam em cancelar um contrato já assinado, o distrato encerra tudo e acerta a devolução de valores, dando quitação recíproca (nada mais é devido de parte a parte).',
      },
    ],
  },
]

const DOC_TITLES: Record<DocKey, string> = {
  recibo: 'Recibo de Sinal e Princípio de Pagamento (Arras)',
  intermediation: 'Autorização para Divulgação e Venda de Imóvel',
  promise: 'Promessa de Compra e Venda (Simplificada)',
  compromisso: 'Promessa / Compromisso de Compra e Venda (à vista)',
  compromissoFinanciado: 'Promessa / Compromisso de Compra e Venda (financiada)',
  compromissoFgts: 'Promessa com FGTS (sem financiamento)',
  compromissoDacao: 'Promessa com Dação em Pagamento',
  corretagem: 'Contrato de Corretagem e Honorários de Intermediação',
  reciboComissao: 'Recibo de Comissão de Corretagem',
  chavesPosse: 'Termo de Entrega de Chaves e Transmissão da Posse',
  termoChaves: 'Termo de Entrega das Chaves',
  termoPosse: 'Termo de Transmissão da Posse',
  checklist: 'Checklist Documental',
}

const DOC_CARD_CLASS =
  'block w-full h-full rounded-lg border border-border bg-card p-4 text-left shadow-subtle hover:border-primary/60 hover:shadow-elevation transition-all duration-200'

export default function Index() {
  const [isGenerating, setIsGenerating] = useState(false)

  // Onboarding do hub: os dois pré-requisitos reais de uso (perfil preenchido e
  // um negócio cadastrado). O checklist aparece enquanto faltar um deles e some
  // sozinho quando os dois existem — não é um tour, é o caminho mínimo até o
  // primeiro documento bem gerado. Recarrega a cada volta ao hub (remount).
  const [onboarding, setOnboarding] = useState<{
    carregado: boolean
    perfilOk: boolean
    negocioOk: boolean
  }>({ carregado: false, perfilOk: false, negocioOk: false })

  useEffect(() => {
    let cancelado = false
    Promise.all([
      getBrokerProfile().catch(() => null),
      pb
        .collection('negocios')
        .getList(1, 1)
        .catch(() => ({ totalItems: 0 })),
    ]).then(([perfil, negocios]) => {
      if (cancelado) return
      setOnboarding({
        carregado: true,
        perfilOk: !!perfil?.name,
        negocioOk: (negocios?.totalItems ?? 0) > 0,
      })
    })
    return () => {
      cancelado = true
    }
  }, [])
  const [isValidating, setIsValidating] = useState(false)
  const navigate = useNavigate()
  const [docType, setDocType] = useState<DocKey | null>(null)
  // Fase 4 (Recibo): tela de sucesso + re-aplicar negócio no "Gerar outro".
  const [gerado, setGerado] = useState(false)
  const reaplicarNegocioRef = useRef<(() => void) | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vendedor_nome: '',
      vendedor_nacionalidade: 'brasileiro(a)',
      vendedor_estado_civil: '',
      vendedor_regime_bens: '',
      vendedor_profissao: '',
      vendedor_rg: '',
      vendedor_cpf: '',
      vendedor_endereco: '',
      comprador_nome: '',
      comprador_nacionalidade: 'brasileiro(a)',
      comprador_estado_civil: '',
      comprador_regime_bens: '',
      comprador_profissao: '',
      comprador_rg: '',
      comprador_cpf: '',
      comprador_endereco: '',
      imovel_descricao: '',
      imovel_matricula: '',
      imovel_ri_numero: '',
      imovel_comarca: '',
      imovel_iptu: '',
      valor_sinal: '',
      valor_total: '',
      forma_pagamento: '',
      natureza_arras: 'confirmatoria',
      prazo_formalizacao_dias: '',
      prazo_restituicao_dias: '',
      foro_comarca: '',
      testemunha1_nome: '',
      testemunha1_cpf: '',
      testemunha2_nome: '',
      testemunha2_cpf: '',
    },
  })

  // C4 Lote 2: volta pro dossiê no Recibo (documento de partes planas).
  const { registrarNegocio, calcular, gravar, negocioAtual, resnapshot } = useNegocioSyncPlano(
    form,
    MAPA_RECIBO,
  )
  const [voltaPendente, setVoltaPendente] = useState<ResultadoVolta | null>(null)

  // Foro/assinatura do recibo acompanham a comarca do imóvel — e param de acompanhar
  // assim que o corretor digita no campo. cidade_uf (local da assinatura) deriva de
  // foro_comarca no buildTemplateData, então os dois seguem a comarca.
  const foroImovelComarca = useWatch({ control: form.control, name: 'imovel_comarca' })
  const foroReciboEditado = !!form.formState.dirtyFields.foro_comarca
  useEffect(() => {
    if (!foroReciboEditado) form.setValue('foro_comarca', foroImovelComarca || '')
  }, [foroImovelComarca, foroReciboEditado, form])

  const onSubmit = async (data: FormValues) => {
    setIsGenerating(true)
    try {
      await generateDocx(buildTemplateData(data))
      toast.success('Documento gerado com sucesso!')
      setGerado(true)
      // C4: o documento JÁ saiu. Só agora oferecemos atualizar o dossiê.
      setVoltaPendente(calcular())
      // O documento JA saiu: so agora o negocio da operacao e garantido.
      // `garantirNegocioDaOperacao` nunca lanca, entao falha de rede aqui nao
      // chega ao corretor, que ja tem o arquivo na maquina.
      await garantirNegocioDaOperacao(
        operacaoDoFormularioPlano(data as unknown as Record<string, unknown>, MAPA_RECIBO),
        negocioAtual(),
      )
    } catch (error) {
      console.error('Erro ao gerar documento:', error)
      toast.error('Ocorreu um erro ao gerar o documento.')
    } finally {
      setIsGenerating(false)
    }
  }

  const onValidateRecibo = async () => {
    setIsValidating(true)
    try {
      const texto = await getReciboText(buildTemplateData(form.getValues()))
      navigate('/validar', { state: { texto, tipo: 'Recibo de Sinal (Arras)' } })
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
    setGerado(false)
  }

  // Hub: nenhum documento selecionado -> grade de documentos por categoria.
  if (docType === null) {
    return (
      <div className="w-full max-w-4xl space-y-10 animate-fade-in-up">
        <div className="space-y-3">
          <p className="font-mono text-[11px] tracking-[0.35em] uppercase text-primary">
            Prime Circle
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-medium text-foreground">Docs</h1>
          <p className="text-muted-foreground max-w-xl">
            Gere, valide e gerencie os instrumentos da operação imobiliária, do primeiro contato à
            entrega das chaves.
          </p>
        </div>

        {onboarding.carregado && !(onboarding.perfilOk && onboarding.negocioOk) && (
          <div className="rounded-xl border border-[#C9A84C]/40 bg-[#C9A84C]/5 p-5 space-y-4 animate-fade-in-up">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#C9A84C]">
              Primeiros passos
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                {onboarding.perfilOk ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${onboarding.perfilOk ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                  >
                    1. Complete seu Perfil do Corretor
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Seu nome, CRECI e chave PIX entram automaticamente na cláusula de corretagem de
                    todos os documentos.
                  </p>
                </div>
                {!onboarding.perfilOk && (
                  <Link
                    to="/perfil"
                    className="text-xs font-medium text-primary hover:underline shrink-0 mt-0.5"
                  >
                    Preencher →
                  </Link>
                )}
              </div>
              <div className="flex items-start gap-3">
                {onboarding.negocioOk ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${onboarding.negocioOk ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                  >
                    2. Cadastre seu primeiro Negócio
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Partes e imóvel digitados uma única vez: todos os documentos carregam de lá.
                  </p>
                </div>
                {!onboarding.negocioOk && (
                  <Link
                    to="/negocios"
                    className="text-xs font-medium text-primary hover:underline shrink-0 mt-0.5"
                  >
                    Cadastrar →
                  </Link>
                )}
              </div>
              <div className="flex items-start gap-3">
                <Circle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">3. Gere um documento</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Escolha um card abaixo, preencha os campos e clique em Gerar: o documento sai
                    pronto em Word (.docx), com os dados do seu Negócio já aplicados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <Link
          to="/negocios"
          className="block rounded-xl bg-[#0E0E0E] p-6 border border-transparent hover:border-[#C9A84C]/60 transition-colors group"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-[#C9A84C]/15 p-3 shrink-0">
                <Briefcase className="h-6 w-6 text-[#C9A84C]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#F5F1E6]">Negócios</h2>
                <p className="text-sm text-[#E8E0CC]/70 mt-1 max-w-lg">
                  O dossiê da operação: cadastre as partes e o imóvel uma única vez. Todos os
                  documentos carregam de lá.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline font-mono text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] mt-2 shrink-0 group-hover:translate-x-0.5 transition-transform">
              Abrir →
            </span>
          </div>
        </Link>

        {DOC_GROUPS.map((group) => (
          <div key={group.label} className="space-y-3">
            <div className="space-y-1">
              <p className="font-mono text-[11px] tracking-[0.35em] uppercase text-muted-foreground">
                {group.label}
              </p>
              <p className="text-xs text-muted-foreground/70">{group.hint}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.docs.map((doc) => {
                // Card enxuto (título + descrição leiga). O `ajuda`, quando existe,
                // vem no tooltip: hover no desktop, foco pelo teclado. No toque o
                // Radix não abre no tap, então o clique único segue abrindo o
                // documento normalmente — o `desc` já basta ali.
                const inner = (
                  <>
                    <h3 className="font-semibold text-foreground">{doc.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{doc.desc}</p>
                    {/* No celular não existe hover nem foco por teclado, então o
                        tooltip abaixo nunca abria: a explicação para leigo, que é
                        o que mais ajuda quem não é do ramo, simplesmente não
                        existia no aparelho onde o corretor mais trabalha. Aqui
                        ela vira texto normal do card e some a partir de lg, onde
                        o tooltip volta a funcionar. */}
                    {doc.ajuda && (
                      <p className="lg:hidden text-xs text-muted-foreground/75 mt-2 leading-relaxed">
                        {doc.ajuda}
                      </p>
                    )}
                  </>
                )
                const card = doc.href ? (
                  <Link to={doc.href} className={DOC_CARD_CLASS}>
                    {inner}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDocType(doc.key!)}
                    className={DOC_CARD_CLASS}
                  >
                    {inner}
                  </button>
                )
                const wrapClass = doc.wide ? 'sm:col-span-2 lg:col-span-3' : undefined
                return (
                  <div key={doc.key ?? doc.href} className={wrapClass}>
                    {doc.ajuda ? (
                      <Tooltip>
                        <TooltipTrigger asChild>{card}</TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-xs text-sm leading-relaxed">
                          {doc.ajuda}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      card
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className="w-full max-w-2xl shadow-elevation border-0 md:border md:border-border/60 animate-fade-in-up">
      <CardHeader className="space-y-3 pb-6">
        <button
          type="button"
          onClick={() => setDocType(null)}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" /> Todos os documentos
        </button>
        <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-primary">Documento</p>
        <CardTitle className="font-display text-3xl font-medium text-foreground">
          {DOC_TITLES[docType]}
        </CardTitle>
        <CardDescription>
          Preencha os dados para gerar o documento Word automaticamente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {docType === 'recibo' && gerado && (
          <>
            <DocumentoGerado
              onValidar={onValidateRecibo}
              onGerarOutro={handleGerarOutro}
              validando={isValidating}
            />
            <AlertDialog open={!!voltaPendente} onOpenChange={(o) => !o && setVoltaPendente(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Atualizar o Negócio?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Documento gerado. Estes são os {voltaPendente?.alteracoes.length} dado(s) que
                    você alterou aqui:
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
        )}
        {docType === 'recibo' && !gerado && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <CarregarDeNegocio
                form={form}
                aplicar={(n) => aplicarRecibo(form.setValue, n)}
                onNegocioAplicado={(fn) => {
                  reaplicarNegocioRef.current = fn
                }}
                onNegocioCarregado={registrarNegocio}
                negocioAtual={negocioAtual}
              />
              <PartyFields prefix="vendedor" title="Dados do Vendedor(a)" />
              <PartyFields prefix="comprador" title="Dados do Comprador(a)" />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-primary">Dados do Imóvel</h3>
                </div>
                <Separator />
                <FormField
                  control={form.control}
                  name="imovel_descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição do Imóvel</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ex: Apartamento nº 302, Edifício..."
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
                    control={form.control}
                    name="imovel_matricula"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Matrícula nº</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                        <FormLabel>Registro de Imóveis (nº)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="imovel_comarca"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comarca</FormLabel>
                        <FormControl>
                          <Input {...field} />
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

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-primary">Condições e Natureza das Arras</h3>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="valor_sinal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor do Sinal (R$)</FormLabel>
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
                    control={form.control}
                    name="valor_total"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor Total (R$)</FormLabel>
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
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="forma_pagamento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Forma de Pagamento</FormLabel>
                        <Select value={field.value || undefined} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione..." />
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
                    control={form.control}
                    name="natureza_arras"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Natureza das Arras</FormLabel>
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
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="prazo_formalizacao_dias"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prazo Formalização (dias)</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="prazo_restituicao_dias"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prazo Restituição (dias)</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} {...field} />
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
                        <FormLabel>Fórum/Comarca</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-primary">Testemunhas (Opcional)</h3>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="testemunha1_nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da 1ª Testemunha</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                        <FormLabel>CPF da 1ª Testemunha</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="000.000.000-00"
                            maxLength={14}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(maskCpf(e.target.value))}
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
                        <FormLabel>Nome da 2ª Testemunha</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                        <FormLabel>CPF da 2ª Testemunha</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="000.000.000-00"
                            maxLength={14}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(maskCpf(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <BotaoDadosTeste
                className="text-muted-foreground hover:text-foreground w-fit"
                onClick={() => {
                  form.reset(reciboMockData)
                  resnapshot()
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
                  onClick={onValidateRecibo}
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
        )}
        {docType === 'intermediation' && <IntermediationForm />}
        {docType === 'promise' && <PromiseForm />}
        {docType === 'compromisso' && <PromessaAvistaForm />}
        {docType === 'compromissoFinanciado' && <PromessaFinanciadaForm />}
        {docType === 'compromissoFgts' && <PromessaFgtsForm />}
        {docType === 'compromissoDacao' && <PromessaDacaoForm />}
        {docType === 'corretagem' && <CorretagemForm />}
        {docType === 'reciboComissao' && <ReciboComissaoForm />}
        {docType === 'chavesPosse' && <ChavesPosseForm />}
        {docType === 'termoChaves' && <TermoChavesForm />}
        {docType === 'termoPosse' && <TermoPosseForm />}
        {docType === 'checklist' && <ChecklistForm />}
      </CardContent>
    </Card>
  )
}
