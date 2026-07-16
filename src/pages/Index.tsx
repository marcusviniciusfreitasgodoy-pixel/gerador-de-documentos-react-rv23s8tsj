import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Loader2,
  ArrowLeft,
  Download,
  Building2,
  FileCheck2,
  Users,
  Wand2,
  FileSignature,
  FileSearch,
  Briefcase,
} from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate, Link } from 'react-router-dom'
import { IntermediationForm } from '@/components/IntermediationForm'
import { PromiseForm } from '@/components/PromiseForm'
import { PromessaAvistaForm } from '@/components/PromessaAvistaForm'
import { PromessaFinanciadaForm } from '@/components/PromessaFinanciadaForm'
import { TermoChavesForm } from '@/components/TermoChavesForm'
import { TermoPosseForm } from '@/components/TermoPosseForm'
import { ChecklistForm } from '@/components/ChecklistForm'
import { CarregarDeNegocio } from '@/components/CarregarDeNegocio'
import { aplicarRecibo } from '@/lib/aplicar-negocio'
import { PromessaFgtsForm } from '@/components/PromessaFgtsForm'
import { PromessaDacaoForm } from '@/components/PromessaDacaoForm'
import { reciboMockData } from '@/lib/form-helpers'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { PartyFields } from '@/components/PartyFields'
import { maskCurrency, maskCpf } from '@/lib/utils'
import {
  formSchema,
  type FormValues,
  FORMA_PAGAMENTO_OPTIONS,
  buildTemplateData,
} from '@/lib/form-helpers'
import { generateDocx, getReciboText } from '@/lib/docx-generator'

type DocKey =
  | 'recibo'
  | 'intermediation'
  | 'promise'
  | 'compromisso'
  | 'compromissoFinanciado'
  | 'compromissoFgts'
  | 'compromissoDacao'
  | 'termoChaves'
  | 'termoPosse'
  | 'checklist'

interface DocDef {
  key?: DocKey
  href?: string
  title: string
  desc: string
}

// Registro único dos documentos: alimenta o hub E o título do formulário.
// Fonte única de verdade — substitui o ternário de títulos (que errava a
// financiada) e garante que todo documento tenha entrada no hub.
const DOC_GROUPS: { label: string; docs: DocDef[] }[] = [
  {
    label: 'Promessas de compra e venda',
    docs: [
      { key: 'compromisso', title: 'À vista', desc: 'Pagamento integral com sinal e reforço' },
      { key: 'compromissoFinanciado', title: 'Financiada', desc: 'Com financiamento bancário' },
      { key: 'compromissoFgts', title: 'Com FGTS', desc: 'Recursos do FGTS sem financiamento' },
      {
        key: 'compromissoDacao',
        title: 'Com dação em pagamento',
        desc: 'Outro bem compõe o preço',
      },
      { key: 'promise', title: 'Simplificada', desc: 'Modelo enxuto de promessa' },
      { href: '/permuta', title: 'Permuta', desc: 'Troca de imóveis com torna opcional' },
    ],
  },
  {
    label: 'Pré-contratual e intermediação',
    docs: [
      {
        href: '/proposta-reserva',
        title: 'Proposta e Reserva',
        desc: 'Oferta com sinal — o passo antes da promessa',
      },
      {
        key: 'intermediation',
        title: 'Autorização de Venda',
        desc: 'Intermediação com ou sem exclusividade',
      },
    ],
  },
  {
    label: 'Execução e encerramento',
    docs: [
      {
        key: 'recibo',
        title: 'Recibo de Sinal (Arras)',
        desc: 'Princípio de pagamento — arts. 417 a 420',
      },
      {
        key: 'termoChaves',
        title: 'Entrega das Chaves',
        desc: 'Comprovação da disponibilização do imóvel',
      },
      { key: 'termoPosse', title: 'Transmissão da Posse', desc: 'Tradição e imissão na posse' },
      {
        key: 'checklist',
        title: 'Checklist Documental',
        desc: 'Conferência dos documentos da operação',
      },
      {
        href: '/distrato',
        title: 'Distrato',
        desc: 'Desfazimento consensual com quitação recíproca',
      },
    ],
  },
]

