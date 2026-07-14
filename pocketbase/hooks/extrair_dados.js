// Hook de extração usando o Skip AI Gateway.
routerAdd(
  'POST',
  '/backend/v1/extrair-dados',
  (e) => {
    try {
      var body = e.requestInfo().body || {}
      var motor = (body.model || body.motor || 'fast').trim().toLowerCase()
      var text = (body.document_text || body.text || '').trim()

      if (!text) {
        return e.badRequestError('O texto do documento está vazio ou não foi fornecido.')
      }

      var SYSTEM =
        'Você é um extrator de dados de documentos imobiliários brasileiros (escrituras, matrículas, RG, CNH, ' +
        'comprovantes). Leia e DEVOLVA SOMENTE um objeto JSON válido, sem markdown, sem texto antes ou depois, ' +
        'exatamente neste formato:\n' +
        '{"pessoas":[{"nome":"","nacionalidade":"","estado_civil":"","regime_bens":"","profissao":"","rg":"",' +
        '"orgao_emissor":"","cpf":"","endereco":"","_confianca":"alta|media|baixa"}],' +
        '"imovel":{"descricao":"","endereco":"","bairro":"","cidade":"","uf":"","cep":"","matricula":"","rgi":"",' +
        '"iptu":"","fracao_ideal":"","vagas_qtd":"","vagas_descricao":"","origem_aquisicao":"","origem_registro":"","_confianca":"alta|media|baixa"}}\n' +
        'REGRAS: campo não encontrado = "" (NUNCA invente/deduza CPF/RG/matrícula). Estado civil e regime só se ' +
        'explícitos. Extraia TODAS as pessoas. CPF no formato 000.000.000-00. Comece com { e termine com }.'

      // Mapeia nomes antigos (claude/gemini) ou tiers para o AI gateway
      var aiModel = motor === 'reasoning' ? 'reasoning' : 'fast'

      var reply = $ai.chat({
        model: aiModel,
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: 'Texto do documento:\n' + text },
        ],
      })

      var raw = reply.choices[0].message.content

      var s = String(raw || '')
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim()
      var a = s.indexOf('{')
      var b = s.lastIndexOf('}')
      if (a === -1 || b === -1 || b < a) {
        return e.badRequestError('A IA não retornou um formato JSON válido.')
      }
      s = s.substring(a, b + 1).replace(/,(\s*[}\]])/g, '$1')

      var parsed
      try {
        parsed = JSON.parse(s)
      } catch (perr) {
        $app
          .logger()
          .error('extrair_dados: JSON parse falhou', 'raw', String(raw).substring(0, 400))
        return e.badRequestError('Falha ao processar o formato dos dados extraídos.')
      }

      if (!parsed || typeof parsed !== 'object') parsed = {}
      if (!Array.isArray(parsed.pessoas)) parsed.pessoas = []
      if (!parsed.imovel || typeof parsed.imovel !== 'object') parsed.imovel = {}
      parsed.meta = { motor: aiModel, usage: reply.usage }

      return e.json(200, parsed)
    } catch (err) {
      $app.logger().error('extrair_dados: falha', 'error', String(err))
      if (err && (err.name === 'SkipAiConfigError' || String(err).includes('SkipAiConfigError'))) {
        return e.json(503, {
          error: 'Serviço de IA temporariamente indisponível (não configurado).',
        })
      }
      if (err && (err.name === 'SkipAiError' || String(err).includes('SkipAiError'))) {
        return e.json(err.status || 502, {
          error:
            'Falha na comunicação com a IA. Verifique se o conteúdo é legível e tente novamente.',
        })
      }
      // Retorna 422 (Unprocessable Entity) invés do 500 genérico, detalhando falha de processamento
      return e.json(422, { error: 'Erro não esperado ao processar a extração do documento.' })
    }
  },
  $apis.requireAuth(),
)
