import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, FileText } from 'lucide-react'
import { toast } from 'sonner'

import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getErrorMessage } from '@/lib/pocketbase/mensagens'
import pb from '@/lib/pocketbase/client'

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [enviandoReset, setEnviandoReset] = useState(false)

  // "Esqueci minha senha": usa o e-mail já digitado no campo acima. O PocketBase
  // responde 204 mesmo para e-mail inexistente (de propósito — não revela quem
  // tem conta), então a mensagem de sucesso é a mesma em qualquer caso. O link
  // do e-mail abre a página de redefinição do próprio backend; depois de trocar
  // a senha, a pessoa volta e entra normalmente.
  const handleEsqueciSenha = async () => {
    if (!email.trim()) {
      toast.error('Digite seu e-mail no campo acima primeiro.')
      return
    }
    setEnviandoReset(true)
    try {
      await pb.collection('users').requestPasswordReset(email.trim())
      toast.success(`Se existir uma conta para ${email.trim()}, enviamos o link de redefinição.`)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setEnviandoReset(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      toast.error(getErrorMessage(error))
    } else {
      toast.success('Login realizado com sucesso!')
      navigate('/')
    }
    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md shadow-elevation border-0 md:border md:border-border/60 animate-fade-in-up">
      <CardHeader className="space-y-1 pb-8 text-center">
        <div className="flex justify-center mb-2">
          <FileText className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl font-semibold tracking-tight text-primary">Entrar</CardTitle>
        <CardDescription>Acesse sua conta para gerar documentos.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <button
                type="button"
                onClick={handleEsqueciSenha}
                disabled={enviandoReset}
                className="text-xs text-primary hover:underline disabled:opacity-50"
              >
                {enviandoReset ? 'Enviando...' : 'Esqueci minha senha'}
              </button>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full h-11 text-base font-medium">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Não tem conta?{' '}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Cadastre-se
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
