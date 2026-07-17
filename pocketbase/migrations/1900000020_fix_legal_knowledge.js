migrate(
  (app) => {
    var dupCount = 0
    var delCount = 0
    var codeCount = 0
    var restoreCount = 0
    var adjustCount = 0

    var col
    try {
      col = app.findCollectionByNameOrId('legal_knowledge')
    } catch (err) {
      app.logger().error('1900000020: legal_knowledge collection not found', 'error', String(err))
      return
    }

    // ── 1. Delete duplicate by ID ──────────────────────────────────────
    try {
      var dup = app.findRecordById('legal_knowledge', '37djnj96nfbb2xa')
      app.delete(dup)
      dupCount++
    } catch (_) {}

    // ── 2. Delete obsolete records by title ────────────────────────────
    var titlesToDelete = [
      'CAS001 - Anu\u00eancia Conjugal',
      'CAS002 - Outorga',
      'COM001 - Comiss\u00e3o',
      'COM002 - N\u00e3o Concretiza\u00e7\u00e3o',
      'FIN001 - Financiamento Banc\u00e1rio',
      'FIN002 - Condi\u00e7\u00e3o Resolutiva',
      'FIN004 - Prazos e Dilig\u00eancias',
      'FIX001 - Objeto',
      'FIX002 - Pre\u00e7o',
      'FIX003 - Foro',
      'FIX005 - Irrevogabilidade',
      'FIX006 - LGPD',
      'FIX007 - Assinatura Eletr\u00f4nica',
      'INV001 - Invent\u00e1rio',
      'LOC001 - Im\u00f3vel Locado',
      'LOC002 - Ren\u00fancia Prefer\u00eancia',
      'LOC003 - Sub-roga\u00e7\u00e3o',
      'POS001 - Im\u00f3vel Ocupado',
      'POS002 - Vistoria Pr\u00e9via',
    ]

    for (var t = 0; t < titlesToDelete.length; t++) {
      try {
        var rec = app.findFirstRecordByData('legal_knowledge', 'title', titlesToDelete[t])
        app.delete(rec)
        delCount++
      } catch (_) {}
    }

    // ── 3. Update code field for 38 records ────────────────────────────
    var codeUpdates = [
      { title: 'COM003 - Reten\u00e7\u00e3o do Sinal', code: 'COM003' },
      { title: 'COM004 - Solidariedade', code: 'COM004' },
      { title: 'INV002 - Alvar\u00e1 Judicial', code: 'INV002' },
      { title: 'INV003 - Riscos de Invent\u00e1rio', code: 'INV003' },
      { title: 'POS003 - Danos na Desocupa\u00e7\u00e3o', code: 'POS003' },
      { title: 'POS004 - Reten\u00e7\u00e3o de Valores', code: 'POS004' },
      { title: 'FIN003 - Restitui\u00e7\u00e3o', code: 'FIN003' },
      { title: 'FIN005 - Despesas Financiamento', code: 'FIN005' },
      { title: 'FIX004 - Boa F\u00e9', code: 'BFE001' },
      { title: 'Declara\u00e7\u00e3o de Certid\u00f5es', code: 'DEC001' },
      { title: 'Cl\u00e1usula de Financiamento - Prazo Banc\u00e1rio', code: 'FIN007' },
      { title: 'Cl\u00e1usula de Financiamento - Negativa de Cr\u00e9dito', code: 'FIN008' },
      { title: 'Prote\u00e7\u00e3o LGPD', code: 'LGP002' },
      { title: 'Assinatura Eletr\u00f4nica', code: 'ELE002' },
      { title: 'Cl\u00e1usula de Arras', code: 'ARR001' },
      { title: 'Provimento CNJ 88/2019 - PLD/FT', code: 'PLD001' },
      { title: 'Manual de Compliance Notarial - Opera\u00e7\u00f5es Suspeitas', code: 'PLD002' },
      { title: 'Cl\u00e1usula Obrigat\u00f3ria PLD/FT (Provimento 88 CNJ)', code: 'PLD003' },
      { title: 'Padr\u00e3o Godoy Prime Realty - Cl\u00e1usula de Financiamento', code: 'GOD001' },
      {
        title:
          'Padr\u00e3o Godoy Prime Realty - Documenta\u00e7\u00e3o Exaustiva (Prazo de 10 dias)',
        code: 'GOD002',
      },
      {
        title: 'Modelo Padr\u00e3o - Promessa de Compra e Venda - Godoy Prime Realty',
        code: 'GOD003',
      },
      { title: 'Cl\u00e1usulas de Prote\u00e7\u00e3o - Vendedor', code: 'PRV001' },
      { title: 'Jurisprud\u00eancia TJRJ - Rescis\u00e3o, IPTU e Posse', code: 'JUR001' },
      { title: 'Estrutura Padr\u00e3o - Compra e Venda \u00c0 Vista', code: 'EST001' },
      { title: 'Estrutura Padr\u00e3o - Compra e Venda Financiada', code: 'EST002' },
      { title: 'Cl\u00e1usulas de Prote\u00e7\u00e3o - Comprador', code: 'PRC001' },
      { title: 'Lei de Registros P\u00fablicos (Lei 6.015/1973)', code: 'LEG001' },
      { title: 'S\u00famulas STJ - 3, 5, 6, 7, 83 a 100', code: 'JUR002' },
      { title: 'S\u00famulas STJ - 326 a 351', code: 'JUR003' },
      { title: 'Lei do Inquilinato (Lei 8.245/1991)', code: 'LEG002' },
      { title: 'Lei de Incorpora\u00e7\u00e3o Imobili\u00e1ria (Lei 4.591/1964)', code: 'LEG003' },
      { title: 'Lei de Aliena\u00e7\u00e3o Fiduci\u00e1ria (Lei 9.514/1997)', code: 'LEG004' },
      { title: 'C\u00f3digo Civil (Lei 10.406/2002) - Contratos em Geral', code: 'LEG005' },
      { title: 'C\u00f3digo Civil (Lei 10.406/2002) - Compra e Venda', code: 'LEG006' },
      { title: 'Pr\u00e1tica Imobili\u00e1ria RJ - Foro de Jacarepagu\u00e1', code: 'BPR001' },
      { title: 'Lei 8.245/1991 - Lei do Inquilinato', code: 'LEG007' },
      { title: 'S\u00famula 326 do STJ (Dano Moral e Sucumb\u00eancia)', code: 'JUR004' },
      { title: 'C\u00f3digo Civil - Compra e Venda (Art. 481 a 504)', code: 'LEG008' },
    ]

    for (var c = 0; c < codeUpdates.length; c++) {
      try {
        var rec2 = app.findFirstRecordByData('legal_knowledge', 'title', codeUpdates[c].title)
        rec2.set('code', codeUpdates[c].code)
        app.save(rec2)
        codeCount++
      } catch (err) {
        app
          .logger()
          .error(
            '1900000020: code update failed for "' + codeUpdates[c].title + '"',
            'error',
            String(err),
          )
      }
    }

    // ── 4. Restore "Gold Standard - Recibo de Sinal e Arras" ───────────
    var arrasExists = false
    try {
      app.findFirstRecordByData('legal_knowledge', 'code', 'ARRAS_GOLD_01')
      arrasExists = true
    } catch (_) {}

    if (!arrasExists) {
      try {
        var arrasRec = new Record(col)
        arrasRec.set('title', 'Gold Standard - Recibo de Sinal e Arras')
        arrasRec.set('category', 'boas_praticas')
        arrasRec.set('code', 'ARRAS_GOLD_01')
        arrasRec.set(
          'trigger_logic',
          '{"path":"metadata.tipo_contrato","operator":"==","value":"recibo_sinal"}',
        )
        arrasRec.set(
          'content',
          'Com base nos Artigos 417 a 420 do C\u00f3digo Civil Brasileiro, este recibo formaliza o pagamento do sinal.\n\n**Natureza das Arras:**\n- Arras Confirmat\u00f3rias (Art. 417 a 419, CC) - tornam o neg\u00f3cio irretrat\u00e1vel, n\u00e3o admitindo arrependimento.\n- Arras Penitenciais (Art. 420, CC) - garantem o direito de arrependimento, com a perda do sinal por quem o deu, ou a devolu\u00e7\u00e3o em dobro por quem o recebeu.\n\nA responsabilidade por eventuais desist\u00eancias seguir\u00e1 rigorosamente as estipula\u00e7\u00f5es legais referentes \u00e0 natureza das arras escolhida pelas partes.',
        )
        arrasRec.set('priority', 1)
        arrasRec.set('version', 1)
        app.save(arrasRec)
        restoreCount++
      } catch (err) {
        app.logger().error('1900000020: failed to restore ARRAS_GOLD_01', 'error', String(err))
      }
    }

    // ── 5. Content adjustments for regional scoping ────────────────────

    // 5a. "Pr\u00e1tica Imobili\u00e1ria RJ - Foro de Jacarepagu\u00e1" \u2014 add REGRA CONDICIONAL warning
    try {
      var bprRec = app.findFirstRecordByData(
        'legal_knowledge',
        'title',
        'Pr\u00e1tica Imobili\u00e1ria RJ - Foro de Jacarepagu\u00e1',
      )
      var bprContent = bprRec.getString('content')
      var bprWarning =
        'REGRA CONDICIONAL: O conte\u00fado abaixo \u00e9 um exemplo regional aplic\u00e1vel exclusivamente a im\u00f3veis situados no Rio de Janeiro/RJ. N\u00e3o aplicar a documentos de outras regi\u00f5es ou comarcas.\n\n'
      if (bprContent.indexOf('REGRA CONDICIONAL') === -1) {
        bprRec.set('content', bprWarning + bprContent)
        app.save(bprRec)
        adjustCount++
      }
    } catch (err) {
      app.logger().error('1900000020: BPR001 content adjust failed', 'error', String(err))
    }

    // 5b. "Modelo Padr\u00e3o - Promessa de Compra e Venda - Godoy Prime Realty" \u2014 add ATENCAO warning
    try {
      var godRec = app.findFirstRecordByData(
        'legal_knowledge',
        'title',
        'Modelo Padr\u00e3o - Promessa de Compra e Venda - Godoy Prime Realty',
      )
      var godContent = godRec.getString('content')
      var godWarning =
        'ATENCAO - MODELO DE REFERENCIA: O conte\u00fado abaixo \u00e9 um modelo de refer\u00eancia interno da Godoy Prime Realty. N\u00e3o deve ser aplicado literalmente a documentos de outras regi\u00f5es sem adapta\u00e7\u00e3o. Os dados entre colchetes [ ] s\u00e3o placeholders e devem ser substitu\u00eddos pelos dados reais da transa\u00e7\u00e3o.\n\n'
      if (godContent.indexOf('ATENCAO - MODELO DE REFERENCIA') === -1) {
        godRec.set('content', godWarning + godContent)
        app.save(godRec)
        adjustCount++
      }
    } catch (err) {
      app.logger().error('1900000020: GOD003 content adjust failed', 'error', String(err))
    }

    // ── 6. Log results ─────────────────────────────────────────────────
    app
      .logger()
      .info(
        '1900000020 fix_legal_knowledge complete',
        'duplicates_removed',
        String(dupCount),
        'records_deleted',
        String(delCount),
        'records_coded',
        String(codeCount),
        'records_restored',
        String(restoreCount),
        'records_adjusted',
        String(adjustCount),
      )
  },
  (app) => {
    // Data cleanup migration \u2014 no automatic down revert.
    // Re-run the seed migrations (1900000000 / 1900000002) to restore original state.
  },
)
