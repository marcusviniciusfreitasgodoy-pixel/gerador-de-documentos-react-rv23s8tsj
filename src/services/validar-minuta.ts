import pb from '@/lib/pocketbase/client'

export type ConformidadeStatus = 'presente' | 'faltando' | 'fraco'
export type RiscoGravidade = 'alto' | 'medio' | 'baixo'
export type ValidationStatus = 'green' | 'yellow' | 'red'

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

export const validarMinuta = (
  documentText: string,
  documentType: string,
): Promise<ValidarMinutaResponse> =>
  pb.send('/backend/v1/validar-minuta', {
    method: 'POST',
    body: JSON.stringify({ document_text: documentText, document_type: documentType }),
    headers: { 'Content-Type': 'application/json' },
  })
