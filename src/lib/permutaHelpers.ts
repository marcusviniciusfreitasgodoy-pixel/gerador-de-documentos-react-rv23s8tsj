import { z } from 'zod'
import { parseCurrency, ESTADO_CIVIL_OPTIONS, REGIME_BENS_OPTIONS } from '@/lib/form-helpers'

export { ESTADO_CIVIL_OPTIONS, REGIME_BENS_OPTIONS }

export const TORNA_FORMA_OPTIONS = ['À vista', 'Parcelada'] as const
export const TORNA_DEVEDOR_OPTIONS = ['Primeiros Permutantes', 'Segundos Permutantes'] as const

const partySchema = z.object({
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

export const permutaSchema = z
  .object({
    primeiros: z.array(partySchema).min(1, 'Ao menos um primeiro permutante'),
    segundos: z.array(partySchema).min(1, 'Ao menos um segundo permutante'),
    anuentes: z.array(anuenteSchema),

    imovel_a_descricao: z.string().min(1, 'Obrigatório'),
    imovel_a_endereco: z.string().min(1, 'Obrigatório'),
    imovel_a_matricula: z.string().min(1, 'Obrigatório'),
    imovel_a_rgi: z.string().min(1, 'Obrigatório'),
    imovel_a_iptu: z.string().optional(),
    valor_a: z
      .string()
      .min(1, 'Obrigatório')
      .refine((v) => parseCurrency(v) > 0, 'Maior que zero'),

    imovel_b_descricao: z.string().min(1, 'Obrigatório'),
    imovel_b_endereco: z.string().min(1, 'Obrigatório'),
    imovel_b_matricula: z.string().min(1, 'Obrigatório'),
    imovel_b_rgi: z.string().min(1, 'Obrigatório'),
    imovel_b_iptu: z.string().optional(),
    valor_b: z
      .string()
      .min(1, 'Obrigatório')
      .refine((v) => parseCurrency(v) > 0, 'Maior que zero'),

    has_torna: z.boolean(),
    torna_valor: z.string().optional(),
    torna_devedor: z.string().optional(),
    torna_forma_pagamento: z.string().optional(),
    torna_prazo: z.string().optional(),
    torna_garantia: z.string().optional(),

    comissao_percentual: z.string().min(1, 'Obrigatório'),
    comissao_beneficiario: z.string().optional(),
    comissao_documento: z.string().optional(),
    comissao_creci: z.string().optional(),
    comissao_pix: z.string().optional(),

    foro_comarca: z.string().min(1, 'Obrigatório'),
    cidade: z.string().min(1, 'Obrigatório'),
    data_documento: z.string().min(1, 'Obrigatório'),

    testemunha1_nome: z.string().optional(),
    testemunha1_cpf: z.string().optional(),
    testemunha2_nome: z.string().optional(),
    testemunha2_cpf: z.string().optional(),
  })
  .superRefine((v, ctx) => {
    if (v.has_torna) {
      if (!v.torna_valor || parseCurrency(v.torna_valor) <= 0)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['torna_valor'],
          message: 'Informe o valor da torna',
        })
      if (!v.torna_devedor)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['torna_devedor'],
          message: 'Informe o devedor',
        })
      if (!v.torna_forma_pagamento)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['torna_forma_pagamento'],
          message: 'Informe a forma de pagamento',
        })
      if (!v.torna_prazo)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['torna_prazo'],
          message: 'Informe o prazo',
        })
    }
  })

export type PermutaValues = z.infer<typeof permutaSchema>

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

export const permutaMockData: PermutaValues = {
  primeiros: [
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
  segundos: [
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
  anuentes: [],
  imovel_a_descricao: 'Apartamento nº 801, Edifício Solar, 8º andar',
  imovel_a_endereco: 'Rua das Acácias, 150, Jacarepaguá, Rio de Janeiro/RJ',
  imovel_a_matricula: '78.456',
  imovel_a_rgi: '6º Oficial de Registro de Imóveis',
  imovel_a_iptu: '001.234.567-8',
  valor_a: 'R$ 1.200.000,00',
  imovel_b_descricao: 'Casa nº 45, Vila Mariana',
  imovel_b_endereco: 'Rua dos Eucaliptos, 45, Vila Mariana, São Paulo/SP',
  imovel_b_matricula: '123.789',
  imovel_b_rgi: '1º Cartório de Registro de Imóveis',
  imovel_b_iptu: '098.765.432-1',
  valor_b: 'R$ 950.000,00',
  has_torna: true,
  torna_valor: 'R$ 250.000,00',
  torna_devedor: 'Segundos Permutantes',
  torna_forma_pagamento: 'À vista',
  torna_prazo: '30 (trinta) dias contados da assinatura do instrumento',
  torna_garantia: 'Hipoteca sobre o imóvel B',
  comissao_percentual: '5',
  comissao_beneficiario: '',
  comissao_documento: '',
  comissao_creci: '',
  comissao_pix: '',
  foro_comarca: 'Rio de Janeiro/RJ',
  cidade: 'Rio de Janeiro/RJ',
  data_documento: new Date().toISOString().split('T')[0],
  testemunha1_nome: 'Pedro Alves Lima',
  testemunha1_cpf: '111.222.333-44',
  testemunha2_nome: 'Maria Fernanda Rocha',
  testemunha2_cpf: '555.666.777-88',
}
