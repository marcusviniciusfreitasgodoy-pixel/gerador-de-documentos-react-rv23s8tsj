// Base de Conhecimento (legal_knowledge) - 109 registros VERBATIM (base viva Godoy).
// ASCII puro (acentos em \uXXXX) - imune a corrupcao de encoding no paste.
// COLE PELO EDITOR DE CODIGO, nunca via agente.
migrate(
  (app) => {
    const RECORDS = [
      {
        title: 'Gold Standard - Promessa de Compra e Venda',
        category: 'boas_praticas',
        code: 'GOLD_PROMESSA_01',
        trigger_logic:
          '{"path":"metadata.tipo_contrato","operator":"==","value":"promessa_compra_venda"}',
        content:
          'INSTRUMENTO PARTICULAR DE PROMESSA DE COMPRA E VENDA\n\nCL\u00c1USULA PRIMEIRA - DAS PARTES\nVENDEDOR: [NOME DO VENDEDOR], [NACIONALIDADE DO VENDEDOR], [ESTADO CIVIL DO VENDEDOR], [PROFISS\u00c3O DO VENDEDOR], portador do RG n\u00ba [RG DO VENDEDOR] expedido pelo [ORG\u00c3O EMISSOR DO VENDEDOR], inscrito no CPF sob o n\u00ba [CPF DO VENDEDOR], residente e domiciliado em [ENDERE\u00c7O DO VENDEDOR].\n\nCOMPRADOR: [NOME DO COMPRADOR], [NACIONALIDADE DO COMPRADOR], [ESTADO CIVIL DO COMPRADOR], [PROFISS\u00c3O DO COMPRADOR], portador do RG n\u00ba [RG DO COMPRADOR] expedido pelo [ORG\u00c3O EMISSOR DO COMPRADOR], inscrito no CPF sob o n\u00ba [CPF DO COMPRADOR], residente e domiciliado em [ENDERE\u00c7O DO COMPRADOR].\n\nCL\u00c1USULA SEGUNDA - DO OBJETO\nO objeto do presente contrato \u00e9 o im\u00f3vel situado em [ENDERE\u00c7O DO IM\u00d3VEL], matr\u00edcula n\u00ba [MATR\u00cdCULA DO IM\u00d3VEL], com \u00e1rea total de [\u00c1REA TOTAL DO IM\u00d3VEL] m\u00b2, inscri\u00e7\u00e3o IPTU n\u00ba [IPTU DO IM\u00d3VEL].\n\nCL\u00c1USULA TERCEIRA - DO PRE\u00c7O E CONDI\u00c7\u00d5ES DE PAGAMENTO\nO pre\u00e7o certo e ajustado \u00e9 de [VALOR TOTAL] ([VALOR TOTAL POR EXTENSO]), pago da seguinte forma:\n- Sinal: [VALOR DO SINAL] ([VALOR DO SINAL POR EXTENSO])\n- Forma de Pagamento: [FORMA DE PAGAMENTO]\n[CONDI\u00c7\u00d5ES DE PAGAMENTO DETALHADAS]\n\nCL\u00c1USULA QUARTA - DA POSSE\nA posse direta ser\u00e1 transferida ao COMPRADOR conforme acordado entre as partes.\n\nCL\u00c1USULA QUINTA - DAS PENALIDADES\nFica estipulada multa de 10% sobre o valor do contrato para a parte que infringir qualquer cl\u00e1usula.\n\nCL\u00c1USULA SEXTA - DA COMISS\u00c3O DE CORRETAGEM\nA comiss\u00e3o de corretagem ser\u00e1 de [COMISS\u00c3O PERCENTUAL]% sobre o valor da transa\u00e7\u00e3o.\n\nCL\u00c1USULA S\u00c9TIMA - DA PREVEN\u00c7\u00c3O \u00c0 LAVAGEM DE DINHEIRO (PLD-FT)\nEm atendimento ao Provimento CNJ n\u00ba 88/2019, o COMPRADOR declara que os recursos utilizados t\u00eam origem l\u00edcita.\n\nCL\u00c1USULA OITAVA - DA LGPD\nAs partes autorizam o tratamento de dados pessoais nos termos da Lei n\u00ba 13.709/2018.\n\nCL\u00c1USULA NONA - DO FORO\nFica eleito o foro da comarca para dirimir quaisquer d\u00favidas.\n\n[DATA POR EXTENSO]\n\n_________________________________________________\nVENDEDOR: [NOME DO VENDEDOR]\n\n_________________________________________________\nCOMPRADOR: [NOME DO COMPRADOR]\n\n_________________________________________________\nTESTEMUNHA 1\n\n_________________________________________________\nTESTEMUNHA 2',
        priority: 1,
        version: 3,
      },
      {
        title: 'Gold Standard - Autoriza\u00e7\u00e3o de Intermedia\u00e7\u00e3o',
        category: 'boas_praticas',
        code: 'GOLD_AUT_01',
        trigger_logic:
          '{"path":"metadata.tipo_contrato","operator":"==","value":"autorizacao_intermediacao"}',
        content:
          'AUTORIZA\u00c7\u00c3O PARA DIVULGA\u00c7\u00c3O E VENDA DE IM\u00d3VEL\n\nCONTRATANTES\nNOME: [NOME DO VENDEDOR]\nRG: [RG DO VENDEDOR] ORG\u00c3O EMISSOR: [ORG\u00c3O EMISSOR DO VENDEDOR]\nCPF: [CPF DO VENDEDOR]\nNACIONALIDADE: [NACIONALIDADE DO VENDEDOR]\nESTADO CIVIL: [ESTADO CIVIL DO VENDEDOR]\nPROFISS\u00c3O: [PROFISS\u00c3O DO VENDEDOR]\nENDERE\u00c7O: [ENDERE\u00c7O DO VENDEDOR]\nTELEFONE: [TELEFONE DO VENDEDOR]\nE-MAIL: [E-MAIL DO VENDEDOR]\n\nDESCRI\u00c7\u00c3O DO IM\u00d3VEL\nENDERE\u00c7O: [ENDERE\u00c7O DO IM\u00d3VEL]\nBAIRRO: [BAIRRO DO IM\u00d3VEL]\nCIDADE: [CIDADE DO IM\u00d3VEL] - [ESTADO DO IM\u00d3VEL]\nCEP: [CEP DO IM\u00d3VEL]\nMATR\u00cdCULA: [MATR\u00cdCULA DO IM\u00d3VEL]\nIPTU: [IPTU DO IM\u00d3VEL]\n\u00c1REA TOTAL: [\u00c1REA TOTAL DO IM\u00d3VEL] m\u00b2\nVAGAS: [VAGAS DO IM\u00d3VEL]\nQUARTOS: [QUARTOS DO IM\u00d3VEL]\n\nVALOR DE AVALIA\u00c7\u00c3O: [VALOR DE AVALIA\u00c7\u00c3O]\nVALOR DE VENDA: [VALOR TOTAL]\n\nCONDI\u00c7\u00d5ES\n1. A presente Autoriza\u00e7\u00e3o de Venda, [TIPO DE EXCLUSIVIDADE], tem seu amparo na Lei 6.530, Art. 20, item III, de 12/05/1978 e pela Resolu\u00e7\u00e3o do COFECI n\u00ba 458/95 de 17/11/1995.\n\n2. \u00c9 concedida esta autoriza\u00e7\u00e3o pelo prazo de [PRAZO DE VIG\u00caNCIA] dias, a contar desta data, incluindo a veicula\u00e7\u00e3o de an\u00fancios e fotos do im\u00f3vel em todos os meios de publicidade utilizados pelo CONTRATADO.\n\n3. Os CONTRATANTES se comprometem a pagar ao CONTRATADO o percentual de [COMISS\u00c3O PERCENTUAL]% sobre o pre\u00e7o de venda efetivamente transacionado, a t\u00edtulo de honor\u00e1rios de corretagem.\n\n4. A mesma remunera\u00e7\u00e3o ser\u00e1 devida se, durante a vig\u00eancia desta autoriza\u00e7\u00e3o, o propriet\u00e1rio realizar a venda do im\u00f3vel sem a ci\u00eancia do CONTRATADO.\n\n5. Os CONTRATANTES se responsabilizam por todas as informa\u00e7\u00f5es prestadas acerca do im\u00f3vel.\n\n6. Fica eleito o foro da Comarca do Rio de Janeiro para dirimir eventuais d\u00favidas.\n\n[DATA POR EXTENSO]\n\n_________________________________________________\nNOME: [NOME DO VENDEDOR]\nCONTRATANTE(S)\nCPF: [CPF DO VENDEDOR]',
        priority: 1,
        version: 3,
      },
      {
        title: 'Gold Standard - Recibo de Sinal (Verbatim)',
        category: 'clausula_fixa',
        code: 'GOLD_RECIBO_01',
        trigger_logic: '{"path":"metadata.tipo_contrato","operator":"==","value":"recibo_sinal"}',
        content:
          'RECIBO DE SINAL\nArts. 417 a 420 do C\u00f3digo Civil\n\nQUALIFICA\u00c7\u00c3O DAS PARTES\n\nVENDEDOR: {{vendedor_nome}}, {{vendedor_nacionalidade}}, {{vendedor_qualificacao_civil}}, {{vendedor_profissao}}, portador do RG n\u00ba {{vendedor_rg}}, inscrito no CPF sob o n\u00ba {{vendedor_cpf}}, residente e domiciliado em {{vendedor_endereco}}.\n\nCOMPRADOR: {{comprador_nome}}, {{comprador_nacionalidade}}, {{comprador_qualificacao_civil}}, {{comprador_profissao}}, portador do RG n\u00ba {{comprador_rg}}, inscrito no CPF sob o n\u00ba {{comprador_cpf}}, residente e domiciliado em {{comprador_endereco}}.\n\nOBJETO\n\nIm\u00f3vel situado em {{imovel_endereco}}, matr\u00edcula n\u00ba {{imovel_matricula}}, registrado no Registro de Im\u00f3veis sob o n\u00ba {{imovel_ri}}, comarca de {{imovel_comarca}}, inscri\u00e7\u00e3o municipal (IPTU) n\u00ba {{imovel_iptu}}.\n\nValor total do im\u00f3vel: R$ {{valor_total}} ({{valor_total_extenso}}).\nSinal recebido: R$ {{valor_sinal}} ({{valor_sinal_extenso}}).\nrestando o saldo de R$ {{valor_saldo}} ({{valor_saldo_extenso}}), a ser pago na forma e nas datas ajustadas no contrato de compra e venda / promessa de compra e venda firmado entre as partes (CC art. 417).\n\nCL\u00c1USULA 1\u00aa \u2014 IMPUTA\u00c7\u00c3O NO PRE\u00c7O\n\nO valor recebido a t\u00edtulo de sinal \u00e9 imputado no pre\u00e7o total da transa\u00e7\u00e3o, constituindo parte integrante do pagamento do im\u00f3vel objeto deste recibo.\n\nCL\u00c1USULA 2\u00aa \u2014 DA NATUREZA DAS ARRAS\n\n{{check_confirmatoria}} Arras Confirmat\u00f3rias (Arts. 417 a 419, CC) \u2014 O sinal confirma o neg\u00f3cio jur\u00eddico. Em caso de descumprimento pelo COMPRADOR, perder\u00e1 o valor integral do sinal. Em caso de descumprimento pelo VENDEDOR, dever\u00e1 restituir o valor em dobro.\n\n{{check_penitencial}} Arras Penitenciais (Art. 420, CC) \u2014 As partes poder\u00e3o retratar-se do neg\u00f3cio, perdendo o COMPRADOR o sinal pago, ou restituindo o VENDEDOR o valor em dobro.\n\nCL\u00c1USULA 3\u00aa \u2014 DAS CONDI\u00c7\u00d5ES DE PAGAMENTO\n\nAs partes obrigam-se a celebrar o contrato definitivo de compra e venda / a escritura p\u00fablica no prazo de {{prazo_formalizacao_dias}} ({{prazo_formalizacao_extenso}}) dias corridos, a contar desta data.\n\nCL\u00c1USULA 4\u00aa \u2014 RESTITUI\u00c7\u00c3O POR FATO ALHEIO \u00c0S PARTES\n\nNa hip\u00f3tese de desfazimento do neg\u00f3cio por fato alheio \u00e0 vontade das partes, os valores pagos ser\u00e3o restitu\u00eddos no prazo de {{prazo_restituicao_dias}} ({{prazo_restituicao_extenso}}) dias \u00fateis, sem incid\u00eancia de penalidades.\n\nCL\u00c1USULA 5\u00aa \u2014 ELEI\u00c7\u00c3O DE FORO\n\nFica eleito o foro da comarca de {{foro_comarca}} para dirimir quaisquer controv\u00e9rsias oriundas do presente recibo.\n\nE, por estarem cientes e de acordo, firmam o presente em duas vias de igual teor.\n\n{{cidade_uf}}, {{data_extenso}}.\n\n_________________________________________________\nVENDEDOR: {{vendedor_nome}}\nCPF: {{vendedor_cpf}}\n\n_________________________________________________\nCOMPRADOR: {{comprador_nome}}\nCPF: {{comprador_cpf}}',
        priority: 1,
        version: 7,
      },
      {
        title: 'Gold Standard - Checklist Documental',
        category: 'checklist_documental',
        code: 'CHK_GOLD_01',
        trigger_logic:
          '{"path":"metadata.tipo_contrato","operator":"==","value":"checklist_documental"}',
        content:
          '### 1. Documenta\u00e7\u00e3o das Partes\n#### 1.1 Pessoa F\u00edsica\n- RG/CPF ou CNH\n- Comprovante de Resid\u00eancia\n#### 1.2 Pessoa Jur\u00eddica (PJ)\n- Contrato Social consolidado\n- CNPJ\n- Certid\u00e3o Simplificada da Junta Comercial\n\n### 2. Documenta\u00e7\u00e3o do Im\u00f3vel\n- Matr\u00edcula Atualizada (com \u00f4nus e a\u00e7\u00f5es)\n- Certid\u00e3o de Quita\u00e7\u00e3o Fiscal (IPTU)\n\n### 3. Vendedor / Propriet\u00e1rio\n- Certid\u00f5es Negativas C\u00edveis, Criminais e Trabalhistas\n\n### 4. Due Diligence\n- An\u00e1lise de riscos apontados nas certid\u00f5es e na matr\u00edcula\n- Verifica\u00e7\u00e3o de processos em tr\u00e2mite que possam afetar o patrim\u00f4nio\n\n### 5. Compliance\n- Verifica\u00e7\u00e3o de PEP (Pessoa Politicamente Exposta)\n- Adequa\u00e7\u00e3o \u00e0 LGPD no tratamento dos dados coletados',
        priority: 1,
        version: 1,
      },
      {
        title: 'Gold Standard - Recibo de Sinal e Arras',
        category: 'boas_praticas',
        code: 'ARRAS_GOLD_01',
        trigger_logic: '{"path":"metadata.tipo_contrato","operator":"==","value":"recibo_sinal"}',
        content:
          'Com base nos Artigos 417 a 420 do C\u00f3digo Civil Brasileiro, este recibo formaliza o pagamento do sinal.\n\n**Natureza das Arras:**\n- Arras Confirmat\u00f3rias (Art. 417 a 419, CC) - tornam o neg\u00f3cio irretrat\u00e1vel, n\u00e3o admitindo arrependimento.\n- Arras Penitenciais (Art. 420, CC) - garantem o direito de arrependimento, com a perda do sinal por quem o deu, ou a devolu\u00e7\u00e3o em dobro por quem o recebeu.\n\nA responsabilidade por eventuais desist\u00eancias seguir\u00e1 rigorosamente as estipula\u00e7\u00f5es legais referentes \u00e0 natureza das arras escolhida pelas partes.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Gold Standard - Termo de Entrega das Chaves',
        category: 'boas_praticas',
        code: 'CHAVES_GOLD_01',
        trigger_logic:
          '{"path":"metadata.tipo_contrato","operator":"==","value":"termo_entrega_chaves"}',
        content:
          'Formaliza-se a entrega f\u00edsica das chaves do im\u00f3vel objeto da transa\u00e7\u00e3o.\n\n**Leitura dos Medidores:**\n- \u00c1gua: {{imovel.caracteristicas.leitura_agua}}\n- Luz: {{imovel.caracteristicas.leitura_luz}}\n- G\u00e1s: {{imovel.caracteristicas.leitura_gas}}\n\n**Aviso Legal:** A entrega f\u00edsica das chaves e a imiss\u00e3o na posse n\u00e3o substituem a necessidade de registro do t\u00edtulo translativo no Registro de Im\u00f3veis competente para a efetiva transfer\u00eancia da propriedade, conforme prev\u00ea o Art. 1.245 do C\u00f3digo Civil.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Gold Standard - Termo de Transmiss\u00e3o da Posse',
        category: 'boas_praticas',
        code: 'POSSE_GOLD_01',
        trigger_logic: '{"path":"metadata.tipo_contrato","operator":"==","value":"termo_posse"}',
        content:
          'O COMPRADOR \u00e9 imitido na posse do im\u00f3vel a partir de {{posse.data_posse}}, passando a exercer a posse com *animus domini*.\n\n**Propriedade (Art. 1.245, CC):** Reconhece-se que a transfer\u00eancia efetiva da propriedade dar-se-\u00e1 apenas com o registro da Escritura P\u00fablica no respectivo cart\u00f3rio competente.\n\n**Divis\u00e3o Pro Rata (Art. 130, CTN):** As partes acordam que os impostos (IPTU), taxas e despesas condominiais ser\u00e3o divididos *pro rata* at\u00e9 a presente data, cabendo ao VENDEDOR a responsabilidade pelos d\u00e9bitos anteriores \u00e0 imiss\u00e3o na posse, e ao COMPRADOR os d\u00e9bitos posteriores.\n\n**Estado de Conserva\u00e7\u00e3o:**\nO im\u00f3vel \u00e9 entregue nas seguintes condi\u00e7\u00f5es vistoriadas: {{imovel.caracteristicas.estado_conservacao}}',
        priority: 1,
        version: 1,
      },
      {
        title: 'Lei do Distrato - Patrim\u00f4nio de Afeta\u00e7\u00e3o',
        category: 'distrato',
        code: 'LEI-DISTRATO-02',
        trigger_logic: '',
        content:
          'Quando a incorpora\u00e7\u00e3o estiver submetida ao regime do patrim\u00f4nio de afeta\u00e7\u00e3o, o incorporador poder\u00e1 reter at\u00e9 50% (cinquenta por cento) dos valores pagos.',
        priority: 101,
        version: 1,
      },
      {
        title: 'Cl\u00e1usula de Permuta com Torna',
        category: 'permuta',
        code: 'PERMUTA-01',
        trigger_logic: '{"path": "metadata.tipo_negociacao", "operator": "==", "value": "permuta"}',
        content:
          'As partes ajustam a permuta dos im\u00f3veis descritos no objeto deste contrato. Sendo os im\u00f3veis de valores distintos, fica convencionado o pagamento de torna em dinheiro no valor de {{financeiro.valor_torna}} pelo contratante.',
        priority: 50,
        version: 1,
      },
      {
        title: 'Checklist Documental - Lei 7.433/85',
        category: 'checklist_documental',
        code: 'CHECKLIST-01',
        trigger_logic: '',
        content:
          'Documentos exigidos nos termos da Lei n\u00ba 7.433/1985 para a lavratura da escritura p\u00fablica: I - certid\u00e3o de \u00f4nus reais; II - certid\u00e3o de quita\u00e7\u00e3o de tributos imobili\u00e1rios; III - certid\u00f5es de feitos ajuizados.',
        priority: 10,
        version: 1,
      },
      {
        title: 'Lei do Distrato - Reten\u00e7\u00e3o Padr\u00e3o (Lei 13.786/2018)',
        category: 'distrato',
        code: 'LEI-DISTRATO-01',
        trigger_logic: '',
        content:
          'Em caso de desfazimento do contrato celebrado exclusivamente com o incorporador, a pena convencional n\u00e3o poder\u00e1 exceder a 25% (vinte e cinco por cento) da quantia paga.',
        priority: 100,
        version: 1,
      },
      {
        title: 'Cl\u00e1usula de Arbitragem',
        category: 'clausula_condicional',
        code: 'MED002',
        trigger_logic: '{"path":"compliance.arbitragem","value":true}',
        content:
          'Fica eleito o ju\u00edzo arbitral para dirimir, de forma definitiva, qualquer controv\u00e9rsia derivada do presente instrumento.',
        priority: 190,
        version: 1,
      },
      {
        title: 'Vistoria Obrigat\u00f3ria',
        category: 'clausula_condicional',
        code: 'VIS001',
        trigger_logic: '{"path":"posse.vistoria_obrigatoria","value":true}',
        content:
          'A entrega das chaves est\u00e1 condicionada \u00e0 realiza\u00e7\u00e3o de vistoria pr\u00e9via pelo COMPRADOR, atestando as condi\u00e7\u00f5es do im\u00f3vel.',
        priority: 168,
        version: 1,
      },
      {
        title: 'Plataforma Assinatura Eletr\u00f4nica',
        category: 'clausula_condicional',
        code: 'ELE001',
        trigger_logic: '{"path":"compliance.assinatura_eletronica","value":true}',
        content:
          'Este contrato ser\u00e1 assinado digitalmente por meio da plataforma {{compliance.plataforma_assinatura}}, com validade legal nos termos da MP 2.200-2/2001.',
        priority: 170,
        version: 1,
      },
      {
        title: 'Cl\u00e1usula de Media\u00e7\u00e3o',
        category: 'clausula_condicional',
        code: 'MED001',
        trigger_logic: '{"path":"compliance.mediacao","value":true}',
        content:
          'As partes comprometem-se a submeter eventuais lit\u00edgios a uma c\u00e2mara de media\u00e7\u00e3o extrajudicial antes de postular no Poder Judici\u00e1rio.',
        priority: 180,
        version: 1,
      },
      {
        title: 'Inadimpl\u00eancia',
        category: 'clausula_fixa',
        code: 'INA001',
        trigger_logic: '',
        content:
          'O n\u00e3o pagamento pontual de qualquer parcela sujeitar\u00e1 o COMPRADOR ao pagamento de juros de mora de 1% ao m\u00eas e corre\u00e7\u00e3o monet\u00e1ria.',
        priority: 162,
        version: 1,
      },
      {
        title: 'Rescis\u00e3o por Justa Causa',
        category: 'clausula_fixa',
        code: 'RES001',
        trigger_logic: '',
        content:
          'O descumprimento de qualquer cl\u00e1usula, n\u00e3o sanado ap\u00f3s notifica\u00e7\u00e3o de 15 dias, dar\u00e1 ensejo \u00e0 rescis\u00e3o de pleno direito.',
        priority: 164,
        version: 1,
      },
      {
        title: 'Evic\u00e7\u00e3o',
        category: 'clausula_fixa',
        code: 'GAR001',
        trigger_logic: '',
        content:
          'O VENDEDOR responde pelos riscos da evic\u00e7\u00e3o de direito, obrigando-se a resguardar o COMPRADOR de quaisquer turba\u00e7\u00f5es de terceiros.',
        priority: 166,
        version: 1,
      },
      {
        title: 'Regime de Bens Vendedor',
        category: 'clausula_condicional',
        code: 'CAS002',
        trigger_logic: '{"path":"vendedor.estado_civil","value":"Casado"}',
        content:
          'O VENDEDOR e seu c\u00f4njuge s\u00e3o casados sob o regime de {{vendedor.regime_bens}}, declarando ambos plena capacidade para a presente aliena\u00e7\u00e3o.',
        priority: 151,
        version: 1,
      },
      {
        title: 'Im\u00f3vel em Invent\u00e1rio',
        category: 'clausula_condicional',
        code: 'INV001',
        trigger_logic: '{"path":"imovel.situacao_juridica.inventario","value":true}',
        content:
          'O VENDEDOR declara que o im\u00f3vel \u00e9 objeto de invent\u00e1rio, comprometendo-se a apresentar o formal de partilha ou alvar\u00e1 judicial autorizando a venda.',
        priority: 160,
        version: 1,
      },
      {
        title: 'Tributos Comprador',
        category: 'clausula_fixa',
        code: 'TRI002',
        trigger_logic: '',
        content:
          'A partir da data da posse, correr\u00e3o por conta exclusiva do COMPRADOR todas as despesas incidentes sobre o im\u00f3vel.',
        priority: 141,
        version: 1,
      },
      {
        title: 'Declara\u00e7\u00e3o de Anu\u00eancia e Outorga do C\u00f4njuge/Companheiro',
        category: 'clausula_condicional',
        code: 'CAS001',
        trigger_logic: 'vendedor.estado_civil == "Casado"',
        content:
          'Interv\u00e9m, expressa e conjuntamente no presente instrumento, na qualidade de anuente solid\u00e1rio, o c\u00f4njuge do Vendedor, Sr(a). {{vendedor.conjuge}}, outorgando sua irrevog\u00e1vel anu\u00eancia ux\u00f3ria e consentimento material com os termos, pre\u00e7o, forma de pagamento e prazos entabulados para a venda, a fim de conferir inteira efic\u00e1cia e validade ao presente neg\u00f3cio jur\u00eddico.',
        priority: 11,
        version: 1,
      },
      {
        title:
          'Regular Representa\u00e7\u00e3o por Instrumento de Procura\u00e7\u00e3o P\u00fablica',
        category: 'clausula_condicional',
        code: 'REP001',
        trigger_logic: 'comprador.procurador == true || vendedor.procurador == true',
        content:
          'Neste ato negocial, a respectiva parte declara e comprova encontrar-se devidamente representada pelo seu outorgado procurador, constitu\u00eddo por for\u00e7a de instrumento p\u00fablico de procura\u00e7\u00e3o lavrado em Notas, dotado de poderes irrevog\u00e1veis, especiais, espec\u00edficos e aptos a legitimar a aliena\u00e7\u00e3o, aquisi\u00e7\u00e3o, transig\u00eancia e a subscri\u00e7\u00e3o formal deste compromisso de compra e venda.',
        priority: 12,
        version: 1,
      },
      {
        title:
          'Assun\u00e7\u00e3o de Obriga\u00e7\u00e3o de Baixa de \u00d4nus e Restri\u00e7\u00f5es',
        category: 'clausula_condicional',
        code: 'ONU003',
        trigger_logic: 'imovel.onus == true',
        content:
          'Em virtude da constata\u00e7\u00e3o e ci\u00eancia acerca da exist\u00eancia de apontamentos, penhoras, a\u00e7\u00f5es em curso ou demais restri\u00e7\u00f5es averbadas, o Vendedor obriga-se de forma exclusiva, pessoal e irrevog\u00e1vel a diligenciar e promover a integral e tempestiva baixa de todos os gravames de forma a tornar o im\u00f3vel perfeitamente livre e desembara\u00e7ado para transfer\u00eancia legal.',
        priority: 72,
        version: 1,
      },
      {
        title: 'Declara\u00e7\u00e3o de Venda em Car\u00e1ter Ad Corpus',
        category: 'clausula_fixa',
        code: 'ONU004',
        trigger_logic: 'sempre',
        content:
          'A presente venda e compra processa-se expressamente sob a modalidade "ad corpus", restando estabelecido que as dimens\u00f5es da \u00e1rea do im\u00f3vel s\u00e3o mencionadas apenas de forma referencial e enunciativa. Consequentemente, as partes abdicam de postular futuramente qualquer abatimento de pre\u00e7o, acr\u00e9scimo de valor ou suplementa\u00e7\u00e3o de \u00e1rea sob alega\u00e7\u00e3o de eventual diverg\u00eancia com a realidade f\u00edsica.',
        priority: 73,
        version: 1,
      },
      {
        title: 'Cabal Regularidade Fiscal, Tribut\u00e1ria e Condominial',
        category: 'clausula_fixa',
        code: 'TRI001',
        trigger_logic: 'sempre',
        content:
          'O Vendedor declara formalmente, sob todas as san\u00e7\u00f5es e penas estatu\u00eddas em lei, que inexistem pend\u00eancias fiscais, tribut\u00e1rias, d\u00edvidas condominiais, cota extra, ou obriga\u00e7\u00f5es de natureza propter rem atreladas e incidentes sobre a referida propriedade imobili\u00e1ria, responsabilizando-se pelo pagamento e quita\u00e7\u00e3o de qualquer d\u00e9bito relativo a fatos geradores anteriores \u00e0 efetiva imiss\u00e3o na posse do Comprador.',
        priority: 85,
        version: 1,
      },
      {
        title: 'Autoriza\u00e7\u00e3o e Ciente sobre Tratamento de Dados (LGPD)',
        category: 'clausula_fixa',
        code: 'LGP001',
        trigger_logic: 'sempre',
        content:
          'Em rigorosa adequa\u00e7\u00e3o \u00e0 Lei Geral de Prote\u00e7\u00e3o de Dados (Lei n\u00ba 13.709/18), os envolvidos declaram-se cientes e expressamente concordam que as suas informa\u00e7\u00f5es e dados pessoais coletados neste instrumento ou em anexos complementares ser\u00e3o tratados exclusivamente com a finalidade de gest\u00e3o, execu\u00e7\u00e3o contratual, faturamento, e para o escorreito cumprimento de imperativos legais, fiscais, ou determina\u00e7\u00f5es de \u00f3rg\u00e3os registrais e tabelionatos.',
        priority: 95,
        version: 1,
      },
      {
        title: 'Sub-roga\u00e7\u00e3o Autom\u00e1tica no Contrato de Loca\u00e7\u00e3o',
        category: 'clausula_condicional',
        code: 'LOC003',
        trigger_logic: 'imovel.locado == true && posse.imediata == true',
        content:
          'Com a assinatura deste compromisso e consequente transmiss\u00e3o da posse indireta, o Comprador sub-roga-se de pleno direito em todas as prerrogativas, direitos e deveres legais origin\u00e1rios do Vendedor e decorrentes do referido contrato de loca\u00e7\u00e3o vigente.',
        priority: 62,
        version: 1,
      },
      {
        title: 'Aliena\u00e7\u00e3o Fiduci\u00e1ria Pendente e Responsabilidade por Baixa',
        category: 'clausula_condicional',
        code: 'ONU001',
        trigger_logic: 'imovel.financiado == true',
        content:
          'As partes atestam que o im\u00f3vel encontra-se gravado com cl\u00e1usula de aliena\u00e7\u00e3o fiduci\u00e1ria em garantia junto ao credor origin\u00e1rio. O Vendedor assume o compromisso irrevog\u00e1vel de promover a total quita\u00e7\u00e3o e averba\u00e7\u00e3o de baixa do aludido gravame perante a matr\u00edcula, antecedendo a outorga da escritura definitiva.',
        priority: 70,
        version: 1,
      },
      {
        title: 'Ci\u00eancia de Im\u00f3vel em Processo de Invent\u00e1rio',
        category: 'clausula_condicional',
        code: 'ONU002',
        trigger_logic: 'imovel.inventario == true',
        content:
          'As partes reconhecem ci\u00eancia de que o bem alienado encontra-se em regular processo de invent\u00e1rio e partilha. A lavratura da escritura definitiva ocorrer\u00e1 mediante expedi\u00e7\u00e3o de competente Alvar\u00e1 Judicial autorizativo, responsabilizando-se o esp\u00f3lio ou os herdeiros pelo escorreito tr\u00e2mite do feito.',
        priority: 71,
        version: 1,
      },
      {
        title: 'Comiss\u00e3o Assegurada em Caso de Rescis\u00e3o',
        category: 'protecao_comercial',
        code: 'COM002',
        trigger_logic: 'comissao.garantida == true',
        content:
          'Fica mutuamente reconhecido e aceito que a superveniente rescis\u00e3o ou distrato deste instrumento por arrependimento, culpa ou infra\u00e7\u00e3o de qualquer das partes n\u00e3o elidir\u00e1, sob nenhuma hip\u00f3tese, a exigibilidade do pagamento integral da comiss\u00e3o de corretagem aos profissionais respons\u00e1veis pela aproxima\u00e7\u00e3o \u00fatil das partes.',
        priority: 51,
        version: 1,
      },
      {
        title: 'Declara\u00e7\u00e3o e Ci\u00eancia de Loca\u00e7\u00e3o Vigente',
        category: 'clausula_condicional',
        code: 'LOC001',
        trigger_logic: 'imovel.locado == true',
        content:
          'O Comprador atesta e declara ter ci\u00eancia inequ\u00edvoca de que o im\u00f3vel objeto do presente contrato encontra-se atualmente locado a terceiros, existindo contrato formal de loca\u00e7\u00e3o em plena vig\u00eancia, cujo teor o Comprador analisou e aceitou.',
        priority: 60,
        version: 1,
      },
      {
        title: 'Prova de Ren\u00fancia ao Direito de Prefer\u00eancia do Locat\u00e1rio',
        category: 'clausula_condicional',
        code: 'LOC002',
        trigger_logic: 'imovel.locado == true',
        content:
          'O Vendedor declara e comprova cabalmente neste ato que o atual locat\u00e1rio do im\u00f3vel renunciou de forma tempestiva e expressa ao seu direito de prefer\u00eancia para a aquisi\u00e7\u00e3o da unidade, conforme notifica\u00e7\u00e3o e carta de ren\u00fancia assinadas e com firmas reconhecidas, cujas c\u00f3pias foram entregues ao Comprador.',
        priority: 61,
        version: 1,
      },
      {
        title: 'Multa Di\u00e1ria por Atraso na Desocupa\u00e7\u00e3o',
        category: 'clausula_condicional',
        code: 'POS003',
        trigger_logic: 'imovel.ocupado == true',
        content:
          'Na hip\u00f3tese de o Vendedor n\u00e3o desocupar e entregar as chaves do im\u00f3vel na data expressamente aprazada, este incorrer\u00e1 no pagamento de multa penal e n\u00e3o compensat\u00f3ria no valor de R$ {{posse.multa_desocupacao}} por dia de atraso, sem preju\u00edzo da responsabilidade por eventuais perdas e danos causados.',
        priority: 41,
        version: 1,
      },
      {
        title: 'Responsabilidade por Conserva\u00e7\u00e3o at\u00e9 a Entrega',
        category: 'clausula_condicional',
        code: 'POS004',
        trigger_logic: 'posse.imediata == false',
        content:
          'At\u00e9 a data e momento da efetiva entrega das chaves e imiss\u00e3o na posse pelo Comprador, o Vendedor obriga-se a zelar e manter o im\u00f3vel rigorosamente no mesmo estado de conserva\u00e7\u00e3o em que se encontra nesta data, respondendo integralmente por deteriora\u00e7\u00f5es ou danos ocorridos no \u00ednterim.',
        priority: 42,
        version: 1,
      },
      {
        title: 'Pagamento da Comiss\u00e3o de Corretagem',
        category: 'protecao_comercial',
        code: 'COM001',
        trigger_logic: 'comissao.valor > 0',
        content:
          'Pela exitosa intermedia\u00e7\u00e3o do presente neg\u00f3cio imobili\u00e1rio, fica reconhecida como devida a comiss\u00e3o de corretagem, estabelecida no percentual de {{comissao.percentual}}% sobre o valor da transa\u00e7\u00e3o, perfazendo o montante de R$ {{comissao.valor}}, devida exclusivamente pela parte comissionante.',
        priority: 50,
        version: 1,
      },
      {
        title: 'Vencimento Antecipado da D\u00edvida',
        category: 'clausula_condicional',
        code: 'FIN006',
        trigger_logic: 'financeiro.parcelas > 1',
        content:
          'O atraso cont\u00ednuo e ininterrupto superior a 30 (trinta) dias no pagamento de qualquer das parcelas estipuladas acarretar\u00e1 o vencimento imediato e antecipado de todo o saldo devedor vincendo, tornando o presente instrumento t\u00edtulo executivo extrajudicial.',
        priority: 27,
        version: 1,
      },
      {
        title: 'Posse Direta e Imediata',
        category: 'clausula_condicional',
        code: 'POS001',
        trigger_logic: 'posse.imediata == true',
        content:
          'A posse direta, justa e prec\u00e1ria do im\u00f3vel \u00e9 transmitida ao Comprador neste ato, mediante a tradi\u00e7\u00e3o e entrega formal das chaves, momento a partir do qual este passar\u00e1 a arcar integralmente com todos os impostos, taxas, contas de consumo e condom\u00ednio incidentes sobre a unidade.',
        priority: 40,
        version: 1,
      },
      {
        title: 'Transmiss\u00e3o da Posse Futura',
        category: 'clausula_condicional',
        code: 'POS002',
        trigger_logic: 'posse.imediata == false',
        content:
          'A posse direita do im\u00f3vel ser\u00e1 integralmente transferida ao Comprador na data preestabelecida de {{posse.data_posse}}, devendo o im\u00f3vel ser entregue inteiramente livre e desocupado de pessoas ou coisas n\u00e3o constantes da negocia\u00e7\u00e3o, condicionando-se tal ato ao pagamento da etapa correspondente do saldo devedor.',
        priority: 40,
        version: 1,
      },
      {
        title: 'Uso de Recursos do FGTS',
        category: 'clausula_condicional',
        code: 'FIN003',
        trigger_logic: 'comprador.fgts == true',
        content:
          'Fica expressamente autorizada e prevista a libera\u00e7\u00e3o e saque de recursos das contas vinculadas do FGTS do Comprador para compor o pagamento da aquisi\u00e7\u00e3o do im\u00f3vel, devendo este cumprir todas as normativas e exig\u00eancias do Conselho Curador do FGTS e da Caixa Econ\u00f4mica Federal.',
        priority: 32,
        version: 1,
      },
      {
        title: 'Pagamento Parcelado Diretamente ao Vendedor',
        category: 'clausula_condicional',
        code: 'FIN004',
        trigger_logic: 'financeiro.parcelas > 1',
        content:
          'O saldo remanescente do pre\u00e7o ajustado ser\u00e1 pago em {{financeiro.parcelas}} parcelas mensais, sucessivas e corrigidas monetariamente, conforme pactuado pelas partes e especificado no quadro resumo.',
        priority: 25,
        version: 1,
      },
      {
        title: 'Multa de Inadimpl\u00eancia',
        category: 'clausula_condicional',
        code: 'FIN005',
        trigger_logic: 'financeiro.parcelas > 1',
        content:
          'O eventual atraso no pagamento de qualquer parcela sujeitar\u00e1 o Comprador \u00e0 multa morat\u00f3ria equivalente a 2% (dois por cento) sobre o valor total do d\u00e9bito em aberto, acrescida de juros de mora de 1% (um por cento) ao m\u00eas, incidentes pro rata die.',
        priority: 26,
        version: 1,
      },
      {
        title: 'Foro de Elei\u00e7\u00e3o',
        category: 'clausula_fixa',
        code: 'FIX008',
        trigger_logic: 'sempre',
        content:
          'Para dirimir quaisquer quest\u00f5es oriundas ou relativas \u00e0 interpreta\u00e7\u00e3o ou execu\u00e7\u00e3o deste contrato que n\u00e3o puderem ser resolvidas de forma extrajudicial e amig\u00e1vel, as partes elegem o foro da Comarca de {{operacao.foro}}, renunciando expressamente a qualquer outro, por mais privilegiado que seja.',
        priority: 100,
        version: 1,
      },
      {
        title: 'Financiamento Banc\u00e1rio - Aprova\u00e7\u00e3o',
        category: 'clausula_condicional',
        code: 'FIN001',
        trigger_logic: 'comprador.financiamento == true',
        content:
          'A parcela de R$ {{financeiro.valor_financiamento}} ser\u00e1 paga por meio de recursos provenientes de financiamento banc\u00e1rio imobili\u00e1rio a ser obtido pelo Comprador junto \u00e0 institui\u00e7\u00e3o {{financeiro.instituicao_financeira}} ou outra cong\u00eanere de sua escolha.',
        priority: 30,
        version: 1,
      },
      {
        title: 'Prazo para Obten\u00e7\u00e3o do Financiamento',
        category: 'clausula_condicional',
        code: 'FIN002',
        trigger_logic: 'comprador.financiamento == true',
        content:
          'O Comprador ter\u00e1 o prazo estipulado de {{financeiro.prazo_financiamento}} dias, contados da assinatura deste instrumento, para protocolar e providenciar toda a documenta\u00e7\u00e3o necess\u00e1ria \u00e0 aprova\u00e7\u00e3o do cr\u00e9dito. A n\u00e3o obten\u00e7\u00e3o do cr\u00e9dito por culpa exclusiva do Comprador ensejar\u00e1 a possibilidade de rescis\u00e3o contratual e reten\u00e7\u00e3o do sinal/arras.',
        priority: 31,
        version: 1,
      },
      {
        title: 'Evic\u00e7\u00e3o de Direito',
        category: 'clausula_fixa',
        code: 'FIX005',
        trigger_logic: 'sempre',
        content:
          'O Vendedor se responsabiliza pelos riscos da evic\u00e7\u00e3o, garantindo a origem, a boa e pac\u00edfica posse e o dom\u00ednio do im\u00f3vel ora transacionado, comprometendo-se a defend\u00ea-lo de quaisquer turba\u00e7\u00f5es de terceiros e respondendo por todos os \u00f4nus decorrentes.',
        priority: 91,
        version: 1,
      },
      {
        title: 'Outorga da Escritura Definitiva',
        category: 'clausula_fixa',
        code: 'FIX006',
        trigger_logic: 'sempre',
        content:
          'A escritura definitiva de compra e venda ser\u00e1 outorgada ao Comprador ou a quem este expressamente indicar, em data oportuna, condicionada impreterivelmente \u00e0 quita\u00e7\u00e3o integral do pre\u00e7o ajustado neste instrumento.',
        priority: 80,
        version: 1,
      },
      {
        title: 'Despesas com Escritura\u00e7\u00e3o e Registro',
        category: 'clausula_fixa',
        code: 'FIX007',
        trigger_logic: 'sempre',
        content:
          'Todas as despesas relativas \u00e0 lavratura da escritura definitiva, imposto de transmiss\u00e3o (ITBI), taxas, emolumentos, registro no Cart\u00f3rio de Im\u00f3veis, despachante e outras necess\u00e1rias \u00e0 transfer\u00eancia da propriedade correr\u00e3o por conta exclusiva do Comprador.',
        priority: 81,
        version: 1,
      },
      {
        title: 'Pre\u00e7o Total',
        category: 'clausula_fixa',
        code: 'FIX002',
        trigger_logic: 'sempre',
        content:
          'O pre\u00e7o certo, ajustado e irreajust\u00e1vel para a presente promessa de compra e venda \u00e9 de R$ {{financeiro.valor_total}}, que ser\u00e1 pago da seguinte forma e condi\u00e7\u00f5es estabelecidas a seguir.',
        priority: 20,
        version: 1,
      },
      {
        title: 'Sinal e Princ\u00edpio de Pagamento (Arras)',
        category: 'clausula_fixa',
        code: 'FIX003',
        trigger_logic: 'financeiro.valor_sinal > 0',
        content:
          'O valor de R$ {{financeiro.valor_sinal}} ser\u00e1 pago a t\u00edtulo de sinal e princ\u00edpio de pagamento (arras), valendo o comprovante de dep\u00f3sito ou transfer\u00eancia como recibo, sujeitando-se ao disposto no artigo 417 do C\u00f3digo Civil Brasileiro.',
        priority: 21,
        version: 1,
      },
      {
        title: 'Car\u00e1ter de Irrevogabilidade e Irretratabilidade',
        category: 'clausula_fixa',
        code: 'FIX004',
        trigger_logic: 'sempre',
        content:
          'O presente contrato \u00e9 celebrado em car\u00e1ter irrevog\u00e1vel e irretrat\u00e1vel, extensivo aos herdeiros e sucessores das partes, vedado o direito de arrependimento, ressalvadas as hip\u00f3teses de descumprimento de cl\u00e1usulas contratuais essenciais.',
        priority: 90,
        version: 1,
      },
      {
        title: 'Objeto - Descri\u00e7\u00e3o do Im\u00f3vel',
        category: 'clausula_fixa',
        code: 'FIX001',
        trigger_logic: 'sempre',
        content:
          'Pelo presente instrumento e na melhor forma de direito, o Vendedor promete vender ao Comprador, e este promete comprar-lhe o im\u00f3vel constante de {{imovel.tipo}}, situado em {{imovel.endereco}}, matriculado sob o n\u00ba {{imovel.matricula}} no Cart\u00f3rio de Registro de Im\u00f3veis de {{imovel.cartorio}}.',
        priority: 10,
        version: 1,
      },
      {
        title: 'CAS002 - Outorga',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'O c\u00f4njuge do VENDEDOR declara concordar com todas as cl\u00e1usulas deste instrumento, prestando sua outorga ux\u00f3ria/marital para a venda.',
        priority: 1,
        version: 1,
      },
      {
        title: 'COM002 - N\u00e3o Concretiza\u00e7\u00e3o',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'A comiss\u00e3o de corretagem ser\u00e1 devida integralmente mesmo que o neg\u00f3cio n\u00e3o se concretize por arrependimento das partes.',
        priority: 1,
        version: 1,
      },
      {
        title: 'COM003 - Reten\u00e7\u00e3o do Sinal',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'Fica expressamente autorizada a reten\u00e7\u00e3o do valor da comiss\u00e3o diretamente do montante pago a t\u00edtulo de sinal.',
        priority: 1,
        version: 1,
      },
      {
        title: 'COM004 - Solidariedade',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'As partes respondem solidariamente pelo pagamento da comiss\u00e3o de corretagem em caso de dolo ou fraude processual.',
        priority: 1,
        version: 1,
      },
      {
        title: 'LOC002 - Ren\u00fancia Prefer\u00eancia',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'O VENDEDOR apresenta neste ato a carta de ren\u00fancia ao direito de prefer\u00eancia devidamente assinada pelo atual locat\u00e1rio.',
        priority: 1,
        version: 1,
      },
      {
        title: 'LOC003 - Sub-roga\u00e7\u00e3o',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'O COMPRADOR sub-roga-se nos direitos e deveres do contrato de loca\u00e7\u00e3o a partir da data de imiss\u00e3o na posse.',
        priority: 1,
        version: 1,
      },
      {
        title: 'INV002 - Alvar\u00e1 Judicial',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'Fica condicionada a validade desta promessa \u00e0 expedi\u00e7\u00e3o de Alvar\u00e1 Judicial autorizando a aliena\u00e7\u00e3o do bem.',
        priority: 1,
        version: 1,
      },
      {
        title: 'INV003 - Riscos de Invent\u00e1rio',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'O COMPRADOR declara estar plenamente ciente dos riscos e prazos inerentes \u00e0 aquisi\u00e7\u00e3o de im\u00f3vel pendente de invent\u00e1rio.',
        priority: 1,
        version: 1,
      },
      {
        title: 'POS002 - Vistoria Pr\u00e9via',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'O COMPRADOR declara ter vistoriado o im\u00f3vel e aceita receb\u00ea-lo no estado de conserva\u00e7\u00e3o em que se encontra.',
        priority: 1,
        version: 1,
      },
      {
        title: 'POS003 - Danos na Desocupa\u00e7\u00e3o',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'O VENDEDOR responder\u00e1 civil e criminalmente por quaisquer danos causados ao im\u00f3vel durante o per\u00edodo de desocupa\u00e7\u00e3o.',
        priority: 1,
        version: 1,
      },
      {
        title: 'POS004 - Reten\u00e7\u00e3o de Valores',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'Fica autorizada a reten\u00e7\u00e3o de 10% do valor final at\u00e9 a efetiva desocupa\u00e7\u00e3o e entrega das chaves, como garantia.',
        priority: 1,
        version: 1,
      },
      {
        title: 'FIN002 - Condi\u00e7\u00e3o Resolutiva',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'A presente venda fica condicionada \u00e0 aprova\u00e7\u00e3o do financiamento no valor de R$ {{valor_financiamento}}.',
        priority: 1,
        version: 1,
      },
      {
        title: 'FIN003 - Restitui\u00e7\u00e3o',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'Em caso de negativa do financiamento por culpa n\u00e3o atribu\u00edvel ao COMPRADOR, os valores pagos a t\u00edtulo de sinal ser\u00e3o restitu\u00eddos integralmente.',
        priority: 1,
        version: 1,
      },
      {
        title: 'FIN004 - Prazos e Dilig\u00eancias',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'O COMPRADOR dever\u00e1 entregar todos os documentos exigidos pela institui\u00e7\u00e3o financeira {{instituicao_financeira}} no prazo de {{prazo_financiamento}} dias.',
        priority: 1,
        version: 1,
      },
      {
        title: 'FIN005 - Despesas Financiamento',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'Todas as despesas com o financiamento banc\u00e1rio correr\u00e3o por conta exclusiva do COMPRADOR.',
        priority: 1,
        version: 1,
      },
      {
        title: 'CAS001 - Anu\u00eancia Conjugal',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'O c\u00f4njuge do VENDEDOR, Sr(a). {{conjuge_vendedor}}, comparece neste ato para prestar sua expressa outorga ux\u00f3ria/marital, ratificando a venda sob o regime de {{regime_bens_vendedor}}.',
        priority: 1,
        version: 1,
      },
      {
        title: 'POS001 - Im\u00f3vel Ocupado',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'O im\u00f3vel encontra-se ocupado, comprometendo-se o VENDEDOR a desocup\u00e1-lo e entreg\u00e1-lo livre de pessoas e coisas at\u00e9 {{prazo_desocupacao}} dias ap\u00f3s a assinatura, sob pena de multa di\u00e1ria de R$ {{multa_desocupacao}}.',
        priority: 1,
        version: 1,
      },
      {
        title: 'LOC001 - Im\u00f3vel Locado',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'O im\u00f3vel encontra-se locado, declarando o COMPRADOR ter ci\u00eancia do contrato de loca\u00e7\u00e3o vigente.',
        priority: 1,
        version: 1,
      },
      {
        title: 'INV001 - Invent\u00e1rio',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'O im\u00f3vel encontra-se em processo de invent\u00e1rio, ficando a outorga da escritura definitiva condicionada \u00e0 expedi\u00e7\u00e3o do formal de partilha.',
        priority: 1,
        version: 1,
      },
      {
        title: 'COM001 - Comiss\u00e3o',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'A comiss\u00e3o de corretagem, no importe de R$ {{valor_comissao}} ({{percentual_comissao}}%), ser\u00e1 paga ao intermediador da negocia\u00e7\u00e3o pelo {{responsavel_comissao}}.',
        priority: 1,
        version: 1,
      },
      {
        title: 'FIX006 - LGPD',
        category: 'clausula_fixa',
        code: '',
        trigger_logic: '',
        content:
          'As partes concordam com o tratamento de seus dados pessoais para a finalidade espec\u00edfica de execu\u00e7\u00e3o deste contrato, nos termos da Lei Geral de Prote\u00e7\u00e3o de Dados (Lei n\u00ba 13.709/2018).',
        priority: 1,
        version: 1,
      },
      {
        title: 'FIX007 - Assinatura Eletr\u00f4nica',
        category: 'clausula_fixa',
        code: '',
        trigger_logic: '',
        content:
          'As partes concordam em assinar o presente contrato eletronicamente atrav\u00e9s da plataforma {{plataforma_assinatura}}, possuindo a mesma validade jur\u00eddica da assinatura f\u00edsica.',
        priority: 1,
        version: 1,
      },
      {
        title: 'FIN001 - Financiamento Banc\u00e1rio',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'Parte do pagamento, no valor de R$ {{valor_financiamento}}, ser\u00e1 efetuada atrav\u00e9s de financiamento banc\u00e1rio a ser obtido pelo COMPRADOR no prazo de {{prazo_financiamento}} dias.',
        priority: 1,
        version: 1,
      },
      {
        title: 'FIX002 - Pre\u00e7o',
        category: 'clausula_fixa',
        code: '',
        trigger_logic: '',
        content:
          'O pre\u00e7o certo e ajustado para a presente venda e compra \u00e9 de R$ {{valor_total}}, que ser\u00e1 pago da seguinte forma: Sinal de R$ {{valor_sinal}} na data {{data_pagamento_sinal}} e demais parcelas conforme acordado.',
        priority: 1,
        version: 1,
      },
      {
        title: 'FIX003 - Foro',
        category: 'clausula_fixa',
        code: '',
        trigger_logic: '',
        content:
          'As partes elegem o foro da Comarca de {{foro_comarca}} para dirimir quaisquer d\u00favidas oriundas deste contrato.',
        priority: 1,
        version: 1,
      },
      {
        title: 'FIX004 - Boa F\u00e9',
        category: 'clausula_fixa',
        code: '',
        trigger_logic: '',
        content:
          'As partes obrigam-se a guardar, assim na conclus\u00e3o do contrato, como em sua execu\u00e7\u00e3o, os princ\u00edpios de probidade e boa-f\u00e9.',
        priority: 1,
        version: 1,
      },
      {
        title: 'FIX005 - Irrevogabilidade',
        category: 'clausula_fixa',
        code: '',
        trigger_logic: '',
        content:
          'O presente contrato \u00e9 celebrado em car\u00e1ter irrevog\u00e1vel e irretrat\u00e1vel.',
        priority: 1,
        version: 1,
      },
      {
        title: 'FIX001 - Objeto',
        category: 'clausula_fixa',
        code: '',
        trigger_logic: '',
        content:
          'O VENDEDOR promete vender e o COMPRADOR promete comprar o im\u00f3vel descrito como {{tipo_imovel}}, localizado em {{endereco_imovel}}, matr\u00edcula {{matricula_imovel}} do {{cartorio_imovel}}.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Declara\u00e7\u00e3o de Certid\u00f5es',
        category: 'protecao_comercial',
        code: '',
        trigger_logic: '',
        content:
          'O VENDEDOR declara, sob as penas da lei civil e criminal, que apresentou todas as certid\u00f5es negativas de feitos ajuizados, d\u00e9bitos fiscais e trabalhistas, bem como certid\u00e3o de \u00f4nus reais atualizada do im\u00f3vel, as quais foram devidamente analisadas e aceitas pelo COMPRADOR.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Cl\u00e1usula de Financiamento - Prazo Banc\u00e1rio',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'O COMPRADOR ter\u00e1 o prazo de 60 (sessenta) dias contados da assinatura deste instrumento para a obten\u00e7\u00e3o do cr\u00e9dito imobili\u00e1rio, responsabilizando-se por todas as provid\u00eancias junto \u00e0 institui\u00e7\u00e3o financeira escolhida.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Cl\u00e1usula de Financiamento - Negativa de Cr\u00e9dito',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'Em caso de negativa de cr\u00e9dito por culpa de restri\u00e7\u00f5es no CPF ou incapacidade financeira do COMPRADOR, o contrato poder\u00e1 ser rescindido de pleno direito pelo VENDEDOR, com reten\u00e7\u00e3o das Arras pagas a t\u00edtulo de indeniza\u00e7\u00e3o.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Prote\u00e7\u00e3o LGPD',
        category: 'protecao_comercial',
        code: '',
        trigger_logic: '',
        content:
          'As partes autorizam o tratamento de dados pessoais fornecidos neste instrumento exclusivamente para fins de execu\u00e7\u00e3o deste contrato, registros p\u00fablicos e cumprimento de obriga\u00e7\u00f5es legais, em estrita conformidade com a Lei Geral de Prote\u00e7\u00e3o de Dados (Lei n\u00ba 13.709/2018).',
        priority: 1,
        version: 1,
      },
      {
        title: 'Assinatura Eletr\u00f4nica',
        category: 'protecao_comercial',
        code: '',
        trigger_logic: '',
        content:
          'As partes reconhecem como v\u00e1lida, plenamente eficaz e com for\u00e7a de t\u00edtulo executivo extrajudicial a assinatura eletr\u00f4nica do presente instrumento, independentemente de certifica\u00e7\u00e3o digital no padr\u00e3o ICP-Brasil.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Cl\u00e1usula de Arras',
        category: 'clausula_fixa',
        code: '',
        trigger_logic: '',
        content:
          'As partes ajustam que o valor pago a t\u00edtulo de sinal constitui Arras, nos termos dos artigos 417 a 420 do C\u00f3digo Civil. Em caso de desist\u00eancia do COMPRADOR, este perder\u00e1 o valor dado como sinal. Caso a desist\u00eancia ocorra por parte do VENDEDOR, dever\u00e1 restitu\u00ed-lo em dobro.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Provimento CNJ 88/2019 - PLD/FT',
        category: 'legislacao',
        code: '',
        trigger_logic: '',
        content:
          'O Provimento n\u00ba 88/2019 do Conselho Nacional de Justi\u00e7a (CNJ) disp\u00f5e sobre a pol\u00edtica, os procedimentos e os controles a serem adotados pelos not\u00e1rios e registradores visando \u00e0 preven\u00e7\u00e3o dos crimes de lavagem de dinheiro e do financiamento do terrorismo (PLD/FT). Exige a identifica\u00e7\u00e3o rigorosa das partes, a qualifica\u00e7\u00e3o dos benefici\u00e1rios finais e a comunica\u00e7\u00e3o de opera\u00e7\u00f5es suspeitas ao Conselho de Controle de Atividades Financeiras (COAF), especialmente em transa\u00e7\u00f5es imobili\u00e1rias pagas em esp\u00e9cie, com valores incompat\u00edveis com o patrim\u00f4nio, ou envolvendo Pessoas Expostas Politicamente (PEP).',
        priority: 1,
        version: 1,
      },
      {
        title: 'Manual de Compliance Notarial - Opera\u00e7\u00f5es Suspeitas',
        category: 'boas_praticas',
        code: '',
        trigger_logic: '',
        content:
          'No \u00e2mbito de transa\u00e7\u00f5es imobili\u00e1rias, s\u00e3o consideradas opera\u00e7\u00f5es suspeitas de lavagem de dinheiro: pagamento de montantes expressivos em esp\u00e9cie; resist\u00eancia em fornecer informa\u00e7\u00f5es sobre a origem dos recursos ou sobre os benefici\u00e1rios finais; transa\u00e7\u00f5es imobili\u00e1rias com valores flagrantemente discrepantes do valor de mercado; uso de empresas de fachada ou testas de ferro; e opera\u00e7\u00f5es incompat\u00edveis com a capacidade financeira das partes. O contrato deve conter cl\u00e1usulas declarat\u00f3rias de licitude dos recursos e ci\u00eancia do dever de comunica\u00e7\u00e3o ao COAF.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Cl\u00e1usula Obrigat\u00f3ria PLD/FT (Provimento 88 CNJ)',
        category: 'boas_praticas',
        code: '',
        trigger_logic: '',
        content:
          'Nos contratos de compra e venda de im\u00f3veis, deve constar cl\u00e1usula em que as partes declaram, sob as penas da lei, que os recursos utilizados na transa\u00e7\u00e3o t\u00eam origem l\u00edcita e n\u00e3o s\u00e3o fruto de crimes, e que est\u00e3o cientes de que a opera\u00e7\u00e3o poder\u00e1 ser comunicada ao COAF, na forma da Lei n\u00ba 9.613/1998 e do Provimento CNJ n\u00ba 88/2019.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Padr\u00e3o Godoy Prime Realty - Cl\u00e1usula de Financiamento',
        category: 'boas_praticas',
        code: '',
        trigger_logic: '',
        content:
          "A Cl\u00e1usula de Financiamento padr\u00e3o da Godoy Prime Realty determina que: a) O COMPRADOR \u00e9 o \u00fanico e exclusivo respons\u00e1vel pela obten\u00e7\u00e3o do cr\u00e9dito; b) Em caso de negativa de cr\u00e9dito por qualquer motivo (restri\u00e7\u00f5es ou insufici\u00eancia de renda), este dever\u00e1 quitar o saldo devedor com recursos pr\u00f3prios no prazo m\u00e1ximo de 30 (trinta) dias, sob pena de rescis\u00e3o por sua culpa exclusiva, com reten\u00e7\u00e3o do sinal; c) Atrasos burocr\u00e1ticos do banco n\u00e3o isentam o COMPRADOR das responsabilidades assumidas, salvo se o atraso for causado por pend\u00eancias do VENDEDOR; d) O VENDEDOR deve fornecer a documenta\u00e7\u00e3o exigida no prazo do banco. Quando o contrato apresentar esta cl\u00e1usula exatamente com estes itens, n\u00e3o h\u00e1 omiss\u00f5es ou riscos em rela\u00e7\u00e3o \u00e0 forma de pagamento, e o status de conformidade deve ser 'conforme'.",
        priority: 1,
        version: 1,
      },
      {
        title:
          'Padr\u00e3o Godoy Prime Realty - Documenta\u00e7\u00e3o Exaustiva (Prazo de 10 dias)',
        category: 'boas_praticas',
        code: '',
        trigger_logic: '',
        content:
          'Em todos os contratos de compra e venda elaborados sob o padr\u00e3o Godoy Prime Realty, a Cl\u00e1usula de Documenta\u00e7\u00e3o deve exigir obrigatoriamente e de forma expl\u00edcita que os documentos sejam apresentados no prazo de 10 (dez) dias corridos. A lista exaustiva \u00e9 composta por: VENDEDOR (C\u00f3pia do RG e CPF, Certid\u00e3o de Casamento/Nascimento atualizada, Comprovante de resid\u00eancia atualizado, Certid\u00e3o Negativa de D\u00e9bitos Trabalhistas - CNDT, Certid\u00f5es de Feitos Ajuizados da Justi\u00e7a Federal, Estadual e do Trabalho, Certid\u00e3o de Objeto e P\u00e9, e Certid\u00e3o de Protestos da comarca de domic\u00edlio do VENDEDOR e da localiza\u00e7\u00e3o do im\u00f3vel); IM\u00d3VEL (Certid\u00e3o de \u00d4nus Reais atualizada, Certid\u00e3o de Quita\u00e7\u00e3o Fiscal/IPTU, Certid\u00e3o de Quita\u00e7\u00e3o Condominial assinada pelo s\u00edndico com ata de elei\u00e7\u00e3o, e Certid\u00e3o Negativa de D\u00e9bitos de Taxa de Inc\u00eandio se aplic\u00e1vel). Contratos contendo exatamente esta lista e o prazo de 10 dias est\u00e3o 100% em conformidade documental.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Modelo Padr\u00e3o - Promessa de Compra e Venda - Godoy Prime Realty',
        category: 'boas_praticas',
        code: '',
        trigger_logic: '',
        content:
          'GODOY PRIME REALTY\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n\nINSTRUMENTO PARTICULAR DE PROMESSA DE COMPRA E VENDA\n\nPor este instrumento particular, as partes abaixo qualificadas celebram o presente Contrato de Promessa de Compra e Venda, mediante as cl\u00e1usulas e condi\u00e7\u00f5es a seguir estabelecidas:\n\nCl\u00e1usula 1\u00aa - Das Partes\nVENDEDOR: [NOME_COMPLETO_VENDEDOR], nacionalidade: [NACIONALIDADE], estado civil: [ESTADO_CIVIL], profiss\u00e3o: [PROFISSAO], portador do RG n\u00ba [NUMERO_RG] expedido por [ORGAO_EMISSOR_RG], inscrito no CPF sob o n\u00ba [CPF_VENDEDOR], residente e domiciliado em [ENDERECO_COMPLETO_VENDEDOR]. E-mail: [EMAIL_VENDEDOR], Telefone: [TELEFONE_VENDEDOR].\nCOMPRADOR: [NOME_COMPLETO_COMPRADOR], nacionalidade: [NACIONALIDADE_COMPRADOR], estado civil: [ESTADO_CIVIL_COMPRADOR], profiss\u00e3o: [PROFISSAO_COMPRADOR], portador do RG n\u00ba [NUMERO_RG_COMPRADOR] expedido por [ORGAO_EMISSOR_RG_COMPRADOR], inscrito no CPF sob o n\u00ba [CPF_COMPRADOR], residente e domiciliado em [ENDERECO_COMPLETO_COMPRADOR]. E-mail: [EMAIL_COMPRADOR], Telefone: [TELEFONE_COMPRADOR].\n\nCl\u00e1usula 2\u00aa - Do Objeto\nO objeto do presente contrato \u00e9 o im\u00f3vel (tipo: [TIPO_IMOVEL]), situado em [ENDERECO_COMPLETO_IMOVEL], bairro [BAIRRO], CEP [CEP], Matr\u00edcula n\u00ba [NUMERO_MATRICULA], registrado no RGI de [NUMERO_RGI], Inscri\u00e7\u00e3o Municipal n\u00ba [INSCRICAO_MUNICIPAL], possuindo \u00e1rea total de [AREA_TOTAL] m\u00b2, \u00e1rea constru\u00edda de [AREA_CONSTRUIDA] m\u00b2 e [NUMERO_VAGAS] vaga(s) de garagem.\n\nCl\u00e1usula 3\u00aa - Do Pre\u00e7o e Condi\u00e7\u00f5es de Pagamento\nO pre\u00e7o certo e ajustado para a presente compra e venda \u00e9 de [VALOR_TOTAL] ([VALOR_TOTAL_POR_EXTENSO]), que ser\u00e1 pago da seguinte forma:\n- Sinal: [VALOR_SINAL], na data de [DATA_PAGAMENTO_SINAL], forma de pagamento: [FORMA_PAGAMENTO_SINAL].\n- Saldo: [VALOR_SALDO], conforme acordado.\n- Comiss\u00e3o de Corretagem: [VALOR_COMISSAO], equivalente a [PERCENTUAL_COMISSAO] do valor de venda.\n\nCl\u00e1usula 4\u00aa - Da Documenta\u00e7\u00e3o\nAs partes obrigam-se a apresentar as seguintes certid\u00f5es e documentos: \u00d4nus Reais, Quita\u00e7\u00e3o Fiscal, Quita\u00e7\u00e3o Condominial e Negativas Pessoais.\n\nCl\u00e1usula 5\u00aa - Das Obriga\u00e7\u00f5es\nO VENDEDOR obriga-se a transferir o dom\u00ednio, garantir a habitabilidade e quitar impostos at\u00e9 a data da posse. O COMPRADOR obriga-se ao pagamento do pre\u00e7o, custos de registro e impostos futuros.\n\nCl\u00e1usula 6\u00aa - Da Posse\nA posse do im\u00f3vel ser\u00e1 transferida com a entrega das chaves, sujeita \u00e0 penalidade de [VALOR_MULTA_DIARIA] por dia em caso de atraso na desocupa\u00e7\u00e3o ou entrega.\n\nCl\u00e1usula 7\u00aa - Das Penalidades\nEm caso de rescis\u00e3o por culpa do COMPRADOR, perder\u00e1 este o sinal pago. Sendo a culpa do VENDEDOR, devolver\u00e1 o sinal em dobro. Em caso de atraso, haver\u00e1 multa de [PERCENTUAL_MULTA] e juros de [PERCENTUAL_JUROS] ao m\u00eas.\n\nCl\u00e1usula 8\u00aa - Da Rescis\u00e3o\nCaso qualquer das partes descumpra o estipulado, a parte inocente poder\u00e1 notificar a infratora para sanar a falha, sob pena de rescis\u00e3o de pleno direito.\n\nCl\u00e1usula 9\u00aa - Da Legisla\u00e7\u00e3o\nEste contrato \u00e9 regido pelo C\u00f3digo Civil Brasileiro aplic\u00e1vel \u00e0 esp\u00e9cie.\n\nCl\u00e1usula 10\u00aa - Do Foro\nFica eleito o Foro da Comarca do Rio de Janeiro para dirimir quaisquer d\u00favidas oriundas deste contrato, renunciando a qualquer outro por mais privilegiado que seja.\n\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\nRio de Janeiro, [DATA_ASSINATURA].',
        priority: 1,
        version: 1,
      },
      {
        title: 'Cl\u00e1usulas de Prote\u00e7\u00e3o - Vendedor',
        category: 'boas_praticas',
        code: '',
        trigger_logic: '',
        content:
          'Previs\u00e3o expressa de Arras Confirmat\u00f3rias ou Penitenciais (perda do sinal em caso de desist\u00eancia injustificada do comprador). Direito de Reten\u00e7\u00e3o do im\u00f3vel e das chaves at\u00e9 a liquida\u00e7\u00e3o integral do saldo ou assinatura com o banco.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Jurisprud\u00eancia TJRJ - Rescis\u00e3o, IPTU e Posse',
        category: 'jurisprudencia',
        code: '',
        trigger_logic: '',
        content:
          'TJRJ: Em caso de rescis\u00e3o de promessa de compra e venda, a reten\u00e7\u00e3o pelo vendedor deve ser razo\u00e1vel. A responsabilidade pelo pagamento do IPTU \u00e9 do promitente comprador apenas a partir da efetiva imiss\u00e3o na posse (entrega das chaves).',
        priority: 1,
        version: 1,
      },
      {
        title: 'Estrutura Padr\u00e3o - Compra e Venda \u00c0 Vista',
        category: 'boas_praticas',
        code: '',
        trigger_logic: '',
        content:
          'Contrato \u00c0 vista. Cl\u00e1usulas essenciais: Qualifica\u00e7\u00e3o das Partes, Objeto (Descri\u00e7\u00e3o detalhada), Pre\u00e7o e Pagamento (Sinal e Saldo), Documenta\u00e7\u00e3o exigida (Certid\u00f5es), Obriga\u00e7\u00f5es, Imiss\u00e3o na Posse imediata ou em data certa, Multas/Penalidades, Foro.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Estrutura Padr\u00e3o - Compra e Venda Financiada',
        category: 'boas_praticas',
        code: '',
        trigger_logic: '',
        content:
          'Contrato Financiado. Cl\u00e1usulas essenciais: Qualifica\u00e7\u00e3o das Partes, Objeto, Pre\u00e7o (Sinal, Refor\u00e7o, Complemento com Financiamento Banc\u00e1rio), Cl\u00e1usula de Aliena\u00e7\u00e3o Fiduci\u00e1ria, Condi\u00e7\u00f5es Suspensivas de aprova\u00e7\u00e3o de cr\u00e9dito, Prazos espec\u00edficos.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Cl\u00e1usulas de Prote\u00e7\u00e3o - Comprador',
        category: 'boas_praticas',
        code: '',
        trigger_logic: '',
        content:
          'Direito a Vistoria pr\u00e9via do im\u00f3vel atestando estado de conserva\u00e7\u00e3o. Exig\u00eancia de Documenta\u00e7\u00e3o Limpa: apresenta\u00e7\u00e3o de certid\u00f5es negativas (fiscais, trabalhistas, c\u00edveis) do vendedor e do im\u00f3vel antes de repasses de valores altos.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Lei de Registros P\u00fablicos (Lei 6.015/1973)',
        category: 'legislacao',
        code: '',
        trigger_logic: '',
        content:
          'Livros I a IV. Regula o registro de im\u00f3veis, essencial para a transfer\u00eancia da propriedade e publicidade dos atos para oponibilidade a terceiros. (Legisla\u00e7\u00e3o Prim\u00e1ria)',
        priority: 1,
        version: 1,
      },
      {
        title: 'S\u00famulas STJ - 3, 5, 6, 7, 83 a 100',
        category: 'jurisprudencia',
        code: '',
        trigger_logic: '',
        content:
          'S\u00famula 5: A simples interpreta\u00e7\u00e3o de cl\u00e1usula contratual n\u00e3o enseja recurso especial. S\u00famula 7: A pretens\u00e3o de simples reexame de prova n\u00e3o enseja recurso especial. S\u00famula 84: A a\u00e7\u00e3o de embargos de terceiro admite a defesa da posse advinda de compromisso de compra e venda.',
        priority: 1,
        version: 1,
      },
      {
        title: 'S\u00famulas STJ - 326 a 351',
        category: 'jurisprudencia',
        code: '',
        trigger_logic: '',
        content:
          'S\u00famula 326: Na a\u00e7\u00e3o de indeniza\u00e7\u00e3o por dano moral, a condena\u00e7\u00e3o em montante inferior ao postulado na inicial n\u00e3o implica sucumb\u00eancia rec\u00edproca. S\u00famula 332: A fian\u00e7a prestada sem autoriza\u00e7\u00e3o de um dos c\u00f4njuges implica a inefic\u00e1cia total da garantia.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Lei do Inquilinato (Lei 8.245/1991)',
        category: 'legislacao',
        code: '',
        trigger_logic: '',
        content:
          'Cap\u00edtulos I a IV. A loca\u00e7\u00e3o de im\u00f3veis urbanos regula-se pelo disposto nesta lei. Inclui garantias locat\u00edcias, deveres do locador e locat\u00e1rio, e regras sobre despejo. (Legisla\u00e7\u00e3o Prim\u00e1ria)',
        priority: 1,
        version: 1,
      },
      {
        title: 'Lei de Incorpora\u00e7\u00e3o Imobili\u00e1ria (Lei 4.591/1964)',
        category: 'legislacao',
        code: '',
        trigger_logic: '',
        content:
          'Cap\u00edtulos I a IV. Disp\u00f5e sobre o condom\u00ednio em edifica\u00e7\u00f5es e as incorpora\u00e7\u00f5es imobili\u00e1rias. Regula os deveres do incorporador e prote\u00e7\u00e3o dos adquirentes na planta. (Legisla\u00e7\u00e3o Prim\u00e1ria)',
        priority: 1,
        version: 1,
      },
      {
        title: 'Lei de Aliena\u00e7\u00e3o Fiduci\u00e1ria (Lei 9.514/1997)',
        category: 'legislacao',
        code: '',
        trigger_logic: '',
        content:
          'Cap\u00edtulos I a IV. Disp\u00f5e sobre o Sistema de Financiamento Imobili\u00e1rio, institui a aliena\u00e7\u00e3o fiduci\u00e1ria de coisa im\u00f3vel e prev\u00ea a consolida\u00e7\u00e3o da propriedade em caso de inadimpl\u00eancia. (Legisla\u00e7\u00e3o Prim\u00e1ria)',
        priority: 1,
        version: 1,
      },
      {
        title: 'C\u00f3digo Civil (Lei 10.406/2002) - Contratos em Geral',
        category: 'legislacao',
        code: '',
        trigger_logic: '',
        content:
          'Art. 421 a 480. A liberdade contratual ser\u00e1 exercida nos limites da fun\u00e7\u00e3o social do contrato. Os princ\u00edpios de probidade e boa-f\u00e9 devem ser guardados. (Legisla\u00e7\u00e3o Prim\u00e1ria)',
        priority: 1,
        version: 1,
      },
      {
        title: 'C\u00f3digo Civil (Lei 10.406/2002) - Compra e Venda',
        category: 'legislacao',
        code: '',
        trigger_logic: '',
        content:
          'Art. 481 a 504. Pelo contrato de compra e venda, um dos contratantes se obriga a transferir o dom\u00ednio de certa coisa, e o outro, a pagar-lhe certo pre\u00e7o em dinheiro. O vendedor, salvo conven\u00e7\u00e3o em contr\u00e1rio, responde por todos os d\u00e9bitos que gravem a coisa at\u00e9 o momento da tradi\u00e7\u00e3o. (Legisla\u00e7\u00e3o Prim\u00e1ria)',
        priority: 1,
        version: 1,
      },
      {
        title: 'Pr\u00e1tica Imobili\u00e1ria RJ - Foro de Jacarepagu\u00e1',
        category: 'boas_praticas',
        code: '',
        trigger_logic: '',
        content:
          'Para neg\u00f3cios envolvendo im\u00f3veis situados na Barra da Tijuca, Recreio dos Bandeirantes, Camorim e Vargem Grande, o foro competente padr\u00e3o recomendado \u00e9 o Foro Regional de Jacarepagu\u00e1 da Comarca da Capital do RJ.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Lei 8.245/1991 - Lei do Inquilinato',
        category: 'legislacao',
        code: '',
        trigger_logic: '',
        content:
          'A loca\u00e7\u00e3o de im\u00f3veis urbanos regula-se pelo disposto nesta lei. \u00c9 obrigat\u00f3ria a previs\u00e3o de foro competente e qualifica\u00e7\u00e3o clara e objetiva das partes.',
        priority: 1,
        version: 1,
      },
      {
        title: 'S\u00famula 326 do STJ (Dano Moral e Sucumb\u00eancia)',
        category: 'jurisprudencia',
        code: '',
        trigger_logic: '',
        content:
          'Na a\u00e7\u00e3o de indeniza\u00e7\u00e3o por dano moral, a condena\u00e7\u00e3o em montante inferior ao postulado na inicial n\u00e3o implica sucumb\u00eancia rec\u00edproca. Aten\u00e7\u00e3o ao prever cl\u00e1usulas penais que desequilibrem a rela\u00e7\u00e3o contratual.',
        priority: 1,
        version: 1,
      },
      {
        title: 'C\u00f3digo Civil - Compra e Venda (Art. 481 a 504)',
        category: 'legislacao',
        code: '',
        trigger_logic: '',
        content:
          'Pelo contrato de compra e venda, um dos contratantes se obriga a transferir o dom\u00ednio de certa coisa, e o outro, a pagar-lhe certo pre\u00e7o em dinheiro. O pre\u00e7o, se n\u00e3o houver acordo, pode ser deixado ao arb\u00edtrio de terceiro.',
        priority: 1,
        version: 1,
      },
    ]
    let col
    try {
      col = app.findCollectionByNameOrId('legal_knowledge')
    } catch (_) {
      col = new Collection({
        name: 'legal_knowledge',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: '@request.auth.is_admin = true',
        updateRule: '@request.auth.is_admin = true',
        deleteRule: '@request.auth.is_admin = true',
        fields: [
          { name: 'title', type: 'text', required: true },
          { name: 'category', type: 'text' },
          { name: 'code', type: 'text' },
          { name: 'trigger_logic', type: 'text' },
          { name: 'content', type: 'text', required: true },
          { name: 'priority', type: 'number' },
          { name: 'version', type: 'number' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      })
      app.save(col)
    }
    try {
      const olds = app.findRecordsByFilter('legal_knowledge', "id != ''", '', 2000, 0)
      for (const o of olds) {
        app.delete(o)
      }
    } catch (_) {}
    for (const r of RECORDS) {
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
  (app) => {},
)
