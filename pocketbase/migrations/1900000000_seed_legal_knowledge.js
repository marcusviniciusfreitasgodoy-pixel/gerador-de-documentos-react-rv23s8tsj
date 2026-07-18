// A12 — SEED NEUTRALIZADO (2026-07-18).
//
// Este arquivo continha um seed de 109 registros que, ANTES de inserir, fazia um
// delete-all na legal_knowledge:
//     const olds = app.findRecordsByFilter('legal_knowledge', "id != ''", '', 2000, 0)
//     for (const o of olds) app.delete(o)
// com `down` vazio — o rollback nao restaurava nada. Rodar de novo, ou copiar esse
// padrao para uma migration nova, apagaria toda a curadoria feita depois: os fixes
// 1900000020/1900000021 e as clausulas TRI003/TRI004 incluidas a mao.
//
// Agravante: 1900000000 e 1900000002 eram byte-a-byte IDENTICOS, entao numa
// instalacao limpa o wipe+reseed rodava DUAS vezes seguidas.
//
// A collection e criada por 0001_create_legal_knowledge.js (campos, indices e
// regras) — este arquivo nunca foi necessario para o schema. E os 109 registros
// daqui ja estavam DEFASADOS frente a base viva (92 registros curados).
//
// PARA REPOPULAR uma instalacao nova, use o export da base viva, nao este arquivo:
//   gerador-documentos-artefatos/knowledge/legal_knowledge_LIVE_2026-07-17.json
//
// Mantido como no-op em vez de apagado: a migration ja consta como aplicada, e
// remover o arquivo faria o PocketBase reclamar do historico.
migrate(
  (app) => {},
  (app) => {},
)
