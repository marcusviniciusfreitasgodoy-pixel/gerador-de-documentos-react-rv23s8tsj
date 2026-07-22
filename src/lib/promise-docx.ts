import { para, downloadDocx, getTextFromDocumentXml } from '@/lib/docx-generator'

// As cláusulas são montadas como LISTA e numeradas no fim, não escritas à mão.
// Antes eram fixas com o número no texto, e as condicionais entravam por um
// buraco ({check_interveniente}) posicionado errado: a "CLÁUSULA 6ª" saía ANTES
// da 1ª, e sem interveniente a numeração pulava de 5 pra 7. Com 3 cláusulas
// condicionais (outorga, interveniente) isso só pioraria.
// As 5 primeiras são FIXAS e nunca saem — por isso a referência cruzada
// "conforme Cláusula 5ª" (na de impostos) continua válida em qualquer combinação.
interface Clausula {
  titulo: string
  texto: string
}

function montarClausulas(d: Record<string, string>): Clausula[] {
  const cs: Clausula[] = [
    {
      titulo: 'DO OBJETO',
      texto:
        // A descrição do imóvel MANDA: ela vem da matrícula e já traz endereço,
        // vagas e fração. Repetir os campos estruturados aqui produzia o mesmo bem
        // descrito duas vezes — e com vocabulários diferentes (a matrícula diz
        // "freguesia de Jacarepaguá", o cadastro diz "Barra da Tijuca"), o que num
        // contrato lê como contradição. O `{imovel_cidade}` que sobrou qualifica o
        // CARTÓRIO, não o imóvel — não é redundante e identifica o registro.
        'O PROMITENTE VENDEDOR promete vender ao PROMITENTE COMPRADOR, que aceita a promessa de compra, o imóvel descrito como {imovel_descricao}, objeto da matrícula nº {imovel_matricula} do Cartório de Registro de Imóveis de {imovel_cidade}.',
    },
    {
      titulo: 'DO PREÇO',
      texto:
        'O presente instrumento é celebrado pelo valor total de R$ {valor_venda}, que o PROMITENTE COMPRADOR paga ao PROMITENTE VENDEDOR na forma estabelecida nas cláusulas seguintes.',
    },
    {
      titulo: 'DO SINAL E PRINCÍPIO DE PAGAMENTO (ARRAS)',
      texto:
        'O PROMITENTE COMPRADOR entrega neste ato, ao PROMITENTE VENDEDOR, a importância de R$ {valor_sinal}, a título de sinal e princípio de pagamento (arras), nos termos dos artigos 417 a 420 do Código Civil, que serão imputados no preço total ajustado.',
    },
    {
      titulo: 'DO SALDO DE PREÇO',
      texto:
        'O saldo de R$ {valor_saldo} será pago pelo PROMITENTE COMPRADOR ao PROMITENTE VENDEDOR por meio de {saldo_pagamento}, conforme ajustado entre as partes, até a data da lavratura da escritura definitiva de compra e venda.',
    },
    {
      titulo: 'DA COMISSÃO DE CORRETAGEM',
      texto:
        'As partes reconhecem e aceitam que a comissão de corretagem é devida ao INTERMEDIÁRIO {contratado_nome} — CRECI: {contratado_creci}, no valor de R$ {valor_comissao}, correspondente a {comissao_percentual}% do preço de venda, a ser paga no ato da assinatura da escritura definitiva.',
    },
  ]

  // Outorga: só quando o cônjuge do vendedor entra como ANUENTE. Como CO-VENDEDOR
  // ele já é parte alienante no preâmbulo e a outorga é dispensável.
  if (d.conjuge_vendedor_papel === 'anuente') {
    cs.push({
      titulo: 'DA OUTORGA CONJUGAL',
      texto:
        '{conjuge_vendedor_nome}, cônjuge do PROMITENTE VENDEDOR {vendedor_nome}, com quem é casado(a) sob o regime de {vendedor_regime_bens}, comparece a este instrumento e dá sua expressa e irrevogável anuência à promessa de venda do imóvel objeto da Cláusula 1ª, para os fins do artigo 1.647, inciso I, do Código Civil, declarando conhecer e aceitar todas as condições aqui pactuadas.',
    })
  }

  if (d.has_interveniente === 'sim') {
    cs.push({
      titulo: 'DO INTERVENIENTE ANUENTE',
      texto:
        'Intervém no presente instrumento, como INTERVENIENTE ANUENTE, {interveniente_nome}, inscrito(a) no CPF/CNPJ sob o nº {interveniente_cpf}, que concorda com todos os termos e condições aqui estabelecidos, ciente de que o imóvel objeto deste instrumento será transmitido ao PROMITENTE COMPRADOR, renunciando a quaisquer direitos que possam eventualmente titular sobre o referido imóvel.',
    })
  }

  cs.push(
    {
      titulo: 'DAS OBRIGAÇÕES DO PROMITENTE VENDEDOR',
      texto:
        'O PROMITENTE VENDEDOR obriga-se a outorgar a escritura definitiva de compra e venda, livre e desembaraçada de ônus, gravames ou restrições, apresentando todos os documentos necessários à regular transferência do imóvel.',
    },
    {
      titulo: 'DAS OBRIGAÇÕES DO PROMITENTE COMPRADOR',
      texto:
        'O PROMITENTE COMPRADOR obriga-se a pagar o saldo do preço na forma e prazo ajustados, bem como a arcar com as despesas de escritura e registro, salvo estipulação em contrário.',
    },
    {
      // Verbatim da À vista (cláusula OITAVA). INA001 e RES001 são UMA cláusula lá:
      // rescisão após notificação (DL 745/1969) + multa 2% + juros 1% ao mês.
      titulo: 'DO INADIMPLEMENTO E DA RESCISÃO',
      texto:
        'O não pagamento pontual de qualquer parcela por culpa do PROMITENTE COMPRADOR, cumpridas pelo PROMITENTE VENDEDOR suas obrigações, acarretará a rescisão de pleno direito após 15 (quinze) dias contados do recebimento da notificação extrajudicial para purga da mora, nos termos do Decreto-Lei nº 745/1969. A impontualidade aceita pelo PROMITENTE VENDEDOR não importará novação, incidindo multa moratória de 2% (dois por cento) e juros de mora de 1% (um por cento) ao mês. Rescisão por culpa do PROMITENTE COMPRADOR: perda do sinal, a título de multa compensatória. Rescisão por culpa do PROMITENTE VENDEDOR ou por impedimento documental: devolução dos valores pagos, corrigidos pelo IPCA/IBGE desde cada desembolso, no prazo de 5 (cinco) dias úteis.',
    },
    {
      titulo: 'DA TRADIÇÃO E POSSE',
      texto:
        'A tradição e posse do imóvel serão entregues ao PROMITENTE COMPRADOR no ato da assinatura da escritura definitiva, ou em data acordada entre as partes, em conformidade com o disposto no Código Civil.',
    },
    {
      titulo: 'DA ESCRITURA DEFINITIVA E REGISTRO',
      texto:
        'As partes obrigam-se a lavrar a escritura definitiva de compra e venda no prazo de 30 (trinta) dias, contados da quitação do preço total, perante o Cartório de Notas competente, procedendo ao respectivo registro no Cartório de Registro de Imóveis.',
    },
    {
      titulo: 'DOS IMPOSTOS, TAXAS E DESPESAS',
      texto:
        'Os impostos e taxas decorrentes da transação, incluindo o ITBI, bem como as despesas de escritura e registro, serão pagos pelo PROMITENTE COMPRADOR. As despesas de corretagem serão pagas conforme Cláusula 5ª.',
    },
    {
      titulo: 'DA EVICÇÃO E VÍCIOS REDIBITÓRIOS',
      texto:
        'O PROMITENTE VENDEDOR responde pela evicção e pelos vícios redibitórios nos termos da legislação civil em vigor, garantindo ao PROMITENTE COMPRADOR a propriedade pacífica e útil do imóvel.',
    },
    {
      // Verbatim da À vista (cláusula DÉCIMA SEGUNDA). A anterior só ROTULAVA a natureza
      // ("têm natureza CONFIRMATÓRIA") sem dizer o efeito — e não trazia FIX004, que o
      // validador cobra em confirmatórias. Aqui o texto MUDA com o regime, porque os dois
      // se excluem: confirmatórias = irrevogável; penitenciais = há arrependimento.
      titulo: 'DA IRREVOGABILIDADE E DAS ARRAS',
      texto:
        d.tipo_arras === 'PENITENCIAL'
          ? 'É facultado às partes o direito de arrependimento até a assinatura da escritura definitiva, tendo as arras natureza penitencial, nos termos do art. 420 do Código Civil, hipótese em que, arrependendo-se quem as deu, perdê-las-á em favor da outra parte; e, arrependendo-se quem as recebeu, restituí-las-á mais o equivalente, não cabendo indenização suplementar.'
          : 'O presente contrato é celebrado em caráter irrevogável e irretratável, obrigando as partes, seus herdeiros e sucessores. As arras ora entregues têm natureza confirmatória, incidindo o disposto nos artigos 417 a 419 do Código Civil, não havendo direito de arrependimento.',
    },
    {
      // Verbatim da À vista (cláusula SEGUNDA). A redação anterior — "sem ônus, dívidas
      // ou pendências" — era genérica demais e o validador cobrava TRI001. Esta enumera
      // e obriga a apresentar as certidões, que é o que a régua do Marcus (minuta Lopes)
      // faz. Menciona evicção, que também tem cláusula própria aqui: redundância em
      // contrato é reforço, não erro.
      titulo: 'DA SITUAÇÃO E DA DOCUMENTAÇÃO',
      texto:
        'O PROMITENTE VENDEDOR declara, sob as penas da lei, que não tem conhecimento de qualquer impedimento para o negócio e que o imóvel se encontra livre e desembaraçado, sem nenhum ônus de responsabilidade judicial ou extrajudicial, dúvidas, dívidas, litígios, despesas de contribuição de melhorias em atraso, arresto ou sequestro, execução ou executivo fiscal, foro ou pensão, ações reais ou pessoais, impostos, taxas e contribuições, respondendo civil e penalmente pela evicção de direito, nos termos dos artigos 447 a 457 do Código Civil, comprometendo-se a apresentar, no prazo de até {prazo_certidoes_dias} dias corridos, as Certidões Negativas pessoais, de pessoa jurídica (se houver) e do imóvel.',
    },
    {
      titulo: 'DO PRAZO DE VALIDADE',
      texto:
        'O presente instrumento tem validade de 60 (sessenta) dias para a lavratura da escritura definitiva, prazo esse que pode ser prorrogado por mútuo acordo entre as partes, formalizado por escrito.',
    },
    {
      // Verbatim da À vista (cláusula DÉCIMA QUINTA).
      titulo: 'DA PROTEÇÃO DE DADOS (LGPD)',
      texto:
        'As partes autorizam o tratamento de seus dados pessoais estritamente para os fins desta transação e para o cumprimento de obrigações legais e regulatórias, nos termos da Lei nº 13.709/2018 (LGPD).',
    },
    {
      titulo: 'DO FORO',
      texto:
        'Fica eleito o foro da comarca de {cidade_uf}, com renúncia a qualquer outro, por mais privilegiado que seja, para dirimir as questões oriundas deste instrumento.',
    },
    {
      titulo: 'DAS DISPOSIÇÕES GERAIS',
      texto:
        'As partes declaram estar cientes e de acordo com todos os termos e condições deste instrumento, que assinam em 2 (duas) vias de igual teor e forma, juntamente com as testemunhas abaixo assinadas.',
    },
  )
  // IPTU-RJ (TRI003): atualizacao cadastral pos-transmissao. Condicional e RJ-only,
  // como a outorga/interveniente. Entra logo apos "DOS IMPOSTOS" para agrupar o tema
  // tributario; posicao > 5a preserva a referencia cruzada "conforme Clausula 5a".
  if (d.iptu_rj === 'sim') {
    const idx = cs.findIndex((c) => c.titulo === 'DOS IMPOSTOS, TAXAS E DESPESAS')
    const iptuRj: Clausula = {
      titulo: 'DA ATUALIZAÇÃO CADASTRAL DO IPTU (MUNICÍPIO DO RIO DE JANEIRO)',
      texto:
        'Por se tratar de imóvel situado no Município do Rio de Janeiro, o PROMITENTE COMPRADOR obriga-se a promover, junto à Secretaria Municipal de Fazenda, a atualização da titularidade do imóvel no cadastro do IPTU após o registro do título aquisitivo, ainda que a comunicação também incumba ao Registro de Imóveis por força dos convênios de integração cadastral (Lei Municipal nº 5.400/2012 e Decreto nº 35.744/2012), comprovando essa providência ao PROMITENTE VENDEDOR no prazo de 60 (sessenta) dias contados do registro. O PROMITENTE COMPRADOR responde integralmente pelos tributos, taxas e encargos incidentes sobre o imóvel a partir da entrega das chaves, ainda que lançados em nome do PROMITENTE VENDEDOR, assegurado a este o direito de reembolso e regresso, sujeitando-se, em caso de descumprimento do prazo, à multa de R$ 100,00 (cem reais) por dia de atraso, sem prejuízo das penalidades fiscais.',
    }
    if (idx >= 0) cs.splice(idx + 1, 0, iptuRj)
    else cs.push(iptuRj)
  }

  return cs
}

