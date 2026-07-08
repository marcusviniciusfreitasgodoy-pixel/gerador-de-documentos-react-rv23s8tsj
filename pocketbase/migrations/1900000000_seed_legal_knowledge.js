migrate(
  (app) => {
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')

    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'marcusviniciusfreitasgodoy@gmail.com')
    } catch (_) {
      const user = new Record(usersCol)
      user.setEmail('marcusviniciusfreitasgodoy@gmail.com')
      user.setPassword('Skip@Pass')
      user.setVerified(true)
      user.set('name', 'Admin')
      app.save(user)
    }

    const legalCol = app.findCollectionByNameOrId('legal_knowledge')

    const seeds = [
      {
        title: 'Arras Confirmatórias',
        category: 'Direito Civil',
        code: 'CC-417',
        trigger_logic: 'natureza_confirmatoria',
        content:
          'As arras confirmatórias (Art. 417 a 419 do CC) confirmam a execução do contrato e servem como princípio de pagamento. Se a parte que deu as arras não cumprir o contrato, a outra pode retê-las. Se quem as recebeu falhar, deve devolvê-las em dobro.',
        priority: 1,
        version: 1,
      },
      {
        title: 'Arras Penitenciais',
        category: 'Direito Civil',
        code: 'CC-420',
        trigger_logic: 'natureza_penitencial',
        content:
          'As arras penitenciais (Art. 420 do CC) ocorrem quando é estipulado o direito de arrependimento. Elas funcionam como indenização: quem desiste perde o sinal ou devolve em dobro, sem direito a indenização suplementar.',
        priority: 2,
        version: 1,
      },
      {
        title: 'Regime de Bens - Comunhão Parcial',
        category: 'Direito de Família',
        code: 'REG-CP',
        trigger_logic: 'casado_comunhao_parcial',
        content:
          'No regime de comunhão parcial, comunicam-se os bens que sobrevierem ao casal, na constância do casamento, com as exclusões legais (bens anteriores, doações e heranças).',
        priority: 3,
        version: 1,
      },
    ]

    for (const seed of seeds) {
      try {
        app.findFirstRecordByData('legal_knowledge', 'code', seed.code)
      } catch (_) {
        const record = new Record(legalCol)
        record.set('title', seed.title)
        record.set('category', seed.category)
        record.set('code', seed.code)
        record.set('trigger_logic', seed.trigger_logic)
        record.set('content', seed.content)
        record.set('priority', seed.priority)
        record.set('version', seed.version)
        app.save(record)
      }
    }
  },
  (app) => {
    const codes = ['CC-417', 'CC-420', 'REG-CP']
    for (const code of codes) {
      try {
        const record = app.findFirstRecordByData('legal_knowledge', 'code', code)
        app.delete(record)
      } catch (_) {}
    }

    try {
      const user = app.findAuthRecordByEmail(
        '_pb_users_auth_',
        'marcusviniciusfreitasgodoy@gmail.com',
      )
      app.delete(user)
    } catch (_) {}
  },
)
