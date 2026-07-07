import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'

function escapeXml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

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

function buildDocumentXml(): string {
  const paras = [
    para('RECIBO DE SINAL E PRINCÍPIO DE PAGAMENTO (ARRAS)', {
      bold: true,
      align: 'center',
      size: 28,
      after: 0,
    }),
    para('Arts. 417 a 420 do Código Civil', { align: 'center', size: 22, after: 400 }),
    para('QUALIFICAÇÃO DAS PARTES', { bold: true, after: 200 }),
    para(
      'VENDEDOR(A) / PROMITENTE-VENDEDOR(A): {vendedor_nome}, {vendedor_nacionalidade}, {vendedor_qualificacao_civil}, {vendedor_profissao}, portador(a) do documento de identidade nº {vendedor_rg} e inscrito(a) no CPF/MF sob o nº {vendedor_cpf}, residente e domiciliado(a) em {vendedor_endereco}.',
      { align: 'both', after: 200 },
    ),
    para(
      'COMPRADOR(A) / PROMITENTE-COMPRADOR(A): {comprador_nome}, {comprador_nacionalidade}, {comprador_qualificacao_civil}, {comprador_profissao}, portador(a) do documento de identidade nº {comprador_rg} e inscrito(a) no CPF/MF sob o nº {comprador_cpf}, residente e domiciliado(a) em {comprador_endereco}.',
      { align: 'both', after: 400 },
    ),
    para('OBJETO', { bold: true, after: 200 }),
    para(
      'IMÓVEL: {imovel_descricao}, objeto da matrícula nº {imovel_matricula} do {imovel_ri_numero}º Registro de Imóveis de {imovel_comarca}, inscrição municipal (IPTU) nº {imovel_iptu}.',
      { align: 'both', after: 400 },
    ),
    para('DECLARAÇÃO DE RECEBIMENTO', { bold: true, after: 200 }),
    para(
      'Pelo presente instrumento, o(a) VENDEDOR(A) declara haver RECEBIDO do(a) COMPRADOR(A) a importância de R$ {valor_sinal} ({valor_sinal_extenso}), paga por meio de {forma_pagamento_sinal}, a título de SINAL E PRINCÍPIO DE PAGAMENTO (ARRAS), nos termos dos artigos 417 a 420 do Código Civil, vinculado ao negócio de compra e venda do imóvel acima descrito, cujo preço total ajustado é de R$ {valor_total} ({valor_total_extenso}).',
      { align: 'both', after: 400 },
    ),
    para('CONDIÇÕES E NATUREZA DAS ARRAS', { bold: true, after: 200 }),
    para(
      'CLÁUSULA 1ª — IMPUTAÇÃO NO PREÇO. O valor ora recebido a título de sinal será imputado no preço total da compra e venda, restando o saldo de R$ {valor_saldo} ({valor_saldo_extenso}) a ser pago na forma e nas datas ajustadas no contrato de compra e venda / promessa de compra e venda firmado entre as partes (CC art. 417).',
      { align: 'both', after: 200 },
    ),
    para(
      'CLÁUSULA 2ª — NATUREZA DAS ARRAS. As partes ajustam, de comum acordo, que as arras ora pactuadas têm natureza',
      { align: 'both', after: 100 },
    ),
    para(
      '{check_confirmatoria} CONFIRMATÓRIA (CC arts. 417 a 419): em caso de inexecução por quem deu as arras, poderá a parte inocente reter o sinal; se a inexecução for de quem recebeu, devolverá o sinal em dobro, podendo, em qualquer caso, a parte inocente exigir indenização suplementar se provar maior prejuízo, valendo as arras como taxa mínima, ou exigir a execução do contrato com perdas e danos.',
      { align: 'both', after: 100 },
    ),
    para(
      '{check_penitencial} PENITENCIAL (CC art. 420): havendo direito de arrependimento estipulado, as arras funcionam como pré-fixação de perdas e danos. Quem deu as arras e se arrepender as perde; quem as recebeu e se arrepender as devolve em dobro. Em ambos os casos, não haverá direito a indenização suplementar.',
      { align: 'both', after: 100 },
    ),
    para(
      'Parágrafo único. Não havendo marcação expressa de uma das opções acima, presumem-se as arras de natureza confirmatória.',
      { align: 'both', after: 200 },
    ),
    para(
      'CLÁUSULA 3ª — PRAZO PARA FORMALIZAÇÃO. As partes obrigam-se a celebrar o contrato definitivo de compra e venda / a escritura pública no prazo de {prazo_formalizacao_dias} dias contados desta data, mediante apresentação da documentação prevista no checklist documental e a verificação de regularidade do imóvel e dos vendedores.',
      { align: 'both', after: 200 },
    ),
    para(
      'CLÁUSULA 4ª — RESTITUIÇÃO POR FATO ALHEIO ÀS PARTES. Caso o negócio não se concretize por fato não imputável a qualquer das partes — notadamente impossibilidade de obtenção de financiamento previamente condicionado, existência de ônus, gravame, restrição registral ou pendência impeditiva da transmissão —, o sinal será devolvido de forma simples e integral ao(à) COMPRADOR(A), monetariamente corrigido, no prazo de {prazo_restituicao_dias} dias, sem incidência das penalidades de arras.',
      { align: 'both', after: 200 },
    ),
    para(
      'CLÁUSULA 5ª — ELEIÇÃO DE FORO. Fica eleito o foro da comarca de {foro_comarca}, com renúncia a qualquer outro, por mais privilegiado que seja, para dirimir as questões oriundas deste recibo.',
      { align: 'both', after: 400 },
    ),
    para('E, por estarem assim justas e acordadas, firmam o presente em duas vias de igual teor.', {
      align: 'both',
      after: 200,
    }),
    para('{cidade_uf}, {data_extenso}.', { align: 'center', after: 600 }),
    para('___________________________________', { align: 'center', after: 0 }),
    para('VENDEDOR(A) — Nome: {vendedor_nome} — CPF: {vendedor_cpf}', {
      align: 'center',
      after: 400,
    }),
    para('___________________________________', { align: 'center', after: 0 }),
    para('COMPRADOR(A) — Nome: {comprador_nome} — CPF: {comprador_cpf}', {
      align: 'center',
      after: 400,
    }),
    para('Testemunhas:', { after: 200 }),
    para('1ª ___________________ Nome: {testemunha1_nome} CPF: {testemunha1_cpf}', { after: 100 }),
    para('2ª ___________________ Nome: {testemunha2_nome} CPF: {testemunha2_cpf}', { after: 0 }),
  ]
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">\n<w:body>\n${paras.join('\n')}\n</w:body>\n</w:document>`
}

export function generateDocx(data: Record<string, string>): void {
  const escaped: Record<string, string> = {}
  for (const [k, v] of Object.entries(data)) escaped[k] = escapeXml(v)

  const zip = new PizZip()
  zip.file(
    '[Content_Types].xml',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>',
  )
  zip.file(
    '_rels/.rels',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>',
  )
  zip.file('word/document.xml', buildDocumentXml())

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    nullGetter: () => '',
  })
  doc.render(escaped)

  const blob = doc
    .getZip()
    .generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'recibo-de-sinal-arras.docx'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
