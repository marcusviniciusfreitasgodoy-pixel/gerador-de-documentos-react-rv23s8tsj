// Fase 3 — o lado do CORRETOR: ver o convite, ler o termo, decidir, e sair
// depois se quiser.
//
// Dois componentes, um dado só:
//  - `ConviteBanner` mora no Layout e aparece em qualquer tela. Um convite que
//    só existisse no perfil seria um convite que ninguém vê: o corretor não
//    abre o perfil por conta própria.
//  - `MinhaImobiliaria` mora no perfil e é a casa do assunto: onde ele está
//    hoje, o que autorizou, e o botão de sair.
//
// O aceite é consentimento de LGPD, não um "ok" de tela. Por isso o termo é
// lido por inteiro antes dos botões, e diz o que a imobiliária passa a ver, o
// que ela NÃO vê e o que acontece quando ele sair. A data e a hora do aceite
// são carimbadas pelo servidor: esta tela não envia data nenhuma.

import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Building2,
  Check,
  Clock,
  Loader2,
  LogOut,
  Mail,
  ShieldCheck,
  X,
  AlertTriangle,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/use-auth'
import {
  getMeusConvites,
  responderConvite,
  sairDaImobiliaria,
  type ConvitePendente,
  type MeusConvites,
  type VinculoAtual,
} from '@/services/agencies'
import { getErrorMessage } from '@/lib/pocketbase/mensagens'

// Os dois componentes leem o mesmo endpoint e podem estar na tela ao mesmo
// tempo: no perfil, a faixa fica logo acima do painel. Sem um aviso entre eles,
// aceitar pelo painel deixaria a faixa dizendo "convidou você" até o próximo
// F5. Um Set no módulo resolve sem puxar gerenciador de estado para dentro de
// um assunto que tem exatamente dois interessados.
const ouvintes = new Set<() => void>()

function avisarMudanca() {
  ouvintes.forEach((fn) => fn())
}

function useAvisoDeMudanca(fn: () => void) {
  useEffect(() => {
    ouvintes.add(fn)
    return () => {
      ouvintes.delete(fn)
    }
  }, [fn])
}

function dataBR(iso: string): string {
  if (!iso) return ''
  const t = new Date(String(iso).replace(' ', 'T'))
  const ms = t.getTime()
  if (!ms) return ''
  return t.toLocaleDateString('pt-BR')
}

function diasRestantes(iso: string): number | null {
  if (!iso) return null
  const t = new Date(String(iso).replace(' ', 'T')).getTime()
  if (!t) return null
  return Math.max(0, Math.ceil((t - Date.now()) / (24 * 60 * 60 * 1000)))
}

// ── O termo, escrito para ser lido ─────────────────────────────────────────
// Regra da casa: não prometer o que não se sustenta. A imobiliária vê os
// negócios carimbados e a CONTAGEM de validações, nunca o texto das minutas
// (o endpoint da equipe devolve só números). Sair não apaga o passado, e isso
// está dito aqui, antes do aceite, e não depois.
function TermoDoVinculo({ nomeCasa }: { nomeCasa: string }) {
  const casa = nomeCasa || 'a imobiliária'
  return (
    <div className="space-y-3 rounded-lg border border-border/60 bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
      <div>
        <p className="font-semibold text-foreground">O que você autoriza</p>
        <ul className="mt-1 space-y-1 list-disc pl-4">
          <li>
            {casa} passa a ver e a editar os negócios que você criar a partir do aceite, com os
            dados das partes que você cadastrar neles: nome, CPF, RG e endereço.
          </li>
          <li>
            Ela vê quantos negócios você abriu pela casa e quantas validações de minuta você fez nos
            últimos 30 dias.
          </li>
          <li>
            A régua jurídica da casa passa a valer nas suas validações, junto com a régua padrão da
            Prime Circle.
          </li>
        </ul>
      </div>
      <div>
        <p className="font-semibold text-foreground">O que ela não vê</p>
        <ul className="mt-1 space-y-1 list-disc pl-4">
          <li>Os negócios que você criou antes deste aceite.</li>
          <li>O texto das minutas que você valida. A contagem é de quantidade, não de conteúdo.</li>
          <li>Apagar um negócio seu continua sendo só seu e do administrador da plataforma.</li>
        </ul>
      </div>
      <div>
        <p className="font-semibold text-foreground">Você pode sair quando quiser</p>
        <p className="mt-1">
          A saída é pelo seu perfil, sem pedir nada a ninguém. Os negócios já carimbados continuam
          com a imobiliária que os intermediou; os novos nascem sem o carimbo.
        </p>
      </div>
      <div className="flex items-start gap-2 rounded-md bg-primary/5 p-2.5 text-[11px] text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        <span>
          A data e a hora deste aceite ficam registradas, e cada vez que o gestor abre um negócio
          seu o acesso também fica registrado.
        </span>
      </div>
    </div>
  )
}

