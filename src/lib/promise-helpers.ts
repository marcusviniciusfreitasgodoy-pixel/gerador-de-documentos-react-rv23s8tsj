import { z } from 'zod'
import {
  parseCurrency,
  formatCurrency,
  cleanCurrencyMask,
  formatDateFull,
  buildQualificacaoCivil,
  checarCpfRepetidoPlano,
  ESTADO_CIVIL_OPTIONS,
  REGIME_BENS_OPTIONS,
  trimDeep,
} from '@/lib/form-helpers'

export { ESTADO_CIVIL_OPTIONS, REGIME_BENS_OPTIONS }

export const SALDO_PAGAMENTO_OPTIONS = ['Financiamento Bancário', 'Recursos Próprios'] as const

// Papel do cônjuge. São coisas juridicamente distintas:
// - co_vendedor/co_comprador: o cônjuge É parte (meeiro que aliena / adquirente).
// - anuente: não é parte; comparece só para autorizar a alienação (art. 1.647, I).
// - nenhum: separação total dispensa a outorga; ou o cônjuge simplesmente não entra.
export const PAPEL_CONJUGE_VENDEDOR = ['nenhum', 'co_vendedor', 'anuente'] as const
export const PAPEL_CONJUGE_COMPRADOR = ['nenhum', 'co_comprador'] as const

const conjugeCampos = {
  nome: z.string().optional(),
  nacionalidade: z.string().optional(),
  profissao: z.string().optional(),
  cpf: z.string().optional(),
  endereco: z.string().optional(),
}

