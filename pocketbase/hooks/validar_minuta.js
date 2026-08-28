// Retenção LGPD (decisão do Marcus, 2026-07-23): validation_logs e validation_audit
// guardam o texto da minuta (dado pessoal). Registros com mais de 30 dias são
// apagados por inteiro. O purge roda em dois lugares de propósito: no cron diário
// das 03:00 (cobre períodos sem uso) e a cada chamada do validador (abaixo).
// O código é duplicado porque handlers do JSVM do PocketBase são isolados:
// não dá para compartilhar função entre cron e rota.
try {
  cronAdd('lgpd_retencao_validacao', '0 3 * * *', () => {
    var cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ')
    var cols = ['validation_logs', 'validation_audit']
    for (var c = 0; c < cols.length; c++) {
      try {
        for (var rodada = 0; rodada < 20; rodada++) {
          var velhos = $app.findRecordsByFilter(cols[c], 'created < {:cutoff}', '', 200, 0, {
            cutoff: cutoff,
          })
          if (!velhos.length) break
          for (var i = 0; i < velhos.length; i++) $app.delete(velhos[i])
        }
      } catch (err) {
        $app.logger().error('lgpd_retencao: purge falhou', 'col', cols[c], 'error', String(err))
      }
    }
  })
} catch (cronErr) {
  $app.logger().error('lgpd_retencao: cronAdd indisponivel', 'error', String(cronErr))
}

