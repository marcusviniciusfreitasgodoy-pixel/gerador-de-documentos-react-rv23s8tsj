import {
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  WifiOff,
  ServerCrash,
  FileQuestion,
  Clock,
  Database,
} from 'lucide-react'
import type {
  ConformidadeStatus,
  RiscoGravidade,
  ValidationStatus,
  ValidationErrorCode,
} from '@/services/validar-minuta'
import type { ErrorCategory } from '@/lib/validation-errors'

export const DOCUMENT_TYPES = [
  { value: 'Promessa/Compromisso', label: 'Promessa/Compromisso' },
  { value: 'Recibo de Sinal (Arras)', label: 'Recibo de Sinal (Arras)' },
  { value: 'Autorização de Intermediação', label: 'Autorização de Intermediação' },
  { value: 'Termo de Entrega das Chaves', label: 'Termo de Entrega das Chaves' },
  { value: 'Termo de Transmissão da Posse', label: 'Termo de Transmissão da Posse' },
  { value: 'Proposta/Reserva', label: 'Proposta/Reserva' },
  { value: 'Distrato', label: 'Distrato' },
  { value: 'Genérico/Outro', label: 'Genérico/Outro' },
]

export const conformidadeStyles: Record<
  ConformidadeStatus,
  { dot: string; label: string; text: string }
> = {
  presente: { dot: 'bg-green-500', label: 'Presente', text: 'text-green-700' },
  fraco: { dot: 'bg-yellow-500', label: 'Fraco', text: 'text-yellow-700' },
  faltando: { dot: 'bg-red-500', label: 'Faltando', text: 'text-red-700' },
}

export const statusStyles: Record<
  ValidationStatus,
  { bg: string; text: string; label: string; icon: typeof CheckCircle2 }
> = {
  green: {
    bg: 'bg-green-50 border-green-200',
    text: 'text-green-700',
    label: 'Conforme',
    icon: CheckCircle2,
  },
  yellow: {
    bg: 'bg-yellow-50 border-yellow-200',
    text: 'text-yellow-700',
    label: 'Atenção',
    icon: AlertTriangle,
  },
  red: {
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-700',
    label: 'Risco',
    icon: ShieldAlert,
  },
}

export const riscoStyles: Record<RiscoGravidade, { bg: string; text: string; label: string }> = {
  alto: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', label: 'Alto' },
  medio: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', label: 'Médio' },
  baixo: { bg: 'bg-gray-50 border-gray-200', text: 'text-gray-600', label: 'Baixo' },
}

export const errorStateConfig: Record<
  ValidationErrorCode,
  { title: string; icon: typeof AlertTriangle }
> = {
  VALIDATION_ERROR: {
    title: 'Dados do Documento Incompletos',
    icon: FileQuestion,
  },
  KNOWLEDGE_BASE_ERROR: {
    title: 'Base de Conhecimento Indisponível',
    icon: Database,
  },
  AI_CONFIG_ERROR: {
    title: 'Serviço de IA Indisponível',
    icon: ServerCrash,
  },
  AI_SERVICE_ERROR: {
    title: 'Falha na Comunicação com a IA',
    icon: WifiOff,
  },
  DATA_PROCESSING_ERROR: {
    title: 'Falha ao Interpretar Resposta da IA',
    icon: FileQuestion,
  },
  UNEXPECTED_ERROR: {
    title: 'Erro Inesperado',
    icon: AlertTriangle,
  },
}

export const errorDisplayConfig: Record<
  ErrorCategory,
  { title: string; icon: typeof AlertTriangle }
> = {
  connection: { title: 'Erro de Conexão', icon: WifiOff },
  ai_timeout: { title: 'Tempo Limite Excedido', icon: Clock },
  ai_unavailable: { title: 'Serviço Indisponível', icon: ServerCrash },
  parsing: { title: 'Falha na Análise', icon: FileQuestion },
  knowledge_base: { title: 'Base de Conhecimento', icon: Database },
  generic: { title: 'Erro na Análise', icon: AlertTriangle },
}
