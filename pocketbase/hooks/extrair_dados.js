// Hook de extração — CHAMADA DIRETA (chaves próprias + custo transparente + IA de VISÃO + comparação de motor).
// NÃO usa o Skip AI Gateway ($ai). Chaves SEMPRE via $secrets.get — nunca hardcoded, nunca logadas.
// Payload do front: { motor: 'claude'|'gemini', images: [dataURL...], text: '' }
// Retorno: { pessoas:[...], imovel:{...}, meta:{ motor, usage:{in,out,modelo} } }

routerAdd(
  'POST',
  '/backend/v1/extrair-dados',
  (e) => {
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
        var rlEndpoint = 'extrair_dados'

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
              while (i < str.length - 1 && !(str.charAt(i) === '*' && str.charAt(i + 1) === '/'))
                i++
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

      // ── Loop de 2 tentativas ──────────────────────────────────────────
      var MAX_ATTEMPTS = 2
      var parsed = null
      var success = false

      for (var attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
          $app.logger().info('extrair_dados: tentativa ' + attempt + '/' + MAX_ATTEMPTS)
          var raw = ''
          if (motor === 'gemini' && geminiKey) raw = callGemini()
          else if (anthropicKey) raw = callClaude()
          else if (geminiKey) raw = callGemini()
          else throw new Error('Motor sem chave disponível.')

          if (!raw || !raw.trim()) {
            $app.logger().error('extrair_dados: tentativa ' + attempt + ' resposta vazia')
            continue
          }

          var parseResult = parseAiResponse(raw)
          if (!parseResult) {
            $app
              .logger()
              .error(
                'extrair_dados: tentativa ' + attempt + ' parse JSON falhou',
                'raw',
                String(raw).substring(0, 400),
              )
            continue
          }

          parsed = parseResult
          success = true
          $app.logger().info('extrair_dados: tentativa ' + attempt + ' sucesso')
          break
        } catch (callErr) {
          $app
            .logger()
            .error('extrair_dados: tentativa ' + attempt + ' falhou', 'error', String(callErr))
          if (attempt === MAX_ATTEMPTS) throw callErr
        }
      }

      if (!success || !parsed) {
        return e.json(500, { error: 'Não foi possível interpretar a resposta da IA.' })
      }

      if (typeof parsed !== 'object') parsed = {}
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
    // Guarda server-side do 'approved' (mesma regua da rota acima).
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
        var rlEndpoint = 'extrair_conhecimento'

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

      function callAnthropic() {
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
        return res.json.content[0].text
      }

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
              while (i < str.length - 1 && !(str.charAt(i) === '*' && str.charAt(i + 1) === '/'))
                i++
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

      // ── Loop de 2 tentativas ──────────────────────────────────────────
      var MAX_ATTEMPTS = 2
      var parsed = null
      var success = false

      for (var attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
          $app.logger().info('extrair_conhecimento: tentativa ' + attempt + '/' + MAX_ATTEMPTS)
          var raw = callAnthropic()

          if (!raw || !raw.trim()) {
            $app.logger().error('extrair_conhecimento: tentativa ' + attempt + ' resposta vazia')
            continue
          }

          var parseResult = parseAiResponse(raw)
          if (!parseResult) {
            $app
              .logger()
              .error(
                'extrair_conhecimento: tentativa ' + attempt + ' parse JSON falhou',
                'raw',
                String(raw).substring(0, 400),
              )
            continue
          }

          parsed = parseResult
          success = true
          $app.logger().info('extrair_conhecimento: tentativa ' + attempt + ' sucesso')
          break
        } catch (callErr) {
          $app
            .logger()
            .error(
              'extrair_conhecimento: tentativa ' + attempt + ' falhou',
              'error',
              String(callErr),
            )
          if (attempt === MAX_ATTEMPTS) throw callErr
        }
      }

      if (!success || !parsed) {
        return e.json(500, { error: 'Não foi possível interpretar a resposta da IA.' })
      }

      if (typeof parsed !== 'object' || !Array.isArray(parsed.registros)) parsed = { registros: [] }
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

// ============================================================================
// E-mails de notificação (SMTP já validado pelo fluxo de reset de senha).
// Regras: envio SEMPRE em try/catch com logger (e-mail falhando não pode
// quebrar o cadastro nem a proposta) e nada de travessão nos textos.
// ============================================================================

