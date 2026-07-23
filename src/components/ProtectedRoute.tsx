import { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Loader2, Clock, LogOut, RefreshCw, FileText } from 'lucide-react'
import { toast } from 'sonner'

import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import pb from '@/lib/pocketbase/client'

// Cadastro fechado com liberação: a conta é criada na hora, mas o acesso só
// abre quando o administrador marca `approved` no painel. Enquanto isso, o
// usuário autenticado vê esta tela — que é a CONFIRMAÇÃO do cadastro dele —
// em vez do app. O token local guarda o `approved` da época do login, então o
// botão "Verificar liberação" força um authRefresh para buscar o valor atual.
function AguardandoLiberacao() {
  const { user, signOut } = useAuth()
  const [checando, setChecando] = useState(false)

  const verificar = async () => {
    setChecando(true)
    try {
      await pb.collection('users').authRefresh()
      // O onChange do authStore atualiza o `user` do contexto; se aprovado,
      // o ProtectedRoute re-renderiza direto para o app. Se ainda não:
      toast.info('Seu acesso ainda não foi liberado. Tente novamente mais tarde.')
    } catch {
      toast.error('Não foi possível verificar agora. Tente novamente.')
    } finally {
      setChecando(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh] p-4">
      <Card className="w-full max-w-md shadow-elevation border-0 md:border md:border-border/60 animate-fade-in-up">
        <CardHeader className="space-y-1 pb-6 text-center">
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-primary/10 p-3">
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-primary">
            Cadastro recebido!
          </CardTitle>
          <CardDescription>
            Sua conta foi criada com sucesso{user?.email ? ` para ${user.email}` : ''}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground space-y-2">
            <p className="flex items-start gap-2">
              <FileText className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
              <span>
                O acesso é liberado pelo administrador — normalmente em poucas horas. Você não
                precisa fazer mais nada.
              </span>
            </p>
            <p>
              Quando for liberado, é só entrar de novo (ou tocar em &quot;Verificar
              liberação&quot;).
            </p>
          </div>
          <Button onClick={verificar} disabled={checando} className="w-full h-11">
            {checando ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verificando...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" /> Verificar liberação
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
    return <AguardandoLiberacao />
  }

  return <Outlet />
}
