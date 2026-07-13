import { parseCurrency, formatCurrency, cleanCurrencyMask } from '@/lib/form-helpers'
import { formatDateLower } from '@/lib/compromisso-helpers'
import { currencyToWords } from '@/lib/currency-to-words'
import type { DistratoValues, PartyValues, AnuenteValues } from '@/lib/distratoHelpers'

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

const COMISSAO_DESTINO_TEXTO: Record<string, string> = {
  retida_corretor:
    'A comissão imobiliária já paga será retida pelo corretor intermediador, não havendo devolução',
  devolvida_pagador:
    'A comissão imobiliária será integralmente devolvida a quem a pagou, no prazo estabelecido',
  paga_especifico: 'A comissão imobiliária será paga pela parte especificada neste instrumento',
}

export function buildDistratoTemplateData(data: DistratoValues): Record<string, unknown> {
  const valorPago = data.sem_valores ? 0 : parseCurrency(data.valor_pago || '0')
  const retencao = data.sem_valores ? 0 : parseCurrency(data.retencao_valor || '0')
  const valorDevolucao = Math.max(0, valorPago - retencao)

  const docDate = new Date(data.data_documento + 'T00:00:00')
  const dataExtenso = formatDateLower(docDate)

  const contratoDate = new Date(data.contrato_originario_data + 'T00:00:00')
  const contratoDataExtenso = formatDateLower(contratoDate)

  const fmt = (v: number) => cleanCurrencyMask(formatCurrency(v))
  const extenso = (v: number) => currencyToWords(v)

  let clauseNum = 2
  const numClausulaDevolucaoValores = data.sem_valores ? null : clauseNum++
  const numClausulaDevolucaoImovel = data.tem_devolucao_imovel ? clauseNum++ : null
  const numClausulaComissao = data.tem_comissao ? clauseNum++ : null
  const numClausulaRgi = data.tem_rgi_cancelamento ? clauseNum++ : null
  const numClausulaRenuncia = data.tem_renuncia_perdas ? clauseNum++ : null
  const numClausulaDisposicoes = clauseNum

  return {
    vendedores: (data.vendedores || []).map(parteToItem),
    compradores: (data.compradores || []).map(parteToItem),
    anuentes: (data.anuentes || []).map(anuenteToItem),
    contrato_originario_tipo: data.contrato_originario_tipo || '',
    contrato_originario_data_extenso: contratoDataExtenso,
    contrato_originario_registro: data.contrato_originario_registro || '',
    imovel_descricao: data.imovel_descricao || '',
    imovel_endereco: data.imovel_endereco || '',
    imovel_bairro: data.imovel_bairro || '',
    imovel_cidade: data.imovel_cidade || '',
    imovel_uf: data.imovel_uf || '',
    imovel_cep: data.imovel_cep || '',
    imovel_matricula: data.imovel_matricula || '',
    imovel_rgi: data.imovel_rgi || '',
    imovel_iptu: data.imovel_iptu || '',
    sem_valores: !!data.sem_valores,
    valor_pago: fmt(valorPago),
    valor_pago_extenso: extenso(valorPago),
    retencao_valor: fmt(retencao),
    retencao_valor_extenso: extenso(retencao),
    valor_devolucao: fmt(valorDevolucao),
    valor_devolucao_extenso: extenso(valorDevolucao),
    forma_devolucao: data.forma_devolucao || '',
    tem_devolucao_imovel: !!data.tem_devolucao_imovel,
    tem_comissao: !!data.tem_comissao,
    tem_rgi_cancelamento: !!data.tem_rgi_cancelamento,
    tem_renuncia_perdas: !!data.tem_renuncia_perdas,
    num_clausula_devolucao_valores: numClausulaDevolucaoValores,
    num_clausula_devolucao_imovel: numClausulaDevolucaoImovel,
    num_clausula_comissao: numClausulaComissao,
    num_clausula_rgi: numClausulaRgi,
    num_clausula_renuncia: numClausulaRenuncia,
    num_clausula_disposicoes: numClausulaDisposicoes,
    comissao_destino: data.comissao_destino || 'retida_corretor',
    comissao_destino_texto:
      COMISSAO_DESTINO_TEXTO[data.comissao_destino] || COMISSAO_DESTINO_TEXTO.retida_corretor,
    comissao_beneficiario: data.comissao_beneficiario || '',
    comissao_creci: data.comissao_creci || '',
    comissao_documento: data.comissao_documento || '',
    comissao_pix: data.comissao_pix || '',
    foro_comarca: data.foro_comarca || '',
    data_extenso: dataExtenso,
    testemunha1_nome: data.testemunha1_nome || '',
    testemunha1_cpf: data.testemunha1_cpf || '',
    testemunha2_nome: data.testemunha2_nome || '',
    testemunha2_cpf: data.testemunha2_cpf || '',
  }
}
