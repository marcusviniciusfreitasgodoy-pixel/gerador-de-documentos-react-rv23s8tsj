// Hook de extração — CHAMADA DIRETA (chaves próprias + custo transparente + IA de VISÃO + comparação de motor).
// NÃO usa o Skip AI Gateway ($ai). Chaves SEMPRE via $secrets.get — nunca hardcoded, nunca logadas.
// Payload do front: { motor: 'claude'|'gemini', images: [dataURL...], text: '' }
// Retorno: { pessoas:[...], imovel:{...}, meta:{ motor, usage:{in,out,modelo} } }
routerAdd(
  'POST',
  '/backend/v1/extrair-dados',
  (e) => {
    var body = e.requestInfo().body || {}
    var motor = (body.motor || body.model || 'claude').trim().toLowerCase()
    var images = Array.isArray(body.images) ? body.images : []
    var text = (body.text || body.document_text || '').trim()

    if (!images.length && !text) {
      return e.badRequestError('Forneça ao menos uma imagem ou texto.')
    }

    try {
      var anthropicKey = ($secrets.get('ANTHROPIC_API_KEY') || '').replace(/[^\x21-\x7E]/g, '')
      var geminiKey = ($secrets.get('GEMINI_API_KEY') || '').replace(/[^\x21-\x7E]/g, '')
      if (!anthropicKey && !geminiKey) {
        return e.json(503, { error: 'Nenhuma chave de IA configurada nos secrets.' })
      }

      var SYSTEM =
        'Você é um extrator de dados de documentos imobiliários brasileiros (escrituras, matrículas, RG, CNH, ' +
        'comprovantes). Leia e DEVOLVA SOMENTE um objeto JSON válido, sem markdown, sem texto antes ou depois, ' +
        'exatamente neste formato:\n' +
        '{"pessoas":[{"nome":"","nacionalidade":"","estado_civil":"","regime_bens":"","profissao":"","rg":"",' +
        '"orgao_emissor":"","cpf":"","endereco":"","email":"","_confianca":"alta|media|baixa"}],' +
        '"imovel":{"descricao":"","endereco":"","bairro":"","cidade":"","uf":"","cep":"","matricula":"","rgi":"",' +
        '"iptu":"","fracao_ideal":"","vagas_qtd":"","vagas_descricao":"","origem_aquisicao":"","origem_registro":"",' +
        '"_confianca":"alta|media|baixa"}}\n' +
        'REGRAS: campo não encontrado = "" (NUNCA invente/deduza CPF/RG/matrícula). Estado civil e regime de bens ' +
        'só se explícitos. Extraia TODAS as pessoas. CPF no formato 000.000.000-00. Comece com { e termine com }.'

      // parse dataURL -> {mime, data}
      function splitDataUrl(u) {
        var m = String(u).match(/^data:([^;]+);base64,([\s\S]*)$/)
        if (m) return { mime: m[1], data: m[2] }
        var idx = String(u).indexOf('base64,')
        return { mime: 'image/jpeg', data: idx >= 0 ? String(u).substring(idx + 7) : String(u) }
      }

      var usage = null

      function callClaude() {
        var parts = []
        if (text) parts.push({ type: 'text', text: 'Texto do documento (dica de OCR):\n' + text })
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
            model: 'claude-sonnet-5',
            // Sonnet 5 liga raciocinio adaptativo quando o campo e omitido; numa extracao
            // estruturada isso so consome o teto de tokens e trunca o JSON.
            thinking: { type: 'disabled' },
            max_tokens: 2048,
            system: SYSTEM,
            messages: [{ role: 'user', content: parts }],
          }),
          timeout: 120,
        })
        if (res.statusCode !== 200) throw new Error('Anthropic ' + res.statusCode)
        if (res.json.usage)
          usage = {
            in: res.json.usage.input_tokens,
            out: res.json.usage.output_tokens,
            modelo: 'claude-sonnet-5',
          }
        return res.json.content[0].text
      }

      function callGemini() {
        var parts = []
        if (text) parts.push({ text: 'Texto do documento (dica de OCR):\n' + text })
        for (var i = 0; i < images.length && i < 5; i++) {
          var d = splitDataUrl(images[i])
          parts.push({ inline_data: { mime_type: d.mime, data: d.data } })
        }
        parts.push({ text: 'Extraia os dados conforme o formato JSON.' })
        var res = $http.send({
          url:
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=' +
            geminiKey,
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM }] },
            contents: [{ role: 'user', parts: parts }],
            generationConfig: { temperature: 0, responseMimeType: 'application/json' },
          }),
          timeout: 120,
        })
        if (res.statusCode !== 200) throw new Error('Gemini ' + res.statusCode)
        var c = res.json.candidates && res.json.candidates[0]
        if (res.json.usageMetadata)
          usage = {
            in: res.json.usageMetadata.promptTokenCount,
            out: res.json.usageMetadata.candidatesTokenCount,
            modelo: 'gemini-3.1-flash-lite',
          }
        return c ? c.content.parts[0].text : ''
      }

      var raw = ''
      if (motor === 'gemini' && geminiKey) raw = callGemini()
      else if (anthropicKey) raw = callClaude()
      else if (geminiKey) raw = callGemini()
      else throw new Error('Motor sem chave disponível.')

      // isola/parseia o JSON (blindagem)
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

