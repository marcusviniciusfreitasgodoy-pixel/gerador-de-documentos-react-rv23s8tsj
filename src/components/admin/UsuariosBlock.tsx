import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Users,
  Search,
  RefreshCw,
  Loader2,
  Clock,
  BadgeCheck,
  MailWarning,
  Send,
  ShieldCheck,
  Trash2,
  AlertTriangle,
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
  listAdminUsuarios,
  estenderTeste,
  carimbarPlano,
  previaExclusao,
  excluirUsuario,
  definirAdmin,
  reenviarConfirmacao,
  type AdminUsuario,
  type PreviaExclusao,
} from '@/services/admin'
import { getErrorMessage } from '@/lib/pocketbase/mensagens'

// Rótulos comerciais dos planos, na mesma língua da página /planos. O id
// interno ('corretor') não aparece para ninguém, nem para o admin.
const ROTULO_PLANO: Record<string, string> = {
  corretor: 'Individual',
  profissional: 'Profissional',
  imobiliaria: 'Imobiliária',
}

function dataCurta(iso: string): string {
  if (!iso) return ''
  const t = new Date(String(iso).replace(' ', 'T'))
  if (!t.getTime()) return ''
  return t.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function diasAte(iso: string): number | null {
  if (!iso) return null
  const t = new Date(String(iso).replace(' ', 'T')).getTime()
  if (!t) return null
  return Math.ceil((t - Date.now()) / (24 * 60 * 60 * 1000))
}

// A situação de acesso numa palavra, na mesma régua que o app usa: plano
// ativo > teste com prazo > teste vencido > conta antiga sem carimbo (livre).
function situacao(u: AdminUsuario): { rotulo: string; tom: 'ok' | 'aviso' | 'neutro' } {
  if (u.plano) {
    const renovaEm = diasAte(u.plano_renova_em)
    if (renovaEm !== null && renovaEm < 0) {
      return { rotulo: `${ROTULO_PLANO[u.plano] ?? u.plano}, vencido`, tom: 'aviso' }
    }
    return { rotulo: ROTULO_PLANO[u.plano] ?? u.plano, tom: 'ok' }
  }
  const dias = diasAte(u.trial_expira_em)
  if (dias === null) return { rotulo: 'Livre (conta antiga)', tom: 'neutro' }
  if (dias < 0) return { rotulo: 'Teste vencido', tom: 'aviso' }
  if (dias === 0) return { rotulo: 'Teste termina hoje', tom: 'aviso' }
  return { rotulo: `Teste, ${dias} ${dias === 1 ? 'dia' : 'dias'}`, tom: 'neutro' }
}

export default function AdminUsuariosBlock() {
  const { isAdmin } = useAuth()
  if (!isAdmin) return null

  return <UsuariosAdmin />
}

function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState<AdminUsuario[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [busca, setBusca] = useState('')

  // Diálogo de ações: um por vez, com o usuário alvo.
  const [alvo, setAlvo] = useState<AdminUsuario | null>(null)
  const [salvando, setSalvando] = useState(false)

  // Exclusão vive num segundo diálogo, de propósito: é irreversível, e o admin
  // vê o que será apagado antes de digitar o e-mail para confirmar.
  const [excluindo, setExcluindo] = useState<AdminUsuario | null>(null)
  const [previa, setPrevia] = useState<PreviaExclusao | null>(null)
  const [previaCarregando, setPreviaCarregando] = useState(false)
  const [digitado, setDigitado] = useState('')

  const carregar = useCallback(async () => {
    setLoading(true)
    setErro(null)
    try {
      const { usuarios: lista } = await listAdminUsuarios()
      setUsuarios(lista)
    } catch (error) {
      const msg = getErrorMessage(error)
      setErro(msg)
      toast.error('Falha ao carregar os usuários.', { description: msg })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase()
    if (!q) return usuarios
    return usuarios.filter(
      (u) => u.email.toLowerCase().includes(q) || u.name.toLowerCase().includes(q),
    )
  }, [usuarios, busca])

  const abrirExclusao = async (u: AdminUsuario) => {
    setExcluindo(u)
    setPrevia(null)
    setDigitado('')
    setPreviaCarregando(true)
    try {
      setPrevia(await previaExclusao(u.id))
    } catch (error) {
      toast.error('Não foi possível carregar a prévia.', { description: getErrorMessage(error) })
      setExcluindo(null)
    } finally {
      setPreviaCarregando(false)
    }
  }

  const confirmarExclusao = async () => {
    if (!excluindo) return
    setSalvando(true)
    try {
      const r = await excluirUsuario(excluindo.id, digitado.trim())
      toast.success(`Conta ${r.email} excluída.`, {
        description: r.negocios_apagados
          ? `${r.negocios_apagados} negócio(s) apagado(s) junto.`
          : undefined,
      })
      setExcluindo(null)
      setAlvo(null)
      await carregar()
    } catch (error) {
      toast.error('A exclusão não foi concluída.', { description: getErrorMessage(error) })
    } finally {
      setSalvando(false)
    }
  }

  const agir = async (fn: () => Promise<unknown>, sucesso: string) => {
    setSalvando(true)
    try {
      await fn()
      toast.success(sucesso)
      setAlvo(null)
      await carregar()
    } catch (error) {
      toast.error('A ação não foi concluída.', { description: getErrorMessage(error) })
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-4 w-4 text-muted-foreground" />
          Usuários
          {!loading && (
            <span className="text-sm font-normal text-muted-foreground tabular-nums">
              {usuarios.length}
            </span>
          )}
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative min-w-0 flex-1 sm:flex-none">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por e-mail ou nome"
              className="h-8 w-full pl-8 text-sm sm:w-56"
            />
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={carregar}>
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        ) : erro ? (
          <p className="py-4 text-sm text-muted-foreground">{erro}</p>
        ) : filtrados.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">
            {busca ? 'Ninguém com esse e-mail ou nome.' : 'Nenhum usuário ainda.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="pb-2 pr-3 font-medium">Usuário</th>
                  <th className="pb-2 pr-3 font-medium">Situação</th>
                  <th className="pb-2 pr-3 font-medium">Operações no mês</th>
                  <th className="pb-2 pr-3 font-medium">Cadastro</th>
                  <th className="pb-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((u) => {
                  const sit = situacao(u)
                  return (
                    <tr key={u.id} className="border-b border-border/60 last:border-0">
                      <td className="py-2.5 pr-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-foreground">{u.email}</span>
                          {u.isAdmin && (
                            <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
                              admin
                            </Badge>
                          )}
                          {!u.verified && (
                            <span
                              title="Ainda não confirmou o e-mail"
                              className="inline-flex items-center gap-1 text-amber-600"
                            >
                              <MailWarning className="h-3.5 w-3.5" />
                            </span>
                          )}
                        </div>
                        {u.name && <div className="text-xs text-muted-foreground">{u.name}</div>}
                      </td>
                      <td className="py-2.5 pr-3">
                        <span
                          className={
                            sit.tom === 'ok'
                              ? 'inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400'
                              : sit.tom === 'aviso'
                                ? 'inline-flex items-center gap-1 text-amber-700 dark:text-amber-500'
                                : 'inline-flex items-center gap-1 text-muted-foreground'
                          }
                        >
                          {sit.tom === 'ok' ? (
                            <BadgeCheck className="h-3.5 w-3.5" />
                          ) : (
                            <Clock className="h-3.5 w-3.5" />
                          )}
                          {sit.rotulo}
                        </span>
                      </td>
                      <td className="py-2.5 pr-3 tabular-nums">
                        {u.negocios_no_mes}
                        {u.plano_limite_negocios > 0 && (
                          <span className="text-muted-foreground">
                            {' '}
                            de {u.plano_limite_negocios}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 pr-3 tabular-nums text-muted-foreground">
                        {dataCurta(u.created)}
                      </td>
                      <td className="py-2.5 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => setAlvo(u)}
                        >
                          Gerenciar
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      <Dialog open={!!alvo} onOpenChange={(aberto) => !aberto && !salvando && setAlvo(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            {/* break-all pelo mesmo motivo do diálogo de exclusão: e-mail
                longo não quebra sozinho e estoura a largura da caixa. */}
            <DialogTitle className="break-all text-base">{alvo?.email}</DialogTitle>
            <DialogDescription>
              {alvo && situacao(alvo).rotulo}
              {alvo?.plano && alvo.plano_renova_em
                ? `, renova em ${dataCurta(alvo.plano_renova_em)}`
                : alvo?.trial_expira_em
                  ? `, teste até ${dataCurta(alvo.trial_expira_em)}`
                  : ''}
            </DialogDescription>
          </DialogHeader>

          {alvo && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                  Estender o teste
                </Label>
                <p className="text-xs text-muted-foreground">
                  Carimba o fim do teste para a data escolhida, contada de hoje. O plano, se houver,
                  não muda.
                </p>
                <div className="flex gap-2">
                  {[15, 30].map((dias) => (
                    <Button
                      key={dias}
                      variant="outline"
                      size="sm"
                      disabled={salvando}
                      onClick={() =>
                        agir(
                          () => estenderTeste(alvo.id, dias),
                          `Teste estendido por ${dias} dias.`,
                        )
                      }
                    >
                      +{dias} dias
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                  Carimbar plano
                </Label>
                <p className="text-xs text-muted-foreground">
                  Use depois de combinar o pagamento (ou o benefício Prime Circle). Mensal renova em
                  30 dias; anual, em 12 meses.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(['corretor', 'profissional', 'imobiliaria'] as const).map((p) => (
                    <div key={p} className="flex gap-1">
                      <Button
                        variant={alvo.plano === p ? 'default' : 'outline'}
                        size="sm"
                        className="flex-1 text-xs"
                        disabled={salvando}
                        onClick={() =>
                          agir(
                            () => carimbarPlano(alvo.id, p, 1),
                            `Plano ${ROTULO_PLANO[p]} registrado (mensal).`,
                          )
                        }
                      >
                        {ROTULO_PLANO[p]}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="px-2 text-xs"
                        title={`${ROTULO_PLANO[p]} anual`}
                        disabled={salvando}
                        onClick={() =>
                          agir(
                            () => carimbarPlano(alvo.id, p, 12),
                            `Plano ${ROTULO_PLANO[p]} registrado (anual).`,
                          )
                        }
                      >
                        12m
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground"
                    disabled={salvando || !alvo.plano}
                    onClick={() =>
                      agir(
                        () => carimbarPlano(alvo.id, '', 1),
                        'Plano removido. A conta volta à régua do teste.',
                      )
                    }
                  >
                    Remover plano
                  </Button>
                </div>
              </div>
            </div>
          )}

          {alvo && (
            <div className="space-y-5 border-t border-border pt-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                  Acesso e suporte
                </Label>
                <div className="flex flex-wrap gap-2">
                  {!alvo.verified && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      disabled={salvando}
                      onClick={() =>
                        agir(
                          () => reenviarConfirmacao(alvo.email),
                          'E-mail de confirmação reenviado.',
                        )
                      }
                    >
                      <Send className="mr-1.5 h-3.5 w-3.5" />
                      Reenviar confirmação
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    disabled={salvando}
                    onClick={() =>
                      agir(
                        () => definirAdmin(alvo.id, !alvo.isAdmin),
                        alvo.isAdmin ? 'Acesso de admin removido.' : 'Agora é admin.',
                      )
                    }
                  >
                    <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                    {alvo.isAdmin ? 'Remover admin' : 'Tornar admin'}
                  </Button>
                </div>
                {alvo.verified && (
                  <p className="text-xs text-muted-foreground">
                    O e-mail já foi confirmado, então não há o que reenviar.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                  Excluir conta
                </Label>
                <p className="text-xs text-muted-foreground">
                  Apaga a conta e os dados dela, inclusive os negócios. Não tem volta.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs text-destructive hover:text-destructive"
                  disabled={salvando}
                  onClick={() => abrirExclusao(alvo)}
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Excluir esta conta
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            {salvando && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            <Button variant="outline" disabled={salvando} onClick={() => setAlvo(null)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!excluindo}
        onOpenChange={(aberto) => !aberto && !salvando && setExcluindo(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
              Excluir conta
            </DialogTitle>
            {/* O e-mail vai aqui, e não no título: endereço longo não quebra
                sozinho e empurrava a largura do diálogo, cortando o botão. */}
            <DialogDescription className="break-all">{excluindo?.email}</DialogDescription>
            <p className="text-sm text-muted-foreground">
              A conta e os dados dela são apagados. Não tem volta.
            </p>
          </DialogHeader>

          {previaCarregando ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : previa ? (
            <div className="space-y-4">
              <div className="rounded-md border border-border bg-muted/40 p-3">
                <p className="text-xs font-medium text-foreground">O que vai junto</p>
                <ul className="mt-1.5 space-y-0.5 text-xs text-muted-foreground tabular-nums">
                  <li>{previa.contagens.negocios} negócio(s), com as partes cadastradas</li>
                  <li>{previa.contagens.validacoes} validação(ões) de minuta</li>
                  <li>{previa.contagens.chamados} chamado(s) de suporte</li>
                  <li>{previa.contagens.suporte} pedido(s) ao especialista</li>
                  <li>{previa.contagens.vinculos_como_membro} vínculo(s) com imobiliária</li>
                </ul>
              </div>

              {previa.pode_excluir ? (
                <div className="space-y-2">
                  <Label htmlFor="confirma-email" className="text-xs">
                    Para confirmar, digite o e-mail da conta
                  </Label>
                  <p className="break-all rounded bg-muted px-2 py-1 font-mono text-xs text-foreground">
                    {previa.email}
                  </p>
                  <Input
                    id="confirma-email"
                    value={digitado}
                    onChange={(e) => setDigitado(e.target.value)}
                    placeholder={previa.email}
                    autoComplete="off"
                    className="text-sm"
                  />
                </div>
              ) : (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
                  <p className="text-xs leading-relaxed text-destructive">{previa.bloqueio}</p>
                </div>
              )}
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="outline" disabled={salvando} onClick={() => setExcluindo(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={
                salvando ||
                !previa?.pode_excluir ||
                digitado.trim().toLowerCase() !== (previa?.email ?? '').toLowerCase()
              }
              onClick={confirmarExclusao}
            >
              {salvando && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
