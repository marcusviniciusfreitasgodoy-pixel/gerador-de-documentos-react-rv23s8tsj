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