// Hook de extração de CONHECIMENTO — texto de um documento (contrato-modelo, cláusula
// avulsa, lei, deliberação, orientação de entidade) -> registros para a Base de Conhecimento.
// Payload: { texto: '', modo: 'documento'|'unico' }
// Retorno: { registros: [{ title, category, content }] } (SEM code; o cliente gera anti-colisão).
routerAdd(
  'POST',
  '/backend/v1/extrair-conhecimento',
  (e) => {
    var body = e.requestInfo().body || {}
    var texto = (body.texto || body.text || '').trim()
    var modo = (body.modo || 'documento').trim().toLowerCase()
    if (!texto) return e.badRequestError('Forneça o texto do documento.')

    try {
      var anthropicKey = ($secrets.get('ANTHROPIC_API_KEY') || '').replace(/[^\x21-\x7E]/g, '')
      if (!anthropicKey)
        return e.json(503, { error: 'Chave Anthropic não configurada nos secrets.' })

      var SYSTEM =
        'Você é um curador da BASE DE CONHECIMENTO jurídica de uma imobiliária no Brasil. Recebe o TEXTO de um ' +
        'documento — pode ser um CONTRATO-MODELO (minuta), uma CLÁUSULA avulsa, ou um DOCUMENTO NORMATIVO ' +
        '(lei, deliberação COFECI/CRECI, orientação de entidade). Transforme-o em REGISTROS de regra/cláusula ' +
        'para a base, que serve de régua para revisar minutas.\n\n' +
        'DEVOLVA SOMENTE um objeto JSON válido, sem markdown, sem texto antes ou depois, exatamente assim:\n' +
        '{"registros":[{"title":"","category":"","content":""}]}\n\n' +
        'REGRAS:\n' +
        '- MODO "documento": SEGMENTE em regras/cláusulas — UM registro por cláusula (contrato) ou por regra/' +
        'obrigação distinta (normativo). Não misture assuntos diferentes num só registro.\n' +
        '- MODO "unico": produza EXATAMENTE UM registro com o texto relevante.\n' +
        '- "title": nome curto e claro (ex.: "Outorga Conjugal", "Comissão de Corretagem", "Prazo de Vigência").\n' +
        '- "content": o TEXTO da regra/cláusula, fiel ao documento (pode enxugar o supérfluo, mas preserve a ' +
        'obrigação/condição). Se for norma, CITE A FONTE no início (ex.: "Deliberação COFECI nº 1.234/2023: ...", ' +
        '"Lei 6.530/1978, art. 20: ...", "Orientação CRECI-RJ: ...").\n' +
        '- "category": categoria curta (ex.: "Comissão", "Compliance", "Prazos", "Legislação", "Deliberação COFECI", ' +
        '"Orientação de entidade", "Garantias").\n' +
        '- NÃO invente code — não inclua esse campo.\n' +
        '- Só itens com valor normativo/contratual. Ignore preâmbulo, assinaturas e dados de exemplo.\n' +
        '- Português do Brasil. Comece com { e termine com }.'

      var res = $http.send({
        url: 'https://api.anthropic.com/v1/messages',
        method: 'POST',
        headers: {
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-5',
          thinking: { type: 'disabled' },
          max_tokens: 8192,
          system: SYSTEM,
          messages: [
            { role: 'user', content: 'MODO: ' + modo + '\n\nTEXTO DO DOCUMENTO:\n' + texto },
          ],
        }),
        timeout: 120,
      })
      if (res.statusCode !== 200) throw new Error('Anthropic ' + res.statusCode)
      var raw = res.json.content[0].text

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
          .error('extrair_conhecimento: JSON parse falhou', 'raw', String(raw).substring(0, 400))
        return e.json(500, { error: 'Não foi possível interpretar a resposta da IA.' })
      }
      if (!parsed || !Array.isArray(parsed.registros)) parsed = { registros: [] }
      parsed.registros = parsed.registros
        .filter((r) => r && String(r.content || '').trim())
        .map((r) => ({
          title: String(r.title || '').trim(),
          category: String(r.category || '').trim(),
          content: String(r.content || '').trim(),
        }))

      return e.json(200, parsed)
    } catch (err) {
      $app.logger().error('extrair_conhecimento: falha', 'error', String(err))
      return e.json(500, { error: 'Erro ao processar o documento.', detail: String(err) })
    }
  },
  $apis.requireAuth(),
)
