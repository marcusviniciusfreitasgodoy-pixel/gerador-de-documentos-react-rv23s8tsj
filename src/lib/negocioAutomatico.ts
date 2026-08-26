import {
  listNegocios,
  createNegocio,
  updateNegocio,
  mesclarPartes,
  novaParte,
} from '@/lib/negocios'
import type { Negocio, ParteNegocio, PapelParte } from '@/lib/negocios'
import { mergeResults, emptyImovel, mesmaPessoa } from '@/lib/extraction-types'
import type { ConfigVoltaPlano } from '@/lib/aplicar-negocio'
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
 * Os identificadores do IMOVEL, TODOS eles, nao o melhor deles.
 *
 * POR QUE UM CONJUNTO, E NAO UM VALOR
 *
 * A primeira versao devolvia "matricula se houver, senao endereco". Parecia
 * razoavel e quebrava no caso principal: a autorizacao de venda nao coleta
 * matricula e a promessa coleta, entao uma produzia `e:endereco` e a outra
 * `m:matricula`, e as duas nunca se encontravam apesar de tratarem do mesmo
 * apartamento. Precedencia so funciona quando os dois lados coletam os mesmos
 * campos, e aqui nao coletam.
 *
 * Devolvendo os dois quando os dois existem, duas operacoes se reconhecem por
 * QUALQUER identificador em comum. A matricula casa quando os dois formularios
 * a tem; o endereco casa quando um deles nao tem.
 *
 * A UF fica de fora do endereco de proposito, pelo mesmo motivo: nem toda tela a
 * coleta, e um campo que so metade preenche faz o mesmo imovel gerar
 * identificadores diferentes conforme o documento.
 *
 * Lista vazia significa "nao da para comparar", e o chamador entao cria em vez
 * de fundir.
 *
 * LIMITE CONHECIDO
 *
 * O recibo de sinal coleta matricula e NAO coleta endereco; a autorizacao de
 * venda faz o contrario. Os dois nao tem token em comum, entao nao se
 * reconhecem. Nao ha o que consertar aqui: nao existe dado comparavel entre as
 * duas telas. Na pratica a lacuna e estreita, porque a promessa tem os dois
 * tokens e serve de ponte assim que existe. `imovel_comarca` do recibo NAO
 * serve de substituto para a cidade: comarca e distrito judiciario e pode
 * abranger varios municipios, armadilha que `aplicar-negocio.ts` ja documenta.
 */
export function identificadoresDoImovel(imovel: ImovelExtraido): string[] {
  const saida: string[] = []
  const matricula = normalizarTexto(imovel?.matricula)
  if (matricula) saida.push(`m:${matricula}`)
  const endereco = normalizarTexto([imovel?.endereco, imovel?.cidade].filter(Boolean).join(' '))
  if (endereco) saida.push(`e:${endereco}`)
  return saida
}

/**
 * Duas operacoes sao a mesma quando tratam do MESMO IMOVEL e tem AO MENOS UMA
 * PARTE EM COMUM.
 *
 * POR QUE NAO UMA PARTE ANCORA
 *
 * A versao anterior elegia uma parte ancora, com preferencia pelo comprador. Ela
 * quebrava justamente na sequencia mais comum do mercado: a autorizacao de venda
 * e assinada quando o corretor pega a captacao, semanas antes de existir
 * comprador, entao ela ancoraria no vendedor e a promessa posterior no
 * comprador. Duas chaves diferentes para a mesma operacao, e dois dossies onde
 * devia haver um.
 *
 * Com "imovel igual mais uma parte em comum", a autorizacao e a promessa se
 * encontram pelo vendedor, que aparece nas duas.
 *
 * POR QUE AS DUAS CONDICOES, E NAO UMA
 *
 * So o imovel fundiria a venda de hoje com a revenda do mesmo apartamento a
 * outro comprador anos depois. So a pessoa fundiria as duas operacoes de um
 * investidor que compra dois imoveis. Exigir as duas mata os dois casos.
 *
 * A comparacao de pessoa usa `mesmaPessoa` de `extraction-types.ts`, que e a
 * unica regra de identidade de pessoa do sistema. Ela se recusa a decidir
 * quando so um dos lados tem CPF, e essa recusa e desejada aqui tambem.
 */
export function mesmaOperacao(
  a: { partes: ParteNegocio[]; imovel: ImovelExtraido },
  b: { partes: ParteNegocio[]; imovel: ImovelExtraido },
): boolean {
  const ia = identificadoresDoImovel(a.imovel)
  const ib = identificadoresDoImovel(b.imovel)
  if (!ia.some((id) => ib.includes(id))) return false
  return a.partes.some((pa) => b.partes.some((pb) => mesmaPessoa(semMeta(pa), semMeta(pb))))
}

/** Preferencia de exibicao: o comprador nomeia melhor a operacao que o vendedor. */
function parteParaTitulo(partes: ParteNegocio[]): ParteNegocio | null {
  return (
    partes.find((p) => p.papel === 'comprador') ??
    partes.find((p) => p.papel !== 'anuente') ??
    partes[0] ??
    null
  )
}

/**
 * Titulo do dossie criado sozinho. O corretor vai reencontrar esse negocio numa
 * lista dias depois, entao o nome tem de dizer de quem e de qual imovel, e nao
 * "Negocio 4".
 */
