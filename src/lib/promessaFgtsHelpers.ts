import { z } from 'zod'
import {
  parseCurrency,
  checarCpfRepetido,
  ESTADO_CIVIL_OPTIONS,
  REGIME_BENS_OPTIONS,
} from '@/lib/form-helpers'

export { ESTADO_CIVIL_OPTIONS, REGIME_BENS_OPTIONS }

export const FORMA_PAGAMENTO_OPTIONS = ['PIX', 'TED', 'Transferência'] as const

export const COMISSAO_RESPONSAVEL_OPTIONS = ['vendedor', 'comprador'] as const

const partySchema = z.object({
  // C4: âncora da volta pro dossiê. Não aparece na tela — é só transporte.
  // Precisa ser opcional: parte adicionada à mão pelo corretor não tem _id,
  // e por decisão (c) ela é ignorada na volta em vez de virar erro.
  _id: z.string().optional(),
  nome: z.string().min(3, 'Nome obrigatório'),
  nacionalidade: z.string().min(1, 'Obrigatório'),
  estado_civil: z.string().min(1, 'Selecione'),
  regime_bens: z.string().optional(),
  profissao: z.string().min(1, 'Obrigatório'),
  rg: z.string().min(1, 'Obrigatório'),
  orgao_emissor: z.string().min(1, 'Obrigatório'),
  cpf: z.string().min(1, 'Obrigatório'),
  endereco: z.string().min(1, 'Obrigatório'),
  email: z.string().optional(),
})

const anuenteSchema = partySchema.extend({
  conjuge_de: z.string().optional(),
})

export type PartyValues = z.infer<typeof partySchema>
export type AnuenteValues = z.infer<typeof anuenteSchema>

export const promessaFgtsSchema = z
  .object({
    vendedores: z.array(partySchema).min(1, 'Ao menos um vendedor'),
    anuentes: z.array(anuenteSchema),
    compradores: z.array(partySchema).min(1, 'Ao menos um comprador'),
    imovel_descricao: z.string().min(1, 'Obrigatório'),
    imovel_endereco: z.string().min(1, 'Obrigatório'),
    imovel_bairro: z.string().optional(),
    imovel_cidade: z.string().min(1, 'Obrigatório'),
    imovel_uf: z.string().min(1, 'Obrigatório'),
    foro_comarca: z.string().min(1, 'Obrigatório'),
    imovel_cep: z.string().optional(),
    imovel_vagas_qtd: z.string().optional(),
    imovel_vagas_descricao: z.string().optional(),
    imovel_fracao_ideal: z.string().optional(),
    imovel_rgi: z.string().optional(),
    imovel_matricula: z.string().min(1, 'Obrigatório'),
    imovel_iptu: z.string().optional(),
    imovel_origem_aquisicao: z.string().optional(),
    imovel_origem_registro: z.string().optional(),
    valor_total: z
      .string()
      .min(1, 'Obrigatório')
      .refine((v) => parseCurrency(v) > 0, 'Maior que zero'),
    valor_entrada: z
      .string()
      .min(1, 'Obrigatório')
      .refine((v) => parseCurrency(v) > 0, 'Maior que zero'),
    entrada_parcelada: z.boolean(),
    valor_reforco: z.string().optional(),
    prazo_reforco: z.string().optional(),
    valor_fgts: z
      .string()
      .min(1, 'Obrigatório')
      .refine((v) => parseCurrency(v) > 0, 'Maior que zero'),
    data_limite_escritura: z.string().min(1, 'Obrigatório'),
    forma_pagamento: z.enum(FORMA_PAGAMENTO_OPTIONS),
    // Obrigatório: as Partes da Cláusula Quinta dizem "por meio de {forma_pagamento}
    // para {dados_recebimento}". Vazio, o contrato saía "por meio de PIX para ."
    // — promessa milionária sem dizer para onde pagar, e nada avisava.
    // A Proposta/Reserva já exigia; as promessas, não.
    dados_recebimento: z.string().min(1, 'Obrigatório'),
    prazo_certidoes_dias: z.string().min(1, 'Obrigatório'),
    comissao_beneficiario: z.string().optional(),
    comissao_documento: z.string().optional(),
    comissao_creci: z.string().optional(),
    comissao_pix: z.string().optional(),
    comissao_percentual: z.string().min(1, 'Obrigatório'),
    comissao_responsavel: z.enum(COMISSAO_RESPONSAVEL_OPTIONS),
    tipo_arras: z.enum(['confirmatoria', 'penitencial']),
    data_documento: z.string().min(1, 'Obrigatório'),
    testemunha1_nome: z.string().optional(),
    testemunha1_cpf: z.string().optional(),
    testemunha2_nome: z.string().optional(),
    testemunha2_cpf: z.string().optional(),
  })
  .refine((d) => !d.entrada_parcelada || parseCurrency(d.valor_reforco || '') > 0, {
    message: 'Informe o reforço',
    path: ['valor_reforco'],
  })
  .refine((d) => !d.entrada_parcelada || !!d.prazo_reforco, {
    message: 'Informe o prazo do reforço',
    path: ['prazo_reforco'],
  })
  // C1: sem esta trava, entrada+reforco+FGTS MAIORES que o total faziam o
  // template cair no Math.max(0, ...) e imprimir "saldo R$ 0,00" no contrato,
  // silenciosamente. Espelha a conta do buildPromessaFgtsTemplateData.
  .refine(
    (d) =>
      parseCurrency(d.valor_entrada || '0') +
        parseCurrency(d.valor_reforco || '0') +
        parseCurrency(d.valor_fgts || '0') <=
      parseCurrency(d.valor_total || '0'),
    {
      message: 'Entrada + reforço + FGTS não podem exceder o valor total',
      path: ['valor_entrada'],
    },
  )

  // Duas partes distintas não podem carregar o mesmo CPF (ver `checarCpfRepetido`).
  .superRefine((d, ctx) =>
    checarCpfRepetido(
      [
        { campo: 'vendedores', rotulo: 'o vendedor', partes: d.vendedores || [] },
        { campo: 'anuentes', rotulo: 'o anuente', partes: d.anuentes || [] },
        { campo: 'compradores', rotulo: 'o comprador', partes: d.compradores || [] },
      ],
      ctx,
    ),
  )

