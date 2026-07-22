import type { UseFormReturn } from 'react-hook-form'
import type { Negocio, ParteNegocio } from '@/lib/negocios'
import type { PessoaExtraida, ImovelExtraido } from '@/lib/extraction-types'
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

function toParty(p: ParteNegocio) {
  return {
    _id: p._id,
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

// ============================================================================
// Documentos de partes PLANAS (um campo por lado, sem useFieldArray): recibo,
// autorização, promise, termo de chaves, termo de posse e checklist. Cada função
// pega a primeira parte de cada papel e escreve os campos via setValue. Passadas
// ao CarregarDeNegocio pela prop `aplicar`.
// ============================================================================

type SetValue = UseFormReturn<any>['setValue']

// Um campo por lado: se o negócio tiver 2 vendedores, entra o primeiro; o
// corretor edita o segundo na mão (esses documentos não têm partes múltiplas).
// Devolve ParteNegocio (não PessoaExtraida): quem chama precisa do `_id` para
// achar o anuente ligado a esta parte. ParteNegocio estende PessoaExtraida, então
// os usos que só leem os campos da pessoa continuam válidos.
function primeiraParte(
  negocio: Negocio,
  papel: 'vendedor' | 'comprador',
): ParteNegocio | undefined {
  return negocio.partes.find((p) => p.papel === papel)
}

// Qualificação em texto corrido: "brasileiro(a), casado(a), médico".
function montarQualificacaoPlana(p: PessoaExtraida): string {
  return [p.nacionalidade, normalizarEstadoCivil(p.estado_civil), p.profissao]
    .map((s) => (s || '').trim())
    .filter(Boolean)
    .join(', ')
}

// Resumo do imóvel numa linha (para o Checklist).
function resumoImovel(im: ImovelExtraido): string {
  return [
    im.descricao,
    im.endereco,
    [im.cidade, im.uf].filter(Boolean).join('/'),
    im.matricula ? `matrícula ${im.matricula}` : '',
  ]
    .map((s) => (s || '').trim())
    .filter(Boolean)
    .join(', ')
}

export function aplicarRecibo(setValue: SetValue, negocio: Negocio): void {
  const v = primeiraParte(negocio, 'vendedor')
  const c = primeiraParte(negocio, 'comprador')
  const im = negocio.imovel
  if (v) {
    setValue('vendedor_nome', v.nome || '')
    setValue('vendedor_nacionalidade', v.nacionalidade || 'brasileiro(a)')
    setValue('vendedor_estado_civil', normalizarEstadoCivil(v.estado_civil))
    setValue('vendedor_regime_bens', normalizarRegime(v.regime_bens))
    setValue('vendedor_profissao', v.profissao || '')
    setValue('vendedor_rg', v.rg || '')
    setValue('vendedor_cpf', v.cpf || '')
    setValue('vendedor_endereco', v.endereco || '')
  }
  if (c) {
    setValue('comprador_nome', c.nome || '')
    setValue('comprador_nacionalidade', c.nacionalidade || 'brasileiro(a)')
    setValue('comprador_estado_civil', normalizarEstadoCivil(c.estado_civil))
    setValue('comprador_regime_bens', normalizarRegime(c.regime_bens))
    setValue('comprador_profissao', c.profissao || '')
    setValue('comprador_rg', c.rg || '')
    setValue('comprador_cpf', c.cpf || '')
    setValue('comprador_endereco', c.endereco || '')
  }
  setValue('imovel_descricao', im.descricao || '')
  setValue('imovel_matricula', im.matricula || '')
  setValue('imovel_ri_numero', im.rgi || '')
  setValue('imovel_comarca', im.cidade || '')
  setValue('imovel_iptu', im.iptu || '')
}

export function aplicarPromise(setValue: SetValue, negocio: Negocio): void {
  const v = primeiraParte(negocio, 'vendedor')
  const c = primeiraParte(negocio, 'comprador')
  const im = negocio.imovel
  if (v) {
    setValue('vendedor_nome', v.nome || '')
    setValue('vendedor_nacionalidade', v.nacionalidade || 'brasileiro(a)')
    setValue('vendedor_estado_civil', normalizarEstadoCivil(v.estado_civil))
    setValue('vendedor_regime_bens', normalizarRegime(v.regime_bens))
    setValue('vendedor_profissao', v.profissao || '')
    setValue('vendedor_cpf', v.cpf || '')
    setValue('vendedor_endereco', v.endereco || '')
  }
  if (c) {
    setValue('comprador_nome', c.nome || '')
    setValue('comprador_nacionalidade', c.nacionalidade || 'brasileiro(a)')
    setValue('comprador_estado_civil', normalizarEstadoCivil(c.estado_civil))
    setValue('comprador_regime_bens', normalizarRegime(c.regime_bens))
    setValue('comprador_profissao', c.profissao || '')
    setValue('comprador_cpf', c.cpf || '')
    setValue('comprador_endereco', c.endereco || '')
  }
  // Cônjuge do VENDEDOR. O dossiê guarda o cônjuge como uma parte de papel
  // 'anuente' cujo `conjuge_de` é o `_id` do vendedor (ver negocios.ts) — é a
  // outorga uxória. Sem isto o corretor cadastra o cônjuge no dossiê e mesmo
  // assim redigita ele em TODA Simplificada.
  //
  // Só preenche quando o anuente tem nome E cpf: são exatamente os dois que o
  // `promiseSchema` exige quando `conjuge_vendedor_papel !== 'nenhum'`. Preencher
  // com um anuente incompleto deixaria o formulário INVÁLIDO e travaria a
  // geração do documento — pior que não preencher.
  //
  // O cônjuge do COMPRADOR não é preenchido porque o dossiê não o modela: o
  // `conjuge_de` aponta sempre para um vendedor (a tela do dossiê só oferece
  // vendedores no seletor). O corretor segue digitando esse à mão.
  if (v) {
    const conjuge = negocio.partes.find(
      (p) => p.papel === 'anuente' && p.conjuge_de === v._id && p.nome && p.cpf,
    )
    if (conjuge) {
      setValue('conjuge_vendedor_papel', 'anuente')
      setValue('conjuge_vendedor_nome', conjuge.nome)
      setValue('conjuge_vendedor_nacionalidade', conjuge.nacionalidade || 'brasileiro(a)')
      setValue('conjuge_vendedor_profissao', conjuge.profissao || '')
      setValue('conjuge_vendedor_cpf', conjuge.cpf)
      setValue('conjuge_vendedor_endereco', conjuge.endereco || '')
    }
  }
  setValue('imovel_descricao', im.descricao || '')
  setValue('imovel_endereco', im.endereco || '')
  setValue('imovel_matricula', im.matricula || '')
  setValue('imovel_cidade', im.cidade || '')
  setValue('imovel_estado', im.uf || '')
}

export function aplicarAutorizacao(setValue: SetValue, negocio: Negocio): void {
  const v = primeiraParte(negocio, 'vendedor')
  const im = negocio.imovel
  if (v) {
    setValue('contratante_nome', v.nome || '')
    setValue('contratante_cpf', v.cpf || '')
    setValue('contratante_orgao_emissor', v.orgao_emissor || '')
    if (v.email) setValue('contratante_email', v.email)
  }
  setValue('imovel_endereco', im.endereco || '')
  setValue('imovel_bairro', im.bairro || '')
  setValue('imovel_cidade', im.cidade || 'Rio de Janeiro')
  setValue('imovel_cep', im.cep || '')
  setValue('imovel_iptu', im.iptu || '')
  setValue('imovel_vagas', im.vagas_qtd || '')
  // condominio, quartos, telefone: o negócio não guarda — o corretor preenche.
}

export function aplicarChaves(setValue: SetValue, negocio: Negocio): void {
  const v = primeiraParte(negocio, 'vendedor')
  const c = primeiraParte(negocio, 'comprador')
  const im = negocio.imovel
  if (v) {
    setValue('entregante_nome', v.nome || '')
    setValue('entregante_qualificacao', montarQualificacaoPlana(v))
    setValue('entregante_documento', v.cpf || '')
  }
  if (c) {
    setValue('recebedor_nome', c.nome || '')
    setValue('recebedor_qualificacao', montarQualificacaoPlana(c))
    setValue('recebedor_documento', c.cpf || '')
  }
  setValue('imovel_descricao', im.descricao || '')
  setValue('imovel_matricula', im.matricula || '')
  setValue('imovel_ri_numero', im.rgi || '')
  setValue('imovel_comarca', im.cidade || '')
  setValue('imovel_iptu', im.iptu || '')
}

export function aplicarPosse(setValue: SetValue, negocio: Negocio): void {
  const v = primeiraParte(negocio, 'vendedor')
  const c = primeiraParte(negocio, 'comprador')
  const im = negocio.imovel
  if (v) {
    setValue('transmitente_nome', v.nome || '')
    setValue('transmitente_qualificacao', montarQualificacaoPlana(v))
    setValue('transmitente_rg', v.rg || '')
    setValue('transmitente_cpf', v.cpf || '')
    setValue('transmitente_endereco', v.endereco || '')
  }
  if (c) {
    setValue('recebedor_nome', c.nome || '')
    setValue('recebedor_qualificacao', montarQualificacaoPlana(c))
    setValue('recebedor_rg', c.rg || '')
    setValue('recebedor_cpf', c.cpf || '')
    setValue('recebedor_endereco', c.endereco || '')
  }
  setValue('imovel_descricao', im.descricao || '')
  setValue('imovel_matricula', im.matricula || '')
  setValue('imovel_ri_numero', im.rgi || '')
  setValue('imovel_comarca', im.cidade || '')
  setValue('imovel_iptu', im.iptu || '')
}

export function aplicarChecklist(setValue: SetValue, negocio: Negocio): void {
  const v = primeiraParte(negocio, 'vendedor')
  if (v) setValue('responsavel', v.nome || '')
  setValue('imovel_resumo', resumoImovel(negocio.imovel))
}

// ---------------------------------------------------------------------------
// C4 — volta pro dossiê. Tudo aqui é função pura: sem React, sem PocketBase.
// ---------------------------------------------------------------------------

/** Uma diferença já pronta para exibir no diálogo de confirmação. */
export type CampoAlterado = { rotulo: string; de: string; para: string }

/** Só o que mudou, chaveado pelo `_id` da parte. Chavear por id (e não devolver o
 *  array pronto) é o que permite aplicar este delta sobre QUALQUER versão do
 *  registro — inclusive uma mais nova que a carregada quando o diff rodou. */
export type PatchVolta = {
  partes: Record<string, Partial<ParteNegocio>>
  imovel: Partial<ImovelExtraido>
}

/** Delta de gravação + o que mudou, para o hook decidir se pergunta. */
export type ResultadoVolta = {
  patch: PatchVolta
  alteracoes: CampoAlterado[]
}

/** Os 10 campos que voltam 1:1. Fora daqui, nada é gravado. */
const CAMPOS_PARTE = [
  'nome',
  'nacionalidade',
  'estado_civil',
  'regime_bens',
  'profissao',
  'rg',
  'orgao_emissor',
  'cpf',
  'endereco',
  'email',
] as const

/** Os 14 campos do imóvel. No form vêm com o prefixo `imovel_`. */
const CAMPOS_IMOVEL = [
  'descricao',
  'endereco',
  'bairro',
  'cidade',
  'uf',
  'cep',
  'matricula',
  'rgi',
  'iptu',
  'fracao_ideal',
  'vagas_qtd',
  'vagas_descricao',
  'origem_aquisicao',
  'origem_registro',
] as const

const ROTULO_PARTE: Record<string, string> = {
  nome: 'Nome',
  nacionalidade: 'Nacionalidade',
  estado_civil: 'Estado civil',
  regime_bens: 'Regime de bens',
  profissao: 'Profissão',
  rg: 'RG',
  orgao_emissor: 'Órgão emissor',
  cpf: 'CPF',
  endereco: 'Endereço',
  email: 'E-mail',
}

// Papel da parte no rótulo do diálogo de consentimento: sem ele, duas partes
// homônimas (ou duas sem nome) ficam indistinguíveis na lista de alterações.
const ROTULO_PAPEL: Record<ParteNegocio['papel'], string> = {
  vendedor: 'vendedor(a)',
  comprador: 'comprador(a)',
  anuente: 'anuente',
}

const ROTULO_IMOVEL: Record<string, string> = {
  descricao: 'Descrição do imóvel',
  endereco: 'Endereço do imóvel',
  bairro: 'Bairro',
  cidade: 'Cidade',
  uf: 'UF',
  cep: 'CEP',
  matricula: 'Matrícula',
  rgi: 'RGI',
  iptu: 'IPTU',
  fracao_ideal: 'Fração ideal',
  vagas_qtd: 'Vagas (quantidade)',
  vagas_descricao: 'Vagas (descrição)',
  origem_aquisicao: 'Origem da aquisição',
  origem_registro: 'Registro da origem',
}

const txt = (v: unknown): string => (typeof v === 'string' ? v.trim() : '')

/** Acha uma linha de parte pelo _id, varrendo os grupos do form. */
function acharLinha(
  valores: Record<string, unknown>,
  grupos: readonly string[],
  id: string,
): Record<string, unknown> | undefined {
  for (const g of grupos) {
    const lista = valores[g]
    if (!Array.isArray(lista)) continue
    const achou = lista.find(
      (l) => l && typeof l === 'object' && (l as { _id?: string })._id === id,
    )
    if (achou) return achou as Record<string, unknown>
  }
  return undefined
}

/**
 * Compara o form de agora com o snapshot tirado logo após a carga.
 *
 * O snapshot é do FORM, não do Negócio: assim os defaults injetados na ida
 * (`nacionalidade || 'brasileiro(a)'`) estão dos dois lados e se cancelam,
 * e só sobra o que o corretor realmente digitou.
 *
 * Decisão (c): só atualiza parte que já existe. Linha sem `_id` (adicionada à
 * mão) é ignorada; parte removida no form continua no dossiê.
 */
export function calcularVolta(
  negocio: { partes: ParteNegocio[]; imovel: ImovelExtraido },
  snapshot: Record<string, unknown>,
  atual: Record<string, unknown>,
  grupos: readonly string[],
): ResultadoVolta {
  const alteracoes: CampoAlterado[] = []
  const patchPartes: Record<string, Partial<ParteNegocio>> = {}

  for (const parte of negocio.partes) {
    const antes = acharLinha(snapshot, grupos, parte._id)
    const agora = acharLinha(atual, grupos, parte._id)
    // Parte que não está no form (ou sumiu dele): não entra no patch, então
    // fica intacta no registro na hora de gravar.
    if (!antes || !agora) continue

    const patch: Partial<ParteNegocio> = {}
    for (const campo of CAMPOS_PARTE) {
      const de = txt(antes[campo])
      const para = txt(agora[campo])
      if (de === para) continue
      patch[campo] = para
      const identificacao = parte.nome ? ` ${parte.nome}` : ' (sem nome)'
      alteracoes.push({
        rotulo: `${ROTULO_PARTE[campo]} — ${ROTULO_PAPEL[parte.papel]}${identificacao}`,
        de,
        para,
      })
    }
    // Só entra quem realmente mudou: patch vazio no mapa faria o gravar
    // reescrever a parte sem necessidade.
    if (Object.keys(patch).length > 0) patchPartes[parte._id] = patch
  }

  const patchImovel: Partial<ImovelExtraido> = {}
  for (const campo of CAMPOS_IMOVEL) {
    const chave = `imovel_${campo}`
    const de = txt(snapshot[chave])
    const para = txt(atual[chave])
    if (de === para) continue
    patchImovel[campo] = para
    alteracoes.push({ rotulo: ROTULO_IMOVEL[campo], de, para })
  }

  return { patch: { partes: patchPartes, imovel: patchImovel }, alteracoes }
}

// ---------------------------------------------------------------------------
// C4 Lote 2 — volta pro dossiê nos documentos de partes PLANAS (recibo, promise).
// Gêmeo de calcularVolta: em vez de casar parte por _id, casa a 1ª parte de cada
// papel via um mapa por documento (campoDoNegócio -> campo PLANO do formulário).
// ---------------------------------------------------------------------------

/** Mapa campoDoNegócio -> nome do campo PLANO no formulário, por lado + imóvel.
 *  Chaves restritas a CAMPOS_PARTE/CAMPOS_IMOVEL: um typo (ex.: `enderec`) não
 *  compila, em vez de virar uma chave-lixo silenciosa no ResultadoVolta. */
export type ConfigVoltaPlano = {
  vendedor: Partial<Record<(typeof CAMPOS_PARTE)[number], string>>
  comprador: Partial<Record<(typeof CAMPOS_PARTE)[number], string>>
  imovel: Partial<Record<(typeof CAMPOS_IMOVEL)[number], string>>
}

/**
 * Diff form-vs-snapshot para documentos de partes planas. Casa a PRIMEIRA parte
 * de cada papel (decisão L2-a): se o negócio tem 2 vendedores, só o 1º volta — o
 * form plano nem mostra o 2º. Rótulo e regra de "só campo que mudou" idênticos ao
 * calcularVolta de array.
 */
export function calcularVoltaPlano(
  negocio: { partes: ParteNegocio[]; imovel: ImovelExtraido },
  snapshot: Record<string, unknown>,
  atual: Record<string, unknown>,
  config: ConfigVoltaPlano,
): ResultadoVolta {
  const alteracoes: CampoAlterado[] = []

  const primeiroV = negocio.partes.find((p) => p.papel === 'vendedor')
  const primeiroC = negocio.partes.find((p) => p.papel === 'comprador')

  // Monta o patch de UMA parte a partir do mapa {campoNegocio -> campoForm}.
  // Parte inexistente (negócio sem vendedor, p.ex.) -> patch vazio, nada volta.
  // Object.entries(mapa) tipa os pares como [chave-de-CAMPOS_PARTE, campoForm];
  // como `mapa` já é Partial<Record<CAMPOS_PARTE[number], string>>, `patch[campo]`
  // bate com Partial<ParteNegocio> sem precisar de cast no retorno.
  const diffParte = (
    parte: ParteNegocio | undefined,
    mapa: ConfigVoltaPlano['vendedor'],
  ): Partial<ParteNegocio> => {
    if (!parte) return {}
    const patch: Partial<ParteNegocio> = {}
    for (const [campo, campoForm] of Object.entries(mapa) as [
      (typeof CAMPOS_PARTE)[number],
      string,
    ][]) {
      const de = txt(snapshot[campoForm])
      const para = txt(atual[campoForm])
      if (de === para) continue
      patch[campo] = para
      const identificacao = parte.nome ? ` ${parte.nome}` : ' (sem nome)'
      alteracoes.push({
        rotulo: `${ROTULO_PARTE[campo]} — ${ROTULO_PAPEL[parte.papel]}${identificacao}`,
        de,
        para,
      })
    }
    return patch
  }

  const patchV = diffParte(primeiroV, config.vendedor)
  const patchC = diffParte(primeiroC, config.comprador)

  const patchImovel: Partial<Record<(typeof CAMPOS_IMOVEL)[number], string>> = {}
  for (const [campo, campoForm] of Object.entries(config.imovel) as [
    (typeof CAMPOS_IMOVEL)[number],
    string,
  ][]) {
    const de = txt(snapshot[campoForm])
    const para = txt(atual[campoForm])
    if (de === para) continue
    patchImovel[campo] = para
    alteracoes.push({ rotulo: ROTULO_IMOVEL[campo], de, para })
  }

  // Só a 1ª parte de cada papel entra no patch; as demais (2º vendedor,
  // anuentes) não são tocadas porque simplesmente não têm entrada aqui.
  const patchPartes: Record<string, Partial<ParteNegocio>> = {}
  if (primeiroV && Object.keys(patchV).length > 0) patchPartes[primeiroV._id] = patchV
  if (primeiroC && Object.keys(patchC).length > 0) patchPartes[primeiroC._id] = patchC

  return { patch: { partes: patchPartes, imovel: patchImovel }, alteracoes }
}

// Inverso de aplicarRecibo. Imóvel traduz rgi->ri_numero.
// ⚠️ A Comarca (imovel_comarca) NÃO volta, de propósito: comarca é o distrito
// judiciário, não o município — pode abranger várias cidades — e o negócio não
// tem campo `comarca`. Mapear `cidade: 'imovel_comarca'` (como já esteve aqui)
// grava a comarca como CIDADE do imóvel, e o updateNegocio troca o `imovel`
// inteiro: o erro vaza para todos os outros documentos. A ida (linha ~208)
// pré-preenche a comarca com a cidade, o que é inofensivo — o corretor
// sobrescreve. Não "restaure" esta linha.
export const MAPA_RECIBO: ConfigVoltaPlano = {
  vendedor: {
    nome: 'vendedor_nome',
    nacionalidade: 'vendedor_nacionalidade',
    estado_civil: 'vendedor_estado_civil',
    regime_bens: 'vendedor_regime_bens',
    profissao: 'vendedor_profissao',
    rg: 'vendedor_rg',
    cpf: 'vendedor_cpf',
    endereco: 'vendedor_endereco',
  },
  comprador: {
    nome: 'comprador_nome',
    nacionalidade: 'comprador_nacionalidade',
    estado_civil: 'comprador_estado_civil',
    regime_bens: 'comprador_regime_bens',
    profissao: 'comprador_profissao',
    rg: 'comprador_rg',
    cpf: 'comprador_cpf',
    endereco: 'comprador_endereco',
  },
  imovel: {
    descricao: 'imovel_descricao',
    matricula: 'imovel_matricula',
    rgi: 'imovel_ri_numero',
    iptu: 'imovel_iptu',
  },
}

// Inverso de aplicarPromise. Sem rg (a Simplificada não coleta). O regime_bens
// volta: o campo existe no form e é obrigatório para casado(a), e a ida também
// o preenche — sem os dois lados, o corretor redigitaria em todo documento.
// Imóvel: cidade->imovel_cidade, uf->imovel_estado, + endereco.
export const MAPA_SIMPLIFICADA: ConfigVoltaPlano = {
  vendedor: {
    nome: 'vendedor_nome',
    nacionalidade: 'vendedor_nacionalidade',
    estado_civil: 'vendedor_estado_civil',
    regime_bens: 'vendedor_regime_bens',
    profissao: 'vendedor_profissao',
    cpf: 'vendedor_cpf',
    endereco: 'vendedor_endereco',
  },
  comprador: {
    nome: 'comprador_nome',
    nacionalidade: 'comprador_nacionalidade',
    estado_civil: 'comprador_estado_civil',
    regime_bens: 'comprador_regime_bens',
    profissao: 'comprador_profissao',
    cpf: 'comprador_cpf',
    endereco: 'comprador_endereco',
  },
  imovel: {
    descricao: 'imovel_descricao',
    endereco: 'imovel_endereco',
    matricula: 'imovel_matricula',
    cidade: 'imovel_cidade',
    uf: 'imovel_estado',
  },
}
