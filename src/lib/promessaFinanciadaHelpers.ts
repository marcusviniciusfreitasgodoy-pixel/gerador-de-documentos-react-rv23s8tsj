import { z } from 'zod'
import { parseCurrency, ESTADO_CIVIL_OPTIONS, REGIME_BENS_OPTIONS } from '@/lib/form-helpers'

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

export const promessaFinanciadaSchema = z
  .object({
    vendedores: z.array(partySchema).min(1, 'Ao menos um vendedor'),
    anuentes: z.array(anuenteSchema),
    compradores: z.array(partySchema).min(1, 'Ao menos um comprador'),
    imovel_descricao: z.string().min(1, 'Obrigatório'),
    imovel_endereco: z.string().min(1, 'Obrigatório'),
    imovel_bairro: z.string().optional(),
    imovel_cidade: z.string().min(1, 'Obrigatório'),
    imovel_uf: z.string().min(1, 'Obrigatório'),
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
    valor_financiamento: z
      .string()
      .min(1, 'Obrigatório')
      .refine((v) => parseCurrency(v) > 0, 'Maior que zero'),
    instituicao_financeira: z.string().min(1, 'Obrigatório'),
    prazo_financiamento: z.string().min(1, 'Obrigatório'),
    prazo_liberacao: z.string().min(1, 'Obrigatório'),
    quita_divida_existente: z.boolean(),
    credor_divida: z.string().optional(),
    valor_divida: z.string().optional(),
    usa_fgts: z.boolean(),
    valor_fgts: z.string().optional(),
    forma_pagamento: z.enum(FORMA_PAGAMENTO_OPTIONS),
    dados_recebimento: z.string().optional(),
    prazo_certidoes_dias: z.string().min(1, 'Obrigatório'),
    comissao_beneficiario: z.string().optional(),
    comissao_documento: z.string().optional(),
    comissao_creci: z.string().optional(),
    comissao_pix: z.string().optional(),
    comissao_percentual: z.string().min(1, 'Obrigatório'),
    comissao_responsavel: z.enum(COMISSAO_RESPONSAVEL_OPTIONS),
    tipo_arras: z.enum(['confirmatoria', 'penitencial']),
    foro_comarca: z.string().min(1, 'Obrigatório'),
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
  .refine((d) => !d.quita_divida_existente || !!d.credor_divida, {
    message: 'Informe o credor',
    path: ['credor_divida'],
  })
  .refine((d) => !d.quita_divida_existente || parseCurrency(d.valor_divida || '') > 0, {
    message: 'Informe o valor da dívida',
    path: ['valor_divida'],
  })
  .refine((d) => !d.usa_fgts || parseCurrency(d.valor_fgts || '') > 0, {
    message: 'Informe o valor do FGTS',
    path: ['valor_fgts'],
  })

export type PromessaFinanciadaValues = z.infer<typeof promessaFinanciadaSchema>

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

export const promessaFinanciadaMockData: PromessaFinanciadaValues = {
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
  // Cônjuge do Roberto (Casado/Comunhão parcial): sem ele, o "Preencher dados de
  // teste" dispara a outorga automática (CAS002) e entrega um bloco de anuente com
  // o nome EM BRANCO — demo pela metade. Mesmo padrão do mock da Permuta.
  anuentes: [
    {
      nome: 'Cláudia Mendes Araújo',
      nacionalidade: 'brasileira',
      estado_civil: 'Casado(a)',
      regime_bens: 'Comunhão parcial',
      profissao: 'Professora',
      rg: 'MG-15.234.568',
      orgao_emissor: 'SSP/MG',
      cpf: '456.789.124-91',
      endereco: 'Rua Voluntários da Pátria, 200, Botafogo, Rio de Janeiro/RJ, CEP 22270-010',
      email: 'claudia.araujo@email.com',
      conjuge_de: 'Roberto Mendes Araújo',
    },
  ],
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
  imovel_cep: '22750-000',
  imovel_vagas_qtd: '2',
  imovel_vagas_descricao: 'cobertas, numeradas 12 e 13',
  imovel_fracao_ideal: '0,0085%',
  imovel_rgi: '6º Oficial de Registro de Imóveis',
  imovel_matricula: '78.456',
  imovel_iptu: '001.234.567-8',
  imovel_origem_aquisicao: 'Escritura lavrada em 15/03/2018, no livro 1.234, fls. 56',
  imovel_origem_registro: 'R-9',
  valor_total: 'R$ 900.000,00',
  valor_entrada: 'R$ 268.000,00',
  entrada_parcelada: false,
  valor_reforco: '',
  prazo_reforco: '',
  valor_financiamento: 'R$ 632.000,00',
  instituicao_financeira: 'Banco Itaú Unibanco S.A.',
  prazo_financiamento: '60',
  prazo_liberacao: '30',
  quita_divida_existente: false,
  credor_divida: '',
  valor_divida: '',
  usa_fgts: false,
  valor_fgts: '',
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
  foro_comarca: 'Rio de Janeiro',
  data_documento: new Date().toISOString().split('T')[0],
  testemunha1_nome: 'Pedro Alves Lima',
  testemunha1_cpf: '111.222.333-44',
  testemunha2_nome: 'Maria Fernanda Rocha',
  testemunha2_cpf: '555.666.777-88',
}

// Form abre vazio: mesma shape do mock, sem dados fictícios.
// Mantém (via spread) nacionalidade, enums, comissão do perfil, datas e os toggles em false.
export const promessaFinanciadaEmptyData: PromessaFinanciadaValues = {
  ...promessaFinanciadaMockData,
  vendedores: [{ ...emptyParty }],
  compradores: [{ ...emptyParty }],
  anuentes: [],
  imovel_descricao: '',
  imovel_endereco: '',
  imovel_bairro: '',
  imovel_cidade: '',
  imovel_uf: '',
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
  valor_financiamento: '',
  instituicao_financeira: '',
  prazo_financiamento: '',
  prazo_liberacao: '',
  dados_recebimento: '',
  prazo_certidoes_dias: '',
  foro_comarca: '',
  testemunha1_nome: '',
  testemunha1_cpf: '',
  testemunha2_nome: '',
  testemunha2_cpf: '',
}
