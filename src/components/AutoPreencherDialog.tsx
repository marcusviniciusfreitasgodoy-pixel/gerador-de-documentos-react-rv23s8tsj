import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileDropZone } from '@/components/FileDropZone'
import { BatchFileList } from '@/components/BatchFileList'
import { Loader2, Sparkles, Check, ArrowLeft, User, Building2, X } from 'lucide-react'
import { toast } from 'sonner'
import { extractDocumentsBatch } from '@/lib/doc-extract-upload'
import { mergeResults } from '@/lib/extraction-types'
import type {
  ExtractionMotor,
  ExtracaoResult,
  PessoaRole,
  PessoaExtraida,
  ImovelExtraido,
  BatchFileItem,
} from '@/lib/extraction-types'
import { emptyImovel } from '@/lib/extraction-types'

interface AutoPreencherDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApply: (data: ExtracaoResult, roles: Record<number, PessoaRole>) => void
}

const ROLE_LABELS: Record<PessoaRole, string> = {
  vendedor: 'Vendedor(a)',
  comprador: 'Comprador(a)',
  anuente: 'Anuente',
  ignorar: 'Ignorar',
}

function guessRole(fonte: string): PessoaRole {
  if (fonte === 'vendedor') return 'vendedor'
  if (fonte === 'comprador') return 'comprador'
  return 'ignorar'
}

// Custo transparente (estimativa em R$). Tesseract é local/grátis → sem meta.
const PRECOS_USD_POR_MILHAO: Record<string, { in: number; out: number }> = {
  'claude-sonnet-5': { in: 3, out: 15 },
  'gemini-3.1-flash-lite': { in: 0.25, out: 1.5 },
}
const USD_BRL = 5.5

function formatCusto(meta?: ExtracaoResult['meta']): string | null {
  if (!meta || !meta.usage) return null
  const { in: tin, out: tout, modelo } = meta.usage
  const rate = PRECOS_USD_POR_MILHAO[modelo] || { in: 0, out: 0 }
  const brl = ((tin / 1e6) * rate.in + (tout / 1e6) * rate.out) * USD_BRL
  const custo = brl < 0.01 ? '< R$ 0,01' : `~R$ ${brl.toFixed(2).replace('.', ',')}`
  return `${modelo} · ${tin.toLocaleString('pt-BR')} tok entrada / ${tout.toLocaleString('pt-BR')} tok saída · ${custo}`
}