const DOC_TITLES: Record<DocKey, string> = {
  recibo: 'Recibo de Sinal e Princípio de Pagamento (Arras)',
  intermediation: 'Autorização para Divulgação e Venda de Imóvel',
  promise: 'Promessa de Compra e Venda (Simplificada)',
  compromisso: 'Promessa / Compromisso de Compra e Venda (à vista)',
  compromissoFinanciado: 'Promessa / Compromisso de Compra e Venda (financiada)',
  compromissoFgts: 'Promessa com FGTS (sem financiamento)',
  compromissoDacao: 'Promessa com Dação em Pagamento',
  termoChaves: 'Termo de Entrega das Chaves',
  termoPosse: 'Termo de Transmissão da Posse',
  checklist: 'Checklist Documental',
}

const DOC_CARD_CLASS =
  'rounded-lg border border-border bg-card p-4 text-left shadow-subtle hover:border-primary/60 hover:shadow-elevation transition-all duration-200'

export default function Index() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const navigate = useNavigate()
  const [docType, setDocType] = useState<DocKey | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vendedor_nome: '',
      vendedor_nacionalidade: 'brasileiro(a)',
      vendedor_estado_civil: '',
      vendedor_regime_bens: '',
      vendedor_profissao: '',
      vendedor_rg: '',
      vendedor_cpf: '',
      vendedor_endereco: '',
      comprador_nome: '',
      comprador_nacionalidade: 'brasileiro(a)',
      comprador_estado_civil: '',
      comprador_regime_bens: '',
      comprador_profissao: '',
      comprador_rg: '',
      comprador_cpf: '',
      comprador_endereco: '',
      imovel_descricao: '',
      imovel_matricula: '',
      imovel_ri_numero: '',
      imovel_comarca: '',
      imovel_iptu: '',
      valor_sinal: '',
      valor_total: '',
      forma_pagamento: '',
      natureza_arras: 'confirmatoria',
      prazo_formalizacao_dias: '',
      prazo_restituicao_dias: '',
      foro_comarca: 'Rio de Janeiro/RJ',
      testemunha1_nome: '',
      testemunha1_cpf: '',
      testemunha2_nome: '',
      testemunha2_cpf: '',
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsGenerating(true)
    try {
      await generateDocx(buildTemplateData(data))
      toast.success('Documento gerado com sucesso!')
      form.reset()
    } catch (error) {
      console.error('Erro ao gerar documento:', error)
      toast.error('Ocorreu um erro ao gerar o documento.')
    } finally {
      setIsGenerating(false)
    }
  }

  const onValidateRecibo = async () => {
    setIsValidating(true)
    try {
      const texto = await getReciboText(buildTemplateData(form.getValues()))
      navigate('/validar', { state: { texto, tipo: 'Recibo de Sinal (Arras)' } })
    } catch (error) {
      console.error('Erro ao preparar validação:', error)
      toast.error('Não foi possível preparar a validação.')
    } finally {
      setIsValidating(false)
    }
  }

  // Hub: nenhum documento selecionado -> grade de documentos por categoria.
  if (docType === null) {
    return (
      <div className="w-full max-w-4xl space-y-10 animate-fade-in-up">
        <div className="space-y-3">
          <p className="font-mono text-[11px] tracking-[0.35em] uppercase text-primary">
            Prime Circle
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-medium text-foreground">
            Documentos
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Gere, valide e gerencie os instrumentos da operação imobiliária — do primeiro contato à
            entrega das chaves.
          </p>
        </div>

        <Link
          to="/negocios"
          className="block rounded-xl bg-[#0E0E0E] p-6 border border-transparent hover:border-[#C9A84C]/60 transition-colors group"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-[#C9A84C]/15 p-3 shrink-0">
                <Briefcase className="h-6 w-6 text-[#C9A84C]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#F5F1E6]">Negócios</h2>
                <p className="text-sm text-[#E8E0CC]/70 mt-1 max-w-lg">
                  O dossiê da operação: cadastre as partes e o imóvel uma única vez — todos os
                  documentos carregam de lá.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline font-mono text-[10px] tracking-[0.3em] uppercase text-[#C9A84C] mt-2 shrink-0 group-hover:translate-x-0.5 transition-transform">
              Abrir →
            </span>
          </div>
        </Link>

        {DOC_GROUPS.map((group) => (
          <div key={group.label} className="space-y-3">
            <p className="font-mono text-[11px] tracking-[0.35em] uppercase text-muted-foreground">
              {group.label}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.docs.map((doc) =>
                doc.href ? (
                  <Link key={doc.href} to={doc.href} className={DOC_CARD_CLASS}>
                    <h3 className="font-semibold text-foreground">{doc.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{doc.desc}</p>
                  </Link>
                ) : (
                  <button
                    key={doc.key}
                    type="button"
                    onClick={() => setDocType(doc.key!)}
                    className={DOC_CARD_CLASS}
                  >
                    <h3 className="font-semibold text-foreground">{doc.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{doc.desc}</p>
                  </button>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className="w-full max-w-2xl shadow-elevation border-0 md:border md:border-border/60 animate-fade-in-up">
      <CardHeader className="space-y-3 pb-6">
        <button
          type="button"
          onClick={() => setDocType(null)}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" /> Todos os documentos
        </button>
        <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-primary">Documento</p>
        <CardTitle className="font-display text-3xl font-medium text-foreground">
          {DOC_TITLES[docType]}
        </CardTitle>
        <CardDescription>
          Preencha os dados para gerar o documento Word automaticamente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {docType === 'recibo' && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <CarregarDeNegocio form={form} aplicar={(n) => aplicarRecibo(form.setValue, n)} />
              <PartyFields prefix="vendedor" title="Dados do Vendedor(a)" />
              <PartyFields prefix="comprador" title="Dados do Comprador(a)" />

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
                      <FormLabel>Descrição do Imóvel</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ex: Apartamento nº 302, Edifício..."
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
                        <FormLabel>Matrícula nº</FormLabel>
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
                        <FormLabel>Registro de Imóveis (nº)</FormLabel>
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
                        <FormLabel>Comarca</FormLabel>
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
                        <FormLabel>IPTU</FormLabel>
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
                  <FileCheck2 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-primary">Condições e Natureza das Arras</h3>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="valor_sinal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor do Sinal (R$)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="R$ 0,00"
                            value={field.value}
                            onChange={(e) => field.onChange(maskCurrency(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="valor_total"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor Total (R$)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="R$ 0,00"
                            value={field.value}
                            onChange={(e) => field.onChange(maskCurrency(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="forma_pagamento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Forma de Pagamento</FormLabel>
                        <Select value={field.value || undefined} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {FORMA_PAGAMENTO_OPTIONS.map((o) => (
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
                    name="natureza_arras"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Natureza das Arras</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="confirmatoria">Confirmatória</SelectItem>
                            <SelectItem value="penitencial">Penitencial</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="prazo_formalizacao_dias"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prazo Formalização (dias)</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="prazo_restituicao_dias"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prazo Restituição (dias)</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="foro_comarca"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fórum/Comarca</FormLabel>
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
                onClick={() => form.reset(reciboMockData)}
                className="w-full"
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
                onClick={onValidateRecibo}
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
        )}
        {docType === 'intermediation' && <IntermediationForm />}
        {docType === 'promise' && <PromiseForm />}
        {docType === 'compromisso' && <PromessaAvistaForm />}
        {docType === 'compromissoFinanciado' && <PromessaFinanciadaForm />}
        {docType === 'compromissoFgts' && <PromessaFgtsForm />}
        {docType === 'compromissoDacao' && <PromessaDacaoForm />}
        {docType === 'termoChaves' && <TermoChavesForm />}
        {docType === 'termoPosse' && <TermoPosseForm />}
        {docType === 'checklist' && <ChecklistForm />}
      </CardContent>
    </Card>
  )
}
