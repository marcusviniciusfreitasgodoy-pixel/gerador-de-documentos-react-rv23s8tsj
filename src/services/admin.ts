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
