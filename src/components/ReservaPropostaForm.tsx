import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Download, Loader2, Home, User, Building2, FileText } from 'lucide-react'

export interface ReservaPropostaData {
  propertyAddress: string
  propertyType: string
  propertyValue: string
  buyerName: string
  buyerCpf: string
  buyerPhone: string
  buyerEmail: string
  sellerName: string
  sellerCpf: string
  brokerName: string
  brokerCreci: string
  reservationFee: string
  reservationPeriod: string
  paymentMethod: string
  observations: string
}

function generateReservaPropostaDocx(data: ReservaPropostaData): Blob {
  const p = (label: string, val: string) =>
    `<p style="margin:4px 0;"><strong>${label}:</strong> ${val || '-'}</p>`
  const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Proposta de Reserva</title></head><body style="font-family:Arial,sans-serif;font-size:12pt;line-height:1.6;">
<h1 style="text-align:center;">PROPOSTA DE RESERVA</h1>
<h2>Dados do Imóvel</h2>${p('Endereço', data.propertyAddress)}${p('Tipo', data.propertyType)}${p('Valor', data.propertyValue)}
<h2>Proponente</h2>${p('Nome', data.buyerName)}${p('CPF', data.buyerCpf)}${p('Telefone', data.buyerPhone)}${p('E-mail', data.buyerEmail)}
<h2>Proprietário</h2>${p('Nome', data.sellerName)}${p('CPF', data.sellerCpf)}
<h2>Corretor</h2>${p('Nome', data.brokerName)}${p('CRECI', data.brokerCreci)}
<h2>Reserva</h2>${p('Valor da Reserva', data.reservationFee)}${p('Prazo (dias)', data.reservationPeriod)}${p('Forma de Pagamento', data.paymentMethod)}
<h2>Observações</h2><p>${data.observations || '-'}</p>
<p style="margin-top:40px;">_______________________________<br/>Assinatura do Proponente</p>
</body></html>`
  return new Blob([html], { type: 'application/msword' })
}

export function ReservaPropostaForm() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ReservaPropostaData>({
    propertyAddress: '',
    propertyType: '',
    propertyValue: '',
    buyerName: '',
    buyerCpf: '',
    buyerPhone: '',
    buyerEmail: '',
    sellerName: '',
    sellerCpf: '',
    brokerName: '',
    brokerCreci: '',
    reservationFee: '',
    reservationPeriod: '30',
    paymentMethod: '',
    observations: '',
  })

  const set = (field: keyof ReservaPropostaData, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const blob = generateReservaPropostaDocx(data)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'proposta-reserva.doc'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Documento gerado com sucesso!')
    } catch (error) {
      console.error(error)
      toast.error('Erro ao gerar documento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const field = (
    id: keyof ReservaPropostaData,
    label: string,
    opts?: { placeholder?: string; type?: string; required?: boolean; className?: string },
  ) => (
    <div className={`space-y-1.5 ${opts?.className ?? ''}`}>
      <Label htmlFor={id}>
        {label}
        {opts?.required !== false && ' *'}
      </Label>
      <Input
        id={id}
        type={opts?.type ?? 'text'}
        value={data[id]}
        onChange={(e) => set(id, e.target.value)}
        placeholder={opts?.placeholder}
        required={opts?.required ?? true}
      />
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto p-4 md:p-6">
      <div className="flex items-center gap-3">
        <FileText className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Proposta de Reserva</h1>
          <p className="text-sm text-muted-foreground">Preencha os dados para gerar o documento</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" /> Imóvel
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('propertyAddress', 'Endereço do Imóvel', {
            placeholder: 'Rua, número, bairro, cidade',
            className: 'md:col-span-2',
          })}
          <div className="space-y-1.5">
            <Label>Tipo do Imóvel *</Label>
            <Select value={data.propertyType} onValueChange={(v) => set('propertyType', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartamento">Apartamento</SelectItem>
                <SelectItem value="casa">Casa</SelectItem>
                <SelectItem value="terreno">Terreno</SelectItem>
                <SelectItem value="comercial">Comercial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {field('propertyValue', 'Valor do Imóvel (R$)', { placeholder: '0,00' })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" /> Proponente
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('buyerName', 'Nome Completo', { className: 'md:col-span-2' })}
          {field('buyerCpf', 'CPF', { placeholder: '000.000.000-00' })}
          {field('buyerPhone', 'Telefone', { placeholder: '(00) 00000-0000' })}
          {field('buyerEmail', 'E-mail', { type: 'email', className: 'md:col-span-2' })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" /> Proprietário e Corretor
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('sellerName', 'Nome do Proprietário')}
          {field('sellerCpf', 'CPF do Proprietário', { placeholder: '000.000.000-00' })}
          {field('brokerName', 'Nome do Corretor')}
          {field('brokerCreci', 'CRECI')}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reserva</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {field('reservationFee', 'Valor da Reserva (R$)', { placeholder: '0,00' })}
          {field('reservationPeriod', 'Prazo (dias)', { type: 'number' })}
          <div className="space-y-1.5">
            <Label>Forma de Pagamento *</Label>
            <Select value={data.paymentMethod} onValueChange={(v) => set('paymentMethod', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="transferencia">Transferência</SelectItem>
                <SelectItem value="dinheiro">Dinheiro</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 md:col-span-3">
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              value={data.observations}
              onChange={(e) => set('observations', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Gerando...
          </>
        ) : (
          <>
            <Download className="h-4 w-4" /> Gerar Documento
          </>
        )}
      </Button>
    </form>
  )
}
