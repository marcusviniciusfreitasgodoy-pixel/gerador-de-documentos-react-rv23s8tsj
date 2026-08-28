import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import pb from '@/lib/pocketbase/client'

interface AuthContextType {
  user: any
  isAuthenticated: boolean
  isAdmin: boolean
  isApproved: boolean
  // Teste de 15 dias. `trialExpiraEm` vazio significa SEM LIMITE, e é o caso
  // das contas anteriores à mudança: elas continuam liberadas, como a § 06 da
  // landing prometeu. Admin nunca expira.
  trialExpiraEm: string | null
  trialExpirado: boolean
  trialDiasRestantes: number | null
  // Assinatura. Mesma convenção do teste: VAZIO SIGNIFICA SEM PLANO, e aí quem
  // manda é o prazo do teste. Os cinco campos são carimbados pelo servidor
  // (`plano_carimbo.js` e `negocio_limite.js`) e o próprio usuário não consegue
  // alterá-los.
  plano: string
  planoRenovaEm: string | null
  planoAtivo: boolean
  // Teve plano e a data de renovação já passou. Separado de `planoAtivo` porque
  // a tela precisa saber QUAL frase mostrar: quem nunca assinou vê "seu teste
  // terminou", quem assinou vê "sua assinatura venceu".
  planoVencido: boolean
  negociosNoMes: number
  planoLimiteNegocios: number
  // O gate de verdade. Existe separado de `trialExpirado` porque assinante que
  // teve o teste vencido continua liberado: bloquear por `trialExpirado` sozinho
  // trancaria justamente quem paga.
  acessoBloqueado: boolean
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(pb.authStore.isValid ? pb.authStore.record : null)
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid)
  const [loading, setLoading] = useState(true)

  const isAdmin = user?.isAdmin ?? false
  // Acesso por confirmação de e-mail (decisão do Marcus, 2026-07-24): a conta
  // libera sozinha quando o usuário clica no link de verificação do PocketBase
  // (campo `verified`). Ninguém precisa aprovar no painel. Admin dispensa a
  // checagem, senão um deslize trancaria o próprio administrador do sistema.
  const isApproved = (user?.verified ?? false) || isAdmin

  // O prazo é carimbado pelo servidor no cadastro e o próprio usuário não
  // consegue alterá-lo (hook `trial_carimbo.js`). Aqui só lemos: esta conta é
  // conveniência de tela, e quem barra de verdade são as rotas do servidor.
  const trialRaw = String(user?.trial_expira_em ?? '').trim()
  const trialMs = trialRaw ? new Date(trialRaw.replace(' ', 'T')).getTime() : 0
  const trialExpiraEm = trialMs ? trialRaw : null
  const trialExpirado = !isAdmin && !!trialMs && trialMs < Date.now()
  const trialDiasRestantes = trialMs
    ? Math.max(0, Math.ceil((trialMs - Date.now()) / (24 * 60 * 60 * 1000)))
    : null

  // Assinatura, lida do mesmo jeito e com a mesma ressalva: isto é conveniência
  // de tela. Quem barra de verdade são as rotas do servidor.
  const plano = String(user?.plano ?? '').trim()
  const renovaRaw = String(user?.plano_renova_em ?? '').trim()
  const renovaMs = renovaRaw ? new Date(renovaRaw.replace(' ', 'T')).getTime() : 0
  const planoRenovaEm = renovaMs ? renovaRaw : null
  const planoAtivo = !!plano && !!renovaMs && renovaMs > Date.now()
  const negociosNoMes = Number(user?.negocios_no_mes ?? 0) || 0
  // Zero significa SEM LIMITE, a mesma convenção do `trial_expira_em` vazio: é
  // o que mantém a conta em teste sem teto de volume, já que o teste é limitado
  // por prazo.
  const planoLimiteNegocios = Number(user?.plano_limite_negocios ?? 0) || 0
  // Assinatura vencida bloqueia SOZINHA, sem passar pelo prazo do teste. Sem
  // esta linha existia um furo silencioso: a checagem antiga só barrava quem
  // tinha `trial_expira_em` preenchido E vencido, e as contas anteriores ao
  // teste de 15 dias têm esse campo VAZIO de propósito (migração 1900000033,
  // para não ligar prazo retroativo em quem já estava dentro). Ou seja, uma
  // dessas contas assinava, o mês vencia, e ela seguia com acesso total.
  //
  // Exige a data presente e no passado: plano carimbado SEM data de renovação é
  // erro de cadastro do admin, e trancar quem paga por erro nosso é pior do que
  // deixar passar um dia a mais.
  const planoVencido = !isAdmin && !!plano && !!renovaMs && renovaMs < Date.now()
  const acessoBloqueado = !isAdmin && !planoAtivo && (trialExpirado || planoVencido)

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((_token, record) => {
      setUser(pb.authStore.isValid ? record : null)
      setIsAuthenticated(pb.authStore.isValid)
    })
    if (pb.authStore.isValid) {
      pb.collection('users')
        .authRefresh()
        .catch(() => pb.authStore.clear())
        .finally(() => setLoading(false))
    } else {
      if (pb.authStore.record) pb.authStore.clear()
      setLoading(false)
    }
    return () => {
      unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      await pb.collection('users').create({ email, password, passwordConfirm: password, name })
      // Dispara o e-mail de verificação já no cadastro. Se o envio falhar, a
      // tela "Confirme seu e-mail" tem o botão de reenviar; por isso o catch vazio.
      await pb
        .collection('users')
        .requestVerification(email)
        .catch(() => {})
      await pb.collection('users').authWithPassword(email, password)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      await pb.collection('users').authWithPassword(email, password)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signOut = () => {
    pb.authStore.clear()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isApproved,
        trialExpiraEm,
        trialExpirado,
        trialDiasRestantes,
        plano,
        planoRenovaEm,
        planoAtivo,
        planoVencido,
        negociosNoMes,
        planoLimiteNegocios,
        acessoBloqueado,
        signUp,
        signIn,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
