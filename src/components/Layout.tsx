import { Outlet } from 'react-router-dom'
import { FileText } from 'lucide-react'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <header className="sticky top-0 z-10 bg-white shadow-subtle border-b border-border/40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <FileText className="h-6 w-6" />
            <span className="font-semibold text-lg tracking-tight">Gerador de Recibo</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center p-4 md:p-8 py-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-border/40 py-6 text-center text-sm text-muted-foreground">
        <p>Em conformidade com os Arts. 417-420 do Código Civil Brasileiro.</p>
        <p className="mt-1">
          © {new Date().getFullYear()} LegalTech Solutions. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  )
}
