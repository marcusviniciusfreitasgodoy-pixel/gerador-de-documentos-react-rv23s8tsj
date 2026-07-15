export type ExtractionMotor = 'claude' | 'gemini' | 'tesseract'

export interface PessoaExtraida {
  nome: string
  cpf: string
  rg: string
  orgao_emissor: string
  nacionalidade: string
  estado_civil: string
  regime_bens: string
  profissao: string
  endereco: string
  email: string
  _confianca: 'alta' | 'media' | 'baixa'
  _fonte: string
}

export interface ImovelExtraido {
  descricao: string
  endereco: string
  bairro: string
  cidade: string
  uf: string
  cep: string
  matricula: string
  rgi: string
  iptu: string
  fracao_ideal: string
  vagas_qtd: string
  vagas_descricao: string
  origem_aquisicao: string
  origem_registro: string
  _confianca: 'alta' | 'media' | 'baixa'
}

export interface ExtracaoUsage {
  in: number
  out: number
  modelo: string
}

export interface ExtracaoMeta {
  motor: string
  usage: ExtracaoUsage | null
}

export interface ExtracaoResult {
  pessoas: PessoaExtraida[]
  imovel: ImovelExtraido
  meta?: ExtracaoMeta
}

export type PessoaRole = 'vendedor' | 'comprador' | 'anuente' | 'ignorar'

export type BatchFileStatus = 'pending' | 'extracting' | 'sending' | 'completed' | 'error'

export interface BatchFileItem {
  file: File
  status: BatchFileStatus
  statusLabel: string
  error?: string
  result?: ExtracaoResult
}

export const emptyPessoa: PessoaExtraida = {
  nome: '',
  cpf: '',
  rg: '',
  orgao_emissor: '',
  nacionalidade: 'brasileiro(a)',
  estado_civil: '',
  regime_bens: '',
  profissao: '',
  endereco: '',
  email: '',
  _confianca: 'baixa',
  _fonte: 'desconhecido',
}

export const emptyImovel: ImovelExtraido = {
  descricao: '',
  endereco: '',
  bairro: '',
  cidade: '',
  uf: '',
  cep: '',
  matricula: '',
  rgi: '',
  iptu: '',
  fracao_ideal: '',
  vagas_qtd: '',
  vagas_descricao: '',
  origem_aquisicao: '',
  origem_registro: '',
  _confianca: 'baixa',
}

const CONFIDENCE_RANK: Record<string, number> = { alta: 3, media: 2, baixa: 1 }

export const soDigitos = (s: string) => (s || '').replace(/\D/g, '')

export const normNome = (s: string) =>
  (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()

// Regra de fus\u00e3o ESTRITA (decis\u00e3o do dono do produto): uma fus\u00e3o errada gruda
// o CPF de uma pessoa no nome de outra e faz uma parte sumir, silenciosamente,
// dentro de um contrato assinado. Um duplicado vis\u00edvel no painel \u00e9 prefer\u00edvel.
//
//   - Ambos t\u00eam CPF: s\u00f3 o CPF decide.
//   - S\u00f3 um dos dois tem CPF: a identidade \u00e9 incerta. N\u00c3O funde.
//   - Nenhum dos dois tem CPF: o nome normalizado \u00e9 o \u00fanico sinal dispon\u00edvel.
//
// Exportada de prop\u00f3sito: \u00e9 a \u00daNICA regra de identidade de pessoa no sistema.
// `negocios.ts` reusa esta fun\u00e7\u00e3o em vez de reimplementar "mesma pessoa".
export function mesmaPessoa(a: PessoaExtraida, b: PessoaExtraida): boolean {
  const ca = soDigitos(a.cpf)
  const cb = soDigitos(b.cpf)
  if (ca && cb) return ca === cb
  if (ca || cb) return false
  const na = normNome(a.nome)
  const nb = normNome(b.nome)
  return !!na && na === nb
}

export function fundirPessoa(a: PessoaExtraida, b: PessoaExtraida): PessoaExtraida {
  const out: PessoaExtraida = { ...a }
  const campos: (keyof PessoaExtraida)[] = [
    'nome',
    'cpf',
    'rg',
    'orgao_emissor',
    'nacionalidade',
    'estado_civil',
    'regime_bens',
    'profissao',
    'endereco',
    'email',
  ]
  for (const c of campos) {
    if (!out[c] && b[c]) (out[c] as string) = b[c] as string
  }
  if (CONFIDENCE_RANK[b._confianca] > CONFIDENCE_RANK[out._confianca]) {
    out._confianca = b._confianca
  }
  if (!out._fonte && b._fonte) out._fonte = b._fonte
  return out
}

export function mergeResults(results: ExtracaoResult[]): ExtracaoResult {
  const pessoas: PessoaExtraida[] = []
  const imovel: ImovelExtraido = { ...emptyImovel }
  let meta: ExtracaoMeta | undefined

  for (const result of results) {
    if (result.meta) {
      if (!meta) {
        meta = {
          motor: result.meta.motor,
          usage: result.meta.usage ? { ...result.meta.usage } : null,
        }
      } else if (result.meta.usage) {
        if (!meta.usage) meta.usage = { ...result.meta.usage }
        else {
          meta.usage.in += result.meta.usage.in
          meta.usage.out += result.meta.usage.out
        }
      }
    }
    for (const p of result.pessoas) {
      const idx = pessoas.findIndex((x) => mesmaPessoa(x, p))
      if (idx === -1) pessoas.push({ ...p })
      else pessoas[idx] = fundirPessoa(pessoas[idx], p)
    }
    const keys = Object.keys(imovel) as (keyof ImovelExtraido)[]
    for (const key of keys) {
      if (key === '_confianca') {
        if (CONFIDENCE_RANK[result.imovel._confianca] > CONFIDENCE_RANK[imovel._confianca]) {
          imovel._confianca = result.imovel._confianca
        }
      } else if (!imovel[key] && result.imovel[key]) {
        imovel[key] = result.imovel[key]
      }
    }
  }

  return { pessoas, imovel, meta }
}
