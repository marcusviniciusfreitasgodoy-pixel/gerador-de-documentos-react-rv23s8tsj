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
  Users,
  Calendar,
  AlertCircle,
  FileSearch,
} from 'lucide-react'
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
import { generateTermoPosseDocx, getTermoPosseText } from '@/lib/termoPosseDocx'
import { formatDateLower } from '@/lib/compromisso-helpers'
import { getBrokerProfile, getBrokerDisplay } from '@/services/broker-profile'
import { maskCpf } from '@/lib/utils'

const CONSIDERANDO_PAGAMENTO_OPTIONS = [
  'integral do preço',
  'da parcela ajustada para fins de imissão na posse',
]

const termoPosseSchema = z.object({
  transmitente_nome: z.string().min(3, 'Nome obrigatório'),
  transmitente_qualificacao: z.string().min(1, 'Obrigatório'),
  transmitente_rg: z.string().min(1, 'Obrigatório'),
  transmitente_cpf: z.string().min(1, 'Obrigatório'),
  transmitente_endereco: z.string().min(1, 'Obrigatório'),
  recebedor_nome: z.string().min(3, 'Nome obrigatório'),
  recebedor_qualificacao: z.string().min(1, 'Obrigatório'),
  recebedor_rg: z.string().min(1, 'Obrigatório'),
  recebedor_cpf: z.string().min(1, 'Obrigatório'),
  recebedor_endereco: z.string().min(1, 'Obrigatório'),
  imovel_descricao: z.string().min(1, 'Obrigatório'),
  imovel_matricula: z.string().min(1, 'Obrigatório'),
  imovel_ri_numero: z.string().min(1, 'Obrigatório'),
  imovel_comarca: z.string().min(1, 'Obrigatório'),
  imovel_iptu: z.string().min(1, 'Obrigatório'),
  contrato_data: z.string().min(1, 'Obrigatório'),
  considerando_pagamento: z.string().min(1, 'Obrigatório'),
  foro_comarca: z.string().min(1, 'Obrigatório'),
  cidade_uf: z.string().min(1, 'Obrigatório'),
  testemunha1_nome: z.string().optional(),
  testemunha1_cpf: z.string().optional(),
  testemunha2_nome: z.string().optional(),
  testemunha2_cpf: z.string().optional(),
})

type TermoPosseValues = z.infer<typeof termoPosseSchema>

const mockData: TermoPosseValues = {
  transmitente_nome: 'Roberto Mendes Araújo',
  transmitente_qualificacao: 'brasileiro, casado, médico',
  transmitente_rg: 'MG-15.234.567',
  transmitente_cpf: '456.789.123-00',
  transmitente_endereco:
    'Rua Voluntários da Pátria, 200, Botafogo, Rio de Janeiro/RJ, CEP 22270-010',
  recebedor_nome: 'Fernanda Souza Lima',
  recebedor_qualificacao: 'brasileira, solteira, engenheira',
  recebedor_rg: 'RJ-20.987.654',
  recebedor_cpf: '987.654.321-00',
  recebedor_endereco: 'Av. das Américas, 789, Barra da Tijuca, Rio de Janeiro/RJ, CEP 22640-100',
  imovel_descricao: 'Apartamento nº 801, Edifício Solar, 8º andar, com 2 vagas de garagem',
  imovel_matricula: '78.456',
  imovel_ri_numero: '6',
  imovel_comarca: 'Rio de Janeiro',
  imovel_iptu: '001.234.567-8',
  contrato_data: new Date().toLocaleDateString('pt-BR'),
  considerando_pagamento: 'integral do preço',
  foro_comarca: 'Rio de Janeiro/RJ',
  cidade_uf: 'Rio de Janeiro/RJ',
  testemunha1_nome: 'Pedro Alves Lima',
  testemunha1_cpf: '111.222.333-44',
  testemunha2_nome: 'Maria Fernanda Rocha',
  testemunha2_cpf: '555.666.777-88',
}

const stripPrefix = (val: string) => val.replace(/^\s*(RG|CPF|CNPJ)\s*n[ºo.]*\s*/i, '').trim()

