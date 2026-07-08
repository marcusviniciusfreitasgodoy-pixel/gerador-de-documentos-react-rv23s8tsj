import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Loader2,
  Download,
  Wand2,
  User,
  UserCheck,
  Building2,
  MapPin,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'
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
import { generateTermoChavesDocx } from '@/lib/termoChavesDocx'
import { formatDateLower } from '@/lib/compromisso-helpers'
import { getBrokerProfile, getBrokerDisplay } from '@/services/broker-profile'

const termoChavesSchema = z.object({
  entregante_nome: z.string().min(3, 'Nome obrigatório'),
  entregante_qualificacao: z.string().min(1, 'Obrigatório'),
  entregante_documento: z.string().min(1, 'Obrigatório'),
  recebedor_nome: z.string().min(3, 'Nome obrigatório'),
  recebedor_qualificacao: z.string().min(1, 'Obrigatório'),
  recebedor_documento: z.string().min(1, 'Obrigatório'),
  imovel_descricao: z.string().min(1, 'Obrigatório'),
  imovel_matricula: z.string().min(1, 'Obrigatório'),
  imovel_ri_numero: z.string().min(1, 'Obrigatório'),
  imovel_comarca: z.string().min(1, 'Obrigatório'),
  imovel_iptu: z.string().min(1, 'Obrigatório'),
  cidade_uf: z.string().min(1, 'Obrigatório'),
})

type TermoChavesValues = z.infer<typeof termoChavesSchema>

const mockData: TermoChavesValues = {
  entregante_nome: 'Roberto Mendes Araújo',
  entregante_qualificacao: 'brasileiro, casado, médico',
  entregante_documento: 'CPF 456.789.123-00',
  recebedor_nome: 'Fernanda Souza Lima',
  recebedor_qualificacao: 'brasileira, solteira, engenheira',
  recebedor_documento: 'CPF 987.654.321-00',
  imovel_descricao: 'Apartamento nº 801, Edifício Solar, 8º andar, com 2 vagas de garagem',
  imovel_matricula: '78.456',
  imovel_ri_numero: '6º Oficial de Registro de Imóveis',
  imovel_comarca: 'Rio de Janeiro',
  imovel_iptu: '001.234.567-8',
  cidade_uf: 'Rio de Janeiro/RJ',
}

export function TermoChavesForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [brokerLoaded, setBrokerLoaded] = useState(false)
  const [hasBroker, setHasBroker] = useState(false)
  const [brokerData, setBrokerData] = useState<{ nome: string; creci: string } | null>(null)

  const form = useForm<TermoChavesValues>({
    resolver: zodResolver(termoChavesSchema),
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

  const onSubmit = async (data: TermoChavesValues) => {
    if (!hasBroker) {
      toast.error('Preencha seu Perfil em Meu Perfil')
      return
    }
    setIsGenerating(true)
    try {
      const templateData: Record<string, string> = {
        ...data,
        data_extenso: formatDateLower(new Date()),
        broker_nome_marca: brokerData?.nome.toUpperCase() || '',
        broker_creci_linha: brokerData?.creci || '',
      }
      await generateTermoChavesDocx(templateData)
      toast.success('Documento gerado com sucesso!')
    } catch (error) {
      console.error('Erro ao gerar documento:', error)
      toast.error('Ocorreu um erro ao gerar o documento.')
    } finally {
      setIsGenerating(false)
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
            <User className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Entregante</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="entregante_nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="entregante_documento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documento (CPF/CNPJ) *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="entregante_qualificacao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qualificação *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ex: brasileiro, casado, médico"
                    className="resize-none"
                    rows={2}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Recebedor</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="recebedor_nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recebedor_documento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documento (CPF/CNPJ) *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="recebedor_qualificacao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qualificação *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ex: brasileira, solteira, engenheira"
                    className="resize-none"
                    rows={2}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Dados do Imóvel</h3>
          </div>
          <Separator />
          <FormField
            control={form.control}
            name="imovel_descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ex: Apartamento nº 801, Edifício Solar..."
                    className="resize-none"
                    rows={2}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="imovel_matricula"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matrícula nº *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imovel_ri_numero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registro de Imóveis *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imovel_comarca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comarca *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imovel_iptu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IPTU *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Local e Data</h3>
          </div>
          <Separator />
          <FormField
            control={form.control}
            name="cidade_uf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade/UF *</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Rio de Janeiro/RJ" {...field} />
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
      </form>
    </Form>
  )
}
