import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Loader2,
  ArrowLeft,
  Paperclip,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { ProposalForm } from '@/components/ProposalForm'
import {
  getRequest,
  listProposals,
  respondProposal,
  setRequestStatus,
  consultarIA,
  normalizeAttachments,
  getAttachmentUrl,
  objectiveLabels,
  urgencyLabels,
  statusLabels,
  complexityLabels,
  proposalResponseLabels,
  statusBadgeClasses,
  urgencyBadgeClasses,
  proposalResponseBadgeClasses,
  type ExpertSupportRequest,
  type ExpertProposal,
  type ExpertObjective,
  type ExpertUrgency,
  type ExpertStatus,
  type ComplexityType,
  type ProposalResponse,
} from '@/services/expert'
import { getErrorMessage } from '@/lib/pocketbase/errors'

// Objetivos que naturalmente pedem o especialista humano (Nível 2).
const NEEDS_HUMAN_OBJECTIVES = ['full_review', 'risk_analysis', 'doc_analysis']

const ESPECIALISTA_PILARES = [
  {
    titulo: 'Escrevente Notarial',
    desc: 'Vasta prática em registros públicos e análise de documentações complexas e matrículas.',
  },
  {
    titulo: 'Prevenção de Riscos',
    desc: 'Bacharelado em Direito com foco na elaboração segura de contratos e mitigação de litígios.',
  },
  {
    titulo: 'Especialização',
    desc: 'Pós-graduação em Direito Imobiliário, atualizado com as leis e normas regulamentares.',
  },
  {
    titulo: 'Experiência Prática',
    desc: 'Conhecimento profundo das práticas reais do mercado imobiliário do Rio de Janeiro.',
  },
]