export const promiseSchema = z
  .object({
    vendedor_nome: z.string().min(3, 'Nome obrigatório (mín. 3 caracteres)'),
    vendedor_nacionalidade: z.string().min(1, 'Obrigatório'),
    vendedor_estado_civil: z.string().min(1, 'Selecione o estado civil'),
    vendedor_regime_bens: z.string().optional(),
    vendedor_profissao: z.string().min(1, 'Obrigatório'),
    vendedor_cpf: z.string().min(1, 'Obrigatório'),
    vendedor_endereco: z.string().min(1, 'Obrigatório'),
    conjuge_vendedor_papel: z.enum(PAPEL_CONJUGE_VENDEDOR),
    conjuge_vendedor_nome: conjugeCampos.nome,
    conjuge_vendedor_nacionalidade: conjugeCampos.nacionalidade,
    conjuge_vendedor_profissao: conjugeCampos.profissao,
    conjuge_vendedor_cpf: conjugeCampos.cpf,
    conjuge_vendedor_endereco: conjugeCampos.endereco,
    comprador_nome: z.string().min(3, 'Nome obrigatório (mín. 3 caracteres)'),
    comprador_nacionalidade: z.string().min(1, 'Obrigatório'),
    comprador_estado_civil: z.string().min(1, 'Selecione o estado civil'),
    comprador_regime_bens: z.string().optional(),
    comprador_profissao: z.string().min(1, 'Obrigatório'),
    comprador_cpf: z.string().min(1, 'Obrigatório'),
    comprador_endereco: z.string().min(1, 'Obrigatório'),
    conjuge_comprador_papel: z.enum(PAPEL_CONJUGE_COMPRADOR),
    conjuge_comprador_nome: conjugeCampos.nome,
    conjuge_comprador_nacionalidade: conjugeCampos.nacionalidade,
    conjuge_comprador_profissao: conjugeCampos.profissao,
    conjuge_comprador_cpf: conjugeCampos.cpf,
    conjuge_comprador_endereco: conjugeCampos.endereco,
    has_interveniente: z.boolean(),
    interveniente_nome: z.string().optional(),
    interveniente_cpf: z.string().optional(),
    imovel_descricao: z.string().min(1, 'Obrigatório'),
    imovel_endereco: z.string().min(1, 'Obrigatório'),
    imovel_matricula: z.string().min(1, 'Obrigatório'),
    imovel_cidade: z.string().min(1, 'Obrigatório'),
    imovel_estado: z.string().min(1, 'Obrigatório'),
    valor_venda: z
      .string()
      .min(1, 'Obrigatório')
      .refine((v) => parseCurrency(v) > 0, 'Valor deve ser maior que zero'),
    valor_sinal: z
      .string()
      .min(1, 'Obrigatório')
      .refine((v) => parseCurrency(v) > 0, 'Valor deve ser maior que zero'),
    comissao_percentual: z.string().min(1, 'Obrigatório'),
    prazo_certidoes_dias: z
      .string()
      .min(1, 'Obrigatório')
      .refine((v) => /^\d+$/.test(v), 'Apenas números'),
    tipo_arras: z.enum(['confirmatoria', 'penitencial']),
    saldo_pagamento: z.enum(SALDO_PAGAMENTO_OPTIONS),
  })
  .refine((d) => parseCurrency(d.valor_sinal) <= parseCurrency(d.valor_venda), {
    message: 'Sinal não pode exceder o valor de venda',
    path: ['valor_sinal'],
  })
  // O regime não é opcional quando a parte é casada: o documento AFIRMA o regime na
  // qualificação, e ele define se a outorga do cônjuge é exigida (art. 1.647).
  .refine((d) => d.vendedor_estado_civil !== 'Casado(a)' || !!d.vendedor_regime_bens, {
    message: 'Obrigatório para casado(a)',
    path: ['vendedor_regime_bens'],
  })
  .refine((d) => d.comprador_estado_civil !== 'Casado(a)' || !!d.comprador_regime_bens, {
    message: 'Obrigatório para casado(a)',
    path: ['comprador_regime_bens'],
  })
  .refine(
    (d) =>
      d.conjuge_vendedor_papel === 'nenhum' ||
      (d.conjuge_vendedor_nome && d.conjuge_vendedor_nome.length >= 3),
    { message: 'Nome do cônjuge obrigatório', path: ['conjuge_vendedor_nome'] },
  )
  .refine((d) => d.conjuge_vendedor_papel === 'nenhum' || !!d.conjuge_vendedor_cpf, {
    message: 'CPF do cônjuge obrigatório',
    path: ['conjuge_vendedor_cpf'],
  })
  // Todos estes entram na QUALIFICAÇÃO do preâmbulo. Vazio não dá erro — dá vírgula
  // solta no contrato ("Fulano, , casado(a)..."), que é pior porque passa despercebido.
  .refine((d) => d.conjuge_vendedor_papel === 'nenhum' || !!d.conjuge_vendedor_nacionalidade, {
    message: 'Obrigatório',
    path: ['conjuge_vendedor_nacionalidade'],
  })
  .refine((d) => d.conjuge_vendedor_papel === 'nenhum' || !!d.conjuge_vendedor_profissao, {
    message: 'Obrigatório',
    path: ['conjuge_vendedor_profissao'],
  })
  .refine((d) => d.conjuge_vendedor_papel === 'nenhum' || !!d.conjuge_vendedor_endereco, {
    message: 'Obrigatório',
    path: ['conjuge_vendedor_endereco'],
  })
  .refine(
    (d) =>
      d.conjuge_comprador_papel === 'nenhum' ||
      (d.conjuge_comprador_nome && d.conjuge_comprador_nome.length >= 3),
    { message: 'Nome do cônjuge obrigatório', path: ['conjuge_comprador_nome'] },
  )
  .refine((d) => d.conjuge_comprador_papel === 'nenhum' || !!d.conjuge_comprador_cpf, {
    message: 'CPF do cônjuge obrigatório',
    path: ['conjuge_comprador_cpf'],
  })
  .refine((d) => d.conjuge_comprador_papel === 'nenhum' || !!d.conjuge_comprador_nacionalidade, {
    message: 'Obrigatório',
    path: ['conjuge_comprador_nacionalidade'],
  })
  .refine((d) => d.conjuge_comprador_papel === 'nenhum' || !!d.conjuge_comprador_profissao, {
    message: 'Obrigatório',
    path: ['conjuge_comprador_profissao'],
  })
  .refine((d) => d.conjuge_comprador_papel === 'nenhum' || !!d.conjuge_comprador_endereco, {
    message: 'Obrigatório',
    path: ['conjuge_comprador_endereco'],
  })
  .refine(
    (d) => !d.has_interveniente || (d.interveniente_nome && d.interveniente_nome.length >= 3),
    { message: 'Nome obrigatório', path: ['interveniente_nome'] },
  )
  .refine((d) => !d.has_interveniente || (d.interveniente_cpf && d.interveniente_cpf.length >= 1), {
    message: 'CPF/CNPJ obrigatório',
    path: ['interveniente_cpf'],
  })

  // Duas partes distintas não podem carregar o mesmo CPF (ver `checarCpfRepetido`).
  // Cônjuges e interveniente só entram quando existem — fora disso os campos são
  // vazios e a checagem já os ignoraria, mas explicitar deixa a intenção clara.
  .superRefine((d, ctx) =>
    checarCpfRepetidoPlano(
      [
        { campo: 'vendedor_cpf', rotulo: 'o vendedor', nome: d.vendedor_nome, cpf: d.vendedor_cpf },
        ...(d.conjuge_vendedor_papel !== 'nenhum'
          ? [
              {
                campo: 'conjuge_vendedor_cpf',
                rotulo: 'o cônjuge do vendedor',
                nome: d.conjuge_vendedor_nome,
                cpf: d.conjuge_vendedor_cpf,
              },
            ]
          : []),
        ...(d.has_interveniente
          ? [
              {
                campo: 'interveniente_cpf',
                rotulo: 'o interveniente anuente',
                nome: d.interveniente_nome,
                cpf: d.interveniente_cpf,
              },
            ]
          : []),
        {
          campo: 'comprador_cpf',
          rotulo: 'o comprador',
          nome: d.comprador_nome,
          cpf: d.comprador_cpf,
        },
        ...(d.conjuge_comprador_papel !== 'nenhum'
          ? [
              {
                campo: 'conjuge_comprador_cpf',
                rotulo: 'o cônjuge do comprador',
                nome: d.conjuge_comprador_nome,
                cpf: d.conjuge_comprador_cpf,
              },
            ]
          : []),
      ],
      ctx,
    ),
  )

