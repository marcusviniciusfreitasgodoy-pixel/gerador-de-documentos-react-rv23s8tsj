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
  // Documentos de partes PLANAS (recibo, autorização, promise, chaves, posse,
  // checklist) passam sua própria função de aplicar (ver @/lib/aplicar-negocio-plano);
  // quando presente, ela é usada e as props de array abaixo são ignoradas.
  aplicar?: (negocio: Negocio) => void
  imovel?: boolean
  // Permuta: dois imóveis (A/B). Mostra o radio para o corretor escolher em qual
  // slot o imóvel do negócio entra.
  imovelDuplo?: boolean
  // Proposta: não carrega anuentes (o anuente do dossiê é cônjuge do vendedor,
  // que não encaixa no anuente da proposta). Default: carrega.
  incluirAnuentes?: boolean
  // `replace` do useFieldArray de cada array de partes do formulário que está
  // montando este componente. `setValue` não re-renderiza essas linhas — ver
  // aplicarNegocio em @/lib/aplicar-negocio. São o "lado vendedor / lado
  // comprador": a proposta passa proprietarios/proponentes; a permuta, primeiros/segundos.
  replaceVendedores?: (v: any[]) => void
  replaceCompradores?: (v: any[]) => void
  replaceAnuentes?: (v: any[]) => void
}

export function CarregarDeNegocio({
  form,
  aplicar,
  imovel,
  imovelDuplo,
  incluirAnuentes,
  replaceVendedores,
  replaceCompradores,
  replaceAnuentes,
}: CarregarDeNegocioProps) {
  const [negocios, setNegocios] = useState<Negocio[]>([])
  const [selecionado, setSelecionado] = useState('')
  const [loading, setLoading] = useState(false)
  const [slot, setSlot] = useState<'a' | 'b'>('a')

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
      if (aplicar) {
        // Documento de partes planas: usa a função de mapeamento do próprio form.
        aplicar(negocio)
      } else if (replaceVendedores && replaceCompradores && replaceAnuentes) {
        aplicarNegocio(
          { setValue: form.setValue, replaceVendedores, replaceCompradores, replaceAnuentes },
          negocio,
          { imovel: !!imovel, imovelSlot: imovelDuplo ? slot : undefined, incluirAnuentes },
        )
      }
      toast.success(`Dados de "${negocio.titulo}" carregados.`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível carregar o negócio.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-primary/25 bg-primary/[0.04] p-4 mb-5 shadow-subtle">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="rounded-md bg-primary/12 p-1.5 shrink-0">
          <FolderOpen className="h-4 w-4 text-primary" />
        </div>
        <div className="leading-tight">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary">Dossiê</p>
          <p className="text-sm font-semibold text-foreground">Carregar dados de um negócio</p>
        </div>
      </div>
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
      {imovelDuplo && (
        <div className="mt-2 flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">Imóvel do negócio vai para:</span>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name="slot-imovel-negocio"
              checked={slot === 'a'}
              onChange={() => setSlot('a')}
            />
            Imóvel A
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name="slot-imovel-negocio"
              checked={slot === 'b'}
              onChange={() => setSlot('b')}
            />
            Imóvel B
          </label>
        </div>
      )}
    </div>
  )
}
