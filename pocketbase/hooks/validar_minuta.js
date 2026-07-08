routerAdd(
  'POST',
  '/backend/v1/validar-minuta',
  (e) => {
    const body = e.requestInfo().body || {}
    const documentText = (body.document_text || '').trim()
    const documentType = (body.document_type || 'Genérico').trim()

    if (!documentText) {
      return e.badRequestError('O texto do documento é obrigatório.')
    }

    let knowledgeRecords = []
    try {
      knowledgeRecords = $app.findRecordsByFilter('legal_knowledge', '1=1', '-priority', 0, 0)
    } catch (err) {
      return e.json(500, { error: 'Falha ao buscar a base de conhecimento.' })
    }

    let baseLines = []
    for (let i = 0; i < knowledgeRecords.length; i++) {
      const rec = knowledgeRecords[i]
      var code = rec.getString('code') || 'SEM_CODE'
      var title = rec.getString('title') || ''
      var category = rec.getString('category') || ''
      var triggerLogic = rec.getString('trigger_logic') || ''
      var content = rec.getString('content') || ''
      if (content.length > 700) {
        content = content.substring(0, 700)
      }
      baseLines.push(
        '[' + code + '] ' + title + ' (' + category + ' | ' + triggerLogic + '): ' + content,
      )
    }

    var baseStr = baseLines.join('\n')

    var systemPrompt =
      'Você é um revisor jurídico especializado em contratos e documentos imobiliários no Brasil, a serviço de um corretor/imobiliária. Sua função é ANALISAR e APONTAR — você NUNCA redige, reescreve ou inventa texto de cláusula, e NUNCA cria norma jurídica. A única autoridade é a BASE DE CONHECIMENTO (regras e cláusulas aprovadas da empresa) fornecida na mensagem. Você verifica a MINUTA contra essa base e ancora cada observação no código (code) da regra correspondente.\n\nVocê recebe:\n- TIPO_DOCUMENTO: o tipo declarado da minuta (pode ser "Genérico").\n- BASE: lista de regras/cláusulas aprovadas, cada linha no formato "[code] título (category | trigger_logic): trecho do conteúdo".\n- MINUTA: o texto integral do documento a validar.\n\nResponda SOMENTE com um objeto JSON válido, sem nenhum texto antes ou depois, exatamente neste formato:\n{\n  "resumo": "2 a 4 frases com a visão geral da qualidade da minuta e os principais pontos de atenção",\n  "conformidade": [\n    {"code": "CODIGO_DA_BASE", "titulo": "título da regra", "status": "presente|faltando|fraco", "observacao": "objetivo, específico à minuta"}\n  ],\n  "riscos": [\n    {"gravidade": "alto|medio|baixo", "descricao": "o risco concreto para as partes", "base_code": "CODIGO_DA_BASE"}\n  ],\n  "recomendacoes": [\n    {"texto": "o que adicionar ou ajustar (aponte a regra/modelo, NÃO escreva o texto da cláusula)", "base_code": "CODIGO_DA_BASE"}\n  ]\n}\n\nRegras de conduta:\n- Ancore CADA item numa regra da BASE (campo code/base_code). Se um ponto não tiver respaldo na BASE, NÃO o inclua — não invente.\n- "conformidade": para cada cláusula/regra ESSENCIAL ao TIPO_DOCUMENTO presente na BASE, classifique como "presente", "faltando" ou "fraco", com observação objetiva referindo-se à minuta.\n- "riscos": aponte o que expõe as partes, com a gravidade.\n- "recomendacoes": diga o que fazer, citando SEMPRE o code do modelo/regra na base — jamais escreva o texto da cláusula.\n- Seja específico à MINUTA (pode citar trechos curtos entre aspas). Não copie a base literalmente.\n- Não use conhecimento externo à BASE para afirmar obrigações; a BASE é a régua.\n- Português do Brasil. Se a MINUTA estiver vazia ou ilegível, retorne resumo explicando e listas vazias.'

    var userMessage =
      'TIPO_DOCUMENTO: ' + documentType + '\n\nBASE:\n' + baseStr + '\n\nMINUTA:\n' + documentText

    var aiResult
    try {
      aiResult = $ai.chat({
        model: 'fast',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
      })
    } catch (err) {
      if (err instanceof SkipAiConfigError) {
        return e.json(503, { error: 'Serviço de IA temporariamente indisponível.' })
      }
      if (err instanceof SkipAiError) {
        return e.json(502, { error: 'Falha na comunicação com o serviço de IA.' })
      }
      return e.json(500, { error: 'Erro inesperado ao processar a análise.' })
    }

    var rawContent = ''
    try {
      rawContent = aiResult.choices[0].message.content
    } catch (err) {
      return e.json(500, { error: 'Resposta da IA em formato inesperado.' })
    }

    var jsonString = rawContent
    var mdMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (mdMatch) {
      jsonString = mdMatch[1].trim()
    }

    var firstBrace = jsonString.indexOf('{')
    var lastBrace = jsonString.lastIndexOf('}')
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonString = jsonString.substring(firstBrace, lastBrace + 1)
    }

    var parsed
    try {
      parsed = JSON.parse(jsonString)
    } catch (err) {
      return e.json(500, {
        error: 'Não foi possível interpretar a resposta da IA. Tente novamente.',
      })
    }

    return e.json(200, parsed)
  },
  $apis.requireAuth(),
)