export function tituloDaOperacao(partes: ParteNegocio[], imovel: ImovelExtraido): string {
  const ancora = parteParaTitulo(partes)
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
    // Sem identificador de imovel nao ha como afirmar que e a mesma operacao, e
    // a busca inteira e pulada: dossie a mais o corretor apaga, dossie fundido
    // por engano mistura dados de clientes diferentes, que e dano de LGPD.
    if (identificadoresDoImovel(dados.imovel).length > 0) {
      // `listNegocios` ja vem filtrado pelo dono na API rule da colecao, entao a
      // busca nao enxerga negocio de outro corretor. A comparacao roda no
      // cliente porque `partes` e `imovel` sao json: filtrar por dentro deles no
      // servidor exigiria indice que a colecao nao tem, e o corretor tipico tem
      // dezenas de negocios, nao milhares.
      const existentes = await listNegocios()
      const igual = existentes.find((n) => mesmaOperacao(n, dados))
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

/**
 * Nome do array no formulario -> papel gravado no dossie.
 *
 * Chamam-se PAPEIS_ e nao GRUPOS_ de proposito: varios formularios ja tem uma
 * constante local `GRUPOS_<documento>` com a LISTA de nomes dos arrays, usada
 * pelo `useNegocioSync`. Sao coisas diferentes, e o nome distinto evita tanto a
 * colisao de import quanto a confusao de quem le.
 */
export type MapaDeGrupos = Readonly<Record<string, PapelParte>>

/** Ávista, dacao, FGTS, financiada e distrato. */
export const PAPEIS_VENDA: MapaDeGrupos = {
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
export const PAPEIS_PERMUTA: MapaDeGrupos = {
  primeiros: 'vendedor',
  segundos: 'comprador',
  anuentes: 'anuente',
}

/** Reserva e proposta. */
export const PAPEIS_RESERVA: MapaDeGrupos = {
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

// ─── Formularios de partes PLANAS ───────────────────────────────────────────
//
// Recibo de sinal, promessa simplificada e autorizacao de venda nao usam arrays
// de partes: tem campos soltos com prefixo (`vendedor_nome`, `comprador_cpf`).
// O mapeamento campo a campo ja existe em `aplicar-negocio.ts`, no tipo
// `ConfigVoltaPlano`, usado pela volta ao dossie. Aqui ele e lido na direcao
// contraria, em vez de reescrito: um segundo mapa divergiria do primeiro na
// primeira vez que alguem renomeasse um campo, e a divergencia seria muda.

/**
 * Autorizacao de venda. Nao tem `MAPA_` em `aplicar-negocio.ts` porque nao tem
 * volta ao dossie: mora aqui por ser configuracao so de ida.
 *
 * So tem contratante, que e o dono autorizando a venda, ou seja, o vendedor. Nao
 * tem comprador, e nao deveria mesmo: quando o corretor pega a captacao ainda
 * nao existe comprador. E o caso que motivou a regra de casar por "imovel mais
 * parte em comum" em vez de por parte ancora.
 */
export const MAPA_AUTORIZACAO: ConfigVoltaPlano = {
  vendedor: {
    nome: 'contratante_nome',
    cpf: 'contratante_cpf',
    orgao_emissor: 'contratante_orgao_emissor',
    email: 'contratante_email',
  },
  comprador: {},
  imovel: {
    endereco: 'imovel_endereco',
    bairro: 'imovel_bairro',
    cidade: 'imovel_cidade',
    cep: 'imovel_cep',
    iptu: 'imovel_iptu',
    vagas_qtd: 'imovel_vagas',
  },
}

/** Monta uma parte a partir de um mapa campo-do-dossie -> campo-do-formulario. */
function parteDeMapaPlano(
  valores: Record<string, unknown>,
  mapa: Partial<Record<string, string>>,
  papel: PapelParte,
): ParteNegocio | null {
  const parte: ParteNegocio = { ...novaParte(papel), _fonte: 'formulario' }
  for (const [campoDoDossie, campoDoForm] of Object.entries(mapa)) {
    if (!campoDoForm) continue
    const valor = valores[campoDoForm]
    if (typeof valor !== 'string' || !valor.trim()) continue
    ;(parte as unknown as Record<string, unknown>)[campoDoDossie] = valor
  }
  // Sem nome nem CPF nao ha parte: o formulario aberto em branco nao pode virar
  // gente vazia no dossie.
  if (!parte.nome.trim() && !parte.cpf.trim()) return null
  return parte
}

/**
 * Monta a operacao a partir de um formulario de partes planas.
 *
 * LIMITE CONHECIDO, HERDADO DO MAPA
 *
 * Os mapas so descrevem a PRIMEIRA parte de cada papel, que e a decisao L2-a
 * registrada no `calcularVoltaPlano`. Conjuge e interveniente da promessa
 * simplificada, por exemplo, nao entram no dossie criado aqui, porque nao estao
 * no mapa. Preferivel a inventar um segundo mapeamento que divergiria da volta:
 * o corretor acrescenta o conjuge no dossie, e dali em diante ele vale para
 * todos os documentos.
 */
export function operacaoDoFormularioPlano(
  valores: Record<string, unknown>,
  config: ConfigVoltaPlano,
): DadosDaOperacao {
  const partes: ParteNegocio[] = []
  const vendedor = parteDeMapaPlano(valores, config.vendedor, 'vendedor')
  if (vendedor) partes.push(vendedor)
  const comprador = parteDeMapaPlano(valores, config.comprador, 'comprador')
  if (comprador) partes.push(comprador)

  const imovel: ImovelExtraido = { ...emptyImovel }
  for (const [campoDoDossie, campoDoForm] of Object.entries(config.imovel)) {
    if (!campoDoForm) continue
    const valor = valores[campoDoForm]
    if (typeof valor === 'string' && valor.trim()) {
      ;(imovel as unknown as Record<string, unknown>)[campoDoDossie] = valor
    }
  }

  return { partes, imovel }
}
