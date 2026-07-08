import {
  parseCurrency,
  formatCurrency,
  cleanCurrencyMask,
  formatDateFull,
} from '@/lib/form-helpers'
import { buildRegimeSuffix } from '@/lib/compromisso-helpers'
import { currencyToWords } from '@/lib/currency-to-words'
import type { PromessaAvistaValues } from '@/lib/promessaAvistaHelpers'

export function buildPromessaAvistaTemplateData(
  data: PromessaAvistaValues,
): Record<string, string> {
  const valorTotal = parseCurrency(data.valor_total || '0')
  const valorSinal = parseCurrency(data.valor_sinal || '0')
  const valorReforco = parseCurrency(data.valor_reforco || '0')
  const valorSaldo = Math.max(0, valorTotal - valorSinal - valorReforco)

  const comissaoPct = parseFloat(data.comissao_percentual || '0') || 0
  const comissaoValor = valorTotal * (comissaoPct / 100)

  const vendedorRegimeSufixo = buildRegimeSuffix(
    data.vendedor_estado_civil,
    data.vendedor_regime_bens,
  )
  const compradorRegimeSufixo = buildRegimeSuffix(
    data.comprador_estado_civil,
    data.comprador_regime_bens,
  )
  const intervenienteRegimeSufixo = buildRegimeSuffix(
    data.interveniente_estado_civil || '',
    data.interveniente_regime_bens,
  )

  const blocoIntervenienteAnuente =
    data.has_interveniente && data.interveniente_nome
      ? `INTERVENIENTE ANUENTE: ${data.interveniente_nome}, ${data.interveniente_nacionalidade || ''}, ${data.interveniente_estado_civil || ''}${intervenienteRegimeSufixo}, ${data.interveniente_profissao || ''}, portador(a) do RG nº ${data.interveniente_rg || ''} (${data.interveniente_orgao_emissor || ''}), inscrito(a) no CPF/CNPJ sob o nº ${data.interveniente_cpf || ''}, residente e domiciliado(a) em ${data.interveniente_endereco || ''}, e-mail: ${data.interveniente_email || ''}, na qualidade de ${data.interveniente_relacao || 'interveniente anuente'}.`
      : ''

  const blocoAssinaturaInterveniente =
    data.has_interveniente && data.interveniente_nome
      ? `___________________________________\nINTERVENIENTE ANUENTE — ${data.interveniente_nome} — CPF: ${data.interveniente_cpf || ''}`
      : ''

  const clausulaArras =
    data.tipo_arras === 'penitencial'
      ? 'As partes estipulam arras penitenciais, conforme o art. 420 do Código Civil, pelo que poderão ambas as partes retratar-se do compromisso, perdendo o COMPRADOR o sinal pago, ou restituindo o VENDEDOR o sinal em dobro.'
      : 'As partes estipulam arras confirmatórias, nos termos dos arts. 417 a 419 do Código Civil, que serão imputadas no preço total ajustado, não facultando o arrependimento de nenhuma das partes.'

  const cidadeUf = `${data.imovel_cidade}/${data.imovel_uf}`

  const dataDocumentoExtenso = data.data_documento ? formatDateFull(data.data_documento) : ''

  const fmt = (v: number) => cleanCurrencyMask(formatCurrency(v))
  const extenso = (v: number) => currencyToWords(v)

  const comissaoResponsavelDisplay =
    data.comissao_responsavel === 'vendedor' ? 'VENDEDOR' : 'COMPRADOR'

  return {
    vendedor_nome: data.vendedor_nome || '',
    vendedor_nacionalidade: data.vendedor_nacionalidade || '',
    vendedor_estado_civil: data.vendedor_estado_civil || '',
    vendedor_regime_sufixo: vendedorRegimeSufixo,
    vendedor_profissao: data.vendedor_profissao || '',
    vendedor_rg: data.vendedor_rg || '',
    vendedor_orgao_emissor: data.vendedor_orgao_emissor || '',
    vendedor_cpf: data.vendedor_cpf || '',
    vendedor_endereco: data.vendedor_endereco || '',
    vendedor_email: data.vendedor_email || '',
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
    bloco_interveniente_anuente: blocoIntervenienteAnuente,
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
    valor_sinal: fmt(valorSinal),
    valor_sinal_extenso: extenso(valorSinal),
    valor_reforco: fmt(valorReforco),
    valor_reforco_extenso: extenso(valorReforco),
    valor_saldo: fmt(valorSaldo),
    valor_saldo_extenso: extenso(valorSaldo),
    forma_pagamento: data.forma_pagamento || '',
    dados_pagamento: data.dados_pagamento || '',
    clausula_arras: clausulaArras,
    comissao_beneficiario: data.comissao_beneficiario || '',
    comissao_documento: data.comissao_documento || '',
    comissao_creci: data.comissao_creci || '',
    comissao_pix: data.comissao_pix || '',
    comissao_percentual: data.comissao_percentual || '',
    comissao_valor: fmt(comissaoValor),
    comissao_valor_extenso: extenso(comissaoValor),
    comissao_responsavel: comissaoResponsavelDisplay,
    prazo_certificado: data.prazo_certificado || '',
    prazo_reforco: data.prazo_reforco || '',
    data_escritura: data.data_escritura || '',
    cidade_uf: cidadeUf,
    data_documento_extenso: dataDocumentoExtenso,
    bloco_assinatura_interveniente: blocoAssinaturaInterveniente,
    testemunha1_nome: data.testemunha1_nome || '',
    testemunha1_cpf: data.testemunha1_cpf || '',
    testemunha2_nome: data.testemunha2_nome || '',
    testemunha2_cpf: data.testemunha2_cpf || '',
  }
}
