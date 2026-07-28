import { useState, useEffect, useRef } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Loader2,
  Download,
  User,
  UserCheck,
  Building2,
  MapPin,
  AlertCircle,
  FileSearch,
  KeyRound,
} from 'lucide-react'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { BotaoDadosTeste, VerTextoClausula } from '@/components/Layout'
import { CarregarDeNegocio, DocumentoGerado, useFormDraft } from '@/components/CarregarDeNegocio'
import { aplicarChaves, aplicarChavesPosse } from '@/lib/aplicar-negocio'
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
import { generateChavesPosseDocx, getChavesPosseText } from '@/lib/docx-generator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDateLower } from '@/lib/compromisso-helpers'
import { textoNaturezaPosse, textoComunicacaoCondominio } from '@/lib/form-helpers'
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
  // Fase 4: tela de sucesso + re-aplicar negócio no "Gerar outro deste negócio".
  const [gerado, setGerado] = useState(false)
  const reaplicarNegocioRef = useRef<(() => void) | null>(null)

  const form = useForm<TermoChavesValues>({
    resolver: zodResolver(termoChavesSchema),
    defaultValues: emptyData,
  })

  // Fase 2b: autosalva o rascunho e oferece recuperar ao voltar (F5 / fechar aba).
  const { limparRascunho } = useFormDraft(form, 'chaves')

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
      setGerado(true)
      limparRascunho()
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

  const handleGerarOutro = () => {
    form.reset()
    reaplicarNegocioRef.current?.()
    limparRascunho()
    setGerado(false)
  }

  if (gerado) {
    return (
      <DocumentoGerado
        onValidar={onValidate}
        onGerarOutro={handleGerarOutro}
        validando={isValidating}
      />
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CarregarDeNegocio
          form={form}
          aplicar={(n) => aplicarChaves(form.setValue, n)}
          onNegocioAplicado={(fn) => {
            reaplicarNegocioRef.current = fn
          }}
        />
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
                <p className="text-xs text-muted-foreground">
                  Não inclua matrícula nem inscrição do IPTU aqui: eles têm campo próprio abaixo e
                  sairiam repetidos no termo.
                </p>
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
                  <p className="text-xs text-muted-foreground">
                    Só o número. O termo escreve o resto: "6º RI de Rio de Janeiro".
                  </p>
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
                <p className="text-xs text-muted-foreground">
                  É a linha de fecho do documento, logo acima das assinaturas: sai como "Rio de
                  Janeiro/RJ, 27 de julho de 2026". A data entra sozinha, com a de hoje.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <BotaoDadosTeste onClick={() => form.reset(mockData)} />
        {/* Barra de ação FIXA: num formulário longo, Gerar/Validar ficam sempre
            alcançáveis. -mx-6/px-6 acompanham o padding do CardContent. */}
        <div className="sticky bottom-0 z-10 -mx-6 flex flex-col sm:flex-row gap-2 border-t border-border bg-card/95 px-6 py-3 backdrop-blur-sm">
          <Button
            type="submit"
            disabled={isGenerating}
            className="flex-1 h-11 text-base font-medium shadow-sm transition-all active:scale-[0.98] group"
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
            className="h-11 sm:w-auto"
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
        </div>
      </form>
    </Form>
  )
}

// ── Termo de Entrega de Chaves e Transmissão da Posse (combinado) ───────────
// Mora neste arquivo por parentesco direto: é a fusão deste termo com o de
// posse. (O editor do Skip não cria arquivo novo.)
//
// Por que existe, se já temos os dois separados: na maioria das operações as
// chaves e a posse mudam de mão no MESMO ato, e emitir dois documentos com duas
// coletas de assinatura para o mesmo momento é o que faz o corretor deixar de
// emitir um dos dois. Os separados seguem necessários quando os atos NÃO
// coincidem: posse antecipada, ou chaves entregues só para reforma/vistoria.
const chavesPosseSchema = z
  .object({
    transmitente_nome: z.string().min(3, 'Nome obrigatório'),
    transmitente_qualificacao: z.string().min(1, 'Obrigatório'),
    transmitente_rg: z.string().min(1, 'Obrigatório'),
    transmitente_documento: z.string().min(1, 'Obrigatório'),
    transmitente_endereco: z.string().min(1, 'Obrigatório'),
    recebedor_nome: z.string().min(3, 'Nome obrigatório'),
    recebedor_qualificacao: z.string().min(1, 'Obrigatório'),
    recebedor_rg: z.string().min(1, 'Obrigatório'),
    recebedor_documento: z.string().min(1, 'Obrigatório'),
    recebedor_endereco: z.string().min(1, 'Obrigatório'),
    imovel_descricao: z.string().min(1, 'Obrigatório'),
    imovel_matricula: z.string().min(1, 'Obrigatório'),
    imovel_ri_numero: z.string().min(1, 'Obrigatório'),
    imovel_comarca: z.string().min(1, 'Obrigatório'),
    imovel_iptu: z.string().min(1, 'Obrigatório'),
    contrato_data: z.string().min(1, 'Obrigatório'),
    tipo_posse: z.enum(['plena', 'precaria']),
    considerando_pagamento: z.string().min(1, 'Obrigatório'),
    condominio: z.enum(['vai_comunicar', 'ja_comunicou', 'sem_condominio']),
    prazo_comunicacao_condominio: z.string().optional(),
    prazo_transferencia_contas: z.string().min(1, 'Obrigatório'),
    ressalvas_adicionais: z.string().optional(),
    foro_comarca: z.string().min(1, 'Obrigatório'),
    testemunha1_nome: z.string().optional(),
    testemunha1_cpf: z.string().optional(),
    testemunha2_nome: z.string().optional(),
    testemunha2_cpf: z.string().optional(),
    cidade_uf: z.string().min(1, 'Obrigatório'),
  })
  .refine((d) => d.condominio !== 'vai_comunicar' || !!d.prazo_comunicacao_condominio?.trim(), {
    message: 'Informe o prazo para comunicar',
    path: ['prazo_comunicacao_condominio'],
  })

