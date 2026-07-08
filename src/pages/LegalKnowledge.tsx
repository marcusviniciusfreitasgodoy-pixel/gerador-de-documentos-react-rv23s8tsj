import { useState, useEffect, useCallback } from 'react'
import { Loader2, BookOpen, Plus, Trash2, Pencil } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import {
  getLegalKnowledge,
  createLegalKnowledge,
  updateLegalKnowledge,
  deleteLegalKnowledge,
  type LegalKnowledge,
} from '@/services/legal-knowledge'
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
  priority: '',
  version: '',
}

export default function LegalKnowledgePage() {
  const { isAdmin } = useAuth()
  const [items, setItems] = useState<LegalKnowledge[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState<EditState>(emptyForm)

  const loadData = useCallback(async () => {
    try {
      const data = await getLegalKnowledge()
      setItems(data)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])
  useRealtime('legal_knowledge', () => {
    loadData()
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      title: editForm.title,
      category: editForm.category || undefined,
      code: editForm.code || undefined,
      trigger_logic: editForm.trigger_logic || undefined,
      content: editForm.content,
      priority: editForm.priority ? Number(editForm.priority) : undefined,
      version: editForm.version ? Number(editForm.version) : undefined,
    }
    try {
      if (editForm.id) {
        await updateLegalKnowledge(editForm.id, payload)
        toast.success('Registro atualizado!')
      } else {
        await createLegalKnowledge(payload)
        toast.success('Registro criado!')
      }
      setDialogOpen(false)
      setEditForm(emptyForm)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleEdit = (item: LegalKnowledge) => {
    setEditForm({
      id: item.id,
      title: item.title,
      category: item.category || '',
      code: item.code || '',
      trigger_logic: item.trigger_logic || '',
      content: item.content,
      priority: item.priority?.toString() || '',
      version: item.version?.toString() || '',
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteLegalKnowledge(id)
      toast.success('Registro removido!')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card className="w-full max-w-4xl shadow-elevation border-0 md:border md:border-border/60 animate-fade-in-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-xl text-primary">Base de Conhecimento Jurídico</CardTitle>
              <CardDescription>Referências legais para geração de documentos.</CardDescription>
            </div>
          </div>
          {isAdmin && (
            <Dialog
              open={dialogOpen}
              onOpenChange={(open) => {
                setDialogOpen(open)
                if (!open) setEditForm(emptyForm)
              }}
            >
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-1 h-4 w-4" /> Novo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editForm.id ? 'Editar' : 'Novo'} Registro</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSave} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="lk-title">Título *</Label>
                    <Input
                      id="lk-title"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="lk-category">Categoria</Label>
                      <Input
                        id="lk-category"
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="lk-code">Código</Label>
                      <Input
                        id="lk-code"
                        value={editForm.code}
                        onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lk-trigger">Lógica de Disparo</Label>
                    <Input
                      id="lk-trigger"
                      value={editForm.trigger_logic}
                      onChange={(e) => setEditForm({ ...editForm, trigger_logic: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lk-content">Conteúdo *</Label>
                    <Textarea
                      id="lk-content"
                      rows={4}
                      value={editForm.content}
                      onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="lk-priority">Prioridade</Label>
                      <Input
                        id="lk-priority"
                        type="number"
                        value={editForm.priority}
                        onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="lk-version">Versão</Label>
                      <Input
                        id="lk-version"
                        type="number"
                        value={editForm.version}
                        onChange={(e) => setEditForm({ ...editForm, version: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Salvar
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum registro cadastrado ainda.
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="border border-border/60 rounded-lg p-4 hover:bg-secondary/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-primary">{item.title}</h4>
                    <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                      {item.category && <span>Categoria: {item.category}</span>}
                      {item.code && <span>Código: {item.code}</span>}
                      {item.priority !== undefined && <span>Prioridade: {item.priority}</span>}
                      {item.version !== undefined && <span>Versão: {item.version}</span>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                      {item.content}
                    </p>
                    {item.trigger_logic && (
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        Disparo: {item.trigger_logic}
                      </p>
                    )}
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1 shrink-0">
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