export function AutoPreencherDialog({ open, onOpenChange, onApply }: AutoPreencherDialogProps) {
  const [motor, setMotor] = useState<ExtractionMotor>('claude')
  const [files, setFiles] = useState<File[]>([])
  const [batchItems, setBatchItems] = useState<BatchFileItem[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ExtracaoResult | null>(null)
  const [roles, setRoles] = useState<Record<number, PessoaRole>>({})
  const [pessoas, setPessoas] = useState<PessoaExtraida[]>([])
  const [imovel, setImovel] = useState<ImovelExtraido>(emptyImovel)

  // Acumula seleções (anexa + deduplica por nome+tamanho) — permite adicionar
  // escritura, CNH e outros um a um sem que uma seleção apague a anterior.
  const handleFilesSelected = (novos: File[]) => {
    setFiles((prev) => {
      const combinados = [...prev]
      for (const f of novos) {
        if (!combinados.some((x) => x.name === f.name && x.size === f.size)) combinados.push(f)
      }
      return combinados
    })
    // nova seleção invalida um lote/resultado anterior
    setBatchItems(null)
    setResult(null)
  }

  const handleExtract = async () => {
    if (!files.length) {
      toast.error('Selecione pelo menos um arquivo.')
      return
    }
    setLoading(true)
    setBatchItems(
      files.map((f) => ({ file: f, status: 'pending' as const, statusLabel: 'Aguardando...' })),
    )
    try {
      const items = await extractDocumentsBatch(files, motor, (updated) => {
        setBatchItems(updated.map((x) => ({ ...x })))
      })
      const successResults = items
        .filter((i) => i.status === 'completed' && i.result)
        .map((i) => i.result!)
      const hasErrors = items.some((i) => i.status === 'error')
      if (successResults.length === 0) {
        toast.error('Nenhum documento pôde ser processado com sucesso.')
      } else {
        const merged = mergeResults(successResults)
        setResult(merged)
        setPessoas(merged.pessoas)
        setImovel(merged.imovel)
        const initialRoles: Record<number, PessoaRole> = {}
        merged.pessoas.forEach((p, i) => {
          initialRoles[i] = guessRole(p._fonte)
        })
        setRoles(initialRoles)
        if (!merged.pessoas.length)
          toast.info('Nenhuma pessoa encontrada. Verifique os dados do imóvel.')
        if (hasErrors)
          toast.info(
            'Alguns documentos falharam. Os dados dos documentos bem-sucedidos foram mesclados.',
          )
      }
    } catch (err: any) {
      toast.error(err instanceof Error ? err.message : 'Falha ao extrair dados.')
    } finally {
      setLoading(false)
    }
  }

  const updatePessoa = (i: number, field: keyof PessoaExtraida, value: string) => {
    setPessoas((prev) => prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)))
  }

  const updateImovel = (field: keyof ImovelExtraido, value: string) => {
    setImovel((prev) => ({ ...prev, [field]: value }))
  }

  const handleApply = () => {
    if (!result) return
    onApply({ pessoas, imovel }, roles)
    reset()
  }

  const reset = () => {
    setResult(null)
    setFiles([])
    setBatchItems(null)
    setPessoas([])
    setRoles({})
    setImovel(emptyImovel)
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const showBatchList = batchItems && (!result || batchItems.some((i) => i.status === 'error'))

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        if (!v) reset()
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Auto-Preencher a partir de Documentos
          </DialogTitle>
          <DialogDescription>
            Faça upload de um ou mais documentos para extrair dados automaticamente.
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Motor de Extração</label>
              <Select value={motor} onValueChange={(v) => setMotor(v as ExtractionMotor)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="claude">Claude (IA Vision)</SelectItem>
                  <SelectItem value="gemini">Gemini (IA Vision)</SelectItem>
                  <SelectItem value="tesseract">Tesseract (OCR Local)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <FileDropZone
              multiple
              onFilesSelect={handleFilesSelected}
              selectedFiles={files}
              loading={loading}
              loadingText="Processando documentos..."
            />
            <p className="text-xs text-muted-foreground -mt-2">
              Você pode adicionar vários documentos (escritura, CNH, RG…) — de uma vez ou um a um.
            </p>
            {files.length > 0 && !batchItems && (
              <div className="space-y-1">
                {files.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-secondary/40 rounded-md px-3 py-1.5 text-sm"
                  >
                    <span className="truncate">{f.name}</span>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => removeFile(i)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {showBatchList && <BatchFileList items={batchItems!} />}
            <Button onClick={handleExtract} disabled={loading || !files.length} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Extraindo...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Extrair dados ({files.length}{' '}
                  {files.length === 1 ? 'arquivo' : 'arquivos'})
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {formatCusto(result?.meta) && (
              <p className="text-xs text-muted-foreground rounded-md bg-secondary/40 px-3 py-1.5">
                Custo estimado: {formatCusto(result?.meta)}
              </p>
            )}
            {showBatchList && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Status do Processamento</h3>
                <BatchFileList items={batchItems!} />
              </div>
            )}
            {pessoas.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" /> Pessoas Encontradas
                </h3>
                {pessoas.map((p, i) => (
                  <div key={i} className="rounded-lg border border-border/60 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">
                        Pessoa {i + 1}
                      </span>
                      <Select
                        value={roles[i] || 'ignorar'}
                        onValueChange={(v) =>
                          setRoles((prev) => ({ ...prev, [i]: v as PessoaRole }))
                        }
                      >
                        <SelectTrigger className="w-36 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(ROLE_LABELS).map(([val, label]) => (
                            <SelectItem key={val} value={val}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input
                        placeholder="Nome"
                        value={p.nome}
                        onChange={(e) => updatePessoa(i, 'nome', e.target.value)}
                      />
                      <Input
                        placeholder="CPF"
                        value={p.cpf}
                        onChange={(e) => updatePessoa(i, 'cpf', e.target.value)}
                      />
                      <Input
                        placeholder="Profissão"
                        value={p.profissao}
                        onChange={(e) => updatePessoa(i, 'profissao', e.target.value)}
                      />
                      <Input
                        placeholder="Estado Civil"
                        value={p.estado_civil}
                        onChange={(e) => updatePessoa(i, 'estado_civil', e.target.value)}
                      />
                      <Input
                        placeholder="Endereço"
                        value={p.endereco}
                        onChange={(e) => updatePessoa(i, 'endereco', e.target.value)}
                        className="md:col-span-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" /> Dados do Imóvel
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input
                  placeholder="Descrição"
                  value={imovel.descricao}
                  onChange={(e) => updateImovel('descricao', e.target.value)}
                  className="md:col-span-2"
                />
                <Input
                  placeholder="Endereço"
                  value={imovel.endereco}
                  onChange={(e) => updateImovel('endereco', e.target.value)}
                  className="md:col-span-2"
                />
                <Input
                  placeholder="Matrícula"
                  value={imovel.matricula}
                  onChange={(e) => updateImovel('matricula', e.target.value)}
                />
                <Input
                  placeholder="IPTU"
                  value={imovel.iptu}
                  onChange={(e) => updateImovel('iptu', e.target.value)}
                />
                <Input
                  placeholder="Cidade"
                  value={imovel.cidade}
                  onChange={(e) => updateImovel('cidade', e.target.value)}
                />
                <Input
                  placeholder="UF"
                  value={imovel.uf}
                  onChange={(e) => updateImovel('uf', e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={reset} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <Button onClick={handleApply} className="flex-1">
                <Check className="mr-2 h-4 w-4" /> Aplicar ao formulário
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
