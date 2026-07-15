import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { FolderOpen, Loader2 } from 'lucide-react'
import { listNegocios, type Negocio } from '@/lib/negocios'

interface CarregarDeNegocioProps {
  onLoad: (negocio: Negocio) => void
  hasData?: boolean
}

export function CarregarDeNegocio({ onLoad, hasData }: CarregarDeNegocioProps) {
  const [negocios, setNegocios] = useState<Negocio[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [loading, setLoading] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    listNegocios()
      .then(setNegocios)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleLoad = () => {
    const negocio = negocios.find((n) => n.id === selectedId)
    if (!negocio) return
    if (hasData) {
      setShowConfirm(true)
    } else {
      onLoad(negocio)
    }
  }

  const handleConfirm = () => {
    setShowConfirm(false)
    const negocio = negocios.find((n) => n.id === selectedId)
    if (negocio) onLoad(negocio)
  }

  return (
    <>
      <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3">
        <FolderOpen className="h-5 w-5 text-primary shrink-0" />
        <Select value={selectedId} onValueChange={setSelectedId}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder={loading ? 'Carregando...' : 'Selecione um negócio'} />
          </SelectTrigger>
          <SelectContent>
            {negocios.map((n) => (
              <SelectItem key={n.id} value={n.id}>
                {n.titulo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" size="sm" disabled={!selectedId || loading} onClick={handleLoad}>
          {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
          Carregar
        </Button>
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sobrescrever dados do formulário?</AlertDialogTitle>
            <AlertDialogDescription>
              O formulário já contém dados. Carregar um negócio irá substituir as informações
              atuais. Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Sim, sobrescrever</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