const QUALIF =
  '{nome}, {nacionalidade}, {qualificacao_civil}, {profissao}, inscrito(a) no CPF/CNPJ sob o nº {cpf}, residente e domiciliado(a) em {endereco}.'
const qualif = (prefixo: string, rotulo: string) =>
  `${rotulo}: ` + QUALIF.replace(/\{(\w+)\}/g, (_, campo) => `{${prefixo}_${campo}}`)

function buildPromiseDocumentXml(d: Record<string, string>): string {
  const paras: string[] = [
    para('PROMESSA DE COMPRA E VENDA', { bold: true, align: 'center', size: 28, after: 400 }),
    para('QUALIFICAÇÃO DAS PARTES', { bold: true, after: 200 }),
    para(qualif('vendedor', 'PROMITENTE VENDEDOR(A)'), { align: 'both', after: 200 }),
  ]

  // Cônjuge do vendedor como CO-VENDEDOR: entra no preâmbulo como parte alienante.
  if (d.conjuge_vendedor_papel === 'co_vendedor') {
    paras.push(
      para(qualif('conjuge_vendedor', 'PROMITENTE VENDEDOR(A)'), { align: 'both', after: 200 }),
    )
  }

  paras.push(para(qualif('comprador', 'PROMITENTE COMPRADOR(A)'), { align: 'both', after: 200 }))

  if (d.conjuge_comprador_papel === 'co_comprador') {
    paras.push(
      para(qualif('conjuge_comprador', 'PROMITENTE COMPRADOR(A)'), { align: 'both', after: 200 }),
    )
  }

  // Cônjuge do vendedor como ANUENTE: não é parte alienante, comparece para consentir.
  if (d.conjuge_vendedor_papel === 'anuente') {
    paras.push(para(qualif('conjuge_vendedor', 'ANUENTE'), { align: 'both', after: 200 }))
  }

  paras.push(
    para('INTERMEDIÁRIO: {contratado_nome} — CRECI: {contratado_creci}.', {
      align: 'both',
      after: 400,
    }),
  )

  montarClausulas(d).forEach((c, i) => {
    paras.push(para(`CLÁUSULA ${i + 1}ª — ${c.titulo}. ${c.texto}`, { align: 'both', after: 200 }))
  })

  paras.push(para('{cidade_uf}, {data_extenso}.', { align: 'center', after: 600 }))

  const assinatura = (rotulo: string, prefixo: string) => [
    para('___________________________________', { align: 'center', after: 0 }),
    para(`${rotulo} — {${prefixo}_nome} — CPF: {${prefixo}_cpf}`, { align: 'center', after: 400 }),
  ]

  paras.push(...assinatura('PROMITENTE VENDEDOR(A)', 'vendedor'))
  if (d.conjuge_vendedor_papel === 'co_vendedor') {
    paras.push(...assinatura('PROMITENTE VENDEDOR(A)', 'conjuge_vendedor'))
  }
  if (d.conjuge_vendedor_papel === 'anuente') {
    paras.push(...assinatura('ANUENTE (cônjuge do vendedor)', 'conjuge_vendedor'))
  }
  paras.push(...assinatura('PROMITENTE COMPRADOR(A)', 'comprador'))
  if (d.conjuge_comprador_papel === 'co_comprador') {
    paras.push(...assinatura('PROMITENTE COMPRADOR(A)', 'conjuge_comprador'))
  }

  paras.push(
    para('Testemunhas:', { after: 200 }),
    para('1ª ___________________ Nome: ___________________________ CPF: ______________', {
      after: 100,
    }),
    para('2ª ___________________ Nome: ___________________________ CPF: ______________', {
      after: 0,
    }),
  )

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">\n<w:body>\n${paras.join('\n')}\n</w:body>\n</w:document>`
}

export function generatePromiseDocx(data: Record<string, string>): void {
  downloadDocx(buildPromiseDocumentXml(data), data, 'promessa-de-compra-e-venda.docx')
}

// Mesma minuta em texto plano, para o Validador.
export function getPromiseText(data: Record<string, string>): string {
  return getTextFromDocumentXml(buildPromiseDocumentXml(data), data)
}
