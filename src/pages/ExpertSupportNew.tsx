import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, ArrowLeft, Upload, X, FileText, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IntroPagina } from '@/components/Layout'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  createRequest,
  escalateRequest,
  objectiveLabels,
  urgencyLabels,
  type ExpertObjective,
  type ExpertUrgency,
} from '@/services/expert'
import { getErrorMessage } from '@/lib/pocketbase/mensagens'

const DOCUMENT_TYPES = [
  'Recibo de Sinal (Arras)',
  'Autorização de Intermediação',
  'Promessa/Compromisso',
  'Termo de Entrega das Chaves',
  'Termo de Transmissão da Posse',
  'Checklist',
  'Outro',
]

export default function ExpertSupportNewPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [documentType, setDocumentType] = useState('')
  const [objective, setObjective] = useState('')
  const [urgency, setUrgency] = useState('')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [saving, setSaving] = useState(false)

  const validate = () => {
    if (!objective || !urgency || !description.trim()) {
      toast.error('Preencha todos os campos obrigatórios.')
      return false
    }
    return true
  }

  const doCreate = () =>
    createRequest(
      { document_type: documentType || undefined, objective, urgency, description },
      files.length > 0 ? files : undefined,
    )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const created = await doCreate()
      toast.success('Solicitação criada com sucesso!')
      navigate(`/especialista/${created.id}`)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  // Atalho: cria a solicitação e já encaminha ao Especialista humano (Nível 2),
  // pulando a etapa de orientação da IA. A Descrição serve de contexto ao especialista.
  const handleDirectToSpecialist = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const created = await doCreate()
      await escalateRequest(created.id)
      toast.success('Enviado direto ao Especialista (Nível 2)!')
      navigate(`/especialista/${created.id}`)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    if (files.length + selected.length > 10) {
      toast.error('Máximo de 10 arquivos.')
      return
    }
    setFiles((prev) => [...prev, ...selected])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="w-full max-w-2xl space-y-4 animate-fade-in-up">
      <Button variant="ghost" size="sm" onClick={() => navigate('/especialista')}>
        <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
      </Button>
      <Card className="shadow-elevation border-0 md:border md:border-border/60">
        <CardHeader>
          <CardTitle className="text-xl text-primary">Nova Solicitação</CardTitle>
          <div className="mt-1">
            <IntroPagina
              frase="Descreva seu caso: a IA orienta em segundos e, se o caso pedir, você escala para o especialista humano, que responde com proposta de escopo, prazo e valor."
              passos={[
                'Escolha o objetivo (revisão completa, análise de risco, dúvida etc.) e descreva a situação.',
                'Anexe documentos se ajudar (matrícula, minuta, certidões).',
                'A IA responde primeiro. Se recomendar o especialista humano, você escala com um clique e acompanha a proposta aqui mesmo.',
              ]}
            />
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="doc-type">Tipo de Documento</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger id="doc-type">
                  <SelectValue placeholder="Selecione (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((dt) => (
                    <SelectItem key={dt} value={dt}>
                      {dt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="objective">Objetivo *</Label>
                <Select value={objective} onValueChange={setObjective}>
                  <SelectTrigger id="objective">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(objectiveLabels) as ExpertObjective[]).map((k) => (
                      <SelectItem key={k} value={k}>
                        {objectiveLabels[k]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="urgency">Urgência *</Label>
                <Select value={urgency} onValueChange={setUrgency}>
                  <SelectTrigger id="urgency">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(urgencyLabels) as ExpertUrgency[]).map((k) => (
                      <SelectItem key={k} value={k}>
                        {urgencyLabels[k]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Descreva detalhadamente sua necessidade..."
              />
            </div>
            <div className="space-y-2">
              <Label>Anexos (máx. 10 arquivos)</Label>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-1 h-4 w-4" /> Adicionar arquivos
              </Button>
              {files.length > 0 && (
                <div className="space-y-1">
                  {files.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-secondary/40 rounded-md px-3 py-1.5 text-sm"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <FileText className="h-3 w-3 shrink-0" /> {file.name}
                      </span>
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
            </div>
            <div className="space-y-2 pt-2">
              <Button type="submit" disabled={saving} className="w-full">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
                  </>
                ) : (
                  'Enviar Solicitação'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                className="w-full"
                onClick={handleDirectToSpecialist}
              >
                <ShieldCheck className="mr-2 h-4 w-4" /> Falar direto com o Especialista (Nível 2)
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Encaminha diretamente à equipe de especialistas, sem passar pela orientação da IA.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