export type PromiseValues = z.infer<typeof promiseSchema>

// Sugestão de papel do cônjuge do VENDEDOR, por regime — mesma régua da À vista.
export function sugerirPapelConjuge(regime?: string): string {
  if (regime === 'Comunhão universal')
    return 'Comunhão universal: o cônjuge é meeiro do imóvel — sugerido CO-VENDEDOR.'
  if (regime === 'Separação total')
    return 'Separação total: em regra dispensa a outorga (art. 1.647). Inclua o cônjuge só se quiser reforço.'
  if (regime === 'Comunhão parcial')
    return 'Comunhão parcial: imóvel adquirido DEPOIS do casamento → co-vendedor; adquirido ANTES (bem particular) → anuente.'
  return 'Selecione o regime de bens para a sugestão. Na dúvida, inclua o cônjuge como anuente.'
}

// Lado do COMPRADOR: aqui não há outorga a dar (não se aliena, se adquire). A questão
// é se o cônjuge entra como co-adquirente — mesma régua da Proposta/Reserva.
export function sugerirPapelConjugeComprador(regime?: string): string {
  if (regime === 'Comunhão universal' || regime === 'Comunhão parcial')
    return 'Comunhão de bens: o imóvel entrará no patrimônio comum — sugerido CO-COMPRADOR.'
  if (regime === 'Separação total')
    return 'Separação total: a aquisição não integra o patrimônio do outro. Inclua o cônjuge só se comprarem juntos.'
  return 'Selecione o regime de bens para a sugestão.'
}