export default function ExpertSupportDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  const [request, setRequest] = useState<ExpertSupportRequest | null>(null)
  const [proposals, setProposals] = useState<ExpertProposal[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(false)
  const [consulting, setConsulting] = useState(false)

  const loadData = useCallback(async () => {
    if (!id) return
    try {
      const req = await getRequest(id)
      setRequest(req)
      const props = await listProposals(id)
      setProposals(props)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadData()
  }, [loadData])
  useRealtime('expert_support_requests', () => loadData())
  useRealtime('expert_proposals', () => loadData())

  const isOwner = request?.user === user?.id
  const latestProposal = proposals[0]
  const canRespond =
    isOwner && request?.status === 'proposal_issued' && latestProposal?.user_response === 'none'

  const handleRespond = async (response: 'accepted' | 'refused') => {
    if (!latestProposal || !request) return
    setActing(true)
    try {
      await respondProposal(latestProposal.id, request.id, response)
      toast.success(response === 'accepted' ? 'Proposta aceita!' : 'Proposta recusada!')
      await loadData()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setActing(false)
    }
  }

  const handleComplete = async () => {
    if (!request) return
    setActing(true)
    try {
      await setRequestStatus(request.id, 'completed')
      toast.success('Solicitação concluída!')
      await loadData()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setActing(false)
    }
  }

  const handleConsultarIA = async () => {
    if (!request) return
    setConsulting(true)
    try {
      await consultarIA(request.id)
      toast.success('Resposta da IA gerada!')
      await loadData()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setConsulting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!request) {
    return <p className="text-center text-muted-foreground py-12">Solicitação não encontrada.</p>
  }

  const attachments = normalizeAttachments(request.attachments)
  const recommendsHuman =
    request.ai_recommends_human === 'true' || NEEDS_HUMAN_OBJECTIVES.includes(request.objective)
  const showEspecialista =
    isOwner &&
    request.status !== 'accepted' &&
    request.status !== 'refused' &&
    request.status !== 'completed'

  return (
    <div className="w-full max-w-3xl space-y-6 animate-fade-in-up">
      <Button variant="ghost" size="sm" onClick={() => navigate('/especialista')}>
        <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
      </Button>

      <Card className="shadow-elevation border-0 md:border md:border-border/60">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle className="text-xl text-primary">
                {objectiveLabels[request.objective as ExpertObjective] || request.objective}
              </CardTitle>
              <CardDescription className="mt-1">
                {request.document_type && <span>{request.document_type} · </span>}
                Criada em {new Date(request.created).toLocaleDateString('pt-BR')}
              </CardDescription>
            </div>
            <Badge className={statusBadgeClasses[request.status as ExpertStatus] || ''}>
              {statusLabels[request.status as ExpertStatus] || request.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Urgência:</span>
            <Badge
              variant="outline"
              className={urgencyBadgeClasses[request.urgency as ExpertUrgency] || ''}
            >
              {urgencyLabels[request.urgency as ExpertUrgency] || request.urgency}
            </Badge>
          </div>
          {isAdmin && request.expand?.user && (
            <p className="text-sm text-muted-foreground">
              Solicitante: {request.expand.user.name || request.expand.user.email}
            </p>
          )}
          <Separator />
          <div>
            <h4 className="text-sm font-semibold mb-1">Descrição</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {request.description}
            </p>
          </div>
          {attachments.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold mb-2">Anexos</h4>
                <div className="space-y-2">
                  {attachments.map((filename) => (
                    <a
                      key={filename}
                      href={getAttachmentUrl(request.id, filename)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Paperclip className="h-4 w-4" /> {filename}
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {(isOwner || request.ai_response) && (
        <Card className="shadow-elevation border-0 md:border md:border-border/60">
          <CardHeader>
            <CardTitle className="text-lg text-primary flex items-center gap-2">
              <Sparkles className="h-5 w-5" /> Especialista IA (Nível 1)
            </CardTitle>
            <CardDescription>
              Orientação imediata com base na nossa base de conhecimento jurídico.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {request.ai_response ? (
              <>
                <p className="text-sm whitespace-pre-wrap">{request.ai_response}</p>
                <div className="text-xs text-muted-foreground border-l-2 border-amber-300 bg-amber-50/50 p-2 rounded">
                  ⚠️ Orientação informativa gerada por IA com base na base de conhecimento. Não
                  constitui parecer jurídico nem substitui a análise de um advogado/especialista.
                  Para uma análise vinculante do seu caso, fale com o Especialista (Nível 2) abaixo.
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Clique abaixo para uma orientação imediata da IA sobre a sua dúvida.
              </p>
            )}
            {isOwner && (
              <Button
                onClick={handleConsultarIA}
                disabled={consulting}
                variant="outline"
                className="w-full"
              >
                {consulting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Consultando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {request.ai_response ? 'Consultar novamente' : 'Consultar IA (Nível 1)'}
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {showEspecialista && (
        <Card
          className={
            recommendsHuman
              ? 'border-primary/40 bg-primary/5'
              : 'shadow-elevation border-0 md:border md:border-border/60'
          }
        >
          <CardHeader>
            <CardTitle className="text-lg text-primary flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" /> Fale com um Especialista (Nível 2)
            </CardTitle>
            <CardDescription>
              Escalone casos complexos para nossa equipe de Escreventes Notariais e Especialistas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendsHuman && (
              <div className="text-sm font-medium text-primary bg-primary/10 rounded-lg p-3">
                Recomendamos um Especialista humano para este caso. Um especialista vai analisar sua
                solicitação e enviar uma proposta (escopo, prazo e valor) aqui mesmo.
              </div>
            )}
            <div>
              <p className="text-sm font-semibold">Equipe de Especialistas e Escreventes</p>
              <p className="text-sm text-muted-foreground mt-1">
                Nossos especialistas revisam seu caso para garantir a conformidade técnica,
                registral e notarial, evitando exigências e prejuízos. Mais de 40 anos de vivência
                no mercado imobiliário do Rio de Janeiro.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ESPECIALISTA_PILARES.map((p) => (
                <div key={p.titulo} className="border border-border/60 rounded-lg p-3">
                  <p className="text-sm font-semibold text-primary">{p.titulo}</p>
                  <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
                </div>
              ))}
            </div>
            {!recommendsHuman && (
              <p className="text-xs text-muted-foreground">
                Assim que um especialista analisar, você recebe uma proposta aqui mesmo.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {canRespond && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="pt-6">
            <p className="text-sm font-medium mb-3">
              Você recebeu uma proposta. Deseja aceitar ou recusar?
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => handleRespond('accepted')}
                disabled={acting}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="mr-1 h-4 w-4" /> Aceitar
              </Button>
              <Button
                onClick={() => handleRespond('refused')}
                disabled={acting}
                variant="destructive"
              >
                <XCircle className="mr-1 h-4 w-4" /> Recusar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {proposals.length > 0 && (
        <Card className="shadow-elevation border-0 md:border md:border-border/60">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Propostas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {proposals.map((p) => (
              <div key={p.id} className="border border-border/60 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">
                    {complexityLabels[p.complexity_type as ComplexityType] || p.complexity_type}
                  </Badge>
                  <Badge
                    className={
                      proposalResponseBadgeClasses[p.user_response as ProposalResponse] || ''
                    }
                  >
                    {proposalResponseLabels[p.user_response as ProposalResponse] || p.user_response}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{p.scope}</p>
                <div className="flex gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {p.deadline_days} dias
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" /> R$ {p.value.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {isAdmin && request.status !== 'completed' && (
        <Card className="shadow-elevation border-0 md:border md:border-border/60">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Emitir Proposta</CardTitle>
          </CardHeader>
          <CardContent>
            <ProposalForm requestId={request.id} onSuccess={loadData} />
            <Separator className="my-4" />
            <Button onClick={handleComplete} disabled={acting} variant="outline" className="w-full">
              <CheckCircle2 className="mr-2 h-4 w-4" /> Marcar como Concluída
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
