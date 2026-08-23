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
  type Imobiliaria,
  type AgencyMember,
  type BrokerCandidate,
} from '@/services/agencies'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import type { BrokerProfile } from '@/services/broker-profile'

// Hoje no formato ISO date (YYYY-MM-DD) — default do input de aceite do termo.
function hojeISODate(): string {
  const d = new Date()
  const off = d.getTimezoneOffset()
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10)
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
          Contas com tipo de perfil “imobiliária”. Abrir uma para vincular corretores e registrar o
          aceite do termo LGPD.
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
                          : imob.email || '—'}
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

// ── Detalhe de uma imobiliária aberta: membros + vincular/remover ───────────
function DetalheImobiliaria({ imob }: { imob: Imobiliaria }) {
  const [members, setMembers] = useState<AgencyMember[]>([])
  const [perfis, setPerfis] = useState<Record<string, BrokerProfile>>({})
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [modalVincular, setModalVincular] = useState(false)

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
  }, [carregar])

  const ativos = members.filter((m) => m.status === 'ativo')
  const removidos = members.filter((m) => m.status === 'removido')

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
          Nenhum corretor vinculado. Use “Vincular corretor”.
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

      <Button size="sm" className="w-full h-9" onClick={() => setModalVincular(true)}>
        <UserPlus className="mr-1.5 h-4 w-4" /> Vincular corretor
      </Button>

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
          <DialogTitle>Vincular corretor a {imob.name}</DialogTitle>
          <DialogDescription>
            Busque pelo e-mail de cadastro ou pelo CRECI. Marque a data do aceite do termo LGPD: sem
            termo, o corretor opera como autônomo e a imobiliária não vê nada dele.
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
              vale na criação de negócios.
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