export function TermoPosseForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [brokerLoaded, setBrokerLoaded] = useState(false)
  const [hasBroker, setHasBroker] = useState(false)
  const [brokerData, setBrokerData] = useState<{ nome: string; creci: string } | null>(null)
  const navigate = useNavigate()

  const form = useForm<TermoPosseValues>({
    resolver: zodResolver(termoPosseSchema),
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

  const buildData = (data: TermoPosseValues): Record<string, string> => ({
    transmitente_nome: data.transmitente_nome,
    transmitente_qualificacao: data.transmitente_qualificacao,
    transmitente_rg: stripPrefix(data.transmitente_rg),
    transmitente_cpf: stripPrefix(data.transmitente_cpf),
    transmitente_endereco: data.transmitente_endereco,
    recebedor_nome: data.recebedor_nome,
    recebedor_qualificacao: data.recebedor_qualificacao,
    recebedor_rg: stripPrefix(data.recebedor_rg),
    recebedor_cpf: stripPrefix(data.recebedor_cpf),
    recebedor_endereco: data.recebedor_endereco,
    imovel_descricao: data.imovel_descricao,
    imovel_matricula: data.imovel_matricula,
    imovel_ri_numero: data.imovel_ri_numero.replace(/^\D+/, '').trim(),
    imovel_comarca: data.imovel_comarca,
    imovel_iptu: data.imovel_iptu,
    contrato_data: data.contrato_data,
    considerando_pagamento: data.considerando_pagamento,
    foro_comarca: data.foro_comarca,
    cidade_uf: data.cidade_uf,
    testemunha1_nome: data.testemunha1_nome || '',
    testemunha1_cpf: stripPrefix(data.testemunha1_cpf || ''),
    testemunha2_nome: data.testemunha2_nome || '',
    testemunha2_cpf: stripPrefix(data.testemunha2_cpf || ''),
    data_extenso: formatDateLower(new Date()),
    broker_nome_marca: brokerData?.nome.toUpperCase() || '',
    broker_creci_linha: brokerData?.creci || '',
  })

  const onSubmit = async (data: TermoPosseValues) => {
    if (!hasBroker) {
      toast.error('Preencha seu Perfil em Meu Perfil')
      return
    }
    setIsGenerating(true)
    try {
      await generateTermoPosseDocx(buildData(data))
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
      const texto = await getTermoPosseText(buildData(form.getValues()))
      navigate('/validar', { state: { texto, tipo: 'Termo de Transmissão da Posse' } })
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
            <User className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Transmitente</h3>
          </div>
          <Separator />
          <FormField
            control={form.control}
            name="transmitente_nome"
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
            name="transmitente_qualificacao"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="transmitente_rg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RG *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: MG-15.234.567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transmitente_cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="000.000.000-00"
                      maxLength={14}
                      value={field.value}
                      onChange={(e) => field.onChange(maskCpf(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="transmitente_endereco"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço Completo *</FormLabel>
                <FormControl>
                  <Input placeholder="Rua, nº, Bairro, Cidade/UF, CEP" {...field} />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="recebedor_rg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RG *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: RJ-20.987.654" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recebedor_cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="000.000.000-00"
                      maxLength={14}
                      value={field.value}
                      onChange={(e) => field.onChange(maskCpf(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="recebedor_endereco"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço Completo *</FormLabel>
                <FormControl>
                  <Input placeholder="Rua, nº, Bairro, Cidade/UF, CEP" {...field} />
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
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Dados do Contrato</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contrato_data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data do Contrato (dd/mm/aaaa) *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 08/07/2026" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="considerando_pagamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Considerando Pagamento *</FormLabel>
                  <Select value={field.value || undefined} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CONSIDERANDO_PAGAMENTO_OPTIONS.map((o) => (
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
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Local e Jurisdição</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="foro_comarca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fórum/Comarca *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Rio de Janeiro/RJ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Testemunhas (Opcional)</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="testemunha1_nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da 1ª Testemunha</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="testemunha1_cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF da 1ª Testemunha</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="000.000.000-00"
                      maxLength={14}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(maskCpf(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="testemunha2_nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da 2ª Testemunha</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="testemunha2_cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF da 2ª Testemunha</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="000.000.000-00"
                      maxLength={14}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(maskCpf(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
