import { useState, useEffect, useCallback } from 'react'
import { Navigate, Link } from 'react-router-dom'
import {
  Loader2,
  Shield,
  AlertTriangle,
  Inbox,
  Activity,
  BookOpen,
  HeartPulse,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Minus,
  Users,
  Briefcase,
  FileSearch,
  UserPlus,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'

import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { IntroPagina } from '@/components/Layout'
import pb from '@/lib/pocketbase/client'
import { getAdminOverview, type AdminOverview } from '@/services/admin'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import type { BrokerProfile } from '@/services/broker-profile'
import AdminAgenciasBlock from '@/components/admin/AgenciasBlock'
import AdminUsuariosBlock from '@/components/admin/UsuariosBlock'

// ── Fila de Atendimento ────────────────────────────────────────────────────
// Item unificado: vem de expert_support_requests (Suporte) ou chamados (Chamado).
// Leitura direta via PocketBase client — essas coleções já são owner-ou-admin,
// então o admin vê de todos sem mudar regra. NÃO depende do endpoint de overview.
type TipoFila = 'suporte' | 'chamado'
interface ItemFila {
  id: string
  tipo: TipoFila
  titulo: string
  subtitulo?: string
  userId?: string
  userName?: string
  userCreci?: string
  created: string
  status: string
}

// Tempo relativo em PT-BR: "agora", "há 5 min", "há 2h", "há 3 dias".
function tempoRelativo(iso: string): string {
  const t = new Date(iso).getTime()
  if (!t) return ''
  const diff = Date.now() - t
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'agora'
  if (min < 60) return `há ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `há ${h}h`
  const d = Math.floor(h / 24)
  if (d === 1) return 'há 1 dia'
  return `há ${d} dias`
}

// Monta nome + CRECI para exibição a partir do broker_profile (se houver).
function nomeCreci(
  p: BrokerProfile | undefined,
  fallbackName?: string,
): { nome: string; creci: string } {
  if (!p) return { nome: fallbackName || 'Corretor', creci: '' }
  const nome =
    p.tipo_perfil === 'imobiliaria'
      ? p.razao_social || p.nome_fantasia || p.name || fallbackName || 'Imobiliária'
      : p.nome || p.name || fallbackName || 'Corretor'
  const creci =
    p.tipo_perfil === 'imobiliaria'
      ? [p.creci_juridico, p.creci_uf].filter(Boolean).join(' ')
      : [p.creci, p.creci_uf].filter(Boolean).join(' ')
  return { nome, creci }
}

async function carregarFila(): Promise<{
  items: ItemFila[]
  perfis: Record<string, BrokerProfile>
}> {
  // Suporte: status != 'completed' (pendentes de atendimento).
  // Chamado: status != 'resolvido' (sem resposta/encerramento).
  const [suporte, chamados] = await Promise.all([
    pb.collection('expert_support_requests').getFullList<{
      id: string
      user: string
      document_type?: string
      objective?: string
      description: string
      status: string
      created: string
      expand?: { user?: { id: string; name?: string; email?: string } }
    }>({
      filter: "status != 'completed'",
      sort: 'created',
      expand: 'user',
    }),
    pb.collection('chamados').getFullList<{
      id: string
      user: string
      tipo: string
      mensagem: string
      status: string
      created: string
      expand?: { user?: { id: string; name?: string; email?: string } }
    }>({
      filter: "status != 'resolvido'",
      sort: 'created',
      expand: 'user',
    }),
  ])

  // Busca os broker_profiles dos usuários envolvidos (admin já pode ler de todos
  // após a migration 1900000026). Um getFullList com filtro IN é mais barato que
  // N getFirstListItem.
  const userIds = Array.from(
    new Set([...suporte, ...chamados].map((r) => r.user).filter(Boolean) as string[]),
  )
  let perfis: Record<string, BrokerProfile> = {}
  if (userIds.length) {
    try {
      const lista = await pb.collection<BrokerProfile>('broker_profile').getFullList({
        filter: userIds.map((id) => `user = "${id}"`).join(' || '),
      })
      perfis = Object.fromEntries(lista.map((p) => [p.user, p]))
    } catch {
      // Sem perfil: segue só com o nome do usuário.
    }
  }

  const items: ItemFila[] = [
    ...suporte.map((r) => {
      const u = r.expand?.user
      const { nome, creci } = nomeCreci(perfis[r.user], u?.name || u?.email)
      return {
        id: r.id,
        tipo: 'suporte' as const,
        titulo: r.objective || r.document_type || 'Solicitação de suporte',
        subtitulo: r.description,
        userId: r.user,
        userName: nome,
        userCreci: creci,
        created: r.created,
        status: r.status,
      }
    }),
    ...chamados.map((r) => {
      const u = r.expand?.user
      const { nome, creci } = nomeCreci(perfis[r.user], u?.name || u?.email)
      return {
        id: r.id,
        tipo: 'chamado' as const,
        titulo: r.tipo,
        subtitulo: r.mensagem,
        userId: r.user,
        userName: nome,
        userCreci: creci,
        created: r.created,
        status: r.status,
      }
    }),
  ]
  // Ordena por created ascendente (mais antigos primeiro) e devolve.
  items.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime())
  return { items, perfis }
}

// ── Variação percentual (seta + texto) ───────────────────────────────────────
function Variacao({ atual, anterior }: { atual: number; anterior: number }) {
  if (anterior === 0 && atual === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
        <Minus className="h-3 w-3" /> 0%
      </span>
    )
  }
  if (anterior === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-emerald-600">
        <ArrowUp className="h-3 w-3" /> novo
      </span>
    )
  }
  const pct = Math.round(((atual - anterior) / anterior) * 100)
  const subiu = pct > 0
  const desceu = pct < 0
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs ${
        subiu ? 'text-emerald-600' : desceu ? 'text-red-600' : 'text-muted-foreground'
      }`}
    >
      {subiu ? (
        <ArrowUp className="h-3 w-3" />
      ) : desceu ? (
        <ArrowDown className="h-3 w-3" />
      ) : (
        <Minus className="h-3 w-3" />
      )}
      {Math.abs(pct)}% vs período anterior
    </span>
  )
}

