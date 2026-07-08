import { para, downloadDocx } from '@/lib/docx-generator'

function buildPromessaAvistaDocumentXml(): string {
  const paras = [
    para('COMPROMISSO DE COMPRA E VENDA (À VISTA)', {
      bold: true,
      align: 'center',
      size: 28,
      after: 400,
    }),
    para('QUALIFICAÇÃO DAS PARTES', { bold: true, after: 200 }),
    para(
      'VENDEDOR(A): {vendedor_nome}, {vendedor_nacionalidade}, {vendedor_estado_civil}{vendedor_regime_sufixo}, {vendedor_profissao}, portador(a) do RG nº {vendedor_rg} ({vendedor_orgao_emissor}), inscrito(a) no CPF/CNPJ sob o nº {vendedor_cpf}, residente e domiciliado(a) em {vendedor_endereco}, e-mail: {vendedor_email}.',
      { align: 'both', after: 200 },
    ),
    para(
      'COMPRADOR(A): {comprador_nome}, {comprador_nacionalidade}, {comprador_estado_civil}{comprador_regime_sufixo}, {comprador_profissao}, portador(a) do RG nº {comprador_rg} ({comprador_orgao_emissor}), inscrito(a) no CPF/CNPJ sob o nº {comprador_cpf}, residente e domiciliado(a) em {comprador_endereco}, e-mail: {comprador_email}.',
      { align: 'both', after: 200 },
    ),
    para('{bloco_interveniente_anuente}', { align: 'both', after: 400 }),
    para(
      'CLÁUSULA 1ª — DO OBJETO. O VENDEDOR compromete-se a vender e o COMPRADOR a comprar, pelo presente instrumento particular, o imóvel descrito como {imovel_descricao}, situado na {imovel_endereco}, bairro {imovel_bairro}, {imovel_cidade}/{imovel_uf}, CEP {imovel_cep}, com {imovel_vagas_qtd} vaga(s) de garagem ({imovel_vagas_descricao}), fração ideal de {imovel_fracao_ideal}, registrado no {imovel_rgi} sob a matrícula nº {imovel_matricula}, inscrição municipal (IPTU) nº {imovel_iptu}. O imóvel foi adquirido pelo VENDEDOR por {imovel_origem_aquisicao}, conforme {imovel_origem_registro}.',
      { align: 'both', after: 200 },
    ),
    para(
      'CLÁUSULA 2ª — DO PREÇO E DA FORMA DE PAGAMENTO. O presente compromisso é celebrado pelo valor total de R$ {valor_total} ({valor_total_extenso}), que o COMPRADOR pagará ao VENDEDOR à vista, conforme detalhado nas cláusulas seguintes, mediante sinal, reforço e saldo. Os pagamentos serão efetuados mediante {forma_pagamento}, conforme os seguintes dados: {dados_pagamento}.',
      { align: 'both', after: 200 },
    ),
    para(
      'CLÁUSULA 3ª — DO SINAL E PRINCÍPIO DE PAGAMENTO (PARTE A). O COMPRADOR paga neste ato, ao VENDEDOR, a importância de R$ {valor_sinal} ({valor_sinal_extenso}), a título de sinal e princípio de pagamento, nos termos dos artigos 417 a 420 do Código Civil, que serão imputados no preço total ajustado.',
      { align: 'both', after: 200 },
    ),
    para(
      'CLÁUSULA 4ª — DO REFORÇO DE PAGAMENTO (PARTE B). O COMPRADOR pagará ao VENDEDOR, a título de reforço, a importância de R$ {valor_reforco} ({valor_reforco_extenso}), no prazo de {prazo_reforco} dias contados desta data.',
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
      'CLÁUSULA 7ª — DA ESCRITURA DEFINITIVA E REGISTRO. As partes obrigam-se a lavrar a escritura definitiva de compra e venda até {data_escritura}, perante o Cartório de Notas competente, procedendo ao respectivo registro no Cartório de Registro de Imóveis.',
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
    para('CLÁUSULA 11ª — DAS ARRAS. {clausula_arras}', { align: 'both', after: 200 }),
    para(
      'CLÁUSULA 12ª — DA COMISSÃO DE CORRETAGEM. As partes reconhecem e aceitam que a comissão de corretagem é devida a {comissao_beneficiario}, documento nº {comissao_documento}, CRECI {comissao_creci}, PIX {comissao_pix}, no valor de R$ {comissao_valor} ({comissao_valor_extenso}), correspondente a {comissao_percentual}% do preço total, a ser paga pelo {comissao_responsavel} no ato da assinatura da escritura definitiva.',
      { align: 'both', after: 200 },
    ),
    para(
      'CLÁUSULA 13ª — DO PRAZO PARA APRESENTAÇÃO DE CERTIDÕES. O VENDEDOR obriga-se a apresentar todas as certidões necessárias à regular transferência do imóvel no prazo de {prazo_certificado} dias, contados da data deste instrumento.',
      { align: 'both', after: 200 },
    ),
    para(
      'CLÁUSULA 14ª — DAS OBRIGAÇÕES DO VENDEDOR. O VENDEDOR obriga-se a outorgar a escritura definitiva de compra e venda, livre e desembaraçada de ônus, gravames ou restrições, apresentando todos os documentos necessários à regular transferência do imóvel.',
      { align: 'both', after: 200 },
    ),
    para(
      'CLÁUSULA 15ª — DAS OBRIGAÇÕES DO COMPRADOR. O COMPRADOR obriga-se a pagar o preço na forma e prazos ajustados, bem como a arcar com as despesas de escritura e registro, salvo estipulação em contrário.',
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
    para('{cidade_uf}, {data_documento_extenso}.', { align: 'center', after: 600 }),
    para('___________________________________', { align: 'center', after: 0 }),
    para('VENDEDOR(A) — {vendedor_nome} — CPF: {vendedor_cpf}', { align: 'center', after: 400 }),
    para('___________________________________', { align: 'center', after: 0 }),
    para('COMPRADOR(A) — {comprador_nome} — CPF: {comprador_cpf}', { align: 'center', after: 400 }),
    para('{bloco_assinatura_interveniente}', { align: 'center', after: 400 }),
    para('Testemunhas:', { after: 200 }),
    para('1ª ___________________ Nome: {testemunha1_nome} CPF: {testemunha1_cpf}', { after: 100 }),
    para('2ª ___________________ Nome: {testemunha2_nome} CPF: {testemunha2_cpf}', { after: 0 }),
  ]
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">\n<w:body>\n${paras.join('\n')}\n</w:body>\n</w:document>`
}

export function generatePromessaAvistaDocx(data: Record<string, string>): void {
  downloadDocx(buildPromessaAvistaDocumentXml(), data, 'compromisso-de-compra-e-venda-avista.docx')
}
