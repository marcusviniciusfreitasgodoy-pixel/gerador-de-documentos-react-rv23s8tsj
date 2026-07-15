import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Plus, FolderOpen, Trash2, Users, Home, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { listNegocios, createNegocio, deleteNegocio } from '@/lib/negocios'
import type { Negocio } from '@/lib/negocios'

export default function NegociosPage() {
  const [negocios, setNegocios] = useState<Negocio[]>([])
  const [titulo, setTitulo] = useState('')
  const [loading, setLoading] = useState(true)
  const [criando, setCriando] = useState(false)
  const navigate = useNavigate()

  const carregar = () => {
    setLoading(true)
    listNegocios()
      .then(setNegocios)
      .catch((err) =>
        toast.error(err instanceof Error ? err.message : 'Não foi possível carregar os negócios.'),
      )
      .finally(() => setLoading(false))
  }

  useEffect(carregar, [])

  const handleCriar = async () => {
    if (titulo.trim().length < 3) {
      toast.error('Dê um nome ao negócio (ex.: "Apto Barra — João vende pra Maria").')
      return
    }
    setCriando(true)
    try {
      const novo = await createNegocio(titulo.trim())
      navigate(`/negocios/${novo.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível criar o negócio.')
    } finally {
      setCriando(false)
    }
  }

  const handleExcluir = async (n: Negocio) => {
    if (!confirm(`Excluir o negócio "${n.titulo}"? Os dados salvos nele serão perdidos.`)) return
    try {
      await deleteNegocio(n.id)
      toast.success('Negócio excluído.')
      carregar()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível excluir.')
    }
  }

  return (
    <div className="w-full max-w-4xl space-y-4 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FolderOpen className="h-6 w-6 text-primary" /> Negócios
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Suba os documentos de um negócio uma vez. Todos os documentos daquele negócio passam a
          puxar os dados daqui.
        </p>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Nome do negócio (ex.: Apto Barra — João vende pra Maria)"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCriar()}
        />
        <Button onClick={handleCriar} disabled={criando}>
          {criando ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" /> Novo
            </>
          )}
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : !negocios.length ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          Nenhum negócio ainda. Crie o primeiro acima.
        </Card>
      ) : (
        <div className="space-y-2">
          {negocios.map((n) => (
            <Card key={n.id} className="p-4 flex items-center justify-between">
              <Link to={`/negocios/${n.id}`} className="flex-1 min-w-0">
                <p className="font-medium truncate">{n.titulo}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> {n.partes.length}{' '}
                    {n.partes.length === 1 ? 'parte' : 'partes'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Home className="h-3 w-3" />
                    {n.imovel.matricula ? `Matrícula ${n.imovel.matricula}` : 'Sem imóvel'}
                  </span>
                </p>
              </Link>
              <Button size="icon" variant="ghost" onClick={() => handleExcluir(n)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
