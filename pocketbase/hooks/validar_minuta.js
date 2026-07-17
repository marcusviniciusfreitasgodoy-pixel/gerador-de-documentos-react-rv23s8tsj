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
      'Você é um revisor jurídico especializado em contratos e documentos imobiliários no Brasil, a serviço de um corretor/imobiliária. Sua função é ANALISAR e APONTAR — você NUNCA redige, reescreve ou inventa texto de cláusula, e NUNCA cria norma jurídica. A única autoridade é a BASE DE CONHECIMENTO (regras e cláusulas aprovadas da empresa) fornecida na mensagem. Você verifica a MINUTA contra essa base e ancora cada observação no código (code) da regra correspondente.\n\nVocê recebe:\n- TIPO_DOCUMENTO: o tipo declarado da minuta (pode ser "Genérico").\n- BASE: lista de regras/cláusulas aprovadas, cada linha no formato "[code] título (category | trigger_logic): trecho do conteúdo".\n- MINUTA: o texto integral do documento a validar.\n\nResponda SOMENTE com um objeto JSON válido. NÃO inclua nenhum texto explicativo, saudação, ou formatação Markdown antes ou depois do JSON. NÃO envolva o JSON em blocos de código Markdown (```json). Sua resposta inteira deve ser analisável por JSON.parse() sem nenhum texto ao redor.\n\nO formato exato do objeto JSON é:\n{"status":"green|yellow|red","resumo":"2 a 4 frases com a visão geral da qualidade da minuta e os principais pontos de atenção","conformidade":[{"code":"CODIGO_DA_BASE","titulo":"título da regra","status":"presente|faltando|fraco","descricao":"objetivo, específico à minuta"}],"riscos":[{"gravidade":"alto|medio|baixo","descricao":"o risco concreto para as partes","base_code":"CODIGO_DA_BASE"}],"recomendacoes":[{"texto":"o que adicionar ou ajustar (aponte a regra/modelo, NÃO escreva o texto da cláusula)","base_code":"CODIGO_DA_BASE"}]}\n\nEach \'code\' must appear at most once in the \'conformidade\' array.\n\nRegras de conduta:\n- Ancore CADA item numa regra da BASE (campo code/base_code). Se um ponto não tiver respaldo na BASE, NÃO o inclua — não invente.\n- Cada code deve aparecer no máximo uma vez em conformidade.\n- "status": use "green" se a minuta está em conformidade geral, "yellow" se há pontos fracos ou faltando mas sem riscos altos, "red" se há riscos altos ou cláusulas essenciais faltando.\n- "conformidade": para cada cláusula/regra ESSENCIAL ao TIPO_DOCUMENTO presente na BASE, classifique como "presente", "faltando" ou "fraco" (existe mas está incompleta, ambígua ou arriscada), com descricao objetiva referindo-se à minuta.\n- DETECÇÃO POR CONTEÚDO: uma cláusula pode estar EMBUTIDA em outra (ex.: a mediação costuma vir no fim da cláusula de foro; a outorga pode vir junto da finalização). Identifique pelo CONTEÚDO/tema, não pelo título. Se o tema aparece no texto, é "presente" (ou "fraco"); NUNCA "faltando".\n- CONDICIONAIS/ALTERNATIVAS: o trigger_logic pode indicar condição (ex.: {"path":"compliance.arbitragem","value":true}). Regras condicionais ou opcionais NÃO são "faltando" quando a minuta adota validamente a via alternativa. Foro judicial + mediação e arbitragem são VIAS EXCLUDENTES: se a minuta elege foro + mediação, a ausência de arbitragem NÃO é falha.\n- ARRAS (PENITENCIAIS vs CONFIRMATÓRIAS): são VIAS EXCLUDENTES, como foro/mediação vs arbitragem. Arras penitenciais (art. 420 CC) dão às partes o DIREITO DE ARREPENDIMENTO — quem deu o sinal o perde; quem o recebeu devolve mais o equivalente; e não cabe indenização suplementar. Logo, uma minuta que adota arras penitenciais NÃO PODE ser irrevogável/irretratável: a ausência de FIX004 nela é COERENTE com a escolha das partes e NÃO é falha — não marcar como "faltando" nem como risco. Cobre FIX004 apenas quando a minuta adota arras CONFIRMATÓRIAS (arts. 417-419) ou quando não define a natureza das arras. ATENÇÃO à forma QUALIFICADA, que é válida e frequente: "firmado em caráter irrevogável e irretratável, sendo possível a resilição na forma dos arts. 418 e 420 do Código Civil" — nesse caso FIX004 está PRESENTE (a irrevogabilidade existe, apenas ressalvada pela via das arras), não é contradição nem falha.\n- DISTRATO (Lei 13.786/2018, códigos LEI-DISTRATO): só se aplica a AQUISIÇÃO DE IMÓVEL NA PLANTA / de incorporadora ou loteadora. Em REVENDA ENTRE PARTICULARES (pessoas físicas, imóvel já registrado, sem incorporador/construtora como vendedor), as normas de distrato NÃO se aplicam — NÃO cobrar, NÃO marcar como faltando nem como risco. A rescisão dessas minutas rege-se pelas cláusulas de inadimplemento/arras e pela lei civil comum.\n- PROPOSTA / RESERVA (quando TIPO_DOCUMENTO contém "Proposta" ou "Reserva"): é documento PRÉ-CONTRATUAL de OFERTA, não o contrato definitivo. A régua é a ESSÊNCIA DA OFERTA — exija apenas: objeto/imóvel, preço proposto, sinal e sua natureza de arras, prazo de validade e irretratabilidade da proposta (art. 427 CC), devolução do sinal em caso de recusa, condição de aceite do proprietário, LGPD (LGP001), foro e intermediação/comissão (COM001). NÃO cobrar — nem marcar como "faltando" nem como risco — cláusulas próprias do CONTRATO DEFINITIVO que só passam a existir APÓS o aceite: evicção (FIX005 e GAR001), irrevogabilidade/irretratabilidade DO CONTRATO (FIX004), rescisão por justa causa (RES001), inadimplência/juros de mora (INA001) e demais garantias de compra e venda. Essas pertencem à promessa/escritura que se firmará se a proposta for aceita; sua ausência na proposta é CORRETA, não é falha.\n- DOCUMENTOS FACTUAIS / AUXILIARES (quando TIPO_DOCUMENTO for "Recibo de Sinal (Arras)", "Autorização de Intermediação", "Termo de Entrega das Chaves", "Termo de Transmissão da Posse" ou "Genérico/Outro"): NÃO são o contrato de compra e venda — a régua é a ESSÊNCIA DO PRÓPRIO DOCUMENTO, não a da promessa/escritura. Exija apenas o que é próprio de cada um: qualificação das partes, identificação do imóvel e a cláusula-núcleo do tipo — no Recibo, o sinal e sua NATUREZA DE ARRAS (confirmatória/penitencial, arts. 417-420 CC) e a imputação ao preço; na Autorização de Intermediação, a exclusividade/gestão, o prazo de vigência e a comissão (COM001, Lei 6.530); no Termo de Entrega das Chaves, a identificação do imóvel e a data/condição da entrega; no Termo de Transmissão da Posse, a tradição/imissão na posse e a data. NÃO cobrar — nem marcar como "faltando" nem como risco — cláusulas do CONTRATO DEFINITIVO de compra e venda que NÃO pertencem a esses documentos: evicção (FIX005 e GAR001), irrevogabilidade/irretratabilidade do contrato (FIX004), rescisão por justa causa (RES001), inadimplência/juros de mora (INA001), obtenção de financiamento (FIN*) e demais garantias da promessa/escritura. No Termo de Entrega das Chaves, por ser MERO COMPROVANTE de entrega física do imóvel, NÃO cobrar foro (FIX008) nem LGPD (LGP001) — nem como faltando nem como risco; a régua dele é só imóvel, partes e a data/condição da entrega. Se o TIPO for "Genérico/Outro" e o texto for uma LISTA DE CONFERÊNCIA/checklist (não um contrato), valide apenas que imóvel e responsável estão identificados e retorne status green se coerente, sem cobrar cláusulas contratuais.\n- "faltando" APENAS quando o tema está TOTALMENTE ausente; se está referenciado mas incompleto ou implícito, use "fraco".\n- "riscos": aponte o que expõe as partes (ex.: ausência de anuência conjugal quando cabível, arras sem natureza definida, falta de foro, ausência de PLD-FT/LGPD, evicção não tratada, prazo/rescisão omissos), com a gravidade.\n- "recomendacoes": diga o que fazer, citando SEMPRE o code do modelo/regra na base — jamais escreva o texto da cláusula.\n- Seja específico à MINUTA (pode citar trechos curtos entre aspas). Não copie a base literalmente.\n- Não use conhecimento externo à BASE para afirmar obrigações; a BASE é a régua.\n- Português do Brasil. Se a MINUTA estiver vazia ou ilegível, retorne resumo explicando e listas vazias.'

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

    // ── Robust JSON extraction & sanitization ──────────────────────────
    // The AI may wrap JSON in markdown fences, include BOM/zero-width chars,
    // prepend commentary, or leave trailing commas. We try progressively
    // more aggressive strategies until one succeeds.

    function sanitizeJsonString(str) {
      // Remove BOM and zero-width characters
      var s = str.replace(/^\uFEFF/, '').replace(/[\u200B-\u200D\uFEFF]/g, '')
      // Remove control characters (except tab, newline, carriage return)
      s = s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      return s
    }

    function stripMarkdownFences(str) {
      // Match ```json ... ``` or ``` ... ``` (including nested/unclosed)
      var mdMatch = str.match(/```(?:json)?\s*([\s\S]*?)```/i)
      if (mdMatch) return mdMatch[1].trim()
      // Handle unclosed fence: ```json\n{...}  (no closing ```)
      var unclosedMatch = str.match(/```(?:json)?\s*([\s\S]+)/i)
      if (unclosedMatch) {
        var content = unclosedMatch[1]
        // If there's a closing fence further in, the first regex would have caught it.
        // Only strip if this looks like it starts right before JSON
        var braceIdx = content.indexOf('{')
        if (braceIdx !== -1 && braceIdx < 5) {
          return content.trim()
        }
      }
      return str
    }

    function extractJsonObject(str) {
      // Find the outermost { ... } by tracking brace depth (respects strings)
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
      // No matching close brace — return from first { to end
      return str.substring(start)
    }

    function fixTrailingCommas(str) {
      // Remove trailing commas before } or ]
      return str.replace(/,(\s*[}\]])/g, '$1')
    }

    function fixUnquotedKeys(str) {
      // Quote unquoted object keys: { key: "value" } → { "key": "value" }
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

    var cleaned = sanitizeJsonString(rawContent)
    cleaned = stripMarkdownFences(cleaned)

    var parsed = attemptParse(cleaned)

    // If direct parse failed, try extracting the JSON object by brace depth
    if (!parsed) {
      var extracted = extractJsonObject(cleaned)
      if (extracted) {
        var extractedClean = sanitizeJsonString(extracted)
        parsed = attemptParse(extractedClean)
      }
    }

    // Last resort: try the raw content directly with brace extraction
    if (!parsed) {
      var rawExtracted = extractJsonObject(sanitizeJsonString(rawContent))
      if (rawExtracted) {
        parsed = attemptParse(sanitizeJsonString(rawExtracted))
      }
    }

    // Ultimate fallback: repair unescaped control chars, then re-extract and parse
    if (!parsed) {
      var rawRepaired = repairJsonString(sanitizeJsonString(stripMarkdownFences(rawContent)))
      var repairedExtracted = extractJsonObject(rawRepaired)
      if (repairedExtracted) {
        parsed = attemptParse(repairedExtracted)
      } else {
        parsed = attemptParse(rawRepaired)
      }
    }

    if (!parsed) {
      $app
        .logger()
        .error(
          'validar_minuta: JSON parse failed after all sanitization attempts',
          'error',
          'All parse strategies exhausted',
          'rawContentLength',
          String(rawContent.length),
          'rawContentPreview',
          rawContent.substring(0, 500),
        )
      createAuditLog('error', null, rawContent, 'JSON parsing failed', 'DATA_PROCESSING_ERROR')
      return e.json(500, {
        error:
          'Ocorreu um erro ao processar a resposta da análise. Por favor, tente gerar a validação novamente.',
        detail: 'JSON parsing failed after exhaustive sanitization',
        code: 'DATA_PROCESSING_ERROR',
      })
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
      'Você é um consultor jurídico imobiliário de NÍVEL 1 que ORIENTA corretores e imobiliárias no Brasil, baseando-se EXCLUSIVAMENTE na BASE DE CONHECIMENTO (regras e cláusulas aprovadas) fornecida. Você RESPONDE a dúvida de forma clara, objetiva e prática, SEM inventar norma jurídica. Quando a dúvida for complexa, exigir análise de um documento/matrícula específico, envolver risco jurídico relevante, ou ultrapassar o que a base cobre, você RECOMENDA o Especialista humano (Nível 2).\n\nVocê recebe: OBJETIVO (tipo da dúvida), TIPO_DOCUMENTO (se houver), DÚVIDA (texto do corretor) e BASE (regras aprovadas, cada linha "[code] título (category): trecho").\n\nResponda SOMENTE com um objeto JSON válido, sem nenhum texto antes ou depois, exatamente neste formato:\n{"resposta":"resposta clara e prática à dúvida, ancorada na BASE, em 2 a 5 parágrafos curtos; cite o code da base entre parênteses quando aplicável; português do Brasil","recomenda_humano":true}\n\nRegras:\n- Ancore a resposta na BASE; se algo não tiver respaldo na base, diga que é ponto para o especialista humano — NÃO invente.\n- "recomenda_humano" = true quando a dúvida for complexa, exigir leitura de documento específico, envolver risco/valor relevante, litígio, ou ser além da base; = false para dúvidas conceituais simples que a base já resolve.\n- NÃO inclua disclaimer no texto (o aplicativo já exibe um aviso fixo).\n- NÃO copie a base literalmente; seja prático e direto.\n- Se a DÚVIDA estiver vaga, peça os detalhes que faltam na "resposta" e use recomenda_humano=false.'

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

    var jsonString = rawContent
    var mdMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)```/i)
    if (mdMatch) {
      jsonString = mdMatch[1].trim()
    } else {
      var unclosedFence = jsonString.match(/```(?:json)?\s*([\s\S]+)/i)
      if (unclosedFence) {
        var ucBraceIdx = unclosedFence[1].indexOf('{')
        if (ucBraceIdx !== -1 && ucBraceIdx < 5) jsonString = unclosedFence[1].trim()
      }
    }
    jsonString = jsonString.replace(/^\uFEFF/, '').replace(/[\u200B-\u200D\uFEFF]/g, '')
    var fbIdx = jsonString.indexOf('{')
    if (fbIdx !== -1) {
      var fbDepth = 0
      var fbInStr = false
      var fbEsc = false
      var fbEnd = -1
      for (var fbi = fbIdx; fbi < jsonString.length; fbi++) {
        var fbc = jsonString.charAt(fbi)
        if (fbEsc) {
          fbEsc = false
          continue
        }
        if (fbc === '\\' && fbInStr) {
          fbEsc = true
          continue
        }
        if (fbc === '"') {
          fbInStr = !fbInStr
          continue
        }
        if (fbInStr) continue
        if (fbc === '{') fbDepth++
        else if (fbc === '}') {
          fbDepth--
          if (fbDepth === 0) {
            fbEnd = fbi
            break
          }
        }
      }
      if (fbEnd !== -1) jsonString = jsonString.substring(fbIdx, fbEnd + 1)
      else jsonString = jsonString.substring(fbIdx)
    }
    jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1')
    jsonString = jsonString.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g, '$1"$2"$3')
    var ciRepaired = []
    var ciInStr = false
    var ciEsc = false
    for (var cir = 0; cir < jsonString.length; cir++) {
      var cich = jsonString.charAt(cir)
      if (ciEsc) {
        ciRepaired.push(cich)
        ciEsc = false
        continue
      }
      if (cich === '\\' && ciInStr) {
        ciRepaired.push(cich)
        ciEsc = true
        continue
      }
      if (cich === '"') {
        ciInStr = !ciInStr
        ciRepaired.push(cich)
        continue
      }
      if (ciInStr) {
        if (cich === '\n') {
          ciRepaired.push('\\n')
          continue
        }
        if (cich === '\r') {
          ciRepaired.push('\\r')
          continue
        }
        if (cich === '\t') {
          ciRepaired.push('\\t')
          continue
        }
        if (cich.charCodeAt(0) < 32) {
          ciRepaired.push(' ')
          continue
        }
        ciRepaired.push(cich)
        continue
      }
      if (cich === '/' && cir + 1 < jsonString.length) {
        var cinc = jsonString.charAt(cir + 1)
        if (cinc === '/') {
          while (cir < jsonString.length && jsonString.charAt(cir) !== '\n') cir++
          continue
        }
        if (cinc === '*') {
          cir += 2
          while (
            cir < jsonString.length - 1 &&
            !(jsonString.charAt(cir) === '*' && jsonString.charAt(cir + 1) === '/')
          )
            cir++
          cir++
          continue
        }
      }
      ciRepaired.push(cich)
    }
    jsonString = ciRepaired.join('')

    var parsed
    try {
      parsed = JSON.parse(jsonString)
    } catch (err) {
      try {
        parsed = JSON.parse(jsonString.replace(/,(\s*[}\]])/g, '$1'))
      } catch (err2) {
        return e.json(500, {
          error: 'Não foi possível interpretar a resposta da IA. Tente novamente.',
        })
      }
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
