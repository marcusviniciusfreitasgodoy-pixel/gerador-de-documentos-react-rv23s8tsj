// Hook de extração — CHAMADA DIRETA (suas chaves + custo transparente + comparação de motor).
routerAdd(
  'POST',
  '/backend/v1/extrair-dados',
  (e) => {
    var body = e.requestInfo().body || {}
    var motor = (body.motor || 'claude').trim().toLowerCase()
    var images = Array.isArray(body.images) ? body.images : []
    var text = (body.text || '').trim()

    if (!images.length && !text) {
      return e.badRequestError('Forneça ao menos uma imagem ou texto.')
    }

    try {
      var anthropicKey = ($secrets.get('ANTHROPIC_API_KEY') || '').replace(/[^\x21-\x7E]/g, '')
      var geminiKey = ($secrets.get('GEMINI_API_KEY') || '').replace(/[^\x21-\x7E]/g, '')
      var openaiKey = ($secrets.get('OPENAI_API_KEY') || '').replace(/[^\x21-\x7E]/g, '')
      if (!anthropicKey && !geminiKey && !openaiKey) {
        return e.json(503, { error: 'Nenhuma chave de IA configurada nos secrets.' })
      }

      var SYSTEM =
        'Você é um extrator de dados de documentos imobiliários brasileiros (escrituras, matrículas, RG, CNH, ' +
        'comprovantes). Leia e DEVOLVA SOMENTE um objeto JSON válido, sem markdown, sem texto antes ou depois, ' +
        'exatamente neste formato:\n' +
        '{"pessoas":[{"nome":"","nacionalidade":"","estado_civil":"","regime_bens":"","profissao":"","rg":"",' +
        '"orgao_emissor":"","cpf":"","endereco":"","_confianca":"alta|media|baixa"}],' +
        '"imovel":{"descricao":"","endereco":"","bairro":"","cidade":"","uf":"","cep":"","matricula":"","rgi":"",' +
        '"iptu":"","fracao_ideal":"","vagas":"","_confianca":"alta|media|baixa"}}\n' +
        'REGRAS: campo não encontrado = "" (NUNCA invente/deduza CPF/RG/matrícula). Estado civil e regime só se ' +
        'explícitos. Extraia TODAS as pessoas. CPF no formato 000.000.000-00. Comece com { e termine com }.'

      function splitDataUrl(u) {
        var m = String(u).match(/^data:([^;]+);base64,([\s\S]*)$/)
        if (m) return { mime: m[1], data: m[2] }
        var idx = String(u).indexOf('base64,')
        return { mime: 'image/jpeg', data: idx >= 0 ? String(u).substring(idx + 7) : String(u) }
      }

      var usage = null

      function callClaude() {
        var parts = []
        if (text) parts.push({ type: 'text', text: 'Texto do documento:\n' + text })
        for (var i = 0; i < images.length && i < 5; i++) {
          var d = splitDataUrl(images[i])
          parts.push({
            type: 'image',
            source: { type: 'base64', media_type: d.mime, data: d.data },
          })
        }
        parts.push({ type: 'text', text: 'Extraia os dados conforme o formato JSON.' })
        var res = $http.send({
          url: 'https://api.anthropic.com/v1/messages',
          method: 'POST',
          headers: {
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-latest',
            max_tokens: 2048,
            system: SYSTEM,
            messages: [{ role: 'user', content: parts }],
          }),
          timeout: 90,
        })
        if (res.statusCode !== 200) throw new Error('Anthropic ' + res.statusCode)
        if (res.json.usage)
          usage = {
            in: res.json.usage.input_tokens,
            out: res.json.usage.output_tokens,
            modelo: 'claude-3-5-sonnet',
          }
        return res.json.content[0].text
      }

      function callGemini() {
        var parts = []
        if (text) parts.push({ text: 'Texto do documento:\n' + text })
        for (var i = 0; i < images.length && i < 5; i++) {
          var d = splitDataUrl(images[i])
          parts.push({ inline_data: { mime_type: d.mime, data: d.data } })
        }
        parts.push({ text: 'Extraia os dados conforme o formato JSON.' })
        var res = $http.send({
          url:
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' +
            geminiKey,
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM }] },
            contents: [{ role: 'user', parts: parts }],
            generationConfig: { temperature: 0, responseMimeType: 'application/json' },
          }),
          timeout: 90,
        })
        if (res.statusCode !== 200) throw new Error('Gemini ' + res.statusCode)
        var c = res.json.candidates && res.json.candidates[0]
        if (res.json.usageMetadata)
          usage = {
            in: res.json.usageMetadata.promptTokenCount,
            out: res.json.usageMetadata.candidatesTokenCount,
            modelo: 'gemini-1.5-flash',
          }
        return c ? c.content.parts[0].text : ''
      }

      var raw = ''
      if (motor === 'gemini' && geminiKey) raw = callGemini()
      else if (anthropicKey) raw = callClaude()
      else if (geminiKey) raw = callGemini()
      else throw new Error('Motor sem chave disponível.')

      var s = String(raw || '')
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim()
      var a = s.indexOf('{')
      var b = s.lastIndexOf('}')
      if (a === -1 || b === -1 || b < a)
        return e.json(500, { error: 'Não foi possível interpretar a resposta da IA.' })
      s = s.substring(a, b + 1).replace(/,(\s*[}\]])/g, '$1')

      var parsed
      try {
        parsed = JSON.parse(s)
      } catch (perr) {
        $app
          .logger()
          .error('extrair_dados: JSON parse falhou', 'raw', String(raw).substring(0, 400))
        return e.json(500, { error: 'Não foi possível interpretar a resposta da IA.' })
      }
      if (!parsed || typeof parsed !== 'object') parsed = {}
      if (!Array.isArray(parsed.pessoas)) parsed.pessoas = []
      if (!parsed.imovel || typeof parsed.imovel !== 'object') parsed.imovel = {}
      parsed.meta = { motor: motor, usage: usage }

      return e.json(200, parsed)
    } catch (err) {
      $app.logger().error('extrair_dados: falha', 'error', String(err))
      return e.json(500, { error: 'Erro ao processar os documentos.', detail: String(err) })
    }
  },
  $apis.requireAuth(),
)
