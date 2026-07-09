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

export default function ExpertSupportDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  const [request, setRequest] = useState<ExpertSupportRequest | null>(null)
  const [proposals, setProposals] = useState<ExpertProposal[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(false)

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
