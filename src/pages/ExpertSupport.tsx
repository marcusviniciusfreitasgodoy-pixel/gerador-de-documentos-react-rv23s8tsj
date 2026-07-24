import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Loader2,
  Plus,
  Headset,
  Clock,
  ShieldAlert,
  UserCheck,
  ShieldCheck,
  FileSignature,
  Scale,
  GraduationCap,
  Building,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import {
  listRequests,
  objectiveLabels,
  urgencyLabels,
  statusLabels,
  statusBadgeClasses,
  urgencyBadgeClasses,
  type ExpertSupportRequest,
  type ExpertObjective,
  type ExpertUrgency,
  type ExpertStatus,
  ESPECIALISTA_INTRO,
  ESPECIALISTA_PILARES,
  type EspecialistaPilarId,
} from '@/services/expert'
import { getErrorMessage } from '@/lib/pocketbase/errors'

// Ícone e cor de cada pilar: layout mora aqui, texto mora em `services/expert`
// (que é .ts e não comporta JSX). A chave é o `id` do pilar.
const PILAR_ESTILO: Record<
  EspecialistaPilarId,
  { Icone: typeof FileSignature; caixa: string; icone: string; badge: string; enfeite: string }
> = {
  registral: {
    Icone: FileSignature,
    caixa: 'bg-blue-100 border-blue-200/50',
    icone: 'text-blue-700',
    badge: 'border-blue-200 text-blue-800 bg-blue-50',
    enfeite: 'bg-blue-50',
  },
  juridica: {
    Icone: Scale,
    caixa: 'bg-indigo-100 border-indigo-200/50',
    icone: 'text-indigo-700',
    badge: 'border-indigo-200 text-indigo-800 bg-indigo-50',
    enfeite: 'bg-indigo-50',
  },
  legislacao: {
    Icone: GraduationCap,
    caixa: 'bg-emerald-100 border-emerald-200/50',
    icone: 'text-emerald-700',
    badge: 'border-emerald-200 text-emerald-800 bg-emerald-50',
    enfeite: 'bg-emerald-50',
  },
  mercado: {
    Icone: Building,
    caixa: 'bg-amber-100 border-amber-200/50',
    icone: 'text-amber-700',
    badge: 'border-amber-200 text-amber-800 bg-amber-50',
    enfeite: 'bg-amber-50',
  },
}

