import { z } from 'zod'
import {
  parseCurrency,
  formatCurrency,
  cleanCurrencyMask,
  formatDateFull,
  buildQualificacaoCivil,
  ESTADO_CIVIL_OPTIONS,
} from '@/lib/form-helpers'

export { ESTADO_CIVIL_OPTIONS }

export const SALDO_PAGAMENTO_OPTIONS = ['Financiamento Bancário', 'Recursos Próprios'] as const

export const promiseSchema = z
  .object({
    vendedor_nome: z.string().min(3, 'Nome obrigatório (mín. 3 caracteres)'),
    vendedor_nacionalidade: z.string().min(1, 'Obrigatório'),
    vendedor_estado_civil: z.string().min(1, 'Selecione o estado civil'),
    vendedor_profissao: z.string().min(1, 'Obrigatório'),
    vendedor_cpf: z.string().min(1, 'Obrigatório'),
    vendedor_endereco: z.string().min(1, 'Obrigatório'),
    comprador_nome: z.string().min(3, 'Nome obrigatório (mín. 3 caracteres)'),
    comprador_nacionalidade: z.string().min(1, 'Obrigatório'),
    comprador_estado_civil: z.string().min(1, 'Selecione o estado civil'),
    comprador_profissao: z.string().min(1, 'Obrigatório'),
    comprador_cpf: z.string().min(1, 'Obrigatório'),
    comprador_endereco: z.string().min(1, 'Obrigatório'),
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
    tipo_arras: z.enum(['confirmatoria', 'penitencial']),
    saldo_pagamento: z.enum(SALDO_PAGAMENTO_OPTIONS),
  })
  .refine((d) => parseCurrency(d.valor_sinal) <= parseCurrency(d.valor_venda), {
    message: 'Sinal não pode exceder o valor de venda',
    path: ['valor_sinal'],
  })
  .refine(
    (d) => !d.has_interveniente || (d.interveniente_nome && d.interveniente_nome.length >= 3),
    { message: 'Nome obrigatório', path: ['interveniente_nome'] },
  )
  .refine((d) => !d.has_interveniente || (d.interveniente_cpf && d.interveniente_cpf.length >= 1), {
    message: 'CPF/CNPJ obrigatório',
    path: ['interveniente_cpf'],
  })

export type PromiseValues = z.infer<typeof promiseSchema>

export const promiseMockData: PromiseValues = {
  vendedor_nome: 'Roberto Mendes Araújo',
  vendedor_nacionalidade: 'brasileiro(a)',
  vendedor_estado_civil: 'Casado(a)',
  vendedor_profissao: 'Médico',
  vendedor_cpf: '456.789.123-00',
  vendedor_endereco: 'Rua Voluntários da Pátria, 200, Botafogo, Rio de Janeiro/RJ, CEP 22270-010',
  comprador_nome: 'Fernanda Souza Lima',
  comprador_nacionalidade: 'brasileiro(a)',
  comprador_estado_civil: 'Solteiro(a)',
  comprador_profissao: 'Engenheira',
  comprador_cpf: '321.654.987-11',
  comprador_endereco: 'Av. Brasil, 5000, Campinho, Rio de Janeiro/RJ, CEP 21310-000',
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
  tipo_arras: 'confirmatoria',
  saldo_pagamento: 'Financiamento Bancário',
}

interface BrokerInfo {
  name?: string
  creci?: string
}

export function buildPromiseTemplateData(
  data: PromiseValues,
  broker?: BrokerInfo | null,
): Record<string, string> {
  const venda = parseCurrency(data.valor_venda)
  const sinal = parseCurrency(data.valor_sinal)
  const saldo = venda - sinal
  const comissaoPct = parseFloat(data.comissao_percentual) || 0
  const comissao = venda * (comissaoPct / 100)
  const tipoArras = data.tipo_arras === 'confirmatoria' ? 'CONFIRMATÓRIA' : 'PENITENCIAL'

  const fmt = (v: number) => cleanCurrencyMask(formatCurrency(v))

  const intervenienteClause = data.has_interveniente
    ? `CLÁUSULA 6ª — DO INTERVENIENTE ANUENTE. Intervém no presente instrumento, como INTERVENIENTE ANUENTE, ${data.interveniente_nome || ''}, inscrito(a) no CPF/CNPJ sob o nº ${data.interveniente_cpf || ''}, que concorda com todos os termos e condições aqui estabelecidos, ciente de que o imóvel objeto deste instrumento será transmitido ao PROMITENTE COMPRADOR, renunciando a quaisquer direitos que possam eventualmente titular sobre o referido imóvel.`
    : ''

  return {
    vendedor_nome: data.vendedor_nome,
    vendedor_nacionalidade: data.vendedor_nacionalidade,
    vendedor_qualificacao_civil: buildQualificacaoCivil(data.vendedor_estado_civil),
    vendedor_profissao: data.vendedor_profissao,
    vendedor_cpf: data.vendedor_cpf,
    vendedor_endereco: data.vendedor_endereco,
    comprador_nome: data.comprador_nome,
    comprador_nacionalidade: data.comprador_nacionalidade,
    comprador_qualificacao_civil: buildQualificacaoCivil(data.comprador_estado_civil),
    comprador_profissao: data.comprador_profissao,
    comprador_cpf: data.comprador_cpf,
    comprador_endereco: data.comprador_endereco,
    check_interveniente: intervenienteClause,
    imovel_descricao: data.imovel_descricao,
    imovel_endereco: data.imovel_endereco,
    imovel_matricula: data.imovel_matricula,
    imovel_cidade: data.imovel_cidade,
    imovel_estado: data.imovel_estado,
    valor_venda: fmt(venda),
    valor_sinal: fmt(sinal),
    valor_saldo: fmt(saldo),
    valor_comissao: fmt(comissao),
    comissao_percentual: data.comissao_percentual,
    tipo_arras: tipoArras,
    saldo_pagamento: data.saldo_pagamento,
    contratado_nome: broker?.name || 'Marcus Vinícius Freitas Godoy',
    contratado_creci: broker?.creci || '80.199 RJ',
    data_extenso: formatDateFull(new Date()).toLowerCase(),
    cidade_uf: `${data.imovel_cidade}/${data.imovel_estado}`,
  }
}
