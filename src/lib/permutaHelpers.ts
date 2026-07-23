import { z } from 'zod'
import {
  parseCurrency,
  checarCpfRepetido,
  ESTADO_CIVIL_OPTIONS,
  REGIME_BENS_OPTIONS,
} from '@/lib/form-helpers'

export { ESTADO_CIVIL_OPTIONS, REGIME_BENS_OPTIONS }

export const TORNA_PAGADOR_OPTIONS = ['primeiro', 'segundo'] as const
export const COMISSAO_RESP_OPTIONS = ['primeiro', 'segundo', 'ambos'] as const
export const ARRAS_TIPO_OPTIONS = ['confirmatoria', 'penitencial'] as const

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

    // Obrigatório: a cláusula da corretagem NÃO é condicional — ela imprime valor e
    // percentual de qualquer jeito. Vazio, o contrato saía "a comissão é devida a ,
    // inscrito(a) no , CRECI , ... no valor de R$ 60.000,00": obriga a pagar sessenta
    // mil a NINGUÉM. Mesmo buraco do PIX vazio das Partes A/B/C, em outro campo.
    // Na prática o `aplicarBroker` preenche do Perfil do Corretor — o que esta trava
    // pega é justamente o perfil incompleto, que hoje passa em silêncio.
    comissao_beneficiario: z.string().min(1, 'Obrigatório'),
    comissao_documento: z.string().optional(),
    comissao_creci: z.string().optional(),
    // Obrigatório pelo mesmo motivo: a cláusula manda pagar "mediante PIX para a
    // chave {comissao_pix}" sem condicional.
    comissao_pix: z.string().min(1, 'Obrigatório'),
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

  // Duas partes distintas não podem carregar o mesmo CPF (ver `checarCpfRepetido`).
  .superRefine((d, ctx) =>
    checarCpfRepetido(
      [
        { campo: 'primeiros', rotulo: 'o primeiro permutante', partes: d.primeiros || [] },
        { campo: 'anuentes', rotulo: 'o anuente', partes: d.anuentes || [] },
        { campo: 'segundos', rotulo: 'o segundo permutante', partes: d.segundos || [] },
      ],
      ctx,
    ),
  )

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
  anuentes: [
    {
      nome: 'Maria da Silva',
      nacionalidade: 'brasileira',
      estado_civil: 'Casado(a)',
      regime_bens: 'Comunhão parcial',
      profissao: 'Médica',
      rg: 'RJ-22.222.222',
      orgao_emissor: 'SSP/RJ',
      cpf: '222.222.222-22',
      endereco: 'Rua das Acácias, 10, Centro, Rio de Janeiro/RJ',
      email: '',
      conjuge_de: 'João da Silva',
    },
  ],
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

const emptyImovel = {
  descricao: '',
  endereco: '',
  bairro: '',
  cidade: '',
  uf: '',
  cep: '',
  vagas_qtd: '',
  vagas_descricao: '',
  fracao_ideal: '',
  rgi: '',
  matricula: '',
  iptu: '',
}

// Form abre vazio: mesma shape do mock, sem dados fictícios.
// Mantém (via spread) nacionalidade, enums (arras_tipo/comissao_responsavel), comissão do perfil, foro/cidade, data_documento.
// Zera tem_torna (vinha true no mock) para não exigir valor da torna num form recém-aberto.
export const permutaEmptyData: PermutaValues = {
  ...permutaMockData,
  foro_comarca: '',
  primeiros: [{ ...emptyParty }],
  segundos: [{ ...emptyParty }],
  anuentes: [],
  imovel_a: { ...emptyImovel },
  imovel_b: { ...emptyImovel },
  valor_a: '',
  valor_b: '',
  tem_torna: false,
  torna_valor: '',
  torna_forma: '',
  torna_garantia: '',
  testemunha1_nome: '',
  testemunha1_cpf: '',
  testemunha2_nome: '',
  testemunha2_cpf: '',
}
