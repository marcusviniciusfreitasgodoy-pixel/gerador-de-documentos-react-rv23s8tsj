import { z } from 'zod'
import { parseCurrency, ESTADO_CIVIL_OPTIONS, REGIME_BENS_OPTIONS } from '@/lib/form-helpers'

export { ESTADO_CIVIL_OPTIONS, REGIME_BENS_OPTIONS }

export const COMISSAO_DESTINO_OPTIONS = [
  'retida_corretor',
  'devolvida_pagador',
  'paga_especifico',
] as const

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

export const distratoSchema = z
  .object({
    vendedores: z.array(partySchema).min(1, 'Ao menos um vendedor'),
    compradores: z.array(partySchema).min(1, 'Ao menos um comprador'),
    anuentes: z.array(anuenteSchema),
    contrato_originario_tipo: z.string().min(1, 'Obrigatório'),
    contrato_originario_data: z.string().min(1, 'Obrigatório'),
    contrato_originario_registro: z.string().optional(),
    imovel_descricao: z.string().min(1, 'Obrigatório'),
    imovel_endereco: z.string().min(1, 'Obrigatório'),
    imovel_bairro: z.string().optional(),
    imovel_cidade: z.string().min(1, 'Obrigatório'),
    imovel_uf: z.string().min(1, 'Obrigatório'),
    imovel_cep: z.string().optional(),
    imovel_matricula: z.string().min(1, 'Obrigatório'),
    imovel_rgi: z.string().optional(),
    imovel_iptu: z.string().optional(),
    sem_valores: z.boolean(),
    valor_pago: z.string().optional(),
    retencao_valor: z.string().optional(),
    forma_devolucao: z.string().optional(),
    comissao_destino: z.enum(COMISSAO_DESTINO_OPTIONS),
    comissao_beneficiario: z.string().optional(),
    comissao_creci: z.string().optional(),
    comissao_documento: z.string().optional(),
    comissao_pix: z.string().optional(),
    tem_devolucao_imovel: z.boolean(),
    tem_comissao: z.boolean(),
    tem_rgi_cancelamento: z.boolean(),
    tem_renuncia_perdas: z.boolean(),
    data_documento: z.string().min(1, 'Obrigatório'),
    foro_comarca: z.string().min(1, 'Obrigatório'),
    testemunha1_nome: z.string().optional(),
    testemunha1_cpf: z.string().optional(),
    testemunha2_nome: z.string().optional(),
    testemunha2_cpf: z.string().optional(),
  })
  .refine((d) => d.sem_valores || (!!d.valor_pago && parseCurrency(d.valor_pago) > 0), {
    message: 'Informe o valor pago',
    path: ['valor_pago'],
  })
  .refine((d) => d.sem_valores || !!d.retencao_valor, {
    message: 'Obrigatório',
    path: ['retencao_valor'],
  })
  .refine((d) => d.sem_valores || !!d.forma_devolucao, {
    message: 'Obrigatório',
    path: ['forma_devolucao'],
  })
  .refine(
    (d) =>
      d.sem_valores || parseCurrency(d.retencao_valor || '0') <= parseCurrency(d.valor_pago || '0'),
    {
      message: 'Retenção não pode exceder o valor pago',
      path: ['retencao_valor'],
    },
  )

export type DistratoValues = z.infer<typeof distratoSchema>

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

export const distratoMockData: DistratoValues = {
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
  anuentes: [],
  contrato_originario_tipo: 'Promessa de Compra e Venda',
  contrato_originario_data: '2026-01-15',
  contrato_originario_registro: 'Escritura pública lavrada no 5º Cartório de Notas',
  imovel_descricao: 'Apartamento nº 801, Edifício Solar, 8º andar',
  imovel_endereco: 'Rua das Acácias, 150',
  imovel_bairro: 'Jacarepaguá',
  imovel_cidade: 'Rio de Janeiro',
  imovel_uf: 'RJ',
  imovel_cep: '22750-000',
  imovel_matricula: '78.456',
  imovel_rgi: '6º Oficial de Registro de Imóveis',
  imovel_iptu: '001.234.567-8',
  sem_valores: false,
  valor_pago: 'R$ 120.000,00',
  retencao_valor: 'R$ 20.000,00',
  forma_devolucao: 'Transferência bancária (PIX) em até 30 dias',
  comissao_destino: 'retida_corretor',
  comissao_beneficiario: 'Marcos Vieira Corretagem Imobiliária',
  comissao_creci: 'CRECI-RJ 12345',
  comissao_documento: '12.345.678/0001-90',
  comissao_pix: 'marcos@corretora.com.br',
  tem_devolucao_imovel: true,
  tem_comissao: true,
  tem_rgi_cancelamento: true,
  tem_renuncia_perdas: true,
  data_documento: new Date().toISOString().split('T')[0],
  foro_comarca: 'Rio de Janeiro/RJ',
  testemunha1_nome: 'Pedro Alves Lima',
  testemunha1_cpf: '111.222.333-44',
  testemunha2_nome: 'Maria Fernanda Rocha',
  testemunha2_cpf: '555.666.777-88',
}
