import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { DistratoForm } from '@/components/DistratoForm'

export default function DistratoPage() {
  return (
    <Card className="w-full max-w-2xl shadow-elevation border-0 md:border md:border-border/60 animate-fade-in-up">
      <CardHeader className="space-y-3 pb-8 text-center">
        <CardTitle className="text-2xl font-semibold tracking-tight text-primary">
          Distrato
        </CardTitle>
        <CardDescription>
          Desfazimento consensual de contrato — devolução de valores e quitação recíproca
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DistratoForm />
      </CardContent>
    </Card>
  )
}
