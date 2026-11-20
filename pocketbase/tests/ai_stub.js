// Só do teste: no Skip, `$ai` e os erros `SkipAi*` são globais. Aqui a IA é um servidor HTTP falso (TEST_AI_URL).
function SkipAiError(msg) {
  this.message = msg
  this.name = 'SkipAiError'
}
function SkipAiConfigError(msg) {
  this.message = msg
  this.name = 'SkipAiConfigError'
}
module.exports = {
  SkipAiError: SkipAiError,
  SkipAiConfigError: SkipAiConfigError,
  chat: function (req) {
    var res = $http.send({
      url: $os.getenv('TEST_AI_URL'),
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ model: req.model }),
      timeout: 10,
    })
    if (res.statusCode === 500) throw new SkipAiConfigError('config')
    if (res.statusCode !== 200) throw new SkipAiError('falha ' + res.statusCode)
    return res.json
  },
}
