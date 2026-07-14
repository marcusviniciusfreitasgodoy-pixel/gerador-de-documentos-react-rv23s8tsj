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

export interface ExtracaoResult {
  pessoas: PessoaExtraida[]
  imovel: ImovelExtraido
}

export type PessoaRole = 'vendedor' | 'comprador' | 'anuente' | 'ignorar'

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
