import {
  listNegocios,
  createNegocio,
  updateNegocio,
  mesclarPartes,
  novaParte,
} from '@/lib/negocios'
import type { Negocio, ParteNegocio, PapelParte } from '@/lib/negocios'
import { mergeResults, emptyImovel } from '@/lib/extraction-types'
import type { ImovelExtraido, PessoaExtraida } from '@/lib/extraction-types'

/**
 * Criacao automatica do negocio no ato da geracao do documento.
 *
 * POR QUE ISTO EXISTE
 *
 * Ate aqui, gerar documento nunca exigiu negocio: todo formulario trava so em
 * `hasBroker` e o `CarregarDeNegocio` e conveniencia opcional. Isso deixa dois
 * buracos ao mesmo tempo:
 *
 *   1. Quem gera avulso PERDE o historico. O `.docx` sai e nao fica nada na
 *      conta, justamente para o corretor que ainda nao entendeu o dossie.
 *   2. Se o plano passar a medir por negocio, o caminho que escapa da contagem
 *      e o caminho PADRAO do produto, e o limite vira decoracao.
 *
 * A saida nao e exigir negocio antes de gerar, o que meteria uma etapa no meio
 * do trabalho do corretor. E criar o negocio NO ATO: ele preenche e baixa,
 * igual a sempre, e o dossie aparece sozinho com o que ele acabou de digitar.
 *
 * REUSO E O QUE FAZ O TETO TER SENTIDO
 *
 * Se cada documento criasse um negocio, gerar proposta, promessa e distrato da
 * mesma operacao gastaria tres vagas de um teto pensado em operacoes. O teto
 * viraria contagem de documentos por outro nome, que e exatamente o modelo
 * descartado. Por isso a busca por chave abaixo nao e otimizacao: e o que
 * mantem a promessa de "o limite e por negocio".
 *
 * A IDENTIDADE DE PESSOA NAO MORA AQUI
 *
 * A fusao usa `mesclarPartes` de `negocios.ts`, que por sua vez usa
 * `mergeResults` e a regra `mesmaPessoa` de `extraction-types.ts`. Isso e
 * deliberado e esta escrito la: o sistema tem UMA regra de identidade de
 * pessoa. Uma segunda regra aqui divergiria em silencio da primeira, e a
 * divergencia perigosa e conhecida: `mesmaPessoa` se RECUSA a fundir quando so
 * um dos lados tem CPF, e qualquer regra caseira que casasse por nome nesse
 * caso fundiria homonimos, misturando dados de clientes diferentes.
 *
 * O que e novo aqui e a identidade da OPERACAO, que e outra pergunta: nao "duas
 * pessoas sao a mesma?", e sim "dois documentos pertencem ao mesmo negocio?".
 *
 * ONDE ISTO NAO E CHAMADO
 *
 * Documentos acessorios (checklist, termo de chaves, termo de posse,
 * compromisso) nao chamam esta funcao. Eles pertencem a uma operacao que ja tem
 * negocio, e cobrar vaga por eles puniria o corretor por documentar direito.
 * Tambem nao e chamado no caminho de VALIDAR minuta: validar nao e gerar, e
 * consumir vaga ali faria o validador competir com o proprio plano.
 */

/** Devolve so os digitos: CPF digitado com e sem mascara tem de casar. */
function apenasDigitos(v: unknown): string {
  return typeof v === 'string' ? v.replace(/\D+/g, '') : ''
}

/**
 * Normaliza texto livre para comparacao: sem acento, sem pontuacao, sem espaco
 * repetido, minusculo. "Rua Sao Joao, 120 - Apto 2" e "rua sao joao 120 apto 2"
 * sao o mesmo endereco digitado por duas pessoas diferentes.
 */
