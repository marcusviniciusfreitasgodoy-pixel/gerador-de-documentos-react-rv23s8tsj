routerAdd(
  'POST',
  '/backend/v1/validar-minuta',
  (e) => {
    var body = e.requestInfo().body || {}
    var documentText = (body.document_text || '').trim()
    var documentType = (body.document_type || 'Genérico').trim()
    var userId = e.auth ? e.auth.id : ''

    if (!documentText) {
      return e.badRequestError('O texto do documento é obrigatório.')
    }

    function createAuditLog(status, parsedResult, rawResponse, errorMessage, errorCode) {
      try {
        var logCol = $app.findCollectionByNameOrId('validation_logs')
        var logRecord = new Record(logCol)
        if (userId) {
          logRecord.set('user', userId)
        }
        logRecord.set('document_text', documentText.substring(0, 10000))
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
          auditRecord.set('document_text', documentText.substring(0, 10000))
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

    var knowledgeRecords = []
    try {
      knowledgeRecords = $app.findRecordsByFilter('legal_knowledge', '1=1', '-priority', 500, 0)
    } catch (err) {
      $app.logger().error('validar_minuta: knowledge base load failed', 'error', String(err))
      createAuditLog('fail', null, '', 'Base de conhecimento indisponível', 'KNOWLEDGE_BASE_ERROR')
      return e.json(500, {
        error: 'Base de conhecimento indisponível.',
        code: 'KNOWLEDGE_BASE_ERROR',
      })
    }

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

    var systemPrompt =
      'Você é um revisor jurídico especializado em contratos e documentos imobiliários no Brasil, a serviço de um corretor/imobiliária. Sua função é ANALISAR e APONTAR — você NUNCA redige, reescreve ou inventa texto de cláusula, e NUNCA cria norma jurídica. A única autoridade é a BASE DE CONHECIMENTO (regras e cláusulas aprovadas da empresa) fornecida na mensagem. Você verifica a MINUTA contra essa base e ancora cada observação no código (code) da regra correspondente.\n\nCRITICAL INSTRUCTION: Return ONLY a valid JSON object. Do not include any explanations, greetings, or Markdown formatting. No text before or after the JSON object. Do not wrap the JSON in Markdown code blocks. Your entire response must be parseable by JSON.parse() with zero surrounding text.\n\nVocê recebe:\n- TIPO_DOCUMENTO: o tipo declarado da minuta (pode ser "Genérico").\n- BASE: lista de regras/cláusulas aprovadas, cada linha no formato "[code] título (category | trigger_logic): trecho do conteúdo".\n- MINUTA: o texto integral do documento a validar.\n\nResponda SOMENTE com um objeto JSON válido, sem nenhum texto antes ou depois, exatamente neste formato:\n{\n  "status": "green|yellow|red",\n  "resumo": "2 a 4 frases com a visão geral da qualidade da minuta e os principais pontos de atenção",\n  "conformidade": [\n    {"code": "CODIGO_DA_BASE", "titulo": "título da regra", "status": "presente|faltando|fraco", "descricao": "objetivo, específico à minuta"}\n  ],\n  "riscos": [\n    {"gravidade": "alto|medio|baixo", "descricao": "o risco concreto para as partes", "base_code": "CODIGO_DA_BASE"}\n  ],\n  "recomendacoes": [\n    {"texto": "o que adicionar ou ajustar (aponte a regra/modelo, NÃO escreva o texto da cláusula)", "base_code": "CODIGO_DA_BASE"}\n  ]\n}\n\nEach \'code\' must appear at most once in the \'conformidade\' array. Return ONLY the JSON object without any additional text or formatting. Do not wrap the JSON in Markdown code blocks. Do not add any preamble, postamble, or commentary. The response must start with { and end with }.\n\nYour response must be a valid JSON object only. Do not include markdown formatting, preambles, or post-scripts.\n\nRegras de conduta:\n- Ancore CADA item numa regra da BASE (campo code/base_code). Se um ponto não tiver respaldo na BASE, NÃO o inclua — não invente.\n- Cada code deve aparecer no máximo uma vez em conformidade.\n- "status": use "green" se a minuta está em conformidade geral, "yellow" se há pontos fracos ou faltando mas sem riscos altos, "red" se há riscos altos ou cláusulas essenciais faltando.\n- "conformidade": para cada cláusula/regra ESSENCIAL ao TIPO_DOCUMENTO presente na BASE, classifique como "presente", "faltando" ou "fraco" (existe mas está incompleta, ambígua ou arriscada), com descricao objetiva referindo-se à minuta.\n- DETECÇÃO POR CONTEÚDO: uma cláusula pode estar EMBUTIDA em outra (ex.: a mediação costuma vir no fim da cláusula de foro; a outorga pode vir junto da finalização). Identifique pelo CONTEÚDO/tema, não pelo título. Se o tema aparece no texto, é "presente" (ou "fraco"); NUNCA "faltando".\n- CONDICIONAIS/ALTERNATIVAS: o trigger_logic pode indicar condição (ex.: {"path":"compliance.arbitragem","value":true}). Regras condicionais ou opcionais NÃO são "faltando" quando a minuta adota validamente a via alternativa. Foro judicial + mediação e arbitragem são VIAS EXCLUDENTES: se a minuta elege foro + mediação, a ausência de arbitragem NÃO é falha.\n- DISTRATO (Lei 13.786/2018, códigos LEI-DISTRATO): só se aplica a AQUISIÇÃO DE IMÓVEL NA PLANTA / de incorporadora ou loteadora. Em REVENDA ENTRE PARTICULARES (pessoas físicas, imóvel já registrado, sem incorporador/construtora como vendedor), as normas de distrato NÃO se aplicam — NÃO cobrar, NÃO marcar como faltando nem como risco. A rescisão dessas minutas rege-se pelas cláusulas de inadimplemento/arras e pela lei civil comum.\n- PROPOSTA / RESERVA (quando TIPO_DOCUMENTO contém \"Proposta\" ou \"Reserva\"): é documento PRÉ-CONTRATUAL de OFERTA, não o contrato definitivo. A régua é a ESSÊNCIA DA OFERTA — exija apenas: objeto/imóvel, preço proposto, sinal e sua natureza de arras, prazo de validade e irretratabilidade da proposta (art. 427 CC), devolução do sinal em caso de recusa, condição de aceite do proprietário, LGPD (LGP001), foro e intermediação/comissão (COM001). NÃO cobrar — nem marcar como \"faltando\" nem como risco — cláusulas próprias do CONTRATO DEFINITIVO que só passam a existir APÓS o aceite: evicção (FIX005), irrevogabilidade/irretratabilidade DO CONTRATO (FIX004), rescisão por justa causa (RES001), inadimplência/juros de mora (INA001) e demais garantias de compra e venda. Essas pertencem à promessa/escritura que se firmará se a proposta for aceita; sua ausência na proposta é CORRETA, não é falha.\n- DOCUMENTOS FACTUAIS / AUXILIARES (quando TIPO_DOCUMENTO for "Recibo de Sinal (Arras)", "Autorização de Intermediação", "Termo de Entrega das Chaves", "Termo de Transmissão da Posse" ou "Genérico/Outro"): NÃO são o contrato de compra e venda — a régua é a ESSÊNCIA DO PRÓPRIO DOCUMENTO, não a da promessa/escritura. Exija apenas o que é próprio de cada um: qualificação das partes, identificação do imóvel e a cláusula-núcleo do tipo — no Recibo, o sinal e sua NATUREZA DE ARRAS (confirmatória/penitencial, arts. 417-420 CC) e a imputação ao preço; na Autorização de Intermediação, a exclusividade/gestão, o prazo de vigência e a comissão (COM001, Lei 6.530); no Termo de Entrega das Chaves, a identificação do imóvel e a data/condição da entrega; no Termo de Transmissão da Posse, a tradição/imissão na posse e a data. NÃO cobrar — nem marcar como "faltando" nem como risco — cláusulas do CONTRATO DEFINITIVO de compra e venda que NÃO pertencem a esses documentos: evicção (FIX005), irrevogabilidade/irretratabilidade do contrato (FIX004), rescisão por justa causa (RES001), inadimplência/juros de mora (INA001), obtenção de financiamento (FIN*) e demais garantias da promessa/escritura. No Termo de Entrega das Chaves, por ser MERO COMPROVANTE de entrega física do imóvel, NÃO cobrar foro (FIX008) nem LGPD (LGP001) — nem como faltando nem como risco; a régua dele é só imóvel, partes e a data/condição da entrega. Se o TIPO for "Genérico/Outro" e o texto for uma LISTA DE CONFERÊNCIA/checklist (não um contrato), valide apenas que imóvel e responsável estão identificados e retorne status green se coerente, sem cobrar cláusulas contratuais.\n- "faltando" APENAS quando o tema está TOTALMENTE ausente; se está referenciado mas incompleto ou implícito, use "fraco".\n- "riscos": aponte o que expõe as partes (ex.: ausência de anuência conjugal quando cabível, arras sem natureza definida, falta de foro, ausência de PLD-FT/LGPD, evicção não tratada, prazo/rescisão omissos), com a gravidade.\n- "recomendacoes": diga o que fazer, citando SEMPRE o code do modelo/regra na base — jamais escreva o texto da cláusula.\n- Seja específico à MINUTA (pode citar trechos curtos entre aspas). Não copie a base literalmente.\n- Não use conhecimento externo à BASE para afirmar obrigações; a BASE é a régua.\n- Português do Brasil. Se a MINUTA estiver vazia ou ilegível, retorne resumo explicando e listas vazias.'

    var userMessage =
      'TIPO_DOCUMENTO: ' + documentType + '\n\nBASE:\n' + baseStr + '\n\nMINUTA:\n' + documentText

    var aiResult
    var rawContent = ''
    try {
      aiResult = $ai.chat({
        model: 'fast',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
      })
      if (!aiResult || !aiResult.choices || !aiResult.choices[0]) {
        createAuditLog(
          'fail',
          null,
          '',
          'Resposta da IA em formato inesperado',
          'DATA_PROCESSING_ERROR',
        )
        return e.json(500, {
          error: 'Erro de Processamento de Dados',
          detail: 'Resposta da IA em formato inesperado.',
          code: 'DATA_PROCESSING_ERROR',
        })
      }
      rawContent = aiResult.choices[0].message.content || ''
    } catch (err) {
      $app.logger().error('validar_minuta: AI call failed', 'error', String(err))
      if (err instanceof SkipAiConfigError) {
        createAuditLog('fail', null, '', 'Serviço de IA indisponível', 'AI_CONFIG_ERROR')
        return e.json(503, {
          error: 'Serviço de IA temporariamente indisponível.',
          code: 'AI_CONFIG_ERROR',
        })
      }
      if (err instanceof SkipAiError) {
        createAuditLog('fail', null, '', 'Falha na comunicação com IA', 'AI_SERVICE_ERROR')
        return e.json(502, {
          error: 'Falha na comunicação com o serviço de IA. Tente novamente.',
          code: 'AI_SERVICE_ERROR',
        })
      }
      createAuditLog('fail', null, '', 'Erro inesperado', 'UNEXPECTED_ERROR')
      return e.json(500, {
        error: 'Erro inesperado ao processar a análise.',
        code: 'UNEXPECTED_ERROR',
      })
    }

    if (!rawContent.trim()) {
      createAuditLog('fail', null, rawContent, 'Resposta da IA vazia', 'DATA_PROCESSING_ERROR')
      return e.json(500, {
        error: 'A IA retornou uma resposta vazia. Tente novamente.',
        detail: 'Empty AI response',
        code: 'DATA_PROCESSING_ERROR',
      })
    }

    var jsonString = rawContent.replace(/^\uFEFF/, '').replace(/[\u200B-\u200D\uFEFF]/g, '')

    var mdMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (mdMatch) {
      jsonString = mdMatch[1].trim()
    }

    var firstBrace = jsonString.indexOf('{')
    var lastBrace = jsonString.lastIndexOf('}')
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonString = jsonString.substring(firstBrace, lastBrace + 1)
    }

    jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1')
    jsonString = jsonString.replace(/[\x00-\x1F\x7F]/g, '')

    var parsed
    try {
      parsed = JSON.parse(jsonString)
    } catch (parseErr) {
      try {
        var jsonMatch = rawContent.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          var cleaned = jsonMatch[0].replace(/,(\s*[}\]])/g, '$1').replace(/[\x00-\x1F\x7F]/g, '')
          parsed = JSON.parse(cleaned)
        } else {
          throw parseErr
        }
      } catch (parseErr2) {
        try {
          var fixedJson = jsonString.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g, '$1"$2"$3')
          parsed = JSON.parse(fixedJson)
        } catch (parseErr3) {
          $app
            .logger()
            .error(
              'validar_minuta: JSON parse failed',
              'error',
              String(parseErr3),
              'rawContent',
              rawContent.substring(0, 500),
            )
          createAuditLog('error', null, rawContent, 'JSON parsing failed', 'DATA_PROCESSING_ERROR')
          return e.json(500, {
            error:
              'Ocorreu um erro ao processar a resposta da análise. Por favor, tente gerar a validação novamente.',
            detail: 'JSON parsing failed',
            code: 'DATA_PROCESSING_ERROR',
          })
        }
      }
    }

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
    const body = e.requestInfo().body || {}
    const requestId = (body.request_id || '').trim()
    if (!requestId) {
      return e.badRequestError('request_id é obrigatório.')
    }

    let req
    try {
      req = $app.findRecordById('expert_support_requests', requestId)
    } catch (err) {
      return e.json(404, { error: 'Solicitação não encontrada.' })
    }
    const objective = req.getString('objective') || ''
    const description = req.getString('description') || ''
    const documentType = req.getString('document_type') || ''

    let knowledgeRecords = []
    try {
      knowledgeRecords = $app.findRecordsByFilter('legal_knowledge', '1=1', '-priority', 500, 0)
    } catch (err) {
      return e.json(500, { error: 'Base de conhecimento indisponível.' })
    }
    let baseLines = []
    for (let i = 0; i < knowledgeRecords.length; i++) {
      const rec = knowledgeRecords[i]
      let content = rec.getString('content') || ''
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
    const baseStr = baseLines.join('\n')

    const systemPrompt =
      'Você é um consultor jurídico imobiliário de NÍVEL 1 que ORIENTA corretores e imobiliárias no Brasil, baseando-se EXCLUSIVAMENTE na BASE DE CONHECIMENTO (regras e cláusulas aprovadas) fornecida. Você RESPONDE a dúvida de forma clara, objetiva e prática, SEM inventar norma jurídica. Quando a dúvida for complexa, exigir análise de um documento/matrícula específico, envolver risco jurídico relevante, ou ultrapassar o que a base cobre, você RECOMENDA o Especialista humano (Nível 2).\n\nVocê recebe: OBJETIVO (tipo da dúvida), TIPO_DOCUMENTO (se houver), DÚVIDA (texto do corretor) e BASE (regras aprovadas, cada linha "[code] título (category): trecho").\n\nResponda SOMENTE com um objeto JSON válido, sem nenhum texto antes ou depois, exatamente neste formato:\n{\n  "resposta": "resposta clara e prática à dúvida, ancorada na BASE, em 2 a 5 parágrafos curtos; cite o code da base entre parênteses quando aplicável; português do Brasil",\n  "recomenda_humano": true\n}\n\nRegras:\n- Ancore a resposta na BASE; se algo não tiver respaldo na base, diga que é ponto para o especialista humano — NÃO invente.\n- "recomenda_humano" = true quando a dúvida for complexa, exigir leitura de documento específico, envolver risco/valor relevante, litígio, ou for além da base; = false para dúvidas conceituais simples que a base já resolve.\n- NÃO inclua disclaimer no texto (o aplicativo já exibe um aviso fixo).\n- NÃO copie a base literalmente; seja prático e direto.\n- Se a DÚVIDA estiver vaga, peça os detalhes que faltam na "resposta" e use recomenda_humano=false.'

    const userMessage =
      'OBJETIVO: ' +
      objective +
      '\nTIPO_DOCUMENTO: ' +
      documentType +
      '\n\nDÚVIDA:\n' +
      description +
      '\n\nBASE:\n' +
      baseStr

    let rawContent = ''
    try {
      const aiResult = $ai.chat({
        model: 'fast',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
      })
      rawContent = aiResult.choices[0].message.content || ''
    } catch (err) {
      if (err instanceof SkipAiConfigError) {
        return e.json(503, { error: 'Serviço de IA temporariamente indisponível.' })
      }
      return e.json(502, { error: 'Falha ao consultar a IA. Tente novamente.' })
    }

    let jsonString = rawContent
    const mdMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (mdMatch) jsonString = mdMatch[1].trim()
    const firstBrace = jsonString.indexOf('{')
    const lastBrace = jsonString.lastIndexOf('}')
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonString = jsonString.substring(firstBrace, lastBrace + 1)
    }
    jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1').replace(/[\x00-\x1F\x7F]/g, '')

    let parsed
    try {
      parsed = JSON.parse(jsonString)
    } catch (err) {
      return e.json(500, {
        error: 'Não foi possível interpretar a resposta da IA. Tente novamente.',
      })
    }

    const resposta = String(parsed.resposta || '').trim()
    const recomendaHumano = parsed.recomenda_humano === true

    try {
      req.set('ai_response', resposta)
      req.set('ai_recommends_human', recomendaHumano ? 'true' : 'false')
      $app.save(req)
    } catch (err) {
      $app.logger().error('consultar-ia: falha ao salvar resposta', 'error', String(err))
    }

    return e.json(200, { resposta: resposta, recomenda_humano: recomendaHumano })
  },
  $apis.requireAuth(),
)
