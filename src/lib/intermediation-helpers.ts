import { z } from 'zod'
import { formatDateFull, cleanCurrencyMask, parseCurrency, trimDeep } from '@/lib/form-helpers'

export const TIPO_EXCLUSIVIDADE_OPTIONS = ['COM GESTÃO EXCLUSIVA', 'SEM GESTÃO EXCLUSIVA'] as const

// O item 4 do template dizia "no ato da assinatura da escritura" LITERAL. Só que quem
// fecha na proposta aceita paga o corretor no sinal, e o Contrato de Corretagem já
// deixava esse momento na mão do corretor ({vencimento_comissao}). Dois documentos da
// mesma operação diziam coisas diferentes sobre o mesmo pagamento. Agora a Autorização
// também escolhe, e o texto que entra na cláusula é este, não o que o corretor digitar.
export const MOMENTO_COMISSAO_OPTIONS = [
  {
    value: 'escritura',
    label: 'Na assinatura da escritura',
    texto: 'no ato da assinatura da escritura de compra e venda',
  },
  {
    value: 'sinal',
    label: 'No recebimento do sinal',
    texto: 'no ato do recebimento do sinal pelos CONTRATANTES, quando do aceite da proposta',
  },
] as const

export type MomentoComissao = (typeof MOMENTO_COMISSAO_OPTIONS)[number]['value']

export const intermediationSchema = z.object({
  contratante_nome: z.string().min(3, 'Nome obrigatório (mín. 3 caracteres)'),
  contratante_cpf: z.string().min(1, 'Obrigatório'),
  contratante_orgao_emissor: z.string().optional(),
  contratante_telefone: z.string().optional(),
  contratante_email: z.string().optional(),
  imovel_endereco: z.string().min(1, 'Obrigatório'),
  imovel_bairro: z.string().optional(),
  imovel_cidade: z.string().min(1, 'Obrigatório'),
  imovel_cep: z.string().optional(),
  imovel_condominio: z.string().optional(),
  imovel_iptu: z.string().optional(),
  imovel_vagas: z.string().optional(),
  imovel_quartos: z.string().optional(),
  valor_avaliacao: z.string().optional(),
  valor_venda: z
    .string()
    .min(1, 'Obrigatório')
    .refine((v) => parseCurrency(v) > 0, 'Valor deve ser maior que zero'),
  tipo_exclusividade: z.enum(TIPO_EXCLUSIVIDADE_OPTIONS),
  prazo_vigencia_dias: z.string().min(1, 'Obrigatório'),
  comissao_percentual: z.string().min(1, 'Obrigatório'),
  momento_comissao: z.enum(['escritura', 'sinal']),
  // Antes: o template dizia "Comarca do Rio de Janeiro, RJ" LITERAL, embora já existisse
  // {imovel_cidade}. Autorização de imóvel em Niterói saía elegendo foro do Rio — e o
  // validador nunca pegaria: o imóvel de teste é no Rio, então o texto fixo e o certo
  // coincidem. Mesmo nome/regra dos outros 4 docs (Permuta, Distrato, Posse, Recibo).
  foro_comarca: z.string().min(1, 'Obrigatório'),
})

export type IntermediationValues = z.infer<typeof intermediationSchema>

export const intermediationMockData: IntermediationValues = {
  contratante_nome: 'João Carlos da Silva',
  contratante_cpf: '123.456.789-09',
  contratante_orgao_emissor: 'DETRO/RJ',
  contratante_telefone: '(21) 99999-8888',
  contratante_email: 'joao.silva@email.com',
  imovel_endereco: 'Rua das Laranjeiras, 123, Apto 502',
  imovel_bairro: 'Laranjeiras',
  imovel_cidade: 'Rio de Janeiro',
  imovel_cep: '22240-006',
  imovel_condominio: 'R$ 850,00',
  imovel_iptu: 'R$ 3.200,00',
  imovel_vagas: '2',
  imovel_quartos: '3',
  valor_avaliacao: 'R$ 4.900.000,00',
  valor_venda: 'R$ 4.800.000,00',
  tipo_exclusividade: 'COM GESTÃO EXCLUSIVA',
  prazo_vigencia_dias: '90',
  comissao_percentual: '5',
  momento_comissao: 'sinal',
  foro_comarca: 'Rio de Janeiro',
}

export interface BrokerInfo {
  name: string
  document: string
  creci: string
}

export function buildIntermediationTemplateData(
  dataBruta: IntermediationValues,
  brokerBruto?: BrokerInfo | null,
): Record<string, string> {
  // Trim de entrada (ver `trimDeep`): um " R-9 " digitado no dossiê saía
  // "registrado sob o  R-9  da referida matrícula". Aqui, e não na saída, porque
  // os valores são costurados em frases antes de virar template data.
  const data = trimDeep(dataBruta)
  const broker = trimDeep(brokerBruto)
  const isComExclusiva = data.tipo_exclusividade === 'COM GESTÃO EXCLUSIVA'
  return {
    contratante_nome: data.contratante_nome,
    contratante_cpf: data.contratante_cpf,
    contratante_orgao_emissor: data.contratante_orgao_emissor || '',
    contratante_telefone: data.contratante_telefone || '',
    contratante_email: data.contratante_email || '',
    imovel_endereco: data.imovel_endereco,
    imovel_bairro: data.imovel_bairro || '',
    imovel_cidade: data.imovel_cidade || 'Rio de Janeiro',
    imovel_cep: data.imovel_cep || '',
    imovel_condominio: cleanCurrencyMask(data.imovel_condominio || ''),
    imovel_iptu: cleanCurrencyMask(data.imovel_iptu || ''),
    imovel_vagas: data.imovel_vagas || '',
    imovel_quartos: data.imovel_quartos || '',
    valor_avaliacao: cleanCurrencyMask(data.valor_avaliacao || ''),
    valor_venda: cleanCurrencyMask(data.valor_venda),
    check_com_exclusiva: isComExclusiva ? '( X )' : '( )',
    check_sem_exclusiva: !isComExclusiva ? '( X )' : '( )',
    prazo_vigencia_dias: data.prazo_vigencia_dias,
    comissao_percentual: data.comissao_percentual,
    // Fallback pro primeiro item (escritura) em vez de `''`: rascunho salvo antes deste
    // campo existir volta sem `momento_comissao`, e o nullGetter faria a cláusula 4 sair
    // como "que serão pagos ." em silêncio. Mesmo raciocínio do foro_comarca abaixo.
    vencimento_comissao: (
      MOMENTO_COMISSAO_OPTIONS.find((o) => o.value === data.momento_comissao) ??
      MOMENTO_COMISSAO_OPTIONS[0]
    ).texto,
    // Fallback pra cidade do imóvel: o template tem {foro_comarca} no texto do foro, e
    // string vazia sairia como "foro da comarca de ." em silêncio (nullGetter: () => '').
    foro_comarca: data.foro_comarca || data.imovel_cidade || 'Rio de Janeiro',
    data_extenso: formatDateFull(new Date()).toLowerCase(),
    broker_name: broker?.name || '',
    broker_document: broker?.document || '',
    broker_creci: broker?.creci || '',
  }
}
