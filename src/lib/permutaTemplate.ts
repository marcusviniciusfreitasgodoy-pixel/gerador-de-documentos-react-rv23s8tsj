import { parseCurrency, formatCurrency, cleanCurrencyMask } from '@/lib/form-helpers'
import { formatDateLower } from '@/lib/compromisso-helpers'
import { currencyToWords } from '@/lib/currency-to-words'
import type { PermutaValues, PartyValues, AnuenteValues } from '@/lib/permutaHelpers'

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

export function buildPermutaTemplateData(data: PermutaValues): Record<string, unknown> {
  const fmt = (v: number) => cleanCurrencyMask(formatCurrency(v))
  const extenso = (v: number) => currencyToWords(v)

  const valorA = parseCurrency(data.valor_a)
  const valorB = parseCurrency(data.valor_b)
  const valorTotal = valorA + valorB

  const comissaoPercentual = parseFloat(data.comissao_percentual) || 0
  const comissaoValor = (valorTotal * comissaoPercentual) / 100

  const hasTorna = !!data.has_torna
  const tornaValor = hasTorna ? parseCurrency(data.torna_valor || '0') : 0

  const tornaDevedorPrimeiros = hasTorna && data.torna_devedor === 'Primeiros Permutantes'
  const tornaDevedorSegundos = hasTorna && data.torna_devedor === 'Segundos Permutantes'

  const docDate = new Date(data.data_documento + 'T00:00:00')
  const dataExtenso = formatDateLower(docDate)

  return {
    primeiros: (data.primeiros || []).map(parteToItem),
    segundos: (data.segundos || []).map(parteToItem),
    anuentes: (data.anuentes || []).map(anuenteToItem),

    imovel_a_descricao: data.imovel_a_descricao || '',
    imovel_a_endereco: data.imovel_a_endereco || '',
    imovel_a_matricula: data.imovel_a_matricula || '',
    imovel_a_rgi: data.imovel_a_rgi || '',
    imovel_a_iptu: data.imovel_a_iptu || '',
    valor_a: fmt(valorA),
    valor_a_extenso: extenso(valorA),

    imovel_b_descricao: data.imovel_b_descricao || '',
    imovel_b_endereco: data.imovel_b_endereco || '',
    imovel_b_matricula: data.imovel_b_matricula || '',
    imovel_b_rgi: data.imovel_b_rgi || '',
    imovel_b_iptu: data.imovel_b_iptu || '',
    valor_b: fmt(valorB),
    valor_b_extenso: extenso(valorB),

    has_torna: hasTorna,
    torna_valor: fmt(tornaValor),
    torna_valor_extenso: extenso(tornaValor),
    torna_devedor: data.torna_devedor || '',
    torna_devedor_primeiros: tornaDevedorPrimeiros,
    torna_devedor_segundos: tornaDevedorSegundos,
    torna_forma_pagamento: data.torna_forma_pagamento || '',
    torna_prazo: data.torna_prazo || '',
    torna_garantia: data.torna_garantia || '',

    comissao_percentual: data.comissao_percentual || '',
    comissao_valor: fmt(comissaoValor),
    comissao_valor_extenso: extenso(comissaoValor),
    comissao_beneficiario: data.comissao_beneficiario || '',
    comissao_documento: data.comissao_documento || '',
    comissao_creci: data.comissao_creci || '',
    comissao_pix: data.comissao_pix || '',

    foro_comarca: data.foro_comarca || '',
    cidade: data.cidade || '',
    data_extenso: dataExtenso,

    testemunha1_nome: data.testemunha1_nome || '',
    testemunha1_cpf: data.testemunha1_cpf || '',
    testemunha2_nome: data.testemunha2_nome || '',
    testemunha2_cpf: data.testemunha2_cpf || '',
  }
}
