// Base de Conhecimento (legal_knowledge) ‚Äî 109 registros VERBATIM (base viva Godoy).
// Limpa a colecao e insere os 109. COLE PELO EDITOR DE CODIGO, nunca via agente.
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
          'INSTRUMENTO PARTICULAR DE PROMESSA DE COMPRA E VENDA\n\nCL√ÅUSULA PRIMEIRA - DAS PARTES\nVENDEDOR: [NOME DO VENDEDOR], [NACIONALIDADE DO VENDEDOR], [ESTADO CIVIL DO VENDEDOR], [PROFISS√ÉO DO VENDEDOR], portador do RG n¬∫ [RG DO VENDEDOR] expedido pelo [ORG√ÉO EMISSOR DO VENDEDOR], inscrito no CPF sob o n¬∫ [CPF DO VENDEDOR], residente e domiciliado em [ENDERE√áO DO VENDEDOR].\n\nCOMPRADOR: [NOME DO COMPRADOR], [NACIONALIDADE DO COMPRADOR], [ESTADO CIVIL DO COMPRADOR], [PROFISS√ÉO DO COMPRADOR], portador do RG n¬∫ [RG DO COMPRADOR] expedido pelo [ORG√ÉO EMISSOR DO COMPRADOR], inscrito no CPF sob o n¬∫ [CPF DO COMPRADOR], residente e domiciliado em [ENDERE√áO DO COMPRADOR].\n\nCL√ÅUSULA SEGUNDA - DO OBJETO\nO objeto do presente contrato √© o im√≥vel situado em [ENDERE√áO DO IM√ìVEL], matr√≠cula n¬∫ [MATR√çCULA DO IM√ìVEL], com √°rea total de [√ÅREA TOTAL DO IM√ìVEL] m¬≤, inscri√ß√£o IPTU n¬∫ [IPTU DO IM√ìVEL].\n\nCL√ÅUSULA TERCEIRA - DO PRE√áO E CONDI√á√ïES DE PAGAMENTO\nO pre√ßo certo e ajustado √© de [VALOR TOTAL] ([VALOR TOTAL POR EXTENSO]), pago da seguinte forma:\n- Sinal: [VALOR DO SINAL] ([VALOR DO SINAL POR EXTENSO])\n- Forma de Pagamento: [FORMA DE PAGAMENTO]\n[CONDI√á√ïES DE PAGAMENTO DETALHADAS]\n\nCL√ÅUSULA QUARTA - DA POSSE\nA posse direta ser√° transferida ao COMPRADOR conforme acordado entre as partes.\n\nCL√ÅUSULA QUINTA - DAS PENALIDADES\nFica estipulada multa de 10% sobre o valor do contrato para a parte que infringir qualquer cl√°usula.\n\nCL√ÅUSULA SEXTA - DA COMISS√ÉO DE CORRETAGEM\nA comiss√£o de corretagem ser√° de [COMISS√ÉO PERCENTUAL]% sobre o valor da transa√ß√£o.\n\nCL√ÅUSULA S√âTIMA - DA PREVEN√á√ÉO √Ä LAVAGEM DE DINHEIRO (PLD-FT)\nEm atendimento ao Provimento CNJ n¬∫ 88/2019, o COMPRADOR declara que os recursos utilizados t√™m origem l√≠cita.\n\nCL√ÅUSULA OITAVA - DA LGPD\nAs partes autorizam o tratamento de dados pessoais nos termos da Lei n¬∫ 13.709/2018.\n\nCL√ÅUSULA NONA - DO FORO\nFica eleito o foro da comarca para dirimir quaisquer d√∫vidas.\n\n[DATA POR EXTENSO]\n\n_________________________________________________\nVENDEDOR: [NOME DO VENDEDOR]\n\n_________________________________________________\nCOMPRADOR: [NOME DO COMPRADOR]\n\n_________________________________________________\nTESTEMUNHA 1\n\n_________________________________________________\nTESTEMUNHA 2',
        priority: 1,
        version: 3,
      },
      {
        title: 'Gold Standard - Autoriza√ß√£o de Intermedia√ß√£o',
        category: 'boas_praticas',
        code: 'GOLD_AUT_01',
        trigger_logic:
          '{"path":"metadata.tipo_contrato","operator":"==","value":"autorizacao_intermediacao"}',
        content:
          'AUTORIZA√á√ÉO PARA DIVULGA√á√ÉO E VENDA DE IM√ìVEL\n\nCONTRATANTES\nNOME: [NOME DO VENDEDOR]\nRG: [RG DO VENDEDOR] ORG√ÉO EMISSOR: [ORG√ÉO EMISSOR DO VENDEDOR]\nCPF: [CPF DO VENDEDOR]\nNACIONALIDADE: [NACIONALIDADE DO VENDEDOR]\nESTADO CIVIL: [ESTADO CIVIL DO VENDEDOR]\nPROFISS√ÉO: [PROFISS√ÉO DO VENDEDOR]\nENDERE√áO: [ENDERE√áO DO VENDEDOR]\nTELEFONE: [TELEFONE DO VENDEDOR]\nE-MAIL: [E-MAIL DO VENDEDOR]\n\nDESCRI√á√ÉO DO IM√ìVEL\nENDERE√áO: [ENDERE√áO DO IM√ìVEL]\nBAIRRO: [BAIRRO DO IM√ìVEL]\nCIDADE: [CIDADE DO IM√ìVEL] - [ESTADO DO IM√ìVEL]\nCEP: [CEP DO IM√ìVEL]\nMATR√çCULA: [MATR√çCULA DO IM√ìVEL]\nIPTU: [IPTU DO IM√ìVEL]\n√ÅREA TOTAL: [√ÅREA TOTAL DO IM√ìVEL] m¬≤\nVAGAS: [VAGAS DO IM√ìVEL]\nQUARTOS: [QUARTOS DO IM√ìVEL]\n\nVALOR DE AVALIA√á√ÉO: [VALOR DE AVALIA√á√ÉO]\nVALOR DE VENDA: [VALOR TOTAL]\n\nCONDI√á√ïES\n1. A presente Autoriza√ß√£o de Venda, [TIPO DE EXCLUSIVIDADE], tem seu amparo na Lei 6.530, Art. 20, item III, de 12/05/1978 e pela Resolu√ß√£o do COFECI n¬∫ 458/95 de 17/11/1995.\n\n2. √â concedida esta autoriza√ß√£o pelo prazo de [PRAZO DE VIG√äNCIA] dias, a contar desta data, incluindo a veicula√ß√£o de an√∫ncios e fotos do im√≥vel em todos os meios de publicidade utilizados pelo CONTRATADO.\n\n3. Os CONTRATANTES se comprometem a pagar ao CONTRATADO o percentual de [COMISS√ÉO PERCENTUAL]% sobre o pre√ßo de venda efetivamente transacionado, a t√≠tulo de honor√°rios de corretagem.\n\n4. A mesma remunera√ß√£o ser√° devida se, durante a vig√™ncia desta autoriza√ß√£o, o propriet√°rio realizar a venda do im√≥vel sem a ci√™ncia do CONTRATADO.\n\n5. Os CONTRATANTES se responsabilizam por todas as informa√ß√µes prestadas acerca do im√≥vel.\n\n6. Fica eleito o foro da Comarca do Rio de Janeiro para dirimir eventuais d√∫vidas.\n\n[DATA POR EXTENSO]\n\n_________________________________________________\nNOME: [NOME DO VENDEDOR]\nCONTRATANTE(S)\nCPF: [CPF DO VENDEDOR]',
        priority: 1,
        version: 3,
      },
      {
        title: 'Gold Standard - Recibo de Sinal (Verbatim)',
        category: 'clausula_fixa',
        code: 'GOLD_RECIBO_01',
        trigger_logic: '{"path":"metadata.tipo_contrato","operator":"==","value":"recibo_sinal"}',
        content:
          'RECIBO DE SINAL\nArts. 417 a 420 do C√≥digo Civil\n\nQUALIFICA√á√ÉO DAS PARTES\n\nVENDEDOR: {{vendedor_nome}}, {{vendedor_nacionalidade}}, {{vendedor_qualificacao_civil}}, {{vendedor_profissao}}, portador do RG n¬∫ {{vendedor_rg}}, inscrito no CPF sob o n¬∫ {{vendedor_cpf}}, residente e domiciliado em {{vendedor_endereco}}.\n\nCOMPRADOR: {{comprador_nome}}, {{comprador_nacionalidade}}, {{comprador_qualificacao_civil}}, {{comprador_profissao}}, portador do RG n¬∫ {{comprador_rg}}, inscrito no CPF sob o n¬∫ {{comprador_cpf}}, residente e domiciliado em {{comprador_endereco}}.\n\nOBJETO\n\nIm√≥vel situado em {{imovel_endereco}}, matr√≠cula n¬∫ {{imovel_matricula}}, registrado no Registro de Im√≥veis sob o n¬∫ {{imovel_ri}}, comarca de {{imovel_comarca}}, inscri√ß√£o municipal (IPTU) n¬∫ {{imovel_iptu}}.\n\nValor total do im√≥vel: R$ {{valor_total}} ({{valor_total_extenso}}).\nSinal recebido: R$ {{valor_sinal}} ({{valor_sinal_extenso}}).\nrestando o saldo de R$ {{valor_saldo}} ({{valor_saldo_extenso}}), a ser pago na forma e nas datas ajustadas no contrato de compra e venda / promessa de compra e venda firmado entre as partes (CC art. 417).\n\nCL√ÅUSULA 1¬™ ‚Äî IMPUTA√á√ÉO NO PRE√áO\n\nO valor recebido a t√≠tulo de sinal √© imputado no pre√ßo total da transa√ß√£o, constituindo parte integrante do pagamento do im√≥vel objeto deste recibo.\n\nCL√ÅUSULA 2¬™ ‚Äî DA NATUREZA DAS ARRAS\n\n{{check_confirmatoria}} Arras Confirmat√≥rias (Arts. 417 a 419, CC) ‚Äî O sinal confirma o neg√≥cio jur√≠dico. Em caso de descumprimento pelo COMPRADOR, perder√° o valor integral do sinal. Em caso de descumprimento pelo VENDEDOR, dever√° restituir o valor em dobro.\n\n{{check_penitencial}} Arras Penitenciais (Art. 420, CC) ‚Äî As partes poder√£o retratar-se do neg√≥cio, perdendo o COMPRADOR o sinal pago, ou restituindo o VENDEDOR o valor em dobro.\n\nCL√ÅUSULA 3¬™ ‚Äî DAS CONDI√á√ïES DE PAGAMENTO\n\nAs partes obrigam-se a celebrar o contrato definitivo de compra e venda / a escritura p√∫blica no prazo de {{prazo_formalizacao_dias}} ({{prazo_formalizacao_extenso}}) dias corridos, a contar desta data.\n\nCL√ÅUSULA 4¬™ ‚Äî RESTITUI√á√ÉO POR FATO ALHEIO √ÄS PARTES\n\nNa hip√≥tese de desfazimento do neg√≥cio por fato alheio √† vontade das partes, os valores pagos ser√£o restitu√≠dos no prazo de {{prazo_restituicao_dias}} ({{prazo_restituicao_extenso}}) dias √∫teis, sem incid√™ncia de penalidades.\n\nCL√ÅUSULA 5¬™ ‚Äî ELEI√á√ÉO DE FORO\n\nFica eleito o foro da comarca de {{foro_comarca}} para dirimir quaisquer controv√©rsias oriundas do presente recibo.\n\nE, por estarem cientes e de acordo, firmam o presente em duas vias de igual teor.\n\n{{cidade_uf}}, {{data_extenso}}.\n\n_________________________________________________\nVENDEDOR: {{vendedor_nome}}\nCPF: {{vendedor_cpf}}\n\n_________________________________________________\nCOMPRADOR: {{comprador_nome}}\nCPF: {{comprador_cpf}}',
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
          '### 1. Documenta√ß√£o das Partes\n#### 1.1 Pessoa F√≠sica\n- RG/CPF ou CNH\n- Comprovante de Resid√™ncia\n#### 1.2 Pessoa Jur√≠dica (PJ)\n- Contrato Social consolidado\n- CNPJ\n- Certid√£o Simplificada da Junta Comercial\n\n### 2. Documenta√ß√£o do Im√≥vel\n- Matr√≠cula Atualizada (com √¥nus e a√ß√µes)\n- Certid√£o de Quita√ß√£o Fiscal (IPTU)\n\n### 3. Vendedor / Propriet√°rio\n- Certid√µes Negativas C√≠veis, Criminais e Trabalhistas\n\n### 4. Due Diligence\n- An√°lise de riscos apontados nas certid√µes e na matr√≠cula\n- Verifica√ß√£o de processos em tr√¢mite que possam afetar o patrim√¥nio\n\n### 5. Compliance\n- Verifica√ß√£o de PEP (Pessoa Politicamente Exposta)\n- Adequa√ß√£o √† LGPD no tratamento dos dados coletados',
        priority: 1,
        version: 1,
      },
      {
        title: 'Gold Standard - Recibo de Sinal e Arras',
        category: 'boas_praticas',
        code: 'ARRAS_GOLD_01',
        trigger_logic: '{"path":"metadata.tipo_contrato","operator":"==","value":"recibo_sinal"}',
        content:
          'Com base nos Artigos 417 a 420 do C√≥digo Civil Brasileiro, este recibo formaliza o pagamento do sinal.\n\n**Natureza das Arras:**\n- Arras Confirmat√≥rias (Art. 417 a 419, CC) - tornam o neg√≥cio irretrat√°vel, n√£o admitindo arrependimento.\n- Arras Penitenciais (Art. 420, CC) - garantem o direito de arrependimento, com a perda do sinal por quem o deu, ou a devolu√ß√£o em dobro por quem o recebeu.\n\nA responsabilidade por eventuais desist√™ncias seguir√° rigorosamente as estipula√ß√µes legais referentes √† natureza das arras escolhida pelas partes.',
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
          'Formaliza-se a entrega f√≠sica das chaves do im√≥vel objeto da transa√ß√£o.\n\n**Leitura dos Medidores:**\n- √Ågua: {{imovel.caracteristicas.leitura_agua}}\n- Luz: {{imovel.caracteristicas.leitura_luz}}\n- G√°s: {{imovel.caracteristicas.leitura_gas}}\n\n**Aviso Legal:** A entrega f√≠sica das chaves e a imiss√£o na posse n√£o substituem a necessidade de registro do t√≠tulo translativo no Registro de Im√≥veis competente para a efetiva transfer√™ncia da propriedade, conforme prev√™ o Art. 1.245 do C√≥digo Civil.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Gold Standard - Termo de Transmiss√£o da Posse',
        category: 'boas_praticas',
        code: 'POSSE_GOLD_01',
        trigger_logic: '{"path":"metadata.tipo_contrato","operator":"==","value":"termo_posse"}',
        content:
          'O COMPRADOR √© imitido na posse do im√≥vel a partir de {{posse.data_posse}}, passando a exercer a posse com *animus domini*.\n\n**Propriedade (Art. 1.245, CC):** Reconhece-se que a transfer√™ncia efetiva da propriedade dar-se-√° apenas com o registro da Escritura P√∫blica no respectivo cart√≥rio competente.\n\n**Divis√£o Pro Rata (Art. 130, CTN):** As partes acordam que os impostos (IPTU), taxas e despesas condominiais ser√£o divididos *pro rata* at√© a presente data, cabendo ao VENDEDOR a responsabilidade pelos d√©bitos anteriores √† imiss√£o na posse, e ao COMPRADOR os d√©bitos posteriores.\n\n**Estado de Conserva√ß√£o:**\nO im√≥vel √© entregue nas seguintes condi√ß√µes vistoriadas: {{imovel.caracteristicas.estado_conservacao}}',
        priority: 1,
        version: 1,
      },
      {
        title: 'Lei do Distrato - Patrim√¥nio de Afeta√ß√£o',
        category: 'distrato',
        code: 'LEI-DISTRATO-02',
        trigger_logic: '',
        content:
          'Quando a incorpora√ß√£o estiver submetida ao regime do patrim√¥nio de afeta√ß√£o, o incorporador poder√° reter at√© 50% (cinquenta por cento) dos valores pagos.',
        priority: 101,
        version: 1,
      },
      {
        title: 'Cl√°usula de Permuta com Torna',
        category: 'permuta',
        code: 'PERMUTA-01',
        trigger_logic: '{"path": "metadata.tipo_negociacao", "operator": "==", "value": "permuta"}',
        content:
          'As partes ajustam a permuta dos im√≥veis descritos no objeto deste contrato. Sendo os im√≥veis de valores distintos, fica convencionado o pagamento de torna em dinheiro no valor de {{financeiro.valor_torna}} pelo contratante.',
        priority: 50,
        version: 1,
      },
      {
        title: 'Checklist Documental - Lei 7.433/85',
        category: 'checklist_documental',
        code: 'CHECKLIST-01',
        trigger_logic: '',
        content:
          'Documentos exigidos nos termos da Lei n¬∫ 7.433/1985 para a lavratura da escritura p√∫blica: I - certid√£o de √¥nus reais; II - certid√£o de quita√ß√£o de tributos imobili√°rios; III - certid√µes de feitos ajuizados.',
        priority: 10,
        version: 1,
      },
      {
        title: 'Lei do Distrato - Reten√ß√£o Padr√£o (Lei 13.786/2018)',
        category: 'distrato',
        code: 'LEI-DISTRATO-01',
        trigger_logic: '',
        content:
          'Em caso de desfazimento do contrato celebrado exclusivamente com o incorporador, a pena convencional n√£o poder√° exceder a 25% (vinte e cinco por cento) da quantia paga.',
        priority: 100,
        version: 1,
      },
      {
        title: 'Cl√°usula de Arbitragem',
        category: 'clausula_condicional',
        code: 'MED002',
        trigger_logic: '{"path":"compliance.arbitragem","value":true}',
        content:
          'Fica eleito o ju√≠zo arbitral para dirimir, de forma definitiva, qualquer controv√©rsia derivada do presente instrumento.',
        priority: 190,
        version: 1,
      },
      {
        title: 'Vistoria Obrigat√≥ria',
        category: 'clausula_condicional',
        code: 'VIS001',
        trigger_logic: '{"path":"posse.vistoria_obrigatoria","value":true}',
        content:
          'A entrega das chaves est√° condicionada √† realiza√ß√£o de vistoria pr√©via pelo COMPRADOR, atestando as condi√ß√µes do im√≥vel.',
        priority: 168,
        version: 1,
      },
      {
        title: 'Plataforma Assinatura Eletr√¥nica',
        category: 'clausula_condicional',
        code: 'ELE001',
        trigger_logic: '{"path":"compliance.assinatura_eletronica","value":true}',
        content:
          'Este contrato ser√° assinado digitalmente por meio da plataforma {{compliance.plataforma_assinatura}}, com validade legal nos termos da MP 2.200-2/2001.',
        priority: 170,
        version: 1,
      },
      {
        title: 'Cl√°usula de Media√ß√£o',
        category: 'clausula_condicional',
        code: 'MED001',
        trigger_logic: '{"path":"compliance.mediacao","value":true}',
        content:
          'As partes comprometem-se a submeter eventuais lit√≠gios a uma c√¢mara de media√ß√£o extrajudicial antes de postular no Poder Judici√°rio.',
        priority: 180,
        version: 1,
      },
      {
        title: 'Inadimpl√™ncia',
        category: 'clausula_fixa',
        code: 'INA001',
        trigger_logic: '',
        content:
          'O n√£o pagamento pontual de qualquer parcela sujeitar√° o COMPRADOR ao pagamento de juros de mora de 1% ao m√™s e corre√ß√£o monet√°ria.',
        priority: 162,
        version: 1,
      },
      {
        title: 'Rescis√£o por Justa Causa',
        category: 'clausula_fixa',
        code: 'RES001',
        trigger_logic: '',
        content:
          'O descumprimento de qualquer cl√°usula, n√£o sanado ap√≥s notifica√ß√£o de 15 dias, dar√° ensejo √† rescis√£o de pleno direito.',
        priority: 164,
        version: 1,
      },
      {
        title: 'Evic√ß√£o',
        category: 'clausula_fixa',
        code: 'GAR001',
        trigger_logic: '',
        content:
          'O VENDEDOR responde pelos riscos da evic√ß√£o de direito, obrigando-se a resguardar o COMPRADOR de quaisquer turba√ß√µes de terceiros.',
        priority: 166,
        version: 1,
      },
      {
        title: 'Regime de Bens Vendedor',
        category: 'clausula_condicional',
        code: 'CAS002',
        trigger_logic: '{"path":"vendedor.estado_civil","value":"Casado"}',
        content:
          'O VENDEDOR e seu c√¥njuge s√£o casados sob o regime de {{vendedor.regime_bens}}, declarando ambos plena capacidade para a presente aliena√ß√£o.',
        priority: 151,
        version: 1,
      },
      {
        title: 'Im√≥vel em Invent√°rio',
        category: 'clausula_condicional',
        code: 'INV001',
        trigger_logic: '{"path":"imovel.situacao_juridica.inventario","value":true}',
        content:
          'O VENDEDOR declara que o im√≥vel √© objeto de invent√°rio, comprometendo-se a apresentar o formal de partilha ou alvar√° judicial autorizando a venda.',
        priority: 160,
        version: 1,
      },
      {
        title: 'Tributos Comprador',
        category: 'clausula_fixa',
        code: 'TRI002',
        trigger_logic: '',
        content:
          'A partir da data da posse, correr√£o por conta exclusiva do COMPRADOR todas as despesas incidentes sobre o im√≥vel.',
        priority: 141,
        version: 1,
      },
      {
        title: 'Declara√ß√£o de Anu√™ncia e Outorga do C√¥njuge/Companheiro',
        category: 'clausula_condicional',
        code: 'CAS001',
        trigger_logic: 'vendedor.estado_civil == "Casado"',
        content:
          'Interv√©m, expressa e conjuntamente no presente instrumento, na qualidade de anuente solid√°rio, o c√¥njuge do Vendedor, Sr(a). {{vendedor.conjuge}}, outorgando sua irrevog√°vel anu√™ncia ux√≥ria e consentimento material com os termos, pre√ßo, forma de pagamento e prazos entabulados para a venda, a fim de conferir inteira efic√°cia e validade ao presente neg√≥cio jur√≠dico.',
        priority: 11,
        version: 1,
      },
      {
        title: 'Regular Representa√ß√£o por Instrumento de Procura√ß√£o P√∫blica',
        category: 'clausula_condicional',
        code: 'REP001',
        trigger_logic: 'comprador.procurador == true || vendedor.procurador == true',
        content:
          'Neste ato negocial, a respectiva parte declara e comprova encontrar-se devidamente representada pelo seu outorgado procurador, constitu√≠do por for√ßa de instrumento p√∫blico de procura√ß√£o lavrado em Notas, dotado de poderes irrevog√°veis, especiais, espec√≠ficos e aptos a legitimar a aliena√ß√£o, aquisi√ß√£o, transig√™ncia e a subscri√ß√£o formal deste compromisso de compra e venda.',
        priority: 12,
        version: 1,
      },
      {
        title: 'Assun√ß√£o de Obriga√ß√£o de Baixa de √înus e Restri√ß√µes',
        category: 'clausula_condicional',
        code: 'ONU003',
        trigger_logic: 'imovel.onus == true',
        content:
          'Em virtude da constata√ß√£o e ci√™ncia acerca da exist√™ncia de apontamentos, penhoras, a√ß√µes em curso ou demais restri√ß√µes averbadas, o Vendedor obriga-se de forma exclusiva, pessoal e irrevog√°vel a diligenciar e promover a integral e tempestiva baixa de todos os gravames de forma a tornar o im√≥vel perfeitamente livre e desembara√ßado para transfer√™ncia legal.',
        priority: 72,
        version: 1,
      },
      {
        title: 'Declara√ß√£o de Venda em Car√°ter Ad Corpus',
        category: 'clausula_fixa',
        code: 'ONU004',
        trigger_logic: 'sempre',
        content:
          'A presente venda e compra processa-se expressamente sob a modalidade "ad corpus", restando estabelecido que as dimens√µes da √°rea do im√≥vel s√£o mencionadas apenas de forma referencial e enunciativa. Consequentemente, as partes abdicam de postular futuramente qualquer abatimento de pre√ßo, acr√©scimo de valor ou suplementa√ß√£o de √°rea sob alega√ß√£o de eventual diverg√™ncia com a realidade f√≠sica.',
        priority: 73,
        version: 1,
      },
      {
        title: 'Cabal Regularidade Fiscal, Tribut√°ria e Condominial',
        category: 'clausula_fixa',
        code: 'TRI001',
        trigger_logic: 'sempre',
        content:
          'O Vendedor declara formalmente, sob todas as san√ß√µes e penas estatu√≠das em lei, que inexistem pend√™ncias fiscais, tribut√°rias, d√≠vidas condominiais, cota extra, ou obriga√ß√µes de natureza propter rem atreladas e incidentes sobre a referida propriedade imobili√°ria, responsabilizando-se pelo pagamento e quita√ß√£o de qualquer d√©bito relativo a fatos geradores anteriores √† efetiva imiss√£o na posse do Comprador.',
        priority: 85,
        version: 1,
      },
      {
        title: 'Autoriza√ß√£o e Ciente sobre Tratamento de Dados (LGPD)',
        category: 'clausula_fixa',
        code: 'LGP001',
        trigger_logic: 'sempre',
        content:
          'Em rigorosa adequa√ß√£o √† Lei Geral de Prote√ß√£o de Dados (Lei n¬∫ 13.709/18), os envolvidos declaram-se cientes e expressamente concordam que as suas informa√ß√µes e dados pessoais coletados neste instrumento ou em anexos complementares ser√£o tratados exclusivamente com a finalidade de gest√£o, execu√ß√£o contratual, faturamento, e para o escorreito cumprimento de imperativos legais, fiscais, ou determina√ß√µes de √≥rg√£os registrais e tabelionatos.',
        priority: 95,
        version: 1,
      },
      {
        title: 'Sub-roga√ß√£o Autom√°tica no Contrato de Loca√ß√£o',
        category: 'clausula_condicional',
        code: 'LOC003',
        trigger_logic: 'imovel.locado == true && posse.imediata == true',
        content:
          'Com a assinatura deste compromisso e consequente transmiss√£o da posse indireta, o Comprador sub-roga-se de pleno direito em todas as prerrogativas, direitos e deveres legais origin√°rios do Vendedor e decorrentes do referido contrato de loca√ß√£o vigente.',
        priority: 62,
        version: 1,
      },
      {
        title: 'Aliena√ß√£o Fiduci√°ria Pendente e Responsabilidade por Baixa',
        category: 'clausula_condicional',
        code: 'ONU001',
        trigger_logic: 'imovel.financiado == true',
        content:
          'As partes atestam que o im√≥vel encontra-se gravado com cl√°usula de aliena√ß√£o fiduci√°ria em garantia junto ao credor origin√°rio. O Vendedor assume o compromisso irrevog√°vel de promover a total quita√ß√£o e averba√ß√£o de baixa do aludido gravame perante a matr√≠cula, antecedendo a outorga da escritura definitiva.',
        priority: 70,
        version: 1,
      },
      {
        title: 'Ci√™ncia de Im√≥vel em Processo de Invent√°rio',
        category: 'clausula_condicional',
        code: 'ONU002',
        trigger_logic: 'imovel.inventario == true',
        content:
          'As partes reconhecem ci√™ncia de que o bem alienado encontra-se em regular processo de invent√°rio e partilha. A lavratura da escritura definitiva ocorrer√° mediante expedi√ß√£o de competente Alvar√° Judicial autorizativo, responsabilizando-se o esp√≥lio ou os herdeiros pelo escorreito tr√¢mite do feito.',
        priority: 71,
        version: 1,
      },
      {
        title: 'Comiss√£o Assegurada em Caso de Rescis√£o',
        category: 'protecao_comercial',
        code: 'COM002',
        trigger_logic: 'comissao.garantida == true',
        content:
          'Fica mutuamente reconhecido e aceito que a superveniente rescis√£o ou distrato deste instrumento por arrependimento, culpa ou infra√ß√£o de qualquer das partes n√£o elidir√°, sob nenhuma hip√≥tese, a exigibilidade do pagamento integral da comiss√£o de corretagem aos profissionais respons√°veis pela aproxima√ß√£o √∫til das partes.',
        priority: 51,
        version: 1,
      },
      {
        title: 'Declara√ß√£o e Ci√™ncia de Loca√ß√£o Vigente',
        category: 'clausula_condicional',
        code: 'LOC001',
        trigger_logic: 'imovel.locado == true',
        content:
          'O Comprador atesta e declara ter ci√™ncia inequ√≠voca de que o im√≥vel objeto do presente contrato encontra-se atualmente locado a terceiros, existindo contrato formal de loca√ß√£o em plena vig√™ncia, cujo teor o Comprador analisou e aceitou.',
        priority: 60,
        version: 1,
      },
      {
        title: 'Prova de Ren√∫ncia ao Direito de Prefer√™ncia do Locat√°rio',
        category: 'clausula_condicional',
        code: 'LOC002',
        trigger_logic: 'imovel.locado == true',
        content:
          'O Vendedor declara e comprova cabalmente neste ato que o atual locat√°rio do im√≥vel renunciou de forma tempestiva e expressa ao seu direito de prefer√™ncia para a aquisi√ß√£o da unidade, conforme notifica√ß√£o e carta de ren√∫ncia assinadas e com firmas reconhecidas, cujas c√≥pias foram entregues ao Comprador.',
        priority: 61,
        version: 1,
      },
      {
        title: 'Multa Di√°ria por Atraso na Desocupa√ß√£o',
        category: 'clausula_condicional',
        code: 'POS003',
        trigger_logic: 'imovel.ocupado == true',
        content:
          'Na hip√≥tese de o Vendedor n√£o desocupar e entregar as chaves do im√≥vel na data expressamente aprazada, este incorrer√° no pagamento de multa penal e n√£o compensat√≥ria no valor de R$ {{posse.multa_desocupacao}} por dia de atraso, sem preju√≠zo da responsabilidade por eventuais perdas e danos causados.',
        priority: 41,
        version: 1,
      },
      {
        title: 'Responsabilidade por Conserva√ß√£o at√© a Entrega',
        category: 'clausula_condicional',
        code: 'POS004',
        trigger_logic: 'posse.imediata == false',
        content:
          'At√© a data e momento da efetiva entrega das chaves e imiss√£o na posse pelo Comprador, o Vendedor obriga-se a zelar e manter o im√≥vel rigorosamente no mesmo estado de conserva√ß√£o em que se encontra nesta data, respondendo integralmente por deteriora√ß√µes ou danos ocorridos no √≠nterim.',
        priority: 42,
        version: 1,
      },
      {
        title: 'Pagamento da Comiss√£o de Corretagem',
        category: 'protecao_comercial',
        code: 'COM001',
        trigger_logic: 'comissao.valor > 0',
        content:
          'Pela exitosa intermedia√ß√£o do presente neg√≥cio imobili√°rio, fica reconhecida como devida a comiss√£o de corretagem, estabelecida no percentual de {{comissao.percentual}}% sobre o valor da transa√ß√£o, perfazendo o montante de R$ {{comissao.valor}}, devida exclusivamente pela parte comissionante.',
        priority: 50,
        version: 1,
      },
      {
        title: 'Vencimento Antecipado da D√≠vida',
        category: 'clausula_condicional',
        code: 'FIN006',
        trigger_logic: 'financeiro.parcelas > 1',
        content:
          'O atraso cont√≠nuo e ininterrupto superior a 30 (trinta) dias no pagamento de qualquer das parcelas estipuladas acarretar√° o vencimento imediato e antecipado de todo o saldo devedor vincendo, tornando o presente instrumento t√≠tulo executivo extrajudicial.',
        priority: 27,
        version: 1,
      },
      {
        title: 'Posse Direta e Imediata',
        category: 'clausula_condicional',
        code: 'POS001',
        trigger_logic: 'posse.imediata == true',
        content:
          'A posse direta, justa e prec√°ria do im√≥vel √© transmitida ao Comprador neste ato, mediante a tradi√ß√£o e entrega formal das chaves, momento a partir do qual este passar√° a arcar integralmente com todos os impostos, taxas, contas de consumo e condom√≠nio incidentes sobre a unidade.',
        priority: 40,
        version: 1,
      },
      {
        title: 'Transmiss√£o da Posse Futura',
        category: 'clausula_condicional',
        code: 'POS002',
        trigger_logic: 'posse.imediata == false',
        content:
          'A posse direita do im√≥vel ser√° integralmente transferida ao Comprador na data preestabelecida de {{posse.data_posse}}, devendo o im√≥vel ser entregue inteiramente livre e desocupado de pessoas ou coisas n√£o constantes da negocia√ß√£o, condicionando-se tal ato ao pagamento da etapa correspondente do saldo devedor.',
        priority: 40,
        version: 1,
      },
      {
        title: 'Uso de Recursos do FGTS',
        category: 'clausula_condicional',
        code: 'FIN003',
        trigger_logic: 'comprador.fgts == true',
        content:
          'Fica expressamente autorizada e prevista a libera√ß√£o e saque de recursos das contas vinculadas do FGTS do Comprador para compor o pagamento da aquisi√ß√£o do im√≥vel, devendo este cumprir todas as normativas e exig√™ncias do Conselho Curador do FGTS e da Caixa Econ√¥mica Federal.',
        priority: 32,
        version: 1,
      },
      {
        title: 'Pagamento Parcelado Diretamente ao Vendedor',
        category: 'clausula_condicional',
        code: 'FIN004',
        trigger_logic: 'financeiro.parcelas > 1',
        content:
          'O saldo remanescente do pre√ßo ajustado ser√° pago em {{financeiro.parcelas}} parcelas mensais, sucessivas e corrigidas monetariamente, conforme pactuado pelas partes e especificado no quadro resumo.',
        priority: 25,
        version: 1,
      },
      {
        title: 'Multa de Inadimpl√™ncia',
        category: 'clausula_condicional',
        code: 'FIN005',
        trigger_logic: 'financeiro.parcelas > 1',
        content:
          'O eventual atraso no pagamento de qualquer parcela sujeitar√° o Comprador √† multa morat√≥ria equivalente a 2% (dois por cento) sobre o valor total do d√©bito em aberto, acrescida de juros de mora de 1% (um por cento) ao m√™s, incidentes pro rata die.',
        priority: 26,
        version: 1,
      },
      {
        title: 'Foro de Elei√ß√£o',
        category: 'clausula_fixa',
        code: 'FIX008',
        trigger_logic: 'sempre',
        content:
          'Para dirimir quaisquer quest√µes oriundas ou relativas √† interpreta√ß√£o ou execu√ß√£o deste contrato que n√£o puderem ser resolvidas de forma extrajudicial e amig√°vel, as partes elegem o foro da Comarca de {{operacao.foro}}, renunciando expressamente a qualquer outro, por mais privilegiado que seja.',
        priority: 100,
        version: 1,
      },
      {
        title: 'Financiamento Banc√°rio - Aprova√ß√£o',
        category: 'clausula_condicional',
        code: 'FIN001',
        trigger_logic: 'comprador.financiamento == true',
        content:
          'A parcela de R$ {{financeiro.valor_financiamento}} ser√° paga por meio de recursos provenientes de financiamento banc√°rio imobili√°rio a ser obtido pelo Comprador junto √† institui√ß√£o {{financeiro.instituicao_financeira}} ou outra cong√™nere de sua escolha.',
        priority: 30,
        version: 1,
      },
      {
        title: 'Prazo para Obten√ß√£o do Financiamento',
        category: 'clausula_condicional',
        code: 'FIN002',
        trigger_logic: 'comprador.financiamento == true',
        content:
          'O Comprador ter√° o prazo estipulado de {{financeiro.prazo_financiamento}} dias, contados da assinatura deste instrumento, para protocolar e providenciar toda a documenta√ß√£o necess√°ria √† aprova√ß√£o do cr√©dito. A n√£o obten√ß√£o do cr√©dito por culpa exclusiva do Comprador ensejar√° a possibilidade de rescis√£o contratual e reten√ß√£o do sinal/arras.',
        priority: 31,
        version: 1,
      },
      {
        title: 'Evic√ß√£o de Direito',
        category: 'clausula_fixa',
        code: 'FIX005',
        trigger_logic: 'sempre',
        content:
          'O Vendedor se responsabiliza pelos riscos da evic√ß√£o, garantindo a origem, a boa e pac√≠fica posse e o dom√≠nio do im√≥vel ora transacionado, comprometendo-se a defend√™-lo de quaisquer turba√ß√µes de terceiros e respondendo por todos os √¥nus decorrentes.',
        priority: 91,
        version: 1,
      },
      {
        title: 'Outorga da Escritura Definitiva',
        category: 'clausula_fixa',
        code: 'FIX006',
        trigger_logic: 'sempre',
        content:
          'A escritura definitiva de compra e venda ser√° outorgada ao Comprador ou a quem este expressamente indicar, em data oportuna, condicionada impreterivelmente √† quita√ß√£o integral do pre√ßo ajustado neste instrumento.',
        priority: 80,
        version: 1,
      },
      {
        title: 'Despesas com Escritura√ß√£o e Registro',
        category: 'clausula_fixa',
        code: 'FIX007',
        trigger_logic: 'sempre',
        content:
          'Todas as despesas relativas √† lavratura da escritura definitiva, imposto de transmiss√£o (ITBI), taxas, emolumentos, registro no Cart√≥rio de Im√≥veis, despachante e outras necess√°rias √† transfer√™ncia da propriedade correr√£o por conta exclusiva do Comprador.',
        priority: 81,
        version: 1,
      },
      {
        title: 'Pre√ßo Total',
        category: 'clausula_fixa',
        code: 'FIX002',
        trigger_logic: 'sempre',
        content:
          'O pre√ßo certo, ajustado e irreajust√°vel para a presente promessa de compra e venda √© de R$ {{financeiro.valor_total}}, que ser√° pago da seguinte forma e condi√ß√µes estabelecidas a seguir.',
        priority: 20,
        version: 1,
      },
      {
        title: 'Sinal e Princ√≠pio de Pagamento (Arras)',
        category: 'clausula_fixa',
        code: 'FIX003',
        trigger_logic: 'financeiro.valor_sinal > 0',
        content:
          'O valor de R$ {{financeiro.valor_sinal}} ser√° pago a t√≠tulo de sinal e princ√≠pio de pagamento (arras), valendo o comprovante de dep√≥sito ou transfer√™ncia como recibo, sujeitando-se ao disposto no artigo 417 do C√≥digo Civil Brasileiro.',
        priority: 21,
        version: 1,
      },
      {
        title: 'Car√°ter de Irrevogabilidade e Irretratabilidade',
        category: 'clausula_fixa',
        code: 'FIX004',
        trigger_logic: 'sempre',
        content:
          'O presente contrato √© celebrado em car√°ter irrevog√°vel e irretrat√°vel, extensivo aos herdeiros e sucessores das partes, vedado o direito de arrependimento, ressalvadas as hip√≥teses de descumprimento de cl√°usulas contratuais essenciais.',
        priority: 90,
        version: 1,
      },
      {
        title: 'Objeto - Descri√ß√£o do Im√≥vel',
        category: 'clausula_fixa',
        code: 'FIX001',
        trigger_logic: 'sempre',
        content:
          'Pelo presente instrumento e na melhor forma de direito, o Vendedor promete vender ao Comprador, e este promete comprar-lhe o im√≥vel constante de {{imovel.tipo}}, situado em {{imovel.endereco}}, matriculado sob o n¬∫ {{imovel.matricula}} no Cart√≥rio de Registro de Im√≥veis de {{imovel.cartorio}}.',
        priority: 10,
        version: 1,
      },
      {
        title: 'CAS002 - Outorga',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'O c√¥njuge do VENDEDOR declara concordar com todas as cl√°usulas deste instrumento, prestando sua outorga ux√≥ria/marital para a venda.',
        priority: 1,
        version: 1,
      },
      {
        title: 'COM002 - N√£o Concretiza√ß√£o',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'A comiss√£o de corretagem ser√° devida integralmente mesmo que o neg√≥cio n√£o se concretize por arrependimento das partes.',
        priority: 1,
        version: 1,
      },
      {
        title: 'COM003 - Reten√ß√£o do Sinal',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'Fica expressamente autorizada a reten√ß√£o do valor da comiss√£o diretamente do montante pago a t√≠tulo de sinal.',
        priority: 1,
        version: 1,
      },
      {
        title: 'COM004 - Solidariedade',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'As partes respondem solidariamente pelo pagamento da comiss√£o de corretagem em caso de dolo ou fraude processual.',
        priority: 1,
        version: 1,
      },
      {
        title: 'LOC002 - Ren√∫ncia Prefer√™ncia',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'O VENDEDOR apresenta neste ato a carta de ren√∫ncia ao direito de prefer√™ncia devidamente assinada pelo atual locat√°rio.',
        priority: 1,
        version: 1,
      },
      {
        title: 'LOC003 - Sub-roga√ß√£o',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'O COMPRADOR sub-roga-se nos direitos e deveres do contrato de loca√ß√£o a partir da data de imiss√£o na posse.',
        priority: 1,
        version: 1,
      },
      {
        title: 'INV002 - Alvar√° Judicial',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'Fica condicionada a validade desta promessa √† expedi√ß√£o de Alvar√° Judicial autorizando a aliena√ß√£o do bem.',
        priority: 1,
        version: 1,
      },
      {
        title: 'INV003 - Riscos de Invent√°rio',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'O COMPRADOR declara estar plenamente ciente dos riscos e prazos inerentes √† aquisi√ß√£o de im√≥vel pendente de invent√°rio.',
        priority: 1,
        version: 1,
      },
      {
        title: 'POS002 - Vistoria Pr√©via',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'O COMPRADOR declara ter vistoriado o im√≥vel e aceita receb√™-lo no estado de conserva√ß√£o em que se encontra.',
        priority: 1,
        version: 1,
      },
      {
        title: 'POS003 - Danos na Desocupa√ß√£o',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'O VENDEDOR responder√° civil e criminalmente por quaisquer danos causados ao im√≥vel durante o per√≠odo de desocupa√ß√£o.',
        priority: 1,
        version: 1,
      },
      {
        title: 'POS004 - Reten√ß√£o de Valores',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'Fica autorizada a reten√ß√£o de 10% do valor final at√© a efetiva desocupa√ß√£o e entrega das chaves, como garantia.',
        priority: 1,
        version: 1,
      },
      {
        title: 'FIN002 - Condi√ß√£o Resolutiva',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'A presente venda fica condicionada √† aprova√ß√£o do financiamento no valor de R$ {{valor_financiamento}}.',
        priority: 1,
        version: 1,
      },
      {
        title: 'FIN003 - Restitui√ß√£o',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'Em caso de negativa do financiamento por culpa n√£o atribu√≠vel ao COMPRADOR, os valores pagos a t√≠tulo de sinal ser√£o restitu√≠dos integralmente.',
        priority: 1,
        version: 1,
      },
      {
        title: 'FIN004 - Prazos e Dilig√™ncias',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'O COMPRADOR dever√° entregar todos os documentos exigidos pela institui√ß√£o financeira {{instituicao_financeira}} no prazo de {{prazo_financiamento}} dias.',
        priority: 1,
        version: 1,
      },
      {
        title: 'FIN005 - Despesas Financiamento',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'Todas as despesas com o financiamento banc√°rio correr√£o por conta exclusiva do COMPRADOR.',
        priority: 1,
        version: 1,
      },
      {
        title: 'CAS001 - Anu√™ncia Conjugal',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'O c√¥njuge do VENDEDOR, Sr(a). {{conjuge_vendedor}}, comparece neste ato para prestar sua expressa outorga ux√≥ria/marital, ratificando a venda sob o regime de {{regime_bens_vendedor}}.',
        priority: 1,
        version: 1,
      },
      {
        title: 'POS001 - Im√≥vel Ocupado',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'O im√≥vel encontra-se ocupado, comprometendo-se o VENDEDOR a desocup√°-lo e entreg√°-lo livre de pessoas e coisas at√© {{prazo_desocupacao}} dias ap√≥s a assinatura, sob pena de multa di√°ria de R$ {{multa_desocupacao}}.',
        priority: 1,
        version: 1,
      },
      {
        title: 'LOC001 - Im√≥vel Locado',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'O im√≥vel encontra-se locado, declarando o COMPRADOR ter ci√™ncia do contrato de loca√ß√£o vigente.',
        priority: 1,
        version: 1,
      },
      {
        title: 'INV001 - Invent√°rio',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'O im√≥vel encontra-se em processo de invent√°rio, ficando a outorga da escritura definitiva condicionada √† expedi√ß√£o do formal de partilha.',
        priority: 1,
        version: 1,
      },
      {
        title: 'COM001 - Comiss√£o',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'A comiss√£o de corretagem, no importe de R$ {{valor_comissao}} ({{percentual_comissao}}%), ser√° paga ao intermediador da negocia√ß√£o pelo {{responsavel_comissao}}.',
        priority: 1,
        version: 1,
      },
      {
        title: 'FIX006 - LGPD',
        category: 'clausula_fixa',
        code: '',
        trigger_logic: '',
        content:
          'As partes concordam com o tratamento de seus dados pessoais para a finalidade espec√≠fica de execu√ß√£o deste contrato, nos termos da Lei Geral de Prote√ß√£o de Dados (Lei n¬∫ 13.709/2018).',
        priority: 1,
        version: 1,
      },
      {
        title: 'FIX007 - Assinatura Eletr√¥nica',
        category: 'clausula_fixa',
        code: '',
        trigger_logic: '',
        content:
          'As partes concordam em assinar o presente contrato eletronicamente atrav√©s da plataforma {{plataforma_assinatura}}, possuindo a mesma validade jur√≠dica da assinatura f√≠sica.',
        priority: 1,
        version: 1,
      },
      {
        title: 'FIN001 - Financiamento Banc√°rio',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'Parte do pagamento, no valor de R$ {{valor_financiamento}}, ser√° efetuada atrav√©s de financiamento banc√°rio a ser obtido pelo COMPRADOR no prazo de {{prazo_financiamento}} dias.',
        priority: 1,
        version: 1,
      },
      {
        title: 'FIX002 - Pre√ßo',
        category: 'clausula_fixa',
        code: '',
        trigger_logic: '',
        content:
          'O pre√ßo certo e ajustado para a presente venda e compra √© de R$ {{valor_total}}, que ser√° pago da seguinte forma: Sinal de R$ {{valor_sinal}} na data {{data_pagamento_sinal}} e demais parcelas conforme acordado.',
        priority: 1,
        version: 1,
      },
      {
        title: 'FIX003 - Foro',
        category: 'clausula_fixa',
        code: '',
        trigger_logic: '',
        content:
          'As partes elegem o foro da Comarca de {{foro_comarca}} para dirimir quaisquer d√∫vidas oriundas deste contrato.',
        priority: 1,
        version: 1,
      },
      {
        title: 'FIX004 - Boa F√©',
        category: 'clausula_fixa',
        code: '',
        trigger_logic: '',
        content:
          'As partes obrigam-se a guardar, assim na conclus√£o do contrato, como em sua execu√ß√£o, os princ√≠pios de probidade e boa-f√©.',
        priority: 1,
        version: 1,
      },
      {
        title: 'FIX005 - Irrevogabilidade',
        category: 'clausula_fixa',
        code: '',
        trigger_logic: '',
        content: 'O presente contrato √© celebrado em car√°ter irrevog√°vel e irretrat√°vel.',
        priority: 1,
        version: 1,
      },
      {
        title: 'FIX001 - Objeto',
        category: 'clausula_fixa',
        code: '',
        trigger_logic: '',
        content:
          'O VENDEDOR promete vender e o COMPRADOR promete comprar o im√≥vel descrito como {{tipo_imovel}}, localizado em {{endereco_imovel}}, matr√≠cula {{matricula_imovel}} do {{cartorio_imovel}}.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Declara√ß√£o de Certid√µes',
        category: 'protecao_comercial',
        code: '',
        trigger_logic: '',
        content:
          'O VENDEDOR declara, sob as penas da lei civil e criminal, que apresentou todas as certid√µes negativas de feitos ajuizados, d√©bitos fiscais e trabalhistas, bem como certid√£o de √¥nus reais atualizada do im√≥vel, as quais foram devidamente analisadas e aceitas pelo COMPRADOR.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Cl√°usula de Financiamento - Prazo Banc√°rio',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'O COMPRADOR ter√° o prazo de 60 (sessenta) dias contados da assinatura deste instrumento para a obten√ß√£o do cr√©dito imobili√°rio, responsabilizando-se por todas as provid√™ncias junto √† institui√ß√£o financeira escolhida.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Cl√°usula de Financiamento - Negativa de Cr√©dito',
        category: 'clausula_condicional',
        code: '',
        trigger_logic: '',
        content:
          'Em caso de negativa de cr√©dito por culpa de restri√ß√µes no CPF ou incapacidade financeira do COMPRADOR, o contrato poder√° ser rescindido de pleno direito pelo VENDEDOR, com reten√ß√£o das Arras pagas a t√≠tulo de indeniza√ß√£o.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Prote√ß√£o LGPD',
        category: 'protecao_comercial',
        code: '',
        trigger_logic: '',
        content:
          'As partes autorizam o tratamento de dados pessoais fornecidos neste instrumento exclusivamente para fins de execu√ß√£o deste contrato, registros p√∫blicos e cumprimento de obriga√ß√µes legais, em estrita conformidade com a Lei Geral de Prote√ß√£o de Dados (Lei n¬∫ 13.709/2018).',
        priority: 1,
        version: 1,
      },
      {
        title: 'Assinatura Eletr√¥nica',
        category: 'protecao_comercial',
        code: '',
        trigger_logic: '',
        content:
          'As partes reconhecem como v√°lida, plenamente eficaz e com for√ßa de t√≠tulo executivo extrajudicial a assinatura eletr√¥nica do presente instrumento, independentemente de certifica√ß√£o digital no padr√£o ICP-Brasil.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Cl√°usula de Arras',
        category: 'clausula_fixa',
        code: '',
        trigger_logic: '',
        content:
          'As partes ajustam que o valor pago a t√≠tulo de sinal constitui Arras, nos termos dos artigos 417 a 420 do C√≥digo Civil. Em caso de desist√™ncia do COMPRADOR, este perder√° o valor dado como sinal. Caso a desist√™ncia ocorra por parte do VENDEDOR, dever√° restitu√≠-lo em dobro.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Provimento CNJ 88/2019 - PLD/FT',
        category: 'legislacao',
        code: '',
        trigger_logic: '',
        content:
          'O Provimento n¬∫ 88/2019 do Conselho Nacional de Justi√ßa (CNJ) disp√µe sobre a pol√≠tica, os procedimentos e os controles a serem adotados pelos not√°rios e registradores visando √† preven√ß√£o dos crimes de lavagem de dinheiro e do financiamento do terrorismo (PLD/FT). Exige a identifica√ß√£o rigorosa das partes, a qualifica√ß√£o dos benefici√°rios finais e a comunica√ß√£o de opera√ß√µes suspeitas ao Conselho de Controle de Atividades Financeiras (COAF), especialmente em transa√ß√µes imobili√°rias pagas em esp√©cie, com valores incompat√≠veis com o patrim√¥nio, ou envolvendo Pessoas Expostas Politicamente (PEP).',
        priority: 1,
        version: 1,
      },
      {
        title: 'Manual de Compliance Notarial - Opera√ß√µes Suspeitas',
        category: 'boas_praticas',
        code: '',
        trigger_logic: '',
        content:
          'No √¢mbito de transa√ß√µes imobili√°rias, s√£o consideradas opera√ß√µes suspeitas de lavagem de dinheiro: pagamento de montantes expressivos em esp√©cie; resist√™ncia em fornecer informa√ß√µes sobre a origem dos recursos ou sobre os benefici√°rios finais; transa√ß√µes imobili√°rias com valores flagrantemente discrepantes do valor de mercado; uso de empresas de fachada ou testas de ferro; e opera√ß√µes incompat√≠veis com a capacidade financeira das partes. O contrato deve conter cl√°usulas declarat√≥rias de licitude dos recursos e ci√™ncia do dever de comunica√ß√£o ao COAF.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Cl√°usula Obrigat√≥ria PLD/FT (Provimento 88 CNJ)',
        category: 'boas_praticas',
        code: '',
        trigger_logic: '',
        content:
          'Nos contratos de compra e venda de im√≥veis, deve constar cl√°usula em que as partes declaram, sob as penas da lei, que os recursos utilizados na transa√ß√£o t√™m origem l√≠cita e n√£o s√£o fruto de crimes, e que est√£o cientes de que a opera√ß√£o poder√° ser comunicada ao COAF, na forma da Lei n¬∫ 9.613/1998 e do Provimento CNJ n¬∫ 88/2019.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Padr√£o Godoy Prime Realty - Cl√°usula de Financiamento',
        category: 'boas_praticas',
        code: '',
        trigger_logic: '',
        content:
          "A Cl√°usula de Financiamento padr√£o da Godoy Prime Realty determina que: a) O COMPRADOR √© o √∫nico e exclusivo respons√°vel pela obten√ß√£o do cr√©dito; b) Em caso de negativa de cr√©dito por qualquer motivo (restri√ß√µes ou insufici√™ncia de renda), este dever√° quitar o saldo devedor com recursos pr√≥prios no prazo m√°ximo de 30 (trinta) dias, sob pena de rescis√£o por sua culpa exclusiva, com reten√ß√£o do sinal; c) Atrasos burocr√°ticos do banco n√£o isentam o COMPRADOR das responsabilidades assumidas, salvo se o atraso for causado por pend√™ncias do VENDEDOR; d) O VENDEDOR deve fornecer a documenta√ß√£o exigida no prazo do banco. Quando o contrato apresentar esta cl√°usula exatamente com estes itens, n√£o h√° omiss√µes ou riscos em rela√ß√£o √† forma de pagamento, e o status de conformidade deve ser 'conforme'.",
        priority: 1,
        version: 1,
      },
      {
        title: 'Padr√£o Godoy Prime Realty - Documenta√ß√£o Exaustiva (Prazo de 10 dias)',
        category: 'boas_praticas',
        code: '',
        trigger_logic: '',
        content:
          'Em todos os contratos de compra e venda elaborados sob o padr√£o Godoy Prime Realty, a Cl√°usula de Documenta√ß√£o deve exigir obrigatoriamente e de forma expl√≠cita que os documentos sejam apresentados no prazo de 10 (dez) dias corridos. A lista exaustiva √© composta por: VENDEDOR (C√≥pia do RG e CPF, Certid√£o de Casamento/Nascimento atualizada, Comprovante de resid√™ncia atualizado, Certid√£o Negativa de D√©bitos Trabalhistas - CNDT, Certid√µes de Feitos Ajuizados da Justi√ßa Federal, Estadual e do Trabalho, Certid√£o de Objeto e P√©, e Certid√£o de Protestos da comarca de domic√≠lio do VENDEDOR e da localiza√ß√£o do im√≥vel); IM√ìVEL (Certid√£o de √înus Reais atualizada, Certid√£o de Quita√ß√£o Fiscal/IPTU, Certid√£o de Quita√ß√£o Condominial assinada pelo s√≠ndico com ata de elei√ß√£o, e Certid√£o Negativa de D√©bitos de Taxa de Inc√™ndio se aplic√°vel). Contratos contendo exatamente esta lista e o prazo de 10 dias est√£o 100% em conformidade documental.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Modelo Padr√£o - Promessa de Compra e Venda - Godoy Prime Realty',
        category: 'boas_praticas',
        code: '',
        trigger_logic: '',
        content:
          'GODOY PRIME REALTY\n‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê\n\nINSTRUMENTO PARTICULAR DE PROMESSA DE COMPRA E VENDA\n\nPor este instrumento particular, as partes abaixo qualificadas celebram o presente Contrato de Promessa de Compra e Venda, mediante as cl√°usulas e condi√ß√µes a seguir estabelecidas:\n\nCl√°usula 1¬™ - Das Partes\nVENDEDOR: [NOME_COMPLETO_VENDEDOR], nacionalidade: [NACIONALIDADE], estado civil: [ESTADO_CIVIL], profiss√£o: [PROFISSAO], portador do RG n¬∫ [NUMERO_RG] expedido por [ORGAO_EMISSOR_RG], inscrito no CPF sob o n¬∫ [CPF_VENDEDOR], residente e domiciliado em [ENDERECO_COMPLETO_VENDEDOR]. E-mail: [EMAIL_VENDEDOR], Telefone: [TELEFONE_VENDEDOR].\nCOMPRADOR: [NOME_COMPLETO_COMPRADOR], nacionalidade: [NACIONALIDADE_COMPRADOR], estado civil: [ESTADO_CIVIL_COMPRADOR], profiss√£o: [PROFISSAO_COMPRADOR], portador do RG n¬∫ [NUMERO_RG_COMPRADOR] expedido por [ORGAO_EMISSOR_RG_COMPRADOR], inscrito no CPF sob o n¬∫ [CPF_COMPRADOR], residente e domiciliado em [ENDERECO_COMPLETO_COMPRADOR]. E-mail: [EMAIL_COMPRADOR], Telefone: [TELEFONE_COMPRADOR].\n\nCl√°usula 2¬™ - Do Objeto\nO objeto do presente contrato √© o im√≥vel (tipo: [TIPO_IMOVEL]), situado em [ENDERECO_COMPLETO_IMOVEL], bairro [BAIRRO], CEP [CEP], Matr√≠cula n¬∫ [NUMERO_MATRICULA], registrado no RGI de [NUMERO_RGI], Inscri√ß√£o Municipal n¬∫ [INSCRICAO_MUNICIPAL], possuindo √°rea total de [AREA_TOTAL] m¬≤, √°rea constru√≠da de [AREA_CONSTRUIDA] m¬≤ e [NUMERO_VAGAS] vaga(s) de garagem.\n\nCl√°usula 3¬™ - Do Pre√ßo e Condi√ß√µes de Pagamento\nO pre√ßo certo e ajustado para a presente compra e venda √© de [VALOR_TOTAL] ([VALOR_TOTAL_POR_EXTENSO]), que ser√° pago da seguinte forma:\n- Sinal: [VALOR_SINAL], na data de [DATA_PAGAMENTO_SINAL], forma de pagamento: [FORMA_PAGAMENTO_SINAL].\n- Saldo: [VALOR_SALDO], conforme acordado.\n- Comiss√£o de Corretagem: [VALOR_COMISSAO], equivalente a [PERCENTUAL_COMISSAO] do valor de venda.\n\nCl√°usula 4¬™ - Da Documenta√ß√£o\nAs partes obrigam-se a apresentar as seguintes certid√µes e documentos: √înus Reais, Quita√ß√£o Fiscal, Quita√ß√£o Condominial e Negativas Pessoais.\n\nCl√°usula 5¬™ - Das Obriga√ß√µes\nO VENDEDOR obriga-se a transferir o dom√≠nio, garantir a habitabilidade e quitar impostos at√© a data da posse. O COMPRADOR obriga-se ao pagamento do pre√ßo, custos de registro e impostos futuros.\n\nCl√°usula 6¬™ - Da Posse\nA posse do im√≥vel ser√° transferida com a entrega das chaves, sujeita √† penalidade de [VALOR_MULTA_DIARIA] por dia em caso de atraso na desocupa√ß√£o ou entrega.\n\nCl√°usula 7¬™ - Das Penalidades\nEm caso de rescis√£o por culpa do COMPRADOR, perder√° este o sinal pago. Sendo a culpa do VENDEDOR, devolver√° o sinal em dobro. Em caso de atraso, haver√° multa de [PERCENTUAL_MULTA] e juros de [PERCENTUAL_JUROS] ao m√™s.\n\nCl√°usula 8¬™ - Da Rescis√£o\nCaso qualquer das partes descumpra o estipulado, a parte inocente poder√° notificar a infratora para sanar a falha, sob pena de rescis√£o de pleno direito.\n\nCl√°usula 9¬™ - Da Legisla√ß√£o\nEste contrato √© regido pelo C√≥digo Civil Brasileiro aplic√°vel √† esp√©cie.\n\nCl√°usula 10¬™ - Do Foro\nFica eleito o Foro da Comarca do Rio de Janeiro para dirimir quaisquer d√∫vidas oriundas deste contrato, renunciando a qualquer outro por mais privilegiado que seja.\n\n‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê‚ïê\nRio de Janeiro, [DATA_ASSINATURA].',
        priority: 1,
        version: 1,
      },
      {
        title: 'Cl√°usulas de Prote√ß√£o - Vendedor',
        category: 'boas_praticas',
        code: '',
        trigger_logic: '',
        content:
          'Previs√£o expressa de Arras Confirmat√≥rias ou Penitenciais (perda do sinal em caso de desist√™ncia injustificada do comprador). Direito de Reten√ß√£o do im√≥vel e das chaves at√© a liquida√ß√£o integral do saldo ou assinatura com o banco.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Jurisprud√™ncia TJRJ - Rescis√£o, IPTU e Posse',
        category: 'jurisprudencia',
        code: '',
        trigger_logic: '',
        content:
          'TJRJ: Em caso de rescis√£o de promessa de compra e venda, a reten√ß√£o pelo vendedor deve ser razo√°vel. A responsabilidade pelo pagamento do IPTU √© do promitente comprador apenas a partir da efetiva imiss√£o na posse (entrega das chaves).',
        priority: 1,
        version: 1,
      },
      {
        title: 'Estrutura Padr√£o - Compra e Venda √Ä Vista',
        category: 'boas_praticas',
        code: '',
        trigger_logic: '',
        content:
          'Contrato √Ä vista. Cl√°usulas essenciais: Qualifica√ß√£o das Partes, Objeto (Descri√ß√£o detalhada), Pre√ßo e Pagamento (Sinal e Saldo), Documenta√ß√£o exigida (Certid√µes), Obriga√ß√µes, Imiss√£o na Posse imediata ou em data certa, Multas/Penalidades, Foro.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Estrutura Padr√£o - Compra e Venda Financiada',
        category: 'boas_praticas',
        code: '',
        trigger_logic: '',
        content:
          'Contrato Financiado. Cl√°usulas essenciais: Qualifica√ß√£o das Partes, Objeto, Pre√ßo (Sinal, Refor√ßo, Complemento com Financiamento Banc√°rio), Cl√°usula de Aliena√ß√£o Fiduci√°ria, Condi√ß√µes Suspensivas de aprova√ß√£o de cr√©dito, Prazos espec√≠ficos.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Cl√°usulas de Prote√ß√£o - Comprador',
        category: 'boas_praticas',
        code: '',
        trigger_logic: '',
        content:
          'Direito a Vistoria pr√©via do im√≥vel atestando estado de conserva√ß√£o. Exig√™ncia de Documenta√ß√£o Limpa: apresenta√ß√£o de certid√µes negativas (fiscais, trabalhistas, c√≠veis) do vendedor e do im√≥vel antes de repasses de valores altos.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Lei de Registros P√∫blicos (Lei 6.015/1973)',
        category: 'legislacao',
        code: '',
        trigger_logic: '',
        content:
          'Livros I a IV. Regula o registro de im√≥veis, essencial para a transfer√™ncia da propriedade e publicidade dos atos para oponibilidade a terceiros. (Legisla√ß√£o Prim√°ria)',
        priority: 1,
        version: 1,
      },
      {
        title: 'S√∫mulas STJ - 3, 5, 6, 7, 83 a 100',
        category: 'jurisprudencia',
        code: '',
        trigger_logic: '',
        content:
          'S√∫mula 5: A simples interpreta√ß√£o de cl√°usula contratual n√£o enseja recurso especial. S√∫mula 7: A pretens√£o de simples reexame de prova n√£o enseja recurso especial. S√∫mula 84: A a√ß√£o de embargos de terceiro admite a defesa da posse advinda de compromisso de compra e venda.',
        priority: 1,
        version: 1,
      },
      {
        title: 'S√∫mulas STJ - 326 a 351',
        category: 'jurisprudencia',
        code: '',
        trigger_logic: '',
        content:
          'S√∫mula 326: Na a√ß√£o de indeniza√ß√£o por dano moral, a condena√ß√£o em montante inferior ao postulado na inicial n√£o implica sucumb√™ncia rec√≠proca. S√∫mula 332: A fian√ßa prestada sem autoriza√ß√£o de um dos c√¥njuges implica a inefic√°cia total da garantia.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Lei do Inquilinato (Lei 8.245/1991)',
        category: 'legislacao',
        code: '',
        trigger_logic: '',
        content:
          'Cap√≠tulos I a IV. A loca√ß√£o de im√≥veis urbanos regula-se pelo disposto nesta lei. Inclui garantias locat√≠cias, deveres do locador e locat√°rio, e regras sobre despejo. (Legisla√ß√£o Prim√°ria)',
        priority: 1,
        version: 1,
      },
      {
        title: 'Lei de Incorpora√ß√£o Imobili√°ria (Lei 4.591/1964)',
        category: 'legislacao',
        code: '',
        trigger_logic: '',
        content:
          'Cap√≠tulos I a IV. Disp√µe sobre o condom√≠nio em edifica√ß√µes e as incorpora√ß√µes imobili√°rias. Regula os deveres do incorporador e prote√ß√£o dos adquirentes na planta. (Legisla√ß√£o Prim√°ria)',
        priority: 1,
        version: 1,
      },
      {
        title: 'Lei de Aliena√ß√£o Fiduci√°ria (Lei 9.514/1997)',
        category: 'legislacao',
        code: '',
        trigger_logic: '',
        content:
          'Cap√≠tulos I a IV. Disp√µe sobre o Sistema de Financiamento Imobili√°rio, institui a aliena√ß√£o fiduci√°ria de coisa im√≥vel e prev√™ a consolida√ß√£o da propriedade em caso de inadimpl√™ncia. (Legisla√ß√£o Prim√°ria)',
        priority: 1,
        version: 1,
      },
      {
        title: 'C√≥digo Civil (Lei 10.406/2002) - Contratos em Geral',
        category: 'legislacao',
        code: '',
        trigger_logic: '',
        content:
          'Art. 421 a 480. A liberdade contratual ser√° exercida nos limites da fun√ß√£o social do contrato. Os princ√≠pios de probidade e boa-f√© devem ser guardados. (Legisla√ß√£o Prim√°ria)',
        priority: 1,
        version: 1,
      },
      {
        title: 'C√≥digo Civil (Lei 10.406/2002) - Compra e Venda',
        category: 'legislacao',
        code: '',
        trigger_logic: '',
        content:
          'Art. 481 a 504. Pelo contrato de compra e venda, um dos contratantes se obriga a transferir o dom√≠nio de certa coisa, e o outro, a pagar-lhe certo pre√ßo em dinheiro. O vendedor, salvo conven√ß√£o em contr√°rio, responde por todos os d√©bitos que gravem a coisa at√© o momento da tradi√ß√£o. (Legisla√ß√£o Prim√°ria)',
        priority: 1,
        version: 1,
      },
      {
        title: 'Pr√°tica Imobili√°ria RJ - Foro de Jacarepagu√°',
        category: 'boas_praticas',
        code: '',
        trigger_logic: '',
        content:
          'Para neg√≥cios envolvendo im√≥veis situados na Barra da Tijuca, Recreio dos Bandeirantes, Camorim e Vargem Grande, o foro competente padr√£o recomendado √© o Foro Regional de Jacarepagu√° da Comarca da Capital do RJ.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Lei 8.245/1991 - Lei do Inquilinato',
        category: 'legislacao',
        code: '',
        trigger_logic: '',
        content:
          'A loca√ß√£o de im√≥veis urbanos regula-se pelo disposto nesta lei. √â obrigat√≥ria a previs√£o de foro competente e qualifica√ß√£o clara e objetiva das partes.',
        priority: 1,
        version: 1,
      },
      {
        title: 'S√∫mula 326 do STJ (Dano Moral e Sucumb√™ncia)',
        category: 'jurisprudencia',
        code: '',
        trigger_logic: '',
        content:
          'Na a√ß√£o de indeniza√ß√£o por dano moral, a condena√ß√£o em montante inferior ao postulado na inicial n√£o implica sucumb√™ncia rec√≠proca. Aten√ß√£o ao prever cl√°usulas penais que desequilibrem a rela√ß√£o contratual.',
        priority: 1,
        version: 1,
      },
      {
        title: 'C√≥digo Civil - Compra e Venda (Art. 481 a 504)',
        category: 'legislacao',
        code: '',
        trigger_logic: '',
        content:
          'Pelo contrato de compra e venda, um dos contratantes se obriga a transferir o dom√≠nio de certa coisa, e o outro, a pagar-lhe certo pre√ßo em dinheiro. O pre√ßo, se n√£o houver acordo, pode ser deixado ao arb√≠trio de terceiro.',
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
    // limpa tudo que houver (remove lixo do agente)
    try {
      const olds = app.findRecordsByFilter('legal_knowledge', "id != ''", '', 2000, 0)
      for (const o of olds) {
        app.delete(o)
      }
    } catch (_) {}
    // insere os 109 verbatim
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
