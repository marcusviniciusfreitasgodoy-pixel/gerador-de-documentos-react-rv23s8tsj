import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Download, Wand2, FileCheck2, AlertCircle, FileSearch } from 'lucide-react'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { generateChecklistDocx, getChecklistText } from '@/lib/checklistDocx'
import { getBrokerProfile, getBrokerDisplay } from '@/services/broker-profile'

const checklistSchema = z.object({
  transacao: z.string().min(1, 'Selecione o tipo de transação'),
  imovel_resumo: z.string().min(1, 'Obrigatório'),
  responsavel: z.string().min(1, 'Obrigatório'),
})

type ChecklistValues = z.infer<typeof checklistSchema>

const TRANSACAO_OPTIONS = ['Compra e Venda', 'Permuta', 'Doação', 'Locação', 'Inventário'] as const

const mockData: ChecklistValues = {
  transacao: 'Compra e Venda',
  imovel_resumo:
    'Apartamento nº 801, Edifício Solar, 8º andar, Rua das Acácias 150, Rio de Janeiro/RJ, matrícula 78.456',
  responsavel: 'Roberto Mendes Araújo',
}

function formatDDMMYYYY(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = String(date.getFullYear())
  return `${dd}/${mm}/${yyyy}`
}

export function ChecklistForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [brokerLoaded, setBrokerLoaded] = useState(false)
  const [hasBroker, setHasBroker] = useState(false)
  const [brokerData, setBrokerData] = useState<{ nome: string; creci: string } | null>(null)
  const navigate = useNavigate()

  const form = useForm<ChecklistValues>({
    resolver: zodResolver(checklistSchema),
    defaultValues: mockData,
  })

  useEffect(() => {
    let cancelled = false
    getBrokerProfile()
      .then((profile) => {
        if (cancelled) return
        const display = getBrokerDisplay(profile)
        if (display) {
          setHasBroker(true)
          setBrokerData({ nome: display.nome, creci: display.creci })
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setBrokerLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const buildData = (data: ChecklistValues): Record<string, string> => ({
    ...data,
    data_checklist: formatDDMMYYYY(new Date()),
    broker_nome_marca: brokerData?.nome.toUpperCase() || '',
    broker_creci_linha: brokerData?.creci || '',
  })

  const onSubmit = async (data: ChecklistValues) => {
    if (!hasBroker) {
      toast.error('Preencha seu Perfil em Meu Perfil')
      return
    }
    setIsGenerating(true)
    try {
      await generateChecklistDocx(buildData(data))
      toast.success('Documento gerado com sucesso!')
    } catch (error) {
      console.error('Erro ao gerar documento:', error)
      toast.error('Ocorreu um erro ao gerar o documento.')
    } finally {
      setIsGenerating(false)
    }
  }

  const onValidate = async () => {
    if (!hasBroker) {
      toast.error('Preencha seu Perfil em Meu Perfil')
      return
    }
    setIsValidating(true)
    try {
      const texto = await getChecklistText(buildData(form.getValues()))
      navigate('/validar', { state: { texto, tipo: 'Genérico/Outro' } })
    } catch (error) {
      console.error('Erro ao preparar validação:', error)
      toast.error('Não foi possível preparar a validação.')
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {brokerLoaded && !hasBroker && (
          <div className="flex items-start gap-3 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800 animate-fade-in-up">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1">Perfil não cadastrado</p>
              <p className="mb-2">
                Preencha seu Perfil em Meu Perfil para incluir seus dados de corretor no documento.
              </p>
              <Link
                to="/perfil"
                className="inline-flex items-center gap-1 font-semibold underline hover:text-yellow-900"
              >
                Ir para Meu Perfil
              </Link>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileCheck2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Dados do Checklist</h3>
          </div>
          <Separator />
          <FormField
            control={form.control}
            name="transacao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Transação *</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TRANSACAO_OPTIONS.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imovel_resumo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resumo do Imóvel *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ex: Apartamento nº 801, Edifício Solar, Rua das Acácias 150..."
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="responsavel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsável *</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do responsável pela verificação" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => form.reset(mockData)}
        >
          <Wand2 className="mr-2 h-4 w-4" />
          Preencher dados de teste
        </Button>
        <Button
          type="submit"
          disabled={isGenerating}
          className="w-full h-12 text-base font-medium shadow-sm transition-all active:scale-[0.98] group"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <Download className="mr-2 h-5 w-5 group-hover:animate-bounce" />
              Gerar documento
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={isValidating || isGenerating}
          onClick={onValidate}
        >
          {isValidating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Preparando validação...
            </>
          ) : (
            <>
              <FileSearch className="mr-2 h-4 w-4" />
              Validar esta minuta
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
