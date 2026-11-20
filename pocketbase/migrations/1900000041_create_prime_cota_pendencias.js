// Pendências da cota única com o Prime Circle: `prime_cota_pendencias` (pedido 1133, item A).
//
// A validação de minuta do Docs desconta 1 análise do plano do Prime Circle ANTES de chamar a IA e confirma ou estorna
// depois. Quando o Prime Circle não responde, o corretor não fica sem a validação (ver `validar_minuta.js`); o que não
// deu para falar com o Prime Circle fica aqui, para conferir depois:
//
// `acao`  confirmar     a validação foi entregue, o aviso de confirmação não chegou (repetido na próxima validação);
//         estornar      a IA falhou, o aviso de devolução não chegou (repetido na próxima validação);
//         sem_reserva   o Prime Circle não respondeu ao pedido de desconto e a validação saiu sem contar na cota única.
//                       Não se repete sozinho: o custo já foi entregue. Serve para o admin conciliar.
//
// Coleção SÓ de servidor: sem nenhuma regra de API (acesso só do superusuário e dos hooks). O corretor não lê nem escreve.
// Não guarda texto de minuta nem dado de cliente final: só o usuário, a chave da validação e o estado.
migrate(
  (app) => {
    var col = new Collection({
      name: 'prime_cota_pendencias',
      type: 'base',
      listRule: null,
      viewRule: null,
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'chave', type: 'text', required: true, max: 200 },
        {
          name: 'acao',
          type: 'select',
          required: true,
          maxSelect: 1,
          values: ['confirmar', 'estornar', 'sem_reserva'],
        },
        { name: 'tentativas', type: 'number', onlyInt: true },
        { name: 'resolvida', type: 'bool' },
        { name: 'detalhe', type: 'text', max: 500 },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_prime_cota_pend_user ON prime_cota_pendencias (user, resolvida)',
        'CREATE UNIQUE INDEX idx_prime_cota_pend_chave_acao ON prime_cota_pendencias (chave, acao)',
      ],
    })
    app.save(col)
    app.logger().info('1900000041 create_prime_cota_pendencias applied')
  },
  (app) => {
    var col = app.findCollectionByNameOrId('prime_cota_pendencias')
    app.delete(col)
  },
)
