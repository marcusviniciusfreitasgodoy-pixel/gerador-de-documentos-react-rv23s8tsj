import { z } from 'zod'
import { currencyToWords } from '@/lib/currency-to-words'

export const reciboMockData: FormValues = {
  vendedor_nome: 'Carlos Eduardo Ferreira',
  vendedor_nacionalidade: 'brasileiro(a)',
  vendedor_estado_civil: 'Casado(a)',
  vendedor_regime_bens: 'Comunhão parcial',
  vendedor_profissao: 'Advogado',
  vendedor_rg: 'MG-15.234.567',
  vendedor_cpf: '123.456.789-09',
  vendedor_endereco: 'Rua das Palmeiras, 456, Jardim Botânico, Rio de Janeiro/RJ, CEP 22460-000',
  comprador_nome: 'Ana Beatriz Costa Santos',
  comprador_nacionalidade: 'brasileiro(a)',
  comprador_estado_civil: 'Solteiro(a)',
  comprador_regime_bens: '',
  comprador_profissao: 'Arquiteta',
  comprador_rg: 'RJ-20.987.654',
  comprador_cpf: '987.654.321-00',
  comprador_endereco: 'Av. das Américas, 789, Barra da Tijuca, Rio de Janeiro/RJ, CEP 22640-100',
  imovel_descricao: 'Apartamento nº 1201, Edifício Vista Mar, Torre B',
  imovel_matricula: '45.789',
  imovel_ri_numero: '6',
  imovel_comarca: 'Rio de Janeiro',
  imovel_iptu: '001.234.567-8',
  valor_sinal: 'R$ 50.000,00',
  valor_total: 'R$ 850.000,00',
  forma_pagamento: 'Transferência bancária (PIX)',
  natureza_arras: 'confirmatoria',
  prazo_formalizacao_dias: '30',
  prazo_restituicao_dias: '15',
  foro_comarca: 'Rio de Janeiro/RJ',
  testemunha1_nome: 'Pedro Alves Lima',
  testemunha1_cpf: '111.222.333-44',
  testemunha2_nome: 'Maria Fernanda Rocha',
  testemunha2_cpf: '555.666.777-88',
}

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

// ── Comissão: fonte única da conta (fase 2c) ────────────────────────────
// Os formulários calculavam com `parseFloat(pct)` — SEM tratar vírgula — enquanto
// os templates usavam `.replace(',', '.')`. Com "5,5" a tela dizia 5% e o documento
// 5,5%. O documento nunca esteve errado (o parsing dele já era o certo); quem
// divergia era a tela. Aqui a conta passa a existir num lugar só.

/** Percentual de comissão em número. Aceita vírgula BR ("5,5") e ponto ("5.5");
 *  vazio/inválido → 0. Privado por ora: só `calcComissao` é consumida. Se um dia
 *  os templates também adotarem esta fonte, é só exportar. */
function parseComissaoPct(pctRaw?: string | number): number {
  return parseFloat(String(pctRaw ?? '0').replace(',', '.')) || 0
}

/** Comissão em reais. A `base` vem PRONTA porque cada documento tem a sua: valor
 *  total (à vista, financiada, FGTS, dação), valor de venda (simplificada) ou a
 *  soma dos dois imóveis (permuta). O helper não adivinha a base. */
export function calcComissao(base: number, pctRaw?: string | number): number {
  return base * (parseComissaoPct(pctRaw) / 100)
}

// ── Trim de entrada: espaço nas pontas não pode chegar no contrato ──────
// Um " R-9 " digitado no dossiê saía "registrado sob o  R-9  da referida matrícula".
//
// Trima na ENTRADA de cada build*TemplateData, não na saída, porque os valores são
// COSTURADOS em frases antes de virar template data: `montarQualificacao` junta
// rg/cpf/endereço numa string só, e aí já é tarde — limpar as pontas do resultado
// não tira o espaço que ficou no meio ("nº  055274541 , expedido por").
//
// Só mexe em string. Booleano (iptu_rj, usa_fgts), número e Date passam intactos —
// destruturar um Date num objeto o transformaria em {}, então ele sai antes.
export function trimDeep<T>(value: T): T {
  if (typeof value === 'string') return value.trim() as T
  if (value instanceof Date) return value
  if (Array.isArray(value)) return value.map((v) => trimDeep(v)) as T
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) out[k] = trimDeep(v)
    return out as T
  }
  return value
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

