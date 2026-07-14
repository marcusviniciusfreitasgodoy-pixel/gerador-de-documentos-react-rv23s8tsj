import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import {
  Loader2,
  FileSearch,
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { extractTextFromDocument } from '@/lib/document-extract'
import { FileDropZone } from '@/components/FileDropZone'
import {
  validarMinuta,
  normalizeValidationResult,
  type ValidarMinutaResponse,
} from '@/services/validar-minuta'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import { categorizeValidationError, type ErrorCategory } from '@/lib/validation-errors'
import {
  DOCUMENT_TYPES,
  conformidadeStyles,
  statusStyles,
  riscoStyles,
  errorDisplayConfig,
} from '@/lib/validation-config'

// Código de citação clicável → abre a Base de Conhecimento filtrada por esse code.
function CitationCode({ code }: { code: string }) {
  return (
    <Link
      to={`/legal-knowledge?code=${encodeURIComponent(code)}`}
      title="Ver na Base de Conhecimento"
      className="inline-block mt-1 text-xs font-mono bg-secondary px-2 py-0.5 rounded text-primary hover:bg-primary/10 hover:underline transition-colors"
    >
      {code}
    </Link>
  )
}

export default function ValidarMinutaPage() {
  const [documentText, setDocumentText] = useState('')
  const [documentType, setDocumentType] = useState('Genérico/Outro')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ValidarMinutaResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [errorCategory, setErrorCategory] = useState<ErrorCategory | null>(null)
  const [uploading, setUploading] = useState(false)
  const isSubmittingRef = useRef(false)

  const safeResult = useMemo(() => {
    if (!result) return null
    return normalizeValidationResult(result)
  }, [result])

  const uniqueConformidade = useMemo(() => {
    if (!safeResult?.conformidade) return []
    const seen = new Set<string>()
    return safeResult.conformidade.filter((item) => {
      const key = item?.code || ''
      if (key && seen.has(key)) return false
      if (key) seen.add(key)
      return true
    })
  }, [safeResult])

  const statusInfo = useMemo(() => {
    if (!safeResult?.status) return null
    return statusStyles[safeResult.status] || statusStyles.yellow
  }, [safeResult])

  const StatusIcon = statusInfo?.icon
  const errorConfig = errorCategory ? errorDisplayConfig[errorCategory] : null
  const ErrorIcon = errorConfig?.icon

  const handleFileUpload = useCallback(async (file: File) => {
    const ext = file.name.toLowerCase().split('.').pop() || ''
    const supported = ['pdf', 'png', 'jpg', 'jpeg', 'docx']
    if (!supported.includes(ext)) {
      toast.error('Formato não suportado. Use PDF, PNG, JPG ou DOCX.')
      return
    }
    setUploading(true)
    try {
      const text = await extractTextFromDocument(file)
      setDocumentText(text)
      toast.success('Texto extraído com sucesso!')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setUploading(false)
    }
  }, [])

  const runValidation = useCallback(async (text: string, type: string) => {
    if (isSubmittingRef.current) return
    if (!text.trim()) {
      toast.error('Cole o texto do documento ou faça upload de um arquivo .docx.')
      return
    }
    isSubmittingRef.current = true
    setLoading(true)
    setResult(null)
    setError(null)
    setErrorCategory(null)
    try {
      const res = await validarMinuta(text, type)
      setResult(res)
      toast.success('Análise concluída!')
    } catch (err: unknown) {
      const categorized = categorizeValidationError(err)
      setErrorCategory(categorized.category)
      setError(categorized.message)
      toast.error(categorized.message)
    } finally {
      setLoading(false)
      isSubmittingRef.current = false
    }
  }, [])

  const handleValidate = () => runValidation(documentText, documentType)

  const location = useLocation()
  const autoRan = useRef(false)
  useEffect(() => {
    const st = location.state as { texto?: string; tipo?: string } | null
    if (!autoRan.current && st?.texto) {
      autoRan.current = true
      setDocumentText(st.texto)
      const tipo = st.tipo || documentType
      if (st.tipo) setDocumentType(st.tipo)
      window.history.replaceState({}, document.title)
      runValidation(st.texto, tipo)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

          <div className="space-y-3">
            <Label>Texto do Documento</Label>
            <FileDropZone
              onFileSelect={handleFileUpload}
              disabled={uploading || loading}
              loading={uploading}
              loadingText="Extraindo texto do documento..."
            />
            <Textarea
              id="doc-text"
              rows={10}
              placeholder="Cole aqui o texto da minuta ou faça upload de um documento..."
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
            disabled={loading || uploading || !documentText.trim()}
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

      {error && errorConfig && ErrorIcon && (
        <Alert variant="destructive">
          <ErrorIcon className="h-4 w-4" />
          <AlertTitle>{errorConfig.title}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {safeResult && (
        <div className="space-y-4">
          {statusInfo && StatusIcon && (
            <div
              className={cn(
                'flex items-center gap-3 border rounded-lg p-4 animate-fade-in',
                statusInfo.bg,
              )}
            >
              <StatusIcon className={cn('h-6 w-6 shrink-0', statusInfo.text)} />
              <div>
                <span className={cn('font-bold', statusInfo.text)}>{statusInfo.label}</span>
                <span className="text-sm text-muted-foreground ml-2">Status geral da minuta</span>
              </div>
            </div>
          )}

          <Card className="shadow-elevation border-0 md:border md:border-border/60">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg text-primary">Resumo</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {safeResult.resumo || 'Sem resumo disponível.'}
              </p>
            </CardContent>
          </Card>

          {uniqueConformidade.length > 0 && (
            <Card className="shadow-elevation border-0 md:border md:border-border/60">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg text-primary">Conformidade</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {uniqueConformidade.map((item, idx) => {
                  const style = conformidadeStyles[item?.status] || conformidadeStyles.faltando
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-3 border border-border/60 rounded-lg p-3 hover:bg-secondary/30 transition-colors"
                    >
                      <span className={cn('mt-1.5 h-3 w-3 rounded-full shrink-0', style.dot)} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm">
                            {item?.titulo || 'Sem título'}
                          </span>
                          <span className={cn('text-xs font-semibold', style.text)}>
                            {style.label}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item?.descricao || ''}
                        </p>
                        {item?.code && <CitationCode code={item.code} />}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}

          {safeResult.riscos.length > 0 && (
            <Card className="shadow-elevation border-0 md:border md:border-border/60">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg text-primary">Riscos Identificados</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {safeResult.riscos.map((risco, idx) => {
                  const style = riscoStyles[risco?.gravidade] || riscoStyles.baixo
                  return (
                    <div key={idx} className={cn('border rounded-lg p-3', style.bg)}>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <AlertTriangle className={cn('h-4 w-4', style.text)} />
                        <span className={cn('text-xs font-bold uppercase', style.text)}>
                          {style.label}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{risco?.descricao || ''}</p>
                      {risco?.base_code && <CitationCode code={risco.base_code} />}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}

          {safeResult.recomendacoes.length > 0 && (
            <Card className="shadow-elevation border-0 md:border md:border-border/60">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg text-primary">Recomendações</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {safeResult.recomendacoes.map((rec, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 border border-border/60 rounded-lg p-3 hover:bg-secondary/30 transition-colors"
                  >
                    <Lightbulb className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{rec?.texto || ''}</p>
                      {rec?.base_code && <CitationCode code={rec.base_code} />}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {uniqueConformidade.length === 0 &&
            safeResult.riscos.length === 0 &&
            safeResult.recomendacoes.length === 0 && (
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
