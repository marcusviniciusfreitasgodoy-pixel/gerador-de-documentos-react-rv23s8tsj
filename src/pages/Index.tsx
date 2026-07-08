import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Download, Building2, FileCheck2, Users, Wand2, FileSignature } from 'lucide-react'
import { toast } from 'sonner'
import { IntermediationForm } from '@/components/IntermediationForm'
import { PromiseForm } from '@/components/PromiseForm'
import { CompromissoForm } from '@/components/CompromissoForm'
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
import { generateDocx } from '@/lib/docx-generator'

export default function Index() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [docType, setDocType] = useState<'recibo' | 'intermediation' | 'promise' | 'compromisso'>(
    'recibo',
  )

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
      await new Promise((r) => setTimeout(r, 800))
      generateDocx(buildTemplateData(data))
      toast.success('Documento gerado com sucesso!')
      form.reset()
    } catch (error) {
      console.error('Erro ao gerar documento:', error)
      toast.error('Ocorreu um erro ao gerar o documento.')
    } finally {
      setIsGenerating(false)
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
            variant={docType === 'promise' ? 'default' : 'outline'}
            onClick={() => setDocType('promise')}
            size="sm"
          >
            <FileSignature className="mr-1 h-4 w-4" />
            Promessa de Compra e Venda
          </Button>
          <Button
            type="button"
            variant={docType === 'compromisso' ? 'default' : 'outline'}
            onClick={() => setDocType('compromisso')}
            size="sm"
          >
            Compromisso (à vista)
          </Button>
        </div>
        <CardTitle className="text-2xl font-semibold tracking-tight text-primary">
          {docType === 'recibo'
            ? 'Recibo de Sinal e Princípio de Pagamento (Arras)'
            : docType === 'intermediation'
              ? 'Autorização para Divulgação e Venda de Imóvel'
              : docType === 'promise'
                ? 'Promessa de Compra e Venda'
                : 'Compromisso de Compra e Venda (À Vista)'}
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
            </form>
          </Form>
        )}
        {docType === 'intermediation' && <IntermediationForm />}
        {docType === 'promise' && <PromiseForm />}
        {docType === 'compromisso' && <CompromissoForm />}
      </CardContent>
    </Card>
  )
}
