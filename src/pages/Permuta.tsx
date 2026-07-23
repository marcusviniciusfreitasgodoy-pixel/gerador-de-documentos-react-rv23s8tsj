import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IntroPagina } from '@/components/Layout'
import { ajudaDoc } from '@/pages/Index'
import { PermutaForm } from '@/components/PermutaForm'

export default function PermutaPage() {
  return (
    <Card className="w-full max-w-2xl shadow-elevation border-0 md:border md:border-border/60 animate-fade-in-up">
      <CardHeader className="space-y-3 pb-6">
        {/* Documento em rota própria: o "voltar" precisa ser um Link para o hub
            (não há estado de docType para limpar, como no Index). */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" /> Todos os documentos
        </Link>
        <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-primary">Documento</p>
        <CardTitle className="font-display text-3xl font-medium text-foreground">
          Promessa de Permuta
        </CardTitle>
        <div className="mt-1">
          <IntroPagina frase={ajudaDoc('/permuta')} />
        </div>
      </CardHeader>
      <CardContent>
        <PermutaForm />
      </CardContent>
    </Card>
  )
}