export function buildTemplateData(dataBruta: FormValues): Record<string, string> {
  // Trim de entrada (ver `trimDeep`): um " R-9 " digitado no dossiê saía
  // "registrado sob o  R-9  da referida matrícula". Aqui, e não na saída, porque
  // os valores são costurados em frases antes de virar template data.
  const data = trimDeep(dataBruta)
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
    valor_sinal: cleanCurrencyMask(formatCurrency(sinal)),
    valor_sinal_extenso: currencyToWords(sinal),
    valor_total: cleanCurrencyMask(formatCurrency(total)),
    valor_total_extenso: currencyToWords(total),
    valor_saldo: cleanCurrencyMask(formatCurrency(saldo)),
    valor_saldo_extenso: currencyToWords(saldo),
    forma_pagamento: data.forma_pagamento,
    natureza_arras_texto: isConfirmatoria
      ? 'confirmatórias, nos termos dos artigos 417 a 419 do Código Civil, não havendo direito de arrependimento'
      : 'penitenciais, nos termos do artigo 420 do Código Civil, assegurado o direito de arrependimento',
    prazo_formalizacao_dias: data.prazo_formalizacao_dias,
    prazo_restituicao_dias: data.prazo_restituicao_dias,
    foro_comarca: data.foro_comarca,
    data_documento: formatDateFull(new Date()),
    testemunha1_nome: data.testemunha1_nome || '',
    testemunha1_cpf: data.testemunha1_cpf || '',
    testemunha2_nome: data.testemunha2_nome || '',
    testemunha2_cpf: data.testemunha2_cpf || '',
  }
}

// A IA de visao extrai texto livre da escritura ("casado", "comunhao parcial de
// bens na vigencia da lei 6515/77"). Os campos do formulario sao <Select> com
// opcoes FIXAS (ESTADO_CIVIL_OPTIONS / REGIME_BENS_OPTIONS). Se o valor nao bate
// exatamente com uma opcao, o Select fica vazio. Estas funcoes mapeiam o texto
// livre para a opcao correta; valor nao reconhecido volta '' (corretor escolhe).
// Usadas pelo auto-preencher (AutoPreencherDialog -> form) e pelo Dossie
// (aplicar-negocio.ts) — fonte unica de verdade.
export function normalizarEstadoCivil(v: string): string {
  const s = (v || '').toLowerCase()
  if (s.includes('casad')) return 'Casado(a)'
  if (s.includes('solteir')) return 'Solteiro(a)'
  if (s.includes('divorc')) return 'Divorciado(a)'
  if (s.includes('viúv') || s.includes('viuv')) return 'Viúvo(a)'
  if (s.includes('união') || s.includes('uniao') || s.includes('estável') || s.includes('estavel'))
    return 'União estável'
  return ''
}

export function normalizarRegime(v: string): string {
  const s = (v || '').toLowerCase()
  if (s.includes('universal')) return 'Comunhão universal'
  if (s.includes('parcial')) return 'Comunhão parcial'
  if (s.includes('separa') || s.includes('total')) return 'Separação total'
  return ''
}

// ── ARRAS ──────────────────────────────────────────────────────────────────
// A natureza das arras não é formalidade: é a engenharia de risco do contrato.
// Penitenciais limitam o prejuízo ao valor do sinal e permitem sair do negócio.
// Confirmatórias tiram o direito de arrependimento e abrem perdas e danos
// suplementares (art. 419) + execução específica — exposição sem teto.
// Por isso a consequência vai pra tela: o corretor escolhe sabendo o que troca.
// Redação conferida pelo Marcus (CRECI): o art. 420 diz "devolvê-las-á, mais o
// equivalente" — devolve o sinal E paga multa igual. "Em dobro" é jargão que
// esconde isso do corretor.
export const ARRAS_OPTIONS = [
  {
    value: 'confirmatoria',
    label: 'Confirmatórias — ninguém pode desistir',
    resumo:
      'Ninguém pode desistir. Quem descumprir responde: o comprador perde o sinal que deu; o vendedor devolve o sinal que recebeu e paga mais uma multa do mesmo valor. E não para aí — a parte inocente ainda pode cobrar perdas e danos ALÉM disso, se provar prejuízo maior, ou exigir na Justiça que o contrato seja cumprido. Arts. 417 a 419 do Código Civil.',
  },
  {
    value: 'penitencial',
    label: 'Penitenciais — as partes podem desistir',
    resumo:
      'Qualquer das partes pode desistir, e quem desiste paga por isso: o comprador perde o sinal que deu; o vendedor devolve o sinal que recebeu e paga mais uma multa do mesmo valor. E acaba aí — não cabe cobrar nada além disso, nem obrigar ninguém a assinar a escritura. Art. 420 do Código Civil.',
  },
] as const

export function getArrasResumo(value?: string): string {
  return ARRAS_OPTIONS.find((o) => o.value === value)?.resumo ?? ''
}
