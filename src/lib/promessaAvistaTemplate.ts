import { parseCurrency, formatCurrency, cleanCurrencyMask } from '@/lib/form-helpers'
import { formatDateLower } from '@/lib/compromisso-helpers'
import { currencyToWords } from '@/lib/currency-to-words'
import type { PromessaAvistaValues, PartyValues, AnuenteValues } from '@/lib/promessaAvistaHelpers'

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

// Monta tudo o que vem APÓS o nome na qualificação de uma parte.
function montarQualificacao(p: PartyValues): string {
  const regime =
    p.estado_civil === 'Casado(a)' && p.regime_bens ? `, sob o regime de ${p.regime_bens}` : ''
  return (
    `${p.nacionalidade || ''}, ${p.estado_civil || ''}${regime}, ${p.profissao || ''}, ` +
    `portador(a) do documento de identidade nº ${p.rg || ''}, expedido por ${p.orgao_emissor || ''}, ` +
    `inscrito(a) no CPF sob o nº ${p.cpf || ''}, residente e domiciliado(a) em ${p.endereco || ''}`
  )
}

function parteToItem(p: PartyValues) {
  return { nome: p.nome || '', qualificacao: montarQualificacao(p), cpf: p.cpf || '' }
}

function anuenteToItem(a: AnuenteValues) {
  return {
    conjuge_de: a.conjuge_de || '',
    nome: a.nome || '',
    qualificacao: montarQualificacao(a),
    cpf: a.cpf || '',
  }
}

export function buildPromessaAvistaTemplateData(
  data: PromessaAvistaValues,
): Record<string, unknown> {
  const valorTotal = parseCurrency(data.valor_total || '0')
  const valorSinal = parseCurrency(data.valor_sinal || '0')
  const valorReforco = parseCurrency(data.valor_reforco || '0')
  const valorSaldo = Math.max(0, valorTotal - valorSinal - valorReforco)

  const comissaoPct = parseFloat(data.comissao_percentual || '0') || 0
  const comissaoValor = valorTotal * (comissaoPct / 100)

  const docDate = new Date(data.data_documento + 'T00:00:00')
  const dataExtenso = formatDateLower(docDate)

  const fmt = (v: number) => cleanCurrencyMask(formatCurrency(v))
  const extenso = (v: number) => currencyToWords(v)

  return {
    vendedores: (data.vendedores || []).map(parteToItem),
    anuentes: (data.anuentes || []).map(anuenteToItem),
    compradores: (data.compradores || []).map(parteToItem),
    imovel_descricao: data.imovel_descricao || '',
    imovel_endereco: data.imovel_endereco || '',
    imovel_bairro: data.imovel_bairro || '',
    imovel_cidade: data.imovel_cidade || '',
    imovel_uf: data.imovel_uf || '',
    foro_comarca: data.foro_comarca || data.imovel_cidade || '',
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
    valor_sinal: fmt(valorSinal),
    valor_sinal_extenso: extenso(valorSinal),
    valor_reforco: fmt(valorReforco),
    valor_reforco_extenso: extenso(valorReforco),
    valor_saldo: fmt(valorSaldo),
    valor_saldo_extenso: extenso(valorSaldo),
    forma_pagamento: data.forma_pagamento || '',
    dados_recebimento: limparDestino(data.dados_recebimento || ''),
    prazo_certidoes_dias: data.prazo_certidoes_dias || '',
    prazo_reforco: formatDatePtBr(data.prazo_reforco || ''),
    data_limite_escritura: formatDatePtBr(data.data_limite_escritura || ''),
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
