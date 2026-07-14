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
import { Loader2, Sparkles, Check, ArrowLeft, User, Building2 } from 'lucide-react'
import { toast } from 'sonner'
import { extractDocument } from '@/lib/doc-extract-upload'
import type {
  ExtractionMotor,
  ExtracaoResult,
  PessoaRole,
  PessoaExtraida,
  ImovelExtraido,
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

export function AutoPreencherDialog({ open, onOpenChange, onApply }: AutoPreencherDialogProps) {
  const [motor, setMotor] = useState<ExtractionMotor>('claude')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ExtracaoResult | null>(null)
  const [roles, setRoles] = useState<Record<number, PessoaRole>>({})
  const [pessoas, setPessoas] = useState<PessoaExtraida[]>([])
  const [imovel, setImovel] = useState<ImovelExtraido>(emptyImovel)

  const handleExtract = async () => {
    if (!file) {
      toast.error('Selecione um arquivo.')
      return
    }
    setLoading(true)
    try {
      const res = await extractDocument(file, motor)
      setResult(res)
      setPessoas(res.pessoas)
      setImovel(res.imovel)
      const initialRoles: Record<number, PessoaRole> = {}
      res.pessoas.forEach((p, i) => {
        initialRoles[i] = guessRole(p._fonte)
      })
      setRoles(initialRoles)
      if (!res.pessoas.length)
        toast.info('Nenhuma pessoa encontrada. Verifique os dados do imóvel.')
    } catch (err: any) {
      toast.error(err?.message || 'Falha ao extrair dados.')
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
    setFile(null)
    setPessoas([])
    setRoles({})
    setImovel(emptyImovel)
  }

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
            Auto-Preencher a partir de Documento
          </DialogTitle>
          <DialogDescription>
            Faça upload de um documento para extrair dados automaticamente.
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
              onFileSelect={setFile}
              loading={loading}
              loadingText="Extraindo dados..."
            />
            {file && <p className="text-sm text-muted-foreground">Arquivo: {file.name}</p>}
            <Button onClick={handleExtract} disabled={loading || !file} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Extraindo...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Extrair dados
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
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
