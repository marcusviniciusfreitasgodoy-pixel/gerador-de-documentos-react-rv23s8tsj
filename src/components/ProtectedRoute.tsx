import { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Loader2, MailCheck, LogOut, RefreshCw, Send } from 'lucide-react'
import { toast } from 'sonner'

import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import pb from '@/lib/pocketbase/client'

// Acesso por confirmação de e-mail: a conta é criada na hora e o acesso abre
// sozinho quando o usuário clica no link de verificação que chega por e-mail
// (campo `verified` do PocketBase). Enquanto isso, o usuário autenticado vê
// esta tela. O token local guarda o `verified` da época do login, então o
// botão "Já confirmei" força um authRefresh para buscar o valor atual.
function ConfirmeSeuEmail() {
  const { user, signOut } = useAuth()
  const [checando, setChecando] = useState(false)
  const [reenviando, setReenviando] = useState(false)

  const verificar = async () => {
    setChecando(true)
    try {
      await pb.collection('users').authRefresh()
      // O onChange do authStore atualiza o `user` do contexto; se verificado,
      // o ProtectedRoute re-renderiza direto para o app. Se ainda não:
      toast.info('Ainda não vimos a confirmação. Clique no link do e-mail e tente de novo.')
    } catch {
      toast.error('Não foi possível verificar agora. Tente novamente.')
    } finally {
      setChecando(false)
    }
  }

  const reenviar = async () => {
    if (!user?.email) return
    setReenviando(true)
    try {
      await pb.collection('users').requestVerification(user.email)
      toast.success('E-mail de confirmação reenviado. Olhe também a caixa de spam.')
    } catch {
      toast.error('Não foi possível reenviar agora. Tente novamente em instantes.')
    } finally {
      setReenviando(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh] p-4">
      <Card className="w-full max-w-md shadow-elevation border-0 md:border md:border-border/60 animate-fade-in-up">
        <CardHeader className="space-y-1 pb-6 text-center">
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-primary/10 p-3">
              <MailCheck className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-primary">
            Confirme seu e-mail
          </CardTitle>
          <CardDescription>
            Sua conta foi criada{user?.email ? ` para ${user.email}` : ''}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground space-y-2">
            <p>
              Enviamos um link de confirmação para o seu e-mail. Clique nele e depois toque em
              &quot;Já confirmei&quot;: o acesso libera na hora, sem depender de ninguém.
            </p>
            <p>Não chegou? Olhe a caixa de spam ou reenvie abaixo.</p>
          </div>
          <Button onClick={verificar} disabled={checando} className="w-full h-11">
            {checando ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verificando...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" /> Já confirmei
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={reenviar}
            disabled={reenviando}
            className="w-full h-11"
          >
            {reenviando ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reenviando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" /> Reenviar e-mail
              </>
            )}
          </Button>
          <Button variant="ghost" onClick={signOut} className="w-full">
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export function ProtectedRoute() {
  const { isAuthenticated, isApproved, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isApproved) {
    return <ConfirmeSeuEmail />
  }

  return <Outlet />
}
