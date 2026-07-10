import { parseCurrency, formatCurrency, cleanCurrencyMask } from '@/lib/form-helpers'
import { buildRegimeSuffix, formatDateLower } from '@/lib/compromisso-helpers'
import { currencyToWords } from '@/lib/currency-to-words'
import type { PromessaFinanciadaValues } from '@/lib/promessaFinanciadaHelpers'

function formatDatePtBr(isoDate: string): string {
  if (!isoDate) return ''
  const [y, m, d] = isoDate.split('-')
  return `${d}/${m}/${y}`
}

function cleanCreci(creci: string): string {
  if (!creci) return ''
  return creci.replace(/^CRECI\S*\s*/, '')
}

function limparDestino(value: string): string {
  if (!value) return ''
  return value.replace(/^\s*(PIX|TED|Transferência)\s*(para)?\s*/i, '')
}

function prefixarDocumento(value: string): string {
  if (!value) return ''
  const trimmed = value.trim()
  if (/^CPF/i.test(trimmed) || /^CNPJ/i.test(trimmed)) {
    return trimmed
  }
  const digits = trimmed.replace(/\D/g, '')
  if (digits.length === 11) {
    return `CPF nº ${trimmed}`
  }
  if (digits.length === 14) {
    return `CNPJ nº ${trimmed}`
  }
  return trimmed
}