export const promiseMockData: PromiseValues = {
  vendedor_nome: 'Roberto Mendes Araújo',
  vendedor_nacionalidade: 'brasileiro(a)',
  vendedor_estado_civil: 'Casado(a)',
  vendedor_regime_bens: 'Comunhão parcial',
  vendedor_profissao: 'Médico',
  vendedor_cpf: '456.789.123-00',
  vendedor_endereco: 'Rua Voluntários da Pátria, 200, Botafogo, Rio de Janeiro/RJ, CEP 22270-010',
  // Vendedor casado em comunhão parcial → o mock demonstra a outorga completa,
  // senão o "Preencher dados de teste" entrega uma demo com CAS001 faltando.
  conjuge_vendedor_papel: 'anuente',
  conjuge_vendedor_nome: 'Cláudia Mendes Araújo',
  conjuge_vendedor_nacionalidade: 'brasileira',
  conjuge_vendedor_profissao: 'Professora',
  conjuge_vendedor_cpf: '456.789.124-91',
  conjuge_vendedor_endereco:
    'Rua Voluntários da Pátria, 200, Botafogo, Rio de Janeiro/RJ, CEP 22270-010',
  comprador_nome: 'Fernanda Souza Lima',
  comprador_nacionalidade: 'brasileiro(a)',
  comprador_estado_civil: 'Solteiro(a)',
  comprador_regime_bens: '',
  comprador_profissao: 'Engenheira',
  comprador_cpf: '321.654.987-11',
  comprador_endereco: 'Av. Brasil, 5000, Campinho, Rio de Janeiro/RJ, CEP 21310-000',
  conjuge_comprador_papel: 'nenhum',
  conjuge_comprador_nome: '',
  conjuge_comprador_nacionalidade: '',
  conjuge_comprador_profissao: '',
  conjuge_comprador_cpf: '',
  conjuge_comprador_endereco: '',
  has_interveniente: true,
  interveniente_nome: 'Construtora Lar Ideal Ltda',
  interveniente_cpf: '12.345.678/0001-90',
  imovel_descricao: 'Apartamento nº 801, Edifício Solar, 8º andar, com 2 vagas de garagem',
  imovel_endereco: 'Rua das Acácias, 150, Jacarepaguá, Rio de Janeiro/RJ',
  imovel_matricula: '78.456',
  imovel_cidade: 'Rio de Janeiro',
  imovel_estado: 'RJ',
  valor_venda: 'R$ 1.200.000,00',
  valor_sinal: 'R$ 120.000,00',
  comissao_percentual: '5',
  prazo_certidoes_dias: '10',
  tipo_arras: 'confirmatoria',
  saldo_pagamento: 'Financiamento Bancário',
}

interface BrokerInfo {
  name?: string
  creci?: string
}

// IPTU-RJ (TRI003): a clausula de atualizacao cadastral do IPTU so se aplica a
// imovel no MUNICIPIO do Rio de Janeiro. Normaliza acento, caixa e o sufixo "/RJ"
// antes de comparar, para "Rio de Janeiro", "Rio de Janeiro/RJ" etc. casarem.
function isMunicipioRio(cidade?: string): boolean {
  if (!cidade) return false
  const norm = cidade
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\/.*$/, '')
    .replace(/\s+/g, ' ')
    .trim()
  return norm === 'rio de janeiro'
}

