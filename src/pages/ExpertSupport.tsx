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
                Escalone casos complexos para nossa equipe de Escreventes Notariais e Especialistas.
              </p>
            )}
          </div>
        </div>
        <Button size="sm" className="shrink-0" onClick={() => navigate('/especialista/nova')}>
          <Plus className="mr-1 h-4 w-4" /> Nova solicitação
        </Button>
      </div>

      {/* Quem vai atender: só para o corretor. O admin JÁ é o especialista —
          para ele isto seria a própria credencial de volta na tela, ocupando o
          espaço da fila de trabalho. */}
      {!isAdmin && (
        <>
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
                Equipe de Especialistas e Escreventes
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
                <h3 className="text-lg font-bold text-primary">
                  Quadro de Conhecimento e Segurança
                </h3>
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

          <h3 className="text-base font-semibold text-primary pt-2">Minhas Solicitações</h3>
        </>
      )}

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
