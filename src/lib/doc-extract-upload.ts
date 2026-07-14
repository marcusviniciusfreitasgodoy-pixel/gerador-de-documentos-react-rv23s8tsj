import * as pdfjsLib from 'pdfjs-dist'
import PdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?worker'
import pb from '@/lib/pocketbase/client'
import { extractTextFromDocument } from '@/lib/document-extract'
import type {
  ExtractionMotor,
  ExtracaoResult,
  PessoaExtraida,
  ImovelExtraido,
} from '@/lib/extraction-types'
import { emptyPessoa, emptyImovel } from '@/lib/extraction-types'

// Configura o worker do PDF.js para extração local
pdfjsLib.GlobalWorkerOptions.workerPort = new PdfWorker()

function normalizePessoa(raw: any): PessoaExtraida {
  return {
    nome: String(raw?.nome || ''),
    cpf: String(raw?.cpf || ''),
    rg: String(raw?.rg || ''),
    orgao_emissor: String(raw?.orgao_emissor || ''),
    nacionalidade: String(raw?.nacionalidade || 'brasileiro(a)'),
    estado_civil: String(raw?.estado_civil || ''),
    regime_bens: String(raw?.regime_bens || ''),
    profissao: String(raw?.profissao || ''),
    endereco: String(raw?.endereco || ''),
    email: String(raw?.email || ''),
    _confianca: ['alta', 'media', 'baixa'].includes(raw?._confianca) ? raw._confianca : 'baixa',
    _fonte: String(raw?._fonte || 'desconhecido'),
  }
}

function normalizeImovel(raw: any): ImovelExtraido {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, any>
  return {
    descricao: String(r.descricao || ''),
    endereco: String(r.endereco || ''),
    bairro: String(r.bairro || ''),
    cidade: String(r.cidade || ''),
    uf: String(r.uf || ''),
    cep: String(r.cep || ''),
    matricula: String(r.matricula || ''),
    rgi: String(r.rgi || ''),
    iptu: String(r.iptu || ''),
    fracao_ideal: String(r.fracao_ideal || ''),
    vagas_qtd: String(r.vagas_qtd || ''),
    vagas_descricao: String(r.vagas_descricao || ''),
    origem_aquisicao: String(r.origem_aquisicao || ''),
    origem_registro: String(r.origem_registro || ''),
    _confianca: ['alta', 'media', 'baixa'].includes(r._confianca) ? r._confianca : 'baixa',
  }
}

function normalizeResult(raw: unknown): ExtracaoResult {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, any>
  return {
    pessoas: Array.isArray(r.pessoas)
      ? r.pessoas.filter((p: any) => p && typeof p === 'object').map(normalizePessoa)
      : [],
    imovel: normalizeImovel(r.imovel),
  }
}

function parseTextHeuristics(text: string): ExtracaoResult {
  const pessoas: PessoaExtraida[] = []
  const cpfRegex = /(\d{3}\.\d{3}\.\d{3}-\d{2})/g
  const cpfMatches = [...text.matchAll(cpfRegex)]
  for (const match of cpfMatches) {
    const cpf = match[1]
    const idx = match.index || 0
    const before = text.substring(Math.max(0, idx - 200), idx)
    const nameMatch = before.match(
      /([A-ZÀ-Ú][a-zà-ú]+(?:\s+(?:de|da|do|dos|das|e)?\s*[A-ZÀ-Ú][a-zà-ú]+)+)\s*$/i,
    )
    const lower = before.toLowerCase()
    let fonte = 'desconhecido'
    if (lower.includes('vendedor')) fonte = 'vendedor'
    else if (lower.includes('comprador')) fonte = 'comprador'
    pessoas.push({
      ...emptyPessoa,
      nome: nameMatch ? nameMatch[1].trim() : '',
      cpf,
      _confianca: 'baixa',
      _fonte: fonte,
    })
  }
  const imovel = { ...emptyImovel }
  const extract = (pattern: RegExp, key: keyof ImovelExtraido) => {
    const m = text.match(pattern)
    if (m && m[1]) (imovel[key] as string) = m[1].trim()
  }
  extract(/matr[ií]cula:?\s*n?º?\s*([^\n,;]+)/i, 'matricula')
  extract(/IPTU:?\s*([^\n,;]+)/i, 'iptu')
  extract(/endere[çc]o:?\s*([^\n,;]+)/i, 'endereco')
  extract(/CEP:?\s*(\d{5}-?\d{3})/i, 'cep')
  extract(/bai?r?ro:?\s*([^\n,;]+)/i, 'bairro')
  extract(/cidad[ae]:?\s*([^\n,;]+)/i, 'cidade')
  return { pessoas, imovel }
}

export async function extractDocument(file: File, motor: ExtractionMotor): Promise<ExtracaoResult> {
  // Worker Validation: garante extração do texto no cliente
  const text = await extractTextFromDocument(file)

  if (!text || text.trim().length === 0) {
    throw new Error(
      'Não foi possível extrair texto do documento. O arquivo pode estar vazio, criptografado ou ilegível.',
    )
  }

  if (motor === 'tesseract') {
    return parseTextHeuristics(text)
  }

  try {
    // Data transmission optimization: enviando apenas o texto extraído invés de grandes arrays base64
    // O SDK do PocketBase processará e converterá este objeto como JSON sem precisar de stringify duplo
    const result = await pb.send('/backend/v1/extrair-dados', {
      method: 'POST',
      body: {
        model: motor,
        document_text: text,
        schema: 'promessa_avista',
      },
    })
    return normalizeResult(result)
  } catch (err: any) {
    // Extrai mensagem real reportada pelo backend em caso de erro 400 ou 422
    const backendMessage =
      err?.response?.error || err?.message || 'Falha ao extrair dados do documento.'
    throw new Error(backendMessage)
  }
}