// Novo cadastro -> avisa os admins (são eles que ligam o `approved`).
onRecordAfterCreateSuccess((e) => {
  try {
    var novo = e.record
    var admins = $app.findRecordsByFilter('users', 'isAdmin = true', '', 10, 0)
    var meta = $app.settings().meta
    for (var i = 0; i < admins.length; i++) {
      var adminEmail = admins[i].email()
      if (!adminEmail) continue
      var msg = new MailerMessage({
        from: { address: meta.senderAddress, name: meta.senderName },
        to: [{ address: adminEmail }],
        subject:
          'Novo cadastro no Gerador de Documentos: ' + (novo.getString('name') || novo.email()),
        html:
          '<p>Um novo usuário se cadastrou no Gerador de Documentos.</p>' +
          '<p><strong>Nome:</strong> ' +
          (novo.getString('name') || '(sem nome)') +
          '<br><strong>E-mail:</strong> ' +
          novo.email() +
          '</p>' +
          '<p>O acesso libera sozinho quando ele confirmar o e-mail. Este aviso é só para acompanhamento.</p>',
      })
      $app.newMailClient().send(msg)
    }
  } catch (err) {
    $app.logger().error('email novo cadastro: falha no envio', 'error', String(err))
  }
  e.next()
}, 'users')

// Nova proposta do especialista -> avisa o corretor dono da solicitação.
onRecordAfterCreateSuccess((e) => {
  try {
    var proposta = e.record
    var reqId = proposta.getString('request')
    if (reqId) {
      var solicitacao = $app.findRecordById('expert_support_requests', reqId)
      var donoId = solicitacao.getString('user')
      if (donoId) {
        var dono = $app.findRecordById('users', donoId)
        var donoEmail = dono.email()
        if (donoEmail) {
          var meta = $app.settings().meta
          var link = 'https://gerador-de-documentos-react-85e34.goskip.app/especialista/' + reqId
          var msg = new MailerMessage({
            from: { address: meta.senderAddress, name: meta.senderName },
            to: [{ address: donoEmail }],
            subject: 'Você recebeu uma proposta do Especialista',
            html:
              '<p>Olá' +
              (dono.getString('name') ? ', ' + dono.getString('name') : '') +
              '!</p>' +
              '<p>Sua solicitação de suporte especializado recebeu uma proposta. Entre no app para ver o escopo, o prazo e o valor, e para aceitar ou recusar.</p>' +
              '<p><a href="' +
              link +
              '">Ver a proposta</a></p>',
          })
          $app.newMailClient().send(msg)
        }
      }
    }
  } catch (err) {
    $app.logger().error('email proposta: falha no envio', 'error', String(err))
  }
  e.next()
}, 'expert_proposals')

// ============================================================================
// Identidade dos e-mails transacionais (decisão do Marcus, 2026-07-24):
// os e-mails de verificação e de reset saem em português, com a cara da
// Prime Circle (Ink #0E0E0E, Ouro #C9A84C, Marfim). Em vez de怪 template
// nas settings (o PB do Skip ignora a gravação), interceptamos o ENVIO e
// trocamos assunto e corpo na hora. O link original é extraído do corpo padrão.
// O HTML é duplicado nos dois handlers de propósito: handlers do JSVM são
// isolados e não enxergam função de fora.
// ============================================================================
onMailerRecordVerificationSend((e) => {
  try {
    var m = String(e.message.html || '').match(/href="([^"]+)"/)
    if (m) {
      e.message.subject = 'Confirme seu e-mail | Prime Circle Docs'
      e.message.html =
        '<div style="margin:0;padding:32px 16px;background:#0E0E0E;">' +
        '<div style="max-width:480px;margin:0 auto;background:#FAF6EE;border-radius:12px;overflow:hidden;">' +
        '<div style="padding:28px 32px 0 32px;">' +
        '<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:3px;color:#C9A84C;font-weight:bold;">PRIME CIRCLE</p>' +
        '<p style="margin:2px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:2px;color:#8A8578;">D O C U M E N T O S</p>' +
        '</div>' +
        '<div style="padding:20px 32px 32px 32px;">' +
        '<h1 style="margin:0 0 12px 0;font-family:Georgia,\'Times New Roman\',serif;font-size:26px;font-weight:normal;color:#0E0E0E;">Confirme seu e-mail</h1>' +
        '<p style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:#3A372F;">Que bom ter você no Prime Circle Docs!</p>' +
        '<p style="margin:0 0 24px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:#3A372F;">Falta um passo: clique no botão abaixo para confirmar o seu e-mail. O acesso libera na hora.</p>' +
        '<a href="' +
        m[1] +
        '" target="_blank" rel="noopener" style="display:inline-block;background:#0E0E0E;color:#C9A84C;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;line-height:44px;padding:0 28px;border-radius:8px;">Confirmar e liberar acesso</a>' +
        '<p style="margin:24px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#8A8578;">Se você não criou esta conta, ignore este e-mail.</p>' +
        '</div>' +
        '<div style="padding:14px 32px;background:#F1EBDD;">' +
        '<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#8A8578;">Prime Circle Docs</p>' +
        '</div>' +
        '</div>' +
        '</div>'
    }
  } catch (err) {
    $app.logger().error('email verificacao: personalizacao falhou', 'error', String(err))
  }
  e.next()
})

