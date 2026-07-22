import { parseCurrency, formatCurrency, cleanCurrencyMask, trimDeep } from '@/lib/form-helpers'
import { formatDateLower } from '@/lib/compromisso-helpers'
import { currencyToWords } from '@/lib/currency-to-words'
import type { PermutaValues, PartyValues, AnuenteValues } from '@/lib/permutaHelpers'

function cleanCreci(creci: string): string {
  if (!creci) return ''
  return creci.replace(/^CRECI\S*\s*/, '')
}

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

const PERMUTANTE_LABEL: Record<string, string> = {
  primeiro: 'PRIMEIRO(S) PERMUTANTE(S)',
  segundo: 'SEGUNDO(S) PERMUTANTE(S)',
  ambos: 'PERMUTANTES, em partes iguais',
}

export function buildPermutaTemplateData(dataBruta: PermutaValues): Record<string, unknown> {
  // Trim de entrada (ver `trimDeep`): um " R-9 " digitado no dossiê saía
  // "registrado sob o  R-9  da referida matrícula". Aqui, e não na saída, porque
  // os valores são costurados em frases antes de virar template data.
  const data = trimDeep(dataBruta)
  const fmt = (v: number) => cleanCurrencyMask(formatCurrency(v))
  const extenso = (v: number) => currencyToWords(v)

  const valorA = parseCurrency(data.valor_a || '0')
  const valorB = parseCurrency(data.valor_b || '0')
  const tornaValor = data.tem_torna ? parseCurrency(data.torna_valor || '0') : 0

  const pct = parseFloat((data.comissao_percentual || '0').replace(',', '.')) || 0
  const comissaoValor = ((valorA + valorB) * pct) / 100

  const a = data.imovel_a
  const b = data.imovel_b

  const docDate = new Date(data.data_documento + 'T00:00:00')

  return {
    primeiros: (data.primeiros || []).map(parteToItem),
    segundos: (data.segundos || []).map(parteToItem),
    anuentes: (data.anuentes || []).map(anuenteToItem),

    imovel_a_descricao: a.descricao || '',
    imovel_a_endereco: a.endereco || '',
    imovel_a_bairro: a.bairro || '',
    imovel_a_cidade: a.cidade || '',
    imovel_a_uf: a.uf || '',
    imovel_a_cep: a.cep || '',
    imovel_a_vagas_qtd: a.vagas_qtd || '',
    imovel_a_vagas_descricao: a.vagas_descricao || '',
    imovel_a_fracao_ideal: a.fracao_ideal || '',
    imovel_a_rgi: a.rgi || '',
    imovel_a_matricula: a.matricula || '',
    imovel_a_iptu: a.iptu || '',
    valor_a: fmt(valorA),
    valor_a_extenso: extenso(valorA),

    imovel_b_descricao: b.descricao || '',
    imovel_b_endereco: b.endereco || '',
    imovel_b_bairro: b.bairro || '',
    imovel_b_cidade: b.cidade || '',
    imovel_b_uf: b.uf || '',
    imovel_b_cep: b.cep || '',
    imovel_b_vagas_qtd: b.vagas_qtd || '',
    imovel_b_vagas_descricao: b.vagas_descricao || '',
    imovel_b_fracao_ideal: b.fracao_ideal || '',
    imovel_b_rgi: b.rgi || '',
    imovel_b_matricula: b.matricula || '',
    imovel_b_iptu: b.iptu || '',
    valor_b: fmt(valorB),
    valor_b_extenso: extenso(valorB),

    tem_torna: !!data.tem_torna,
    torna_a_vista: !!data.tem_torna && !data.torna_a_prazo,
    torna_a_prazo: !!data.tem_torna && !!data.torna_a_prazo,
    torna_pagador_label: PERMUTANTE_LABEL[data.torna_pagador || 'primeiro'],
    torna_valor: fmt(tornaValor),
    torna_valor_extenso: extenso(tornaValor),
    torna_forma: data.torna_forma || '',
    torna_garantia: (data.torna_garantia || '').trim(),

    arras_confirmatoria: data.arras_tipo !== 'penitencial',
    arras_penitencial: data.arras_tipo === 'penitencial',

    comissao_beneficiario: data.comissao_beneficiario || '',
    comissao_documento: data.comissao_documento || '',
    comissao_creci: cleanCreci(data.comissao_creci || ''),
    comissao_pix: data.comissao_pix || '',
    comissao_percentual: String(data.comissao_percentual || '')
      .trim()
      .replace('.', ','),
    comissao_valor: fmt(comissaoValor),
    comissao_valor_extenso: extenso(comissaoValor),
    comissao_paga_por: PERMUTANTE_LABEL[data.comissao_responsavel || 'ambos'],

    foro_comarca: data.foro_comarca || '',
    cidade: data.cidade || '',
    data_extenso: formatDateLower(docDate),

    testemunha1_nome: data.testemunha1_nome || '',
    testemunha1_cpf: data.testemunha1_cpf || '',
    testemunha2_nome: data.testemunha2_nome || '',
    testemunha2_cpf: data.testemunha2_cpf || '',
  }
}
