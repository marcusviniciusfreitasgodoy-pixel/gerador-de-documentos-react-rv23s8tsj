import { z } from 'zod'
import { parseCurrency, ESTADO_CIVIL_OPTIONS, REGIME_BENS_OPTIONS } from '@/lib/form-helpers'

export { ESTADO_CIVIL_OPTIONS, REGIME_BENS_OPTIONS }

export const COMISSAO_RESPONSAVEL_OPTIONS = ['proprietario', 'proponente'] as const

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

export const reservaPropostaSchema = z.object({
  proponentes: z.array(partySchema).min(1, 'Ao menos um proponente'),
  anuentes: z.array(anuenteSchema),
  proprietarios: z.array(partySchema).min(1, 'Ao menos um proprietário'),
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
  valor_proposto: z
    .string()
    .min(1, 'Obrigatório')
    .refine((v) => parseCurrency(v) > 0, 'Maior que zero'),
  forma_pagamento: z.string().min(1, 'Obrigatório'),
  valor_sinal: z
    .string()
    .min(1, 'Obrigatório')
    .refine((v) => parseCurrency(v) > 0, 'Maior que zero'),
  dados_recebimento: z.string().min(1, 'Obrigatório'),
  prazo_devolucao_dias: z.string().min(1, 'Obrigatório'),
  prazo_validade_dias: z.string().min(1, 'Obrigatório'),
  prazo_promessa_dias: z.string().min(1, 'Obrigatório'),
  tem_contingencias: z.boolean(),
  cont_financiamento: z.boolean(),
  cont_certidoes: z.boolean(),
  cont_vistoria: z.boolean(),
  comissao_beneficiario: z.string().optional(),
  comissao_documento: z.string().optional(),
  comissao_creci: z.string().optional(),
  comissao_pix: z.string().optional(),
  comissao_percentual: z.string().optional(),
  comissao_responsavel: z.enum(COMISSAO_RESPONSAVEL_OPTIONS),
  data_documento: z.string().min(1, 'Obrigatório'),
  testemunha1_nome: z.string().optional(),
  testemunha1_cpf: z.string().optional(),
  testemunha2_nome: z.string().optional(),
  testemunha2_cpf: z.string().optional(),
})

export type ReservaPropostaValues = z.infer<typeof reservaPropostaSchema>

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

export const reservaPropostaMockData: ReservaPropostaValues = {
  proponentes: [
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
  proprietarios: [
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
  valor_proposto: 'R$ 1.150.000,00',
  forma_pagamento:
    'sinal de R$ 50.000,00 na assinatura e saldo de R$ 1.100.000,00 na escritura, à vista',
  valor_sinal: 'R$ 50.000,00',
  dados_recebimento: 'PIX para a chave fernanda.lima@email.com',
  prazo_devolucao_dias: '5',
  prazo_validade_dias: '10',
  prazo_promessa_dias: '15',
  tem_contingencias: true,
  cont_financiamento: false,
  cont_certidoes: true,
  cont_vistoria: true,
  comissao_beneficiario: '',
  comissao_documento: '',
  comissao_creci: '',
  comissao_pix: '',
  comissao_percentual: '5',
  comissao_responsavel: 'proprietario',
  data_documento: new Date().toISOString().split('T')[0],
  testemunha1_nome: 'Pedro Alves Lima',
  testemunha1_cpf: '111.222.333-44',
  testemunha2_nome: 'Maria Fernanda Rocha',
  testemunha2_cpf: '555.666.777-88',
}
