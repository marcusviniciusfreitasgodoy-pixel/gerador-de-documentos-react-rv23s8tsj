import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Building2,
  Search,
  Users,
  UserPlus,
  UserMinus,
  RefreshCw,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Calendar,
  Mail,
  Send,
  Clock,
  Ban,
} from 'lucide-react'
import { toast } from 'sonner'

import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  listImobiliarias,
  listAgencyMembers,
  searchBroker,
  vincularMember,
  removerMember,
  getMemberProfiles,
  listAgencyInvites,
  convidarCorretor,
  reenviarConvite,
  cancelarConvite,
  type Imobiliaria,
  type AgencyMember,
  type BrokerCandidate,
  type AgencyInvite,
} from '@/services/agencies'
import { getErrorMessage } from '@/lib/pocketbase/mensagens'
import type { BrokerProfile } from '@/services/broker-profile'

// Hoje no formato ISO date (YYYY-MM-DD) — default do input de aceite do termo.
function hojeISODate(): string {
  const d = new Date()
  const off = d.getTimezoneOffset()
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10)
}

// Quantos dias faltam para o convite vencer.
function diasRestantes(iso: string): number | null {
  if (!iso) return null
  const t = new Date(String(iso).replace(' ', 'T')).getTime()
  if (!t) return null
  return Math.max(0, Math.ceil((t - Date.now()) / (24 * 60 * 60 * 1000)))
}

const ROTULO_STATUS: Record<string, string> = {
  pendente: 'aguardando resposta',
  aceito: 'aceito',
  recusado: 'recusado',
  cancelado: 'cancelado',
  expirado: 'vencido',
}

export default function AdminAgenciasBlock() {
  const { isAdmin } = useAuth()
  if (!isAdmin) return null

  return <AgenciasAdmin />
}

