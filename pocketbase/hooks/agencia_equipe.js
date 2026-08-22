// Resumo da equipe para o gestor da imobiliária (Fase 1, §5.2).
//
// Gate PRÓPRIO (não é o isAdmin do admin_overview): auth é users E tem
// broker_profile.tipo_perfil = 'imobiliaria'. O gestor NÃO é admin da
// plataforma. Admin recebe 403 aqui.
//
// Devolve os agregados que o front NÃO consegue ler direto:
//  - validações por corretor (validation_logs é owner-scoped; o gestor não é
//    dono dos logs dos membros, então precisa do $app para contar);
//  - CRECI/nome dos membros (broker_profile também é owner-scoped).
// Negócios da casa o front até leria direto (regra §3.1 permite), mas
// devolver junto evita ida e volta e mantém o ownerId puro (não expandido).
//
// Tudo via $app (privilégio total, bypassa regras) — devolve SÓ contagens e
// dados de exibição (nome, CRECI, desde, títulos), nunca documento/PII.
// Padrão de registro: routerAdd + $apis.requireAuth() + gate interno.
routerAdd(
  'GET',
  '/backend/v1/agencia/equipe',
  (e) => {
    var auth = e.auth
    if (!auth || auth.collection().name !== 'users') {
      return e.json(403, { error: 'Acesso restrito a imobiliárias.' })
    }
    // Admin da plataforma NÃO é gestor de imobiliária: 403.
    if (auth.getBool('isAdmin') === true) {
      return e.json(403, { error: 'Acesso restrito a imobiliárias.' })
    }

    // Gate: tem que ser uma conta-imobiliária.
    var isImobiliaria = false
    try {
      var profs = $app.findRecordsByFilter('broker_profile', 'user = {:u}', '', 1, 0, {
        u: auth.id,
      })
      if (profs && profs.length > 0) {
        isImobiliaria = profs[0].getString('tipo_perfil') === 'imobiliaria'
      }
    } catch (gateErr) {
      $app.logger().error('agencia_equipe: gate falhou', 'error', String(gateErr))
    }
    if (!isImobiliaria) {
      return e.json(403, { error: 'Acesso restrito a imobiliárias.' })
    }

    try {
      var DAY = 24 * 60 * 60 * 1000
      var iso = function (ms) {
        return new Date(ms).toISOString().replace('T', ' ')
      }
      var cutoff30 = iso(Date.now() - 30 * DAY)

      // Cache de perfis por user (busca sob demanda, preenche conforme aparece).
      var profileByUser = {}
      var getProfile = function (uid) {
        if (!uid) return null
        if (profileByUser[uid]) return profileByUser[uid]
        var p = null
        try {
          p = $app.findFirstRecordByData('broker_profile', 'user', uid)
        } catch (_) {
          p = null
        }
        profileByUser[uid] = p
        return p
      }

      // Membros ativos da casa.
      var members = []
      try {
        members = $app.findRecordsByFilter(
          'agency_members',
          "agency = {:a} && status = 'ativo'",
          'created',
          500,
          0,
          { a: auth.id },
        )
      } catch (_) {
        members = []
      }

      var outMembers = []
      var totalNegocios = 0
      var totalValidacoes = 0
      for (var mi = 0; mi < members.length; mi++) {
        var m = members[mi]
        var memberId = m.getString('member')
        var prof = getProfile(memberId)
        var nome = ''
        var creci = ''
        var creciUf = ''
        if (prof) {
          if (prof.getString('tipo_perfil') === 'imobiliaria') {
            nome =
              prof.getString('razao_social') ||
              prof.getString('nome_fantasia') ||
              prof.getString('name') ||
              ''
            creci = prof.getString('creci_juridico') || ''
          } else {
            nome = prof.getString('nome') || prof.getString('name') || ''
            creci = prof.getString('creci') || ''
          }
          creciUf = prof.getString('creci_uf') || ''
        }
        var desde = m.getString('termo_aceito_em') || m.getString('created')

        // Contagem de negócios da casa deste membro (owner = member, agency = auth).
        var negoCount = 0
        try {
          var negoRows = $app.findRecordsByFilter(
            'negocios',
            'owner = {:o} && agency = {:a}',
            '',
            1000,
            0,
            { o: memberId, a: auth.id },
          )
          negoCount = negoRows.length
        } catch (_) {}

        // Contagem de validações (30d) — owner-scoped, só $app vê.
        var valCount = 0
        try {
          var valRows = $app.findRecordsByFilter(
            'validation_logs',
            'user = {:u} && created >= {:c}',
            '',
            1000,
            0,
            { u: memberId, c: cutoff30 },
          )
          valCount = valRows.length
        } catch (_) {}

        totalNegocios += negoCount
        totalValidacoes += valCount
        outMembers.push({
          member_id: memberId,
          nome: nome,
          creci: creci,
          creci_uf: creciUf,
          desde: desde,
          negocios_count: negoCount,
          validacoes_30d: valCount,
        })
      }

      // Lista de negócios da casa (para o gestor abrir o detalhe já existente).
      var outNegocios = []
      try {
        var houseNg = $app.findRecordsByFilter('negocios', 'agency = {:a}', '-updated', 200, 0, {
          a: auth.id,
        })
        for (var ni = 0; ni < houseNg.length; ni++) {
          var ng = houseNg[ni]
          var ngOwner = ng.getString('owner')
          var ngProf = getProfile(ngOwner)
          var ownerName = ''
          if (ngProf) {
            ownerName =
              ngProf.getString('razao_social') ||
              ngProf.getString('nome_fantasia') ||
              ngProf.getString('nome') ||
              ngProf.getString('name') ||
              ''
          }
          outNegocios.push({
            id: ng.id,
            titulo: ng.getString('titulo'),
            owner: ngOwner,
            owner_name: ownerName,
            created: ng.getString('created'),
            updated: ng.getString('updated'),
          })
        }
      } catch (_) {}

      return e.json(200, {
        members: outMembers,
        negocios: outNegocios,
        totais: {
          negocios: totalNegocios,
          validacoes_30d: totalValidacoes,
          membros_ativos: members.length,
        },
      })
    } catch (err) {
      $app.logger().error('agencia_equipe: erro inesperado', 'error', String(err))
      return e.json(500, { error: 'Não foi possível montar o resumo da equipe.' })
    }
  },
  $apis.requireAuth(),
)