// Cartão de KPI: número grande + rótulo + variação (se houver).
function KpiCard({
  valor,
  rotulo,
  icone: Icone,
  variacao,
}: {
  valor: string | number
  rotulo: string
  icone: React.ElementType
  variacao?: React.ReactNode
}) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardContent className="p-3.5">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground leading-tight">
            {rotulo}
          </span>
          <Icone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        </div>
        <div className="mt-1 text-2xl font-bold text-foreground leading-none">{valor}</div>
        {variacao && <div className="mt-1.5">{variacao}</div>}
      </CardContent>
    </Card>
  )
}

// ── Página /admin ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const { isAdmin } = useAuth()

  // Bloco 1 — Fila (fonte própria, realtime).
  const [fila, setFila] = useState<ItemFila[]>([])
  const [filaLoading, setFilaLoading] = useState(true)
  const [filaErro, setFilaErro] = useState<string | null>(null)

  // Blocos 2, 3 e 4 — endpoint de overview.
  const [overview, setOverview] = useState<AdminOverview | null>(null)
  const [ovLoading, setOvLoading] = useState(true)
  const [ovErro, setOvErro] = useState<string | null>(null)

  const carregarOverview = useCallback(async () => {
    setOvLoading(true)
    setOvErro(null)
    try {
      const data = await getAdminOverview()
      setOverview(data)
    } catch (error) {
      const msg = getErrorMessage(error)
      setOvErro(msg)
      toast.error('Falha ao carregar o resumo da operação.', { description: msg })
    } finally {
      setOvLoading(false)
    }
  }, [])

  const carregarFilaCB = useCallback(async () => {
    setFilaLoading(true)
    setFilaErro(null)
    try {
      const { items } = await carregarFila()
      setFila(items)
    } catch (error) {
      const msg = getErrorMessage(error)
      setFilaErro(msg)
    } finally {
      setFilaLoading(false)
    }
  }, [])

  useEffect(() => {
    carregarFilaCB()
    carregarOverview()
  }, [carregarFilaCB, carregarOverview])

  // Realtime: a fila reflete o estado ao vivo.
  useRealtime('expert_support_requests', () => carregarFilaCB())
  useRealtime('chamados', () => carregarFilaCB())

  // A proteção real é o hook (isAdmin gate). O redirect aqui é só UX: um
  // corretor que digite /admin não precisa ver o painel montando.
  if (!isAdmin) return <Navigate to="/" replace />

  return (
    <div className="w-full max-w-6xl space-y-5 animate-fade-in-up">
      <div className="space-y-1">
        <h1 className="font-display text-2xl md:text-3xl font-medium text-foreground flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" /> Painel administrativo
        </h1>
        <IntroPagina frase="Visão consolidada da operação: fila de atendimento, pulso da operação, régua jurídica e saúde técnica. Acesso restrito a administradores." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* ── Bloco 1: Fila de atendimento (esquerda, maior) ─────────────── */}
        <div className="lg:col-span-2 space-y-3">
          <Card className="shadow-elevation border-0 md:border md:border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base font-semibold text-primary flex items-center gap-2">
                  <Inbox className="h-5 w-5" /> Fila de atendimento
                </CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-muted-foreground"
                  onClick={carregarFilaCB}
                  disabled={filaLoading}
                  aria-label="Atualizar fila"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${filaLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {filaLoading ? (
                <div className="space-y-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-lg border border-border/60 p-3"
                    >
                      <Skeleton className="h-9 w-9 rounded-md" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              ) : filaErro ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <AlertTriangle className="h-6 w-6 text-amber-500" />
                  <p className="text-sm text-muted-foreground">Não foi possível carregar a fila.</p>
                  <p className="text-xs text-muted-foreground/70 max-w-sm">{filaErro}</p>
                  <Button size="sm" variant="outline" onClick={carregarFilaCB}>
                    Tentar novamente
                  </Button>
                </div>
              ) : fila.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
                  <Inbox className="h-6 w-6 text-muted-foreground/50" />
                  Nenhum atendimento pendente. Tudo em dia.
                </div>
              ) : (
                <div className="space-y-2">
                  {fila.map((item) => {
                    const href =
                      item.tipo === 'suporte' ? `/especialista/${item.id}` : `/chamados/${item.id}`
                    return (
                      <Link
                        key={`${item.tipo}-${item.id}`}
                        to={href}
                        className="flex items-start gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <div
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
                            item.tipo === 'suporte'
                              ? 'bg-indigo-500/10 text-indigo-600'
                              : 'bg-amber-500/10 text-amber-600'
                          }`}
                        >
                          {item.tipo === 'suporte' ? (
                            <AlertCircle className="h-4 w-4" />
                          ) : (
                            <Inbox className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Badge
                              variant="outline"
                              className={`h-5 px-1.5 text-[10px] font-medium ${
                                item.tipo === 'suporte'
                                  ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                                  : 'border-amber-200 bg-amber-50 text-amber-700'
                              }`}
                            >
                              {item.tipo === 'suporte' ? 'Suporte' : 'Chamado'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {tempoRelativo(item.created)}
                            </span>
                          </div>
                          <p className="mt-1 text-sm font-medium text-foreground truncate">
                            {item.titulo}
                          </p>
                          {item.subtitulo && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {item.subtitulo}
                            </p>
                          )}
                          <p className="mt-1 text-xs text-muted-foreground">
                            {item.userName}
                            {item.userCreci ? ` · CRECI ${item.userCreci}` : ''}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground/50 shrink-0 mt-1" />
                      </Link>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Coluna direita: KPIs + Régua + Saúde ───────────────────────── */}
        <div className="space-y-4">
          {/* Bloco 2: Pulso da operação */}
          <Card className="shadow-elevation border-0 md:border md:border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-primary flex items-center gap-2">
                <Activity className="h-5 w-5" /> Pulso da operação
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {ovLoading ? (
                <div className="grid grid-cols-2 gap-2.5">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="rounded-lg border border-border/60 p-3.5 space-y-2">
                      <Skeleton className="h-3 w-2/3" />
                      <Skeleton className="h-7 w-1/2" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  ))}
                </div>
              ) : ovErro ? (
                <div className="flex flex-col items-center gap-2 py-6 text-center">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <p className="text-xs text-muted-foreground max-w-[220px]">{ovErro}</p>
                  <Button size="sm" variant="outline" className="h-7" onClick={carregarOverview}>
                    Tentar novamente
                  </Button>
                </div>
              ) : overview ? (
                <div className="grid grid-cols-2 gap-2.5">
                  <KpiCard
                    valor={overview.validations.last7Days}
                    rotulo="Validações (7d)"
                    icone={FileSearch}
                    variacao={
                      <Variacao
                        atual={overview.validations.last7Days}
                        anterior={overview.validations.previous7Days}
                      />
                    }
                  />
                  <KpiCard
                    valor={`${overview.failureRate}%`}
                    rotulo="Taxa de falha"
                    icone={AlertTriangle}
                    variacao={
                      <span className="text-xs text-muted-foreground">
                        {overview.statusDistribution.green} verde ·{' '}
                        {overview.statusDistribution.yellow} amarelo ·{' '}
                        {overview.statusDistribution.red} vermelho
                      </span>
                    }
                  />
                  <KpiCard
                    valor={overview.signups.last7Days}
                    rotulo="Novos cadastros (7d)"
                    icone={UserPlus}
                    variacao={
                      <span className="text-xs text-muted-foreground">
                        {overview.signups.verified} com e-mail confirmado
                      </span>
                    }
                  />
                  <KpiCard
                    valor={overview.brokers.active}
                    rotulo="Corretores ativos (30d)"
                    icone={Users}
                    variacao={
                      <span className="text-xs text-muted-foreground">
                        de {overview.brokers.total} cadastrados
                      </span>
                    }
                  />
                  <KpiCard
                    valor={overview.brokers.total}
                    rotulo="Total de corretores"
                    icone={Users}
                  />
                  <KpiCard valor={overview.openDeals} rotulo="Negócios abertos" icone={Briefcase} />
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Bloco 3: Régua jurídica */}
          <Card className="shadow-elevation border-0 md:border md:border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-primary flex items-center gap-2">
                <BookOpen className="h-5 w-5" /> Régua jurídica
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {ovLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ) : ovErro ? (
                <p className="text-xs text-muted-foreground">Indisponível.</p>
              ) : overview ? (
                <div className="space-y-3">
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total de regras</span>
                      <span className="font-semibold text-foreground">
                        {overview.legalKnowledge.totalRules}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Categorias distintas</span>
                      <span className="font-semibold text-foreground">
                        {overview.legalKnowledge.categories}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground">Última edição</span>
                      <span className="font-medium text-foreground text-right">
                        {overview.legalKnowledge.lastUpdated
                          ? new Date(overview.legalKnowledge.lastUpdated).toLocaleDateString(
                              'pt-BR',
                            )
                          : '—'}
                      </span>
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline" className="w-full">
                    <Link to="/legal-knowledge">
                      <BookOpen className="mr-1.5 h-4 w-4" /> Gerenciar base jurídica
                    </Link>
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Bloco 4: Saúde técnica */}
          <Card className="shadow-elevation border-0 md:border md:border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-primary flex items-center gap-2">
                <HeartPulse className="h-5 w-5" /> Saúde técnica
              </CardTitle>
              <p className="text-xs text-muted-foreground">Erros de IA nos últimos 7 dias</p>
            </CardHeader>
            <CardContent className="pt-0">
              {ovLoading ? (
                <div className="space-y-2">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-10" />
                    </div>
                  ))}
                </div>
              ) : ovErro ? (
                <p className="text-xs text-muted-foreground">Indisponível.</p>
              ) : overview && overview.aiErrors.length > 0 ? (
                <div className="space-y-1.5">
                  {overview.aiErrors.map((err) => (
                    <div
                      key={err.errorCode}
                      className="flex items-center justify-between gap-2 rounded-md border border-border/60 px-2.5 py-1.5"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-mono font-medium text-foreground truncate">
                          {err.errorCode}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {err.lastOccurrence
                            ? `últ. ${new Date(err.lastOccurrence).toLocaleDateString('pt-BR')}`
                            : ''}
                        </p>
                      </div>
                      <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/10">
                        {err.count}×
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 py-3 text-sm text-muted-foreground">
                  <HeartPulse className="h-4 w-4 text-emerald-500" />
                  Nenhum erro de IA registrado nos últimos 7 dias.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Bloco 5: Imobiliárias (camada de equipe) ─────────────────────── */}
      <AdminAgenciasBlock />

      {/* ── Bloco 6: Usuários (gestão do piloto) ─────────────────────────── */}
      <AdminUsuariosBlock />
    </div>
  )
}
