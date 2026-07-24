import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import {
  Loader2,
  BookOpen,
  Plus,
  Trash2,
  Pencil,
  Search,
  X,
  Upload,
  Download,
  Sparkles,
  FileText,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IntroPagina } from '@/components/Layout'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
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
import pb from '@/lib/pocketbase/client'
import { extractTextFromDocument, isSupportedFile } from '@/lib/document-extract'

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

// Gera um code ÚNICO (anti-colisão): prefixo de 3 letras da categoria (ou KB) + nº
// incremental, garantido não repetir contra os codes já usados na base.
function gerarCode(category: string, usados: Set<string>): string {
  const base = (category || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z]/g, '')
    .toUpperCase()
  const prefixo = (base.slice(0, 3) || 'KB').padEnd(3, 'X')
  let max = 0
  usados.forEach((c) => {
    const m = c.match(new RegExp('^' + prefixo + '(\\d+)$'))
    if (m) max = Math.max(max, parseInt(m[1], 10))
  })
  let n = max + 1
  let code = prefixo + String(n).padStart(3, '0')
  while (usados.has(code)) {
    n++
    code = prefixo + String(n).padStart(3, '0')
  }
  usados.add(code)
  return code
}

// Página restrita ao admin (decisão do Marcus, 2026-07-24): a base é a régua
// jurídica interna da validação, não um recurso do corretor. O wrapper existe
// para o redirect não brigar com a regra dos hooks do componente de dentro.
export default function LegalKnowledgePage() {
  const { isAdmin } = useAuth()
  if (!isAdmin) return <Navigate to="/" replace />
  return <LegalKnowledgeAdmin />
}

