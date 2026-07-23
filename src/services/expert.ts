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
  ai_response?: string
  ai_recommends_human?: string
  escalated?: string
  escalation_message?: string
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
  formData.append('user', pb.authStore.record?.id || '')
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

// N1 — Consultar IA (Especialista Nível 1)
export const consultarIA = (requestId: string) =>
  pb.send<{ resposta: string; recomenda_humano: boolean }>('/backend/v1/consultar-ia', {
    method: 'POST',
    body: JSON.stringify({ request_id: requestId }),
    headers: { 'Content-Type': 'application/json' },
  })

// Usuário escala a solicitação para o Especialista humano (Nível 2).
// Opcionalmente envia uma mensagem de contexto e anexa documentos adicionais
// (acrescentados ao campo `attachments` existente, sem substituir os anteriores).
export const escalateRequest = (id: string, message?: string, files?: File[]) => {
  const formData = new FormData()
  formData.append('escalated', 'true')
  formData.append('escalation_message', message?.trim() || '')
  if (files && files.length > 0) {
    // O sufixo "+" no nome do campo faz o PocketBase ANEXAR os arquivos
    // (em vez de substituir) ao campo multi-arquivo `attachments`.
    files.forEach((file) => formData.append('attachments+', file))
  }
  return pb.collection('expert_support_requests').update<ExpertSupportRequest>(id, formData)
}

// ── Quem atende o corretor: credenciais da equipe ──────────────────────────
// Fica AQUI, e não nas páginas, porque duas telas leem o mesmo texto: a entrada
// do Suporte Especializado (antes de abrir o chamado) e o detalhe da solicitação
// (na hora de escalar). É redação que o Marcus revisa — duplicada em dois .tsx,
// a revisão dele viraria dois pastes e um dia as cópias divergiriam sem ninguém
// notar. Mesmo motivo do ARRAS_OPTIONS em `form-helpers`.
//
// Só texto: o ícone e a cor de cada pilar ficam na página, porque são decisão de
// layout e este arquivo é `.ts` (sem JSX).
export const ESPECIALISTA_INTRO =
  'Nosso especialista revisa seu caso para garantir a conformidade técnica, registral e ' +
  'notarial, evitando exigências e prejuízos. Mais de 40 anos de vivência no mercado ' +
  'imobiliário do Rio de Janeiro.'

export type EspecialistaPilarId = 'registral' | 'juridica' | 'legislacao' | 'mercado'

export const ESPECIALISTA_PILARES: readonly {
  id: EspecialistaPilarId
  badge: string
  titulo: string
  desc: string
}[] = [
  {
    id: 'registral',
    badge: 'Registral',
    titulo: 'Escrevente Notarial',
    desc: 'Profissional com vasta prática em registros públicos e análise de documentações complexas e matrículas.',
  },
  {
    id: 'juridica',
    badge: 'Segurança Jurídica',
    titulo: 'Prevenção de Riscos',
    desc: 'Bacharelado em Direito com foco total na elaboração segura de contratos e mitigação de futuros litígios.',
  },
  {
    id: 'legislacao',
    badge: 'Legislação',
    titulo: 'Especialização',
    desc: 'Pós-graduação específica em Direito Imobiliário, sempre atualizado com as leis e normas regulamentares.',
  },
  {
    id: 'mercado',
    badge: 'Mercado Local',
    titulo: 'Experiência Prática',
    desc: 'Conhecimento profundo das particularidades e práticas reais do mercado imobiliário do Rio de Janeiro.',
  },
]