export default function ExpertSupportPage() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const [requests, setRequests] = useState<ExpertSupportRequest[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const data = await listRequests(isAdmin)
      // Escalados primeiro (para o especialista/admin priorizar quem pediu análise).
      // Array.sort é estável, então dentro de cada grupo a ordem por -created é preservada.
      const sorted = [...data].sort(
        (a, b) => (b.escalated === 'true' ? 1 : 0) - (a.escalated === 'true' ? 1 : 0),
      )
      setRequests(sorted)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [isAdmin])

  useEffect(() => {
    loadData()
  }, [loadData])
  useRealtime('expert_support_requests', () => loadData())
  useRealtime('expert_proposals', () => loadData())

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl space-y-4 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <Headset className="h-6 w-6 text-primary shrink-0" />
          ) : (
            <UserCheck className="h-7 w-7 text-primary shrink-0" />
          )}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-primary">
              {isAdmin ? 'Solicitações (Especialista)' : 'Suporte Especializado'}
            </h2>
            {!isAdmin && (
              <p className="text-sm text-muted-foreground mt-0.5">
                Escalone casos complexos para o nosso Especialista e Escrevente Notarial.
              </p>
            )}
          </div>
        </div>
        <Button size="sm" className="shrink-0" onClick={() => navigate('/especialista/nova')}>
          <Plus className="mr-1 h-4 w-4" /> Nova solicitação
        </Button>
      </div>

      {/* Quem vai atender: aparece para todos. Para o corretor é a apresentação
          da equipe antes de abrir o chamado; para o admin/especialista fica como
          a credencial pública que ele apresenta (mesma que o corretor lê). */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-primary/5 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
        <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
          <ShieldCheck className="h-48 w-48 text-primary" />
        </div>
        <div className="hidden md:flex h-14 w-14 rounded-2xl bg-primary/10 items-center justify-center shrink-0">
          <UserCheck className="h-7 w-7 text-primary" />
        </div>
        <div className="relative z-10 flex-1">
          <Badge
            variant="outline"
            className="bg-background border-primary/20 text-primary hover:bg-background mb-2 font-semibold"
          >
            Autoridade &amp; Experiência
          </Badge>
          <h3 className="text-lg md:text-xl font-bold text-primary mb-1.5">
            Especialista e Escrevente Notarial
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            {ESPECIALISTA_INTRO}
          </p>
        </div>
      </div>

      <div className="pt-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary">Quadro de Conhecimento e Segurança</h3>
            <p className="text-sm text-muted-foreground">
              Os pilares que garantem a segurança jurídica das suas operações.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {ESPECIALISTA_PILARES.map((pilar) => {
            const estilo = PILAR_ESTILO[pilar.id]
            const { Icone } = estilo
            return (
              <Card
                key={pilar.id}
                className="border-border/60 shadow-sm hover:shadow-elevation transition-shadow overflow-hidden group"
              >
                <CardContent className="p-5 relative">
                  <div
                    className={`absolute top-0 right-0 h-24 w-24 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform duration-500 group-hover:scale-125 ${estilo.enfeite}`}
                  />
                  <div
                    className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 relative z-10 border ${estilo.caixa}`}
                  >
                    <Icone className={`h-6 w-6 ${estilo.icone}`} />
                  </div>
                  <Badge variant="outline" className={`mb-2 font-semibold ${estilo.badge}`}>
                    {pilar.badge}
                  </Badge>
                  <h4 className="font-bold text-primary mb-1.5">{pilar.titulo}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{pilar.desc}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <h3 className="text-base font-semibold text-primary pt-2">
        {isAdmin ? 'Solicitações recebidas' : 'Minhas Solicitações'}
      </h3>

      {requests.length === 0 ? (
        <Card className="shadow-elevation border-0 md:border md:border-border/60">
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhuma solicitação encontrada.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <Card
              key={req.id}
              className={`shadow-sm border-0 md:border hover:shadow-elevation transition-shadow cursor-pointer ${
                req.escalated === 'true'
                  ? 'md:border-amber-300 bg-amber-50/30'
                  : 'md:border-border/60'
              }`}
              onClick={() => navigate(`/especialista/${req.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-primary">
                      {objectiveLabels[req.objective as ExpertObjective] || req.objective}
                    </h3>
                    {req.document_type && (
                      <p className="text-sm text-muted-foreground mt-0.5">{req.document_type}</p>
                    )}
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {req.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {req.escalated === 'true' && (
                        <Badge className="bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-100">
                          <ShieldAlert className="h-3 w-3 mr-1" /> Escalado
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className={urgencyBadgeClasses[req.urgency as ExpertUrgency] || ''}
                      >
                        {urgencyLabels[req.urgency as ExpertUrgency] || req.urgency}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />{' '}
                        {new Date(req.created).toLocaleDateString('pt-BR')}
                      </span>
                      {isAdmin && req.expand?.user && (
                        <span className="text-xs text-muted-foreground">
                          {req.expand.user.email}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge
                    className={
                      statusBadgeClasses[req.status as ExpertStatus] ||
                      'bg-slate-100 text-slate-700'
                    }
                  >
                    {statusLabels[req.status as ExpertStatus] || req.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Ajuda e Suporte (decisão do Marcus, 2026-07-24): FAQ com o funcionamento da
// plataforma + canal aberto de sugestões e chamados (coleção `chamados`).
// Mora neste arquivo porque o Skip não cria arquivo novo; a rota é /ajuda.
// ============================================================================
import { LifeBuoy, MessageSquarePlus, Send as SendIcon } from 'lucide-react'
import { IntroPagina } from '@/components/Layout'
import pb from '@/lib/pocketbase/client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const TIPOS_CHAMADO = [
  { valor: 'sugestao', rotulo: 'Sugestão de melhoria' },
  { valor: 'correcao', rotulo: 'Correção de erro' },
  { valor: 'suporte', rotulo: 'Suporte / dificuldade de uso' },
  { valor: 'duvida', rotulo: 'Dúvida sobre a plataforma' },
]

const STATUS_CHAMADO: Record<string, { rotulo: string; classe: string }> = {
  aberto: { rotulo: 'Aberto', classe: 'bg-primary/10 text-primary' },
  em_andamento: { rotulo: 'Em andamento', classe: 'bg-amber-500/10 text-amber-600' },
  resolvido: { rotulo: 'Resolvido', classe: 'bg-emerald-500/10 text-emerald-600' },
}

type Chamado = {
  id: string
  tipo: string
  mensagem: string
  status: string
  resposta?: string
  created: string
}

const FAQ: { pergunta: string; resposta: string }[] = [
  {
    pergunta: 'Por onde eu começo?',
    resposta:
      'Três passos: 1) preencha o seu Perfil do Corretor (nome, CRECI e comissão), porque os contratos imprimem esses dados; 2) cadastre um Negócio com as partes e o imóvel; 3) escolha um documento no hub e clique em Gerar. O arquivo sai pronto em Word.',
  },
  {
    pergunta: 'O que é um Negócio e por que cadastrar um?',
    resposta:
      'O Negócio é o dossiê da operação: as partes (vendedores, compradores, cônjuges) e o imóvel, cadastrados uma única vez. Todos os documentos da mesma operação puxam os dados de lá. Você evita redigitação e, principalmente, evita divergência de dados entre documentos.',
  },
  {
    pergunta: 'Quais documentos a plataforma gera?',
    resposta:
      'O ciclo completo da intermediação: Autorização de Venda, Proposta e Reserva, Recibo de Sinal, as Promessas de Compra e Venda (à vista, financiada, com FGTS, com dação e a versão simplificada), Compromisso particular, Permuta, Distrato, Autorização de Intermediação, Termo de Entrega das Chaves, Termo de Posse e Checklist de documentos.',
  },
  {
    pergunta: 'Como preencho um formulário mais rápido?',
    resposta:
      'Duas ferramentas: o botão Carregar de um Negócio, que puxa as partes e o imóvel do dossiê escolhido, e o Preenchimento automático por documentos, que lê fotos ou PDFs (RG, escritura, matrícula) com IA e sugere os campos. Revise sempre antes de gerar.',
  },
  {
    pergunta: 'O documento gerado pode ser editado?',
    resposta:
      'Sim. Tudo sai em Word (.docx) editável. A plataforma entrega a minuta pronta e padronizada, e você ajusta o que for específico da sua negociação antes de colher assinaturas.',
  },
  {
    pergunta: 'O que é a Validação de Minuta?',
    resposta:
      'Você cola o texto de um contrato (seu ou de terceiros) e a plataforma revisa com IA usando uma régua jurídica interna: aponta cláusulas ausentes, riscos e não conformidades, item por item. Use antes de assinar qualquer minuta que não saiu daqui.',
  },
  {
    pergunta: 'O que é o Suporte Especializado?',
    resposta:
      'É o canal para casos que pedem um olhar humano especializado: você descreve o caso, recebe uma primeira análise com IA e, quando precisa, uma proposta de trabalho do especialista com escopo, prazo e valor, que você aceita ou recusa dentro do app.',
  },
  {
    pergunta: 'Como funciona o meu acesso?',
    resposta:
      'O cadastro é aberto: você cria a conta, recebe um e-mail de confirmação e o acesso libera na hora do clique, sem depender de ninguém. Esqueceu a senha? Na tela de login há o botão Esqueci minha senha, que envia o link de redefinição por e-mail.',
  },
  {
    pergunta: 'Meus dados estão protegidos?',
    resposta:
      'Os dados dos seus Negócios pertencem à sua conta: cada corretor enxerga somente o que é seu. Os textos enviados à Validação de Minuta são apagados automaticamente após 30 dias, em linha com a LGPD.',
  },
  {
    pergunta: 'Encontrei um erro ou tenho uma sugestão. O que eu faço?',
    resposta:
      'Use a aba Sugestões e chamados aqui desta página. Descreva o que aconteceu (ou a sua ideia), envie e acompanhe o andamento por aqui mesmo. O administrador é avisado por e-mail na hora.',
  },
]

export function AjudaSuportePage() {
  const { user } = useAuth()
  const [tipo, setTipo] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [chamados, setChamados] = useState<Chamado[]>([])
  const [carregando, setCarregando] = useState(true)

  const carregar = useCallback(async () => {
    if (!user?.id) return
    try {
      const lista = await pb.collection('chamados').getFullList<Chamado>({
        filter: `user = "${user.id}"`,
        sort: '-created',
      })
      setChamados(lista)
    } catch {
      // Sem toast: a lista vazia com o formulário em cima já conta a história.
    } finally {
      setCarregando(false)
    }
  }, [user?.id])

  useEffect(() => {
    carregar()
  }, [carregar])

  const enviar = async () => {
    if (!tipo) {
      toast.error('Escolha o tipo do chamado.')
      return
    }
    if (mensagem.trim().length < 10) {
      toast.error('Descreva com um pouco mais de detalhe (mínimo de 10 caracteres).')
      return
    }
    setEnviando(true)
    try {
      await pb.collection('chamados').create({
        user: user?.id,
        tipo,
        mensagem: mensagem.trim(),
        status: 'aberto',
      })
      toast.success('Chamado enviado! Você acompanha o andamento aqui nesta página.')
      setTipo('')
      setMensagem('')
      await carregar()
    } catch {
      toast.error('Não foi possível enviar agora. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-medium text-foreground flex items-center gap-2">
          <LifeBuoy className="h-7 w-7 text-primary" /> Ajuda e Suporte
        </h1>
        <IntroPagina frase="Tire dúvidas sobre o funcionamento da plataforma e fale com a gente: sugestões, correções e pedidos de suporte entram por aqui e você acompanha a resposta na mesma tela." />
      </div>

      <Tabs defaultValue="faq" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="faq">Dúvidas frequentes</TabsTrigger>
          <TabsTrigger value="chamados">Sugestões e chamados</TabsTrigger>
        </TabsList>

        <TabsContent value="faq">
          <Card className="shadow-elevation border-0 md:border md:border-border/60">
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                {FAQ.map((item, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left text-sm font-medium">
                      {item.pergunta}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                      {item.resposta}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chamados" className="space-y-4">
          <Card className="shadow-elevation border-0 md:border md:border-border/60">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <MessageSquarePlus className="h-4 w-4 text-primary" /> Novo chamado
              </div>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo do chamado" />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_CHAMADO.map((t) => (
                    <SelectItem key={t.valor} value={t.valor}>
                      {t.rotulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Conte o que aconteceu ou descreva a sua ideia. Quanto mais detalhe, mais rápido conseguimos ajudar."
                rows={5}
              />
              <Button onClick={enviar} disabled={enviando} className="w-full sm:w-auto">
                {enviando ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
                  </>
                ) : (
                  <>
                    <SendIcon className="mr-2 h-4 w-4" /> Enviar chamado
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h2 className="text-sm font-medium text-foreground">Meus chamados</h2>
            {carregando ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : chamados.length === 0 ? (
              <p className="text-sm text-muted-foreground">Você ainda não abriu nenhum chamado.</p>
            ) : (
              chamados.map((c) => {
                const st = STATUS_CHAMADO[c.status] ?? STATUS_CHAMADO.aberto
                const tp = TIPOS_CHAMADO.find((t) => t.valor === c.tipo)
                return (
                  <Card key={c.id} className="border border-border/60">
                    <CardContent className="pt-4 pb-4 space-y-2">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-xs font-medium text-muted-foreground">
                          {tp ? tp.rotulo : c.tipo}
                        </span>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${st.classe}`}
                        >
                          {st.rotulo}
                        </span>
                      </div>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{c.mensagem}</p>
                      {c.resposta ? (
                        <div className="rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">Resposta: </span>
                          {c.resposta}
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
