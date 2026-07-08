// Seed additional legal knowledge entries - complements 1900000000_seed_legal_knowledge.js
// Targets existing legal_knowledge collection. Idempotent: checks by code before inserting.
migrate(
  (app) => {
    const RECORDS = [
      {
        title: 'Cl\u00e1usula de Hipoteca Legal e Penalidade por Descumprimento',
        category: 'clausula_condicional',
        code: 'HIP001',
        trigger_logic: 'imovel.onus_hipoteca == true',
        content:
          'O VENDEDOR declara que sobre o im\u00f3vel recai hipoteca legal institu\u00edda em favor de {{imovel.credor_hipotecario}}, pelo saldo devedor de R$ {{imovel.saldo_hipoteca}}. O VENDEDOR compromete-se a providenciar a baixa da referida hipoteca em at\u00e9 {{imovel.prazo_baixa_hipoteca}} dias ap\u00f3s a quita\u00e7\u00e3o do d\u00e9bito, sob pena de multa di\u00e1ria de 0,5% sobre o valor do contrato, limitada a 10%.',
        priority: 75,
        version: 1,
      },
      {
        title: 'Cl\u00e1usula de Direito de Tinha e Heran\u00e7a - Invent\u00e1rio em Andamento',
        category: 'clausula_condicional',
        code: 'INV004',
        trigger_logic: 'imovel.inventario == true && imovel.sucessao == true',
        content:
          'As partes t\u00eam ci\u00eancia de que o im\u00f3vel est\u00e1 submetido a processo de invent\u00e1rio por \00f3bito do titular original, sendo a venda condicionada \u00e0 expedi\u00e7\u00e3o de formal de partilha ou alvar\u00e1 judicial de autoriza\u00e7\u00e3o para aliena\u00e7\u00e3o. O VENDEDOR compromete-se a fornecer c\u00f3pia autenticada dos autos do invent\u00e1rio e a promover todas as dilig\u00eancias necess\u00e1rias para a regular conclus\u00e3o do feito, sob pena de rescis\u00e3o contratual sem \u00f4nus para o COMPRADOR.',
        priority: 61,
        version: 1,
      },
      {
        title: 'Cl\u00e1usula de Usufruto Vital\u00edcio',
        category: 'clausula_condicional',
        code: 'USU001',
        trigger_logic: 'imovel.usufruto == true',
        content:
          'O VENDEDOR declara que sobre o im\u00f3vel recai direito real de usufruto vital\u00edcio em favor de {{imovel.usufrutuario}}, instit\u00eddo por escritura p\u00fablica devidamente registrada na matr\u00edcula n\u00ba {{imovel.matricula}}. A transfer\u00eancia da propriedade plena estar\u00e1 condicionada \u00e0 extin\u00e7\u00e3o do usufruto por morte do usufrut\u00e1rio ou ren\u00fancia formal por instrumento p\u00fablico, conforme Arts. 1.390 a 1.410 do C\u00f3digo Civil Brasileiro.',
        priority: 76,
        version: 1,
      },
      {
        title: 'Cl\u00e1usula de Reserva de Dom\u00ednio',
        category: 'clausula_condicional',
        code: 'RES002',
        trigger_logic: 'financeiro.reserva_dominio == true',
        content:
          'Nos termos do Art. 521 do C\u00f3digo Civil, fica estipulada cl\u00e1usula de reserva de dom\u00ednio, pelo que a propriedade do im\u00f3vel s\u00f3 se transfere ao COMPRADOR ap\u00f3s a quita\u00e7\u00e3o integral do pre\u00e7o ajustado. At\u00e9 ent\u00e3o, o bem permanece sob a propriedade do VENDEDOR, ressalvado o direito \u00e0 posse direta e ao exerc\u00edcio dos frutos pelo COMPRADOR, conforme pactuado.',
        priority: 78,
        version: 1,
      },
      {
        title:
          'Cl\u00e1usula de Compensa\u00e7\u00e3o e Dedu\u00e7\u00e3o de D\u00e9bitos Condominiais',
        category: 'clausula_condicional',
        code: 'TRI003',
        trigger_logic: 'imovel.debito_condominial == true',
        content:
          'Na hip\u00f3tese de exist\u00eancia de d\u00e9bitos condominiais ou fiscais incidentes sobre o im\u00f3vel at\u00e9 a data da imiss\u00e3o na posse, as partes acordam que o VENDEDOR ser\u00e1 respons\u00e1vel exclusivo por sua quita\u00e7\u00e3o. O valor correspondente aos d\u00e9bitos apurados ser\u00e1 deduzido do saldo devedor a ser pago pelo COMPRADOR, mediante apresenta\u00e7\u00e3o de comprovantes v\u00e1lidos e atualizados.',
        priority: 86,
        version: 1,
      },
      {
        title: 'Cl\u00e1usula de Venda com Pacto de Retrovenda',
        category: 'clausula_condicional',
        code: 'RET001',
        trigger_logic: 'financeiro.pacto_retrovenda == true',
        content:
          'Nos termos dos Arts. 502 a 505 do C\u00f3digo Civil, fica estipulado pacto de retrovenda, pelo qual o VENDEDOR reserva-se o direito de recobrar o im\u00f3vel dentro do prazo de {{financeiro.prazo_retrovenda}} dias, restituindo o pre\u00e7o recebido, bem como reembolsando o COMPRADOR pelas despesas do contrato e melhoramentos efetuados no im\u00f3vel, devidamente comprovados. O exerc\u00edcio do direito de retrato dever\u00e1 ser formalizado por notifica\u00e7\u00e3o extrajudicial ou judicial.',
        priority: 79,
        version: 1,
      },
      {
        title: 'Cl\u00e1usula de Preemp\u00e7\u00e3o ou Direito de Prefer\u00eancia',
        category: 'clausula_condicional',
        code: 'PRE001',
        trigger_logic: 'financeiro.preempcao == true',
        content:
          'Conforme Arts. 513 a 520 do C\u00f3digo Civil, caso o COMPRADOR decida alienar o im\u00f3vel objeto deste contrato, o VENDEDOR (ou seu sucessor) ter\u00e1 direito de prefer\u00eancia para readquiri-lo pelo mesmo pre\u00e7o e condi\u00e7\u00f5es oferecidos a terceiros. O COMPRADOR dever\u00e1 notificar o VENDEDOR por escrito, concedendo prazo de 30 (trinta) dias para o exerc\u00edcio do direito. O descumprimento desta cl\u00e1usula sujeitar\u00e1 o alienante \u00e0s perdas e danos previstas em lei.',
        priority: 80,
        version: 1,
      },
      {
        title: 'Cl\u00e1usula de Adjuda e Despesas de Intermedia\u00e7\u00e3o',
        category: 'protecao_comercial',
        code: 'COM005',
        trigger_logic: 'comissao.adjuda == true',
        content:
          'As partes reconhecem e concordam que os honor\u00e1rios de intermedia\u00e7\u00e3o imobili\u00e1ria ser\u00e3o pagos pelo {{comissao.responsavel_pagamento}}, no percentual de {{comissao.percentual}}% sobre o valor total da transa\u00e7\u00e3o, perfazendo o montante de R$ {{comissao.valor}}. Em caso de pagamentos parcelados, a comiss\u00e3o poder\u00e1 ser proporcionalmente distribu\u00edda conforme o recebimento de cada parcela, salvo acordo em contr\u00e1rio.',
        priority: 52,
        version: 1,
      },
      {
        title: 'Cl\u00e1usula de Habitacionalidade e V\u00edcios Redibit\u00f3rios',
        category: 'clausula_fixa',
        code: 'HAB001',
        trigger_logic: 'sempre',
        content:
          'Nos termos dos Arts. 441 a 456 do C\u00f3digo Civil, o VENDEDOR responde pelos v\u00edcios ocultos que tornem o im\u00f3vel impr\u00f3prio ao uso a que se destina, ou lhe diminuam o valor. O COMPRADOR poder\u00e1 requerer a rescis\u00e7\u00e3o do contrato ou abatimento do pre\u00e7o no prazo de 30 (trinta) dias, contados da ci\u00eancia do v\u00edcio. A garantia por v\u00edcios redibit\u00f3rios perdura pelo prazo decadencial de 30 (trinta) dias ap\u00f3s a entrega das chaves.',
        priority: 88,
        version: 1,
      },
      {
        title: 'Cl\u00e1usula de Saneamento e Regulariza\u00e7\u00e3o Fundi\u00e1ria',
        category: 'clausula_condicional',
        code: 'SAN001',
        trigger_logic: 'imovel.irregular_fundiaria == true',
        content:
          'As partes declaram ter ci\u00eancia de que o im\u00f3vel encontra-se em processo de regulariza\u00e7\u00e3o fundi\u00e1ria, conforme Lei n\u00ba 13.465/2017. O VENDEDOR compromete-se a apresentar, antes da outorga da escritura definitiva, a documenta\u00e7\u00e3o comprobat\u00f3ria da regulariza\u00e7\u00e3o, incluindo o registro da demarca\u00e7\u00e3o ou legitima\u00e7\u00e3o de posse, conforme aplic\u00e1vel. A falta de regulariza\u00e7\u00e3o dentro do prazo de {{imovel.prazo_regularizacao}} dias ensejar\u00e1 o direito de rescis\u00e3o sem \u00f4nus ao COMPRADOR.',
        priority: 77,
        version: 1,
      },
      {
        title: 'Lei 14.382/2022 - Moderniza\u00e7\u00e3o dos Registros P\u00fablicos',
        category: 'legislacao',
        code: 'LEI-REG-01',
        trigger_logic: '',
        content:
          'A Lei n\u00ba 14.382/2022 promoveu a moderniza\u00e7\u00e3o dos servi\u00e7os de registros p\u00fablicos, instituindo a plataforma nacional de integra\u00e7\u00e3o de dados dos registros de im\u00f3veis. Disp\u00f5e sobre a certifica\u00e7\u00e3o digital, o livre acesso \u00e0s informa\u00e7\u00f5es e a interoperabilidade entre cart\u00f3rios e \u00f3rg\u00e3os p\u00fablicos. Impacta diretamente as transa\u00e7\u00f5es imobili\u00e1rias ao acelerar o processo de registro e reduzir a burocracia documental. (Legisla\u00e7\u00e3o Prim\u00e1ria)',
        priority: 5,
        version: 1,
      },
      {
        title: 'Lei 14.060/2020 - Regulariza\u00e7\u00e3o Fundi\u00e1ria Urbana',
        category: 'legislacao',
        code: 'LEI-REG-02',
        trigger_logic: '',
        content:
          'A Lei n\u00ba 14.060/2020 alterou a Lei n\u00ba 13.465/2017 para dispor sobre a regulariza\u00e7\u00e3o fundi\u00e1ria urbana e rural de ocupa\u00e7\u00f5es incidentes em \u00e1reas de dom\u00ednio da Uni\u00e3o. Estabelece crit\u00e9rios para a titula\u00e7\u00e3o de \u00e1reas p\u00fablicas ocupadas e disp\u00f5e sobre o reconhecimento da posse e sua convers\u00e3o em propriedade. Relevante para contratos envolvendo im\u00f3veis em processo de regulariza\u00e7\u00e3o. (Legisla\u00e7\u00e3o Prim\u00e1ria)',
        priority: 5,
        version: 1,
      },
      {
        title:
          'S\u00famula 497 do STJ - Prazo Prescricional para Repeti\u00e7\u00e3o de Ind\u00e9bito',
        category: 'jurisprudencia',
        code: 'SUM-STJ-497',
        trigger_logic: '',
        content:
          'A Primeira Se\u00e7\u00e3o do Superior Tribunal de Justi\u00e7a firmou o entendimento de que o prazo prescricional para ajuizar a\u00e7\u00e3o de repeti\u00e7\u00e3o de ind\u00e9bito \u00e9 de 10 (dez) anos. Esta s\u00famula \u00e9 relevante para contratos imobili\u00e1rios que envolvam cobran\u00e7as indevidas, como taxas abusivas ou comiss\u00f5es exigidas fora dos par\u00e2metros legais, devendo os contratos prever cl\u00e1usulas claras sobre a restitui\u00e7\u00e3o de valores pagos indevidamente.',
        priority: 3,
        version: 1,
      },
      {
        title: 'Provimento CNJ 37/2021 - Escritura P\u00fablica Digital',
        category: 'legislacao',
        code: 'PROV-CNJ-37',
        trigger_logic: '',
        content:
          'O Provimento n\u00ba 37/2021 do CNJ regulamenta a lavratura de escrituras p\u00fablicas digitais, estabelecendo os requisitos para a sua valida\u00e7\u00e3o, armazenamento e disposi\u00e7\u00e3o \u00e0s partes interessadas. Permite que atos notariais sejam praticados integralmente em meio digital, com assinatura eletr\u00f4nica qualificada, conferindo seguran\u00e7a jur\u00eddica \u00e0s transa\u00e7\u00f5es imobili\u00e1rias realizadas \u00e0 dist\u00e2ncia. Aplic\u00e1vel a contratos que preveem escritura\u00e7\u00e3o digital.',
        priority: 4,
        version: 1,
      },
      {
        title:
          'Padr\u00e3o Godoy - Cl\u00e1usula de Foro de Elei\u00e7\u00e3o Espec\u00edfica por Regi\u00e3o',
        category: 'boas_praticas',
        code: 'GOD-FORO-01',
        trigger_logic:
          '{"path":"metadata.regiao","operator":"in","value":["barra","recreio","jacarepagua"]}',
        content:
          'Para neg\u00f3cios imobili\u00e1rios envolvendo im\u00f3veis situados na Barra da Tijuca, Recreio dos Bandeirantes, Camorim, Vargem Grande, Vargem Pequena e Anil, o foro de elei\u00e7\u00e3o padr\u00e3o da Godoy Prime Realty \u00e9 o Foro Regional de Jacarepagu\u00e1 da Comarca da Capital do Rio de Janeiro. Para im\u00f3veis em outras regi\u00f5es da cidade, aplica-se o foro da Comarca correspondente ao endere\u00e7o do im\u00f3vel. Esta cl\u00e1usula deve constar obrigatoriamente em todos os contratos da Godoy Prime Realty.',
        priority: 2,
        version: 2,
      },
    ]

    let col
    try {
      col = app.findCollectionByNameOrId('legal_knowledge')
    } catch (_) {
      return
    }

    for (const r of RECORDS) {
      const checkField = r.code ? 'code' : 'title'
      const checkValue = r.code || r.title
      try {
        app.findFirstRecordByData('legal_knowledge', checkField, checkValue)
        continue
      } catch (_) {}

      const rec = new Record(col)
      rec.set('title', r.title)
      rec.set('category', r.category)
      rec.set('code', r.code)
      rec.set('trigger_logic', r.trigger_logic)
      rec.set('content', r.content)
      rec.set('priority', r.priority)
      rec.set('version', r.version)
      app.save(rec)
    }
  },
  (app) => {
    const CODES = [
      'HIP001',
      'INV004',
      'USU001',
      'RES002',
      'TRI003',
      'RET001',
      'PRE001',
      'COM005',
      'HAB001',
      'SAN001',
      'LEI-REG-01',
      'LEI-REG-02',
      'SUM-STJ-497',
      'PROV-CNJ-37',
      'GOD-FORO-01',
    ]

    let col
    try {
      col = app.findCollectionByNameOrId('legal_knowledge')
    } catch (_) {
      return
    }

    for (const code of CODES) {
      try {
        const rec = app.findFirstRecordByData('legal_knowledge', 'code', code)
        app.delete(rec)
      } catch (_) {}
    }
  },
)
