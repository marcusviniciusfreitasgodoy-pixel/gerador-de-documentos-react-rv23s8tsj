// Imóveis do passe avulso: `users.avulso_imoveis` (pedido 1133, item C).
//
// O QUE É
//
// O passe avulso do Prime Circle vale para UM imóvel, por 30 dias. Quando a plataforma carimba o plano `avulso` desta
// conta, ela manda junto o imóvel de cada passe vigente (rua, número, cidade, fim exato do passe). Este campo guarda essa
// lista como texto JSON: `[{"ref":"...","logradouro":"Rua A","numero":"12","cidade":"Rio","ate":"2026-12-20T15:00:00.000Z"}]`.
//
// VAZIO = SEM RESTRIÇÃO DE ENDEREÇO. É o caso de todo avulso carimbado à mão pelo admin e de todo avulso que já existe:
// continuam exatamente como estão (limite de uma operação, validade do carimbo). A restrição só passa a valer quando a
// plataforma preenche o campo, e quem a aplica é o `avulso_imovel.js`.
//
// Campo do SERVIDOR: o `plano_carimbo.js` desfaz qualquer alteração vinda de quem não é admin, como faz com `plano`.
// Texto e não json: a guarda de update restaura campos pelo `getString`, e assim este entra na mesma lista dos outros.
migrate(
  (app) => {
    var col = app.findCollectionByNameOrId('users')
    if (!col.fields.getByName('avulso_imoveis')) {
      col.fields.add(new TextField({ name: 'avulso_imoveis', required: false, max: 8000 }))
      app.save(col)
    }
    app.logger().info('1900000040 users_add_avulso_imoveis applied')
  },
  (app) => {
    var col = app.findCollectionByNameOrId('users')
    var f = col.fields.getByName('avulso_imoveis')
    if (f) {
      col.fields.remove(f)
      app.save(col)
    }
  },
)
