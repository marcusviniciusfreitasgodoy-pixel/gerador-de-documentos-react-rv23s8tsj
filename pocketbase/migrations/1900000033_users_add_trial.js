// Teste de 15 dias: campo `users.trial_expira_em`.
//
// **Vazio = sem limite.** É o que mantém as contas de hoje liberadas: elas
// nascem sem o campo e continuam sem prazo. A landing prometeu, na § 06, que
// "quando houver preço, você será avisado com antecedência", e ligar um prazo
// retroativo em quem já está dentro quebraria essa frase. Quem se cadastrar a
// partir daqui é carimbado pelo hook.
//
// **Preenchido = data em que o teste acaba.** Depois dela o corretor para de
// gerar documento e de validar minuta, mas continua entrando, vendo e
// exportando os próprios negócios. Prender dado de cliente atrás de bloqueio
// não é alavanca de venda, é problema de LGPD.
//
// O carimbo é do SERVIDOR (`pocketbase/hooks/trial_carimbo.js`). Se viesse do
// cliente, qualquer um se daria dez anos de teste editando o próprio registro:
// no PocketBase o usuário tem update do próprio `users`. Mesmo princípio do
// `agency` na fase 1 e do `termo_aceito_em` na fase 3.
//
// Estender é zerar ou empurrar a data pelo painel, e só admin consegue: o hook
// desfaz qualquer alteração vinda de quem não é admin.
migrate(
  (app) => {
    var col = app.findCollectionByNameOrId('users')

    if (!col.fields.getByName('trial_expira_em')) {
      col.fields.add(new DateField({ name: 'trial_expira_em', required: false }))
    }

    // Índice para o /admin conseguir listar quem está perto de vencer sem
    // varrer a tabela inteira.
    col.addIndex('idx_users_trial_expira_em', false, 'trial_expira_em', '')

    app.save(col)
    app.logger().info('1900000033 users_add_trial applied')
  },
  (app) => {
    var col = app.findCollectionByNameOrId('users')
    var f = col.fields.getByName('trial_expira_em')
    if (f) col.fields.remove(f)
    try {
      col.removeIndex('idx_users_trial_expira_em')
    } catch (_) {}
    app.save(col)
  },
)
