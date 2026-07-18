import { Component, useState, useEffect, type ReactNode } from 'react'
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import {
  LogOut,
  BookOpen,
  FileCheck,
  UserCircle,
  FileSearch,
  Headset,
  Briefcase,
  Sun,
  Moon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'

// Connection Mark — símbolo oficial Prime Circle (dois círculos + ponto de acordo).
// Regra da marca: um círculo ouro + um marfim, ambos vazados; nunca preencher os dois.
function ConnectionMark({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      role="img"
      aria-label="Prime Circle"
      className={className}
    >
      <circle cx="36" cy="50" r="30" stroke="#C9A84C" strokeWidth="4" fill="none" />
      <circle cx="64" cy="50" r="30" stroke="#F5F1E6" strokeWidth="4" fill="none" />
      <circle cx="50" cy="50" r="4" fill="#C9A84C" />
    </svg>
  )
}

const NAV_ITEMS = [
  { to: '/', label: 'Documentos', icon: FileCheck, end: true },
  { to: '/negocios', label: 'Negócios', icon: Briefcase },
  { to: '/validar', label: 'Validar', icon: FileSearch },
  { to: '/legal-knowledge', label: 'Conhecimento', icon: BookOpen },
  { to: '/especialista', label: 'Especialista', icon: Headset },
  { to: '/perfil', label: 'Perfil', icon: UserCircle },
]

// A14: sem isto, QUALQUER excecao nao tratada em qualquer pagina derrubava o app
// para tela branca — o corretor perdia o preenchimento sem nem saber o que houve.
// Precisa ser class component: e a unica forma de error boundary no React.
// Fica no Layout porque ele envolve todas as rotas pelo <Outlet/>.
class ErrorBoundary extends Component<{ children: ReactNode }, { erro: Error | null }> {
  state: { erro: Error | null } = { erro: null }

  static getDerivedStateFromError(erro: Error) {
    return { erro }
  }

  componentDidCatch(erro: Error) {
    console.error('Erro nao tratado na aplicacao:', erro)
  }

  render() {
    if (!this.state.erro) return this.props.children
    return (
      <div className="w-full max-w-lg rounded-lg border border-border bg-card p-6 space-y-4 shadow-elevation">
        <h2 className="font-display text-2xl font-medium text-foreground">Algo deu errado</h2>
        <p className="text-sm text-muted-foreground">
          A tela encontrou um erro inesperado e parou. Recarregar costuma resolver. Se o problema
          continuar, anote o que você estava fazendo e avise o suporte.
        </p>
        <p className="rounded bg-muted px-3 py-2 font-mono text-xs text-muted-foreground break-all">
          {this.state.erro.message}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Recarregar a página
        </button>
      </div>
    )
  }
}

export default function Layout() {
  const { isAuthenticated, user, signOut } = useAuth()
  const navigate = useNavigate()

  const [dark, setDark] = useState(
    () => typeof window !== 'undefined' && localStorage.getItem('pc-theme') === 'dark',
  )
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('pc-theme', dark ? 'dark' : 'light')
  }, [dark])

  const handleSignOut = () => {
    signOut()
    navigate('/login')
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Casca Ink — a marca mora aqui; o miolo (main) fica no Marfim. */}
      <header className="sticky top-0 z-10 bg-[#0E0E0E] border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <Link
            to={isAuthenticated ? '/' : '/login'}
            className="flex items-center gap-2.5 shrink-0"
          >
            <ConnectionMark className="h-8 w-8" />
            <span className="flex flex-col leading-none">
              <span className="font-bold text-[15px] tracking-tight text-[#F5F1E6]">
                Prime Circle
              </span>
              <span className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#C9A84C] mt-1">
                Documentos
              </span>
            </span>
          </Link>
          {isAuthenticated && (
            <nav className="flex items-center gap-0.5 sm:gap-1 min-w-0">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'text-[#C9A84C] bg-white/[0.06]'
                        : 'text-[#E8E0CC]/75 hover:text-[#F5F1E6] hover:bg-white/5',
                    )
                  }
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="hidden lg:inline">{item.label}</span>
                </NavLink>
              ))}
              <span className="hidden xl:inline text-xs text-[#E8E0CC]/50 px-2 truncate max-w-[180px]">
                {user?.email}
              </span>
              <button
                type="button"
                onClick={() => setDark((v) => !v)}
                aria-label={dark ? 'Tema claro' : 'Tema escuro'}
                className="flex items-center rounded-md p-1.5 text-[#E8E0CC]/75 hover:text-[#C9A84C] hover:bg-white/5 transition-colors"
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-[#E8E0CC]/75 hover:text-[#F5F1E6] hover:bg-white/5 transition-colors"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span className="hidden lg:inline">Sair</span>
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center p-4 md:p-8 py-8">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  )
}
