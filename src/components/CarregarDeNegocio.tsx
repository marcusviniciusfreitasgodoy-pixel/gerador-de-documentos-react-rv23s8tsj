import { useEffect, useState, useRef, useCallback } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { FolderOpen, Loader2, CheckCircle2, FileSearch, FilePlus2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { listNegocios, getNegocio, updateNegocio } from '@/lib/negocios'
import type { Negocio } from '@/lib/negocios'
import { aplicarNegocio, calcularVolta } from '@/lib/aplicar-negocio'
import type { ResultadoVolta } from '@/lib/aplicar-negocio'

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
  // Fase 4 ("Gerar outro deste negócio"): quando um negócio é carregado, entrega
  // ao form uma função que RE-APLICA exatamente o mesmo negócio (com o slot da
  // permuta e as opções já capturados). O form guarda essa função e a chama
  // depois do reset. Se nenhum negócio for carregado, ela nunca é chamada.
  onNegocioAplicado?: (reaplicar: () => void) => void
  /** C4: entrega o Negócio carregado ao form, para a volta saber onde gravar. */
  onNegocioCarregado?: (negocio: Negocio) => void
  /** C4: devolve o Negócio mais recente conhecido pelo form (pós-gravação), para a
   *  RE-aplicação do "Gerar outro" não repovoar com o objeto congelado no closure. */
  negocioAtual?: () => Negocio | null
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
  onNegocioAplicado,
  onNegocioCarregado,
  negocioAtual,
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
      // Aplica o negócio ao form. Extraído numa função para que o "Gerar outro
      // deste negócio" (Fase 4) possa RE-APLICAR exatamente o mesmo — com o slot
      // e as opções já capturados neste closure.
      const aplicarNoForm = () => {
        // C4: na RE-aplicação ("Gerar outro"), `negocio` é o objeto congelado no
        // closure de quando o corretor clicou "Carregar" — não sabe das gravações
        // feitas depois. `negocioAtual` devolve o que o form sabe AGORA (pós-
        // gravação); só usamos esse valor fresco quando é o MESMO negócio.
        const fresco = negocioAtual?.()
        const n = fresco && fresco.id === negocio.id ? fresco : negocio
        if (aplicar) {
          // Documento de partes planas: usa a função de mapeamento do próprio form.
          aplicar(n)
        } else if (replaceVendedores && replaceCompradores && replaceAnuentes) {
          aplicarNegocio(
            { setValue: form.setValue, replaceVendedores, replaceCompradores, replaceAnuentes },
            n,
            { imovel: !!imovel, imovelSlot: imovelDuplo ? slot : undefined, incluirAnuentes },
          )
        }
        // Por último, depois de todos os setValue/replace acima: garante que o
        // snapshot do useNegocioSync enxerga os valores já aplicados ao form.
        // Como esta função roda de novo no "Gerar outro" (via onNegocioAplicado),
        // isso re-snapshota automaticamente a cada re-aplicação — não só na carga inicial.
        onNegocioCarregado?.(n)
      }
      aplicarNoForm()
      onNegocioAplicado?.(aplicarNoForm)
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

// ── Fase 4: momento de sucesso pós-geração ─────────────────────────────
// Fica neste arquivo (e não num .tsx próprio) porque o editor do Skip não cria
// arquivos novos; todos os forms já importam deste módulo. Só apresentação —
// a lógica (validar, resetar, re-aplicar negócio) vem do form via callbacks.
interface DocumentoGeradoProps {
  // Nome do arquivo baixado, ex.: "recibo-de-sinal-arras.docx". Opcional.
  nomeArquivo?: string
  // Envia a minuta recém-gerada ao Validador. Se ausente, o botão não aparece.
  onValidar?: () => void
  // Reseta o formulário (e re-aplica o negócio carregado, se houver).
  onGerarOutro: () => void
  // Volta ao hub. Só os documentos que são rota própria passam isto; os que
  // abrem dentro do hub já têm o "← Todos os documentos" no cabeçalho acima.
  onVoltar?: () => void
  // Estado de carregamento do botão Validar.
  validando?: boolean
}

export function DocumentoGerado({
  nomeArquivo,
  onValidar,
  onGerarOutro,
  onVoltar,
  validando,
}: DocumentoGeradoProps) {
  return (
    <div className="flex flex-col items-center text-center py-10 px-4 animate-fade-in-up">
      <div className="rounded-full bg-primary/10 p-4 mb-5">
        <CheckCircle2 className="h-10 w-10 text-primary" />
      </div>
      <h2 className="font-display text-2xl font-medium text-foreground">Documento gerado!</h2>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm">
        {nomeArquivo ? (
          <>
            Baixado como <span className="font-mono text-foreground">{nomeArquivo}</span>. Confira
            sua pasta de downloads.
          </>
        ) : (
          'O arquivo foi baixado. Confira sua pasta de downloads.'
        )}
      </p>
      <div className="flex flex-col sm:flex-row gap-2 mt-8 w-full max-w-sm">
        {onValidar && (
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-11"
            onClick={onValidar}
            disabled={validando}
          >
            <FileSearch className="mr-2 h-4 w-4" />
            {validando ? 'Preparando...' : 'Validar esta minuta'}
          </Button>
        )}
        <Button type="button" className="flex-1 h-11" onClick={onGerarOutro}>
          <FilePlus2 className="mr-2 h-4 w-4" />
          Gerar outro documento
        </Button>
      </div>
      {onVoltar && (
        <button
          type="button"
          onClick={onVoltar}
          className="mt-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar aos documentos
        </button>
      )}
    </div>
  )
}

// ── Fase 2b: autosave de rascunho ──────────────────────────────────────
// Vive neste arquivo (e não num hook .ts próprio) porque o editor do Skip não
// cria arquivos novos; todos os forms já importam deste módulo. O trabalho do
// corretor é sagrado: F5 / fechar aba / voltar da validação não pode apagar o
// formulário inteiro (600+ campos).

// "Vale a pena oferecer recuperação?" — true se há QUALQUER texto preenchido,
// em qualquer profundidade (campos planos ou dentro dos arrays de partes).
// Booleanos/números vindos dos defaults não contam como trabalho do usuário.
function temConteudo(v: unknown): boolean {
  if (typeof v === 'string') return v.trim() !== ''
  if (Array.isArray(v)) return v.some(temConteudo)
  if (v && typeof v === 'object') return Object.values(v).some(temConteudo)
  return false
}

/**
 * Autosalva o formulário em localStorage e, ao voltar, OFERECE recuperar via
 * toast — nunca restaura sozinho (ressuscitar dado velho sem o usuário pedir é
 * pior que a tela vazia; o toast é reversível).
 *
 * @param form  o UseFormReturn do formulário
 * @param chave identificador único do documento (vira `localStorage['draft:'+chave]`)
 * @returns `limparRascunho` — chame no submit bem-sucedido e no "Gerar outro".
 */
export function useFormDraft(form: UseFormReturn<any>, chave: string) {
  const key = 'draft:' + chave
  const jaOfereceu = useRef(false)
  // Enquanto o toast "Recuperar?" está na tela, o autosave NÃO grava: o rascunho
  // existente é sagrado até o corretor decidir. Evita que uma edição feita antes
  // de decidir (ou uma reidratação) sobrescreva o que ele ainda pode querer.
  const ofertaPendente = useRef(false)

  // (b) No mount: se há rascunho com conteúdo, oferece recuperar. Roda 1x.
  useEffect(() => {
    if (jaOfereceu.current) return
    jaOfereceu.current = true
    let raw: string | null = null
    try {
      raw = localStorage.getItem(key)
    } catch {
      return
    }
    if (!raw) return
    let saved: any
    try {
      saved = JSON.parse(raw)
    } catch {
      try {
        localStorage.removeItem(key)
      } catch {
        /* modo privado / quota — ignora */
      }
      return
    }
    if (!temConteudo(saved)) {
      try {
        localStorage.removeItem(key)
      } catch {
        /* ignora */
      }
      return
    }
    ofertaPendente.current = true
    // `saved` fica capturado neste closure — "Recuperar" restaura ele mesmo que
    // o localStorage seja sobrescrito depois.
    toast('Recuperar rascunho não salvo?', {
      description: 'Você tinha um formulário em andamento nesta tela.',
      duration: Infinity,
      action: {
        label: 'Recuperar',
        onClick: () => {
          form.reset(saved)
          ofertaPendente.current = false
        },
      },
      cancel: {
        label: 'Descartar',
        onClick: () => {
          try {
            localStorage.removeItem(key)
          } catch {
            /* ignora */
          }
          ofertaPendente.current = false
        },
      },
      onDismiss: () => {
        ofertaPendente.current = false
      },
      onAutoClose: () => {
        ofertaPendente.current = false
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // (a) Autosave com debounce ~800ms — SÓ em edição real do usuário.
  // form.watch entrega `type === 'change'` apenas para input do usuário; os
  // setValue/reset/replace programáticos (carga do corretor, "Carregar negócio",
  // "Preencher dados de teste") vêm com `type === undefined` e são ignorados —
  // senão a carga do corretor no F5 sobrescreveria o rascunho bom com um form
  // quase-vazio. O negócio carregado é capturado junto no 1º toque real.
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined
    const sub = form.watch((_values, info) => {
      if (info?.type !== 'change') return
      if (t) clearTimeout(t)
      t = setTimeout(() => {
        if (ofertaPendente.current) return
        try {
          localStorage.setItem(key, JSON.stringify(form.getValues()))
        } catch {
          /* quota cheia / modo privado — nunca derruba o form */
        }
      }, 800)
    })
    return () => {
      if (t) clearTimeout(t)
      sub.unsubscribe()
    }
  }, [form, key])

  // (c) Limpeza — o form chama no submit bem-sucedido (rascunho cumpriu o papel)
  // e no "Gerar outro documento" (novo doc não deve ressuscitar rascunho velho).
  const limparRascunho = useCallback(() => {
    try {
      localStorage.removeItem(key)
    } catch {
      /* ignora */
    }
  }, [key])

  return { limparRascunho }
}

// ── C4: volta pro dossiê ────────────────────────────────────────────────

/**
 * C4 — volta pro dossiê.
 *
 * Guarda o Negócio carregado E o snapshot dos valores do form logo após a
 * carga. Na hora de gerar, compara os dois e devolve o que mudou.
 *
 * Mora aqui, e não em arquivo próprio, pela regra nº 5: o Skip não cria
 * arquivo novo. Mesmo motivo do `useFormDraft` acima.
 */
export function useNegocioSync(form: UseFormReturn<any>, grupos: readonly string[]) {
  const negocioRef = useRef<Negocio | null>(null)
  const snapshotRef = useRef<Record<string, unknown> | null>(null)

  /**
   * Chamado pelo `aplicarNoForm` do CarregarDeNegocio via `onNegocioCarregado`
   * — tanto na carga inicial quanto na RE-aplicação do "Gerar outro" (os forms
   * guardam `aplicarNoForm` numa ref e a chamam de novo para reaplicar o mesmo
   * negócio). Como a chamada mora dentro de `aplicarNoForm`, toda re-aplicação
   * redispara este registro automaticamente. Sem isso, o diff da 2ª geração
   * compararia contra o estado errado e acusaria mudança fantasma.
   */
  const registrarNegocio = useCallback(
    (negocio: Negocio) => {
      const atual = negocioRef.current
      // O `negocio` que chega na RE-aplicação ("Gerar outro") é o objeto congelado
      // no closure do CarregarDeNegocio — ele não sabe das gravações que fizemos.
      // Esta é a ÚNICA guarda que impede reverter, em silêncio, dado já corrigido.
      // Não "simplifique" sem entender os três casos abaixo:
      //   - negocio.updated < atual.updated (mais antigo): manter o guardado é o
      //     que impede a regressão — `r.partes` é construído a partir de
      //     `negocio.partes` e `updateNegocio` substitui o array inteiro, então
      //     regredir aqui faria a próxima gravação reverter campos já corrigidos.
      //     Esta é a razão de a guarda existir.
      //   - negocio.updated === atual.updated (empate): mesma revisão do
      //     servidor, conteúdo idêntico — a escolha é indiferente; usar `<=`
      //     (em vez de `<`) é só a opção mais defensiva.
      //   - negocio.updated > atual.updated (mais novo): recarga manual ou
      //     escrita externa trouxe `updated` mais novo, e assume a base, como deve.
      // Premissa: a comparação é lexicográfica de STRING, não temporal — só
      // funciona porque o PocketBase devolve `updated` em formato de largura
      // fixa e sempre em UTC (`YYYY-MM-DD HH:MM:SS.sssZ`), repassado verbatim
      // por `normalize()` em src/lib/negocios.ts sem reformatação. Se esse campo
      // passar por formatação no cliente, esta comparação quebra em silêncio.
      const guardadoEhMelhor =
        !!atual && atual.id === negocio.id && negocio.updated <= atual.updated
      negocioRef.current = guardadoEhMelhor ? atual : negocio
      // O snapshot SEMPRE acompanha o form: o diff é form-vs-form, então mesmo
      // que o form exiba dados antigos, o campo não-alterado não entra no patch
      // e o valor já persistido sobrevive.
      snapshotRef.current = form.getValues() as Record<string, unknown>
    },
    [form],
  )

  /** null = não há nada a oferecer (sem Negócio carregado, ou nada mudou). */
  const calcular = useCallback((): ResultadoVolta | null => {
    const negocio = negocioRef.current
    const snapshot = snapshotRef.current
    if (!negocio || !snapshot) return null
    const r = calcularVolta(negocio, snapshot, form.getValues() as Record<string, unknown>, grupos)
    return r.alteracoes.length > 0 ? r : null
  }, [form, grupos])

  const gravar = useCallback(
    async (r: ResultadoVolta) => {
      const negocio = negocioRef.current
      if (!negocio) return
      // Guarda o registro devolvido pelo servidor (já normalizado por
      // updateNegocio, com o `updated` real) em vez de reconstruir a base
      // localmente — é esse `updated` que registrarNegocio usa para decidir se
      // uma versão recebida depois pode substituir a base sem regredi-la.
      const gravado = await updateNegocio(negocio.id, { partes: r.partes, imovel: r.imovel })
      negocioRef.current = gravado
      // O dossiê agora reflete o form: o snapshot passa a ser o estado atual,
      // senão gerar um 2º documento reofereceria as mesmas mudanças.
      snapshotRef.current = form.getValues() as Record<string, unknown>
    },
    [form],
  )

  /** C4: getter estável do Negócio guardado — lido na hora da chamada (não no
   *  render em que o corretor clicou "Carregar"), então sempre devolve o mais
   *  recente conhecido pelo form, inclusive após `gravar`. */
  const negocioAtual = useCallback(() => negocioRef.current, [])

  return { registrarNegocio, calcular, gravar, negocioAtual }
}
