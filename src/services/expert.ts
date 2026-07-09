import pb from '@/lib/pocketbase/client'

export type ExpertObjective =
  | 'technical_doubt'
  | 'consultative_guidance'
  | 'doc_analysis'
  | 'partial_review'
  | 'full_review'
  | 'risk_analysis'
  | 'talk_specialist'

export type ExpertUrgency = 'low' | 'medium' | 'high'

export type ExpertStatus = 'received' | 'proposal_issued' | 'accepted' | 'refused' | 'completed'

export type ComplexityType = 'standard' | 'adjusted' | 'personalized'

export type ProposalResponse = 'none' | 'accepted' | 'refused'

export interface ExpertSupportRequest {
  id: string
  user: string
  document_type?: string
  objective: ExpertObjective
  urgency: ExpertUrgency
  description: string
  attachments?: string | string[]
  status: ExpertStatus
  created: string
  updated: string
  expand?: { user?: { id: string; name?: string; email?: string } }
}

export interface ExpertProposal {
  id: string
  request: string
  scope: string
  deadline_days: number
  value: number
  complexity_type: ComplexityType
  user_response: ProposalResponse
  created: string
  updated: string
}

export const objectiveLabels: Record<ExpertObjective, string> = {
  technical_doubt: 'Dúvida Técnica',
  consultative_guidance: 'Orientação Consultiva',
  doc_analysis: 'Análise de Documentação',
  partial_review: 'Revisão Parcial de Cláusula',
  full_review: 'Revisão Completa do Contrato',
  risk_analysis: 'Análise de Risco / Compliance',
  talk_specialist: 'Falar com Especialista',
}

export const urgencyLabels: Record<ExpertUrgency, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
}

export const statusLabels: Record<ExpertStatus, string> = {
  received: 'Recebida',
  proposal_issued: 'Proposta Enviada',
  accepted: 'Aceita',
  refused: 'Recusada',
  completed: 'Concluída',
}

export const complexityLabels: Record<ComplexityType, string> = {
  standard: 'Padrão',
  adjusted: 'Ajustada',
  personalized: 'Personalizada',
}

export const statusBadgeClasses: Record<ExpertStatus, string> = {
  received: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  proposal_issued: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  accepted: 'bg-green-100 text-green-700 hover:bg-green-100',
  refused: 'bg-red-100 text-red-700 hover:bg-red-100',
  completed: 'bg-slate-200 text-slate-700 hover:bg-slate-200',
}

export const urgencyBadgeClasses: Record<ExpertUrgency, string> = {
  low: 'bg-green-100 text-green-700 hover:bg-green-100',
  medium: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  high: 'bg-red-100 text-red-700 hover:bg-red-100',
}

export const proposalResponseLabels: Record<ProposalResponse, string> = {
  none: 'Pendente',
  accepted: 'Aceita',
  refused: 'Recusada',
}

export const proposalResponseBadgeClasses: Record<ProposalResponse, string> = {
  none: 'bg-slate-100 text-slate-600 hover:bg-slate-100',
  accepted: 'bg-green-100 text-green-700 hover:bg-green-100',
  refused: 'bg-red-100 text-red-700 hover:bg-red-100',
}

export const normalizeAttachments = (attachments: string | string[] | undefined): string[] => {
  if (!attachments) return []
  return Array.isArray(attachments) ? attachments : [attachments]
}

export const getAttachmentUrl = (recordId: string, filename: string) =>
  `${pb.baseUrl}/api/files/expert_support_requests/${recordId}/${filename}`

export const listRequests = (isAdmin: boolean) => {
  const params: Record<string, unknown> = { sort: '-created', expand: 'user' }
  if (!isAdmin) {
    params.filter = `user = "${pb.authStore.record?.id}"`
  }
  return pb.collection('expert_support_requests').getFullList<ExpertSupportRequest>(params)
}

export const getRequest = (id: string) =>
  pb.collection('expert_support_requests').getOne<ExpertSupportRequest>(id, { expand: 'user' })

export const createRequest = (
  data: { document_type?: string; objective: string; urgency: string; description: string },
  files?: File[],
) => {
  const formData = new FormData()
  formData.append('document_type', data.document_type || '')
  formData.append('objective', data.objective)
  formData.append('urgency', data.urgency)
  formData.append('description', data.description)
  formData.append('status', 'received')
  if (files) {
    files.forEach((file) => formData.append('attachments', file))
  }
  return pb.collection('expert_support_requests').create<ExpertSupportRequest>(formData)
}

export const listProposals = (requestId: string) =>
  pb.collection('expert_proposals').getFullList<ExpertProposal>({
    sort: '-created',
    filter: `request = "${requestId}"`,
  })

export const createProposal = (data: {
  request: string
  scope: string
  deadline_days: number
  value: number
  complexity_type: string
}) =>
  pb
    .collection('expert_proposals')
    .create<ExpertProposal>({ ...data, user_response: 'none' })
    .then(async (proposal) => {
      await pb
        .collection('expert_support_requests')
        .update(data.request, { status: 'proposal_issued' })
      return proposal
    })

export const respondProposal = (
  proposalId: string,
  requestId: string,
  response: 'accepted' | 'refused',
) =>
  pb
    .collection('expert_proposals')
    .update<ExpertProposal>(proposalId, { user_response: response })
    .then(async () => {
      await pb.collection('expert_support_requests').update(requestId, { status: response })
    })

export const setRequestStatus = (id: string, status: ExpertStatus) =>
  pb.collection('expert_support_requests').update<ExpertSupportRequest>(id, { status })