// ── Dialog de decisão ──────────────────────────────────────────────────────
function ConviteDialog({
  convite,
  open,
  onOpenChange,
}: {
  convite: ConvitePendente | null
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const [enviando, setEnviando] = useState<'aceitar' | 'recusar' | null>(null)

  const responder = async (acao: 'aceitar' | 'recusar') => {
    if (!convite) return
    setEnviando(acao)
    try {
      await responderConvite({ id: convite.id }, acao)
      if (acao === 'aceitar') {
        toast.success('Convite aceito.', {
          description: `Seus próximos negócios nascem vinculados a ${
            convite.agency_nome || 'a imobiliária'
          }.`,
        })
      } else {
        toast.success('Convite recusado.', {
          description: 'A imobiliária não passa a ver nada seu.',
        })
      }
      onOpenChange(false)
      avisarMudanca()
    } catch (error) {
      toast.error('Não foi possível responder ao convite.', {
        description: getErrorMessage(error),
      })
    } finally {
      setEnviando(null)
    }
  }

  const dias = convite ? diasRestantes(convite.expira_em) : null

  return (
    <Dialog open={open} onOpenChange={(v) => (enviando ? null : onOpenChange(v))}>
      <DialogContent className="max-w-lg max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Convite para uma equipe
          </DialogTitle>
          <DialogDescription>
            Leia o que muda antes de decidir. Nada acontece sem o seu aceite.
          </DialogDescription>
        </DialogHeader>

        {convite && (
          <div className="space-y-3">
            <div className="rounded-lg border border-border/60 p-3">
              <p className="text-sm font-medium text-foreground">
                {convite.agency_nome || 'Imobiliária'}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {convite.agency_cnpj ? `CNPJ ${convite.agency_cnpj}` : 'CNPJ não informado'}
                {convite.agency_creci ? ` · CRECI PJ ${convite.agency_creci}` : ''}
              </p>
              {dias !== null && (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {dias === 0 ? 'Vence hoje' : `Vence em ${dias} ${dias === 1 ? 'dia' : 'dias'}`}
                </p>
              )}
            </div>

            <TermoDoVinculo nomeCasa={convite.agency_nome} />
          </div>
        )}

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            variant="ghost"
            onClick={() => responder('recusar')}
            disabled={enviando !== null}
            className="text-muted-foreground"
          >
            {enviando === 'recusar' ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <X className="mr-1.5 h-4 w-4" />
            )}
            Recusar
          </Button>
          <Button onClick={() => responder('aceitar')} disabled={enviando !== null}>
            {enviando === 'aceitar' ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-1.5 h-4 w-4" />
            )}
            Aceito e autorizo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Faixa de aviso, em qualquer tela ───────────────────────────────────────
// Só aparece quando existe convite pendente. Fica quieta o resto do tempo: um
// aviso que aparece sempre deixa de ser aviso.
export function ConviteBanner() {
  const { isAuthenticated, isApproved } = useAuth()
  const [convites, setConvites] = useState<ConvitePendente[]>([])
  const [aberto, setAberto] = useState(false)
  const [alvo, setAlvo] = useState<ConvitePendente | null>(null)

  const carregar = useCallback(async () => {
    if (!isAuthenticated || !isApproved) {
      setConvites([])
      return
    }
    try {
      const data = await getMeusConvites()
      setConvites(data.convites || [])
    } catch {
      // Falha silenciosa: o convite não é o trabalho da tela em que ele está.
      setConvites([])
    }
  }, [isAuthenticated, isApproved])

  useEffect(() => {
    carregar()
  }, [carregar])

  useAvisoDeMudanca(carregar)

  if (!convites.length) return null
  const primeiro = convites[0]

  return (
    <div className="w-full max-w-5xl mb-4 animate-fade-in-up">
      <div className="flex flex-col gap-2.5 rounded-lg border border-primary/30 bg-primary/5 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Mail className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">
              {primeiro.agency_nome || 'Uma imobiliária'} convidou você para a equipe
            </p>
            <p className="text-xs text-muted-foreground">
              {convites.length > 1
                ? `Você tem ${convites.length} convites esperando resposta.`
                : 'Leia o que muda e decida. Nada acontece sem o seu aceite.'}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          className="shrink-0"
          onClick={() => {
            setAlvo(primeiro)
            setAberto(true)
          }}
        >
          Ver o convite
        </Button>
      </div>

      <ConviteDialog convite={alvo} open={aberto} onOpenChange={setAberto} />
    </div>
  )
}

// ── Painel no perfil: onde estou, e como saio ──────────────────────────────
export function MinhaImobiliaria() {
  const { isAuthenticated, isApproved } = useAuth()
  const [params, setParams] = useSearchParams()
  const [dados, setDados] = useState<MeusConvites | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [alvo, setAlvo] = useState<ConvitePendente | null>(null)
  const [aberto, setAberto] = useState(false)
  const [saindo, setSaindo] = useState(false)
  const [confirmarSaida, setConfirmarSaida] = useState(false)

  const carregar = useCallback(async () => {
    if (!isAuthenticated || !isApproved) {
      setDados(null)
      setCarregando(false)
      return
    }
    setCarregando(true)
    try {
      setDados(await getMeusConvites())
    } catch {
      setDados(null)
    } finally {
      setCarregando(false)
    }
  }, [isAuthenticated, isApproved])

  useEffect(() => {
    carregar()
  }, [carregar])

  useAvisoDeMudanca(carregar)

  // Link do e-mail: /perfil?convite=<token>. Abre direto o convite certo e
  // limpa o parâmetro, para um F5 não reabrir o dialog depois de respondido.
  // A cópia do URLSearchParams é de propósito: o objeto que o hook devolve não
  // é para ser mutado no lugar.
  useEffect(() => {
    const token = params.get('convite')
    if (!token || !dados) return
    const achado = dados.convites.find((c) => c.token === token)
    if (achado) {
      setAlvo(achado)
      setAberto(true)
    }
    const limpos = new URLSearchParams(params)
    limpos.delete('convite')
    setParams(limpos, { replace: true })
  }, [dados, params, setParams])

  const sair = async () => {
    setSaindo(true)
    try {
      await sairDaImobiliaria()
      toast.success('Você saiu da imobiliária.', {
        description: 'Os próximos negócios que você criar nascem sem o carimbo da casa.',
      })
      setConfirmarSaida(false)
      avisarMudanca()
    } catch (error) {
      toast.error('Não foi possível sair.', { description: getErrorMessage(error) })
    } finally {
      setSaindo(false)
    }
  }

  if (carregando) {
    return (
      <Card className="border-border/60">
        <CardContent className="space-y-2 p-4">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </CardContent>
      </Card>
    )
  }

  const vinculo: VinculoAtual | null = dados?.vinculo ?? null
  const convites = dados?.convites ?? []

  // Corretor autônomo sem convite nenhum: não há assunto, não há card.
  if (!vinculo && convites.length === 0) return null

  return (
    <>
      <Card className="shadow-elevation border-0 md:border md:border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-primary">
            <Building2 className="h-5 w-5" /> Minha imobiliária
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {vinculo ? (
            <div className="rounded-lg border border-border/60 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-foreground">
                  {vinculo.agency_nome || 'Imobiliária'}
                </p>
                <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
                  ativo
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {vinculo.agency_cnpj ? `CNPJ ${vinculo.agency_cnpj}` : 'CNPJ não informado'}
                {vinculo.agency_creci ? ` · CRECI PJ ${vinculo.agency_creci}` : ''}
              </p>
              {vinculo.termo_aceito_em && (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Termo aceito em {dataBR(vinculo.termo_aceito_em)}
                </p>
              )}
              <Button
                size="sm"
                variant="outline"
                className="mt-3 h-8 text-muted-foreground"
                onClick={() => setConfirmarSaida(true)}
              >
                <LogOut className="mr-1.5 h-3.5 w-3.5" /> Sair da imobiliária
              </Button>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Você trabalha como corretor autônomo. Nenhuma imobiliária vê os seus negócios.
            </p>
          )}

          {convites.map((c) => (
            <div
              key={c.id}
              className="flex flex-col gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {c.agency_nome || 'Imobiliária'} convidou você
                </p>
                <p className="text-xs text-muted-foreground">
                  {c.agency_creci ? `CRECI PJ ${c.agency_creci} · ` : ''}
                  {(() => {
                    const d = diasRestantes(c.expira_em)
                    if (d === null) return 'Convite pendente'
                    return d === 0 ? 'Vence hoje' : `Vence em ${d} ${d === 1 ? 'dia' : 'dias'}`
                  })()}
                </p>
              </div>
              <Button
                size="sm"
                className="shrink-0"
                onClick={() => {
                  setAlvo(c)
                  setAberto(true)
                }}
              >
                Ver o convite
              </Button>
            </div>
          ))}

          {vinculo && convites.length > 0 && (
            <p className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
              Você faz parte de uma imobiliária por vez. Para aceitar um convite novo, saia da atual
              primeiro.
            </p>
          )}
        </CardContent>
      </Card>

      <ConviteDialog convite={alvo} open={aberto} onOpenChange={setAberto} />

      <Dialog open={confirmarSaida} onOpenChange={(v) => (saindo ? null : setConfirmarSaida(v))}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Sair da imobiliária?</DialogTitle>
            <DialogDescription>
              Os negócios que você já criou pela casa continuam visíveis para ela: foi ela que os
              intermediou. Os próximos que você criar nascem sem o carimbo, e a régua jurídica da
              casa sai das suas validações.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setConfirmarSaida(false)} disabled={saindo}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={sair} disabled={saindo}>
              {saindo ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-1.5 h-4 w-4" />
              )}
              Sair
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
