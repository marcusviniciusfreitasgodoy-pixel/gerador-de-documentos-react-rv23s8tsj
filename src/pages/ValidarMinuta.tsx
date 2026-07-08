import { useState, useCallback } from 'react'
import {
  Loader2,
  FileSearch,
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  ShieldAlert,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { extractTextFromDocx } from '@/lib/docx-extract'
import {
  validarMinuta,
  type ValidarMinutaResponse,
  type ConformidadeStatus,
  type RiscoGravidade,
} from '@/services/validar-minuta'
import { getErrorMessage } from '@/lib/pocketbase/errors'

const DOCUMENT_TYPES = [
  { value: 'Promessa/Compromisso', label: 'Promessa/Compromisso' },
  { value: 'Recibo de Sinal (Arras)', label: 'Recibo de Sinal (Arras)' },
  { value: 'Autorização de Intermediação', label: 'Autorização de Intermediação' },
  { value: 'Termo de Entrega das Chaves', label: 'Termo de Entrega das Chaves' },
  { value: 'Termo de Transmissão da Posse', label: 'Termo de Transmissão da Posse' },
  { value: 'Genérico/Outro', label: 'Genérico/Outro' },
]

const conformidadeStyles: Record<ConformidadeStatus, { dot: string; label: string; text: string }> =
  {
    presente: { dot: 'bg-green-500', label: 'Presente', text: 'text-green-700' },
    fraco: { dot: 'bg-yellow-500', label: 'Fraco', text: 'text-yellow-700' },
    faltando: { dot: 'bg-red-500', label: 'Faltando', text: 'text-red-700' },
  }

const riscoStyles: Record<RiscoGravidade, { bg: string; text: string; label: string }> = {
  alto: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', label: 'Alto' },
  medio: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', label: 'Médio' },
  baixo: { bg: 'bg-gray-50 border-gray-200', text: 'text-gray-600', label: 'Baixo' },
}

export default function ValidarMinutaPage() {
  const [documentText, setDocumentText] = useState('')
  const [documentType, setDocumentType] = useState('Genérico/Outro')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ValidarMinutaResponse | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.docx')) {
      toast.error('Apenas arquivos .docx são suportados.')
      return
    }
    setUploading(true)
    try {
      const text = await extractTextFromDocx(file)
      setDocumentText(text)
      toast.success('Documento carregado com sucesso!')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }, [])

  const handleValidate = async () => {
    if (!documentText.trim()) {
      toast.error('Cole o texto do documento ou faça upload de um arquivo .docx.')
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const res = await validarMinuta(documentText, documentType)
      setResult(res)
      toast.success('Análise concluída!')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-4xl space-y-6 animate-fade-in-up">
      <Card className="shadow-elevation border-0 md:border md:border-border/60">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileSearch className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-xl text-primary">Validar Minuta</CardTitle>
              <CardDescription>
                Analise seu documento contra a base de conhecimento jurídico usando IA.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="doc-type">Tipo de Documento</Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger id="doc-type">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((dt) => (
                  <SelectItem key={dt.value} value={dt.value}>
                    {dt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="doc-text">Texto do Documento</Label>
              <div>
                <input
                  type="file"
                  accept=".docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="docx-upload"
                />
                <Button
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  onClick={() => document.getElementById('docx-upload')?.click()}
                >
                  {uploading ? (
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-1 h-4 w-4" />
                  )}
                  Upload .docx
                </Button>
              </div>
            </div>
            <Textarea
              id="doc-text"
              rows={10}
              placeholder="Cole aqui o texto da minuta ou faça upload de um arquivo .docx..."
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              className="resize-y"
            />
            <p className="text-xs text-muted-foreground">
              {documentText.length.toLocaleString('pt-BR')} caracteres
            </p>
          </div>

          <Button
            onClick={handleValidate}
            disabled={loading || !documentText.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <FileSearch className="mr-2 h-4 w-4" />
                Validar Minuta
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          <Card className="shadow-elevation border-0 md:border md:border-border/60">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg text-primary">Resumo</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.resumo}</p>
            </CardContent>
          </Card>

          {result.conformidade.length > 0 && (
            <Card className="shadow-elevation border-0 md:border md:border-border/60">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg text-primary">Conformidade</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.conformidade.map((item, idx) => {
                  const style = conformidadeStyles[item.status] || conformidadeStyles.faltando
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-3 border border-border/60 rounded-lg p-3 hover:bg-secondary/30 transition-colors"
                    >
                      <span className={cn('mt-1.5 h-3 w-3 rounded-full shrink-0', style.dot)} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm">{item.titulo}</span>
                          <span className={cn('text-xs font-semibold', style.text)}>
                            {style.label}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.observacao}</p>
                        {item.code && (
                          <span className="inline-block mt-1 text-xs font-mono bg-secondary px-2 py-0.5 rounded text-muted-foreground">
                            {item.code}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}

          {result.riscos.length > 0 && (
            <Card className="shadow-elevation border-0 md:border md:border-border/60">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg text-primary">Riscos Identificados</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.riscos.map((risco, idx) => {
                  const style = riscoStyles[risco.gravidade] || riscoStyles.baixo
                  return (
                    <div key={idx} className={cn('border rounded-lg p-3', style.bg)}>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <AlertTriangle className={cn('h-4 w-4', style.text)} />
                        <span className={cn('text-xs font-bold uppercase', style.text)}>
                          {style.label}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{risco.descricao}</p>
                      {risco.base_code && (
                        <span className="inline-block mt-1 text-xs font-mono bg-white/60 px-2 py-0.5 rounded text-muted-foreground">
                          {risco.base_code}
                        </span>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}

          {result.recomendacoes.length > 0 && (
            <Card className="shadow-elevation border-0 md:border md:border-border/60">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg text-primary">Recomendações</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.recomendacoes.map((rec, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 border border-border/60 rounded-lg p-3 hover:bg-secondary/30 transition-colors"
                  >
                    <Lightbulb className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{rec.texto}</p>
                      {rec.base_code && (
                        <span className="inline-block mt-1 text-xs font-mono bg-secondary px-2 py-0.5 rounded text-muted-foreground">
                          {rec.base_code}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {result.conformidade.length === 0 &&
            result.riscos.length === 0 &&
            result.recomendacoes.length === 0 && (
              <Card className="shadow-elevation border-0 md:border md:border-border/60">
                <CardContent className="py-8 text-center text-muted-foreground">
                  Nenhuma observação específica foi identificada para este documento.
                </CardContent>
              </Card>
            )}
        </div>
      )}
    </div>
  )
}
