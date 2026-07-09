import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Plus, Headset, Clock } from 'lucide-react'
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
} from '@/services/expert'
import { getErrorMessage } from '@/lib/pocketbase/errors'

export default function ExpertSupportPage() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const [requests, setRequests] = useState<ExpertSupportRequest[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const data = await listRequests(isAdmin)
      setRequests(data)
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Headset className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold text-primary">
            {isAdmin ? 'Solicitações (Especialista)' : 'Minhas Solicitações'}
          </h2>
        </div>
        <Button size="sm" onClick={() => navigate('/especialista/nova')}>
          <Plus className="mr-1 h-4 w-4" /> Nova solicitação
        </Button>
      </div>

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
              className="shadow-sm border-0 md:border md:border-border/60 hover:shadow-elevation transition-shadow cursor-pointer"
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
