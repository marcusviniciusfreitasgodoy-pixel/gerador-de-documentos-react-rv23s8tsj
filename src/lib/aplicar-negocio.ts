import type { UseFormReturn } from 'react-hook-form'
import type { Negocio } from '@/lib/negocios'
import type { PessoaExtraida } from '@/lib/extraction-types'
import { normalizarEstadoCivil, normalizarRegime } from '@/lib/form-helpers'

// `replaceVendedores`/`replaceCompradores` significam "lado vendedor / lado
// comprador" — cada form decide qual array recebe (promessa: vendedores/
// compradores; proposta: proprietarios/proponentes; permuta: primeiros/segundos).
//   imovel      : promessas/proposta = 14 campos planos imovel_*; distrato = false.
//   imovelSlot  : permuta = escreve nos campos aninhados imovel_a.*/imovel_b.*.
//   incluirAnuentes : default true; proposta passa false (o anuente do dossiê é
//                     cônjuge do vendedor, que não encaixa no anuente da proposta).
export interface AplicarNegocioOpts {
  imovel: boolean
  imovelSlot?: 'a' | 'b'
  incluirAnuentes?: boolean
}

interface PartyValues {
  nome: string
  nacionalidade: string
  estado_civil: string
  regime_bens: string
  profissao: string
  rg: string
  orgao_emissor: string
  cpf: string
  endereco: string
  email: string
}

const emptyParty: PartyValues = {
  nome: '',
  nacionalidade: 'brasileiro(a)',
  estado_civil: '',
  regime_bens: '',
  profissao: '',
  rg: '',
  orgao_emissor: '',
  cpf: '',
  endereco: '',
  email: '',
}

// normalizarEstadoCivil / normalizarRegime agora vivem em @/lib/form-helpers
// (fonte única, compartilhada com o auto-preencher da à vista).

function toParty(p: PessoaExtraida): PartyValues {
  return {
    nome: p.nome || '',
    nacionalidade: p.nacionalidade || 'brasileiro(a)',
    estado_civil: normalizarEstadoCivil(p.estado_civil),
    regime_bens: normalizarRegime(p.regime_bens),
    profissao: p.profissao || '',
    rg: p.rg || '',
    orgao_emissor: p.orgao_emissor || '',
    cpf: p.cpf || '',
    endereco: p.endereco || '',
    email: p.email || '',
  }
}

export interface AplicarNegocioDeps {
  setValue: UseFormReturn<any>['setValue']
  replaceVendedores: (v: any[]) => void
  replaceCompradores: (v: any[]) => void
  replaceAnuentes: (v: any[]) => void
}

export function aplicarNegocio(
  deps: AplicarNegocioDeps,
  negocio: Negocio,
  opts: AplicarNegocioOpts,
): void {
  const { setValue, replaceVendedores, replaceCompradores, replaceAnuentes } = deps

  const vendedoresNegocio = negocio.partes.filter((p) => p.papel === 'vendedor')
  const vendedores = vendedoresNegocio.map(toParty)
  const compradores = negocio.partes.filter((p) => p.papel === 'comprador').map(toParty)
  const anuentes = negocio.partes
    .filter((p) => p.papel === 'anuente')
    .map((p) => {
      // O negócio guarda o _id do vendedor em conjuge_de; o formulário e o
      // .docx esperam o NOME ("cônjuge do vendedor {conjuge_de}"). Traduz o id
      // de volta para o nome; se não achar, fica em branco.
      const vendedor = vendedoresNegocio.find((v) => v._id === p.conjuge_de)
      return { ...toParty(p), conjuge_de: vendedor?.nome || '' }
    })

  // Substitui (não anexa) — senão duplica o que já estiver no formulário.
  // O schema exige ao menos um vendedor e um comprador: se o negócio não
  // tiver, entra uma parte em branco para o usuário preencher.
  // Usa os `replace` do useFieldArray (NÃO setValue): os formulários renderizam
  // as linhas a partir de vendedorFields/compradorFields/anuenteFields — arrays
  // que só o `replace` do useFieldArray atualiza. `setValue` mudaria o estado
  // do formulário sem re-renderizar essas linhas (e a seção de anuentes, que só
  // aparece quando `anuenteFields.length > 0`, nunca apareceria).
  replaceVendedores(vendedores.length ? vendedores : [{ ...emptyParty }])
  replaceCompradores(compradores.length ? compradores : [{ ...emptyParty }])
  if (opts.incluirAnuentes !== false) replaceAnuentes(anuentes)

  if (!opts.imovel) return

  const im = negocio.imovel

  // Permuta: dois imóveis aninhados. O corretor escolhe o slot (A ou B); o imóvel
  // do negócio entra ali e o outro fica em branco (o negócio só traz um imóvel).
  if (opts.imovelSlot) {
    const p = `imovel_${opts.imovelSlot}`
    setValue(`${p}.descricao`, im.descricao || '')
    setValue(`${p}.endereco`, im.endereco || '')
    setValue(`${p}.bairro`, im.bairro || '')
    setValue(`${p}.cidade`, im.cidade || '')
    setValue(`${p}.uf`, im.uf || '')
    setValue(`${p}.cep`, im.cep || '')
    setValue(`${p}.matricula`, im.matricula || '')
    setValue(`${p}.rgi`, im.rgi || '')
    setValue(`${p}.iptu`, im.iptu || '')
    setValue(`${p}.fracao_ideal`, im.fracao_ideal || '')
    setValue(`${p}.vagas_qtd`, im.vagas_qtd || '')
    setValue(`${p}.vagas_descricao`, im.vagas_descricao || '')
    return
  }

  setValue('imovel_descricao', im.descricao || '')
  setValue('imovel_endereco', im.endereco || '')
  setValue('imovel_bairro', im.bairro || '')
  setValue('imovel_cidade', im.cidade || '')
  setValue('imovel_uf', im.uf || '')
  setValue('imovel_cep', im.cep || '')
  setValue('imovel_matricula', im.matricula || '')
  setValue('imovel_rgi', im.rgi || '')
  setValue('imovel_iptu', im.iptu || '')
  setValue('imovel_fracao_ideal', im.fracao_ideal || '')
  setValue('imovel_vagas_qtd', im.vagas_qtd || '')
  setValue('imovel_vagas_descricao', im.vagas_descricao || '')
  setValue('imovel_origem_aquisicao', im.origem_aquisicao || '')
  setValue('imovel_origem_registro', im.origem_registro || '')
}
