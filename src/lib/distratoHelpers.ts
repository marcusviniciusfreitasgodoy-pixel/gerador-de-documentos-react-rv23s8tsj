import { z } from 'zod'
import { parseCurrency, ESTADO_CIVIL_OPTIONS, REGIME_BENS_OPTIONS } from '@/lib/form-helpers'

export { ESTADO_CIVIL_OPTIONS, REGIME_BENS_OPTIONS }

export const COMISSAO_DESTINO_OPTIONS = ['retida', 'devolvida', 'por_conta'] as const

const partySchema = z.object({
  nome: z.string().min(3, 'Nome obrigat√≥rio'),
  nacionalidade: z.string().min(1, 'Obrigat√≥rio'),
  estado_civil: z.string().min(1, 'Selecione'),
  regime_bens: z.string().optional(),
  profissao: z.string().min(1, 'Obrigat√≥rio'),
  rg: z.string().min(1, 'Obrigat√≥rio'),
  orgao_emissor: z.string().min(1, 'Obrigat√≥rio'),
  cpf: z.string().min(1, 'Obrigat√≥rio'),
  endereco: z.string().min(1, 'Obrigat√≥rio'),
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

    // Contrato origin√°rio (campo livre ‚Äî distrato gen√©rico)
    contrato_originario_tipo: z.string().min(1, 'Obrigat√≥rio'),
    contrato_originario_data: z.string().min(1, 'Obrigat√≥rio'),
    contrato_originario_objeto: z.string().min(1, 'Obrigat√≥rio'),

    // Acerto de valores
    sem_valores: z.boolean(),
    valor_pago: z.string().optional(),
    tem_retencao: z.boolean(),
    retencao_titulo: z.string().optional(),
    retencao_valor: z.string().optional(),
    devolucao_prazo: z.string().optional(),
    devolucao_forma: z.string().optional(),

    // Toggle: devolu√ß√£o do im√≥vel
    devolve_imovel: z.boolean(),
    imovel_devolucao_descricao: z.string().optional(),
    imovel_desocupacao_prazo: z.string().optional(),

    // Toggle: comiss√£o
    trata_comissao: z.boolean(),
    comissao_destino: z.enum(COMISSAO_DESTINO_OPTIONS).optional(),
    comissao_valor: z.string().optional(),
    comissao_corretor: z.string().optional(),
    comissao_prazo: z.string().optional(),
    comissao_responsavel: z.string().optional(),

    // Toggle: baixa de averba√ß√£o
    baixa_averbacao: z.boolean(),
    matricula_numero: z.string().optional(),
    rgi_numero: z.string().optional(),
    averbacao_custas: z.string().optional(),

    // Toggle: ren√∫ncia a perdas e danos
    renuncia_perdas: z.boolean(),

    // Foro / fecho
    foro_comarca: z.string().min(1, 'Obrigat√≥rio'),
    vias_qtd: z.string().optional(),
    cidade: z.string().min(1, 'Obrigat√≥rio'),
    data_documento: z.string().min(1, 'Obrigat√≥rio'),

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
            message: 'A que t√≠tulo?',
          })
        if (!v.retencao_valor || parseCurrency(v.retencao_valor) <= 0)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['retencao_valor'],
            message: 'Valor da reten√ß√£o',
          })
        if (
          v.valor_pago &&
          v.retencao_valor &&
          parseCurrency(v.retencao_valor) > parseCurrency(v.valor_pago)
        )
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['retencao_valor'],
            message: 'Reten√ß√£o maior que o valor pago',
          })
      }
    }
    if (v.devolve_imovel) {
      if (!v.imovel_devolucao_descricao)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['imovel_devolucao_descricao'],
          message: 'Descreva o im√≥vel',
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
          message: 'Valor da comiss√£o',
        })
      if (v.comissao_destino === 'devolvida' && !v.comissao_prazo)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['comissao_prazo'],
          message: 'Prazo da devolu√ß√£o',
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
          message: 'N¬∫ da matr√≠cula',
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
      nome: 'Roberto Mendes Ara√∫jo',
      nacionalidade: 'brasileiro',
      estado_civil: 'Casado(a)',
      regime_bens: 'Comunh√£o parcial',
      profissao: 'M√©dico',
      rg: 'MG-15.234.567',
      orgao_emissor: 'SSP/MG',
      cpf: '456.789.123-00',
      endereco: 'Rua Volunt√°rios da P√°tria, 200, Botafogo, Rio de Janeiro/RJ, CEP 22270-010',
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
      endereco: 'Av. das Am√©ricas, 789, Barra da Tijuca, Rio de Janeiro/RJ, CEP 22640-100',
      email: '',
    },
  ],
  anuentes: [],
  contrato_originario_tipo: 'Instrumento Particular de Promessa de Compra e Venda',
  contrato_originario_data: '10 de janeiro de 2026',
  contrato_originario_objeto:
    'o Apartamento n¬∫ 801 do Edif√≠cio Solar, situado √† Rua das Ac√°cias, 150, Jacarepagu√°, Rio de Janeiro/RJ, matr√≠cula n¬∫ 78.456 do 6¬∫ RGI',
  sem_valores: false,
  valor_pago: 'R$ 50.000,00',
  tem_retencao: true,
  retencao_titulo: 'arras, a t√≠tulo de perdas e danos',
  retencao_valor: 'R$ 5.000,00',
  devolucao_prazo: '10 (dez) dias',
  devolucao_forma:
    'transfer√™ncia via PIX para a chave informada pelo(s) PROMITENTE(S) COMPRADOR(ES)',
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
