import { useEffect, useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Briefcase,
  FileSearch,
  Building2,
  Loader2,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  Scale,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Info,
  Mail,
  Send,
  Clock,
  Ban,
  UserMinus,
} from 'lucide-react'
import { toast } from 'sonner'

import { IntroPagina } from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  getEquipeResumo,
  listAgencyInvites,
  convidarCorretor,
  reenviarConvite,
  cancelarConvite,
  removerMembroDaEquipe,
  type EquipeResumo,
  type AgencyInvite,
} from '@/services/agencies'
import {
  getAgencyLegalKnowledge,
  createLegalKnowledge,
  updateLegalKnowledge,
  deleteLegalKnowledge,
  type LegalKnowledge,
} from '@/services/legal-knowledge'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { cn } from '@/lib/utils'
import { getErrorMessage } from '@/lib/pocketbase/errors'

interface EditState {
  id?: string
  title: string
  category: string
  code: string
  trigger_logic: string
  content: string
  priority: string
  version: string
}

const emptyForm: EditState = {
  title: '',
  category: '',
  code: '',
  trigger_logic: '',
  content: '',
  priority: '50',
  version: '1',
}

// Tempo relativo em PT-BR (espelha o do /admin).
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

// Quantos dias faltam para o convite vencer. Null quando não há prazo lido.
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

