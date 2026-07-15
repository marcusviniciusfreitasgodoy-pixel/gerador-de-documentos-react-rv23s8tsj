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
  FileSearch,
} from 'lucide-react'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { CarregarDeNegocio } from '@/components/CarregarDeNegocio'
import { aplicarChaves } from '@/lib/aplicar-negocio'
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
import { generateTermoChavesDocx, getTermoChavesText } from '@/lib/termoChavesDocx'
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
  entregante_documento: '456.789.123-00',
  recebedor_nome: 'Fernanda Souza Lima',
  recebedor_qualificacao: 'brasileira, solteira, engenheira',
  recebedor_documento: '987.654.321-00',
  imovel_descricao: 'Apartamento nº 801, Edifício Solar, 8º andar, com 2 vagas de garagem',
  imovel_matricula: '78.456',
  imovel_ri_numero: '6',
  imovel_comarca: 'Rio de Janeiro',
  imovel_iptu: '001.234.567-8',
  cidade_uf: 'Rio de Janeiro/RJ',
}

// Form abre vazio: mantem a cidade/UF do fecho, esvazia partes e imovel.
const emptyData: TermoChavesValues = {
  ...mockData,
  entregante_nome: '',
  entregante_qualificacao: '',
  entregante_documento: '',
  recebedor_nome: '',
  recebedor_qualificacao: '',
  recebedor_documento: '',
  imovel_descricao: '',
  imovel_matricula: '',
  imovel_ri_numero: '',
  imovel_comarca: '',
  imovel_iptu: '',
}

export function TermoChavesForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [brokerLoaded, setBrokerLoaded] = useState(false)
  const [hasBroker, setHasBroker] = useState(false)
  const [brokerData, setBrokerData] = useState<{ nome: string; creci: string } | null>(null)
  const navigate = useNavigate()

  const form = useForm<TermoChavesValues>({
    resolver: zodResolver(termoChavesSchema),
    defaultValues: emptyData,
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

  const buildData = (data: TermoChavesValues): Record<string, string> => {
    const stripPrefix = (val: string) => val.replace(/^\s*(CPF|CNPJ)\s+/i, '').trim()
    return {
      ...data,
      entregante_documento: stripPrefix(data.entregante_documento),
      recebedor_documento: stripPrefix(data.recebedor_documento),
      imovel_ri_numero: data.imovel_ri_numero.replace(/^\D+/, '').trim(),
      data_extenso: formatDateLower(new Date()),
      broker_nome_marca: brokerData?.nome.toUpperCase() || '',
      broker_creci_linha: brokerData?.creci || '',
    }
  }

  const onSubmit = async (data: TermoChavesValues) => {
    if (!hasBroker) {
      toast.error('Preencha seu Perfil em Meu Perfil')
      return
    }
    setIsGenerating(true)
    try {
      await generateTermoChavesDocx(buildData(data))
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
      const texto = await getTermoChavesText(buildData(form.getValues()))
      navigate('/validar', { state: { texto, tipo: 'Termo de Entrega das Chaves' } })
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
        <CarregarDeNegocio form={form} aplicar={(n) => aplicarChaves(form.setValue, n)} />
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
                  <FormLabel>Número do CPF/CNPJ *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 456.789.123-00" {...field} />
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
                  <FormLabel>Número do CPF/CNPJ *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 987.654.321-00" {...field} />
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
                  <FormLabel>Número do RI (ex.: 6) *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 6" {...field} />
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
