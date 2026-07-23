import {
  parseCurrency,
  formatCurrency,
  cleanCurrencyMask,
  limparNumeroRedundante,
  trimDeep,
} from '@/lib/form-helpers'
import { currencyToWords } from '@/lib/currency-to-words'
import {
  formatDateLower,
  buildRegimeSuffix,
  type CompromissoValues,
} from '@/lib/compromisso-helpers'

export function buildCompromissoTemplateData(dataBruta: CompromissoValues): Record<string, string> {
  // Trim de entrada (ver `trimDeep`): um " R-9 " digitado no dossiê saía
  // "registrado sob o  R-9  da referida matrícula". Aqui, e não na saída, porque
  // os valores são costurados em frases antes de virar template data.
  const data = trimDeep(dataBruta)
  const total = parseCurrency(data.valor_total)
  const sinal = parseCurrency(data.valor_sinal)
  const reforco = parseCurrency(data.valor_reforco || '')
  const saldo = Math.max(0, total - sinal - reforco)
  const comissaoPct = parseFloat(data.comissao_percentual) || 0
  const comissaoValor = total * (comissaoPct / 100)

  const fmt = (v: number) => cleanCurrencyMask(formatCurrency(v))
  const words = (v: number) => currencyToWords(v)

  const intervenienteBlock = data.has_interveniente
    ? `Intervém no presente instrumento, como INTERVENIENTE ANUENTE, ${data.interveniente_nome || ''}, ${data.interveniente_nacionalidade || ''}, ${data.interveniente_estado_civil || ''}${buildRegimeSuffix(data.interveniente_estado_civil || '', data.interveniente_regime_bens)}, ${data.interveniente_profissao || ''}, portador(a) do RG nº ${data.interveniente_rg || ''} (${data.interveniente_orgao_emissor || ''}), inscrito(a) no CPF/CNPJ sob o nº ${data.interveniente_cpf || ''}, residente e domiciliado(a) em ${data.interveniente_endereco || ''}, na qualidade de ${data.interveniente_relacao || ''}, que concorda com todos os termos e condições aqui estabelecidos.`
    : ''

  const intervenienteSignature = data.has_interveniente
    ? `___________________________________\nINTERVENIENTE ANUENTE — ${data.interveniente_nome || ''} — CPF: ${data.interveniente_cpf || ''}`
    : ''

  const arrasText =
    data.tipo_arras === 'confirmatoria'
      ? 'As partes ajustam que as arras ora pactuadas têm natureza CONFIRMATÓRIA, nos termos dos artigos 417 a 419 do Código Civil. Em caso de inexecução por parte do COMPRADOR, o VENDEDOR poderá reter o sinal; se a inexecução for por parte do VENDEDOR, este devolverá o sinal em dobro, podendo, em qualquer caso, a parte inocente exigir indenização suplementar se provar maior prejuízo, ou exigir a execução do contrato com perdas e danos.'
      : 'As partes ajustam que as arras ora pactuadas têm natureza PENITENCIAL, nos termos do artigo 420 do Código Civil, estipulando expressamente o direito de arrependimento. Quem deu as arras e se arrepender as perde; quem as recebeu e se arrepender as devolve em dobro. Em ambos os casos, não haverá direito a indenização suplementar.'

  const docDate = new Date(data.data_documento + 'T00:00:00')

  return {
    vendedor_nome: data.vendedor_nome,
    vendedor_nacionalidade: data.vendedor_nacionalidade,
    vendedor_qualificacao_civil:
      data.vendedor_estado_civil +
      buildRegimeSuffix(data.vendedor_estado_civil, data.vendedor_regime_bens),
    vendedor_profissao: data.vendedor_profissao,
    vendedor_rg: data.vendedor_rg,
    vendedor_orgao_emissor: data.vendedor_orgao_emissor,
    vendedor_cpf: data.vendedor_cpf,
    vendedor_endereco: data.vendedor_endereco,
    vendedor_email: data.vendedor_email || '',
    comprador_nome: data.comprador_nome,
    comprador_nacionalidade: data.comprador_nacionalidade,
    comprador_qualificacao_civil:
      data.comprador_estado_civil +
      buildRegimeSuffix(data.comprador_estado_civil, data.comprador_regime_bens),
    comprador_profissao: data.comprador_profissao,
    comprador_rg: data.comprador_rg,
    comprador_orgao_emissor: data.comprador_orgao_emissor,
    comprador_cpf: data.comprador_cpf,
    comprador_endereco: data.comprador_endereco,
    comprador_email: data.comprador_email || '',
    interveniente_block: intervenienteBlock,
    interveniente_signature: intervenienteSignature,
    imovel_descricao: data.imovel_descricao,
    imovel_endereco: data.imovel_endereco,
    imovel_bairro: data.imovel_bairro || '',
    imovel_cidade: data.imovel_cidade,
    imovel_uf: data.imovel_uf,
    imovel_cep: data.imovel_cep || '',
    imovel_vagas_qtd: data.imovel_vagas_qtd || '',
    imovel_vagas_descricao: data.imovel_vagas_descricao || '',
    imovel_fracao_ideal: data.imovel_fracao_ideal || '',
    imovel_rgi: data.imovel_rgi || '',
    imovel_matricula: data.imovel_matricula,
    // O documento já escreve o "nº" antes deste valor; um "FRE nº 3.085.078-8"
    // gravado no dossiê saía "inscrição municipal nº FRE nº 3.085.078-8".
    imovel_iptu: limparNumeroRedundante(data.imovel_iptu || ''),
    imovel_origem_aquisicao: data.imovel_origem_aquisicao || '',
    imovel_origem_registro: data.imovel_origem_registro || '',
    valor_total: fmt(total),
    valor_total_extenso: words(total),
    valor_sinal: fmt(sinal),
    valor_sinal_extenso: words(sinal),
    valor_reforco: fmt(reforco),
    valor_reforco_extenso: words(reforco),
    valor_saldo: fmt(saldo),
    valor_saldo_extenso: words(saldo),
    comissao_beneficiario: data.comissao_beneficiario || '',
    comissao_documento: data.comissao_documento || '',
    comissao_creci: data.comissao_creci || '',
    comissao_pix: data.comissao_pix || '',
    comissao_percentual: data.comissao_percentual,
    comissao_valor: fmt(comissaoValor),
    comissao_valor_extenso: words(comissaoValor),
    prazo_certificado: data.prazo_certificado,
    prazo_reforco_texto: data.prazo_reforco_texto || '',
    prazo_escritura: data.prazo_escritura,
    data_documento_extenso: formatDateLower(docDate),
    tipo_arras_texto: arrasText,
    testemunha1_nome: data.testemunha1_nome || '',
    testemunha1_cpf: data.testemunha1_cpf || '',
    testemunha2_nome: data.testemunha2_nome || '',
    testemunha2_cpf: data.testemunha2_cpf || '',
    cidade_uf: `${data.imovel_cidade}/${data.imovel_uf}`,
  }
}
