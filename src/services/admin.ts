import pb from '@/lib/pocketbase/client'

// Resposta do endpoint GET /backend/v1/admin/overview. Só números, contagens e
// distribuições — o hook nunca devolve registro individual nem PII.
export interface AdminOverview {
  validations: { last7Days: number; previous7Days: number }
  statusDistribution: { green: number; yellow: number; red: number }
  failureRate: number
  signups: { last7Days: number; verified: number }
  brokers: { active: number; total: number }
  openDeals: number
  legalKnowledge: { totalRules: number; categories: number; lastUpdated: string }
  aiErrors: { errorCode: string; count: number; lastOccurrence: string }[]
}

export const getAdminOverview = (): Promise<AdminOverview> =>
  pb.send('/backend/v1/admin/overview', { method: 'GET' })

// ── Usuários (gestão do piloto) ─────────────────────────────────────────────
// Lista individual de `users` e as duas ações que antes exigiam abrir o
// painel do PocketBase. Só admin passa (gate no hook admin_usuarios.js).

export interface AdminUsuario {
  id: string
  email: string
  name: string
  verified: boolean
  isAdmin: boolean
  created: string
  trial_expira_em: string
  plano: string
  plano_renova_em: string
  negocios_no_mes: number
  contador_mes: string
  plano_limite_negocios: number
}

export const listAdminUsuarios = (): Promise<{ usuarios: AdminUsuario[] }> =>
  pb.send('/backend/v1/admin/usuarios', { method: 'GET' })

export const estenderTeste = (userId: string, dias: number): Promise<{ ok: boolean }> =>
  pb.send('/backend/v1/admin/usuarios/trial', {
    method: 'POST',
    body: { user_id: userId, dias },
  })

export const carimbarPlano = (
  userId: string,
  plano: '' | 'corretor' | 'profissional' | 'imobiliaria',
  meses: 1 | 12 = 1,
): Promise<{ ok: boolean }> =>
  pb.send('/backend/v1/admin/usuarios/plano', {
    method: 'POST',
    body: { user_id: userId, plano, meses },
  })
