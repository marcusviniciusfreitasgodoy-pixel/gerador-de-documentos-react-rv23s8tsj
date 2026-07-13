import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { PermutaForm } from '@/components/PermutaForm'

export default function PermutaPage() {
  return (
    <Card className="w-full max-w-2xl shadow-elevation border-0 md:border md:border-border/60 animate-fade-in-up">
      <CardHeader className="space-y-3 pb-8 text-center">
        <CardTitle className="text-2xl font-semibold tracking-tight text-primary">
          Promessa de Permuta
        </CardTitle>
        <CardDescription>Troca de imóveis com torna opcional</CardDescription>
      </CardHeader>
      <CardContent>
        <PermutaForm />
      </CardContent>
    </Card>
  )
}