routerAdd(
  'POST',
  '/backend/v1/validar-minuta',
  (e) => {
    // Retenção LGPD: mesmo purge do cron, disparado a cada uso. Fica ANTES da
    // guarda do 'approved' de propósito: é limpeza interna (nada é devolvido ao
    // usuário), e assim qualquer chamada autenticada mantém a retenção em dia.
    try {
      var lgpdCutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .replace('T', ' ')
      var lgpdCols = ['validation_logs', 'validation_audit']
      for (var lgpdC = 0; lgpdC < lgpdCols.length; lgpdC++) {
        for (var lgpdRodada = 0; lgpdRodada < 10; lgpdRodada++) {
          var lgpdVelhos = $app.findRecordsByFilter(
            lgpdCols[lgpdC],
            'created < {:cutoff}',
            '',
            200,
            0,
            { cutoff: lgpdCutoff },
          )
          if (!lgpdVelhos.length) break
          for (var lgpdI = 0; lgpdI < lgpdVelhos.length; lgpdI++) $app.delete(lgpdVelhos[lgpdI])
        }
      }
    } catch (lgpdErr) {
      $app.logger().error('lgpd_retencao (inline): purge falhou', 'error', String(lgpdErr))
    }

    // Guarda server-side do 'approved': o gate do frontend nao segura chamada
    // direta com o token de um usuario nao liberado. Admin dispensa, como no front.
    var guardAuth = e.auth
    if (
      guardAuth &&
      guardAuth.collection().name === 'users' &&
      !guardAuth.getBool('verified') &&
      !guardAuth.getBool('isAdmin')
    ) {
      return e.json(403, { error: 'Confirme seu e-mail para liberar o acesso.' })
    }

    // Teste de 15 dias. Campo VAZIO = sem limite: é o que mantém liberadas as
    // contas anteriores à mudança, conforme a promessa de aviso prévio da § 06
    // da landing. Admin nunca expira. O 402 distingue "teste vencido" de "não
    // confirmou o e-mail", que é 403, para a tela saber qual mensagem mostrar.
    if (guardAuth && guardAuth.collection().name === 'users' && !guardAuth.getBool('isAdmin')) {
      // Assinante ativo passa direto. O `trial_expira_em` continua no banco e
      // continua vencendo, mas deixou de significar alguma coisa para quem
      // paga: checar só o teste barraria o assinante no dia seguinte ao
      // pagamento, e do lado do SERVIDOR, onde a falha é muda e chega ao
      // corretor como "erro ao validar".
      var planoStr = String(guardAuth.getString('plano') || '').trim()
      var renovaStr = String(guardAuth.getString('plano_renova_em') || '').trim()
      var renovaMs = renovaStr ? new Date(renovaStr.replace(' ', 'T')).getTime() : 0
      var planoAtivo = !!planoStr && !!renovaMs && renovaMs > Date.now()

      // Assinatura vencida barra SOZINHA, sem depender do prazo do teste. O
      // furo que isto fecha: a checagem abaixo só barra quem tem
      // `trial_expira_em` preenchido E vencido, e as contas anteriores ao teste
      // de 15 dias têm esse campo VAZIO de propósito (migração 1900000033). Uma
      // dessas contas assinava, o mês vencia, e seguia com acesso total, aqui no
      // servidor inclusive.
      //
      // Exige a data presente e no passado: plano carimbado sem data de
      // renovação é erro de cadastro do admin, e trancar quem paga por erro
      // nosso é pior do que deixar passar um dia a mais.
      if (!planoAtivo && planoStr && renovaMs && renovaMs < Date.now()) {
        return e.json(402, {
          error: 'Sua assinatura venceu. Renove pela página Planos para voltar a usar.',
        })
      }

      // O avulso inclui UMA validação de minuta, e esta é a única trava dele.
      // A operação não trava (o documento sai no navegador antes de o negócio
      // existir, e quem passa do teto pagou a mais, não a menos); a validação
      // trava porque é a única parte com custo real, que é a chamada de IA.
      //
      // O contador é o `avulso_validacoes`, e não o mensal: o avulso dura 30
      // dias e atravessa a virada de mês, onde o contador mensal zeraria e daria
      // uma segunda validação de graça.
      if (
        planoAtivo &&
        planoStr === 'avulso' &&
        (guardAuth.getInt('avulso_validacoes') || 0) >= 1
      ) {
        return e.json(402, {
          error:
            'Seu avulso inclui uma validação de minuta, e ela já foi usada. Veja os planos para validar mais.',
        })
      }

      if (!planoAtivo) {
        var trialStr = String(guardAuth.getString('trial_expira_em') || '').trim()
        if (trialStr) {
          var trialMs = new Date(trialStr.replace(' ', 'T')).getTime()
          if (trialMs && trialMs < Date.now()) {
            return e.json(402, {
              error: 'Seu período de teste terminou. Fale com a gente pela página Ajuda e Suporte.',
            })
          }
        }
      }
    }

    var userId = e.auth ? e.auth.id : ''

    // ── Rate Limiting via coleção `rate_limits` (janela fixa de 60s) ──────
    // Fail-open: qualquer erro na coleção é logado e a requisição passa —
    // nunca bloqueia um usuário legítimo por falha de infra de rate limit.
    if (userId) {
      try {
        var rlNowSec = Math.floor(Date.now() / 1000)
        var rlWindowStart = Math.floor(rlNowSec / 60) * 60
        var rlLimit = 30
        var rlEndpoint = 'validar_minuta'

        // Limpeza: remove registros com window_start mais antigo que 2 min.
        try {
          var rlCutoff = rlWindowStart - 120
          var rlStale = $app.findRecordsByFilter(
            'rate_limits',
            'window_start < {:cutoff}',
            '',
            200,
            0,
            { cutoff: rlCutoff },
          )
          for (var rlPurgeI = 0; rlPurgeI < rlStale.length; rlPurgeI++) {
            try {
              $app.delete(rlStale[rlPurgeI])
            } catch (_) {}
          }
        } catch (rlCleanErr) {
          $app.logger().error('rate_limits: limpeza falhou', 'error', String(rlCleanErr))
        }

        var rlExisting = []
        try {
          rlExisting = $app.findRecordsByFilter(
            'rate_limits',
            'user = {:uid} && endpoint = {:ep} && window_start = {:ws}',
            '',
            1,
            0,
            { uid: userId, ep: rlEndpoint, ws: rlWindowStart },
          )
        } catch (rlFindErr) {
          $app.logger().error('rate_limits: busca falhou', 'error', String(rlFindErr))
        }

        if (rlExisting && rlExisting.length > 0) {
          var rlRec = rlExisting[0]
          var rlCount = (rlRec.getInt('count') || 0) + 1
          rlRec.set('count', rlCount)
          $app.saveNoValidate(rlRec)
          if (rlCount > rlLimit) {
            var rlWaitSec = Math.max(1, rlWindowStart + 60 - rlNowSec)
            return e.json(429, { error: 'Muitas requisições. Aguarde ' + rlWaitSec + ' segundos.' })
          }
        } else {
          var rlCol = $app.findCollectionByNameOrId('rate_limits')
          var rlNewRec = new Record(rlCol)
          rlNewRec.set('user', userId)
          rlNewRec.set('endpoint', rlEndpoint)
          rlNewRec.set('window_start', rlWindowStart)
          rlNewRec.set('count', 1)
          $app.saveNoValidate(rlNewRec)
        }
      } catch (rlErr) {
        $app.logger().error('rate_limits: erro (fail-open)', 'error', String(rlErr))
      }
    }

    var body = e.requestInfo().body || {}
    var documentText = (body.document_text || '').trim()
    var documentType = (body.document_type || 'Genérico').trim()

    if (!documentText) {
      return e.badRequestError('O texto do documento é obrigatório.')
    }

    function createAuditLog(status, parsedResult, rawResponse, errorMessage, errorCode) {
      // LGPD (decisão do Marcus, 2026-07-24): NÃO gravar document_text NUNCA —
      // nem no sucesso, nem na falha. O texto da minuta é dado pessoal
      // (nome, CPF, RG, endereço das partes) e mesmo redigido deixava resíduo.
      // No sucesso, o parsed_result (JSON estruturado) basta para auditoria.
      // Na falha, ficam só error_code, error_message, parsed_result (se houver
      // algo parcial) e o raw_ai_response (saída da IA, não o documento do
      // usuário). Zera o resíduo de PII nos logs de validação.
      try {
        var logCol = $app.findCollectionByNameOrId('validation_logs')
        var logRecord = new Record(logCol)
        if (userId) {
          logRecord.set('user', userId)
        }
        logRecord.set('document_type', documentType)
        logRecord.set('status', status)
        if (parsedResult) {
          logRecord.set('parsed_result', JSON.stringify(parsedResult))
        }
        if (rawResponse) {
          logRecord.set('raw_ai_response', rawResponse.substring(0, 10000))
        }
        if (errorMessage) {
          logRecord.set('error_message', errorMessage)
        }
        if (errorCode) {
          logRecord.set('error_code', errorCode)
        }
        $app.saveNoValidate(logRecord)
      } catch (logErr) {
        $app.logger().error('validar_minuta: validation_logs audit failed', 'error', String(logErr))
      }

      if (userId) {
        try {
          var auditCol = $app.findCollectionByNameOrId('validation_audit')
          var auditRecord = new Record(auditCol)
          auditRecord.set('user_id', userId)
          auditRecord.set('document_type', documentType)
          auditRecord.set('status', status)
          if (rawResponse) {
            auditRecord.set('ai_raw_response', rawResponse.substring(0, 10000))
          }
          if (parsedResult) {
            auditRecord.set('parsed_result', parsedResult)
          }
          if (errorMessage) {
            auditRecord.set('error_message', errorMessage)
          }
          if (errorCode) {
            auditRecord.set('error_code', errorCode)
          }
          $app.saveNoValidate(auditRecord)
        } catch (auditErr) {
          $app
            .logger()
            .error('validar_minuta: validation_audit log failed', 'error', String(auditErr))
        }
      }
    }

    // ── Resolução de agencyId (Fase 2, §3) ──────────────────────────────
    var userAgencyId = ''
    if (userId) {
      try {
        var userMemberships = $app.findRecordsByFilter(
          'agency_members',
          "member = {:m} && status = 'ativo' && termo_aceito_em != ''",
          '-created',
          1,
          0,
          { m: userId },
        )
        if (userMemberships && userMemberships.length > 0) {
          userAgencyId = userMemberships[0].getString('agency') || ''
        }
      } catch (agencyErr) {
        $app
          .logger()
          .error('validar_minuta: erro ao resolver agency do usuario', 'error', String(agencyErr))
      }
    }

    // Carregamento com escopo de agência (4 pontos) + mesclagem por code (casa vence global)
    var rawKnowledgeRecords = []
    try {
      if (documentType && documentType !== 'Genérico') {
        try {
          if (userAgencyId) {
            rawKnowledgeRecords = $app.findRecordsByFilter(
              'legal_knowledge',
              "(agency = '' || agency = {:agencyId}) && (trigger_logic ~ {:dt} || trigger_logic = {:todos})",
              '-priority',
              100,
              0,
              { agencyId: userAgencyId, dt: documentType, todos: 'todos' },
            )
          } else {
            rawKnowledgeRecords = $app.findRecordsByFilter(
              'legal_knowledge',
              "agency = '' && (trigger_logic ~ {:dt} || trigger_logic = {:todos})",
              '-priority',
              100,
              0,
              { dt: documentType, todos: 'todos' },
            )
          }
        } catch (filterErr) {
          rawKnowledgeRecords = []
        }
      }

      // Fallback: se o filtro não retornar nada ou documentType for genérico
      if (!rawKnowledgeRecords || rawKnowledgeRecords.length === 0) {
        if (userAgencyId) {
          rawKnowledgeRecords = $app.findRecordsByFilter(
            'legal_knowledge',
            "(agency = '' || agency = {:agencyId})",
            '-priority',
            100,
            0,
            { agencyId: userAgencyId },
          )
        } else {
          rawKnowledgeRecords = $app.findRecordsByFilter(
            'legal_knowledge',
            "agency = ''",
            '-priority',
            100,
            0,
          )
        }
      }
    } catch (err) {
      $app.logger().error('validar_minuta: knowledge base load failed', 'error', String(err))
      createAuditLog('fail', null, '', 'Base de conhecimento indisponível', 'KNOWLEDGE_BASE_ERROR')
      return e.json(500, {
        error: 'Base de conhecimento indisponível.',
        code: 'KNOWLEDGE_BASE_ERROR',
      })
    }

    // Mesclagem por code (regra da imobiliária vence a global de mesmo code)
    // e ordenação por priority decrescente
    var rulesByCode = {}
    for (var k = 0; k < rawKnowledgeRecords.length; k++) {
      var kRec = rawKnowledgeRecords[k]
      var kCode = kRec.getString('code') || 'SEM_CODE_' + kRec.id
      var kAgency = kRec.getString('agency') || ''

      // Se ainda não temos essa regra OU se a atual é da imobiliária (kAgency === userAgencyId),
      // a regra da imobiliária substitui a global
      if (!rulesByCode[kCode]) {
        rulesByCode[kCode] = kRec
      } else {
        var existingAgency = rulesByCode[kCode].getString('agency') || ''
        if (userAgencyId && kAgency === userAgencyId && !existingAgency) {
          rulesByCode[kCode] = kRec
        }
      }
    }

    var mergedRecords = []
    var codeKeys = Object.keys(rulesByCode)
    for (var ck = 0; ck < codeKeys.length; ck++) {
      mergedRecords.push(rulesByCode[codeKeys[ck]])
    }

    mergedRecords.sort(function (a, b) {
      var pA = a.getInt('priority') || 0
      var pB = b.getInt('priority') || 0
      return pB - pA
    })

    // Teto de 50 registros
    var knowledgeRecords = mergedRecords.slice(0, 50)

    var baseLines = []
    for (var i = 0; i < knowledgeRecords.length; i++) {
      var rec = knowledgeRecords[i]
      var code = rec.getString('code') || 'SEM_CODE'
      var title = rec.getString('title') || ''
      var category = rec.getString('category') || ''
      var triggerLogic = rec.getString('trigger_logic') || ''
      var content = rec.getString('content') || ''
      if (!content.trim()) continue
      if (content.length > 700) {
        content = content.substring(0, 700)
      }
      baseLines.push(
        '[' + code + '] ' + title + ' (' + category + ' | ' + triggerLogic + '): ' + content,
      )
    }

    var baseStr = baseLines.join('\n')
    if (baseStr.length > 50000) {
      baseStr = baseStr.substring(0, 50000)
    }

    var systemPrompt =
      'Você é um revisor jurídico especializado em contratos e documentos imobiliários no Brasil, a serviço de um corretor/imobiliária. Sua função é ANALISAR e APONTAR — você NUNCA redige, reescreve ou inventa texto de cláusula, e NUNCA cria norma jurídica. A única autoridade é a BASE DE CONHECIMENTO (regras e cláusulas aprovadas da empresa) fornecida na mensagem. Você verifica a MINUTA contra essa base e ancora cada observação no código (code) da regra correspondente.\n\nVocê recebe:\n- TIPO_DOCUMENTO: o tipo declarado da minuta (pode ser "Genérico").\n- BASE: lista de regras/cláusulas aprovadas, cada linha no formato "[code] título (category | trigger_logic): trecho do conteúdo".\n- MINUTA: o texto integral do documento a validar.\n\nResponda SOMENTE com um objeto JSON válido. NÃO inclua nenhum texto explicativo, saudação, ou formatação Markdown antes ou depois do JSON. NÃO envolva o JSON em blocos de código Markdown (```json). Sua resposta inteira deve ser analisável por JSON.parse() sem nenhum texto ao redor.\n\nO formato exato do objeto JSON é:\n{"status":"green|yellow|red","resumo":"2 a 4 frases com a visão geral da qualidade da minuta e os principais pontos de atenção","conformidade":[{"code":"CODIGO_DA_BASE","titulo":"título da regra","status":"presente|faltando|fraco","descricao":"objetivo, específico à minuta"}],"riscos":[{"gravidade":"alto|medio|baixo","descricao":"o risco concreto para as partes","base_code":"CODIGO_DA_BASE"}],"recomendacoes":[{"texto":"o que adicionar ou ajustar (aponte a regra/modelo, NÃO escreva o texto da cláusula)","base_code":"CODIGO_DA_BASE"}]}\n\nEach \'code\' must appear at most once in the \'conformidade\' array.\n\nRegras de conduta:\n- Ancore CADA item numa regra da BASE (campo code/base_code). Se um ponto não tiver respaldo na BASE, NÃO o inclua — não invente.\n- Cada code deve aparecer no máximo uma vez em conformidade.\n- "status": use "green" se a minuta está em conformidade geral, "yellow" se há pontos fracos ou faltando mas sem riscos altos, "red" se há riscos altos ou cláusulas essenciais faltando.\n- "conformidade": para cada cláusula/regra ESSENCIAL ao TIPO_DOCUMENTO presente na BASE, classifique como "presente", "faltando" ou "fraco" (existe mas está incompleta, ambígua ou arriscada), com descricao objetiva referindo-se à minuta.\n- DETECÇÃO POR CONTEÚDO: uma cláusula pode estar EMBUTIDA em outra (ex.: a mediação costuma vir no fim da cláusula de foro; a outorga pode vir junto da finalização). Identifique pelo CONTEÚDO/tema, não pelo título. Se o tema aparece no texto, é "presente" (ou "fraco"); NUNCA "faltando".\n- CONDICIONAIS/ALTERNATIVAS: o trigger_logic pode indicar condição (ex.: {"path":"compliance.arbitragem","value":true}). Regras condicionais ou opcionais NÃO são "faltando" quando a minuta adota validamente a via alternativa. Foro judicial + mediação e arbitragem são VIAS EXCLUDENTES: se a minuta elege foro + mediação, a ausência de arbitragem NÃO é falha.\n- ARRAS (PENITENCIAIS vs CONFIRMATÓRIAS): são VIAS EXCLUDENTES, como foro/mediação vs arbitragem. Arras penitenciais (art. 420 CC) dão às partes o DIREITO DE ARREPENDIMENTO — quem deu o sinal o perde; quem o recebeu devolve mais o equivalente; e não cabe indenização suplementar. Logo, uma minuta que adota arras penitenciais NÃO PODE ser irrevogável/irretratável: a ausência de FIX004 nela é COERENTE com a escolha das partes e NÃO é falha — não marcar como "faltando" nem como risco. Cobre FIX004 apenas quando a minuta adota arras CONFIRMATÓRIAS (arts. 417-419) ou quando não define a natureza das arras. ATENÇÃO à forma QUALIFICADA, que é válida e frequente: "firmado em caráter irrevogável e irretratável, sendo possível a resilição na forma dos arts. 418 e 420 do Código Civil" — nesse caso FIX004 está PRESENTE (a irrevogabilidade existe, apenas ressalvada pela via das arras), não é contradição nem falha.\n- DISTRATO (Lei 13.786/2018, códigos LEI-DISTRATO): só se aplica a AQUISIÇÃO DE IMÓVEL NA PLANTA / de incorporadora ou loteadora. Em REVENDA ENTRE PARTICULARES (pessoas físicas, imóvel já registrado, sem incorporador/construtora como vendedor), as normas de distrato NÃO se aplicam — NÃO cobrar, NÃO marcar como faltando nem como risco. A rescisão dessas minutas rege-se pelas cláusulas de inadimplemento/arras e pela lei civil comum.\n- PROPOSTA / RESERVA (quando TIPO_DOCUMENTO contém "Proposta" ou "Reserva"): é documento PRÉ-CONTRATUAL de OFERTA, não o contrato definitivo. A régua é a ESSÊNCIA DA OFERTA — exija apenas: objeto/imóvel, preço proposto, sinal e sua natureza de arras, prazo de validade e irretratabilidade da proposta (art. 427 CC), devolução do sinal em caso de recusa, condição de aceite do proprietário, LGPD (LGP001), foro e intermediação/comissão (COM001). NÃO cobrar — nem marcar como "faltando" nem como risco — cláusulas próprias do CONTRATO DEFINITIVO que só passam a existir APÓS o aceite: evicção (FIX005 e GAR001), irrevogabilidade/irretratabilidade DO CONTRATO (FIX004), rescisão por justa causa (RES001), inadimplência/juros de mora (INA001) e demais garantias de compra e venda. Essas pertencem à promessa/escritura que se firmará se a proposta for aceita; sua ausência na proposta é CORRETA, não é falha.\n- DOCUMENTOS FACTUAIS / AUXILIARES (quando TIPO_DOCUMENTO for "Recibo de Sinal (Arras)", "Autorização de Intermediação", "Termo de Entrega das Chaves", "Termo de Transmissão da Posse" ou "Genérico/Outro"): NÃO são o contrato de compra e venda — a régua é a ESSÊNCIA DO PRÓPRIO DOCUMENTO, não a da promessa/escritura. Exija apenas o que é próprio de cada um: qualificação das partes, identificação do imóvel e a cláusula-núcleo do tipo — no Recibo, o sinal e sua NATUREZA DE ARRAS (confirmatória/penitencial, arts. 417-420 CC) e a imputação ao preço; na Autorização de Intermediação, a exclusividade/gestão, o prazo de vigência e a comissão (COM001, Lei 6.530); no Termo de Entrega das Chaves, a identificação do imóvel e a data/condição da entrega; no Termo de Transmissão da Posse, a tradição/imissão na posse e a data. NÃO cobrar — nem marcar como "faltando" nem como risco — cláusulas do CONTRATO DEFINITIVO de compra e venda que NÃO pertencem a esses documentos: evicção (FIX005 e GAR001), irrevogabilidade/irretratabilidade do contrato (FIX004), rescisão por justa causa (RES001), inadimplência/juros de mora (INA001), obtenção de financiamento (FIN*) e demais garantias da promessa/escritura. No Termo de Entrega das Chaves, por ser MERO COMPROVANTE de entrega física do imóvel, NÃO cobrar foro (FIX008) nem LGPD (LGP001) — nem como faltando nem como risco; a régua dele é só imóvel, partes e a data/condição da entrega. Se o TIPO for "Genérico/Outro" e o texto for uma LISTA DE CONFERÊNCIA/checklist (não um contrato), valide apenas que imóvel e responsável estão identificados e retorne status green se coerente, sem cobrar cláusulas contratuais.\n- "faltando" APENAS quando o tema está TOTALMENTE ausente; se está referenciado mas incompleto ou implícito, use "fraco".\n- "riscos": aponte o que expõe as partes (ex.: ausência de anuência conjugal quando cabível, arras sem natureza definida, falta de foro, ausência de PLD-FT/LGPD, evicção não tratada, prazo/rescisão omissos), com a gravidade.\n- "recomendacoes": diga o que fazer, citando SEMPRE o code do modelo/regra na base — jamais escreva o texto da cláusula.\n- Seja específico à MINUTA (pode citar trechos curtos entre aspas). Não copie a base literalmente.\n- Não use conhecimento externo à BASE para afirmar obrigações; a BASE é a régua.\n- Português do Brasil. Se a MINUTA estiver vazia ou ilegível, retorne resumo explicando e listas vazias.'

    var userMessage =
      'TIPO_DOCUMENTO: ' + documentType + '\n\nBASE:\n' + baseStr + '\n\nMINUTA:\n' + documentText

    // ── JSON sanitization helpers ──────────────────────────────────────

    function sanitizeJsonString(str) {
      var s = String(str || '')
        .replace(/^\uFEFF/, '')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
      s = s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      return s
    }

    function stripMarkdownFences(str) {
      var mdMatch = str.match(/```(?:json)?\s*([\s\S]*?)```/i)
      if (mdMatch) return mdMatch[1].trim()
      var unclosedMatch = str.match(/```(?:json)?\s*([\s\S]+)/i)
      if (unclosedMatch) {
        var content = unclosedMatch[1]
        var braceIdx = content.indexOf('{')
        if (braceIdx !== -1 && braceIdx < 5) {
          return content.trim()
        }
      }
      return str
    }

    function extractJsonObject(str) {
      var start = str.indexOf('{')
      if (start === -1) return null
      var depth = 0
      var inString = false
      var escape = false
      for (var i = start; i < str.length; i++) {
        var ch = str.charAt(i)
        if (escape) {
          escape = false
          continue
        }
        if (ch === '\\' && inString) {
          escape = true
          continue
        }
        if (ch === '"') {
          inString = !inString
          continue
        }
        if (inString) continue
        if (ch === '{') depth++
        else if (ch === '}') {
          depth--
          if (depth === 0) {
            return str.substring(start, i + 1)
          }
        }
      }
      return str.substring(start)
    }

    function fixTrailingCommas(str) {
      return str.replace(/,(\s*[}\]])/g, '$1')
    }

    function fixUnquotedKeys(str) {
      return str.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g, '$1"$2"$3')
    }

    function repairJsonString(str) {
      var result = []
      var inString = false
      var escape = false
      for (var i = 0; i < str.length; i++) {
        var ch = str.charAt(i)
        if (escape) {
          result.push(ch)
          escape = false
          continue
        }
        if (ch === '\\' && inString) {
          result.push(ch)
          escape = true
          continue
        }
        if (ch === '"') {
          inString = !inString
          result.push(ch)
          continue
        }
        if (inString) {
          if (ch === '\n') {
            result.push('\\n')
            continue
          }
          if (ch === '\r') {
            result.push('\\r')
            continue
          }
          if (ch === '\t') {
            result.push('\\t')
            continue
          }
          if (ch.charCodeAt(0) < 32) {
            result.push('\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4))
            continue
          }
          result.push(ch)
          continue
        }
        if (ch === '/' && i + 1 < str.length) {
          var nc = str.charAt(i + 1)
          if (nc === '/') {
            while (i < str.length && str.charAt(i) !== '\n') i++
            continue
          }
          if (nc === '*') {
            i += 2
            while (i < str.length - 1 && !(str.charAt(i) === '*' && str.charAt(i + 1) === '/')) i++
            i++
            continue
          }
        }
        result.push(ch)
      }
      return result.join('')
    }

    function attemptParse(str) {
      try {
        return JSON.parse(str)
      } catch (e1) {
        try {
          return JSON.parse(fixTrailingCommas(str))
        } catch (e2) {
          try {
            return JSON.parse(fixTrailingCommas(fixUnquotedKeys(str)))
          } catch (e3) {
            try {
              return JSON.parse(fixTrailingCommas(repairJsonString(str)))
            } catch (e4) {
              try {
                return JSON.parse(fixTrailingCommas(fixUnquotedKeys(repairJsonString(str))))
              } catch (e5) {
                return null
              }
            }
          }
        }
      }
    }

    function parseAiResponse(rawContent) {
      var cleaned = sanitizeJsonString(rawContent)
      cleaned = stripMarkdownFences(cleaned)

      var parsed = attemptParse(cleaned)

      if (!parsed) {
        var extracted = extractJsonObject(cleaned)
        if (extracted) {
          parsed = attemptParse(sanitizeJsonString(extracted))
        }
      }

      if (!parsed) {
        var rawExtracted = extractJsonObject(sanitizeJsonString(rawContent))
        if (rawExtracted) {
          parsed = attemptParse(sanitizeJsonString(rawExtracted))
        }
      }

      if (!parsed) {
        var rawRepaired = repairJsonString(sanitizeJsonString(stripMarkdownFences(rawContent)))
        var repairedExtracted = extractJsonObject(rawRepaired)
        if (repairedExtracted) {
          parsed = attemptParse(repairedExtracted)
        } else {
          parsed = attemptParse(rawRepaired)
        }
      }

      return parsed
    }

    // ── Integrated retry loop: AI call + JSON parsing ──────────────────

    var MAX_ATTEMPTS = 3
    var parsed = null
    var rawContent = ''
    var lastFailureStatus = 500
    var lastFailureBody = {
      error: 'Erro inesperado ao processar a análise.',
      code: 'UNEXPECTED_ERROR',
    }
    var lastFailureErrorMessage = 'Erro inesperado'
    var lastFailureErrorCode = 'UNEXPECTED_ERROR'
    var lastFailureRawResponse = ''
    var success = false

    for (var attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      var aiResult = null
      try {
        $app.logger().info('validar_minuta: AI attempt ' + attempt + '/' + MAX_ATTEMPTS)
        aiResult = $ai.chat({
          model: 'fast',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
        })

        if (!aiResult || !aiResult.choices || !aiResult.choices[0]) {
          lastFailureStatus = 500
          lastFailureBody = {
            error: 'Erro de Processamento de Dados',
            detail: 'Resposta da IA em formato inesperado.',
            code: 'DATA_PROCESSING_ERROR',
          }
          lastFailureErrorMessage = 'Resposta da IA em formato inesperado'
          lastFailureErrorCode = 'DATA_PROCESSING_ERROR'
          lastFailureRawResponse = ''
          $app
            .logger()
            .error(
              'validar_minuta: AI attempt ' + attempt + ' returned malformed response',
              'error',
              'Missing aiResult.choices[0]',
            )
          continue
        }

        rawContent = aiResult.choices[0].message.content || ''

        if (!rawContent.trim()) {
          lastFailureStatus = 500
          lastFailureBody = {
            error: 'A IA retornou uma resposta vazia. Tente novamente.',
            detail: 'Empty AI response',
            code: 'DATA_PROCESSING_ERROR',
          }
          lastFailureErrorMessage = 'Resposta da IA vazia'
          lastFailureErrorCode = 'DATA_PROCESSING_ERROR'
          lastFailureRawResponse = rawContent
          $app.logger().error('validar_minuta: AI attempt ' + attempt + ' returned empty content')
          continue
        }

        $app
          .logger()
          .info(
            'validar_minuta: AI attempt ' +
              attempt +
              ' received content, length: ' +
              rawContent.length +
              ', attempting parse',
          )

        var parseResult = parseAiResponse(rawContent)

        if (!parseResult) {
          lastFailureStatus = 500
          lastFailureBody = {
            error:
              'Ocorreu um erro ao processar a resposta da análise. Por favor, tente gerar a validação novamente.',
            detail: 'JSON parsing failed after exhaustive sanitization',
            code: 'DATA_PROCESSING_ERROR',
          }
          lastFailureErrorMessage = 'JSON parsing failed'
          lastFailureErrorCode = 'DATA_PROCESSING_ERROR'
          lastFailureRawResponse = rawContent
          $app
            .logger()
            .error(
              'validar_minuta: AI attempt ' + attempt + ' JSON parse failed',
              'error',
              'All parse strategies exhausted',
              'rawContentPreview',
              rawContent.substring(0, 500),
            )
          continue
        }

        parsed = parseResult
        success = true
        $app
          .logger()
          .info('validar_minuta: AI attempt ' + attempt + ' succeeded, content parsed successfully')
        break
      } catch (err) {
        $app
          .logger()
          .error('validar_minuta: AI attempt ' + attempt + ' failed', 'error', String(err))

        if (err instanceof SkipAiConfigError) {
          createAuditLog('fail', null, '', 'Serviço de IA indisponível', 'AI_CONFIG_ERROR')
          return e.json(503, {
            error: 'Serviço de IA temporariamente indisponível.',
            code: 'AI_CONFIG_ERROR',
          })
        }

        if (err instanceof SkipAiError) {
          lastFailureStatus = 502
          lastFailureBody = {
            error: 'Falha na comunicação com o serviço de IA. Tente novamente.',
            code: 'AI_SERVICE_ERROR',
          }
          lastFailureErrorMessage = 'Falha na comunicação com IA'
          lastFailureErrorCode = 'AI_SERVICE_ERROR'
          lastFailureRawResponse = ''
          continue
        }

        lastFailureStatus = 500
        lastFailureBody = {
          error: 'Erro inesperado ao processar a análise.',
          code: 'UNEXPECTED_ERROR',
        }
        lastFailureErrorMessage = 'Erro inesperado: ' + String(err)
        lastFailureErrorCode = 'UNEXPECTED_ERROR'
        lastFailureRawResponse = ''
        continue
      }
    }

    if (!success) {
      createAuditLog(
        'fail',
        null,
        lastFailureRawResponse,
        lastFailureErrorMessage,
        lastFailureErrorCode,
      )
      return e.json(lastFailureStatus, lastFailureBody)
    }

    // ── Normalize & validate the parsed result ─────────────────────────

    if (!parsed || typeof parsed !== 'object') parsed = {}
    if (typeof parsed.resumo !== 'string') parsed.resumo = ''
    if (!Array.isArray(parsed.conformidade)) parsed.conformidade = []
    if (!Array.isArray(parsed.riscos)) parsed.riscos = []
    if (!Array.isArray(parsed.recomendacoes)) parsed.recomendacoes = []

    if (parsed.status !== 'green' && parsed.status !== 'yellow' && parsed.status !== 'red') {
      var hasHighRisk = false
      for (var ri = 0; ri < parsed.riscos.length; ri++) {
        if (parsed.riscos[ri] && parsed.riscos[ri].gravidade === 'alto') {
          hasHighRisk = true
          break
        }
      }
      parsed.status = hasHighRisk ? 'red' : parsed.conformidade.length > 0 ? 'yellow' : 'green'
    }

    var seenCodes = {}
    var dedupedConformidade = []
    for (var ci = 0; ci < parsed.conformidade.length; ci++) {
      var c = parsed.conformidade[ci]
      if (!c || typeof c !== 'object') continue
      var cKey = (c.code || '') !== '' ? c.code : 'idx_' + ci
      if (!seenCodes[cKey]) {
        seenCodes[cKey] = true
        dedupedConformidade.push(c)
      }
    }
    parsed.conformidade = dedupedConformidade

    createAuditLog('success', parsed, rawContent, '', '')

    return e.json(200, parsed)
  },
  $apis.requireAuth(),
)

// ROTA N1 — Consultar IA (Especialista Nível 1)
routerAdd(
  'POST',
  '/backend/v1/consultar-ia',
  (e) => {
    // Guarda server-side do 'approved' (mesma regua das outras rotas de IA).
    var guardAuth = e.auth
    if (
      guardAuth &&
      guardAuth.collection().name === 'users' &&
      !guardAuth.getBool('verified') &&
      !guardAuth.getBool('isAdmin')
    ) {
      return e.json(403, { error: 'Confirme seu e-mail para liberar o acesso.' })
    }

    // Teste de 15 dias. Campo VAZIO = sem limite: é o que mantém liberadas as
    // contas anteriores à mudança, conforme a promessa de aviso prévio da § 06
    // da landing. Admin nunca expira. O 402 distingue "teste vencido" de "não
    // confirmou o e-mail", que é 403, para a tela saber qual mensagem mostrar.
    if (guardAuth && guardAuth.collection().name === 'users' && !guardAuth.getBool('isAdmin')) {
      // Assinante ativo passa direto. O `trial_expira_em` continua no banco e
      // continua vencendo, mas deixou de significar alguma coisa para quem
      // paga: checar só o teste barraria o assinante no dia seguinte ao
      // pagamento, e do lado do SERVIDOR, onde a falha é muda e chega ao
      // corretor como "erro ao validar".
      var planoStr = String(guardAuth.getString('plano') || '').trim()
      var renovaStr = String(guardAuth.getString('plano_renova_em') || '').trim()
      var renovaMs = renovaStr ? new Date(renovaStr.replace(' ', 'T')).getTime() : 0
      var planoAtivo = !!planoStr && !!renovaMs && renovaMs > Date.now()

      // Assinatura vencida barra SOZINHA, sem depender do prazo do teste. O
      // furo que isto fecha: a checagem abaixo só barra quem tem
      // `trial_expira_em` preenchido E vencido, e as contas anteriores ao teste
      // de 15 dias têm esse campo VAZIO de propósito (migração 1900000033). Uma
      // dessas contas assinava, o mês vencia, e seguia com acesso total, aqui no
      // servidor inclusive.
      //
      // Exige a data presente e no passado: plano carimbado sem data de
      // renovação é erro de cadastro do admin, e trancar quem paga por erro
      // nosso é pior do que deixar passar um dia a mais.
      if (!planoAtivo && planoStr && renovaMs && renovaMs < Date.now()) {
        return e.json(402, {
          error: 'Sua assinatura venceu. Renove pela página Planos para voltar a usar.',
        })
      }

      if (!planoAtivo) {
        var trialStr = String(guardAuth.getString('trial_expira_em') || '').trim()
        if (trialStr) {
          var trialMs = new Date(trialStr.replace(' ', 'T')).getTime()
          if (trialMs && trialMs < Date.now()) {
            return e.json(402, {
              error: 'Seu período de teste terminou. Fale com a gente pela página Ajuda e Suporte.',
            })
          }
        }
      }
    }

    var userId = e.auth ? e.auth.id : ''

    // ── Rate Limiting via coleção `rate_limits` (janela fixa de 60s) ──────
    // Fail-open: qualquer erro na coleção é logado e a requisição passa —
    // nunca bloqueia um usuário legítimo por falha de infra de rate limit.
    if (userId) {
      try {
        var rlNowSec = Math.floor(Date.now() / 1000)
        var rlWindowStart = Math.floor(rlNowSec / 60) * 60
        var rlLimit = 10
        var rlEndpoint = 'consultar_ia'

        // Limpeza: remove registros com window_start mais antigo que 2 min.
        try {
          var rlCutoff = rlWindowStart - 120
          var rlStale = $app.findRecordsByFilter(
            'rate_limits',
            'window_start < {:cutoff}',
            '',
            200,
            0,
            { cutoff: rlCutoff },
          )
          for (var rlPurgeI = 0; rlPurgeI < rlStale.length; rlPurgeI++) {
            try {
              $app.delete(rlStale[rlPurgeI])
            } catch (_) {}
          }
        } catch (rlCleanErr) {
          $app.logger().error('rate_limits: limpeza falhou', 'error', String(rlCleanErr))
        }

        var rlExisting = []
        try {
          rlExisting = $app.findRecordsByFilter(
            'rate_limits',
            'user = {:uid} && endpoint = {:ep} && window_start = {:ws}',
            '',
            1,
            0,
            { uid: userId, ep: rlEndpoint, ws: rlWindowStart },
          )
        } catch (rlFindErr) {
          $app.logger().error('rate_limits: busca falhou', 'error', String(rlFindErr))
        }

        if (rlExisting && rlExisting.length > 0) {
          var rlRec = rlExisting[0]
          var rlCount = (rlRec.getInt('count') || 0) + 1
          rlRec.set('count', rlCount)
          $app.saveNoValidate(rlRec)
          if (rlCount > rlLimit) {
            var rlWaitSec = Math.max(1, rlWindowStart + 60 - rlNowSec)
            return e.json(429, { error: 'Muitas requisições. Aguarde ' + rlWaitSec + ' segundos.' })
          }
        } else {
          var rlCol = $app.findCollectionByNameOrId('rate_limits')
          var rlNewRec = new Record(rlCol)
          rlNewRec.set('user', userId)
          rlNewRec.set('endpoint', rlEndpoint)
          rlNewRec.set('window_start', rlWindowStart)
          rlNewRec.set('count', 1)
          $app.saveNoValidate(rlNewRec)
        }
      } catch (rlErr) {
        $app.logger().error('rate_limits: erro (fail-open)', 'error', String(rlErr))
      }
    }

    var body = e.requestInfo().body || {}
    var requestId = (body.request_id || '').trim()
    if (!requestId) {
      return e.badRequestError('request_id é obrigatório.')
    }

    var req
    try {
      req = $app.findRecordById('expert_support_requests', requestId)
    } catch (err) {
      return e.json(404, { error: 'Solicitação não encontrada.' })
    }
    var objective = req.getString('objective') || ''
    var description = req.getString('description') || ''
    var documentType = req.getString('document_type') || ''

    // ── Resolução de agencyId para consultar-ia (Fase 2, §3) ────────────
    var userAgencyId = ''
    if (userId) {
      try {
        var userMemberships = $app.findRecordsByFilter(
          'agency_members',
          "member = {:m} && status = 'ativo' && termo_aceito_em != ''",
          '-created',
          1,
          0,
          { m: userId },
        )
        if (userMemberships && userMemberships.length > 0) {
          userAgencyId = userMemberships[0].getString('agency') || ''
        }
      } catch (agencyErr) {
        $app
          .logger()
          .error('consultar-ia: erro ao resolver agency do usuario', 'error', String(agencyErr))
      }
    }

    // Carregamento com escopo de agência (4 pontos) + mesclagem por code
    var rawKnowledgeRecords = []
    try {
      if (documentType && documentType !== 'Genérico') {
        try {
          if (userAgencyId) {
            rawKnowledgeRecords = $app.findRecordsByFilter(
              'legal_knowledge',
              "(agency = '' || agency = {:agencyId}) && (trigger_logic ~ {:dt} || trigger_logic = {:todos})",
              '-priority',
              100,
              0,
              { agencyId: userAgencyId, dt: documentType, todos: 'todos' },
            )
          } else {
            rawKnowledgeRecords = $app.findRecordsByFilter(
              'legal_knowledge',
              "agency = '' && (trigger_logic ~ {:dt} || trigger_logic = {:todos})",
              '-priority',
              100,
              0,
              { dt: documentType, todos: 'todos' },
            )
          }
        } catch (filterErr) {
          rawKnowledgeRecords = []
        }
      }

      // Fallback: se o filtro não retornar nada ou documentType for genérico
      if (!rawKnowledgeRecords || rawKnowledgeRecords.length === 0) {
        if (userAgencyId) {
          rawKnowledgeRecords = $app.findRecordsByFilter(
            'legal_knowledge',
            "(agency = '' || agency = {:agencyId})",
            '-priority',
            100,
            0,
            { agencyId: userAgencyId },
          )
        } else {
          rawKnowledgeRecords = $app.findRecordsByFilter(
            'legal_knowledge',
            "agency = ''",
            '-priority',
            100,
            0,
          )
        }
      }
    } catch (err) {
      return e.json(500, { error: 'Base de conhecimento indisponível.' })
    }

    // Mesclagem por code (regra da imobiliária vence a global de mesmo code)
    // e ordenação por priority decrescente
    var rulesByCode = {}
    for (var k = 0; k < rawKnowledgeRecords.length; k++) {
      var kRec = rawKnowledgeRecords[k]
      var kCode = kRec.getString('code') || 'SEM_CODE_' + kRec.id
      var kAgency = kRec.getString('agency') || ''

      if (!rulesByCode[kCode]) {
        rulesByCode[kCode] = kRec
      } else {
        var existingAgency = rulesByCode[kCode].getString('agency') || ''
        if (userAgencyId && kAgency === userAgencyId && !existingAgency) {
          rulesByCode[kCode] = kRec
        }
      }
    }

    var mergedRecords = []
    var codeKeys = Object.keys(rulesByCode)
    for (var ck = 0; ck < codeKeys.length; ck++) {
      mergedRecords.push(rulesByCode[codeKeys[ck]])
    }

    mergedRecords.sort(function (a, b) {
      var pA = a.getInt('priority') || 0
      var pB = b.getInt('priority') || 0
      return pB - pA
    })

    // Teto de 50 registros
    var knowledgeRecords = mergedRecords.slice(0, 50)

    var baseLines = []
    for (var i = 0; i < knowledgeRecords.length; i++) {
      var rec = knowledgeRecords[i]
      var content = rec.getString('content') || ''
      if (!content.trim()) continue
      if (content.length > 700) content = content.substring(0, 700)
      baseLines.push(
        '[' +
          (rec.getString('code') || 'SEM_CODE') +
          '] ' +
          (rec.getString('title') || '') +
          ' (' +
          (rec.getString('category') || '') +
          '): ' +
          content,
      )
    }
    var baseStr = baseLines.join('\n')
    if (baseStr.length > 50000) {
      baseStr = baseStr.substring(0, 50000)
    }

    var systemPrompt =
      'Você é um consultor jurídico imobiliário de NÍVEL 1 que ORIENTA corretores e imobiliárias no Brasil, baseando-se EXCLUSIVAMENTE na BASE DE CONHECIMENTO (regras e cláusulas aprovadas) fornecida. Você RESPONDE a dúvida de forma clara, objetiva e prática, SEM inventar norma jurídica. Quando a dúvida for complexa, exigir análise de um documento/matrícula específico, envolver risco jurídico relevante, ou ultrapassar o que a base cobre, você RECOMENDA o Especialista humano (Nível 2).\n\nVocê recebe: OBJETIVO (tipo da dúvida), TIPO_DOCUMENTO (se houver), DÚVIDA (texto do corretor) e BASE (regras aprovadas, cada linha "[code] título (category): trecho").\n\nResponda SOMENTE com um objeto JSON válido, sem nenhum texto antes ou depois, exatamente neste formato:\n{"resposta":"resposta clara e prática à dúvida, ancorada na BASE, em 2 a 5 parágrafos curtos; cite o code da base entre parênteses quando aplicável; português do Brasil","recomenda_humano":true}\n\nRegras:\n- Ancore a resposta na BASE; se algo não tiver respaldo na base, diga que é ponto para o especialista humano — NÃO invente.\n- "recomenda_humano" = true quando a dúvida for complexa, exigir leitura de documento específico, envolver risco/valor relevante, litígio, ou ser além da base; = false para dúvidas conceituais simples que a base já resolve.\n- NÃO inclua disclaimer no texto (o aplicativo já exibe um aviso fixo).\n- NÃO copie a base literalmente; seja prático e direto.\n- Se a DÚVIDA estiver vaga, peça os detalhes que faltam na "resposta" e use recomenda_humano=false.'

    var userMessage =
      'OBJETIVO: ' +
      objective +
      '\nTIPO_DOCUMENTO: ' +
      documentType +
      '\n\nDÚVIDA:\n' +
      description +
      '\n\nBASE:\n' +
      baseStr

    // ── JSON sanitization helpers ──────────────────────────────────────

    function sanitizeJsonString(str) {
      var s = String(str || '')
        .replace(/^\uFEFF/, '')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
      s = s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      return s
    }

    function stripMarkdownFences(str) {
      var mdMatch = str.match(/```(?:json)?\s*([\s\S]*?)```/i)
      if (mdMatch) return mdMatch[1].trim()
      var unclosedMatch = str.match(/```(?:json)?\s*([\s\S]+)/i)
      if (unclosedMatch) {
        var content = unclosedMatch[1]
        var braceIdx = content.indexOf('{')
        if (braceIdx !== -1 && braceIdx < 5) {
          return content.trim()
        }
      }
      return str
    }

    function extractJsonObject(str) {
      var start = str.indexOf('{')
      if (start === -1) return null
      var depth = 0
      var inString = false
      var escape = false
      for (var i = start; i < str.length; i++) {
        var ch = str.charAt(i)
        if (escape) {
          escape = false
          continue
        }
        if (ch === '\\' && inString) {
          escape = true
          continue
        }
        if (ch === '"') {
          inString = !inString
          continue
        }
        if (inString) continue
        if (ch === '{') depth++
        else if (ch === '}') {
          depth--
          if (depth === 0) {
            return str.substring(start, i + 1)
          }
        }
      }
      return str.substring(start)
    }

    function fixTrailingCommas(str) {
      return str.replace(/,(\s*[}\]])/g, '$1')
    }

    function fixUnquotedKeys(str) {
      return str.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g, '$1"$2"$3')
    }

    function repairJsonString(str) {
      var result = []
      var inString = false
      var escape = false
      for (var i = 0; i < str.length; i++) {
        var ch = str.charAt(i)
        if (escape) {
          result.push(ch)
          escape = false
          continue
        }
        if (ch === '\\' && inString) {
          result.push(ch)
          escape = true
          continue
        }
        if (ch === '"') {
          inString = !inString
          result.push(ch)
          continue
        }
        if (inString) {
          if (ch === '\n') {
            result.push('\\n')
            continue
          }
          if (ch === '\r') {
            result.push('\\r')
            continue
          }
          if (ch === '\t') {
            result.push('\\t')
            continue
          }
          if (ch.charCodeAt(0) < 32) {
            result.push('\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4))
            continue
          }
          result.push(ch)
          continue
        }
        if (ch === '/' && i + 1 < str.length) {
          var nc = str.charAt(i + 1)
          if (nc === '/') {
            while (i < str.length && str.charAt(i) !== '\n') i++
            continue
          }
          if (nc === '*') {
            i += 2
            while (i < str.length - 1 && !(str.charAt(i) === '*' && str.charAt(i + 1) === '/')) i++
            i++
            continue
          }
        }
        result.push(ch)
      }
      return result.join('')
    }

    function attemptParse(str) {
      try {
        return JSON.parse(str)
      } catch (e1) {
        try {
          return JSON.parse(fixTrailingCommas(str))
        } catch (e2) {
          try {
            return JSON.parse(fixTrailingCommas(fixUnquotedKeys(str)))
          } catch (e3) {
            try {
              return JSON.parse(fixTrailingCommas(repairJsonString(str)))
            } catch (e4) {
              try {
                return JSON.parse(fixTrailingCommas(fixUnquotedKeys(repairJsonString(str))))
              } catch (e5) {
                return null
              }
            }
          }
        }
      }
    }

    function parseAiResponse(rawContent) {
      var cleaned = sanitizeJsonString(rawContent)
      cleaned = stripMarkdownFences(cleaned)

      var parsed = attemptParse(cleaned)

      if (!parsed) {
        var extracted = extractJsonObject(cleaned)
        if (extracted) {
          parsed = attemptParse(sanitizeJsonString(extracted))
        }
      }

      if (!parsed) {
        var rawExtracted = extractJsonObject(sanitizeJsonString(rawContent))
        if (rawExtracted) {
          parsed = attemptParse(sanitizeJsonString(rawExtracted))
        }
      }

      if (!parsed) {
        var rawRepaired = repairJsonString(sanitizeJsonString(stripMarkdownFences(rawContent)))
        var repairedExtracted = extractJsonObject(rawRepaired)
        if (repairedExtracted) {
          parsed = attemptParse(repairedExtracted)
        } else {
          parsed = attemptParse(rawRepaired)
        }
      }

      return parsed
    }

    // ── Retry loop de 3 tentativas para consultar-ia ───────────────────
    var MAX_ATTEMPTS = 3
    var parsed = null
    var rawContent = ''
    var lastFailureStatus = 500
    var lastFailureBody = {
      error: 'Não foi possível interpretar a resposta da IA. Tente novamente.',
    }
    var success = false

    for (var attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        $app.logger().info('consultar-ia: AI attempt ' + attempt + '/' + MAX_ATTEMPTS)
        var aiResult = $ai.chat({
          model: 'fast',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
        })

        if (!aiResult || !aiResult.choices || !aiResult.choices[0]) {
          $app
            .logger()
            .error('consultar-ia: AI attempt ' + attempt + ' returned malformed response')
          lastFailureStatus = 500
          lastFailureBody = {
            error: 'Não foi possível interpretar a resposta da IA. Tente novamente.',
          }
          continue
        }

        rawContent = aiResult.choices[0].message.content || ''
        if (!rawContent.trim()) {
          $app.logger().error('consultar-ia: AI attempt ' + attempt + ' returned empty content')
          lastFailureStatus = 500
          lastFailureBody = { error: 'A IA retornou uma resposta vazia. Tente novamente.' }
          continue
        }

        var parseResult = parseAiResponse(rawContent)
        if (!parseResult) {
          $app.logger().error('consultar-ia: AI attempt ' + attempt + ' JSON parse failed')
          lastFailureStatus = 500
          lastFailureBody = {
            error: 'Não foi possível interpretar a resposta da IA. Tente novamente.',
          }
          continue
        }

        parsed = parseResult
        success = true
        $app.logger().info('consultar-ia: AI attempt ' + attempt + ' succeeded')
        break
      } catch (err) {
        $app.logger().error('consultar-ia: AI attempt ' + attempt + ' failed', 'error', String(err))
        if (err instanceof SkipAiConfigError) {
          return e.json(503, { error: 'Serviço de IA temporariamente indisponível.' })
        }
        if (err instanceof SkipAiError) {
          lastFailureStatus = 502
          lastFailureBody = { error: 'Falha ao consultar a IA. Tente novamente.' }
          continue
        }
        lastFailureStatus = 502
        lastFailureBody = { error: 'Falha ao consultar a IA. Tente novamente.' }
        continue
      }
    }

    if (!success) {
      return e.json(lastFailureStatus, lastFailureBody)
    }

    var resposta = String(parsed.resposta || '').trim()
    var recomendaHumano = parsed.recomenda_humano === true

    try {
      req.set('ai_response', resposta)
      req.set('ai_recommends_human', recomendaHumano ? 'true' : 'false')
      $app.save(req)
    } catch (err) {
      $app.logger().error('consultar-ia: falha ao salvar resposta', 'error', String(err))
    }

    // Conta a consulta. Fica AQUI, e não num hook como o da validação, porque
    // esta rota não cria registro nenhum: ela atualiza o pedido existente, e
    // não há evento de criação para escutar. Contar comparando o `ai_response`
    // anterior num hook de update seria mais bonito e falharia calado quando a
    // resposta nova fosse idêntica à antiga.
    //
    // Só chega aqui quando a IA respondeu de verdade: acima, `if (!success)`
    // devolve o erro e sai. Tentativa frustrada não entra na conta do corretor.
    //
    // O mês de referência (`ia_mes_ref`) é o mesmo dos dois contadores, então
    // quem chega primeiro no mês novo zera o outro. Sem isso, quem consultasse
    // em setembro sem validar carregaria o número de agosto para sempre. A
    // lógica está repetida no `ia_contador.js` DE PROPÓSITO: handler do JSVM não
    // enxerga escopo de módulo, e função compartilhada chegaria aqui como
    // `undefined`.
    try {
      if (userId) {
        var quemConsultou = $app.findRecordById('users', userId)
        if (quemConsultou) {
          var mesAtualIa = new Date().toISOString().slice(0, 7)
          var mesGuardadoIa = quemConsultou.getString('ia_mes_ref')
          var mesmoMesIa = mesGuardadoIa === mesAtualIa
          var consultasAntes = mesmoMesIa ? quemConsultou.getInt('consultas_no_mes') || 0 : 0
          if (!mesmoMesIa) {
            quemConsultou.set('validacoes_no_mes', 0)
          }
          quemConsultou.set('ia_mes_ref', mesAtualIa)
          quemConsultou.set('consultas_no_mes', consultasAntes + 1)
          $app.saveNoValidate(quemConsultou)
        }
      }
    } catch (errConta) {
      // Sem contagem o corretor ganha uma consulta de graça; com exceção
      // propagada ele perde a resposta que a IA já produziu. A troca não é
      // próxima.
      $app.logger().error('consultar-ia: falha ao contar a consulta', 'error', String(errConta))
    }

    return e.json(200, { resposta: resposta, recomenda_humano: recomendaHumano })
  },
  $apis.requireAuth(),
)
