import { parseCurrency, formatCurrency, cleanCurrencyMask, trimDeep } from '@/lib/form-helpers'
import { formatDateLower } from '@/lib/compromisso-helpers'
import { currencyToWords } from '@/lib/currency-to-words'
import type { DistratoValues, PartyValues, AnuenteValues } from '@/lib/distratoHelpers'

const ORDINAIS = [
  '',
  'PRIMEIRA',
  'SEGUNDA',
  'TERCEIRA',
  'QUARTA',
  'QUINTA',
  'SEXTA',
  'SÉTIMA',
  'OITAVA',
  'NONA',
  'DÉCIMA',
  'DÉCIMA PRIMEIRA',
  'DÉCIMA SEGUNDA',
  'DÉCIMA TERCEIRA',
  'DÉCIMA QUARTA',
  'DÉCIMA QUINTA',
]

function ordinalExtenso(n: number): string {
  return ORDINAIS[n] || `${n}ª`
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

export function buildDistratoTemplateData(dataBruta: DistratoValues): Record<string, unknown> {
  // Trim de entrada (ver `trimDeep`): um " R-9 " digitado no dossiê saía
  // "registrado sob o  R-9  da referida matrícula". Aqui, e não na saída, porque
  // os valores são costurados em frases antes de virar template data.
  const data = trimDeep(dataBruta)
  const fmt = (v: number) => cleanCurrencyMask(formatCurrency(v))
  const extenso = (v: number) => currencyToWords(v)

  const semValores = !!data.sem_valores
  const temRetencao = !semValores && !!data.tem_retencao

  const valorPago = parseCurrency(data.valor_pago || '0')
  const valorRetido = temRetencao ? parseCurrency(data.retencao_valor || '0') : 0
  const valorDevolver = Math.max(valorPago - valorRetido, 0)

  const comissaoValor = parseCurrency(data.comissao_valor || '0')

  // Numeração dinâmica: 3 cláusulas fixas antes; a partir daí conta só as ativas.
  let n = 3
  const num = (active: boolean) => {
    if (active) {
      n += 1
      return ordinalExtenso(n)
    }
    return ''
  }
  const n_imovel = num(!!data.devolve_imovel)
  const n_comissao = num(!!data.trata_comissao)
  const n_baixa = num(!!data.baixa_averbacao)
  const n_quitacao = num(true)
  const n_renuncia = num(!!data.renuncia_perdas)
  const n_despesas = num(true)
  const n_lgpd = num(true)
  const n_foro = num(true)

  const docDate = new Date(data.data_documento + 'T00:00:00')
  const dataExtenso = formatDateLower(docDate)

  return {
    vendedores: (data.vendedores || []).map(parteToItem),
    compradores: (data.compradores || []).map(parteToItem),
    anuentes: (data.anuentes || []).map(anuenteToItem),

    contrato_originario_tipo: data.contrato_originario_tipo || '',
    contrato_originario_data: data.contrato_originario_data || '',
    contrato_originario_objeto: data.contrato_originario_objeto || '',

    // Acerto de valores
    sem_valores: semValores,
    valor_pago: fmt(valorPago),
    valor_pago_extenso: extenso(valorPago),
    tem_retencao: temRetencao,
    retencao_titulo: data.retencao_titulo || '',
    retencao_valor: fmt(valorRetido),
    retencao_valor_extenso: extenso(valorRetido),
    valor_devolver: fmt(valorDevolver),
    valor_devolver_extenso: extenso(valorDevolver),
    devolucao_prazo: data.devolucao_prazo || '',
    devolucao_forma: data.devolucao_forma || '',

    // Devolução do imóvel
    devolve_imovel: !!data.devolve_imovel,
    imovel_devolucao_descricao: data.imovel_devolucao_descricao || '',
    imovel_desocupacao_prazo: data.imovel_desocupacao_prazo || '',

    // Comissão
    trata_comissao: !!data.trata_comissao,
    comissao_retida: !!data.trata_comissao && data.comissao_destino === 'retida',
    comissao_devolvida: !!data.trata_comissao && data.comissao_destino === 'devolvida',
    comissao_por_conta: !!data.trata_comissao && data.comissao_destino === 'por_conta',
    comissao_valor: fmt(comissaoValor),
    comissao_valor_extenso: extenso(comissaoValor),
    comissao_corretor: data.comissao_corretor || '',
    comissao_prazo: data.comissao_prazo || '',
    comissao_responsavel: data.comissao_responsavel || '',

    // Baixa de averbação
    baixa_averbacao: !!data.baixa_averbacao,
    matricula_numero: data.matricula_numero || '',
    rgi_numero: data.rgi_numero || '',
    averbacao_custas: data.averbacao_custas || '',

    // Renúncia
    renuncia_perdas: !!data.renuncia_perdas,

    // Ordinais dinâmicos
    n_imovel,
    n_comissao,
    n_baixa,
    n_quitacao,
    n_renuncia,
    n_despesas,
    n_lgpd,
    n_foro,

    // Foro / fecho
    foro_comarca: data.foro_comarca || '',
    vias_qtd: (data.vias_qtd || '').trim() || '2 (duas)',
    cidade: data.cidade || '',
    data_extenso: dataExtenso,

    testemunha1_nome: data.testemunha1_nome || '',
    testemunha1_cpf: data.testemunha1_cpf || '',
    testemunha2_nome: data.testemunha2_nome || '',
    testemunha2_cpf: data.testemunha2_cpf || '',
  }
}