function normalizarTexto(v: unknown): string {
  if (typeof v !== 'string') return ''
  // A classe de sinais diacriticos vai ESCAPADA em \u, e nao com os caracteres
  // literais: marca combinante e invisivel no editor, e este arquivo vai ser
  // colado no chat do Skip, onde ja houve corrupcao de codificacao. Caractere
  // que ninguem enxerga e caractere que ninguem confere.
  return v
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/**
 * A parte que ancora a operacao. Os formularios usam rotulos diferentes
 * (compradores, proponentes, segundos), mas todos gravam o mesmo `papel` em
 * `ParteNegocio`, entao da para procurar por papel e nao por nome de campo.
 * Anuente nunca serve de ancora: ele acompanha a operacao sem defini-la, e o
 * mesmo conjuge anuente aparece em negocios diferentes.
 */
function parteAncora(partes: ParteNegocio[]): ParteNegocio | null {
  return (
    partes.find((p) => p.papel === 'comprador') ??
    partes.find((p) => p.papel !== 'anuente') ??
    partes[0] ??
    null
  )
}

/**
 * Chave de identidade da OPERACAO, montada de dois lados independentes.
 *
 * Cada lado tem um sinal forte e um fraco:
 *
 *   pessoa   forte = CPF         fraco = nome normalizado
 *   imovel   forte = matricula   fraco = endereco com cidade e UF
 *
 * A chave so vale se houver UM sinal forte, ou os DOIS fracos. Nome sozinho
 * nunca identifica operacao: dois "Joao Silva" sem CPF e sem endereco cairiam
 * na mesma chave, e o dossie de um cliente receberia os dados do outro. E a
 * mesma postura do `mesmaPessoa`, que se recusa a decidir quando o sinal e
 * fraco demais.
 *
 * `null` significa "nao da para afirmar que e a mesma operacao", e o chamador
 * cria em vez de fundir. Dossie a mais o corretor apaga; dossie fundido por
 * engano mistura dados de clientes diferentes, que e dano de LGPD e nao
 * inconveniente.
 */
export function chaveDaOperacao(partes: ParteNegocio[], imovel: ImovelExtraido): string | null {
  const ancora = parteAncora(partes)
  const cpf = ancora ? apenasDigitos(ancora.cpf) : ''
  const nome = ancora ? normalizarTexto(ancora.nome) : ''
  const matricula = normalizarTexto(imovel?.matricula)
  const endereco = normalizarTexto(
    [imovel?.endereco, imovel?.cidade, imovel?.uf].filter(Boolean).join(' '),
  )

  const temSinalForte = !!cpf || !!matricula
  const temOsDoisFracos = !!nome && !!endereco
  if (!temSinalForte && !temOsDoisFracos) return null

  return `${cpf || nome}::${matricula || endereco}`
}

/**
 * Titulo do dossie criado sozinho. O corretor vai reencontrar esse negocio numa
 * lista dias depois, entao o nome tem de dizer de quem e de qual imovel, e nao
 * "Negocio 4".
 */
export function tituloDaOperacao(partes: ParteNegocio[], imovel: ImovelExtraido): string {
  const ancora = parteAncora(partes)
  const pessoa = (ancora?.nome ?? '').trim()
  const lugar = (imovel?.endereco || imovel?.descricao || imovel?.cidade || '').trim()
  if (pessoa && lugar) return `${pessoa} - ${lugar}`
  return pessoa || lugar || 'Negocio sem identificacao'
}

export interface DadosDaOperacao {
  /** Opcional: sem ele o titulo sai de `tituloDaOperacao`. */
  titulo?: string
  partes: ParteNegocio[]
  imovel: ImovelExtraido
}

export interface ResultadoGarantia {
  negocio: Negocio
  /** true = registro novo. E o unico caso que consome vaga do plano. */
  criado: boolean
}

/** Separa os metadados do dossie dos campos que a regra de identidade conhece. */
function semMeta(p: ParteNegocio): PessoaExtraida {
  const { _id: _ignoraId, papel: _ignoraPapel, conjuge_de: _ignoraConjuge, ...pessoa } = p
  return pessoa
}

/**
 * Garante que existe um negocio para a operacao que esta sendo documentada.
 *
 * `jaCarregado` e o negocio que o corretor escolheu no `CarregarDeNegocio`.
 * Quando ele existe, esta funcao nao faz NADA: o dossie ja esta identificado, a
 * sincronia de volta do `useNegocioSync` continua sendo quem grava as
 * correcoes, e criar aqui duplicaria a operacao. Este e o caminho preferencial
 * e ele tem de continuar barato.
 *
 * NUNCA lanca para fora. Falha de rede ao gravar o dossie nao pode impedir a
 * geracao do documento: o corretor esta com o cliente na frente e o `.docx` e o
 * produto. O erro e registrado e a geracao segue. A consequencia e um documento
 * que saiu sem dossie e sem contagem, que e perda aceitavel comparada a um
 * download que nao aconteceu.
 */
export async function garantirNegocioDaOperacao(
  dados: DadosDaOperacao,
  jaCarregado?: Negocio | null,
): Promise<ResultadoGarantia | null> {
  if (jaCarregado) return { negocio: jaCarregado, criado: false }

  try {
    const chave = chaveDaOperacao(dados.partes, dados.imovel)

    if (chave) {
      // `listNegocios` ja vem filtrado pelo dono na API rule da colecao, entao a
      // busca nao enxerga negocio de outro corretor. A comparacao roda no
      // cliente porque `partes` e `imovel` sao json: filtrar por dentro deles no
      // servidor exigiria indice que a colecao nao tem, e o corretor tipico tem
      // dezenas de negocios, nao milhares.
      const existentes = await listNegocios()
      const igual = existentes.find((n) => chaveDaOperacao(n.partes, n.imovel) === chave)
      if (igual) {
        // `mesclarPartes` preserva _id, papel e conjuge_de do registro do
        // dossie, que e a verdade ja revisada. O `conflitosDePapel` que ela
        // devolve nao vira aviso aqui de proposito: no caminho automatico o
        // corretor nao escolheu papel nenhum, entao nao ha escolha dele para
        // reportar como descartada.
        const { partes } = mesclarPartes(
          igual.partes,
          dados.partes.map((p) => ({ pessoa: semMeta(p), papel: p.papel })),
        )
        // O dossie entra PRIMEIRO porque `mergeResults` so preenche campo
        // vazio: assim um termo gerado com menos campos nao apaga o que a
        // promessa ja tinha registrado.
        const { imovel } = mergeResults([
          { pessoas: [], imovel: igual.imovel },
          { pessoas: [], imovel: dados.imovel },
        ])
        const atualizado = await updateNegocio(igual.id, { partes, imovel })
        return { negocio: atualizado, criado: false }
      }
    }

    const novo = await createNegocio(
      dados.titulo?.trim() || tituloDaOperacao(dados.partes, dados.imovel),
      { partes: dados.partes, imovel: dados.imovel },
    )
    return { negocio: novo, criado: true }
  } catch (err) {
    console.error('negocioAutomatico: nao foi possivel garantir o negocio', err)
    return null
  }
}

// ─── Do formulario para a operacao ──────────────────────────────────────────
//
// Os formularios sao mais parecidos do que parecem. Os campos de parte batem
// um a um com `PessoaExtraida`, e os do imovel usam os mesmos nomes de
// `ImovelExtraido` com o prefixo `imovel_`. O que muda entre eles e so o NOME
// dos arrays de partes: vendedores/compradores, primeiros/segundos,
// proprietarios/proponentes. Por isso aqui existe uma funcao so, parametrizada
// por um mapa, em vez de um extrator por documento.

/** Nome do array no formulario -> papel gravado no dossie. */
export type MapaDeGrupos = Readonly<Record<string, PapelParte>>

/** Ávista, dacao, FGTS, financiada e distrato. */
export const GRUPOS_VENDA: MapaDeGrupos = {
  vendedores: 'vendedor',
  compradores: 'comprador',
  anuentes: 'anuente',
}

/**
 * Permuta. Os dois lados dao e recebem imovel, entao "vendedor" e "comprador"
 * aqui sao rotulo de posicao, nao de papel economico: e o que o dossie tem para
 * oferecer, e e o que a tela ja mostra hoje.
 *
 * Consequencia conhecida: a ancora da chave cai no segundo permutante, enquanto
 * o imovel da chave e o `imovel_a`, que e do primeiro. A chave nao precisa ser
 * semanticamente coerente, precisa ser ESTAVEL: o mesmo formulario preenchido
 * do mesmo jeito produz sempre a mesma chave, que e o unico requisito do reuso.
 */
export const GRUPOS_PERMUTA: MapaDeGrupos = {
  primeiros: 'vendedor',
  segundos: 'comprador',
  anuentes: 'anuente',
}

/** Reserva e proposta. */
export const GRUPOS_RESERVA: MapaDeGrupos = {
  proprietarios: 'vendedor',
  proponentes: 'comprador',
  anuentes: 'anuente',
}

export interface ConfigDaOperacao {
  grupos: MapaDeGrupos
  /**
   * Objeto aninhado com os campos do imovel, como o `imovel_a` da permuta.
   * Quando presente, vence o prefixo.
   *
   * A permuta tem DOIS imoveis e `negocios` guarda um. Fica o `imovel_a`, do
   * primeiro permutante. Nao e escolha nova: a colecao sempre foi assim, e o
   * proprio `CarregarDeNegocio` ja pede ao corretor para escolher o slot quando
   * carrega. O `imovel_b` continua indo para o documento normalmente; ele so
   * nao entra no dossie.
   */
  imovelObjeto?: string
  /** Prefixo dos campos planos. Padrao `imovel_`. */
  imovelPrefixo?: string
}

/** Le os campos do imovel, planos com prefixo ou dentro de um objeto. */
function imovelDoFormulario(
  valores: Record<string, unknown>,
  config: ConfigDaOperacao,
): ImovelExtraido {
  const saida: ImovelExtraido = { ...emptyImovel }
  const chaves = Object.keys(saida) as (keyof ImovelExtraido)[]

  const aninhado =
    config.imovelObjeto && typeof valores[config.imovelObjeto] === 'object'
      ? (valores[config.imovelObjeto] as Record<string, unknown>)
      : null

  for (const chave of chaves) {
    if (chave === '_confianca') continue
    const bruto = aninhado
      ? aninhado[chave]
      : valores[`${config.imovelPrefixo ?? 'imovel_'}${chave}`]
    if (typeof bruto === 'string' && bruto.trim()) saida[chave] = bruto
  }

  return saida
}

/**
 * Monta a operacao a partir dos valores atuais do formulario.
 *
 * Parte digitada no formulario nasce com `_fonte: 'formulario'`, e nao com o
 * 'desconhecido' do `emptyPessoa`: a procedencia e sabida, e no dossie a
 * diferenca entre "o corretor digitou" e "a IA leu de um documento" e
 * informacao util. O `_confianca` fica no padrao de proposito, para nao mexer
 * no criterio de desempate do `mergeResults` por um efeito colateral.
 */
export function operacaoDoFormulario(
  valores: Record<string, unknown>,
  config: ConfigDaOperacao,
): DadosDaOperacao {
  const partes: ParteNegocio[] = []

  for (const [campo, papel] of Object.entries(config.grupos)) {
    const lista = valores[campo]
    if (!Array.isArray(lista)) continue
    for (const bruto of lista) {
      if (!bruto || typeof bruto !== 'object') continue
      const doForm = bruto as Record<string, unknown>
      // `novaParte` da a base com os defaults do projeto e um `_id` novo; o
      // espalhamento depois preserva o `_id` que ja veio do dossie, quando veio.
      const parte: ParteNegocio = { ...novaParte(papel), _fonte: 'formulario' }
      for (const [chave, valor] of Object.entries(doForm)) {
        if (typeof valor !== 'string') continue
        if (!valor.trim() && chave !== '_id') continue
        ;(parte as unknown as Record<string, unknown>)[chave] = valor
      }
      // Parte em branco nao entra: o formulario nasce com uma linha vazia, e um
      // dossie cheio de gente sem nome nem CPF nao ajuda ninguem.
      if (!parte.nome.trim() && !parte.cpf.trim()) continue
      parte.papel = papel
      partes.push(parte)
    }
  }

  return { partes, imovel: imovelDoFormulario(valores, config) }
}
