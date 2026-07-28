import { Component, useState, useEffect, type ReactNode } from 'react'
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import {
  LogOut,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  BookOpen,
  FileCheck,
  UserCircle,
  FileSearch,
  Headset,
  Briefcase,
  Sun,
  Moon,
  Wand2,
  LifeBuoy,
  Menu,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'

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

// A Base de Conhecimento é ferramenta interna do admin (régua jurídica da
// validação); o corretor comum não vê. A porta do corretor é "Ajuda".
// `desc` existe só para o painel do celular: lá cabe uma linha dizendo o que a
// tela faz, coisa que a barra do desktop nunca teve espaço para mostrar.
const NAV_ITEMS = [
  {
    to: '/',
    label: 'Documentos',
    icon: FileCheck,
    end: true,
    desc: 'Gerar contratos, termos e recibos da operação',
  },
  {
    to: '/negocios',
    label: 'Negócios',
    icon: Briefcase,
    desc: 'O dossiê da operação: partes e imóvel cadastrados uma vez só',
  },
  {
    to: '/validar',
    label: 'Validar minuta',
    icon: FileSearch,
    desc: 'Revisar um contrato de terceiros com IA antes de assinar',
  },
  {
    to: '/legal-knowledge',
    label: 'Base jurídica',
    icon: BookOpen,
    adminOnly: true,
    desc: 'A régua que a validação usa para revisar as minutas',
  },
  {
    to: '/especialista',
    label: 'Especialista',
    icon: Headset,
    desc: 'Levar um caso difícil para análise de um especialista',
  },
  {
    to: '/ajuda',
    label: 'Ajuda',
    icon: LifeBuoy,
    desc: 'Dúvidas frequentes, sugestões e chamados de suporte',
  },
  {
    to: '/perfil',
    label: 'Perfil',
    icon: UserCircle,
    desc: 'Seus dados de corretor: nome, CRECI, comissão e PIX',
  },
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
  const { isAuthenticated, user, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()
  // Painel de navegação do celular. Fecha sozinho ao escolher um item, senão o
  // corretor troca de tela e o painel continua por cima do conteúdo.
  const [menuAberto, setMenuAberto] = useState(false)

  const [dark, setDark] = useState(
    () => typeof window !== 'undefined' && localStorage.getItem('pc-theme') === 'dark',
  )
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('pc-theme', dark ? 'dark' : 'light')
  }, [dark])

  const handleSignOut = () => {
    setMenuAberto(false)
    signOut()
    navigate('/login')
  }

  const itensVisiveis = NAV_ITEMS.filter((item) => !('adminOnly' in item) || isAdmin)

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
              {/* No celular a segunda linha sai: cada pixel do cabeçalho conta. */}
              <span className="hidden sm:inline font-mono text-[9px] tracking-[0.35em] uppercase text-[#C9A84C] mt-1">
                Documentos
              </span>
            </span>
          </Link>

          {isAuthenticated && (
            <>
              {/* Barra horizontal: só a partir de lg, onde os rótulos cabem.
                  Abaixo disso ela estourava a tela do celular e jogava Tema e
                  Sair para fora do viewport. */}
              <nav className="hidden lg:flex items-center gap-0.5 sm:gap-1 min-w-0">
                {itensVisiveis.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    title={item.label}
                    aria-label={item.label}
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
                    <span>{item.label}</span>
                  </NavLink>
                ))}
                <span className="hidden xl:inline text-xs text-[#E8E0CC]/50 px-2 truncate max-w-[180px]">
                  {user?.email}
                </span>
                <button
                  type="button"
                  onClick={() => setDark((v) => !v)}
                  aria-label={dark ? 'Tema claro' : 'Tema escuro'}
                  title={dark ? 'Tema claro' : 'Tema escuro'}
                  className="flex items-center rounded-md p-1.5 text-[#E8E0CC]/75 hover:text-[#C9A84C] hover:bg-white/5 transition-colors"
                >
                  {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  title="Sair da conta"
                  aria-label="Sair da conta"
                  className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-[#E8E0CC]/75 hover:text-[#F5F1E6] hover:bg-white/5 transition-colors"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span>Sair</span>
                </button>
              </nav>

              {/* Celular e tablet: um único alvo de 44px, o mínimo que o dedo
                  acerta. O painel mostra cada item COM rótulo e explicação. */}
              <Sheet open={menuAberto} onOpenChange={setMenuAberto}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    aria-label="Abrir menu"
                    className="lg:hidden flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-[#E8E0CC] hover:bg-white/10 active:bg-white/15 transition-colors"
                  >
                    <Menu className="h-6 w-6" />
                  </button>
                </SheetTrigger>
                {/* [&>button] mira o "X" de fechar que o SheetContent injeta:
                    ele nasce com 16px de alvo, pequeno demais para o dedo. */}
                <SheetContent
                  side="right"
                  className="w-[86%] max-w-sm bg-[#0E0E0E] border-l border-white/10 p-0 flex flex-col [&>button]:h-11 [&>button]:w-11 [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:rounded-md [&>button]:top-2.5 [&>button]:right-2.5 [&>button]:text-[#E8E0CC] [&>button]:opacity-100 [&>button:hover]:bg-white/10"
                >
                  <SheetTitle className="sr-only">Menu de navegação</SheetTitle>

                  <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/10 shrink-0">
                    <ConnectionMark className="h-7 w-7" />
                    <span className="font-bold text-[15px] tracking-tight text-[#F5F1E6]">
                      Prime Circle
                    </span>
                  </div>

                  <nav className="flex-1 overflow-y-auto py-2">
                    {itensVisiveis.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={() => setMenuAberto(false)}
                        className={({ isActive }) =>
                          cn(
                            'flex items-start gap-3 px-5 py-3 min-h-[48px] transition-colors',
                            isActive
                              ? 'bg-white/[0.07] border-l-2 border-[#C9A84C]'
                              : 'border-l-2 border-transparent hover:bg-white/5 active:bg-white/[0.08]',
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <item.icon
                              className={cn(
                                'h-5 w-5 shrink-0 mt-0.5',
                                isActive ? 'text-[#C9A84C]' : 'text-[#E8E0CC]/70',
                              )}
                            />
                            <span className="flex flex-col min-w-0">
                              <span
                                className={cn(
                                  'text-[15px] font-medium leading-tight',
                                  isActive ? 'text-[#C9A84C]' : 'text-[#F5F1E6]',
                                )}
                              >
                                {item.label}
                              </span>
                              <span className="text-xs text-[#E8E0CC]/55 leading-snug mt-0.5">
                                {item.desc}
                              </span>
                            </span>
                          </>
                        )}
                      </NavLink>
                    ))}
                  </nav>

                  <div className="border-t border-white/10 p-4 space-y-1 shrink-0">
                    {user?.email && (
                      <p className="px-1 pb-2 text-xs text-[#E8E0CC]/45 truncate">{user.email}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => setDark((v) => !v)}
                      className="flex w-full items-center gap-3 rounded-md px-1 py-3 min-h-[48px] text-[15px] font-medium text-[#E8E0CC]/85 hover:bg-white/5 active:bg-white/[0.08] transition-colors"
                    >
                      {dark ? (
                        <Sun className="h-5 w-5 shrink-0" />
                      ) : (
                        <Moon className="h-5 w-5 shrink-0" />
                      )}
                      {dark ? 'Tema claro' : 'Tema escuro'}
                    </button>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 rounded-md px-1 py-3 min-h-[48px] text-[15px] font-medium text-[#E8E0CC]/85 hover:bg-white/5 active:bg-white/[0.08] transition-colors"
                    >
                      <LogOut className="h-5 w-5 shrink-0" />
                      Sair da conta
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </>
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

// ── Introdução padrão de página ─────────────────────────────────────────────
// Onboarding contínuo: uma frase de benefício SEMPRE visível e um "Como
// funciona" que só abre quando o usuário pede. O novato entende a página; o
// veterano nunca é atrapalhado. Mora aqui (e não num arquivo próprio) porque o
// editor do Skip não cria arquivos novos. Regra de redação do Marcus: nunca
// usar travessão nos textos.
export function IntroPagina({
  frase,
  passos,
  dica,
}: {
  frase: ReactNode
  passos?: ReactNode[]
  dica?: ReactNode
}) {
  const [aberto, setAberto] = useState(false)
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground leading-relaxed">{frase}</p>
      {passos && passos.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            {aberto ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
            Como funciona
          </button>
          {aberto && (
            <div className="mt-2 space-y-2 animate-fade-in-up">
              <ol className="space-y-2">
                {passos.map((p, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
                    <span className="text-primary font-medium shrink-0">{i + 1}.</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ol>
              {dica && (
                <div className="flex gap-2 rounded-md bg-primary/5 p-2.5 text-sm text-muted-foreground leading-relaxed">
                  <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{dica}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Botão "Preencher dados de teste": só existe para o admin. O corretor comum
// não deve ver um atalho que enche o contrato de dados fictícios.
export function BotaoDadosTeste({
  onClick,
  className,
  variante = 'ghost',
  rotulo = 'Preencher dados de teste',
}: {
  onClick: () => void
  className?: string
  variante?: 'ghost' | 'outline'
  rotulo?: string
}) {
  const { isAdmin } = useAuth()
  if (!isAdmin) return null
  if (variante === 'outline') {
    return (
      <Button type="button" variant="outline" className={className ?? 'w-full'} onClick={onClick}>
        <Wand2 className="mr-2 h-4 w-4" />
        {rotulo}
      </Button>
    )
  }
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={className ?? 'text-muted-foreground hover:text-foreground'}
      onClick={onClick}
    >
      <Wand2 className="mr-1.5 h-3.5 w-3.5" />
      {rotulo}
    </Button>
  )
}

// Prévia da cláusula que a escolha troca. O corretor decide entre duas opções
// cujo efeito só aparece no .docx depois de gerar; aqui ele lê a redação exata
// antes. O texto vem sempre das funções de form-helpers, as mesmas que o
// buildData usa, para prévia e documento nunca divergirem.
export function VerTextoClausula({ texto, className }: { texto: string; className?: string }) {
  const [aberto, setAberto] = useState(false)
  return (
    <div className={cn('pt-0.5', className)}>
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        title={aberto ? 'Ocultar o texto da cláusula' : 'Ver o texto que vai sair no documento'}
        className="flex w-full items-center gap-1.5 py-2 text-left text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <FileText className="h-3.5 w-3.5 shrink-0" />
        {/* O sublinhado fica no texto, não no botão: o botão ocupa a linha
            inteira só para o dedo ter onde acertar no celular. */}
        <span className="underline underline-offset-4">
          {aberto ? 'Ocultar texto da cláusula' : 'Ver texto da cláusula'}
        </span>
      </button>
      {aberto && (
        <p className="mt-1 rounded-md border border-border/60 bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
          {texto}
        </p>
      )}
    </div>
  )
}
