import pb from '@/lib/pocketbase/client'
import { ClientResponseError } from 'pocketbase'
import type { BrokerProfile } from '@/services/broker-profile'

// ── Tipos ───────────────────────────────────────────────────────────────────

// Uma conta de imobiliária: um `users` cujo `broker_profile` tem
// tipo_perfil = 'imobiliaria'. O `user` aqui é o users.id — é o valor que entra
// no campo `agency` de `agency_members` e `negocios`.
export interface Imobiliaria {
  id: string // broker_profile.id
  user: string // users.id (este é o "agency")
  name: string // razao_social || nome_fantasia || name
  razao_social: string
  nome_fantasia: string
  cnpj: string
  creci_juridico: string
  creci_uf: string
  responsavel_nome: string
  email: string
  created: string
}

// Vínculo agency_members, com o `member` (users) expandido para exibição.
export interface AgencyMember {
  id: string // agency_members.id
  agency: string
  member: string // users.id
  status: 'ativo' | 'removido'
  termo_aceito_em: string
  created: string
  updated: string
  memberName: string
  memberEmail: string
}

// Resultado da busca por e-mail ou CRECI (admin, no fluxo de vincular corretor).
export interface BrokerCandidate {
  user: string
  name: string
  email: string
  creci: string
  creci_uf: string
}

// Resposta do endpoint GET /backend/v1/agencia/equipe (gestor da imobiliária).
export interface EquipeResumo {
  members: {
    member_id: string
    nome: string
    creci: string
    creci_uf: string
    desde: string
    negocios_count: number
    validacoes_30d: number
  }[]
  negocios: {
    id: string
    titulo: string
    owner: string
    owner_name: string
    created: string
    updated: string
  }[]
  totais: { negocios: number; validacoes_30d: number; membros_ativos: number }
}

// ── Helpers ────────────────────────────────────────────────────────────────

// broker_profile é owner-scoped, mas o admin tem leitura (migration
// 1900000026). Este helper busca o perfil de um user específico.
export async function getProfileByUser(userId: string): Promise<BrokerProfile | null> {
  try {
    return await pb
      .collection<BrokerProfile>('broker_profile')
      .getFirstListItem(`user = "${userId}"`)
  } catch {
    return null
  }
}

// Busca em lote os perfis de vários users (uma chamada, evita N getFirstListItem).
export async function getMemberProfiles(userIds: string[]): Promise<Record<string, BrokerProfile>> {
  if (!userIds.length) return {}
  try {
    const list = await pb.collection<BrokerProfile>('broker_profile').getFullList({
      filter: userIds.map((id) => `user = "${id}"`).join(' || '),
    })
    return Object.fromEntries(list.map((p) => [p.user, p]))
  } catch {
    return {}
  }
}

// ── Admin (Prime Circle): listar imobiliárias e gerenciar vínculos ───────────

export async function listImobiliarias(): Promise<Imobiliaria[]> {
  const recs = await pb.collection('broker_profile').getFullList<{
    id: string
    user: string
    name?: string
    razao_social?: string
    nome_fantasia?: string
    cnpj?: string
    creci_juridico?: string
    creci_uf?: string
    responsavel_nome?: string
    email?: string
    created: string
    expand?: { user?: { id: string; name?: string; email?: string } }
  }>({
    filter: "tipo_perfil = 'imobiliaria'",
    expand: 'user',
    sort: '-created',
  })
  return recs.map((r) => ({
    id: r.id,
    user: r.user,
    name: r.razao_social || r.nome_fantasia || r.name || r.expand?.user?.name || 'Imobiliária',
    razao_social: r.razao_social || '',
    nome_fantasia: r.nome_fantasia || '',
    cnpj: r.cnpj || '',
    creci_juridico: r.creci_juridico || '',
    creci_uf: r.creci_uf || '',
    responsavel_nome: r.responsavel_nome || '',
    email: r.email || r.expand?.user?.email || '',
    created: r.created,
  }))
}

