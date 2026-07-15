import type { Negocio, NegocioParte } from '@/lib/negocios'

export interface ParteFormData {
  nome: string
  cpf: string
  rg: string
  nacionalidade: string
  estado_civil: string
  regime_bens: string
  profissao: string
  endereco: string
  email: string
  conjuge_de: string
  [key: string]: unknown
}

export function mapearParteParaForm(
  parte: NegocioParte,
  todasPartes: NegocioParte[],
  base: Record<string, unknown>,
): ParteFormData {
  const conjugeNome = parte.conjuge_de
    ? todasPartes.find((p) => p.id === parte.conjuge_de)?.nome || ''
    : ''

  return {
    ...base,
    nome: parte.nome || '',
    cpf: parte.cpf || '',
    rg: parte.rg || '',
    nacionalidade: parte.nacionalidade || 'brasileiro(a)',
    estado_civil: parte.estado_civil || '',
    regime_bens: parte.regime_bens || '',
    profissao: parte.profissao || '',
    endereco: parte.endereco || '',
    email: parte.email || '',
    conjuge_de: conjugeNome,
  }
}

export function prepararPartesParaForm(
  negocio: Negocio,
  emptyParty: Record<string, unknown>,
): {
  vendedores: ParteFormData[]
  compradores: ParteFormData[]
  anuentes: ParteFormData[]
} {
  const { partes } = negocio
  const vendedores = partes
    .filter((p) => p.role === 'vendedor')
    .map((p) => mapearParteParaForm(p, partes, emptyParty))
  const compradores = partes
    .filter((p) => p.role === 'comprador')
    .map((p) => mapearParteParaForm(p, partes, emptyParty))
  const anuentes = partes
    .filter((p) => p.role === 'anuente')
    .map((p) => mapearParteParaForm(p, partes, emptyParty))
  return { vendedores, compradores, anuentes }
}

export function mapearImovelParaForm(negocio: Negocio): Record<string, string> {
  const im = negocio.imovel
  return {
    imovel_descricao: im.descricao || '',
    imovel_endereco: im.endereco || '',
    imovel_bairro: im.bairro || '',
    imovel_cidade: im.cidade || '',
    imovel_uf: im.uf || '',
    imovel_cep: im.cep || '',
    imovel_matricula: im.matricula || '',
    imovel_rgi: im.rgi || '',
    imovel_iptu: im.iptu || '',
    imovel_fracao_ideal: im.fracao_ideal || '',
    imovel_vagas_qtd: im.vagas_qtd || '',
    imovel_vagas_descricao: im.vagas_descricao || '',
    imovel_origem_aquisicao: im.origem_aquisicao || '',
    imovel_origem_registro: im.origem_registro || '',
  }
}

export function aplicarNegocioComReplace(
  negocio: Negocio,
  emptyParty: Record<string, unknown>,
  replaces: {
    vendedores?: (items: ParteFormData[]) => void
    compradores?: (items: ParteFormData[]) => void
    anuentes?: (items: ParteFormData[]) => void
  },
  setFieldValue?: (name: string, value: unknown) => void,
): void {
  const { vendedores, compradores, anuentes } = prepararPartesParaForm(negocio, emptyParty)

  replaces.vendedores?.(vendedores)
  replaces.compradores?.(compradores)
  replaces.anuentes?.(anuentes)

  if (setFieldValue) {
    const imovelMap = mapearImovelParaForm(negocio)
    for (const [key, value] of Object.entries(imovelMap)) {
      setFieldValue(key, value)
    }
  }
}
