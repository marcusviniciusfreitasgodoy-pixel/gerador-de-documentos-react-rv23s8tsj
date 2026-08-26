import { listNegocios, createNegocio, updateNegocio } from '@/lib/negocios'
import type { Negocio, ParteNegocio } from '@/lib/negocios'
import type { ImovelExtraido } from '@/lib/extraction-types'

/**
 * Criação automática do negócio no ato da geração do documento.
 *
 * POR QUE ISTO EXISTE
 *
 * Até aqui, gerar documento nunca exigiu negócio: todo formulário trava só em
 * `hasBroker` e o `CarregarDeNegocio` é conveniência opcional. Isso deixa dois
 * buracos ao mesmo tempo:
 *
 *   1. Quem gera avulso PERDE o histórico. O `.docx` sai e não fica nada na
 *      conta, justamente para o corretor que ainda não entendeu o dossiê.
 *   2. Se o plano passar a medir por negócio, o caminho que escapa da contagem
 *      é o caminho PADRÃO do produto, e o limite vira decoração.
 *
 * A saída não é exigir negócio antes de gerar, o que meteria uma etapa no meio
 * do trabalho do corretor. É criar o negócio NO ATO: ele preenche e baixa,
 * igual a sempre, e o dossiê aparece sozinho com o que ele acabou de digitar.
 *
 * REUSO É O QUE FAZ O TETO TER SENTIDO
 *
 * Se cada documento criasse um negócio, gerar proposta, promessa e distrato da
 * mesma operação gastaria três vagas de um teto pensado em operações. O teto
 * viraria contagem de documentos por outro nome, que é exatamente o modelo
 * descartado. Por isso a busca por chave abaixo não é otimização: é o que
 * mantém a promessa de "o limite é por negócio".
 *
 * ONDE ISTO NÃO É CHAMADO
 *
 * Documentos acessórios (checklist, termo de chaves, termo de posse,
 * compromisso) não chamam esta função. Eles pertencem a uma operação que já tem
 * negócio, e cobrar vaga por eles puniria o corretor por documentar direito.
 * Também não é chamado no caminho de VALIDAR minuta: validar não é gerar, e
 * consumir vaga ali faria o validador competir com o próprio plano.
 */

/** Devolve só os dígitos: CPF digitado com e sem máscara tem de casar. */
function apenasDigitos(v: unknown): string {
  return typeof v === 'string' ? v.replace(/\D+/g, '') : ''
}

/**
 * Normaliza texto livre para comparação: sem acento, sem pontuação, sem espaço
 * repetido, minúsculo. "Rua São João, 120 - Apto 2" e "rua sao joao 120 apto 2"
 * são o mesmo endereço digitado por duas pessoas diferentes.
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
 * A parte que identifica o lado comprador da operação. Os formulários usam
 * rótulos diferentes (compradores, proponentes, segundos), mas todos gravam o
 * mesmo `papel` em `ParteNegocio`, então dá para procurar por papel e não por
 * nome de campo. Anuente nunca serve de âncora: ele acompanha a operação sem
 * defini-la, e o mesmo cônjuge anuente aparece em negócios diferentes.
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
 * Chave de identidade da operação, em dois lados independentes.
 *
 * Lado da pessoa: CPF quando houver, senão o nome. O CPF é o identificador de
 * verdade; o nome é a rede para o corretor que ainda não pediu o documento.
 *
 * Lado do imóvel: matrícula quando houver, senão endereço com cidade e UF. A
 * matrícula é única no registro de imóveis; o endereço é aproximação boa o
 * bastante para o mesmo corretor, que não trabalha duas operações no mesmo
 * imóvel ao mesmo tempo.
 *
 * Devolve `null` quando NENHUM dos dois lados tem conteúdo. Aí não há como
 * afirmar que é a mesma operação, e criar um negócio novo é o lado seguro de
 * errar: dossiê a mais o corretor apaga, dossiê fundido por engano mistura
 * dados de clientes diferentes, que é dano de LGPD e não inconveniente.
 */
export function chaveDaOperacao(partes: ParteNegocio[], imovel: ImovelExtraido): string | null {
  const ancora = parteAncora(partes)
  const ladoPessoa = ancora ? apenasDigitos(ancora.cpf) || normalizarTexto(ancora.nome) : ''

  const matricula = normalizarTexto(imovel?.matricula)
  const ladoImovel =
    matricula ||
    normalizarTexto([imovel?.endereco, imovel?.cidade, imovel?.uf].filter(Boolean).join(' '))

  if (!ladoPessoa && !ladoImovel) return null
  return `${ladoPessoa}::${ladoImovel}`
}

export interface DadosDaOperacao {
  titulo: string
  partes: ParteNegocio[]
  imovel: ImovelExtraido
}

