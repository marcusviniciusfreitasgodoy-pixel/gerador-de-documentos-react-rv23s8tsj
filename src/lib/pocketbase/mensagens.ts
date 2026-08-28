import { ClientResponseError } from 'pocketbase'

/**
 * Mensagens de erro que o corretor lê.
 *
 * POR QUE ESTE ARQUIVO EXISTE, E NÃO O `errors.ts`
 *
 * A lógica abaixo morava em `src/lib/pocketbase/errors.ts`. Aquele arquivo
 * RETROCEDE SOZINHO no projeto do Skip: quatro vezes entre 27 e 28/08/2026 ele
 * voltou para uma versão antiga de 29 linhas, em rodadas que não pediam nada
 * sobre ele. A explicação mais provável, levantada pelo próprio agente do Skip,
 * é commit parcial a partir de um checkout desatualizado: a rodada grava o
 * arquivo pedido e leva junto a versão velha dos que não foram tocados.
 *
 * O QUE MUDA COM A MUDANÇA DE CASA
 *
 * Não é fuga do problema, é troca do MODO DE FALHAR. Com a lógica no
 * `errors.ts`, o retrocesso era MUDO: o app compilava, subia, e o corretor
 * voltava a ler `Unexpected token '<', "<html>"` na tela de login sem que nada
 * acusasse. Com a lógica aqui e o `errors.ts` apagado, um retrocesso que
 * ressuscite o arquivo antigo não afeta ninguém, porque ninguém o importa; e se
 * o retrocesso apagar ESTE arquivo, os 16 pontos que o importam quebram o build
 * na hora. Erro barulhento é melhor que erro silencioso.
 *
 * REGRA: NADA IMPORTA O `errors.ts`.
 *
 * Se ele reaparecer no projeto, é resíduo do retrocesso. Não importe, não
 * conserte, não "unifique com este arquivo". A duplicação do
 * `extractFieldErrors` aqui é deliberada: ela é o que faz este módulo não
 * depender de um arquivo que se sabe instável.
 */

export type FieldErrors = Record<string, string>

export function extractFieldErrors(error: unknown): FieldErrors {
  if (!(error instanceof ClientResponseError)) return {}
  const data = error.response?.data
  if (!data || typeof data !== 'object') return {}
  const errors: FieldErrors = {}
  for (const [field, detail] of Object.entries(data)) {
    if (
      detail &&
      typeof detail === 'object' &&
      'message' in detail &&
      typeof (detail as { message: unknown }).message === 'string'
    ) {
      errors[field] = (detail as { message: string }).message
    }
  }
  return errors
}

// Quando o servidor devolve HTML em vez de JSON (502 do gateway, instância
// reiniciando), o SDK estoura no parse e a mensagem que chega aqui é
// `Unexpected token '<', "<html>"`. Sem tratamento, é isso que o corretor lê na
// tela de login. Aconteceu em produção em 27/08/2026, numa queda passageira da
// infraestrutura, e a leitura natural de quem vê aquilo não é "o servidor caiu
// por um minuto", é "esse sistema está quebrado".
function pareceRespostaNaoJson(texto: string): boolean {
  const t = texto.toLowerCase()
  return (
    t.includes('unexpected token') ||
    t.includes('is not valid json') ||
    t.includes('json.parse') ||
    t.includes('<!doctype') ||
    t.includes('<html')
  )
}

// Mensagens que o PocketBase devolve em inglês e que o corretor encontra de
// verdade. Traduzir só estas, e não montar camada de tradução: o resto vem dos
// nossos próprios hooks, que já respondem em português.
const TRADUZIDAS: Record<string, string> = {
  'failed to authenticate.': 'E-mail ou senha não conferem.',
  'failed to create record.': 'Não foi possível criar o registro.',
  'failed to update record.': 'Não foi possível salvar as alterações.',
  'the request requires valid record authorization token to be set.':
    'Sua sessão expirou. Entre de novo.',
}

const SERVIDOR_FORA =
  'O serviço está fora do ar no momento. Isso costuma durar poucos minutos: tente de novo em instantes.'
const SEM_CONEXAO =
  'Não foi possível falar com o servidor. Verifique sua conexão e tente de novo em instantes.'
const INESPERADO = 'Algo deu errado. Tente de novo em instantes.'

export function getErrorMessage(error: unknown): string {
  // Erro que não é do SDK: rede caindo no meio, falha de parse solta.
  if (!(error instanceof ClientResponseError)) {
    if (error instanceof Error) {
      if (pareceRespostaNaoJson(error.message)) return SERVIDOR_FORA
      // TypeError de fetch é o que aparece quando o host não responde.
      if (error instanceof TypeError) return SEM_CONEXAO
      return error.message || INESPERADO
    }
    return INESPERADO
  }

  // O SDK cancela sozinho requisições duplicadas para a mesma rota (dois
  // cliques no mesmo botão, por exemplo). Devolver string vazia aqui deixaria
  // os pontos que chamam esta função mostrando um aviso em branco, que é pior
  // do que a frase errada. Então a frase diz o que fazer.
  if (error.isAbort) return 'O pedido foi interrompido. Tente de novo.'

  // Status 0 é o SDK dizendo que não chegou resposta nenhuma: host fora,
  // DNS, CORS ou rede do usuário.
  if (error.status === 0) return SEM_CONEXAO
  if (error.status >= 500) return SERVIDOR_FORA

  // O gateway pode devolver HTML com status < 500; aí a pista está na mensagem.
  if (pareceRespostaNaoJson(error.message || '')) return SERVIDOR_FORA

  const msgs = Object.values(extractFieldErrors(error))
  if (msgs.length > 0) return msgs.join(' ')

  const bruta = (error.message || '').trim()
  if (!bruta) return INESPERADO
  return TRADUZIDAS[bruta.toLowerCase()] ?? bruta
}
