import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, FolderOpen, Building2, Users, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { listNegocios, createNegocio, deleteNegocio, type Negocio } from '@/lib/negocios'
import { useRealtime } from '@/hooks/use-realtime'

export default function NegociosPage() {
  const [negocios, setNegocios] = useState<Negocio[]>([])
  const [loading, setLoading] = useState(true)
  const [novoTitulo, setNovoTitulo] = useState('')
  const [creating, setCreating] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const navigate = useNavigate()

  const loadData = async () => {
    try {
      const data = await listNegocios()
      setNegocios(data)
    } catch {
      toast.error('Erro ao carregar negócios.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('negocios', () => {
    loadData()
  })

  const handleCreate = async () => {
    if (!novoTitulo.trim()) {
      toast.error('Digite um título para o negócio.')
      return
    }
    setCreating(true)
    try {
      const novo = await createNegocio({ titulo: novoTitulo.trim() })
      toast.success('Negócio criado!')
      setNovoTitulo('')
      navigate(`/negocios/${novo.id}`)
    } catch {
      toast.error('Erro ao criar negócio.')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteNegocio(deleteId)
      toast.success('Negócio excluído.')
      setDeleteId(null)
    } catch {
      toast.error('Erro ao excluir negócio.')
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-2">
        <FolderOpen className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-semibold text-primary">Negócios</h1>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-lg">Criar Novo Negócio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Título do negócio (ex: Apartamento 801 - Centro)"
              value={novoTitulo}
              onChange={(e) => setNovoTitulo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-1 h-4 w-4" />
              )}
              Novo
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : negocios.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            <FolderOpen className="mx-auto h-12 w-12 mb-3 opacity-50" />
            <p>Nenhum negócio cadastrado ainda.</p>
            <p className="text-sm">Crie um novo negócio acima para começar.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {negocios.map((n) => (
            <Card
              key={n.id}
              className="border-border/60 hover:border-primary/40 transition-colors cursor-pointer group"
            >
              <CardContent
                className="flex items-center justify-between p-4"
                onClick={() => navigate(`/negocios/${n.id}`)}
              >
                <div className="space-y-1">
                  <h3 className="font-semibold text-primary group-hover:text-primary/90">
                    {n.titulo}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {n.partes.length} {n.partes.length === 1 ? 'parte' : 'partes'}
                    </span>
                    {n.imovel.matricula && (
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5" />
                        Matrícula: {n.imovel.matricula}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeleteId(n.id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir negócio?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todos os dados salvos neste negócio serão perdidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
