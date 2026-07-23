import {
  parseCurrency,
  formatCurrency,
  cleanCurrencyMask,
  limparNumeroRedundante,
  trimDeep,
} from '@/lib/form-helpers'
import { formatDateLower } from '@/lib/compromisso-helpers'
import { currencyToWords } from '@/lib/currency-to-words'
import type {
  PromessaFinanciadaValues,
  PartyValues,
  AnuenteValues,
} from '@/lib/promessaFinanciadaHelpers'

// IPTU-RJ (TRI003): a clausula de atualizacao cadastral do IPTU so se aplica a
// imovel no MUNICIPIO do Rio de Janeiro. Normaliza acento, caixa e o sufixo "/RJ"
// antes de comparar, para "Rio de Janeiro", "Rio de Janeiro/RJ" etc. casarem.
function isMunicipioRio(cidade?: string): boolean {
  if (!cidade) return false
  const norm = cidade
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\/.*$/, '')
    .replace(/\s+/g, ' ')
    .trim()
  return norm === 'rio de janeiro'
}

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

// Monta tudo o que vem APÓS o nome na qualificação de uma parte (inclui e-mail quando houver).
// O sufixo "doravante denominado(a) VENDEDOR/COMPRADOR" fica no template (texto fixo do loop).
function montarQualificacao(p: PartyValues): string {
  const regime =
    p.estado_civil === 'Casado(a)' && p.regime_bens ? `, sob o regime de ${p.regime_bens}` : ''
  const email = p.email ? `, e-mail ${p.email}` : ''
  return (
    `${p.nacionalidade || ''}, ${p.estado_civil || ''}${regime}, ${p.profissao || ''}, ` +
    `portador(a) do documento de identidade nº ${p.rg || ''}, expedido por ${p.orgao_emissor || ''}, ` +
    `inscrito(a) no CPF sob o nº ${p.cpf || ''}, residente e domiciliado(a) em ${p.endereco || ''}${email}`
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

export function buildPromessaFinanciadaTemplateData(
  dataBruta: PromessaFinanciadaValues,
): Record<string, unknown> {
  // Trim de entrada (ver `trimDeep`): um " R-9 " digitado no dossiê saía
  // "registrado sob o  R-9  da referida matrícula". Aqui, e não na saída, porque
  // os valores são costurados em frases antes de virar template data.
  const data = trimDeep(dataBruta)
  const valorTotal = parseCurrency(data.valor_total || '0')
  const valorEntrada = parseCurrency(data.valor_entrada || '0')
  const valorReforco = parseCurrency(data.valor_reforco || '0')
  const valorFinanciamento = parseCurrency(data.valor_financiamento || '0')
  const valorDivida = parseCurrency(data.valor_divida || '0')
  const valorFgts = parseCurrency(data.valor_fgts || '0')

  // A2: o corretor digita "5,5" e o parseFloat parava na virgula -> 5 (perdia
  // 0,5% de comissao). Normaliza a virgula decimal BR antes de converter.
  const comissaoPct = parseFloat(String(data.comissao_percentual || '0').replace(',', '.')) || 0
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
    // O documento já escreve o "nº" antes deste valor; um "FRE nº 3.085.078-8"
    // gravado no dossiê saía "inscrição municipal nº FRE nº 3.085.078-8".
    imovel_iptu: limparNumeroRedundante(data.imovel_iptu || ''),
    // IPTU-RJ: liga a clausula TRI003 so quando o imovel e no municipio do Rio.
    iptu_rj: isMunicipioRio(data.imovel_cidade),
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
    // Bonus Onda 1: o campo e <Input type="number">, entao o browser guarda
    // "5.5" com PONTO e o contrato saia "no percentual de 5.5%". Em documento
    // brasileiro o decimal e virgula.
    comissao_percentual: String(data.comissao_percentual || '').replace('.', ','),
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