export interface ResultadoGarantia {
  negocio: Negocio
  /** true = registro novo. É o único caso que consome vaga do plano. */
  criado: boolean
}

/**
 * Garante que existe um negócio para a operação que está sendo documentada.
 *
 * `jaCarregado` é o negócio que o corretor escolheu no `CarregarDeNegocio`.
 * Quando ele existe, esta função não faz NADA: o dossiê já está identificado,
 * a sincronia de volta do `useNegocioSync` continua sendo quem grava as
 * correções, e criar aqui duplicaria a operação. Este é o caminho preferencial
 * e ele tem de continuar barato.
 *
 * ⚠️ NUNCA lançar para fora. Falha de rede na gravação do dossiê não pode
 * impedir a geração do documento: o corretor está com o cliente na frente e o
 * `.docx` é o produto. O erro é registrado e a geração segue. A consequência é
 * um documento que saiu sem dossiê e sem contagem, que é perda aceitável
 * comparada a um download que não aconteceu.
 */
export async function garantirNegocioDaOperacao(
  dados: DadosDaOperacao,
  jaCarregado?: Negocio | null,
): Promise<ResultadoGarantia | null> {
  if (jaCarregado) return { negocio: jaCarregado, criado: false }

  try {
    const chave = chaveDaOperacao(dados.partes, dados.imovel)

    if (chave) {
      // `listNegocios` já vem filtrado pelo dono na API rule da coleção, então
      // a busca não vaza negócio de outro corretor. A comparação roda no
      // cliente porque `partes` e `imovel` são json: filtrar por dentro deles
      // no servidor exigiria índice que a coleção não tem, e o corretor típico
      // tem dezenas de negócios, não milhares.
      const existentes = await listNegocios()
      const igual = existentes.find((n) => chaveDaOperacao(n.partes, n.imovel) === chave)
      if (igual) {
        // Reuso: completa o que o dossiê ainda não sabia. Espalhar o gravado
        // ANTES do novo mantém o que já estava lá quando o formulário atual não
        // preencheu aquele campo — um termo gerado com menos campos não pode
        // apagar dado que a promessa já tinha registrado.
        const atualizado = await updateNegocio(igual.id, {
          partes: mesclarPartes(igual.partes, dados.partes),
          imovel: mesclarImovel(igual.imovel, dados.imovel),
        })
        return { negocio: atualizado, criado: false }
      }
    }

    const novo = await createNegocio(dados.titulo, {
      partes: dados.partes,
      imovel: dados.imovel,
    })
    return { negocio: novo, criado: true }
  } catch (err) {
    console.error('negocioAutomatico: nao foi possivel garantir o negocio', err)
    return null
  }
}

/**
 * Funde as partes do formulário nas do dossiê, casando por CPF quando houver e
 * por nome normalizado quando não houver. Campo vazio no formulário nunca
 * sobrescreve campo preenchido no dossiê: o corretor pode gerar um documento
 * que não pede RG depois de ter gerado um que pedia, e o RG tem de sobreviver.
 */
function mesclarPartes(doDossie: ParteNegocio[], doForm: ParteNegocio[]): ParteNegocio[] {
  const identidade = (p: ParteNegocio) => apenasDigitos(p.cpf) || normalizarTexto(p.nome)
  const saida = [...doDossie]

  for (const nova of doForm) {
    const id = identidade(nova)
    const idx = id ? saida.findIndex((p) => identidade(p) === id) : -1
    if (idx === -1) {
      saida.push(nova)
      continue
    }
    const antiga = saida[idx]
    const fundida = { ...antiga }
    for (const [campo, valor] of Object.entries(nova)) {
      // `_id` fica de fora de propósito: ele é a âncora que a sincronia de
      // volta usa para casar parte com campo do formulário. Trocar o `_id` de
      // uma parte já gravada faz o `gravar` do useNegocioSync não achar a parte
      // e recusar a correção com "as partes deste negócio mudaram".
      if (campo === '_id') continue
      if (typeof valor === 'string' && !valor.trim()) continue
      if (valor === undefined || valor === null) continue
      ;(fundida as Record<string, unknown>)[campo] = valor
    }
    saida[idx] = fundida
  }

  return saida
}

/** Mesma regra do mesclarPartes, no objeto plano do imóvel. */
function mesclarImovel(doDossie: ImovelExtraido, doForm: ImovelExtraido): ImovelExtraido {
  const saida = { ...doDossie }
  for (const [campo, valor] of Object.entries(doForm ?? {})) {
    if (typeof valor === 'string' && !valor.trim()) continue
    if (valor === undefined || valor === null) continue
    ;(saida as Record<string, unknown>)[campo] = valor
  }
  return saida
}