export function buildPromiseTemplateData(
  dataBruta: PromiseValues,
  brokerBruto?: BrokerInfo | null,
): Record<string, string> {
  // Trim de entrada (ver `trimDeep`): um " R-9 " digitado no dossiê saía
  // "registrado sob o  R-9  da referida matrícula". Aqui, e não na saída, porque
  // os valores são costurados em frases antes de virar template data.
  const data = trimDeep(dataBruta)
  const broker = trimDeep(brokerBruto)
  const venda = parseCurrency(data.valor_venda)
  const sinal = parseCurrency(data.valor_sinal)
  const saldo = venda - sinal
  // A2: "5,5" parava na virgula no parseFloat -> 5. Normaliza a virgula BR.
  const comissaoPct = parseFloat(String(data.comissao_percentual || '0').replace(',', '.')) || 0
  const comissao = venda * (comissaoPct / 100)
  const tipoArras = data.tipo_arras === 'confirmatoria' ? 'CONFIRMATÓRIA' : 'PENITENCIAL'

  const fmt = (v: number) => cleanCurrencyMask(formatCurrency(v))

  // O cônjuge é do MESMO casamento: herda o regime da parte, não se pergunta duas vezes.
  const qualifConjuge = (regime?: string) => buildQualificacaoCivil('Casado(a)', regime)

  return {
    vendedor_nome: data.vendedor_nome,
    vendedor_nacionalidade: data.vendedor_nacionalidade,
    // ANTES: buildQualificacaoCivil(estado_civil) — sem o 2º argumento, caía no default
    // e o documento AFIRMAVA "comunhão parcial" para todo casado, sem nunca perguntar.
    vendedor_qualificacao_civil: buildQualificacaoCivil(
      data.vendedor_estado_civil,
      data.vendedor_regime_bens,
    ),
    vendedor_regime_bens: data.vendedor_regime_bens || '',
    vendedor_profissao: data.vendedor_profissao,
    vendedor_cpf: data.vendedor_cpf,
    vendedor_endereco: data.vendedor_endereco,
    conjuge_vendedor_papel: data.conjuge_vendedor_papel,
    conjuge_vendedor_nome: data.conjuge_vendedor_nome || '',
    conjuge_vendedor_nacionalidade: data.conjuge_vendedor_nacionalidade || '',
    conjuge_vendedor_qualificacao_civil: qualifConjuge(data.vendedor_regime_bens),
    conjuge_vendedor_profissao: data.conjuge_vendedor_profissao || '',
    conjuge_vendedor_cpf: data.conjuge_vendedor_cpf || '',
    conjuge_vendedor_endereco: data.conjuge_vendedor_endereco || '',
    comprador_nome: data.comprador_nome,
    comprador_nacionalidade: data.comprador_nacionalidade,
    comprador_qualificacao_civil: buildQualificacaoCivil(
      data.comprador_estado_civil,
      data.comprador_regime_bens,
    ),
    comprador_regime_bens: data.comprador_regime_bens || '',
    comprador_profissao: data.comprador_profissao,
    comprador_cpf: data.comprador_cpf,
    comprador_endereco: data.comprador_endereco,
    conjuge_comprador_papel: data.conjuge_comprador_papel,
    conjuge_comprador_nome: data.conjuge_comprador_nome || '',
    conjuge_comprador_nacionalidade: data.conjuge_comprador_nacionalidade || '',
    conjuge_comprador_qualificacao_civil: qualifConjuge(data.comprador_regime_bens),
    conjuge_comprador_profissao: data.conjuge_comprador_profissao || '',
    conjuge_comprador_cpf: data.conjuge_comprador_cpf || '',
    conjuge_comprador_endereco: data.conjuge_comprador_endereco || '',
    // Flag lida pelo montador do documento (promise-docx) para decidir a cláusula.
    has_interveniente: data.has_interveniente ? 'sim' : '',
    interveniente_nome: data.interveniente_nome || '',
    interveniente_cpf: data.interveniente_cpf || '',
    imovel_descricao: data.imovel_descricao,
    imovel_endereco: data.imovel_endereco,
    imovel_matricula: data.imovel_matricula,
    imovel_cidade: data.imovel_cidade,
    imovel_estado: data.imovel_estado,
    valor_venda: fmt(venda),
    valor_sinal: fmt(sinal),
    valor_saldo: fmt(saldo),
    valor_comissao: fmt(comissao),
    // Bonus Onda 1: decimal com virgula no documento (o input type=number
    // guarda "5.5" com ponto e o contrato saia "5.5%").
    comissao_percentual: String(data.comissao_percentual || '').replace('.', ','),
    prazo_certidoes_dias: data.prazo_certidoes_dias,
    tipo_arras: tipoArras,
    saldo_pagamento: data.saldo_pagamento,
    contratado_nome: broker?.name || 'Marcus Vinícius Freitas Godoy',
    contratado_creci: broker?.creci || '80.199 RJ',
    data_extenso: formatDateFull(new Date()).toLowerCase(),
    cidade_uf: `${data.imovel_cidade}/${data.imovel_estado}`,
    // Flag lida pelo promise-docx: liga a clausula IPTU-RJ (TRI003) so no municipio do Rio.
    iptu_rj: isMunicipioRio(data.imovel_cidade) ? 'sim' : '',
  }
}
