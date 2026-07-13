import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Loader2,
  Download,
  Building2,
  FileCheck2,
  Users,
  Wand2,
  FileSignature,
  FileSearch,
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

export default function Index() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const navigate = useNavigate()
  const [docType, setDocType] = useState<
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
  >('recibo')

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

  return (
    <Card className="w-full max-w-2xl shadow-elevation border-0 md:border md:border-border/60 animate-fade-in-up">
      <CardHeader className="space-y-3 pb-8 text-center">
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            type="button"
            variant={docType === 'recibo' ? 'default' : 'outline'}
            onClick={() => setDocType('recibo')}
            size="sm"
          >
            Recibo de Sinal
          </Button>
          <Button
            type="button"
            variant={docType === 'intermediation' ? 'default' : 'outline'}
            onClick={() => setDocType('intermediation')}
            size="sm"
          >
            Autorização de Intermediação
          </Button>
          <Button
            type="button"
            variant={docType === 'compromisso' ? 'default' : 'outline'}
            onClick={() => setDocType('compromisso')}
            size="sm"
          >
            Promessa / Compromisso de Compra e Venda (à vista)
          </Button>
          <Button
            type="button"
            variant={docType === 'compromissoFinanciado' ? 'default' : 'outline'}
            onClick={() => setDocType('compromissoFinanciado')}
            size="sm"
          >
            Promessa / Compromisso de Compra e Venda (financiada)
          </Button>
          <Button
            type="button"
            variant={docType === 'compromissoFgts' ? 'default' : 'outline'}
            onClick={() => setDocType('compromissoFgts')}
            size="sm"
          >
            Promessa com FGTS (sem financiamento)
          </Button>
          <Button
            type="button"
            variant={docType === 'compromissoDacao' ? 'default' : 'outline'}
            onClick={() => setDocType('compromissoDacao')}
            size="sm"
          >
            Promessa com Dação em Pagamento
          </Button>
          <Button
            type="button"
            variant={docType === 'termoChaves' ? 'default' : 'outline'}
            onClick={() => setDocType('termoChaves')}
            size="sm"
          >
            Termo de Entrega das Chaves
          </Button>
          <Button
            type="button"
            variant={docType === 'termoPosse' ? 'default' : 'outline'}
            onClick={() => setDocType('termoPosse')}
            size="sm"
          >
            Termo de Transmissão da Posse
          </Button>
          <Button
            type="button"
            variant={docType === 'checklist' ? 'default' : 'outline'}
            onClick={() => setDocType('checklist')}
            size="sm"
          >
            Checklist Documental
          </Button>
        </div>
        <Link
          to="/proposta-reserva"
          className="block w-full max-w-md mx-auto mt-2 rounded-lg border border-primary/30 bg-primary/5 p-4 hover:bg-primary/10 transition-colors duration-200 cursor-pointer text-left group"
        >
          <h3 className="font-semibold text-primary group-hover:text-primary/90 transition-colors">
            Proposta de Compra e Reserva
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Oferta de compra com sinal/reserva — passo antes da promessa
          </p>
        </Link>
        <Link
          to="/distrato"
          className="block w-full max-w-md mx-auto mt-2 rounded-lg border border-primary/30 bg-primary/5 p-4 hover:bg-primary/10 transition-colors duration-200 cursor-pointer text-left group"
        >
          <h3 className="font-semibold text-primary group-hover:text-primary/90 transition-colors">
            Distrato
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Desfazimento consensual de contrato — devolução de valores e quitação recíproca
          </p>
        </Link>
        <Link
          to="/permuta"
          className="block w-full max-w-md mx-auto mt-2 rounded-lg border border-primary/30 bg-primary/5 p-4 hover:bg-primary/10 transition-colors duration-200 cursor-pointer text-left group"
        >
          <h3 className="font-semibold text-primary group-hover:text-primary/90 transition-colors">
            Promessa de Permuta
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Troca de imóveis com torna opcional</p>
        </Link>
        <CardTitle className="text-2xl font-semibold tracking-tight text-primary">
          {docType === 'recibo'
            ? 'Recibo de Sinal e Princípio de Pagamento (Arras)'
            : docType === 'intermediation'
              ? 'Autorização para Divulgação e Venda de Imóvel'
              : docType === 'compromisso'
                ? 'Promessa / Compromisso de Compra e Venda (à vista)'
                : docType === 'compromissoFgts'
                  ? 'Promessa com FGTS (sem financiamento)'
                  : docType === 'compromissoDacao'
                    ? 'Promessa com Dação em Pagamento'
                    : docType === 'termoChaves'
                      ? 'Termo de Entrega das Chaves'
                      : docType === 'termoPosse'
                        ? 'Termo de Transmissão da Posse'
                        : 'Checklist Documental'}
        </CardTitle>
        <CardDescription>
          Preencha os dados para gerar o documento Word automaticamente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {docType === 'recibo' && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
