import { z } from 'zod'
import { currencyToWords } from '@/lib/currency-to-words'

export const ESTADO_CIVIL_OPTIONS = [
  'Solteiro(a)',
  'Casado(a)',
  'Divorciado(a)',
  'Viúvo(a)',
  'União estável',
] as const
export const REGIME_BENS_OPTIONS = [
  'Comunhão parcial',
  'Comunhão universal',
  'Separação total',
] as const
export const FORMA_PAGAMENTO_OPTIONS = ['Transferência bancária (PIX)', 'PIX', 'Cheque'] as const

export function parseCurrency(value: string): number {
  const cleaned = value
    .replace(/^R\$\s?/, '')
    .replace(/\./g, '')
    .replace(',', '.')
  return parseFloat(cleaned) || 0
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function cleanCurrencyMask(value: string): string {
  return value.replace(/^R\$\s?/, '').trim()
}

export function formatDateFull(date: Date): string {
  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]
  return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`
}

export function buildQualificacaoCivil(estadoCivil: string, regimeBens?: string): string {
  if (estadoCivil === 'Casado(a)') {
    return `casado(a) sob o regime de ${regimeBens || 'comunhão parcial'}`
  }
  return estadoCivil.toLowerCase()
}

const cpfRefine = (val: string | undefined) => !val || val.length === 14

export const formSchema = z
  .object({
    vendedor_nome: z.string().min(3, 'Nome obrigatório (mín. 3 caracteres)'),
    vendedor_nacionalidade: z.string().min(1, 'Obrigatório'),
    vendedor_estado_civil: z.string().min(1, 'Selecione o estado civil'),
    vendedor_regime_bens: z.string().optional(),
    vendedor_profissao: z.string().min(1, 'Obrigatório'),
    vendedor_rg: z.string().min(1, 'Obrigatório'),
    vendedor_cpf: z.string().length(14, 'CPF inválido'),
    vendedor_endereco: z.string().min(1, 'Obrigatório'),
    comprador_nome: z.string().min(3, 'Nome obrigatório (mín. 3 caracteres)'),
    comprador_nacionalidade: z.string().min(1, 'Obrigatório'),
    comprador_estado_civil: z.string().min(1, 'Selecione o estado civil'),
    comprador_regime_bens: z.string().optional(),
    comprador_profissao: z.string().min(1, 'Obrigatório'),
    comprador_rg: z.string().min(1, 'Obrigatório'),
    comprador_cpf: z.string().length(14, 'CPF inválido'),
    comprador_endereco: z.string().min(1, 'Obrigatório'),
    imovel_descricao: z.string().min(1, 'Obrigatório'),
    imovel_matricula: z.string().min(1, 'Obrigatório'),
    imovel_ri_numero: z.string().min(1, 'Obrigatório'),
    imovel_comarca: z.string().min(1, 'Obrigatório'),
    imovel_iptu: z.string().min(1, 'Obrigatório'),
    valor_sinal: z
      .string()
      .min(1, 'Obrigatório')
      .refine((v) => parseCurrency(v) > 0, 'Valor deve ser maior que zero'),
    valor_total: z
      .string()
      .min(1, 'Obrigatório')
      .refine((v) => parseCurrency(v) > 0, 'Valor deve ser maior que zero'),
    forma_pagamento: z.string().min(1, 'Selecione a forma de pagamento'),
    natureza_arras: z.enum(['confirmatoria', 'penitencial']),
    prazo_formalizacao_dias: z
      .string()
      .min(1, 'Obrigatório')
      .refine((v) => /^\d+$/.test(v), 'Apenas números'),
    prazo_restituicao_dias: z
      .string()
      .min(1, 'Obrigatório')
      .refine((v) => /^\d+$/.test(v), 'Apenas números'),
    foro_comarca: z.string().min(1, 'Obrigatório'),
    testemunha1_nome: z.string().optional(),
    testemunha1_cpf: z.string().optional().refine(cpfRefine, 'CPF inválido'),
    testemunha2_nome: z.string().optional(),
    testemunha2_cpf: z.string().optional().refine(cpfRefine, 'CPF inválido'),
  })
  .refine((d) => !(d.vendedor_estado_civil === 'Casado(a)' && !d.vendedor_regime_bens), {
    message: 'Obrigatório',
    path: ['vendedor_regime_bens'],
  })
  .refine((d) => !(d.comprador_estado_civil === 'Casado(a)' && !d.comprador_regime_bens), {
    message: 'Obrigatório',
    path: ['comprador_regime_bens'],
  })
  .refine((d) => parseCurrency(d.valor_sinal) <= parseCurrency(d.valor_total), {
    message: 'Sinal não pode exceder o total',
    path: ['valor_sinal'],
  })

export type FormValues = z.infer<typeof formSchema>

export function buildTemplateData(data: FormValues): Record<string, string> {
  const sinal = parseCurrency(data.valor_sinal)
  const total = parseCurrency(data.valor_total)
  const saldo = total - sinal
  const isConfirmatoria = data.natureza_arras === 'confirmatoria'

  return {
    vendedor_nome: data.vendedor_nome,
    vendedor_nacionalidade: data.vendedor_nacionalidade,
    vendedor_qualificacao_civil: buildQualificacaoCivil(
      data.vendedor_estado_civil,
      data.vendedor_regime_bens,
    ),
    vendedor_profissao: data.vendedor_profissao,
    vendedor_rg: data.vendedor_rg,
    vendedor_cpf: data.vendedor_cpf,
    vendedor_endereco: data.vendedor_endereco,
    comprador_nome: data.comprador_nome,
    comprador_nacionalidade: data.comprador_nacionalidade,
    comprador_qualificacao_civil: buildQualificacaoCivil(
      data.comprador_estado_civil,
      data.comprador_regime_bens,
    ),
    comprador_profissao: data.comprador_profissao,
    comprador_rg: data.comprador_rg,
    comprador_cpf: data.comprador_cpf,
    comprador_endereco: data.comprador_endereco,
    imovel_descricao: data.imovel_descricao,
    imovel_matricula: data.imovel_matricula,
    imovel_ri_numero: data.imovel_ri_numero,
    imovel_comarca: data.imovel_comarca,
    imovel_iptu: data.imovel_iptu,
    valor_sinal: cleanCurrencyMask(data.valor_sinal),
    valor_sinal_extenso: currencyToWords(sinal),
    valor_total: cleanCurrencyMask(data.valor_total),
    valor_total_extenso: currencyToWords(total),
    valor_saldo: cleanCurrencyMask(formatCurrency(saldo)),
    valor_saldo_extenso: currencyToWords(saldo),
    forma_pagamento_sinal: data.forma_pagamento,
    check_confirmatoria: isConfirmatoria ? '( X )' : '( )',
    check_penitencial: !isConfirmatoria ? '( X )' : '( )',
    prazo_formalizacao_dias: data.prazo_formalizacao_dias,
    prazo_restituicao_dias: data.prazo_restituicao_dias,
    foro_comarca: data.foro_comarca,
    cidade_uf: data.foro_comarca,
    data_extenso: formatDateFull(new Date()),
    testemunha1_nome: data.testemunha1_nome || '',
    testemunha1_cpf: data.testemunha1_cpf || '',
    testemunha2_nome: data.testemunha2_nome || '',
    testemunha2_cpf: data.testemunha2_cpf || '',
  }
}
