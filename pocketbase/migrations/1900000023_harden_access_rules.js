// Endurecimento de regra de acesso (revisão de segurança, 2026-08-21).
//
// NOTA DE RECONCILIAÇÃO: uma auditoria com acesso AO VIVO ao banco (agente do
// Skip, via db_describe_object) mostrou que as regras reais já são mais
// restritivas que estas migrations em vários pontos:
//   - expert_support_requests / expert_proposals / chamados: já owner-ou-admin;
//   - broker_profile.create: já exige user = @request.auth.id.
// Essas NÃO são tocadas aqui — mexer arriscaria quebrar regra correta que só
// existe no banco. O que sobra, confirmado frouxo tanto na migration quanto na
// leitura ao vivo, é o create das duas coleções de log, que este arquivo fecha.
//
// legal_knowledge (leitura por qualquer autenticado x só admin) ficou
// contraditório entre duas rodadas do agente; não é mexido aqui — deve ser
// conferido direto no painel antes de decidir. Ver o guia.
//
// Cobre apenas SEC-05: a criação passa a amarrar o dono ao autor. Baixo risco:
// os logs são gravados pelo hook via $app.saveNoValidate, que ignora esta
// regra; ela só afeta POST direto na API REST (forja de registro). Reversível.

migrate(
  (app) => {
    function setCreate(nome, regra) {
      try {
        var col = app.findCollectionByNameOrId(nome)
        col.createRule = regra
        app.save(col)
      } catch (err) {
        app.logger().warn('harden SEC-05: coleção ausente', 'col', nome, 'err', String(err))
      }
    }
    setCreate('validation_logs', '@request.auth.id != "" && user = @request.auth.id')
    setCreate('validation_audit', '@request.auth.id != "" && user_id = @request.auth.id')
  },
  (app) => {
    function setCreate(nome, regra) {
      try {
        var col = app.findCollectionByNameOrId(nome)
        col.createRule = regra
        app.save(col)
      } catch (err) {
        app.logger().warn('harden SEC-05 down: coleção ausente', 'col', nome, 'err', String(err))
      }
    }
    setCreate('validation_logs', '@request.auth.id != ""')
    setCreate('validation_audit', '@request.auth.id != ""')
  },
)
