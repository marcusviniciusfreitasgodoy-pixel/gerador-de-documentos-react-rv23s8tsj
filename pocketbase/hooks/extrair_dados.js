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

    var body = e.requestInfo().body || {}
    var motor = (body.motor || body.model || 'claude').trim().toLowerCase()
    var images = Array.isArray(body.images) ? body.images : []
    var text = (body.text || body.document_text || '').trim()

    if (!images.length && !text) {
      return e.badRequestError('Forneça ao menos uma imagem ou texto.')
    }
    // Teto de tamanho (revisão de segurança SEC-03): limita custo e abuso.
    if (text.length > 60000) {
      return e.badRequestError('Texto muito longo (limite de 60.000 caracteres).')
    }
    var tamImagens = 0
    for (var ti = 0; ti < images.length; ti++) {
      var imgStr = String(images[ti] || '')
      if (imgStr.length > 7500000) {
        return e.badRequestError('Imagem muito grande (limite de ~5 MB por imagem).')
      }
      tamImagens += imgStr.length
    }
    if (tamImagens > 20000000) {
      return e.badRequestError('Conjunto de imagens muito grande (limite de ~15 MB no total).')
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

    var body = e.requestInfo().body || {}
    var texto = (body.texto || body.text || '').trim()
    var modo = (body.modo || 'documento').trim().toLowerCase()
    if (!texto) return e.badRequestError('Forneça o texto do documento.')
    if (texto.length > 60000) {
      return e.badRequestError('Texto muito longo (limite de 60.000 caracteres).')
    }

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
// Prime Circle (Ink #0E0E0E, Ouro #C9A84C, Marfim). Em vez de gravar template
// nas settings (o PB do Skip ignora a gravação), interceptamos o ENVIO e
// trocamos assunto e corpo na hora. O link original é extraído do corpo padrão.
// O HTML é duplicado nos dois handlers de propósito: handlers do JSVM são
// isolados e não enxergam função de fora.
// ============================================================================
onMailerRecordVerificationSend((e) => {
  try {
    var m = String(e.message.html || '').match(/href="([^"]+)"/)
    if (m) {
      e.message.subject = 'Confirme seu e-mail | Prime Circle Documentos'
      e.message.html =
        '<div style="margin:0;padding:32px 16px;background:#0E0E0E;">' +
        '<div style="max-width:480px;margin:0 auto;background:#FAF6EE;border-radius:12px;overflow:hidden;">' +
        '<div style="padding:28px 32px 0 32px;">' +
        '<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:3px;color:#C9A84C;font-weight:bold;">PRIME CIRCLE</p>' +
        '<p style="margin:2px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:2px;color:#8A8578;">D O C U M E N T O S</p>' +
        '</div>' +
        '<div style="padding:20px 32px 32px 32px;">' +
        '<h1 style="margin:0 0 12px 0;font-family:Georgia,\'Times New Roman\',serif;font-size:26px;font-weight:normal;color:#0E0E0E;">Confirme seu e-mail</h1>' +
        '<p style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:#3A372F;">Que bom ter você no Prime Circle Documentos!</p>' +
        '<p style="margin:0 0 24px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:#3A372F;">Falta um passo: clique no botão abaixo para confirmar o seu e-mail. O acesso libera na hora.</p>' +
        '<a href="' +
        m[1] +
        '" target="_blank" rel="noopener" style="display:inline-block;background:#0E0E0E;color:#C9A84C;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;line-height:44px;padding:0 28px;border-radius:8px;">Confirmar e liberar acesso</a>' +
        '<p style="margin:24px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#8A8578;">Se você não criou esta conta, ignore este e-mail.</p>' +
        '</div>' +
        '<div style="padding:14px 32px;background:#F1EBDD;">' +
        '<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#8A8578;">Prime Circle Documentos</p>' +
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
      e.message.subject = 'Redefinir sua senha | Prime Circle Documentos'
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
        '<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#8A8578;">Prime Circle Documentos</p>' +
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
    for (var i = 0; i < admins.length; i++) {
      var adminEmail = admins[i].email()
      if (!adminEmail) continue
      var msg = new MailerMessage({
        from: { address: meta.senderAddress, name: meta.senderName },
        to: [{ address: adminEmail }],
        subject: 'Novo chamado no Gerador de Documentos: ' + chamado.getString('tipo'),
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
          '<p>Para responder: painel Skip Cloud, coleção chamados, campo resposta (e o status, se quiser). O corretor acompanha na página Ajuda e Suporte.</p>',
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

    // Demais coleções que referenciam o usuário direto.
    var alvos = [
      ['validation_audit', 'user_id'],
      ['validation_logs', 'user'],
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
