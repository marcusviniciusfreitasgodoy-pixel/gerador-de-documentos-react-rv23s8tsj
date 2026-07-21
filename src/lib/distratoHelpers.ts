import { z } from 'zod'
import { parseCurrency, ESTADO_CIVIL_OPTIONS, REGIME_BENS_OPTIONS } from '@/lib/form-helpers'

export { ESTADO_CIVIL_OPTIONS, REGIME_BENS_OPTIONS }

export const COMISSAO_DESTINO_OPTIONS = ['retida', 'devolvida', 'por_conta'] as const

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

export const distratoSchema = z
  .object({
    vendedores: z.array(partySchema).min(1, 'Ao menos um promitente vendedor'),
    compradores: z.array(partySchema).min(1, 'Ao menos um promitente comprador'),
    anuentes: z.array(anuenteSchema),

    // Contrato originário (campo livre — distrato genérico)
    contrato_originario_tipo: z.string().min(1, 'Obrigatório'),
    contrato_originario_data: z.string().min(1, 'Obrigatório'),
    contrato_originario_objeto: z.string().min(1, 'Obrigatório'),

    // Acerto de valores
    sem_valores: z.boolean(),
    valor_pago: z.string().optional(),
    tem_retencao: z.boolean(),
    retencao_titulo: z.string().optional(),
    retencao_valor: z.string().optional(),
    devolucao_prazo: z.string().optional(),
    devolucao_forma: z.string().optional(),

    // Toggle: devolução do imóvel
    devolve_imovel: z.boolean(),
    imovel_devolucao_descricao: z.string().optional(),
    imovel_desocupacao_prazo: z.string().optional(),

    // Toggle: comissão
    trata_comissao: z.boolean(),
    comissao_destino: z.enum(COMISSAO_DESTINO_OPTIONS).optional(),
    comissao_valor: z.string().optional(),
    comissao_corretor: z.string().optional(),
    comissao_prazo: z.string().optional(),
    comissao_responsavel: z.string().optional(),

    // Toggle: baixa de averbação
    baixa_averbacao: z.boolean(),
    matricula_numero: z.string().optional(),
    rgi_numero: z.string().optional(),
    averbacao_custas: z.string().optional(),

    // Toggle: renúncia a perdas e danos
    renuncia_perdas: z.boolean(),

    // Foro / fecho
    foro_comarca: z.string().min(1, 'Obrigatório'),
    vias_qtd: z.string().optional(),
    cidade: z.string().min(1, 'Obrigatório'),
    data_documento: z.string().min(1, 'Obrigatório'),

    testemunha1_nome: z.string().optional(),
    testemunha1_cpf: z.string().optional(),
    testemunha2_nome: z.string().optional(),
    testemunha2_cpf: z.string().optional(),
  })
  .superRefine((v, ctx) => {
    if (!v.sem_valores) {
      if (!v.valor_pago || parseCurrency(v.valor_pago) <= 0)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['valor_pago'],
          message: 'Informe o valor pago',
        })
      if (!v.devolucao_prazo)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['devolucao_prazo'],
          message: 'Informe o prazo',
        })
      if (!v.devolucao_forma)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['devolucao_forma'],
          message: 'Informe a forma',
        })
      if (v.tem_retencao) {
        if (!v.retencao_titulo)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['retencao_titulo'],
            message: 'A que título?',
          })
        if (!v.retencao_valor || parseCurrency(v.retencao_valor) <= 0)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['retencao_valor'],
            message: 'Valor da retenção',
          })
        if (
          v.valor_pago &&
          v.retencao_valor &&
          parseCurrency(v.retencao_valor) > parseCurrency(v.valor_pago)
        )
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['retencao_valor'],
            message: 'Retenção maior que o valor pago',
          })
      }
    }
    if (v.devolve_imovel) {
      if (!v.imovel_devolucao_descricao)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['imovel_devolucao_descricao'],
          message: 'Descreva o imóvel',
        })
      if (!v.imovel_desocupacao_prazo)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['imovel_desocupacao_prazo'],
          message: 'Informe o prazo',
        })
    }
    if (v.trata_comissao) {
      if (!v.comissao_destino)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['comissao_destino'],
          message: 'Escolha o destino',
        })
      if (
        (v.comissao_destino === 'retida' || v.comissao_destino === 'devolvida') &&
        (!v.comissao_valor || parseCurrency(v.comissao_valor) <= 0)
      )
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['comissao_valor'],
          message: 'Valor da comissão',
        })
      if (v.comissao_destino === 'devolvida' && !v.comissao_prazo)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['comissao_prazo'],
          message: 'Prazo da devolução',
        })
      if (v.comissao_destino === 'por_conta' && !v.comissao_responsavel)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['comissao_responsavel'],
          message: 'Por conta de quem?',
        })
    }
    if (v.baixa_averbacao) {
      if (!v.matricula_numero)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['matricula_numero'],
          message: 'Nº da matrícula',
        })
      if (!v.rgi_numero)
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['rgi_numero'], message: 'RGI' })
      if (!v.averbacao_custas)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['averbacao_custas'],
          message: 'Custas por conta de quem?',
        })
    }
  })

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
      email: '',
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
      email: '',
    },
  ],
  anuentes: [],
  contrato_originario_tipo: 'Instrumento Particular de Promessa de Compra e Venda',
  contrato_originario_data: '10 de janeiro de 2026',
  contrato_originario_objeto:
    'o Apartamento nº 801 do Edifício Solar, situado à Rua das Acácias, 150, Jacarepaguá, Rio de Janeiro/RJ, matrícula nº 78.456 do 6º RGI',
  sem_valores: false,
  valor_pago: 'R$ 50.000,00',
  tem_retencao: true,
  retencao_titulo: 'arras, a título de perdas e danos',
  retencao_valor: 'R$ 5.000,00',
  devolucao_prazo: '10 (dez) dias',
  devolucao_forma:
    'transferência via PIX para a chave informada pelo(s) PROMITENTE(S) COMPRADOR(ES)',
  devolve_imovel: false,
  imovel_devolucao_descricao: '',
  imovel_desocupacao_prazo: '',
  trata_comissao: false,
  comissao_destino: 'retida',
  comissao_valor: '',
  comissao_corretor: '',
  comissao_prazo: '',
  comissao_responsavel: '',
  baixa_averbacao: false,
  matricula_numero: '',
  rgi_numero: '',
  averbacao_custas: '',
  renuncia_perdas: false,
  foro_comarca: 'Rio de Janeiro/RJ',
  vias_qtd: '2 (duas)',
  cidade: 'Rio de Janeiro/RJ',
  data_documento: new Date().toISOString().split('T')[0],
  testemunha1_nome: 'Pedro Alves Lima',
  testemunha1_cpf: '111.222.333-44',
  testemunha2_nome: 'Maria Fernanda Rocha',
  testemunha2_cpf: '555.666.777-88',
}

// Form abre vazio: mesma shape do mock, sem dados fictícios.
// Mantém (via spread) nacionalidade, foro/cidade/vias defaults, data_documento.
// Zera os toggles de demonstração (tem_retencao vinha true no mock) para não disparar validação.
export const distratoEmptyData: DistratoValues = {
  ...distratoMockData,
  foro_comarca: '',
  vendedores: [{ ...emptyParty }],
  compradores: [{ ...emptyParty }],
  anuentes: [],
  contrato_originario_tipo: '',
  contrato_originario_data: '',
  contrato_originario_objeto: '',
  valor_pago: '',
  tem_retencao: false,
  retencao_titulo: '',
  retencao_valor: '',
  devolucao_prazo: '',
  devolucao_forma: '',
  testemunha1_nome: '',
  testemunha1_cpf: '',
  testemunha2_nome: '',
  testemunha2_cpf: '',
}