type ChavesPosseValues = z.infer<typeof chavesPosseSchema>

const chavesPosseMock: ChavesPosseValues = {
  transmitente_nome: 'Roberto Mendes Araújo',
  transmitente_qualificacao: 'brasileiro, casado, médico',
  transmitente_rg: 'MG-15.234.567 SSP/MG',
  transmitente_documento: '456.789.123-00',
  transmitente_endereco: 'Rua Voluntários da Pátria, 200, Botafogo, Rio de Janeiro/RJ',
  recebedor_nome: 'Fernanda Souza Lima',
  recebedor_qualificacao: 'brasileira, solteira, engenheira',
  recebedor_rg: 'RJ-20.987.654 SSP/RJ',
  recebedor_documento: '987.654.321-00',
  recebedor_endereco: 'Av. das Américas, 789, Barra da Tijuca, Rio de Janeiro/RJ',
  imovel_descricao: 'Apartamento nº 801, Edifício Solar, 8º andar, com 2 vagas de garagem',
  imovel_matricula: '78.456',
  imovel_ri_numero: '6',
  imovel_comarca: 'Rio de Janeiro',
  imovel_iptu: '001.234.567-8',
  contrato_data: '25/07/2026',
  tipo_posse: 'plena',
  considerando_pagamento: 'integral do preço ajustado',
  condominio: 'vai_comunicar',
  prazo_comunicacao_condominio: '5 (cinco) dias',
  prazo_transferencia_contas: '30 (trinta) dias',
  ressalvas_adicionais: '',
  foro_comarca: 'Rio de Janeiro',
  testemunha1_nome: 'Pedro Alves Lima',
  testemunha1_cpf: '111.222.333-44',
  testemunha2_nome: 'Maria Fernanda Rocha',
  testemunha2_cpf: '555.666.777-88',
  cidade_uf: 'Rio de Janeiro/RJ',
}

const chavesPosseEmpty: ChavesPosseValues = {
  ...chavesPosseMock,
  transmitente_nome: '',
  transmitente_qualificacao: '',
  transmitente_rg: '',
  transmitente_documento: '',
  transmitente_endereco: '',
  recebedor_nome: '',
  recebedor_qualificacao: '',
  recebedor_rg: '',
  recebedor_documento: '',
  recebedor_endereco: '',
  imovel_descricao: '',
  imovel_matricula: '',
  imovel_ri_numero: '',
  imovel_comarca: '',
  imovel_iptu: '',
  contrato_data: '',
  foro_comarca: '',
  testemunha1_nome: '',
  testemunha1_cpf: '',
  testemunha2_nome: '',
  testemunha2_cpf: '',
  cidade_uf: '',
}

