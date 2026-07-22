import { parseCurrency, formatCurrency, cleanCurrencyMask, trimDeep } from '@/lib/form-helpers'
import { formatDateLower } from '@/lib/compromisso-helpers'
import { currencyToWords } from '@/lib/currency-to-words'
import type {
  ReservaPropostaValues,
  PartyValues,
  AnuenteValues,
} from '@/lib/reservaPropostaHelpers'

function cleanCreci(creci: string): string {
  if (!creci) return ''
  return creci.replace(/^CRECI\S*\s*/, '')
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

export function buildReservaPropostaTemplateData(
  dataBruta: ReservaPropostaValues,
): Record<string, unknown> {
  // Trim de entrada (ver `trimDeep`): um " R-9 " digitado no dossiê saía
  // "registrado sob o  R-9  da referida matrícula". Aqui, e não na saída, porque
  // os valores são costurados em frases antes de virar template data.
  const data = trimDeep(dataBruta)
  const valorProposto = parseCurrency(data.valor_proposto || '0')
  const valorSinal = parseCurrency(data.valor_sinal || '0')

  const docDate = new Date(data.data_documento + 'T00:00:00')
  const dataExtenso = formatDateLower(docDate)

  const fmt = (v: number) => cleanCurrencyMask(formatCurrency(v))
  const extenso = (v: number) => currencyToWords(v)

  return {
    proponentes: (data.proponentes || []).map(parteToItem),
    anuentes: (data.anuentes || []).map(anuenteToItem),
    proprietarios: (data.proprietarios || []).map(parteToItem),
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
    valor_proposto: fmt(valorProposto),
    valor_proposto_extenso: extenso(valorProposto),
    forma_pagamento: data.forma_pagamento || '',
    valor_sinal: fmt(valorSinal),
    valor_sinal_extenso: extenso(valorSinal),
    dados_recebimento: data.dados_recebimento || '',
    prazo_devolucao_dias: data.prazo_devolucao_dias || '',
    prazo_validade_dias: data.prazo_validade_dias || '',
    prazo_promessa_dias: data.prazo_promessa_dias || '',
    tem_contingencias: !!data.tem_contingencias,
    cont_financiamento: !!data.tem_contingencias && !!data.cont_financiamento,
    cont_certidoes: !!data.tem_contingencias && !!data.cont_certidoes,
    cont_vistoria: !!data.tem_contingencias && !!data.cont_vistoria,
    comissao_beneficiario: data.comissao_beneficiario || '',
    comissao_creci: cleanCreci(data.comissao_creci || ''),
    comissao_percentual: (data.comissao_percentual || '').trim(),
    comissao_paga_por: data.comissao_responsavel === 'proponente' ? 'PROPONENTES' : 'PROPRIETÁRIOS',
    comarca: data.imovel_cidade || '',
    data_extenso: dataExtenso,
    testemunha1_nome: data.testemunha1_nome || '',
    testemunha1_cpf: data.testemunha1_cpf || '',
    testemunha2_nome: data.testemunha2_nome || '',
    testemunha2_cpf: data.testemunha2_cpf || '',
  }
}