// Membros de uma imobiliária (agency = users.id da imobiliária). O `member`
// (users) é expandido para mostrar nome/e-mail. O CRECI vem do broker_profile
// do member, buscado à parte por getMemberProfiles.
export async function listAgencyMembers(
  agencyUserId: string,
  status?: 'ativo' | 'removido',
): Promise<AgencyMember[]> {
  const filter = status
    ? `agency = "${agencyUserId}" && status = "${status}"`
    : `agency = "${agencyUserId}"`
  const recs = await pb.collection('agency_members').getFullList<{
    id: string
    agency: string
    member: string
    status: string
    termo_aceito_em: string
    created: string
    updated: string
    expand?: { member?: { id: string; name?: string; email?: string } }
  }>({
    filter,
    expand: 'member',
    sort: 'created',
  })
  return recs.map((r) => ({
    id: r.id,
    agency: r.agency,
    member: r.member,
    status: (r.status as 'ativo' | 'removido') || 'ativo',
    termo_aceito_em: r.termo_aceito_em || '',
    created: r.created,
    updated: r.updated,
    memberName: r.expand?.member?.name || r.expand?.member?.email || 'Corretor',
    memberEmail: r.expand?.member?.email || '',
  }))
}

// Busca um corretor por e-mail (users) ou CRECI (broker_profile) para o fluxo
// de vincular. Admin lê users e broker_profile de todos.
export async function searchBroker(query: string): Promise<BrokerCandidate | null> {
  const q = query.trim()
  if (!q) return null

  // 1) por e-mail (users)
  try {
    const u = await pb
      .collection('users')
      .getFirstListItem<{ id: string; name?: string; email: string }>(`email = "${q}"`)
    const prof = await getProfileByUser(u.id)
    return {
      user: u.id,
      name: prof?.nome || prof?.name || u.name || '',
      email: u.email,
      creci: prof?.creci || '',
      creci_uf: prof?.creci_uf || '',
    }
  } catch (err) {
    if (!(err instanceof ClientResponseError) || err.status !== 404) {
      // erro inesperado — não tenta CRECI, sobe
      throw err
    }
  }

  // 2) por CRECI (broker_profile)
  try {
    const p = await pb.collection('broker_profile').getFirstListItem<{
      user: string
      nome?: string
      name?: string
      creci?: string
      creci_uf?: string
      email?: string
    }>(`creci = "${q}"`)
    let email = p.email || ''
    let name = p.nome || p.name || ''
    try {
      const u = await pb.collection('users').getOne<{ email: string; name?: string }>(p.user)
      email = email || u.email
      name = name || u.name || ''
    } catch {
      // sem acesso ao user, segue com o que tem
    }
    return {
      user: p.user,
      name,
      email,
      creci: p.creci || '',
      creci_uf: p.creci_uf || '',
    }
  } catch (err) {
    if (!(err instanceof ClientResponseError) || err.status !== 404) {
      throw err
    }
  }

  return null
}

// Cria (ou reativa) um vínculo. Se já existe um row (agency, member) — mesmo
// removido — reativa em vez de criar, porque o índice único (agency, member)
// barraria o INSERT duplicado. Sempre status='ativo' + termo_aceito_em.
//
// A unicidade de "um corretor por imobiliária por vez" é garantida pelo
// índice parcial (member) WHERE status='ativo': se o corretor está ativo em
// OUTRA imobiliária, o save devolve 400 e a UI mostra o erro.
export async function vincularMember(
  agency: string,
  member: string,
  termoAceitoEm: string,
): Promise<void> {
  let existing: { id: string; status: string } | null = null
  try {
    existing = await pb
      .collection('agency_members')
      .getFirstListItem<{ id: string; status: string }>(
        `agency = "${agency}" && member = "${member}"`,
      )
  } catch (err) {
    if (!(err instanceof ClientResponseError) || err.status !== 404) {
      throw err
    }
  }

  if (existing) {
    if (existing.status === 'ativo') {
      throw new Error('Este corretor já está vinculado e ativo nesta imobiliária.')
    }
    await pb.collection('agency_members').update(existing.id, {
      status: 'ativo',
      termo_aceito_em: termoAceitoEm,
    })
    return
  }

  await pb.collection('agency_members').create({
    agency,
    member,
    status: 'ativo',
    termo_aceito_em: termoAceitoEm,
  })
}

// Remover = marcar status='removido' (nunca deletar a linha, preserva histórico).
export async function removerMember(agencyMemberId: string): Promise<void> {
  await pb.collection('agency_members').update(agencyMemberId, { status: 'removido' })
}

// ── Gestor da imobiliária: resumo da equipe ─────────────────────────────────

export const getEquipeResumo = (): Promise<EquipeResumo> =>
  pb.send('/backend/v1/agencia/equipe', { method: 'GET' })
