import { Outlet, Link, useNavigate } from 'react-router-dom'
import { FileText, LogOut, BookOpen, FileCheck, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

export default function Layout() {
  const { isAuthenticated, user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = () => {
    signOut()
    navigate('/login')
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <header className="sticky top-0 z-10 bg-white shadow-subtle border-b border-border/40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to={isAuthenticated ? '/' : '/login'}
            className="flex items-center gap-2 text-primary"
          >
            <FileText className="h-6 w-6" />
            <span className="font-semibold text-lg tracking-tight">Gerador de Recibo</span>
          </Link>
          {isAuthenticated && (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/">
                  <FileCheck className="mr-1 h-4 w-4" /> Gerar
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link to="/legal-knowledge">
                  <BookOpen className="mr-1 h-4 w-4" /> Conhecimento
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link to="/my-profile">
                  <UserCircle className="mr-1 h-4 w-4" /> Meu Perfil
                </Link>
              </Button>
              <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                <span className="ml-1 hidden sm:inline">Sair</span>
              </Button>
            </div>
          )}
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
