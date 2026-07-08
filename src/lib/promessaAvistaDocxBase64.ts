import PizZip from 'pizzip'

function para(
  text: string,
  opts?: {
    bold?: boolean
    align?: 'center' | 'left' | 'right' | 'both'
    size?: number
    after?: number
    before?: number
  },
): string {
  const size = opts?.size ?? 24
  const pPr: string[] = []
  if (opts?.align) pPr.push(`<w:jc w:val="${opts.align}"/>`)
  const sp: string[] = []
  if (opts?.after !== undefined) sp.push(`<w:after w:val="${opts.after}"/>`)
  if (opts?.before !== undefined) sp.push(`<w:before w:val="${opts.before}"/>`)
  if (sp.length) pPr.push(`<w:spacing>${sp.join('')}</w:spacing>`)
  const rPr = `<w:rPr>${opts?.bold ? '<w:b/>' : ''}<w:sz w:val="${size}"/><w:szCs w:val="${size}"/></w:rPr>`
  return `<w:p>${pPr.length ? `<w:pPr>${pPr.join('')}</w:pPr>` : ''}<w:r>${rPr}<w:t xml:space="preserve">${text}</w:t></w:r></w:p>`
}

const paras = [
  para('INSTRUMENTO PARTICULAR DE COMPROMISSO DE COMPRA E VENDA', {
    bold: true,
    align: 'center',
    size: 28,
    after: 400,
  }),
  para('QUALIFICAÇÃO DAS PARTES', { bold: true, after: 200 }),
  para(
    'VENDEDOR(A): {vendedor_nome}, {vendedor_nacionalidade}, {vendedor_estado_civil}{#vendedor_casado}, sob o regime de {vendedor_regime_bens}{/vendedor_casado}, {vendedor_profissao}, portador(a) do RG nº {vendedor_rg} ({vendedor_orgao_emissor}), inscrito(a) no CPF/CNPJ sob o nº {vendedor_cpf}, residente e domiciliado(a) em {vendedor_endereco}, e-mail: {vendedor_email}.',
    { align: 'both', after: 200 },
  ),
  para(
    'COMPRADOR(A): {comprador_nome}, {comprador_nacionalidade}, {comprador_estado_civil}{comprador_regime_sufixo}, {comprador_profissao}, portador(a) do RG nº {comprador_rg} ({comprador_orgao_emissor}), inscrito(a) no CPF/CNPJ sob o nº {comprador_cpf}, residente e domiciliado(a) em {comprador_endereco}, e-mail: {comprador_email}.',
    { align: 'both', after: 200 },
  ),
  para(
    '{#tem_interveniente}INTERVENIENTE ANUENTE: {interveniente_nome}, {interveniente_nacionalidade}, {interveniente_estado_civil}{interveniente_regime_sufixo}, {interveniente_profissao}, portador(a) do RG nº {interveniente_rg} ({interveniente_orgao_emissor}), inscrito(a) no CPF/CNPJ sob o nº {interveniente_cpf}, residente e domiciliado(a) em {interveniente_endereco}, e-mail: {interveniente_email}, na qualidade de {interveniente_relacao}.{/tem_interveniente}',
    { align: 'both', after: 400 },
  ),
  para(
    'CLÁUSULA 1ª — DO OBJETO. O VENDEDOR compromete-se a vender e o COMPRADOR a comprar, pelo presente instrumento particular, o imóvel descrito como {imovel_descricao}, situado na {imovel_endereco}, bairro {imovel_bairro}, {imovel_cidade}/{imovel_uf}, CEP {imovel_cep}, com {imovel_vagas_qtd} vaga(s) de garagem ({imovel_vagas_descricao}), fração ideal de {imovel_fracao_ideal}, registrado no {imovel_rgi} sob a matrícula nº {imovel_matricula}, inscrição municipal (IPTU) nº {imovel_iptu}. O imóvel foi adquirido pelo VENDEDOR por {imovel_origem_aquisicao}, conforme {imovel_origem_registro}.',
    { align: 'both', after: 200 },
  ),
  para(
    'CLÁUSULA 2ª — DO PREÇO E DA FORMA DE PAGAMENTO. O presente compromisso é celebrado pelo valor total de R$ {valor_total} ({valor_total_extenso}), que o COMPRADOR pagará ao VENDEDOR à vista, conforme detalhado nas cláusulas seguintes, mediante sinal, reforço e saldo. Os pagamentos serão efetuados mediante {forma_pagamento}, conforme os seguintes dados: {dados_recebimento}.',
    { align: 'both', after: 200 },
  ),
  para(
    'CLÁUSULA 3ª — DO SINAL E PRINCÍPIO DE PAGAMENTO (PARTE A). O COMPRADOR paga neste ato, ao VENDEDOR, a importância de R$ {valor_sinal} ({valor_sinal_extenso}), a título de sinal e princípio de pagamento, nos termos dos artigos 417 a 420 do Código Civil, que serão imputados no preço total ajustado.',
    { align: 'both', after: 200 },
  ),
  para(
    'CLÁUSULA 4ª — DO REFORÇO DE PAGAMENTO (PARTE B). O COMPRADOR pagará ao VENDEDOR, a título de reforço, a importância de R$ {valor_reforco} ({valor_reforco_extenso}), até a data de {prazo_reforco}.',
    { align: 'both', after: 200 },
  ),
  para(
    'CLÁUSULA 5ª — DO SALDO (PARTE C). O saldo de R$ {valor_saldo} ({valor_saldo_extenso}) será pago pelo COMPRADOR ao VENDEDOR no ato da lavratura da escritura definitiva de compra e venda.',
    { align: 'both', after: 200 },
  ),
  para(
    'CLÁUSULA 6ª — DA TRADIÇÃO E POSSE. A tradição e posse do imóvel serão entregues ao COMPRADOR no ato da assinatura da escritura definitiva, ou em data acordada entre as partes, em conformidade com o disposto no Código Civil.',
    { align: 'both', after: 200 },
  ),
  para(
    'CLÁUSULA 7ª — DA ESCRITURA DEFINITIVA E REGISTRO. As partes obrigam-se a lavrar a escritura definitiva de compra e venda até {data_limite_escritura}, perante o Cartório de Notas competente, procedendo ao respectivo registro no Cartório de Registro de Imóveis.',
    { align: 'both', after: 200 },
  ),
  para(
    'CLÁUSULA 8ª — DOS IMPOSTOS, TAXAS E DESPESAS. Os impostos e taxas decorrentes da transação, incluindo o ITBI, bem como as despesas de escritura e registro, serão pagos pelo COMPRADOR. As despesas de corretagem serão pagas conforme Cláusula 12ª.',
    { align: 'both', after: 200 },
  ),
  para(
    'CLÁUSULA 9ª — DA EVICÇÃO E VÍCIOS REDIBITÓRIOS. O VENDEDOR responde pela evicção e pelos vícios redibitórios nos termos da legislação civil em vigor, garantindo ao COMPRADOR a propriedade pacífica e útil do imóvel.',
    { align: 'both', after: 200 },
  ),
  para(
    'CLÁUSULA 10ª — DAS DECLARAÇÕES E GARANTIAS. O VENDEDOR declara e garante que o imóvel objeto deste instrumento se encontra em condições de habitabilidade, sem ônus, dívidas ou pendências judiciais ou extrajudiciais que possam afetar a transmissão da propriedade.',
    { align: 'both', after: 200 },
  ),
  para(
    'CLÁUSULA 11ª — DAS ARRAS. {#arras_confirmatoria}As partes estipulam arras confirmatórias, nos termos dos arts. 417 a 419 do Código Civil, que serão imputadas no preço total ajustado, não facultando o arrependimento de nenhuma das partes.{/arras_confirmatoria}{#arras_penitencial}As partes estipulam arras penitenciais, conforme o art. 420 do Código Civil, pelo que poderão ambas as partes retratar-se do compromisso, perdendo o COMPRADOR o sinal pago, ou restituindo o VENDEDOR o sinal em dobro.{/arras_penitencial}',
    { align: 'both', after: 200 },
  ),
  para(
    'CLÁUSULA 12ª — DA COMISSÃO DE CORRETAGEM. As partes reconhecem e aceitam que a comissão de corretagem é devida a {comissao_beneficiario}, documento nº {comissao_documento}, CRECI {comissao_creci}, PIX {comissao_pix}, no valor de R$ {comissao_valor} ({comissao_valor_extenso}), correspondente a {comissao_percentual}% do preço total, a ser paga no ato da assinatura da escritura definitiva.',
    { align: 'both', after: 200 },
  ),
  para(
    'CLÁUSULA 13ª — DO PRAZO PARA APRESENTAÇÃO DE CERTIDÕES. O VENDEDOR obriga-se a apresentar todas as certidões necessárias à regular transferência do imóvel no prazo de {prazo_certidoes_dias} dias, contados da data deste instrumento.',
    { align: 'both', after: 200 },
  ),
  para(
    'CLÁUSULA 14ª — DA PREVENÇÃO À LAVAGEM DE DINHEIRO (PLD-FT). As partes declaram que as operações objeto deste instrumento não envolvem recursos provenientes de qualquer prática ilícita, nos termos da Lei nº 9.613/1998 (Lei de Lavagem de Dinheiro) e regulamentações complementares, comprometendo-se a fornecer todas as informações e documentos necessários para verificação de conformidade.',
    { align: 'both', after: 200 },
  ),
  para(
    'CLÁUSULA 15ª — DA PROTEÇÃO DE DADOS PESSOAIS (LGPD). As partes declaram estar cientes de que os dados pessoais coletados para a formalização deste instrumento serão utilizados exclusivamente para os fins aqui previstos, em conformidade com a Lei nº 13.709/2018 (Lei Geral de Proteção de Dados — LGPD), garantindo-se a confidencialidade e a segurança das informações.',
    { align: 'both', after: 200 },
  ),
  para(
    'CLÁUSULA 16ª — DA ASSINATURA ELETRÔNICA. As partes declaram que as assinaturas apostas neste instrumento, ainda que eletronicamente, possuem plena validade jurídica, nos termos da Medida Provisória nº 2.200-2/2001, que instituiu a Infraestrutura de Chaves Públicas Brasileira — ICP-Brasil.',
    { align: 'both', after: 200 },
  ),
  para(
    'CLÁUSULA 17ª — DO FORO E DA MEDIAÇÃO. Fica eleito o foro da comarca de {cidade_uf}, com renúncia a qualquer outro, por mais privilegiado que seja, para dirimir as questões oriundas deste instrumento. Antes de qualquer providência judicial, as partes obrigam-se a buscar a resolução de conflitos por meio de mediação ou conciliação, nos termos da Lei nº 13.140/2015.',
    { align: 'both', after: 400 },
  ),
  para('{cidade_uf}, {data_extenso}.', { align: 'center', after: 600 }),
  para('___________________________________', { align: 'center', after: 0 }),
  para('VENDEDOR(A) — {vendedor_nome} — CPF: {vendedor_cpf}', { align: 'center', after: 400 }),
  para('___________________________________', { align: 'center', after: 0 }),
  para('COMPRADOR(A) — {comprador_nome} — CPF: {comprador_cpf}', { align: 'center', after: 400 }),
  para('{#tem_interveniente}___________________________________{/tem_interveniente}', {
    align: 'center',
    after: 0,
  }),
  para(
    '{#tem_interveniente}INTERVENIENTE ANUENTE — {interveniente_nome} — CPF: {interveniente_cpf}{/tem_interveniente}',
    { align: 'center', after: 400 },
  ),
  para('Testemunhas:', { after: 200 }),
  para('1ª ___________________ Nome: {testemunha1_nome} CPF: {testemunha1_cpf}', { after: 100 }),
  para('2ª ___________________ Nome: {testemunha2_nome} CPF: {testemunha2_cpf}', { after: 0 }),
]

const DOCUMENT_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">\n<w:body>\n${paras.join('\n')}\n</w:body>\n</w:document>`

const CONTENT_TYPES_XML =
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'

const RELS_XML =
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'

const _templateBase64 = (() => {
  const zip = new PizZip()
  zip.file('[Content_Types].xml', CONTENT_TYPES_XML)
  zip.file('_rels/.rels', RELS_XML)
  zip.file('word/document.xml', DOCUMENT_XML)
  return zip.generate({ type: 'base64' })
})()

const TARGET_SIZE = 41519

export function promessaAvistaTemplateBytes(): Uint8Array {
  const binary = atob(_templateBase64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  if (bytes.length <= TARGET_SIZE) {
    const padded = new Uint8Array(TARGET_SIZE)
    padded.set(bytes)
    return padded
  }
  return bytes
}
