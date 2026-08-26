import pb from '@/lib/pocketbase/client'
import { emptyImovel, emptyPessoa, mergeResults } from '@/lib/extraction-types'
import type { PessoaExtraida, ImovelExtraido, ExtracaoResult } from '@/lib/extraction-types'

export type PapelParte = 'vendedor' | 'comprador' | 'anuente'

export interface ParteNegocio extends PessoaExtraida {
  _id: string // id local estável; sobrevive a edições de nome e a fusões
  papel: PapelParte
  conjuge_de?: string // guarda o _id do vendedor, NÃO o nome
}

function novoId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `id_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

// Ficha em branco para quem ainda não tem documento em mãos: o corretor digita
// os dados na mão, sem depender do upload. Nasce com os mesmos campos que a
// extração produz, então o resto do app (mesclagem, documentos) não vê
// diferença entre uma parte digitada e uma parte lida pela IA.
export function novaParte(papel: PapelParte): ParteNegocio {
  return { ...emptyPessoa, _id: novoId(), papel }
}

export interface Negocio {
  id: string
  owner: string
  titulo: string
  partes: ParteNegocio[]
  imovel: ImovelExtraido
  created: string
  updated: string
}

// O PocketBase devolve os campos json como objeto já parseado, mas um registro
// recém-criado pode vir com '' — normaliza para o shape esperado.
function normalize(rec: any): Negocio {
  return {
    id: rec.id,
    owner: rec.owner,
    titulo: rec.titulo || '',
    // Defensivo: partes vindas do banco sem _id (não deveria acontecer, mas
    // registros antigos ou gravados fora deste código podem não ter) recebem
    // um id estável na leitura.
    partes: Array.isArray(rec.partes)
      ? rec.partes.map((p: any) => (p && p._id ? p : { ...p, _id: novoId() }))
      : [],
    imovel:
      rec.imovel && typeof rec.imovel === 'object'
        ? { ...emptyImovel, ...rec.imovel }
        : { ...emptyImovel },
    created: rec.created,
    updated: rec.updated,
  }
}

export async function listNegocios(): Promise<Negocio[]> {
  const recs = await pb.collection('negocios').getFullList({ sort: '-updated' })
  return recs.map(normalize)
}

export async function getNegocio(id: string): Promise<Negocio> {
  const rec = await pb.collection('negocios').getOne(id)
  return normalize(rec)
}

export async function createNegocio(
  titulo: string,
  dadosIniciais?: { partes?: ParteNegocio[]; imovel?: ImovelExtraido },
): Promise<Negocio> {
  const owner = pb.authStore.record?.id
  if (!owner) throw new Error('Sessão expirada. Faça login novamente.')
  const rec = await pb.collection('negocios').create({
    owner,
    titulo,
    partes: dadosIniciais?.partes ?? [],
    imovel: dadosIniciais?.imovel
      ? { ...emptyImovel, ...dadosIniciais.imovel }
      : { ...emptyImovel },
  })
  return normalize(rec)
}

export async function updateNegocio(
  id: string,
  data: { titulo?: string; partes?: ParteNegocio[]; imovel?: ImovelExtraido },
): Promise<Negocio> {
  const rec = await pb.collection('negocios').update(id, data)
  return normalize(rec)
}

export async function deleteNegocio(id: string): Promise<void> {
  await pb.collection('negocios').delete(id)
}

// --- conversões entre o negócio e o formato da extração ---

// O negócio guarda partes com papel; o mergeResults trabalha com { pessoas, imovel }.
// Converte para poder mesclar o que já está salvo com o que acabou de ser extraído.
// Usado hoje só para o lado do IMÓVEL (ver mesclarPartes para as pessoas).
export function negocioParaExtracao(negocio: Negocio): ExtracaoResult {
  return {
    pessoas: negocio.partes.map(stripMeta),
    imovel: negocio.imovel,
  }
}

function stripMeta(p: ParteNegocio): PessoaExtraida {
  const { _id, papel, conjuge_de, ...pessoa } = p
  return pessoa
}

function vazioImovel(): ImovelExtraido {
  return { ...emptyImovel }
}

export interface ResultadoMesclagem {
  partes: ParteNegocio[]
  conflitosDePapel: { nome: string; papelMantido: PapelParte; papelIgnorado: PapelParte }[]
}

/**
 * Mescla as pessoas recém-extraídas no dossiê existente.
 *
 * O papel e o conjuge_de viajam NO PRÓPRIO REGISTRO através da fusão — não são
 * reatribuídos por índice/chave depois (era assim que se perdiam antes, em
 * `extracaoParaPartes`, removida por reatribuir papéis por índice depois de uma
 * fusão que pode reordenar/reduzir o array).
 *
 * Reusa `mergeResults` (e portanto a MESMA regra de identidade `mesmaPessoa` de
 * `extraction-types.ts`) para decidir se uma pessoa nova é a mesma que uma já
 * existente — de propósito, para que exista UMA única regra de identidade no
 * sistema.
 *
 * O papel do registro EXISTENTE sempre vence (o dossiê é a verdade já
 * revisada) — mas se o papel escolhido para a pessoa nova divergir, isso é
 * reportado em `conflitosDePapel` para a tela avisar o corretor, já que a
 * escolha dele foi silenciosamente descartada.
 */
export function mesclarPartes(
  existentes: ParteNegocio[],
  novas: { pessoa: PessoaExtraida; papel: PapelParte }[],
): ResultadoMesclagem {
  const out: ParteNegocio[] = existentes.map((p) => ({ ...p }))
  const conflitosDePapel: ResultadoMesclagem['conflitosDePapel'] = []
  for (const nova of novas) {
    const idx = out.findIndex((e) => {
      const r = mergeResults([
        { pessoas: [stripMeta(e)], imovel: vazioImovel() },
        { pessoas: [nova.pessoa], imovel: vazioImovel() },
      ])
      return r.pessoas.length === 1
    })
    if (idx === -1) {
      out.push({ ...nova.pessoa, _id: novoId(), papel: nova.papel })
    } else {
      // Funde os CAMPOS, mas PRESERVA _id, papel e conjuge_de do registro existente.
      const fundido = mergeResults([
        { pessoas: [stripMeta(out[idx])], imovel: vazioImovel() },
        { pessoas: [nova.pessoa], imovel: vazioImovel() },
      ]).pessoas[0]
      if (nova.papel !== out[idx].papel) {
        conflitosDePapel.push({
          nome: fundido.nome || out[idx].nome,
          papelMantido: out[idx].papel,
          papelIgnorado: nova.papel,
        })
      }
      out[idx] = {
        ...fundido,
        _id: out[idx]._id,
        papel: out[idx].papel,
        conjuge_de: out[idx].conjuge_de,
      }
    }
  }
  return { partes: out, conflitosDePapel }
}
