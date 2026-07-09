import { getErrorMessage } from '@/lib/pocketbase/errors'

export type ErrorCategory =
  | 'connection'
  | 'ai_timeout'
  | 'ai_unavailable'
  | 'parsing'
  | 'knowledge_base'
  | 'generic'

export interface CategorizedError {
  category: ErrorCategory
  message: string
}

export function categorizeValidationError(err: unknown): CategorizedError {
  const errAny = err as {
    status?: number
    response?: { error?: string; detail?: string; code?: string; message?: string }
    message?: string
    isAbort?: boolean
  }

  if (errAny?.isAbort) {
    return {
      category: 'connection',
      message: 'A requisição foi cancelada. Tente novamente.',
    }
  }

  if (errAny?.status === 0) {
    return {
      category: 'connection',
      message: 'Erro de conexão. Verifique sua internet e tente novamente.',
    }
  }

  const code = errAny?.response?.code
  const status = errAny?.status

  if (code === 'DATA_PROCESSING_ERROR') {
    return {
      category: 'parsing',
      message:
        errAny?.response?.detail ||
        errAny?.response?.error ||
        'Falha ao interpretar a resposta da IA. Tente novamente.',
    }
  }

  if (code === 'AI_SERVICE_ERROR' || status === 502) {
    return {
      category: 'ai_timeout',
      message: 'O serviço de IA demorou a responder. Tente novamente em alguns instantes.',
    }
  }

  if (code === 'AI_CONFIG_ERROR' || status === 503) {
    return {
      category: 'ai_unavailable',
      message: 'Serviço de IA temporariamente indisponível. Tente novamente mais tarde.',
    }
  }

  if (code === 'KNOWLEDGE_BASE_ERROR') {
    return {
      category: 'knowledge_base',
      message: 'Base de conhecimento indisponível. Contate o suporte.',
    }
  }

  if (errAny?.response?.error) {
    return { category: 'generic', message: errAny.response.error }
  }

  if (errAny?.response?.message) {
    return { category: 'generic', message: errAny.response.message }
  }

  if (errAny?.message) {
    return { category: 'generic', message: errAny.message }
  }

  return { category: 'generic', message: getErrorMessage(err) }
}
