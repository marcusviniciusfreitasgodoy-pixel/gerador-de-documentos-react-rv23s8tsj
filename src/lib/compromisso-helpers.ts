import { z } from 'zod'
import { parseCurrency, ESTADO_CIVIL_OPTIONS, REGIME_BENS_OPTIONS } from '@/lib/form-helpers'

export { ESTADO_CIVIL_OPTIONS, REGIME_BENS_OPTIONS }

export function formatDateLower(date: Date): string {
  const months = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro',
  ]
  return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`
}

export function buildRegimeSuffix(estadoCivil: string, regimeBens?: string): string {
  if (estadoCivil === 'Casado(a)') {
    return `, sob o regime de ${regimeBens || 'comunhão parcial'}`
  }
  return ''
}

export const compromissoSchema = z
  .object({
    vendedor_nome: z.string().min(3, 'Nome obrigatório'),
    vendedor_nacionalidade: z.string().min(1, 'Obrigatório'),
    vendedor_estado_civil: z.string().min(1, 'Selecione'),
    vendedor_regime_bens: z.string().optional(),
    vendedor_profissao: z.string().min(1, 'Obrigatório'),
    vendedor_rg: z.string().min(1, 'Obrigatório'),
    vendedor_orgao_emissor: z.string().min(1, 'Obrigatório'),
    vendedor_cpf: z.string().min(1, 'Obrigatório'),
    vendedor_endereco: z.string().min(1, 'Obrigatório'),
    vendedor_email: z.string().optional(),
    has_interveniente: z.boolean(),
    interveniente_nome: z.string().optional(),
    interveniente_nacionalidade: z.string().optional(),
    interveniente_estado_civil: z.string().optional(),
    interveniente_regime_bens: z.string().optional(),
    interveniente_profissao: z.string().optional(),
    interveniente_rg: z.string().optional(),
    interveniente_orgao_emissor: z.string().optional(),
    interveniente_cpf: z.string().optional(),
    interveniente_endereco: z.string().optional(),
    interveniente_email: z.string().optional(),
    interveniente_relacao: z.string().optional(),
    comprador_nome: z.string().min(3, 'Nome obrigatório'),
    comprador_nacionalidade: z.string().min(1, 'Obrigatório'),
    comprador_estado_civil: z.string().min(1, 'Selecione'),
    comprador_regime_bens: z.string().optional(),
    comprador_profissao: z.string().min(1, 'Obrigatório'),
    comprador_rg: z.string().min(1, 'Obrigatório'),
    comprador_orgao_emissor: z.string().min(1, 'Obrigatório'),
    comprador_cpf: z.string().min(1, 'Obrigatório'),
    comprador_endereco: z.string().min(1, 'Obrigatório'),
    comprador_email: z.string().optional(),
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
    valor_sinal: z
      .string()
      .min(1, 'Obrigatório')
      .refine((v) => parseCurrency(v) > 0, 'Maior que zero'),
    valor_reforco: z.string().optional(),
    comissao_beneficiario: z.string().optional(),
    comissao_documento: z.string().optional(),
    comissao_creci: z.string().optional(),
    comissao_pix: z.string().optional(),
    comissao_percentual: z.string().min(1, 'Obrigatório'),
    prazo_certificado: z.string().min(1, 'Obrigatório'),
    prazo_reforco_texto: z.string().optional(),
    prazo_escritura: z.string().min(1, 'Obrigatório'),
    data_documento: z.string().min(1, 'Obrigatório'),
    tipo_arras: z.enum(['confirmatoria', 'penitencial']),
    testemunha1_nome: z.string().optional(),
    testemunha1_cpf: z.string().optional(),
    testemunha2_nome: z.string().optional(),
    testemunha2_cpf: z.string().optional(),
  })
  .refine(
    (d) => !d.has_interveniente || (d.interveniente_nome && d.interveniente_nome.length >= 3),
    {
      message: 'Nome obrigatório',
      path: ['interveniente_nome'],
    },
  )
  .refine((d) => !d.has_interveniente || !!d.interveniente_cpf, {
    message: 'CPF obrigatório',
    path: ['interveniente_cpf'],
  })

export type CompromissoValues = z.infer<typeof compromissoSchema>

export const compromissoMockData: CompromissoValues = {
  vendedor_nome: 'Roberto Mendes Araújo',
  vendedor_nacionalidade: 'brasileiro',
  vendedor_estado_civil: 'Casado(a)',
  vendedor_regime_bens: 'Comunhão parcial',
  vendedor_profissao: 'Médico',
  vendedor_rg: 'MG-15.234.567',
  vendedor_orgao_emissor: 'SSP/MG',
  vendedor_cpf: '456.789.123-00',
  vendedor_endereco: 'Rua Voluntários da Pátria, 200, Botafogo, Rio de Janeiro/RJ, CEP 22270-010',
  vendedor_email: 'roberto.araujo@email.com',
  has_interveniente: true,
  interveniente_nome: 'Maria Eduarda Araújo',
  interveniente_nacionalidade: 'brasileira',
  interveniente_estado_civil: 'Casado(a)',
  interveniente_regime_bens: 'Comunhão parcial',
  interveniente_profissao: 'Professora',
  interveniente_rg: 'RJ-18.765.432',
  interveniente_orgao_emissor: 'SSP/RJ',
  interveniente_cpf: '321.654.987-11',
  interveniente_endereco:
    'Rua Voluntários da Pátria, 200, Botafogo, Rio de Janeiro/RJ, CEP 22270-010',
  interveniente_email: 'maria.araujo@email.com',
  interveniente_relacao: 'cônjuge e coproprietária',
  comprador_nome: 'Fernanda Souza Lima',
  comprador_nacionalidade: 'brasileira',
  comprador_estado_civil: 'Solteiro(a)',
  comprador_regime_bens: '',
  comprador_profissao: 'Engenheira',
  comprador_rg: 'RJ-20.987.654',
  comprador_orgao_emissor: 'SSP/RJ',
  comprador_cpf: '987.654.321-00',
  comprador_endereco: 'Av. das Américas, 789, Barra da Tijuca, Rio de Janeiro/RJ, CEP 22640-100',
  comprador_email: 'fernanda.lima@email.com',
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
  imovel_origem_aquisicao: 'compra e venda',
  imovel_origem_registro: 'escritura pública lavrada em 15/03/2018',
  valor_total: 'R$ 1.200.000,00',
  valor_sinal: 'R$ 120.000,00',
  valor_reforco: 'R$ 480.000,00',
  comissao_beneficiario: '',
  comissao_documento: '',
  comissao_creci: '',
  comissao_pix: '',
  comissao_percentual: '5',
  prazo_certificado: '10',
  prazo_reforco_texto: 'no prazo de 30 dias contados desta data',
  prazo_escritura: '60',
  data_documento: new Date().toISOString().split('T')[0],
  tipo_arras: 'confirmatoria',
  testemunha1_nome: 'Pedro Alves Lima',
  testemunha1_cpf: '111.222.333-44',
  testemunha2_nome: 'Maria Fernanda Rocha',
  testemunha2_cpf: '555.666.777-88',
}
