migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('broker_profile')

    col.listRule = '@request.auth.id != "" && user = @request.auth.id'
    col.viewRule = '@request.auth.id != "" && user = @request.auth.id'
    col.createRule = '@request.auth.id != "" && user = @request.auth.id'
    col.updateRule = '@request.auth.id != "" && user = @request.auth.id'
    col.deleteRule = '@request.auth.id != "" && user = @request.auth.id'

    if (!col.fields.getByName('tipo_perfil')) {
      col.fields.add(
        new SelectField({
          name: 'tipo_perfil',
          values: ['corretor_autonomo', 'imobiliaria'],
          maxSelect: 1,
        }),
      )
    }
    if (!col.fields.getByName('nome')) {
      col.fields.add(new TextField({ name: 'nome' }))
    }
    if (!col.fields.getByName('cpf')) {
      col.fields.add(new TextField({ name: 'cpf' }))
    }
    if (!col.fields.getByName('razao_social')) {
      col.fields.add(new TextField({ name: 'razao_social' }))
    }
    if (!col.fields.getByName('nome_fantasia')) {
      col.fields.add(new TextField({ name: 'nome_fantasia' }))
    }
    if (!col.fields.getByName('cnpj')) {
      col.fields.add(new TextField({ name: 'cnpj' }))
    }
    if (!col.fields.getByName('creci_juridico')) {
      col.fields.add(new TextField({ name: 'creci_juridico' }))
    }
    if (!col.fields.getByName('responsavel_nome')) {
      col.fields.add(new TextField({ name: 'responsavel_nome' }))
    }
    if (!col.fields.getByName('responsavel_cpf')) {
      col.fields.add(new TextField({ name: 'responsavel_cpf' }))
    }
    if (!col.fields.getByName('responsavel_creci')) {
      col.fields.add(new TextField({ name: 'responsavel_creci' }))
    }
    if (!col.fields.getByName('creci_uf')) {
      col.fields.add(new TextField({ name: 'creci_uf' }))
    }
    if (!col.fields.getByName('pix')) {
      col.fields.add(new TextField({ name: 'pix' }))
    }
    if (!col.fields.getByName('telefone')) {
      col.fields.add(new TextField({ name: 'telefone' }))
    }
    if (!col.fields.getByName('endereco')) {
      col.fields.add(new TextField({ name: 'endereco' }))
    }
    if (!col.fields.getByName('cidade')) {
      col.fields.add(new TextField({ name: 'cidade' }))
    }
    if (!col.fields.getByName('uf')) {
      col.fields.add(new TextField({ name: 'uf' }))
    }

    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('broker_profile')

    const fieldsToRemove = [
      'tipo_perfil',
      'nome',
      'cpf',
      'razao_social',
      'nome_fantasia',
      'cnpj',
      'creci_juridico',
      'responsavel_nome',
      'responsavel_cpf',
      'responsavel_creci',
      'creci_uf',
      'pix',
      'telefone',
      'endereco',
      'cidade',
      'uf',
    ]
    for (const fname of fieldsToRemove) {
      const f = col.fields.getByName(fname)
      if (f) col.fields.remove(f)
    }

    col.listRule = 'user = @request.auth.id'
    col.viewRule = 'user = @request.auth.id'
    col.createRule = '@request.auth.id != ""'
    col.updateRule = 'user = @request.auth.id'
    col.deleteRule = 'user = @request.auth.id'

    app.save(col)
  },
)
