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
      const isDup = p.cpf
        ? pessoas.some((x) => x.cpf === p.cpf)
        : p.nome
          ? pessoas.some((x) => x.nome === p.nome)
          : false
      if (!isDup) pessoas.push(p)
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
