import { para, downloadDocx } from '@/lib/docx-generator'

function buildIntermediationDocumentXml(): string {
  const paras = [
    para('AUTORIZAÇÃO PARA DIVULGAÇÃO E VENDA DE IMÓVEL', {
      bold: true,
      align: 'center',
      size: 28,
      after: 400,
    }),
    para('CONTRATANTES', { bold: true, after: 200 }),
    para('NOME: {contratante_nome}', { after: 100 }),
    para('CPF / CNPJ: {contratante_cpf}   ORGÃO EMISSOR: {contratante_orgao_emissor}', {
      after: 100,
    }),
    para('TELEFONES: {contratante_telefone}   E-MAIL: {contratante_email}', { after: 100 }),
    para('CONTRATADO: MARCUS V F GODOY ASSESSORIA IMOBILIARIA — CNPJ: 58.409.058/0001-73', {
      after: 400,
    }),
    para('DESCRIÇÃO DO IMÓVEL', { bold: true, after: 200 }),
    para('ENDEREÇO: {imovel_endereco}', { after: 100 }),
    para('BAIRRO: {imovel_bairro}   CIDADE: {imovel_cidade}   CEP: {imovel_cep}', { after: 100 }),
    para(
      'CONDOMÍNIO: R$ {imovel_condominio}   IPTU: R$ {imovel_iptu}   VAGAS: {imovel_vagas}   QUARTOS: {imovel_quartos}',
      { after: 100 },
    ),
    para('VALOR DE AVALIAÇÃO: R$ {valor_avaliacao}   VALOR DE VENDA: R$ {valor_venda}', {
      after: 400,
    }),
    para('CONDIÇÕES', { bold: true, after: 200 }),
    para(
      '1. A presente Autorização de Venda, {check_com_exclusiva} COM GESTÃO EXCLUSIVA / {check_sem_exclusiva} SEM GESTÃO EXCLUSIVA, tem o seu amparo na Lei 6.530, Art. 20, item III, de 12/05/1978 e pela Resolução do COFECI no. 458/95 de 17/11/1995.',
      { align: 'both', after: 200 },
    ),
    para(
      '2. Entenda-se por GESTÃO EXCLUSIVA, a escolha do CONTRATADO, como responsável exclusivo pela Representação Comercial do imóvel perante o mercado. A ele caberá centralizar os contatos de possíveis interessados Clientes Diretos ou Corretores, acompanhar todas as visitas realizadas, atender outros Corretores interessados em estabelecer parceria comercial para venda do Imóvel e investir na divulgação do imóvel de forma ampla.',
      { align: 'both', after: 200 },
    ),
    para(
      '3. É concedida esta autorização pelo prazo de {prazo_vigencia_dias} dias, a contar desta data, nela também está incluída a veiculação de anúncios e fotos do imóvel em todos os meios de publicidade utilizados pelo CONTRATADO, prorrogada automaticamente pelo mesmo período, caso, após o término do citado prazo, não ocorra manifestação expressa dos CONTRATANTES.',
      { align: 'both', after: 200 },
    ),
    para(
      '4. Os CONTRATANTES se comprometem a pagar ao CONTRATADO o percentual de {comissao_percentual}% sobre o preço de venda efetivamente transacionado, a título de honorários de corretagem, que serão pagos no ato da assinatura da escritura de compra e venda.',
      { align: 'both', after: 200 },
    ),
    para(
      '5. A mesma remuneração será devida pelos CONTRATANTES se, durante a vigência desta autorização o proprietário realizar a venda do imóvel sem a ciência e acompanhamento do CONTRATADO ou se em até 180 dias após o término do prazo estabelecido neste instrumento, eles venham a realizar, por conta própria ou através de terceiros, a venda do imóvel objeto da presente autorização, com pretendentes apresentados ou indicados pelo CONTRATADO, conforme relação nominal que lhes será ou tenha sido entregue, relação essa obtida por meio de registro nas respectivas fichas de visita ao imóvel.',
      { align: 'both', after: 200 },
    ),
    para(
      '6. O CONTRATADO se compromete a não medir esforços no sentido de intermediar a venda do imóvel com base nas condições acima descritas, agindo de forma legal, obedecendo fielmente à legislação vigente e o Código de Ética da Profissão, estabelecido pelo CONSELHO FEDERAL DE CORRETORES DE IMÓVEIS – COFECI.',
      { align: 'both', after: 200 },
    ),
    para(
      '7. Os CONTRATANTES se responsabilizam por todas as informações pessoais e de propriedade aqui prestadas acerca do imóvel objeto da presente Autorização.',
      { align: 'both', after: 200 },
    ),
    para(
      '8. Para dirimir eventuais dúvidas ou questões oriundas da presente Autorização, que não possam ser resolvidas de comum acordo entre as partes, fica eleito o foro da Comarca do Rio de Janeiro, RJ, com renúncia a qualquer outro, por mais privilegiado que seja.',
      { align: 'both', after: 400 },
    ),
    para('Rio de Janeiro, {data_extenso}.', { align: 'center', after: 600 }),
    para('_________________________________________________', { align: 'center', after: 0 }),
    para('CONTRATANTE(S)', { align: 'center', after: 0 }),
    para('NOME: {contratante_nome}   CPF: {contratante_cpf}', { align: 'center', after: 400 }),
    para('_________________________________________________', { align: 'center', after: 0 }),
    para('CONTRATADO', { align: 'center', after: 0 }),
    para('Marcus Vinícius Freitas Godoy — CRECI: 80.199 RJ', { align: 'center', after: 0 }),
  ]
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">\n<w:body>\n${paras.join('\n')}\n</w:body>\n</w:document>`
}

export function generateIntermediationDocx(data: Record<string, string>): void {
  downloadDocx(buildIntermediationDocumentXml(), data, 'autorizacao-de-intermediacao.docx')
}
