routerAdd(
  'POST',
  '/backend/v1/extrair-dados',
  (e) => {
    var body = e.requestInfo().body || {}
    var motor = (body.motor || 'claude').trim()
    var images = Array.isArray(body.images) ? body.images : []
    var text = (body.text || '').trim()

    if (!images.length && !text) {
      return e.badRequestError('Forneça ao menos uma imagem ou texto.')
    }

    var systemPrompt =
      'Você é um especialista em extrair dados estruturados de documentos imobiliários brasileiros (contratos, escrituras, matrículas, certidões).\n\nAnalise o documento e extraia TODAS as informações sobre pessoas e imóvel.\n\nCRITICAL: Retorne APENAS um objeto JSON válido. Sem markdown, sem texto antes ou depois. O JSON deve começar com { e terminar com }.\n\nFormato:\n{\n  "pessoas": [\n    {\n      "nome": "nome completo",\n      "cpf": "000.000.000-00",\n      "rg": "número do RG",\n      "orgao_emissor": "órgão emissor",\n      "nacionalidade": "brasileiro(a)",\n      "estado_civil": "Solteiro(a)/Casado(a)/etc",\n      "regime_bens": "Comunhão parcial/etc ou vazio",\n      "profissao": "profissão",\n      "endereco": "endereço completo",\n      "email": "email ou vazio",\n      "_confianca": "alta|media|baixa",\n      "_fonte": "vendedor|comprador|anuente|desconhecido"\n    }\n  ],\n  "imovel": {\n    "descricao": "descrição do imóvel",\n    "endereco": "endereço",\n    "bairro": "bairro",\n    "cidade": "cidade",\n    "uf": "UF",\n    "cep": "00000-000",\n    "matricula": "número matrícula",\n    "rgi": "RGI/cartório",\n    "iptu": "inscrição IPTU",\n    "fracao_ideal": "fração ideal",\n    "vagas_qtd": "qtd vagas",\n    "vagas_descricao": "descrição vagas",\n    "origem_aquisicao": "origem aquisição",\n    "origem_registro": "registro origem",\n    "_confianca": "alta|media|baixa"\n  }\n}\n\nRegras:\n- Se um campo não existir, use "".\n- Extraia TODAS as pessoas (vendedores, compradores, cônjuges).\n- _confianca: alta=claramente visível, media=parcial, baixa=inferido.\n- _fonte: identifique o papel pela contexto do documento.\n- CPF sempre no formato 000.000.000-00. CNPJ no campo cpf se for empresa.\n- NÃO use code blocks markdown. NÃO adicione texto extra.'

    var contentParts = []
    if (text) {
      contentParts.push({ type: 'text', text: 'Texto extraído do documento:\n\n' + text })
    }
    for (var i = 0; i < images.length && i < 5; i++) {
      contentParts.push({ type: 'image_url', image_url: { url: images[i] } })
    }
    contentParts.push({
      type: 'text',
      text: 'Extraia todos os dados estruturados conforme o formato JSON especificado.',
    })

    var rawContent = ''
    try {
      var aiResult = $ai.chat({
        model: 'fast',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: contentParts },
        ],
      })
      if (!aiResult || !aiResult.choices || !aiResult.choices[0]) {
        return e.json(500, { error: 'Resposta da IA em formato inesperado.' })
      }
      rawContent = aiResult.choices[0].message.content || ''
    } catch (err) {
      $app.logger().error('extrair_dados: AI call failed', 'error', String(err), 'motor', motor)
      if (err instanceof SkipAiConfigError) {
        return e.json(503, { error: 'Serviço de IA temporariamente indisponível.' })
      }
      if (err instanceof SkipAiError) {
        return e.json(502, { error: 'Falha na comunicação com o serviço de IA.' })
      }
      return e.json(500, { error: 'Erro inesperado ao processar extração.' })
    }

    if (!rawContent.trim()) {
      return e.json(500, { error: 'A IA retornou uma resposta vazia.' })
    }

    var jsonString = rawContent.replace(/^\uFEFF/, '').replace(/[\u200B-\u200D\uFEFF]/g, '')
    var mdMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (mdMatch) jsonString = mdMatch[1].trim()
    var firstBrace = jsonString.indexOf('{')
    var lastBrace = jsonString.lastIndexOf('}')
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonString = jsonString.substring(firstBrace, lastBrace + 1)
    }
    jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1').replace(/[\x00-\x1F\x7F]/g, '')

    var parsed
    try {
      parsed = JSON.parse(jsonString)
    } catch (parseErr) {
      try {
        var fixedJson = jsonString.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g, '$1"$2"$3')
        parsed = JSON.parse(fixedJson)
      } catch (parseErr2) {
        $app
          .logger()
          .error(
            'extrair_dados: JSON parse failed',
            'error',
            String(parseErr2),
            'raw',
            rawContent.substring(0, 500),
          )
        return e.json(500, { error: 'Não foi possível interpretar a resposta da IA.' })
      }
    }

    if (!parsed || typeof parsed !== 'object') parsed = {}
    if (!Array.isArray(parsed.pessoas)) parsed.pessoas = []
    if (!parsed.imovel || typeof parsed.imovel !== 'object') parsed.imovel = {}

    return e.json(200, parsed)
  },
  $apis.requireAuth(),
)
