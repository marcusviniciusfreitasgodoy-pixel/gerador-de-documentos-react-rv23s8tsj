import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2, ArrowLeft, Send, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import pb from '@/lib/pocketbase/client'
import { getErrorMessage } from '@/lib/pocketbase/mensagens'

// Detalhe de chamado para o admin: lê a mensagem, responde e atualiza o status.
// O corretor acompanha a resposta na página Ajuda; aqui é o lado do admin.
// Mora num arquivo próprio porque a Fila de Atendimento do /admin linka para cá.
type Chamado = {
  id: string
  user: string
  tipo: string
  mensagem: string
  status: string
  resposta?: string
  created: string
  expand?: { user?: { id: string; name?: string; email?: string } }
}

const STATUS_OPTIONS = [
  { valor: 'aberto', rotulo: 'Aberto' },
  { valor: 'em_andamento', rotulo: 'Em andamento' },
  { valor: 'resolvido', rotulo: 'Resolvido' },
]

const STATUS_BADGE: Record<string, string> = {
  aberto: 'bg-primary/10 text-primary',
  em_andamento: 'bg-amber-500/10 text-amber-600',
  resolvido: 'bg-emerald-500/10 text-emerald-600',
}

export default function ChamadoDetalhePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [chamado, setChamado] = useState<Chamado | null>(null)
  const [resposta, setResposta] = useState('')
  const [status, setStatus] = useState('aberto')
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)

  const loadData = useCallback(async () => {
    if (!id) return
    try {
      const rec = await pb.collection('chamados').getOne<Chamado>(id, { expand: 'user' })
      setChamado(rec)
      setResposta(rec.resposta || '')
      setStatus(rec.status || 'aberto')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadData()
  }, [loadData])

  const salvar = async () => {
    if (!chamado) return
    setSalvando(true)
    try {
      await pb.collection('chamados').update(chamado.id, {
        resposta: resposta.trim(),
        status,
      })
      toast.success('Resposta salva! O corretor vê na página Ajuda.')
      await loadData()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSalvando(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!chamado) {
    return <p className="text-center text-muted-foreground py-12">Chamado não encontrado.</p>
  }

  const autor = chamado.expand?.user
  const stRotulo = STATUS_OPTIONS.find((s) => s.valor === chamado.status)?.rotulo || chamado.status

  return (
    <div className="w-full max-w-2xl space-y-6 animate-fade-in-up">
      <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
        <ArrowLeft className="mr-1 h-4 w-4" /> Voltar ao painel
      </Button>

      <Card className="shadow-elevation border-0 md:border md:border-border/60">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle className="text-xl text-primary flex items-center gap-2">
                <MessageCircle className="h-5 w-5" /> {chamado.tipo}
              </CardTitle>
              <CardDescription className="mt-1">
                {autor ? `${autor.name || autor.email || 'Corretor'} · ` : ''}
                {new Date(chamado.created).toLocaleString('pt-BR')}
              </CardDescription>
            </div>
            <Badge className={STATUS_BADGE[chamado.status] || ''}>{stRotulo}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold mb-1">Mensagem do corretor</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap rounded-lg bg-muted/40 p-3">
              {chamado.mensagem}
            </p>
          </div>

          {chamado.resposta && (
            <div>
              <h4 className="text-sm font-semibold mb-1">Resposta atual</h4>
              <p className="text-sm text-foreground whitespace-pre-wrap rounded-lg border border-border/60 p-3">
                {chamado.resposta}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="resposta">Responder ao corretor</Label>
            <Textarea
              id="resposta"
              rows={5}
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
              placeholder="Escreva a resposta. Ela aparece na página Ajuda do corretor."
            />
          </div>

          <div className="space-y-2">
            <Label>Status do chamado</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s.valor} value={s.valor}>
                    {s.rotulo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={salvar} disabled={salvando} className="w-full sm:w-auto">
            {salvando ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" /> Salvar resposta
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