export type PromessaFgtsValues = z.infer<typeof promessaFgtsSchema>

export const emptyParty: PartyValues = {
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

export const promessaFgtsMockData: PromessaFgtsValues = {
  vendedores: [
    {
      nome: 'Roberto Mendes Araújo',
      nacionalidade: 'brasileiro',
      estado_civil: 'Casado(a)',
      regime_bens: 'Comunhão parcial',
      profissao: 'Médico',
      rg: 'MG-15.234.567',
      orgao_emissor: 'SSP/MG',
      cpf: '456.789.123-00',
      endereco: 'Rua Voluntários da Pátria, 200, Botafogo, Rio de Janeiro/RJ, CEP 22270-010',
      email: 'roberto.araujo@email.com',
    },
  ],
  anuentes: [],
  compradores: [
    {
      nome: 'Fernanda Souza Lima',
      nacionalidade: 'brasileira',
      estado_civil: 'Solteiro(a)',
      regime_bens: '',
      profissao: 'Engenheira',
      rg: 'RJ-20.987.654',
      orgao_emissor: 'SSP/RJ',
      cpf: '987.654.321-00',
      endereco: 'Av. das Américas, 789, Barra da Tijuca, Rio de Janeiro/RJ, CEP 22640-100',
      email: 'fernanda.lima@email.com',
    },
  ],
  imovel_descricao: 'Apartamento nº 801, Edifício Solar, 8º andar',
  imovel_endereco: 'Rua das Acácias, 150',
  imovel_bairro: 'Jacarepaguá',
  imovel_cidade: 'Rio de Janeiro',
  imovel_uf: 'RJ',
  foro_comarca: 'Rio de Janeiro',
  imovel_cep: '22750-000',
  imovel_vagas_qtd: '1',
  imovel_vagas_descricao: 'coberta, numerada 12',
  imovel_fracao_ideal: '0,0085%',
  imovel_rgi: '6º Oficial de Registro de Imóveis',
  imovel_matricula: '78.456',
  imovel_iptu: '001.234.567-8',
  imovel_origem_aquisicao: 'Escritura lavrada em 15/03/2018, no livro 1.234, fls. 56',
  imovel_origem_registro: 'R-9',
  valor_total: 'R$ 900.000,00',
  valor_entrada: 'R$ 200.000,00',
  entrada_parcelada: false,
  valor_reforco: '',
  prazo_reforco: '',
  valor_fgts: 'R$ 100.000,00',
  data_limite_escritura: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
  forma_pagamento: 'PIX',
  dados_recebimento: 'PIX para a chave roberto.araujo@email.com',
  prazo_certidoes_dias: '10',
  comissao_beneficiario: '',
  comissao_documento: '',
  comissao_creci: '',
  comissao_pix: '',
  comissao_percentual: '5',
  comissao_responsavel: 'comprador',
  tipo_arras: 'confirmatoria',
  data_documento: new Date().toISOString().split('T')[0],
  testemunha1_nome: 'Pedro Alves Lima',
  testemunha1_cpf: '111.222.333-44',
  testemunha2_nome: 'Maria Fernanda Rocha',
  testemunha2_cpf: '555.666.777-88',
}

// Form abre vazio: mesma shape do mock, sem dados fictícios.
// Mantém (via spread) nacionalidade, enums, comissão do perfil, datas (data_limite_escritura) e toggles em false.
export const promessaFgtsEmptyData: PromessaFgtsValues = {
  ...promessaFgtsMockData,
  vendedores: [{ ...emptyParty }],
  compradores: [{ ...emptyParty }],
  anuentes: [],
  imovel_descricao: '',
  imovel_endereco: '',
  imovel_bairro: '',
  imovel_cidade: '',
  imovel_uf: '',
  foro_comarca: '',
  imovel_cep: '',
  imovel_vagas_qtd: '',
  imovel_vagas_descricao: '',
  imovel_fracao_ideal: '',
  imovel_rgi: '',
  imovel_matricula: '',
  imovel_iptu: '',
  imovel_origem_aquisicao: '',
  imovel_origem_registro: '',
  valor_total: '',
  valor_entrada: '',
  valor_fgts: '',
  dados_recebimento: '',
  prazo_certidoes_dias: '',
  testemunha1_nome: '',
  testemunha1_cpf: '',
  testemunha2_nome: '',
  testemunha2_cpf: '',
}
