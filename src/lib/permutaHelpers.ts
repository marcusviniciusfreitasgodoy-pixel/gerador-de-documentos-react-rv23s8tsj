import { z } from 'zod'
import { parseCurrency, ESTADO_CIVIL_OPTIONS, REGIME_BENS_OPTIONS } from '@/lib/form-helpers'

export { ESTADO_CIVIL_OPTIONS, REGIME_BENS_OPTIONS }

export const TORNA_PAGADOR_OPTIONS = ['primeiro', 'segundo'] as const
export const COMISSAO_RESP_OPTIONS = ['primeiro', 'segundo', 'ambos'] as const
export const ARRAS_TIPO_OPTIONS = ['confirmatoria', 'penitencial'] as const

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
const anuenteSchema = partySchema.extend({ conjuge_de: z.string().optional() })

export type PartyValues = z.infer<typeof partySchema>
export type AnuenteValues = z.infer<typeof anuenteSchema>

const imovelFields = (req: string) => ({
  descricao: z.string().min(1, req),
  endereco: z.string().min(1, req),
  bairro: z.string().optional(),
  cidade: z.string().min(1, req),
  uf: z.string().min(1, req),
  cep: z.string().optional(),
  vagas_qtd: z.string().optional(),
  vagas_descricao: z.string().optional(),
  fracao_ideal: z.string().optional(),
  rgi: z.string().optional(),
  matricula: z.string().min(1, req),
  iptu: z.string().optional(),
})

export const permutaSchema = z
  .object({
    primeiros: z.array(partySchema).min(1, 'Ao menos um primeiro permutante'),
    segundos: z.array(partySchema).min(1, 'Ao menos um segundo permutante'),
    anuentes: z.array(anuenteSchema),

    imovel_a: z.object(imovelFields('Obrigatório')),
    valor_a: z
      .string()
      .min(1, 'Obrigatório')
      .refine((v) => parseCurrency(v) > 0, 'Maior que zero'),
    imovel_b: z.object(imovelFields('Obrigatório')),
    valor_b: z
      .string()
      .min(1, 'Obrigatório')
      .refine((v) => parseCurrency(v) > 0, 'Maior que zero'),

    tem_torna: z.boolean(),
    torna_pagador: z.enum(TORNA_PAGADOR_OPTIONS).optional(),
    torna_valor: z.string().optional(),
    torna_a_prazo: z.boolean(),
    torna_forma: z.string().optional(),
    torna_garantia: z.string().optional(),

    arras_tipo: z.enum(ARRAS_TIPO_OPTIONS),

    comissao_beneficiario: z.string().optional(),
    comissao_documento: z.string().optional(),
    comissao_creci: z.string().optional(),
    comissao_pix: z.string().optional(),
    comissao_percentual: z.string().optional(),
    comissao_responsavel: z.enum(COMISSAO_RESP_OPTIONS),

    foro_comarca: z.string().min(1, 'Obrigatório'),
    cidade: z.string().min(1, 'Obrigatório'),
    data_documento: z.string().min(1, 'Obrigatório'),

    testemunha1_nome: z.string().optional(),
    testemunha1_cpf: z.string().optional(),
    testemunha2_nome: z.string().optional(),
    testemunha2_cpf: z.string().optional(),
  })
  .superRefine((v, ctx) => {
    if (v.tem_torna) {
      if (!v.torna_pagador)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['torna_pagador'],
          message: 'Quem paga a torna?',
        })
      if (!v.torna_valor || parseCurrency(v.torna_valor) <= 0)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['torna_valor'],
          message: 'Valor da torna',
        })
      if (!v.torna_forma)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['torna_forma'],
          message: 'Forma de pagamento da torna',
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
      nome: 'João da Silva',
      nacionalidade: 'brasileiro',
      estado_civil: 'Casado(a)',
      regime_bens: 'Comunhão parcial',
      profissao: 'Empresário',
      rg: 'RJ-11.111.111',
      orgao_emissor: 'SSP/RJ',
      cpf: '111.111.111-11',
      endereco: 'Rua das Acácias, 10, Centro, Rio de Janeiro/RJ',
      email: '',
    },
  ],
  segundos: [
    {
      nome: 'Pedro Souza',
      nacionalidade: 'brasileiro',
      estado_civil: 'Solteiro(a)',
      regime_bens: '',
      profissao: 'Engenheiro',
      rg: 'RJ-33.333.333',
      orgao_emissor: 'SSP/RJ',
      cpf: '333.333.333-33',
      endereco: 'Av. das Américas, 200, Barra da Tijuca, Rio de Janeiro/RJ',
      email: '',
    },
  ],
  anuentes: [],
  imovel_a: {
    descricao: 'Apartamento nº 101 do Edifício Solar',
    endereco: 'Rua das Acácias, 10',
    bairro: 'Centro',
    cidade: 'Rio de Janeiro',
    uf: 'RJ',
    cep: '20000-000',
    vagas_qtd: '1',
    vagas_descricao: 'subsolo',
    fracao_ideal: '0,010',
    rgi: '9º RGI',
    matricula: '78.111',
    iptu: '1.111.111-1',
  },
  valor_a: 'R$ 500.000,00',
  imovel_b: {
    descricao: 'Casa nº 22 da Rua das Palmeiras',
    endereco: 'Rua das Palmeiras, 22',
    bairro: 'Barra da Tijuca',
    cidade: 'Rio de Janeiro',
    uf: 'RJ',
    cep: '22600-000',
    vagas_qtd: '2',
    vagas_descricao: 'garagem coberta',
    fracao_ideal: '',
    rgi: '9º RGI',
    matricula: '78.222',
    iptu: '2.222.222-2',
  },
  valor_b: 'R$ 650.000,00',
  tem_torna: true,
  torna_pagador: 'segundo',
  torna_valor: 'R$ 150.000,00',
  torna_a_prazo: false,
  torna_forma: 'transferência via PIX no ato',
  torna_garantia: '',
  arras_tipo: 'confirmatoria',
  comissao_beneficiario: '',
  comissao_documento: '',
  comissao_creci: '',
  comissao_pix: '',
  comissao_percentual: '6',
  comissao_responsavel: 'ambos',
  foro_comarca: 'Rio de Janeiro/RJ',
  cidade: 'Rio de Janeiro/RJ',
  data_documento: new Date().toISOString().split('T')[0],
  testemunha1_nome: 'Ana Lima',
  testemunha1_cpf: '444.444.444-44',
  testemunha2_nome: 'Carlos Dias',
  testemunha2_cpf: '555.555.555-55',
}
