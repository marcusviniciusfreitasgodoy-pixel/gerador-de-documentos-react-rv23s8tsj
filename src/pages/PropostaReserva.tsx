import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ReservaPropostaForm } from '@/components/ReservaPropostaForm'

export default function PropostaReservaPage() {
  return (
    <Card className="w-full max-w-2xl shadow-elevation border-0 md:border md:border-border/60 animate-fade-in-up">
      <CardHeader className="space-y-3 pb-8 text-center">
        <CardTitle className="text-2xl font-semibold tracking-tight text-primary">
          Proposta de Compra e Reserva
        </CardTitle>
        <CardDescription>
          Oferta de compra com sinal/reserva — passo antes da promessa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ReservaPropostaForm />
      </CardContent>
    </Card>
  )
}
