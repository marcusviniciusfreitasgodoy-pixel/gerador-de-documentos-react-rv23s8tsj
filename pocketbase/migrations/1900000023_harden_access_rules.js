// Endurecimento das regras de acesso (revisão de segurança, 2026-08-21).
//
// Alinha as regras de coleção com o modelo que o app já promete no front e nas
// rotas de IA, e fecha exposições de leitura. Só mexe em REGRAS (API rules);
// nenhum campo ou dado é tocado. Reversível pelo down().
//
// ATENÇÃO ao caminho de deploy: o editor do Skip não cria arquivos novos, então
// esta migration pode não subir por lá. O caminho garantido para regras é o
// painel do PocketBase (cada coleção > aba "API Rules"). Este arquivo é o
// registro versionado do que foi aplicado; as mesmas strings estão no guia.
//
// Cobre:
//   SEC-02  gate de e-mail verificado passa a valer também no banco
//   SEC-05  criação amarra o dono ao autor
//   SEC-04  legal_knowledge deixa de ser legível por qualquer conta logada
//   SEC-01  coleções de expert-support com leitura escopada ao dono ou admin

migrate(
  (app) => {
    // "@request.auth.verified = true" só faz sentido para coleções que já vivem
    // atrás do gate de verificado no app; todas abaixo são desse tipo.
    var V = '@request.auth.id != "" && @request.auth.verified = true'

    function setRules(nome, regras) {
      // Defensivo: se a coleção não existir neste ambiente, registra e segue —
      // uma migration nunca deve derrubar o boot do PocketBase.
      try {
        var col = app.findCollectionByNameOrId(nome)
        for (var k in regras) col[k] = regras[k]
        app.save(col)
      } catch (err) {
        app
          .logger()
          .warn('harden_access_rules: coleção ausente ou erro', 'col', nome, 'err', String(err))
      }
    }

    // ---- SEC-02 + SEC-05 : coleções de dados do corretor ----
    setRules('negocios', {
      listRule: 'owner = @request.auth.id && @request.auth.verified = true',
      viewRule: 'owner = @request.auth.id && @request.auth.verified = true',
      createRule: V + ' && owner = @request.auth.id',
      updateRule: 'owner = @request.auth.id && @request.auth.verified = true',
      deleteRule: 'owner = @request.auth.id && @request.auth.verified = true',
    })
    setRules('broker_profile', {
      listRule: 'user = @request.auth.id && @request.auth.verified = true',
      viewRule: 'user = @request.auth.id && @request.auth.verified = true',
      createRule: V + ' && user = @request.auth.id',
      updateRule: 'user = @request.auth.id && @request.auth.verified = true',
      deleteRule: 'user = @request.auth.id && @request.auth.verified = true',
    })
    setRules('validation_logs', {
      listRule: V + ' && user = @request.auth.id',
      viewRule: V + ' && user = @request.auth.id',
      createRule: V + ' && user = @request.auth.id',
      updateRule: V + ' && user = @request.auth.id',
      deleteRule: V + ' && user = @request.auth.id',
    })
    setRules('validation_audit', {
      listRule: V + ' && user_id = @request.auth.id',
      viewRule: V + ' && user_id = @request.auth.id',
      createRule: V + ' && user_id = @request.auth.id',
      // update/delete continuam null (só admin), como no create original
    })

    // ---- SEC-04 : base jurídica só para admin (validador lê via $app, não afeta) ----
    setRules('legal_knowledge', {
      listRule: '@request.auth.isAdmin = true',
      viewRule: '@request.auth.isAdmin = true',
    })

    // ---- SEC-01 : expert-support, leitura escopada ao dono OU admin ----
    // Só list/view (a exposição real é de LEITURA). Create/update/delete ficam
    // como estão no banco, para não arriscar o fluxo do especialista sem ver as
    // regras atuais ao vivo.
    var donoOuAdmin =
      '@request.auth.id != "" && (%OWNER% = @request.auth.id || @request.auth.isAdmin = true)'
    setRules('expert_support_requests', {
      listRule: donoOuAdmin.replace(/%OWNER%/g, 'user'),
      viewRule: donoOuAdmin.replace(/%OWNER%/g, 'user'),
    })
    setRules('chamados', {
      listRule: donoOuAdmin.replace(/%OWNER%/g, 'user'),
      viewRule: donoOuAdmin.replace(/%OWNER%/g, 'user'),
    })
    // proposals: dono é transitivo via request.user
    setRules('expert_proposals', {
      listRule: donoOuAdmin.replace(/%OWNER%/g, 'request.user'),
      viewRule: donoOuAdmin.replace(/%OWNER%/g, 'request.user'),
    })
  },

  // ---- down(): restaura as regras anteriores conhecidas ----
  (app) => {
    function setRules(nome, regras) {
      try {
        var col = app.findCollectionByNameOrId(nome)
        for (var k in regras) col[k] = regras[k]
        app.save(col)
      } catch (err) {
        app
          .logger()
          .warn('harden_access_rules down: coleção ausente', 'col', nome, 'err', String(err))
      }
    }
    setRules('negocios', {
      listRule: 'owner = @request.auth.id',
      viewRule: 'owner = @request.auth.id',
      createRule: '@request.auth.id != "" && owner = @request.auth.id',
      updateRule: 'owner = @request.auth.id',
      deleteRule: 'owner = @request.auth.id',
    })
    setRules('broker_profile', {
      listRule: 'user = @request.auth.id',
      viewRule: 'user = @request.auth.id',
      createRule: '@request.auth.id != ""',
      updateRule: 'user = @request.auth.id',
      deleteRule: 'user = @request.auth.id',
    })
    setRules('validation_logs', {
      listRule: '@request.auth.id != "" && user = @request.auth.id',
      viewRule: '@request.auth.id != "" && user = @request.auth.id',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != "" && user = @request.auth.id',
      deleteRule: '@request.auth.id != "" && user = @request.auth.id',
    })
    setRules('validation_audit', {
      listRule: '@request.auth.id != "" && user_id = @request.auth.id',
      viewRule: '@request.auth.id != "" && user_id = @request.auth.id',
      createRule: '@request.auth.id != ""',
    })
    setRules('legal_knowledge', {
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
    })
    // expert-*: o estado anterior não é conhecido (sem migration de origem);
    // o down não as toca para não gravar uma regra inventada por cima.
  },
)