export function ChavesPosseForm() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [brokerLoaded, setBrokerLoaded] = useState(false)
  const [hasBroker, setHasBroker] = useState(false)
  const [brokerData, setBrokerData] = useState<{ nome: string; creci: string } | null>(null)
  const navigate = useNavigate()
  const [gerado, setGerado] = useState(false)
  const reaplicarNegocioRef = useRef<(() => void) | null>(null)

  const form = useForm<ChavesPosseValues>({
    resolver: zodResolver(chavesPosseSchema),
    defaultValues: chavesPosseEmpty,
  })
  const { limparRascunho } = useFormDraft(form, 'chaves-posse')

  const tipoPosse = useWatch({ control: form.control, name: 'tipo_posse' })
  const condominio = useWatch({ control: form.control, name: 'condominio' })
  const prazoComunicacao = useWatch({
    control: form.control,
    name: 'prazo_comunicacao_condominio',
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

  const buildData = (data: ChavesPosseValues): Record<string, string> => {
    const stripPrefix = (val: string) => val.replace(/^\s*(CPF|CNPJ)\s*n?[ºo°]?\.?\s*/i, '').trim()

    const naturezaPosse = textoNaturezaPosse(data.tipo_posse)
    const comunicacao = textoComunicacaoCondominio(
      data.condominio,
      data.prazo_comunicacao_condominio,
    )

    return {
      transmitente_nome: data.transmitente_nome,
      transmitente_qualificacao: data.transmitente_qualificacao,
      transmitente_rg: data.transmitente_rg,
      transmitente_documento: stripPrefix(data.transmitente_documento),
      transmitente_endereco: data.transmitente_endereco,
      recebedor_nome: data.recebedor_nome,
      recebedor_qualificacao: data.recebedor_qualificacao,
      recebedor_rg: data.recebedor_rg,
      recebedor_documento: stripPrefix(data.recebedor_documento),
      recebedor_endereco: data.recebedor_endereco,
      imovel_descricao: data.imovel_descricao,
      imovel_matricula: data.imovel_matricula,
      imovel_ri_numero: data.imovel_ri_numero.replace(/^\D+/, '').trim(),
      imovel_comarca: data.imovel_comarca,
      imovel_iptu: data.imovel_iptu,
      contrato_data: data.contrato_data,
      considerando_pagamento: data.considerando_pagamento,
      natureza_posse: naturezaPosse,
      comunicacao_condominio: comunicacao,
      prazo_transferencia_contas: data.prazo_transferencia_contas,
      ressalvas_adicionais:
        data.ressalvas_adicionais?.trim() ||
        'Não há ressalvas registradas pelas partes além das constantes deste termo.',
      foro_comarca: data.foro_comarca,
      testemunha1_nome: data.testemunha1_nome || '',
      testemunha1_cpf: data.testemunha1_cpf || '',
      testemunha2_nome: data.testemunha2_nome || '',
      testemunha2_cpf: data.testemunha2_cpf || '',
      cidade_uf: data.cidade_uf,
      data_extenso: formatDateLower(new Date()),
      broker_nome_marca: brokerData?.nome.toUpperCase() || '',
      broker_creci_linha: brokerData?.creci || '',
    }
  }

  const onSubmit = async (data: ChavesPosseValues) => {
    if (!hasBroker) {
      toast.error('Preencha seu Perfil em Meu Perfil')
      return
    }
    setIsGenerating(true)
    try {
      await generateChavesPosseDocx(buildData(data))
      toast.success('Documento gerado com sucesso!')
      setGerado(true)
      limparRascunho()
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
      const texto = await getChavesPosseText(buildData(form.getValues()))
      navigate('/validar', {
        state: { texto, tipo: 'Termo de Entrega de Chaves e Transmissão da Posse' },
      })
    } catch (error) {
      console.error('Erro ao preparar validação:', error)
      toast.error('Não foi possível preparar a validação.')
    } finally {
      setIsValidating(false)
    }
  }

  const handleGerarOutro = () => {
    form.reset()
    reaplicarNegocioRef.current?.()
    limparRascunho()
    setGerado(false)
  }

  if (gerado) {
    return (
      <DocumentoGerado
        onValidar={onValidate}
        onGerarOutro={handleGerarOutro}
        validando={isValidating}
      />
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CarregarDeNegocio
          form={form}
          aplicar={(n) => aplicarChavesPosse(form.setValue, n)}
          onNegocioAplicado={(fn) => {
            reaplicarNegocioRef.current = fn
          }}
        />
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
            <h3 className="font-semibold text-primary">Quem entrega (vendedor)</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="transmitente_nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Roberto Mendes Araújo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transmitente_documento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF ou CNPJ *</FormLabel>
                  <FormControl>
                    <Input placeholder="000.000.000-00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transmitente_rg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identidade *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: MG-15.234.567 SSP/MG" {...field} />
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
                    <Input placeholder="Ex: brasileiro, casado, médico" {...field} />
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
                <FormLabel>Endereço *</FormLabel>
                <FormControl>
                  <Input placeholder="Rua, número, bairro, cidade/UF" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Quem recebe (comprador)</h3>
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
                    <Input placeholder="Ex: Fernanda Souza Lima" {...field} />
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
                  <FormLabel>CPF ou CNPJ *</FormLabel>
                  <FormControl>
                    <Input placeholder="000.000.000-00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recebedor_rg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identidade *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: RJ-20.987.654 SSP/RJ" {...field} />
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
                    <Input placeholder="Ex: brasileira, solteira, engenheira" {...field} />
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
                <FormLabel>Endereço *</FormLabel>
                <FormControl>
                  <Input placeholder="Rua, número, bairro, cidade/UF" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Imóvel</h3>
          </div>
          <Separator />
          <FormField
            control={form.control}
            name="imovel_descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição do imóvel *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ex: Apartamento nº 801, Edifício Solar, 8º andar, com 2 vagas"
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Não inclua matrícula nem inscrição do IPTU aqui: eles têm campo próprio e sairiam
                  repetidos no termo.
                </p>
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
                  <FormLabel>Matrícula *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 78.456" {...field} />
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
                  <FormLabel>Nº do Registro de Imóveis *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 6" {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Só o número. O termo escreve "6º Registro de Imóveis de...".
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imovel_comarca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comarca do registro *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Rio de Janeiro" {...field} />
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
                  <FormLabel>Inscrição municipal (IPTU) *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 001.234.567-8" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">A posse que está sendo passada</h3>
          </div>
          <Separator />
          <FormField
            control={form.control}
            name="tipo_posse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Natureza da posse *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="plena">
                      Definitiva e plena, o preço já foi quitado
                    </SelectItem>
                    <SelectItem value="precaria">
                      Direta e precária, o comprador entra antes de quitar
                    </SelectItem>
                  </SelectContent>
                </Select>
                <VerTextoClausula texto={textoNaturezaPosse(field.value)} />
                <FormMessage />
              </FormItem>
            )}
          />
          {tipoPosse === 'precaria' && (
            <div className="flex items-start gap-3 rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-yellow-800 text-sm animate-fade-in-up">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Na posse precária o termo registra que a posse indireta continua com o vendedor até
                a quitação, e que o não pagamento autoriza a reintegração. É o que protege o
                vendedor de entregar o imóvel e ficar sem o preço.
              </span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contrato_data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data do contrato de origem *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 25/07/2026" {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    A promessa ou compra e venda que este termo está cumprindo.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="considerando_pagamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Situação do pagamento *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: integral do preço ajustado" {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Completa a frase "CONSIDERANDO o pagamento ..., na forma do referido contrato".
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="condominio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comunicação ao condomínio *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="vai_comunicar">
                      O vendedor vai comunicar a administração
                    </SelectItem>
                    <SelectItem value="ja_comunicou">Já foi comunicado</SelectItem>
                    <SelectItem value="sem_condominio">O imóvel não é de condomínio</SelectItem>
                  </SelectContent>
                </Select>
                <VerTextoClausula
                  texto={textoComunicacaoCondominio(field.value, prazoComunicacao)}
                />
                <p className="text-xs text-muted-foreground">
                  É o que evita a portaria barrar o caminhão de mudança no dia.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          {condominio === 'vai_comunicar' && (
            <FormField
              control={form.control}
              name="prazo_comunicacao_condominio"
              render={({ field }) => (
                <FormItem className="animate-fade-in-up">
                  <FormLabel>Prazo para comunicar *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 5 (cinco) dias" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="prazo_transferencia_contas"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prazo para transferir as contas de consumo *</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 30 (trinta) dias" {...field} />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Luz, água e gás para o nome do comprador. O termo já registra as leituras dos
                  medidores na tabela, para o rateio ficar provado.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ressalvas_adicionais"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ressalvas</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ex: fica ressalvada a obrigação do vendedor de reparar a infiltração do banheiro da suíte"
                    className="min-h-[70px]"
                    {...field}
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Opcional. Em branco, o termo diz que não há ressalvas além do que já está nele.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Foro, local e testemunhas</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="foro_comarca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comarca do foro *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Rio de Janeiro" {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Segue a cidade do imóvel. Edite se quiser outro foro.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cidade_uf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade/UF da assinatura *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Rio de Janeiro/RJ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="testemunha1_nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Testemunha 1</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome" {...field} />
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
                  <FormLabel>CPF da testemunha 1</FormLabel>
                  <FormControl>
                    <Input placeholder="000.000.000-00" {...field} />
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
                  <FormLabel>Testemunha 2</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome" {...field} />
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
                  <FormLabel>CPF da testemunha 2</FormLabel>
                  <FormControl>
                    <Input placeholder="000.000.000-00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <BotaoDadosTeste onClick={() => form.reset(chavesPosseMock)} />
        <div className="sticky bottom-0 z-10 -mx-6 flex flex-col sm:flex-row gap-2 border-t border-border bg-card/95 px-6 py-3 backdrop-blur-sm">
          <Button
            type="submit"
            disabled={isGenerating}
            className="flex-1 h-11 text-base font-medium shadow-sm transition-all active:scale-[0.98] group"
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
            className="h-11 sm:w-auto"
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
        </div>
      </form>
    </Form>
  )
}
