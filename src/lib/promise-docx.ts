import { para, downloadDocx, getTextFromDocumentXml } from '@/lib/docx-generator'

function buildPromiseDocumentXml(): string {
  const paras = [
    para('PROMESSA DE COMPRA E VENDA', { bold: true, align: 'center', size: 28, after: 400 }),
    para('QUALIFICAÇÃO DAS PARTES', { bold: true, after: 200 }),
    para(
      'PROMITENTE VENDEDOR(A): {vendedor_nome}, {vendedor_nacionalidade}, {vendedor_qualificacao_civil}, {vendedor_profissao}, inscrito(a) no CPF/CNPJ sob o nº {vendedor_cpf}, residente e domiciliado(a) em {vendedor_endereco}.',
      { align: 'both', after: 200 },
    ),
    para(
      'PROMITENTE COMPRADOR(A): {comprador_nome}, {comprador_nacionalidade}, {comprador_qualificacao_civil}, {comprador_profissao}, inscrito(a) no CPF/CNPJ sob o nº {comprador_cpf}, residente e domiciliado(a) em {comprador_endereco}.',
      { align: 'both', after: 200 },
    ),
    para('INTERMEDIÁRIO: {contratado_nome} — CRECI: {contratado_creci}.', {
      align: 'both',
      after: 400,
    }),
    para('{check_interveniente}', { align: 'both', after: 400 }),
    para(
      'CLÁUSULA 1ª — DO OBJETO. O PROMITENTE VENDEDOR promete vender ao PROMITENTE COMPRADOR, que aceita a promessa de compra, o imóvel descrito como {imovel_descricao}, situado em {imovel_endereco}, {imovel_cidade}/{imovel_estado}, objeto da matrícula nº {imovel_matricula} do respectivo Cartório de Registro de Imóveis.',
      { align: 'both', after: 200 },
    ),
    para(
      'CLÁUSULA 2ª — DO PREÇO. O presente instrumento é celebrado pelo valor total de R$ {valor_venda}, que o PROMITENTE COMPRADOR paga ao PROMITENTE VENDEDOR na forma estabelecida nas cláusulas seguintes.',
      { align: 'both', after: 200 },
    ),
    para(
      'CLÁUSULA 3ª — DO SINAL E PRINCÍPIO DE PAGAMENTO (ARRAS). O PROMITENTE COMPRADOR entrega neste ato, ao PROMITENTE VENDEDOR, a importância de R$ {valor_sinal}, a título de sinal e princípio de pagamento (arras), nos termos dos artigos 417 a 420 do Código Civil, que serão imputados no preço total ajustado.',
      { align: 'both', after: 200 },
    ),
    para(
      'CLÁUSULA 4ª — DO SALDO DE PREÇO. O saldo de R$ {valor_saldo} será pago pelo PROMITENTE COMPRADOR ao PROMITENTE VENDEDOR por meio de {saldo_pagamento}, conforme ajustado entre as partes, até a data da lavratura da escritura definitiva de compra e venda.',
      { align: 'both', after: 200 },
    ),
    para(
      'CLÁUSULA 5ª — DA COMISSÃO DE CORRETAGEM. As partes reconhecem e aceitam que a comissão de corretagem é devida ao INTERMEDIÁRIO {contratado_nome} — CRECI: {contratado_creci}, no valor de R$ {valor_comissao}, correspondente a {comissao_percentual}% do preço de venda, a ser paga no ato da assinatura da escritura definitiva.',
      { align: 'both', after: 200 },
    ),
    para(
      'CLÁUSULA 7ª — DAS OBRIGAÇÕES DO PROMITENTE VENDEDOR. O PROMITENTE VENDEDOR obriga-se a outorgar a escritura definitiva de compra e venda, livre e desembaraçada de ônus, gravames ou restrições, apresentando todos os documentos necessários à regular transferência do imóvel.',
      { align: 'both', after: 200 },
    ),
    para(
      'CLÁUSULA 8ª — DAS OBRIGAÇÕES DO PROMITENTE COMPRADOR. O PROMITENTE COMPRADOR obriga-se a pagar o saldo do preço na forma e prazo ajustados, bem como a arcar com as despesas de escritura e registro, salvo estipulação em contrário.',
      { align: 'both', after: 200 },
    ),
    para(
      'CLÁUSULA 9ª — DA TRADIÇÃO E POSSE. A tradição e posse do imóvel serão entregues ao PROMITENTE COMPRADOR no ato da assinatura da escritura definitiva, ou em data acordada entre as partes, em conformidade com o disposto no Código Civil.',
      { align: 'both', after: 200 },
    ),
    para(
      'CLÁUSULA 10ª — DA ESCRITURA DEFINITIVA E REGISTRO. As partes obrigam-se a lavrar a escritura definitiva de compra e venda no prazo de 30 (trinta) dias, contados da quitação do preço total, perante o Cartório de Notas competente, procedendo ao respectivo registro no Cartório de Registro de Imóveis.',
      { align: 'both', after: 200 },
    ),
    para(
      'CLÁUSULA 11ª — DOS IMPOSTOS, TAXAS E DESPESAS. Os impostos e taxas decorrentes da transação, incluindo o ITBI, bem como as despesas de escritura e registro, serão pagos pelo PROMITENTE COMPRADOR. As despesas de corretagem serão pagas conforme Cláusula 5ª.',
      { align: 'both', after: 200 },
    ),
    para(
      'CLÁUSULA 12ª — DA EVICÇÃO E VÍCIOS REDIBITÓRIOS. O PROMITENTE VENDEDOR responde pela evicção e pelos vícios redibitórios nos termos da legislação civil em vigor, garantindo ao PROMITENTE COMPRADOR a propriedade pacífica e útil do imóvel.',
      { align: 'both', after: 200 },
    ),
    para(
      'CLÁUSULA 13ª — DA NATUREZA DAS ARRAS. As partes ajustam que as arras ora pactuadas têm natureza {tipo_arras}, nos termos dos artigos 417 a 420 do Código Civil, com os efeitos jurídicos ali previstos.',
      { align: 'both', after: 200 },
    ),
    para(
      'CLÁUSULA 14ª — DAS DECLARAÇÕES E GARANTIAS. O PROMITENTE VENDEDOR declara e garante que o imóvel objeto deste instrumento se encontra em condições de habitabilidade, sem ônus, dívidas ou pendências judiciais ou extrajudiciais que possam afetar a transmissão da propriedade.',
      { align: 'both', after: 200 },
    ),
    para(
      'CLÁUSULA 15ª — DO PRAZO DE VALIDADE. O presente instrumento tem validade de 60 (sessenta) dias para a lavratura da escritura definitiva, prazo esse que pode ser prorrogado por mútuo acordo entre as partes, formalizado por escrito.',
      { align: 'both', after: 200 },
    ),
    para(
      'CLÁUSULA 16ª — DO FORO. Fica eleito o foro da comarca de {cidade_uf}, com renúncia a qualquer outro, por mais privilegiado que seja, para dirimir as questões oriundas deste instrumento.',
      { align: 'both', after: 200 },
    ),
    para(
      'CLÁUSULA 17ª — DAS DISPOSIÇÕES GERAIS. As partes declaram estar cientes e de acordo com todos os termos e condições deste instrumento, que assinam em 2 (duas) vias de igual teor e forma, juntamente com as testemunhas abaixo assinadas.',
      { align: 'both', after: 400 },
    ),
    para('{cidade_uf}, {data_extenso}.', { align: 'center', after: 600 }),
    para('___________________________________', { align: 'center', after: 0 }),
    para('PROMITENTE VENDEDOR(A) — {vendedor_nome} — CPF: {vendedor_cpf}', {
      align: 'center',
      after: 400,
    }),
    para('___________________________________', { align: 'center', after: 0 }),
    para('PROMITENTE COMPRADOR(A) — {comprador_nome} — CPF: {comprador_cpf}', {
      align: 'center',
      after: 400,
    }),
    para('Testemunhas:', { after: 200 }),
    para('1ª ___________________ Nome: ___________________________ CPF: ______________', {
      after: 100,
    }),
    para('2ª ___________________ Nome: ___________________________ CPF: ______________', {
      after: 0,
    }),
  ]
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">\n<w:body>\n${paras.join('\n')}\n</w:body>\n</w:document>`
}

export function generatePromiseDocx(data: Record<string, string>): void {
  downloadDocx(buildPromiseDocumentXml(), data, 'promessa-de-compra-e-venda.docx')
}

// Mesma minuta em texto plano, para o Validador.
export function getPromiseText(data: Record<string, string>): string {
  return getTextFromDocumentXml(buildPromiseDocumentXml(), data)
}