onMailerRecordPasswordResetSend((e) => {
  try {
    var m = String(e.message.html || '').match(/href="([^"]+)"/)
    if (m) {
      e.message.subject = 'Redefinir sua senha | Prime Circle Docs'
      e.message.html =
        '<div style="margin:0;padding:32px 16px;background:#0E0E0E;">' +
        '<div style="max-width:480px;margin:0 auto;background:#FAF6EE;border-radius:12px;overflow:hidden;">' +
        '<div style="padding:28px 32px 0 32px;">' +
        '<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:3px;color:#C9A84C;font-weight:bold;">PRIME CIRCLE</p>' +
        '<p style="margin:2px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:2px;color:#8A8578;">D O C U M E N T O S</p>' +
        '</div>' +
        '<div style="padding:20px 32px 32px 32px;">' +
        '<h1 style="margin:0 0 12px 0;font-family:Georgia,\'Times New Roman\',serif;font-size:26px;font-weight:normal;color:#0E0E0E;">Redefinir sua senha</h1>' +
        '<p style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:#3A372F;">Recebemos um pedido para redefinir a senha da sua conta.</p>' +
        '<p style="margin:0 0 24px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:#3A372F;">Clique no botão abaixo para escolher uma senha nova.</p>' +
        '<a href="' +
        m[1] +
        '" target="_blank" rel="noopener" style="display:inline-block;background:#0E0E0E;color:#C9A84C;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;line-height:44px;padding:0 28px;border-radius:8px;">Escolher nova senha</a>' +
        '<p style="margin:24px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#8A8578;">Se não foi você, ignore este e-mail: sua senha continua a mesma.</p>' +
        '</div>' +
        '<div style="padding:14px 32px;background:#F1EBDD;">' +
        '<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#8A8578;">Prime Circle Docs</p>' +
        '</div>' +
        '</div>' +
        '</div>'
    }
  } catch (err) {
    $app.logger().error('email reset: personalizacao falhou', 'error', String(err))
  }
  e.next()
})

// Novo chamado (sugestão/correção/suporte/dúvida) -> avisa os admins.
onRecordAfterCreateSuccess((e) => {
  try {
    var chamado = e.record
    var autorId = chamado.getString('user')
    var autorTxt = autorId
    if (autorId) {
      try {
        var autor = $app.findRecordById('users', autorId)
        autorTxt = (autor.getString('name') || '') + ' (' + autor.email() + ')'
      } catch (err2) {}
    }
    var admins = $app.findRecordsByFilter('users', 'isAdmin = true', '', 10, 0)
    var meta = $app.settings().meta
    // Link direto para a tela de resposta. Antes o e-mail mandava editar o
    // registro no painel do PocketBase; o /admin do app existe desde 27/08/2026
    // e responde com resposta, status e encerramento na mesma tela.
    var baseUrl = ''
    try {
      baseUrl = String(meta.appURL || '')
    } catch (_) {
      baseUrl = ''
    }
    if (!baseUrl) baseUrl = 'https://www.documentos.primecircle.app.br'
    baseUrl = baseUrl.replace(/\/+$/, '')
    var linkChamado = baseUrl + '/chamados/' + chamado.id
    for (var i = 0; i < admins.length; i++) {
      var adminEmail = admins[i].email()
      if (!adminEmail) continue
      var msg = new MailerMessage({
        from: { address: meta.senderAddress, name: meta.senderName },
        to: [{ address: adminEmail }],
        subject: 'Novo chamado no Prime Circle Docs: ' + chamado.getString('tipo'),
        html:
          '<p>Chegou um chamado novo na plataforma.</p>' +
          '<p><strong>Tipo:</strong> ' +
          chamado.getString('tipo') +
          '<br><strong>De:</strong> ' +
          autorTxt +
          '</p>' +
          '<p style="white-space:pre-wrap;border-left:3px solid #C9A84C;padding-left:12px;">' +
          chamado.getString('mensagem') +
          '</p>' +
          '<p><a href="' +
          linkChamado +
          '">Abrir o chamado para responder</a></p>' +
          '<p style="font-size:12px;color:#8A8578;">A fila completa fica no Painel, no menu do Prime Circle Docs. O corretor acompanha a resposta na página Ajuda e Suporte.</p>',
      })
      $app.newMailClient().send(msg)
    }
  } catch (err) {
    $app.logger().error('email chamado: falha no envio', 'error', String(err))
  }
  e.next()
}, 'chamados')

