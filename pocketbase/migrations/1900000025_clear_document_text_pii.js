// Limpeza de PII (instrução do Marcus, 2026-08-07):
// Zera o campo `document_text` (seta para string vazia "") de todos os
// registros das coleções `validation_logs` e `validation_audit` criados antes
// de 07/08/2026.
//
// Contexto:
// - 13 registros em validation_logs + 13 em validation_audit, todos pré-fix
//   (anteriores ao commit 0.0.652), com status "success" e document_text
//   preenchido com PII completo (nomes, CPF, RG, endereços).
// - O código novo (pós-fix) não grava mais document_text, então registros
//   futuros não são afetados por esta migration.
// - Apenas o campo document_text é zerado; todos os demais campos (id, status,
//   parsed_result, raw_ai_response, user, document_type, etc.) são preservados,
//   mantendo intacta a trilha de auditoria.
//
// A operação é destrutiva/irreversível por design (objetivo = excluir a PII).
// O `down` é intencionalmente vazio: não há backup do texto e restaurá-lo
// reintroduziria a PII que se quer remover.
migrate(
  (app) => {
    // Data-limite: meia-noite UTC de 07/08/2026 (DD/MM/YYYY => 2026-08-07).
    var cutoff = '2026-08-07 00:00:00.000Z'

    // Conta (best-effort) quantos registros serão afetados, para o log.
    var logsCount = 0
    var auditCount = 0
    try {
      logsCount = app.findRecordsByFilter(
        'validation_logs',
        "created < '2026-08-07 00:00:00.000Z' && document_text != ''",
        'created',
        1000,
        0,
      ).length
    } catch (err) {
      app.logger().error('1900000025: count validation_logs failed', 'error', String(err))
    }
    try {
      auditCount = app.findRecordsByFilter(
        'validation_audit',
        "created < '2026-08-07 00:00:00.000Z' && document_text != ''",
        'created',
        1000,
        0,
      ).length
    } catch (err) {
      app.logger().error('1900000025: count validation_audit failed', 'error', String(err))
    }

    // Zera APENAS o document_text, preservando os demais campos.
    app
      .db()
      .newQuery(
        "UPDATE validation_logs SET document_text = '' " +
          "WHERE created < {:cutoff} AND document_text IS NOT NULL AND document_text != ''",
      )
      .bind({ cutoff: cutoff })
      .execute()

    app
      .db()
      .newQuery(
        "UPDATE validation_audit SET document_text = '' " +
          "WHERE created < {:cutoff} AND document_text IS NOT NULL AND document_text != ''",
      )
      .bind({ cutoff: cutoff })
      .execute()

    app
      .logger()
      .info(
        '1900000025 clear_document_text applied',
        'affected',
        'validation_logs=' + logsCount + ' validation_audit=' + auditCount,
      )
  },
  (app) => {
    // Intencionalmente vazio: a limpeza de PII é irreversível por design.
    // Não há como (nem se deve) restaurar o conteúdo original de document_text.
  },
)