function LegalKnowledgeAdmin() {
  const { isAdmin } = useAuth()
  const [items, setItems] = useState<LegalKnowledge[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState<EditState>(emptyForm)
  const [search, setSearch] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()

  // Importação por documento (contrato-modelo / cláusula / norma) -> registros.
  const [importOpen, setImportOpen] = useState(false)
  const [importMode, setImportMode] = useState<'documento' | 'unico'>('documento')
  const [importText, setImportText] = useState('')
  const [importFileName, setImportFileName] = useState('')
  const [importBusy, setImportBusy] = useState(false)
  // Reforço do admin: seleção em lote + filtro "recém-adicionados".
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [onlyRecent, setOnlyRecent] = useState(false)

  // Código vindo da tela Validar Minuta (citação clicável): /legal-knowledge?code=XXX
  const codeParam = searchParams.get('code')

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
  // Exporta a base COMPLETA. Busca do servidor de novo em vez de usar o `items` da tela:
  // se um dia essa lista passar a ser filtrada, o backup sairia pela metade em silencio.
  const [exportBusy, setExportBusy] = useState(false)
  const exportarJson = async () => {
    setExportBusy(true)
    try {
      const todos = await getLegalKnowledge()
      const payload = {
        exportado_em: new Date().toISOString(),
        total: todos.length,
        registros: todos,
      }
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `legal_knowledge_${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success(`${todos.length} registros exportados.`)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setExportBusy(false)
    }
  }

  useRealtime('legal_knowledge', () => {
    loadData()
  })

  // Ao chegar via citação, pré-preenche a busca com o código.
  useEffect(() => {
    if (codeParam) setSearch(codeParam)
  }, [codeParam])

  const query = search.trim().toLowerCase()
  const filtered = useMemo(() => {
    let list = items
    if (onlyRecent) {
      const cutoff = Date.now() - 60 * 60 * 1000
      list = list.filter((i) => {
        const c = (i as { created?: string }).created
        return c ? new Date(c).getTime() > cutoff : false
      })
    }
    if (!query) return list
    return list.filter((i) =>
      [i.code, i.title, i.category, i.content].some((f) =>
        (f || '').toString().toLowerCase().includes(query),
      ),
    )
  }, [items, query, onlyRecent])

  const clearSearch = () => {
    setSearch('')
    if (codeParam) setSearchParams({}, { replace: true })
  }

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

  // ---- Importação por documento ----
  const handleFile = async (file: File | undefined) => {
    if (!file) return
    if (!isSupportedFile(file)) {
      toast.error('Formato não suportado. Use PDF, DOCX ou imagem (converta .doc em PDF).')
      return
    }
    setImportBusy(true)
    setImportFileName(file.name)
    try {
      const texto = await extractTextFromDocument(file)
      setImportText(texto)
      toast.success('Texto extraído. Revise e clique em Importar.')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setImportBusy(false)
    }
  }

  const handleImport = async () => {
    const texto = importText.trim()
    if (!texto) {
      toast.error('Suba um arquivo ou cole o texto.')
      return
    }
    setImportBusy(true)
    try {
      const result = (await pb.send('/backend/v1/extrair-conhecimento', {
        method: 'POST',
        body: { texto, modo: importMode },
      })) as { registros?: { title?: string; category?: string; content?: string }[] }
      const registros = result?.registros || []
      if (!registros.length) {
        toast.error('A IA não encontrou regras no documento.')
        return
      }
      const usados = new Set(
        items.map((i) => (i.code || '').toUpperCase()).filter(Boolean) as string[],
      )
      let ok = 0
      for (const r of registros) {
        if (!r.content?.trim()) continue
        const code = gerarCode(r.category || '', usados)
        await createLegalKnowledge({
          title: r.title || code,
          category: r.category || undefined,
          code,
          content: r.content,
          priority: 50,
          version: 1,
        })
        ok++
      }
      toast.success(`${ok} registro(s) adicionado(s) à base.`)
      setImportOpen(false)
      setImportText('')
      setImportFileName('')
      loadData()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setImportBusy(false)
    }
  }

  // ---- Seleção / exclusão em lote ----
  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleBulkDelete = async () => {
    const ids = Array.from(selected)
    if (!ids.length) return
    setImportBusy(true)
    try {
      for (const id of ids) await deleteLegalKnowledge(id)
      toast.success(`${ids.length} registro(s) removido(s).`)
      setSelected(new Set())
      loadData()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setImportBusy(false)
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
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-xl text-primary">Base de Conhecimento Jurídico</CardTitle>
              <div className="mt-1">
                <IntroPagina
                  frase="As regras e cláusulas aprovadas que servem de régua para o Validador: é contra o que está aqui que toda minuta é conferida."
                  passos={[
                    'Consulte por código, título ou categoria para entender o que o validador cobra de cada documento.',
                    'Cada regra tem um código (ex.: FIX004, LGP001) que aparece nos resultados da validação.',
                    'Administradores podem criar, editar ou importar regras: a mudança vale já na validação seguinte.',
                  ]}
                />
              </div>
            </div>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-2 shrink-0">
              <Button size="sm" variant="outline" onClick={exportarJson} disabled={exportBusy}>
                {exportBusy ? (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-1 h-4 w-4" />
                )}
                Exportar
              </Button>
              {/* Importar de documento */}
              <Dialog
                open={importOpen}
                onOpenChange={(open) => {
                  setImportOpen(open)
                  if (!open) {
                    setImportText('')
                    setImportFileName('')
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Upload className="mr-1 h-4 w-4" /> Importar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Importar de documento</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Suba um contrato-modelo, uma cláusula, ou uma norma (lei, deliberação,
                      orientação). A IA extrai e adiciona os registros à base.
                    </p>
                    {/* Modo */}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={importMode === 'documento' ? 'default' : 'outline'}
                        onClick={() => setImportMode('documento')}
                      >
                        Documento → várias regras
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={importMode === 'unico' ? 'default' : 'outline'}
                        onClick={() => setImportMode('unico')}
                      >
                        Item único
                      </Button>
                    </div>
                    {/* Upload */}
                    <div className="space-y-1">
                      <Label>Arquivo (PDF, DOCX ou imagem)</Label>
                      <Input
                        type="file"
                        accept=".pdf,.docx,.png,.jpg,.jpeg"
                        disabled={importBusy}
                        onChange={(e) => handleFile(e.target.files?.[0])}
                      />
                      {importFileName && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <FileText className="h-3 w-3" /> {importFileName}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        .doc antigo não é suportado: converta em PDF.
                      </p>
                    </div>
                    {/* Texto (colar ou revisar o extraído) */}
                    <div className="space-y-1">
                      <Label htmlFor="imp-text">Texto (cole aqui ou revise o extraído)</Label>
                      <Textarea
                        id="imp-text"
                        rows={8}
                        value={importText}
                        onChange={(e) => setImportText(e.target.value)}
                        placeholder="Cole o texto do documento/cláusula, ou suba um arquivo acima."
                      />
                    </div>
                    <Button
                      type="button"
                      className="w-full"
                      disabled={importBusy || !importText.trim()}
                      onClick={handleImport}
                    >
                      {importBusy ? (
                        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="mr-1 h-4 w-4" />
                      )}
                      Extrair e adicionar à base
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Novo (manual) */}
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
                        onChange={(e) =>
                          setEditForm({ ...editForm, trigger_logic: e.target.value })
                        }
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
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por código, título, categoria ou conteúdo..."
            className="pl-9 pr-9"
          />
          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Limpar busca"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {isAdmin && (
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <label className="flex items-center gap-1.5 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[var(--primary)]"
                checked={onlyRecent}
                onChange={(e) => setOnlyRecent(e.target.checked)}
              />
              Só recém-adicionados (última hora)
            </label>
            {selected.size > 0 && (
              <Button
                size="sm"
                variant="destructive"
                disabled={importBusy}
                onClick={handleBulkDelete}
              >
                <Trash2 className="mr-1 h-4 w-4" /> Excluir selecionados ({selected.size})
              </Button>
            )}
          </div>
        )}

        {query && (
          <p className="text-xs text-muted-foreground mb-3">
            {filtered.length} resultado(s) para “{search}”.
          </p>
        )}

        {items.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum registro cadastrado ainda.
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum registro encontrado para a busca.
          </p>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => {
              const highlighted =
                !!codeParam && (item.code || '').toLowerCase() === codeParam.toLowerCase()
              return (
                <div
                  key={item.id}
                  className={cn(
                    'border rounded-lg p-4 transition-colors',
                    highlighted
                      ? 'border-primary ring-2 ring-primary/30 bg-primary/5'
                      : 'border-border/60 hover:bg-secondary/40',
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    {isAdmin && (
                      <input
                        type="checkbox"
                        className="h-4 w-4 mt-1 accent-[var(--primary)] shrink-0"
                        checked={selected.has(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        aria-label="Selecionar registro"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-primary">{item.title}</h4>
                      <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                        {item.category && <span>Categoria: {item.category}</span>}
                        {item.code && <span>Código: {item.code}</span>}
                        {item.priority !== undefined && <span>Prioridade: {item.priority}</span>}
                        {item.version !== undefined && <span>Versão: {item.version}</span>}
                      </div>
                      <p
                        className={cn(
                          'text-sm text-muted-foreground mt-2',
                          highlighted ? 'whitespace-pre-wrap' : 'line-clamp-3',
                        )}
                      >
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
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
