import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import { Loader2, Download } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { maskCpf, maskCurrency } from '@/lib/utils'

const formSchema = z.object({
  nome: z.string().min(3, 'Nome é obrigatório e deve ter pelo menos 3 caracteres'),
  cpf: z.string().length(14, 'O CPF deve ser preenchido corretamente'),
  valor: z
    .string()
    .min(1, 'Valor é obrigatório')
    .refine((val) => val !== 'R$ 0,00', 'Valor deve ser maior que zero'),
})

type FormValues = z.infer<typeof formSchema>

export default function Index() {
  const [isGenerating, setIsGenerating] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      cpf: '',
      valor: '',
    },
  })

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    form.setValue('cpf', maskCpf(value), { shouldValidate: form.formState.isSubmitted })
  }

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    form.setValue('valor', maskCurrency(value), { shouldValidate: form.formState.isSubmitted })
  }

  const generateDocx = async (data: FormValues) => {
    setIsGenerating(true)

    try {
      // Simulate slight processing delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 800))

      const zip = new PizZip()

      zip.file(
        '[Content_Types].xml',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
          <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
          <Default Extension="xml" ContentType="application/xml"/>
          <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
        </Types>`,
      )

      zip.file(
        '_rels/.rels',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
          <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
        </Relationships>`,
      )

      // The template requests `{valor}`, and explicitly specifies `quantia de R$ {valor}`.
      // So we must remove the 'R$ ' from the masked string before injecting to avoid duplicate R$ R$.
      const cleanValor = data.valor.replace(/^R\$\s?/, '').trim()

      const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
          <w:body>
            <w:p>
              <w:pPr>
                <w:jc w:val="center"/>
                <w:spacing w:after="400"/>
              </w:pPr>
              <w:r>
                <w:rPr>
                  <w:b/>
                  <w:sz w:val="32"/>
                  <w:szCs w:val="32"/>
                </w:rPr>
                <w:t>RECIBO DE SINAL</w:t>
              </w:r>
            </w:p>
            <w:p>
              <w:pPr>
                <w:jc w:val="both"/>
                <w:spacing w:after="400" w:line="360" w:lineRule="auto"/>
              </w:pPr>
              <w:r>
                <w:rPr>
                  <w:sz w:val="24"/>
                  <w:szCs w:val="24"/>
                </w:rPr>
                <w:t xml:space="preserve">Eu, {nome}, portador do CPF {cpf}, declaro ter recebido a quantia de R$ {valor} a título de sinal e princípio de pagamento, nos termos dos arts. 417 a 420 do Código Civil, com natureza confirmatória e caráter irretratável.</w:t>
              </w:r>
            </w:p>
            <w:p>
              <w:pPr>
                <w:jc w:val="right"/>
                <w:spacing w:before="400"/>
              </w:pPr>
              <w:r>
                <w:rPr>
                  <w:sz w:val="24"/>
                  <w:szCs w:val="24"/>
                </w:rPr>
                <w:t>Rio de Janeiro.</w:t>
              </w:r>
            </w:p>
          </w:body>
        </w:document>`

      zip.file('word/document.xml', documentXml)

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      })

      doc.render({
        nome: data.nome,
        cpf: data.cpf,
        valor: cleanValor,
      })

      const out = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      })

      const url = URL.createObjectURL(out)
      const link = document.createElement('a')
      link.href = url
      link.download = 'recibo-de-sinal.docx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

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
    <Card className="w-full max-w-[500px] shadow-elevation border-0 md:border md:border-border/60 animate-fade-in-up">
      <CardHeader className="space-y-1 pb-8 text-center">
        <CardTitle className="text-2xl font-semibold tracking-tight text-primary">
          Gerar Recibo de Sinal
        </CardTitle>
        <CardDescription className="text-sm">
          Preencha os dados abaixo para gerar o documento automaticamente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(generateDocx)} className="space-y-6">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/90 font-medium">Nome do Vendedor</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: João Silva"
                      {...field}
                      className="transition-colors focus-visible:ring-accent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/90 font-medium">CPF</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="000.000.000-00"
                      maxLength={14}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        handleCpfChange(e)
                      }}
                      className="transition-colors focus-visible:ring-accent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/90 font-medium">Valor (R$)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="R$ 0,00"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        handleValorChange(e)
                      }}
                      className="transition-colors focus-visible:ring-accent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
      </CardContent>
    </Card>
  )
}