export function buildPromessaFinanciadaTemplateData(
  data: PromessaFinanciadaValues,
): Record<string, string | boolean> {
  const valorTotal = parseCurrency(data.valor_total || '0')
  const valorEntrada = parseCurrency(data.valor_entrada || '0')
  const valorReforco = parseCurrency(data.valor_reforco || '0')
  const valorFinanciamento = parseCurrency(data.valor_financiamento || '0')
  const valorDivida = parseCurrency(data.valor_divida || '0')
  const valorFgts = parseCurrency(data.valor_fgts || '0')

  const comissaoPct = parseFloat(data.comissao_percentual || '0') || 0
  const comissaoValor = valorTotal * (comissaoPct / 100)

  const compradorRegimeSufixo = buildRegimeSuffix(
    data.comprador_estado_civil,
    data.comprador_regime_bens,
  )
  const intervenienteRegimeSufixo = buildRegimeSuffix(
    data.interveniente_estado_civil || '',
    data.interveniente_regime_bens,
  )

  const docDate = new Date(data.data_documento + 'T00:00:00')
  const dataExtenso = formatDateLower(docDate)

  const fmt = (v: number) => cleanCurrencyMask(formatCurrency(v))
  const extenso = (v: number) => currencyToWords(v)

  return {
    vendedor_nome: data.vendedor_nome || '',
    vendedor_nacionalidade: data.vendedor_nacionalidade || '',
    vendedor_estado_civil: data.vendedor_estado_civil || '',
    vendedor_regime_bens: data.vendedor_regime_bens || '',
    vendedor_profissao: data.vendedor_profissao || '',
    vendedor_rg: data.vendedor_rg || '',
    vendedor_orgao_emissor: data.vendedor_orgao_emissor || '',
    vendedor_cpf: data.vendedor_cpf || '',
    vendedor_endereco: data.vendedor_endereco || '',
    vendedor_email: data.vendedor_email || '',
    vendedor_casado: data.vendedor_estado_civil === 'Casado(a)',
    tem_interveniente: data.has_interveniente,
    interveniente_nome: data.interveniente_nome || '',
    interveniente_nacionalidade: data.interveniente_nacionalidade || '',
    interveniente_estado_civil: data.interveniente_estado_civil || '',
    interveniente_regime_sufixo: intervenienteRegimeSufixo,
    interveniente_profissao: data.interveniente_profissao || '',
    interveniente_rg: data.interveniente_rg || '',
    interveniente_orgao_emissor: data.interveniente_orgao_emissor || '',
    interveniente_cpf: data.interveniente_cpf || '',
    interveniente_endereco: data.interveniente_endereco || '',
    interveniente_email: data.interveniente_email || '',
    interveniente_relacao: data.interveniente_relacao || '',
    comprador_nome: data.comprador_nome || '',
    comprador_nacionalidade: data.comprador_nacionalidade || '',
    comprador_estado_civil: data.comprador_estado_civil || '',
    comprador_regime_sufixo: compradorRegimeSufixo,
    comprador_profissao: data.comprador_profissao || '',
    comprador_rg: data.comprador_rg || '',
    comprador_orgao_emissor: data.comprador_orgao_emissor || '',
    comprador_cpf: data.comprador_cpf || '',
    comprador_endereco: data.comprador_endereco || '',
    comprador_email: data.comprador_email || '',
    imovel_descricao: data.imovel_descricao || '',
    imovel_endereco: data.imovel_endereco || '',
    imovel_bairro: data.imovel_bairro || '',
    imovel_cidade: data.imovel_cidade || '',
    imovel_uf: data.imovel_uf || '',
    imovel_cep: data.imovel_cep || '',
    imovel_vagas_qtd: data.imovel_vagas_qtd || '',
    imovel_vagas_descricao: data.imovel_vagas_descricao || '',
    imovel_fracao_ideal: data.imovel_fracao_ideal || '',
    imovel_rgi: data.imovel_rgi || '',
    imovel_matricula: data.imovel_matricula || '',
    imovel_iptu: data.imovel_iptu || '',
    imovel_origem_aquisicao: data.imovel_origem_aquisicao || '',
    imovel_origem_registro: data.imovel_origem_registro || '',
    valor_total: fmt(valorTotal),
    valor_total_extenso: extenso(valorTotal),
    valor_entrada: fmt(valorEntrada),
    valor_entrada_extenso: extenso(valorEntrada),
    entrada_parcelada: data.entrada_parcelada,
    valor_reforco: fmt(valorReforco),
    valor_reforco_extenso: extenso(valorReforco),
    prazo_reforco: formatDatePtBr(data.prazo_reforco || ''),
    valor_financiamento: fmt(valorFinanciamento),
    valor_financiamento_extenso: extenso(valorFinanciamento),
    instituicao_financeira: data.instituicao_financeira || '',
    prazo_financiamento: data.prazo_financiamento || '',
    prazo_liberacao: data.prazo_liberacao || '',
    quita_divida_existente: data.quita_divida_existente,
    credor_divida: data.credor_divida || '',
    valor_divida: fmt(valorDivida),
    valor_divida_extenso: extenso(valorDivida),
    usa_fgts: data.usa_fgts,
    valor_fgts: fmt(valorFgts),
    valor_fgts_extenso: extenso(valorFgts),
    forma_pagamento: data.forma_pagamento || '',
    dados_recebimento: limparDestino(data.dados_recebimento || ''),
    prazo_certidoes_dias: data.prazo_certidoes_dias || '',
    comissao_beneficiario: data.comissao_beneficiario || '',
    comissao_documento: prefixarDocumento(data.comissao_documento || ''),
    comissao_creci: cleanCreci(data.comissao_creci || ''),
    comissao_pix: data.comissao_pix || '',
    comissao_percentual: data.comissao_percentual || '',
    comissao_paga_por: data.comissao_responsavel === 'comprador' ? 'COMPRADORES' : 'VENDEDORES',
    comissao_valor: fmt(comissaoValor),
    comissao_valor_extenso: extenso(comissaoValor),
    arras_confirmatoria: data.tipo_arras === 'confirmatoria',
    arras_penitencial: data.tipo_arras === 'penitencial',
    data_extenso: dataExtenso,
    testemunha1_nome: data.testemunha1_nome || '',
    testemunha1_cpf: data.testemunha1_cpf || '',
    testemunha2_nome: data.testemunha2_nome || '',
    testemunha2_cpf: data.testemunha2_cpf || '',
  }
}