export default function EquipePage() {
  const { user } = useAuth()
  const [resumo, setResumo] = useState<EquipeResumo | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  // Estado da Régua da Casa
  const [houseRules, setHouseRules] = useState<LegalKnowledge[]>([])
  const [rulesLoading, setRulesLoading] = useState(true)
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false)
  const [ruleEditForm, setRuleEditForm] = useState<EditState>(emptyForm)
  const [ruleSearch, setRuleSearch] = useState('')
  const [ruleSaving, setRuleSaving] = useState(false)

  const carregar = useCallback(async () => {
    setLoading(true)
    setErro(null)
    try {
      const data = await getEquipeResumo()
      setResumo(data)
    } catch (error) {
      const msg = getErrorMessage(error)
      setErro(msg)
      // 403: não é imobiliária. A rota fica protegida no Layout (agencyOnly),
      // mas o endpoint também protege. Aqui só mostramos.
      toast.error('Acesso restrito a imobiliárias.', { description: msg })
    } finally {
      setLoading(false)
    }
  }, [])

  // Convites emitidos pela casa (fase 3). A leitura é direta: a regra de
  // `agency_invites` já cobre `agency = @request.auth.id`. Toda ESCRITA passa
  // pelos endpoints, porque quem decide o vínculo não pode ser o cliente.
  const [convites, setConvites] = useState<AgencyInvite[]>([])
  const [convitesLoading, setConvitesLoading] = useState(true)
  const [emailConvite, setEmailConvite] = useState('')
  const [convidando, setConvidando] = useState(false)
  const [acaoConvite, setAcaoConvite] = useState<string | null>(null)

  const carregarConvites = useCallback(async () => {
    if (!user?.id) return
    setConvitesLoading(true)
    try {
      setConvites(await listAgencyInvites(user.id))
    } catch (error) {
      toast.error('Erro ao carregar convites: ' + getErrorMessage(error))
    } finally {
      setConvitesLoading(false)
    }
  }, [user?.id])

  const carregarRegras = useCallback(async () => {
    if (!user?.id) return
    setRulesLoading(true)
    try {
      const rules = await getAgencyLegalKnowledge(user.id)
      setHouseRules(rules)
    } catch (error) {
      toast.error('Erro ao carregar regras da casa: ' + getErrorMessage(error))
    } finally {
      setRulesLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    carregar()
    carregarRegras()
    carregarConvites()
  }, [carregar, carregarRegras, carregarConvites])

  useRealtime('legal_knowledge', () => {
    carregarRegras()
  })

  const convitesPendentes = useMemo(
    () => convites.filter((c) => c.status === 'pendente'),
    [convites],
  )
  const convitesHistorico = useMemo(
    () => convites.filter((c) => c.status !== 'pendente'),
    [convites],
  )

  const filteredRules = useMemo(() => {
    const q = ruleSearch.trim().toLowerCase()
    if (!q) return houseRules
    return houseRules.filter((r) =>
      [r.code, r.title, r.category, r.content].some((f) =>
        (f || '').toString().toLowerCase().includes(q),
      ),
    )
  }, [houseRules, ruleSearch])

  const [removendo, setRemovendo] = useState<string | null>(null)

  const handleRemoverMembro = async (memberId: string, nome: string) => {
    if (
      !window.confirm(
        `Remover ${nome} da equipe? Os negócios que ele já criou pela casa continuam acessíveis aqui. Os próximos nascem sem o carimbo da imobiliária.`,
      )
    )
      return
    setRemovendo(memberId)
    try {
      await removerMembroDaEquipe(memberId)
      toast.success('Corretor removido da equipe.', {
        description: 'O vínculo fica no histórico e ele foi avisado por e-mail.',
      })
      carregar()
    } catch (error) {
      toast.error('Não foi possível remover.', { description: getErrorMessage(error) })
    } finally {
      setRemovendo(null)
    }
  }

  const handleConvidar = async (ev: React.FormEvent) => {
    ev.preventDefault()
    const alvo = emailConvite.trim()
    if (!alvo) return
    setConvidando(true)
    try {
      const r = await convidarCorretor(alvo)
      if (r.email_enviado) {
        toast.success('Convite enviado.', {
          description: r.conta_existente
            ? 'Ele vê o convite no app assim que entrar.'
            : 'Ele precisa criar a conta com este mesmo e-mail para aceitar.',
        })
      } else {
        toast.warning('Convite registrado, mas o e-mail não saiu.', {
          description: 'Use "Reenviar" na lista abaixo. O convite continua valendo.',
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
      else toast.warning('Prazo renovado, mas o e-mail não saiu. Tente de novo em instantes.')
      carregarConvites()
    } catch (error) {
      toast.error('Não foi possível reenviar.', { description: getErrorMessage(error) })
    } finally {
      setAcaoConvite(null)
    }
  }

  const handleCancelarConvite = async (id: string) => {
    if (!window.confirm('Cancelar este convite? Ele deixa de valer para quem recebeu.')) return
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

  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ruleEditForm.title.trim() || !ruleEditForm.content.trim()) {
      toast.error('Título e conteúdo são obrigatórios.')
      return
    }

    setRuleSaving(true)
    const payload = {
      title: ruleEditForm.title.trim(),
      category: ruleEditForm.category.trim() || undefined,
      code: ruleEditForm.code.trim().toUpperCase() || undefined,
      trigger_logic: ruleEditForm.trigger_logic.trim() || undefined,
      content: ruleEditForm.content.trim(),
      priority: ruleEditForm.priority ? Number(ruleEditForm.priority) : 50,
      version: ruleEditForm.version ? Number(ruleEditForm.version) : 1,
      agency: user?.id,
    }

    try {
      if (ruleEditForm.id) {
        await updateLegalKnowledge(ruleEditForm.id, payload)
        toast.success('Regra da casa atualizada com sucesso!')
      } else {
        await createLegalKnowledge(payload)
        toast.success('Regra da casa criada com sucesso!')
      }
      setRuleDialogOpen(false)
      setRuleEditForm(emptyForm)
      carregarRegras()
    } catch (err) {
      toast.error('Falha ao salvar regra: ' + getErrorMessage(err))
    } finally {
      setRuleSaving(false)
    }
  }

  const handleEditRule = (rule: LegalKnowledge) => {
    setRuleEditForm({
      id: rule.id,
      title: rule.title,
      category: rule.category || '',
      code: rule.code || '',
      trigger_logic: rule.trigger_logic || '',
      content: rule.content,
      priority: rule.priority?.toString() || '50',
      version: rule.version?.toString() || '1',
    })
    setRuleDialogOpen(true)
  }

  const handleDeleteRule = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja remover esta regra da casa?')) return
    try {
      await deleteLegalKnowledge(id)
      toast.success('Regra da casa removida.')
      carregarRegras()
    } catch (err) {
      toast.error('Falha ao remover regra: ' + getErrorMessage(err))
    }
  }

  return (
    <div className="w-full max-w-5xl space-y-5 animate-fade-in-up">
      <div className="space-y-1">
        <h1 className="font-display text-2xl md:text-3xl font-medium text-foreground flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" /> Equipe
        </h1>
        <IntroPagina
          frase="Membros da imobiliária, contagem de negócios e validações de cada corretor, e o acesso aos negócios da casa. Você vê os negócios que seus corretores intermediaram, com o aceite registrado por eles mesmos."
          passos={[
            'Convide o corretor pelo e-mail de cadastro dele. Quem aceita é ele, dentro do app, depois de ler o que a imobiliária passa a ver.',
            'A partir do aceite, os negócios que ele criar nascem carimbados com a imobiliária. Os anteriores continuam só dele.',
            'Abra qualquer negócio da casa pelo detalhe já existente: o acesso fica registrado para auditoria.',
            'Remover um corretor não apaga o vínculo: ele fica marcado como removido, preservando o histórico. Ele também pode sair sozinho, pelo perfil.',
          ]}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <Card key={i} className="border-border/60">
              <CardContent className="p-3.5 space-y-2">
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-7 w-1/2" />
                <Skeleton className="h-3 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : erro ? (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-6 flex flex-col items-center gap-2 text-center">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            <p className="text-sm text-muted-foreground max-w-sm">{erro}</p>
            <Button size="sm" variant="outline" onClick={carregar}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      ) : resumo ? (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-3.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Membros ativos
                  </span>
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="mt-1 text-2xl font-bold text-foreground">
                  {resumo.totais.membros_ativos}
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-3.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Negócios da casa
                  </span>
                  <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="mt-1 text-2xl font-bold text-foreground">
                  {resumo.totais.negocios}
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60 shadow-sm col-span-2 md:col-span-1">
              <CardContent className="p-3.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Validações (30d)
                  </span>
                  <FileSearch className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="mt-1 text-2xl font-bold text-foreground">
                  {resumo.totais.validacoes_30d}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Membros */}
          <Card className="shadow-elevation border-0 md:border md:border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base font-semibold text-primary flex items-center gap-2">
                  <Users className="h-5 w-5" /> Membros
                </CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-muted-foreground"
                  onClick={carregar}
                  disabled={loading}
                  aria-label="Atualizar"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {resumo.members.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
                  <Users className="h-6 w-6 text-muted-foreground/50" />
                  Nenhum membro ativo ainda. Convide um corretor pelo e-mail, no bloco abaixo: ele
                  entra na equipe quando aceitar.
                </div>
              ) : (
                <div className="space-y-2">
                  {resumo.members.map((m) => {
                    const creci = [m.creci, m.creci_uf].filter(Boolean).join(' ')
                    return (
                      <div
                        key={m.member_id}
                        className="flex items-start gap-3 rounded-lg border border-border/60 p-3"
                      >
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <Users className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {m.nome || 'Corretor'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {creci ? `CRECI ${creci}` : 'Sem CRECI'}
                            {m.desde
                              ? ` · desde ${new Date(m.desde).toLocaleDateString('pt-BR')}`
                              : ''}
                          </p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                            <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-medium">
                              <Briefcase className="h-3 w-3 mr-1" />
                              {m.negocios_count} {m.negocios_count === 1 ? 'negócio' : 'negócios'}
                            </Badge>
                            <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-medium">
                              <FileSearch className="h-3 w-3 mr-1" />
                              {m.validacoes_30d} validações (30d)
                            </Badge>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 shrink-0 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoverMembro(m.member_id, m.nome || 'Corretor')}
                          disabled={removendo === m.member_id}
                          aria-label="Remover da equipe"
                        >
                          {removendo === m.member_id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <UserMinus className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Convites (fase 3): o gestor convida, o corretor decide */}
          <Card className="shadow-elevation border-0 md:border md:border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base font-semibold text-primary flex items-center gap-2">
                  <Mail className="h-5 w-5" /> Convites
                </CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-muted-foreground"
                  onClick={carregarConvites}
                  disabled={convitesLoading}
                  aria-label="Atualizar convites"
                >
                  <RefreshCw className={cn('h-3.5 w-3.5', convitesLoading && 'animate-spin')} />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Convide pelo e-mail de cadastro do corretor. Quem aceita é ele, dentro do app,
                depois de ler o que a imobiliária passa a ver. Você não marca o aceite no lugar
                dele, e nada dele aparece aqui antes disso.
              </p>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <form onSubmit={handleConvidar} className="flex flex-col gap-2 sm:flex-row">
                <Input
                  type="email"
                  value={emailConvite}
                  onChange={(e) => setEmailConvite(e.target.value)}
                  placeholder="corretor@exemplo.com"
                  className="h-9"
                  required
                />
                <Button
                  type="submit"
                  size="sm"
                  className="h-9 shrink-0"
                  disabled={convidando || !emailConvite.trim()}
                >
                  {convidando ? (
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-1.5 h-4 w-4" />
                  )}
                  Enviar convite
                </Button>
              </form>

              {convitesLoading ? (
                <div className="space-y-2 py-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <>
                  {convitesPendentes.length === 0 ? (
                    <p className="py-2 text-xs text-muted-foreground">
                      Nenhum convite esperando resposta.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {convitesPendentes.map((c) => {
                        const dias = diasRestantes(c.expira_em)
                        return (
                          <div
                            key={c.id}
                            className="flex flex-col gap-2 rounded-lg border border-border/60 p-3 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-foreground">
                                {c.email}
                              </p>
                              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {dias === null
                                  ? 'Aguardando resposta'
                                  : dias === 0
                                    ? 'Vence hoje'
                                    : `Vence em ${dias} ${dias === 1 ? 'dia' : 'dias'}`}
                                {c.created ? ` · enviado ${tempoRelativo(c.created)}` : ''}
                              </p>
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8"
                                onClick={() => handleReenviar(c.id)}
                                disabled={acaoConvite === c.id}
                              >
                                {acaoConvite === c.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Send className="h-3.5 w-3.5" />
                                )}
                                <span className="ml-1.5">Reenviar</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 text-muted-foreground hover:text-destructive"
                                onClick={() => handleCancelarConvite(c.id)}
                                disabled={acaoConvite === c.id}
                                aria-label="Cancelar convite"
                              >
                                <Ban className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {convitesHistorico.length > 0 && (
                    <details className="text-xs">
                      <summary className="cursor-pointer py-1 text-muted-foreground hover:text-foreground">
                        {convitesHistorico.length} convite
                        {convitesHistorico.length === 1 ? '' : 's'} já respondido
                        {convitesHistorico.length === 1 ? '' : 's'} (histórico)
                      </summary>
                      <div className="mt-1 space-y-1">
                        {convitesHistorico.map((c) => (
                          <div
                            key={c.id}
                            className="flex items-center gap-2 rounded-md border border-border/40 px-2.5 py-1.5 opacity-75"
                          >
                            <span className="flex-1 truncate text-[11px] text-muted-foreground">
                              {c.email}
                              {c.respondido_em ? ` · ${tempoRelativo(c.respondido_em)}` : ''}
                            </span>
                            <Badge variant="outline" className="h-4 shrink-0 px-1 text-[10px]">
                              {ROTULO_STATUS[c.status] || c.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Negócios da casa */}
          <Card className="shadow-elevation border-0 md:border md:border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-primary flex items-center gap-2">
                <Briefcase className="h-5 w-5" /> Negócios da imobiliária
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {resumo.negocios.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
                  <Briefcase className="h-6 w-6 text-muted-foreground/50" />
                  Nenhum negócio carimbado ainda. Novos negócios dos membros com termo aceito
                  aparecem aqui automaticamente.
                </div>
              ) : (
                <div className="space-y-2">
                  {resumo.negocios.map((n) => (
                    <Link
                      key={n.id}
                      to={`/negocios/${n.id}`}
                      className="flex items-start gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-secondary/40"
                    >
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{n.titulo}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {n.owner_name || 'Corretor'} · {tempoRelativo(n.updated)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Seção Régua da Casa */}
          <Card className="shadow-elevation border-0 md:border md:border-border/60">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-semibold text-primary flex items-center gap-2">
                    <Scale className="h-5 w-5" /> Régua da casa
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Regras e diretrizes jurídicas personalizadas da sua imobiliária aplicadas na
                    validação de minutas da sua equipe.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2 text-muted-foreground"
                    onClick={carregarRegras}
                    disabled={rulesLoading}
                    aria-label="Atualizar regras"
                  >
                    <RefreshCw className={cn('h-3.5 w-3.5', rulesLoading && 'animate-spin')} />
                  </Button>

                  <Dialog
                    open={ruleDialogOpen}
                    onOpenChange={(open) => {
                      setRuleDialogOpen(open)
                      if (!open) setRuleEditForm(emptyForm)
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="mr-1 h-4 w-4" /> Nova Regra da Casa
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {ruleEditForm.id ? 'Editar' : 'Nova'} Regra da Casa
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSaveRule} className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="house-title">Título *</Label>
                          <Input
                            id="house-title"
                            value={ruleEditForm.title}
                            onChange={(e) =>
                              setRuleEditForm({ ...ruleEditForm, title: e.target.value })
                            }
                            placeholder="Ex: Cláusula de Sinal e Arras Personalizada"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor="house-category">Categoria</Label>
                            <Input
                              id="house-category"
                              value={ruleEditForm.category}
                              onChange={(e) =>
                                setRuleEditForm({ ...ruleEditForm, category: e.target.value })
                              }
                              placeholder="Ex: Arras / Pagamento"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="house-code">Código da Regra</Label>
                            <Input
                              id="house-code"
                              value={ruleEditForm.code}
                              onChange={(e) =>
                                setRuleEditForm({ ...ruleEditForm, code: e.target.value })
                              }
                              placeholder="Ex: ARR001 ou FIX004"
                            />
                          </div>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Dica: se usar o mesmo código de uma regra padrão (ex: FIX004), a sua regra
                          da casa irá substituir a global na validação.
                        </p>
                        <div className="space-y-1">
                          <Label htmlFor="house-trigger">Lógica de Disparo (opcional)</Label>
                          <Input
                            id="house-trigger"
                            value={ruleEditForm.trigger_logic}
                            onChange={(e) =>
                              setRuleEditForm({
                                ...ruleEditForm,
                                trigger_logic: e.target.value,
                              })
                            }
                            placeholder="Ex: Promessa de Compra e Venda"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="house-content">Conteúdo / Diretriz Jurídica *</Label>
                          <Textarea
                            id="house-content"
                            rows={4}
                            value={ruleEditForm.content}
                            onChange={(e) =>
                              setRuleEditForm({ ...ruleEditForm, content: e.target.value })
                            }
                            placeholder="Descreva o que deve ser verificado ou a redação exigida pela sua imobiliária..."
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor="house-priority">Prioridade</Label>
                            <Input
                              id="house-priority"
                              type="number"
                              value={ruleEditForm.priority}
                              onChange={(e) =>
                                setRuleEditForm({ ...ruleEditForm, priority: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="house-version">Versão</Label>
                            <Input
                              id="house-version"
                              type="number"
                              value={ruleEditForm.version}
                              onChange={(e) =>
                                setRuleEditForm({ ...ruleEditForm, version: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={ruleSaving}>
                          {ruleSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          Salvar Regra
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Informação sobre a Mesclagem */}
              <div className="mt-3 flex items-start gap-2 rounded-md bg-blue-50/80 border border-blue-200/60 p-3 text-xs text-blue-900 leading-relaxed">
                <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">Como funciona a régua da casa:</strong> As
                  regras globais da Prime Circle continuam valendo para toda a sua equipe. Se você
                  cadastrar uma regra própria com o mesmo <strong>Código</strong> de uma regra
                  global, a sua regra da casa terá precedência e substituirá a global na validação.
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Barra de busca das regras */}
              {houseRules.length > 0 && (
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={ruleSearch}
                    onChange={(e) => setRuleSearch(e.target.value)}
                    placeholder="Buscar regras da casa por código, título ou categoria..."
                    className="pl-8 pr-8 h-8 text-xs"
                  />
                  {ruleSearch && (
                    <button
                      type="button"
                      onClick={() => setRuleSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label="Limpar busca"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              )}

              {rulesLoading ? (
                <div className="space-y-2 py-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : houseRules.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
                  <Scale className="h-6 w-6 text-muted-foreground/50" />
                  Nenhuma regra própria cadastrada ainda. Sua equipe está utilizando a régua padrão
                  global da Prime Circle.
                </div>
              ) : filteredRules.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-6 text-center text-sm text-muted-foreground">
                  Nenhuma regra encontrada para a busca “{ruleSearch}”.
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredRules.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-lg border border-border/60 p-3 hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-semibold text-primary truncate">
                              {r.title}
                            </h4>
                            {r.code && (
                              <Badge variant="secondary" className="text-[10px] font-mono h-4 px-1">
                                {r.code}
                              </Badge>
                            )}
                            {r.category && (
                              <Badge variant="outline" className="text-[10px] h-4 px-1">
                                {r.category}
                              </Badge>
                            )}
                          </div>

                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {r.content}
                          </p>

                          {r.trigger_logic && (
                            <p className="text-[11px] text-muted-foreground/80 mt-1 italic">
                              Gatilho: {r.trigger_logic}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => handleEditRule(r)}
                            aria-label="Editar regra"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteRule(r.id)}
                            aria-label="Excluir regra"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex items-start gap-2 rounded-md bg-primary/5 p-3 text-xs text-muted-foreground leading-relaxed">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>
              Quando você abre um negócio que não é seu, o acesso é registrado para auditoria
              (LGPD). A remoção de um corretor preserva o histórico dos vínculos e dos negócios já
              carimbados.
            </span>
          </div>
        </>
      ) : null}
    </div>
  )
}