// ============================================================================
// Exclusão de usuário em cascata (decisão do Marcus, 2026-07-24).
// PROBLEMA: várias coleções apontam para o usuário com relação OBRIGATÓRIA e
// sem cascade (validation_audit.user_id, broker_profile.user, negocios.owner,
// chamados.user). Isso faz o banco RECUSAR apagar qualquer usuário que já
// tenha dados, e o painel do Skip mostra "excluído" de forma enganosa. O editor
// de campos do Skip não expõe a opção de cascade, então resolvemos por hook.
// Este hook roda ANTES de excluir o usuário (vale inclusive para o delete do
// painel/superuser) e apaga os dados dele primeiro, liberando a exclusão. É o
// comportamento correto de "apagar a conta" para a LGPD: some o usuário, somem
// os dados. Usa as MESMAS APIs já provadas no purge de retenção.
onRecordDelete((e) => {
  try {
    var uid = e.record.id

    // Propostas dependem das solicitações (proposta.request é obrigatória e sem
    // cascade), então apagamos as propostas antes das solicitações do usuário.
    try {
      var reqs = $app.findRecordsByFilter('expert_support_requests', 'user = {:id}', '', 200, 0, {
        id: uid,
      })
      for (var ri = 0; ri < reqs.length; ri++) {
        try {
          var props = $app.findRecordsByFilter('expert_proposals', 'request = {:rid}', '', 200, 0, {
            rid: reqs[ri].id,
          })
          for (var pi = 0; pi < props.length; pi++) $app.delete(props[pi])
        } catch (perr) {
          $app.logger().error('cascade user: propostas', 'error', String(perr))
        }
        $app.delete(reqs[ri])
      }
    } catch (rerr) {
      $app.logger().error('cascade user: solicitacoes', 'error', String(rerr))
    }

    // A trilha de acesso (fase 1) aponta para `negocios` com relação
    // OBRIGATÓRIA e sem cascade. Uma linha dessas é criada pelo GESTOR da
    // imobiliária, não pelo dono do negócio, então ela não some pelo filtro
    // por usuário logo abaixo: sem apagá-la aqui, o banco recusa excluir os
    // negócios e a exclusão da conta trava no meio.
    try {
      var meusNegocios = $app.findRecordsByFilter('negocios', 'owner = {:id}', '', 500, 0, {
        id: uid,
      })
      for (var mnI = 0; mnI < meusNegocios.length; mnI++) {
        try {
          for (var alRodada = 0; alRodada < 20; alRodada++) {
            var acessos = $app.findRecordsByFilter('access_logs', 'negocio = {:n}', '', 200, 0, {
              n: meusNegocios[mnI].id,
            })
            if (!acessos.length) break
            for (var acI = 0; acI < acessos.length; acI++) $app.delete(acessos[acI])
          }
        } catch (alErr) {
          $app.logger().error('cascade user: access_logs por negocio', 'error', String(alErr))
        }
      }
    } catch (negErr) {
      $app.logger().error('cascade user: leitura de negocios', 'error', String(negErr))
    }

    // Demais coleções que referenciam o usuário direto. A mesma coleção pode
    // aparecer mais de uma vez, uma linha por campo que aponta para `users`.
    // Todas as relações da camada de imobiliárias (fases 1 e 3) são required e
    // sem cascade: se não entrarem nesta lista, o banco RECUSA apagar a conta e
    // o painel mostra "excluído" de forma enganosa. `access_logs` e as duas
    // coleções de equipe vêm ANTES de `negocios`, que é do que elas dependem.
    var alvos = [
      ['validation_audit', 'user_id'],
      ['validation_logs', 'user'],
      ['access_logs', 'user'],
      ['agency_invites', 'agency'],
      ['agency_invites', 'member'],
      ['agency_invites', 'convidado_por'],
      ['agency_members', 'agency'],
      ['agency_members', 'member'],
      ['broker_profile', 'user'],
      ['negocios', 'owner'],
      ['chamados', 'user'],
    ]
    for (var ai = 0; ai < alvos.length; ai++) {
      var col = alvos[ai][0]
      var campo = alvos[ai][1]
      try {
        for (var rodada = 0; rodada < 20; rodada++) {
          var filhos = $app.findRecordsByFilter(col, campo + ' = {:id}', '', 200, 0, { id: uid })
          if (!filhos.length) break
          for (var fi = 0; fi < filhos.length; fi++) $app.delete(filhos[fi])
        }
      } catch (cerr) {
        $app.logger().error('cascade user: ' + col, 'error', String(cerr))
      }
    }
  } catch (err) {
    $app.logger().error('cascade user delete falhou', 'error', String(err))
  }
  e.next()
}, 'users')
