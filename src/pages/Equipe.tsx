import { useEffect, useState, useCallback } from 'react'
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
} from 'lucide-react'
import { toast } from 'sonner'

import { IntroPagina } from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getEquipeResumo, type EquipeResumo } from '@/services/agencies'
import { getErrorMessage } from '@/lib/pocketbase/errors'

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

export default function EquipePage() {
  const [resumo, setResumo] = useState<EquipeResumo | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

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

  useEffect(() => {
    carregar()
  }, [carregar])

  return (
    <div className="w-full max-w-5xl space-y-5 animate-fade-in-up">
      <div className="space-y-1">
        <h1 className="font-display text-2xl md:text-3xl font-medium text-foreground flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" /> Equipe
        </h1>
        <IntroPagina
          frase="Membros da imobiliária, contagem de negócios e validações de cada corretor, e o acesso aos negócios da casa. Você vê os negócios que seus corretores intermediaram, com o aceite LGPD registrado."
          passos={[
            'Cada corretor vinculado com termo aceito tem os negócios dele carimbados com a imobiliária na criação.',
            'Abra qualquer negócio da casa pelo detalhe já existente — o acesso fica registrado para auditoria.',
            'Remover um corretor não apaga o vínculo: ele fica marcado como removido, preservando o histórico.',
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
                  Nenhum membro ativo. A Prime Circle vincula corretores pelo painel /admin.
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
                      </div>
                    )
                  })}
                </div>
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
