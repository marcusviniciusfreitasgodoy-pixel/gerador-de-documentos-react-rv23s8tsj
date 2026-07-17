import pb from '@/lib/pocketbase/client'

export type ConformidadeStatus = 'presente' | 'faltando' | 'fraco'
export type RiscoGravidade = 'alto' | 'medio' | 'baixo'
export type ValidationStatus = 'green' | 'yellow' | 'red'

export type ValidationErrorCode =
  | 'DATA_PROCESSING_ERROR'
  | 'AI_SERVICE_ERROR'
  | 'AI_CONFIG_ERROR'
  | 'KNOWLEDGE_BASE_ERROR'
  | 'UNEXPECTED_ERROR'
  | 'VALIDATION_ERROR'

export interface ConformidadeItem {
  code: string
  titulo: string
  status: ConformidadeStatus
  descricao: string
}

export interface RiscoItem {
  gravidade: RiscoGravidade
  descricao: string
  base_code: string
}

export interface RecomendacaoItem {
  texto: string
  base_code: string
}

export interface ValidarMinutaResponse {
  status: ValidationStatus
  resumo: string
  conformidade: ConformidadeItem[]
  riscos: RiscoItem[]
  recomendacoes: RecomendacaoItem[]
}

export interface ValidarMinutaErrorResponse {
  error: string
  detail?: string
  code?: ValidationErrorCode
}

export function normalizeValidationResult(raw: unknown): ValidarMinutaResponse {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Partial<ValidarMinutaResponse>
  const validStatus = (s: unknown): ValidationStatus =>
    s === 'green' || s === 'yellow' || s === 'red' ? s : 'yellow'
  const validConformidadeStatus = (s: unknown): ConformidadeStatus =>
    s === 'presente' || s === 'faltando' || s === 'fraco' ? s : 'faltando'
  const validGravidade = (g: unknown): RiscoGravidade =>
    g === 'alto' || g === 'medio' || g === 'baixo' ? g : 'baixo'
  const str = (v: unknown): string => (typeof v === 'string' ? v : '')

  return {
    status: validStatus(r.status),
    resumo: str(r.resumo),
    conformidade: Array.isArray(r.conformidade)
      ? r.conformidade.filter(Boolean).map((item) => ({
          code: str((item as Record<string, unknown>)?.code),
          titulo: str((item as Record<string, unknown>)?.titulo) || 'Sem título',
          status: validConformidadeStatus((item as Record<string, unknown>)?.status),
          descricao: str((item as Record<string, unknown>)?.descricao),
        }))
      : [],
    riscos: Array.isArray(r.riscos)
      ? r.riscos.filter(Boolean).map((item) => ({
          gravidade: validGravidade((item as Record<string, unknown>)?.gravidade),
          descricao: str((item as Record<string, unknown>)?.descricao),
          base_code: str((item as Record<string, unknown>)?.base_code),
        }))
      : [],
    recomendacoes: Array.isArray(r.recomendacoes)
      ? r.recomendacoes.filter(Boolean).map((item) => ({
          texto: str((item as Record<string, unknown>)?.texto),
          base_code: str((item as Record<string, unknown>)?.base_code),
        }))
      : [],
  }
}

export const validarMinuta = (
  documentText: string,
  documentType: string,
): Promise<ValidarMinutaResponse> =>
  pb.send('/backend/v1/validar-minuta', {
    method: 'POST',
    body: JSON.stringify({ document_text: documentText, document_type: documentType }),
    headers: { 'Content-Type': 'application/json' },
  })
