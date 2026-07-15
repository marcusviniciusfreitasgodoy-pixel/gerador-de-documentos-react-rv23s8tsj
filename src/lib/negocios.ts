import { toast } from 'sonner'
import pb from '@/lib/pocketbase/client'
import type {
  PessoaExtraida,
  ImovelExtraido,
  ExtracaoResult,
  PessoaRole,
} from '@/lib/extraction-types'
import { emptyImovel } from '@/lib/extraction-types'

export interface NegocioParte extends PessoaExtraida {
  id: string
  role: PessoaRole
  conjuge_de: string
}

export type NegocioImovel = ImovelExtraido

export interface Negocio {
  id: string
  owner: string
  titulo: string
  partes: NegocioParte[]
  imovel: NegocioImovel
  created: string
  updated: string
}

const ROLE_LABELS: Record<PessoaRole, string> = {
  vendedor: 'Vendedor(a)',
  comprador: 'Comprador(a)',
  anuente: 'Anuente',
  ignorar: 'Ignorar',
}

export function genId(): string {
  return `parte_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export function normalize(record: Record<string, any>): Negocio {
  const rawPartes = Array.isArray(record.partes) ? record.partes : []
  const partes: NegocioParte[] = rawPartes.map((p: any) => ({
    nome: p.nome || '',
    cpf: p.cpf || '',
    rg: p.rg || '',
    orgao_emissor: p.orgao_emissor || '',
    nacionalidade: p.nacionalidade || 'brasileiro(a)',
    estado_civil: p.estado_civil || '',
    regime_bens: p.regime_bens || '',
    profissao: p.profissao || '',
    endereco: p.endereco || '',
    email: p.email || '',
    _confianca: p._confianca || 'baixa',
    _fonte: p._fonte || 'manual',
    id: p.id || genId(),
    role: (p.role || 'ignorar') as PessoaRole,
    conjuge_de: p.conjuge_de || '',
  }))

  const rawImovel = record.imovel && typeof record.imovel === 'object' ? record.imovel : {}
  const imovel: NegocioImovel = { ...emptyImovel, ...rawImovel }

  return {
    id: record.id,
    owner: record.owner || '',
    titulo: record.titulo || '',
    partes,
    imovel,
    created: record.created || '',
    updated: record.updated || '',
  }
}

export async function listNegocios(): Promise<Negocio[]> {
  const records = await pb.collection('negocios').getFullList({ sort: '-created' })
  return records.map((r) => normalize(r as any))
}

export async function getNegocio(id: string): Promise<Negocio> {
  const record = await pb.collection('negocios').getOne(id)
  return normalize(record as any)
}

export async function createNegocio(data: { titulo: string }): Promise<Negocio> {
  const record = await pb.collection('negocios').create({
    owner: pb.authStore.record?.id,
    titulo: data.titulo,
    partes: [],
    imovel: emptyImovel,
  })
  return normalize(record as any)
}

export async function updateNegocio(
  id: string,
  data: Partial<Pick<Negocio, 'titulo' | 'partes' | 'imovel'>>,
): Promise<Negocio> {
  const updateData: Record<string, unknown> = {}
  if (data.titulo !== undefined) updateData.titulo = data.titulo
  if (data.partes !== undefined) updateData.partes = data.partes
  if (data.imovel !== undefined) updateData.imovel = data.imovel
  const record = await pb.collection('negocios').update(id, updateData)
  return normalize(record as any)
}

export async function deleteNegocio(id: string): Promise<void> {
  await pb.collection('negocios').delete(id)
}

export function mesclarPartes(
  existentes: NegocioParte[],
  novas: PessoaExtraida[],
  rolesNovas: Record<number, PessoaRole>,
): NegocioParte[] {
  const resultado = existentes.map((p) => ({ ...p }))

  novas.forEach((nova, idx) => {
    const roleNova = rolesNovas[idx] || 'ignorar'

    const existenteIdx = resultado.findIndex(
      (p) =>
        (p.cpf && nova.cpf && p.cpf === nova.cpf) ||
        (p.nome &&
          nova.nome &&
          p.nome.trim().toLowerCase() === nova.nome.trim().toLowerCase() &&
          !p.cpf &&
          !nova.cpf),
    )

    if (existenteIdx >= 0) {
      const existente = resultado[existenteIdx]
      if (roleNova !== 'ignorar' && existente.role !== 'ignorar' && existente.role !== roleNova) {
        toast.warning(
          `Conflito de papel: ${nova.nome || 'pessoa'} era ${ROLE_LABELS[existente.role]} e foi extraída como ${ROLE_LABELS[roleNova]}. Papel existente mantido.`,
        )
      }
      resultado[existenteIdx] = {
        ...nova,
        id: existente.id,
        role: existente.role !== 'ignorar' ? existente.role : roleNova,
        conjuge_de: existente.conjuge_de || '',
      }
    } else {
      resultado.push({
        ...nova,
        id: genId(),
        role: roleNova,
        conjuge_de: '',
      })
    }
  })

  return resultado
}
