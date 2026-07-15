import type { UseFormReturn } from 'react-hook-form'
import type { Negocio } from '@/lib/negocios'
import type { PessoaExtraida } from '@/lib/extraction-types'

// Os 4 formulários de promessa têm exatamente os mesmos arrays de partes e os
// mesmos 14 campos imovel_*. O distrato tem as mesmas partes, mas NÃO tem os
// campos do imóvel (só imovel_devolucao_descricao / imovel_desocupacao_prazo,
// que são da cláusula de devolução) — por isso a opção `imovel`.
export interface AplicarNegocioOpts {
  imovel: boolean
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

function toParty(p: PessoaExtraida): PartyValues {
  return {
    nome: p.nome || '',
    nacionalidade: p.nacionalidade || 'brasileiro(a)',
    estado_civil: p.estado_civil || '',
    regime_bens: p.regime_bens || '',
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
  replaceAnuentes(anuentes)

  if (!opts.imovel) return

  const im = negocio.imovel
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
