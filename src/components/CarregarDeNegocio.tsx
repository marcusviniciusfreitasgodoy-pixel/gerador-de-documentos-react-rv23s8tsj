import { useEffect, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { FolderOpen, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { listNegocios, getNegocio } from '@/lib/negocios'
import type { Negocio } from '@/lib/negocios'
import { aplicarNegocio } from '@/lib/aplicar-negocio'

interface CarregarDeNegocioProps {
  form: UseFormReturn<any>
  imovel: boolean
  // `replace` do useFieldArray de cada array de partes do formulário que está
  // montando este componente. `setValue` não re-renderiza essas linhas — ver
  // aplicarNegocio em @/lib/aplicar-negocio.
  replaceVendedores: (v: any[]) => void
  replaceCompradores: (v: any[]) => void
  replaceAnuentes: (v: any[]) => void
}

export function CarregarDeNegocio({
  form,
  imovel,
  replaceVendedores,
  replaceCompradores,
  replaceAnuentes,
}: CarregarDeNegocioProps) {
  const [negocios, setNegocios] = useState<Negocio[]>([])
  const [selecionado, setSelecionado] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    listNegocios()
      .then(setNegocios)
      .catch(() => {
        /* silencioso: sem negócios, o formulário funciona normalmente */
      })
  }, [])

  // Se o corretor ainda não tem nenhum negócio, o seletor não aparece —
  // o formulário fica idêntico ao que sempre foi.
  if (!negocios.length) return null

  const handleCarregar = async () => {
    if (!selecionado) return
    // Sem window.confirm: ele trava quando o navegador suprime o diálogo
    // ("não perguntar novamente") e, com os formulários abrindo vazios, não há
    // dados de exemplo para proteger. O corretor escolheu o negócio e clicou
    // Carregar — a ação já é explícita.
    setLoading(true)
    try {
      const negocio = await getNegocio(selecionado)
      aplicarNegocio(
        { setValue: form.setValue, replaceVendedores, replaceCompradores, replaceAnuentes },
        negocio,
        { imovel },
      )
      toast.success(`Dados de "${negocio.titulo}" carregados.`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível carregar o negócio.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-border/60 bg-secondary/30 p-3 mb-4">
      <label className="text-sm font-medium mb-2 flex items-center gap-2">
        <FolderOpen className="h-4 w-4 text-primary" /> Carregar dados de um negócio
      </label>
      <div className="flex gap-2">
        <Select value={selecionado} onValueChange={setSelecionado}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Selecione um negócio..." />
          </SelectTrigger>
          <SelectContent>
            {negocios.map((n) => (
              <SelectItem key={n.id} value={n.id}>
                {n.titulo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" onClick={handleCarregar} disabled={!selecionado || loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Carregar'}
        </Button>
      </div>
    </div>
  )
}
