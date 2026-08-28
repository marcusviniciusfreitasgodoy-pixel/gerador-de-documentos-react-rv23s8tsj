import { useState } from 'react'
import { Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createProposal, complexityLabels, type ComplexityType } from '@/services/expert'
import { getErrorMessage } from '@/lib/pocketbase/mensagens'

interface ProposalFormProps {
  requestId: string
  onSuccess: () => void
}

export function ProposalForm({ requestId, onSuccess }: ProposalFormProps) {
  const [scope, setScope] = useState('')
  const [deadlineDays, setDeadlineDays] = useState('')
  const [value, setValue] = useState('')
  const [complexity, setComplexity] = useState<ComplexityType>('standard')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!scope.trim() || !deadlineDays || !value) {
      toast.error('Preencha todos os campos da proposta.')
      return
    }
    setSaving(true)
    try {
      await createProposal({
        request: requestId,
        scope,
        deadline_days: Number(deadlineDays),
        value: Number(value),
        complexity_type: complexity,
      })
      toast.success('Proposta emitida com sucesso!')
      setScope('')
      setDeadlineDays('')
      setValue('')
      setComplexity('standard')
      onSuccess()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="prop-scope">Escopo da Proposta *</Label>
        <Textarea
          id="prop-scope"
          rows={3}
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label htmlFor="prop-deadline">Prazo (dias) *</Label>
          <Input
            id="prop-deadline"
            type="number"
            min={1}
            value={deadlineDays}
            onChange={(e) => setDeadlineDays(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="prop-value">Valor (R$) *</Label>
          <Input
            id="prop-value"
            type="number"
            min={0}
            step="0.01"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="prop-complexity">Complexidade *</Label>
          <Select value={complexity} onValueChange={(v) => setComplexity(v as ComplexityType)}>
            <SelectTrigger id="prop-complexity">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(complexityLabels) as ComplexityType[]).map((k) => (
                <SelectItem key={k} value={k}>
                  {complexityLabels[k]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" disabled={saving} className="w-full">
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" /> Emitir Proposta
          </>
        )}
      </Button>
    </form>
  )
}