function AgenciasAdmin() {
  const [imobiliarias, setImobiliarias] = useState<Imobiliaria[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [abertaId, setAbertaId] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    setLoading(true)
    setErro(null)
    try {
      const data = await listImobiliarias()
      setImobiliarias(data)
    } catch (error) {
      const msg = getErrorMessage(error)
      setErro(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  return (
    <Card className="shadow-elevation border-0 md:border md:border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold text-primary flex items-center gap-2">
            <Building2 className="h-5 w-5" /> Imobiliárias
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-muted-foreground"
            onClick={carregar}
            disabled={loading}
            aria-label="Atualizar imobiliárias"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Contas com tipo de perfil “imobiliária”. Abra uma para convidar corretores por e-mail. O
          aceite é dado pelo próprio corretor, no app.
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-border/60 p-3"
              >
                <Skeleton className="h-9 w-9 rounded-md" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-7 w-7 rounded-md" />
              </div>
            ))}
          </div>
        ) : erro ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <p className="text-xs text-muted-foreground max-w-sm">{erro}</p>
            <Button size="sm" variant="outline" onClick={carregar}>
              Tentar novamente
            </Button>
          </div>
        ) : imobiliarias.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
            <Building2 className="h-6 w-6 text-muted-foreground/50" />
            Nenhuma conta-imobiliária cadastrada ainda.
          </div>
        ) : (
          <div className="space-y-2">
            {imobiliarias.map((imob) => {
              const aberta = abertaId === imob.user
              return (
                <div key={imob.user}>
                  <button
                    type="button"
                    onClick={() => setAbertaId(aberta ? null : imob.user)}
                    className="flex w-full items-center gap-3 rounded-lg border border-border/60 p-3 text-left transition-colors hover:bg-secondary/40"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{imob.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {imob.razao_social && imob.razao_social !== imob.name
                          ? imob.razao_social
                          : imob.email || 'sem e-mail'}
                        {imob.creci_juridico ? ` · CRECI-J ${imob.creci_juridico}` : ''}
                      </p>
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 text-muted-foreground/60 shrink-0 transition-transform ${
                        aberta ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  {aberta && (
                    <div className="mt-1.5 animate-fade-in-up">
                      <DetalheImobiliaria imob={imob} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ── Detalhe de uma imobiliária aberta: convites, membros e vínculo manual ──
function DetalheImobiliaria({ imob }: { imob: Imobiliaria }) {
  const [members, setMembers] = useState<AgencyMember[]>([])
  const [perfis, setPerfis] = useState<Record<string, BrokerProfile>>({})
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [modalVincular, setModalVincular] = useState(false)

  // Convites em nome desta imobiliária (fase 3). O admin da plataforma pode
  // convidar por ela: o endpoint aceita `agency` no corpo só de quem é admin.
  const [convites, setConvites] = useState<AgencyInvite[]>([])
  const [convitesLoading, setConvitesLoading] = useState(true)
  const [emailConvite, setEmailConvite] = useState('')
  const [convidando, setConvidando] = useState(false)
  const [acaoConvite, setAcaoConvite] = useState<string | null>(null)

  const carregarConvites = useCallback(async () => {
    setConvitesLoading(true)
    try {
      setConvites(await listAgencyInvites(imob.user))
    } catch (error) {
      toast.error('Erro ao carregar convites.', { description: getErrorMessage(error) })
    } finally {
      setConvitesLoading(false)
    }
  }, [imob.user])

  const handleConvidar = async (ev: React.FormEvent) => {
    ev.preventDefault()
    const alvo = emailConvite.trim()
    if (!alvo) return
    setConvidando(true)
    try {
      const r = await convidarCorretor(alvo, imob.user)
      if (r.email_enviado) {
        toast.success('Convite enviado.', {
          description: r.conta_existente
            ? 'Ele vê o convite no app assim que entrar.'
            : 'Ele precisa criar a conta com este mesmo e-mail para aceitar.',
        })
      } else {
        toast.warning('Convite registrado, mas o e-mail não saiu.', {
          description: 'Use “Reenviar” na lista. O convite continua valendo.',
        })
      }
      setEmailConvite('')
      carregarConvites()
    } catch (error) {
      toast.error('Não foi possível convidar.', { description: getErrorMessage(error) })
    } finally {
      setConvidando(false)
    }
  }

  const handleReenviar = async (id: string) => {
    setAcaoConvite(id)
    try {
      const r = await reenviarConvite(id)
      if (r.email_enviado) toast.success('Convite reenviado, com prazo renovado.')
      else toast.warning('Prazo renovado, mas o e-mail não saiu.')
      carregarConvites()
    } catch (error) {
      toast.error('Não foi possível reenviar.', { description: getErrorMessage(error) })
    } finally {
      setAcaoConvite(null)
    }
  }

  const handleCancelarConvite = async (id: string) => {
    setAcaoConvite(id)
    try {
      await cancelarConvite(id)
      toast.success('Convite cancelado.')
      carregarConvites()
    } catch (error) {
      toast.error('Não foi possível cancelar.', { description: getErrorMessage(error) })
    } finally {
      setAcaoConvite(null)
    }
  }

  const carregar = useCallback(async () => {
    setLoading(true)
    setErro(null)
    try {
      const list = await listAgencyMembers(imob.user)
      setMembers(list)
      const perfMap = await getMemberProfiles(
        list.filter((m) => m.status === 'ativo').map((m) => m.member),
      )
      setPerfis(perfMap)
    } catch (error) {
      setErro(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [imob.user])

  useEffect(() => {
    carregar()
    carregarConvites()
  }, [carregar, carregarConvites])

  const ativos = members.filter((m) => m.status === 'ativo')
  const removidos = members.filter((m) => m.status === 'removido')
  const convitesPendentes = convites.filter((c) => c.status === 'pendente')
  const convitesHistorico = convites.filter((c) => c.status !== 'pendente')

  return (
    <div className="rounded-lg border border-border/60 bg-card/40 p-3 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">
          {ativos.length} {ativos.length === 1 ? 'membro ativo' : 'membros ativos'}
        </p>
        <Button size="sm" variant="outline" className="h-7" onClick={carregar} disabled={loading}>
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[0, 1].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-9 w-9 rounded-md" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : erro ? (
        <p className="text-xs text-red-600">{erro}</p>
      ) : ativos.length === 0 ? (
        <p className="text-xs text-muted-foreground py-2">
          Nenhum corretor vinculado ainda. Convide por e-mail no bloco abaixo.
        </p>
      ) : (
        <div className="space-y-1.5">
          {ativos.map((m) => {
            const p = perfis[m.member]
            const creci = p
              ? p.tipo_perfil === 'imobiliaria'
                ? [p.creci_juridico, p.creci_uf].filter(Boolean).join(' ')
                : [p.creci, p.creci_uf].filter(Boolean).join(' ')
              : ''
            return (
              <div
                key={m.id}
                className="flex items-center gap-2 rounded-md border border-border/50 px-2.5 py-2"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {m.memberName || p?.nome || 'Corretor'}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {creci ? `CRECI ${creci} · ` : ''}
                    {m.memberEmail || ''}
                    {m.termo_aceito_em
                      ? ` · termo ${new Date(m.termo_aceito_em).toLocaleDateString('pt-BR')}`
                      : ' · sem termo'}
                  </p>
                </div>
                <ButtonRemover memberId={m.id} memberName={m.memberName} onDone={carregar} />
              </div>
            )
          })}
        </div>
      )}

      {/* ── Convites (fase 3): o caminho padrão ─────────────────────────── */}
      <div className="space-y-2 rounded-md border border-border/50 p-2.5">
        <div className="flex items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <Mail className="h-3.5 w-3.5 text-primary" /> Convidar por e-mail
          </p>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 px-1.5 text-muted-foreground"
            onClick={carregarConvites}
            disabled={convitesLoading}
            aria-label="Atualizar convites"
          >
            <RefreshCw className={`h-3 w-3 ${convitesLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          O corretor recebe o convite, lê o que a imobiliária passa a ver e aceita ele mesmo. A data
          e a hora do aceite são carimbadas pelo servidor.
        </p>
        <form onSubmit={handleConvidar} className="flex gap-2">
          <Input
            type="email"
            value={emailConvite}
            onChange={(e) => setEmailConvite(e.target.value)}
            placeholder="corretor@exemplo.com"
            className="h-8 text-xs"
            required
          />
          <Button
            type="submit"
            size="sm"
            className="h-8 shrink-0"
            disabled={convidando || !emailConvite.trim()}
          >
            {convidando ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            <span className="ml-1.5">Convidar</span>
          </Button>
        </form>

        {convitesLoading ? (
          <Skeleton className="h-9 w-full" />
        ) : convitesPendentes.length === 0 ? (
          <p className="text-[11px] text-muted-foreground">Nenhum convite esperando resposta.</p>
        ) : (
          <div className="space-y-1.5">
            {convitesPendentes.map((c) => {
              const dias = diasRestantes(c.expira_em)
              return (
                <div
                  key={c.id}
                  className="flex items-center gap-2 rounded-md border border-border/50 px-2.5 py-1.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs text-foreground">{c.email}</p>
                    <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="h-2.5 w-2.5" />
                      {dias === null
                        ? 'Aguardando resposta'
                        : dias === 0
                          ? 'Vence hoje'
                          : `Vence em ${dias} ${dias === 1 ? 'dia' : 'dias'}`}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => handleReenviar(c.id)}
                    disabled={acaoConvite === c.id}
                    aria-label="Reenviar convite"
                  >
                    {acaoConvite === c.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Send className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-red-600"
                    onClick={() => handleCancelarConvite(c.id)}
                    disabled={acaoConvite === c.id}
                    aria-label="Cancelar convite"
                  >
                    <Ban className="h-3 w-3" />
                  </Button>
                </div>
              )
            })}
          </div>
        )}

        {convitesHistorico.length > 0 && (
          <details className="text-xs">
            <summary className="cursor-pointer py-0.5 text-[11px] text-muted-foreground hover:text-foreground">
              {convitesHistorico.length} convite{convitesHistorico.length === 1 ? '' : 's'} no
              histórico
            </summary>
            <div className="mt-1 space-y-1">
              {convitesHistorico.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-2 rounded-md border border-border/40 px-2.5 py-1 opacity-75"
                >
                  <span className="flex-1 truncate text-[10px] text-muted-foreground">
                    {c.email}
                  </span>
                  <Badge variant="outline" className="h-4 shrink-0 px-1 text-[10px]">
                    {ROTULO_STATUS[c.status] || c.status}
                  </Badge>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>

      {/* ── Vínculo manual: a exceção, não o caminho ──────────────────────── */}
      {/* Continua aqui porque é a única saída quando o e-mail não chega de jeito
          nenhum e a imobiliária precisa operar hoje. Fica marcado como exceção
          de propósito: aqui quem afirma o consentimento é a Prime Circle, e não
          o corretor, que é justamente o que a fase 3 veio resolver. */}
      <details className="rounded-md border border-border/50 p-2.5">
        <summary className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground">
          Vínculo manual (exceção)
        </summary>
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          Cria o vínculo sem passar pelo aceite do corretor, registrando a data de um combinado
          contratual feito fora do app. Use só quando o convite por e-mail não for possível.
        </p>
        <Button
          size="sm"
          variant="outline"
          className="mt-2 h-8 w-full"
          onClick={() => setModalVincular(true)}
        >
          <UserPlus className="mr-1.5 h-3.5 w-3.5" /> Vincular corretor manualmente
        </Button>
      </details>

      {removidos.length > 0 && (
        <details className="text-xs">
          <summary className="cursor-pointer text-muted-foreground hover:text-foreground py-1">
            {removidos.length} removido{removidos.length === 1 ? '' : 's'} (histórico)
          </summary>
          <div className="mt-1 space-y-1">
            {removidos.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-2 rounded-md border border-border/40 px-2.5 py-1.5 opacity-70"
              >
                <span className="text-[11px] text-muted-foreground truncate flex-1">
                  {m.memberName || 'Corretor'} · {m.memberEmail}
                </span>
                <Badge variant="outline" className="h-4 px-1 text-[10px]">
                  removido
                </Badge>
              </div>
            ))}
          </div>
        </details>
      )}

      <VincularDialog
        open={modalVincular}
        onOpenChange={setModalVincular}
        imob={imob}
        onDone={carregar}
      />
    </div>
  )
}

// ── Botão Remover (marca status='removido', não deleta) ─────────────────────
function ButtonRemover({
  memberId,
  memberName,
  onDone,
}: {
  memberId: string
  memberName: string
  onDone: () => void
}) {
  const [open, setOpen] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const confirmar = async () => {
    setEnviando(true)
    try {
      await removerMember(memberId)
      toast.success('Corretor removido da equipe.', {
        description: `${memberName} fica no histórico como removido.`,
      })
      setOpen(false)
      onDone()
    } catch (error) {
      toast.error('Não foi possível remover.', { description: getErrorMessage(error) })
    } finally {
      setEnviando(false)
    }
  }
  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        className="h-7 w-7 p-0 text-muted-foreground hover:text-red-600"
        onClick={() => setOpen(true)}
        aria-label="Remover corretor"
      >
        <UserMinus className="h-3.5 w-3.5" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Remover corretor da equipe?</DialogTitle>
            <DialogDescription>
              <strong className="text-foreground">{memberName}</strong> para de ser carimbado como
              agência em novos negócios. O vínculo fica no histórico (status “removido”) e os
              negócios já carimbados continuam acessíveis ao gestor.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={enviando}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmar} disabled={enviando}>
              {enviando ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserMinus className="h-4 w-4" />
              )}
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// ── Dialog: buscar corretor (e-mail/CRECI), marcar termo, vincular ──────────
function VincularDialog({
  open,
  onOpenChange,
  imob,
  onDone,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  imob: Imobiliaria
  onDone: () => void
}) {
  const [query, setQuery] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [cand, setCand] = useState<BrokerCandidate | null>(null)
  const [termo, setTermo] = useState(hojeISODate())
  const [enviando, setEnviando] = useState(false)

  // Reset ao (re)abrir.
  useEffect(() => {
    if (open) {
      setQuery('')
      setCand(null)
      setTermo(hojeISODate())
    }
  }, [open])

  const buscaValida = useMemo(() => query.trim().length >= 3, [query])

  const buscar = async () => {
    if (!buscaValida) return
    setBuscando(true)
    setCand(null)
    try {
      const found = await searchBroker(query.trim())
      if (!found) {
        toast.error('Nenhum corretor encontrado.', {
          description: 'Busque pelo e-mail de cadastro ou pelo CRECI (exato).',
        })
      } else {
        setCand(found)
      }
    } catch (error) {
      toast.error('Erro na busca.', { description: getErrorMessage(error) })
    } finally {
      setBuscando(false)
    }
  }

  const vincular = async () => {
    if (!cand) return
    if (!termo) {
      toast.error('Marque a data do aceite do termo.', {
        description: 'Sem termo, o corretor opera como autônomo (sem carimbo de agência).',
      })
      return
    }
    setEnviando(true)
    try {
      await vincularMember(imob.user, cand.user, termo)
      toast.success('Corretor vinculado.', {
        description: 'Novos negócios dele nascerão com a imobiliária carimbada pelo servidor.',
      })
      onOpenChange(false)
      onDone()
    } catch (error) {
      toast.error('Não foi possível vincular.', {
        description: getErrorMessage(error),
      })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Vínculo manual: {imob.name}</DialogTitle>
          <DialogDescription>
            Caminho de exceção. O padrão é o convite por e-mail, em que o próprio corretor lê o
            termo e aceita. Aqui a data registrada representa um combinado contratual feito fora do
            app: sem ela, o corretor opera como autônomo e a imobiliária não vê nada dele.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="busca-corretor">E-mail ou CRECI</Label>
            <div className="flex gap-2">
              <Input
                id="busca-corretor"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="exato@exemplo.com ou 12345"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && buscaValida && !buscando) buscar()
                }}
                autoFocus
              />
              <Button type="button" onClick={buscar} disabled={!buscaValida || buscando}>
                {buscando ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Buscar
              </Button>
            </div>
          </div>

          {cand && (
            <div className="rounded-lg border border-border/60 p-3 space-y-2 bg-muted/30">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <p className="text-sm font-medium text-foreground">{cand.name || 'Corretor'}</p>
              </div>
              <p className="text-xs text-muted-foreground">{cand.email}</p>
              {cand.creci && (
                <p className="text-xs text-muted-foreground">
                  CRECI {cand.creci}
                  {cand.creci_uf ? ` · ${cand.creci_uf}` : ''}
                </p>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="termo-data" className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> Aceite do termo (data)
            </Label>
            <Input
              id="termo-data"
              type="date"
              value={termo}
              onChange={(e) => setTermo(e.target.value)}
              max={hojeISODate()}
            />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Representa o combinado contratual com a imobiliária. Só com termo o carimbo de agência
              vale na criação de negócios. Prefira o convite: lá o aceite é do corretor, com data e
              hora do servidor.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={enviando}>
            Cancelar
          </Button>
          <Button onClick={vincular} disabled={!cand || enviando}>
            {enviando ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            Vincular
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
