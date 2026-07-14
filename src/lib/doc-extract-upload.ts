import * as pdfjsLib from 'pdfjs-dist'
import PdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?worker'
import pb from '@/lib/pocketbase/client'
import { extractTextFromDocument } from '@/lib/document-extract'
import { extractTextFromDocx } from '@/lib/docx-extract'
import type {
  ExtractionMotor,
  ExtracaoResult,
  PessoaExtraida,
  ImovelExtraido,
} from '@/lib/extraction-types'
import { emptyPessoa, emptyImovel } from '@/lib/extraction-types'

pdfjsLib.GlobalWorkerOptions.workerPort = new PdfWorker()

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Falha ao converter arquivo.'))
    reader.readAsDataURL(file)
  })
}

async function pdfToImages(file: File, maxPages = 5): Promise<string[]> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const images: string[] = []
  const pages = Math.min(pdf.numPages, maxPages)
  for (let i = 1; i <= pages; i++) {
    const page = await pdf.getPage(i)
    const viewport = page.getViewport({ scale: 1.5 })
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) continue
    canvas.width = viewport.width
    canvas.height = viewport.height
    await page.render({ canvasContext: ctx, viewport }).promise
    images.push(canvas.toDataURL('image/jpeg', 0.85))
  }
  return images
}

async function fileToBase64Images(file: File): Promise<{ images: string[]; text: string }> {
  const ext = file.name.toLowerCase().split('.').pop() || ''
  if (ext === 'pdf') return { images: await pdfToImages(file), text: '' }
  if (['png', 'jpg', 'jpeg'].includes(ext)) return { images: [await fileToBase64(file)], text: '' }
  if (ext === 'docx') return { images: [], text: await extractTextFromDocx(file) }
  throw new Error('Formato não suportado. Use PDF, PNG, JPG ou DOCX.')
}

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
  if (motor === 'tesseract') {
    const text = await extractTextFromDocument(file)
    return parseTextHeuristics(text)
  }
  const { images, text } = await fileToBase64Images(file)
  try {
    const result = await pb.send('/backend/v1/extrair-dados', {
      method: 'POST',
      body: JSON.stringify({ motor, images, text }),
      headers: { 'Content-Type': 'application/json' },
    })
    return normalizeResult(result)
  } catch (err: any) {
    throw new Error(err?.message || 'Falha ao extrair dados do documento.')
  }
}
