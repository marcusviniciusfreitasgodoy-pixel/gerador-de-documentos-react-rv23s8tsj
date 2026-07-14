import * as pdfjsLib from 'pdfjs-dist'
import PdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?worker'
import { extractTextFromDocx } from '@/lib/docx-extract'

pdfjsLib.GlobalWorkerOptions.workerPort = new PdfWorker()

export function isSupportedFile(file: File): boolean {
  const ext = file.name.toLowerCase().split('.').pop() || ''
  return ['pdf', 'png', 'jpg', 'jpeg', 'docx'].includes(ext)
}

export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const textParts: string[] = []
  let totalTextLength = 0

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items.map((item) => ('str' in item ? item.str : '')).join(' ')
    totalTextLength += pageText.trim().length
    textParts.push(pageText)
  }

  const fullText = textParts.join('\n\n')
  if (totalTextLength > 10) return fullText

  return extractTextFromScannedPdf(pdf)
}

async function extractTextFromScannedPdf(pdf: pdfjsLib.PDFDocumentProxy): Promise<string> {
  const { createWorker } = await import('tesseract.js')
  const worker = await createWorker('por+eng')
  const textParts: string[] = []
  try {
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const viewport = page.getViewport({ scale: 2 })
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas context unavailable')
      canvas.width = viewport.width
      canvas.height = viewport.height
      await page.render({ canvasContext: ctx, viewport }).promise
      const { data } = await worker.recognize(canvas)
      textParts.push(data.text)
    }
  } finally {
    await worker.terminate()
  }
  return textParts.join('\n\n')
}

export async function extractTextFromImage(file: File): Promise<string> {
  const { createWorker } = await import('tesseract.js')
  const worker = await createWorker('por+eng')
  try {
    const { data } = await worker.recognize(file)
    return data.text
  } finally {
    await worker.terminate()
  }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo.'))
    reader.readAsDataURL(file)
  })
}

// Renderiza o documento em imagens (dataURL base64) para a IA de VISÃO ler diretamente.
// PDF → páginas rasterizadas (até maxPages); PNG/JPG → a própria imagem; DOCX → sem imagem (só texto).
export async function renderDocumentToImages(file: File, maxPages = 5): Promise<string[]> {
  const ext = file.name.toLowerCase().split('.').pop() || ''

  if (['png', 'jpg', 'jpeg'].includes(ext)) {
    return [await fileToDataUrl(file)]
  }

  if (ext === 'pdf') {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    const images: string[] = []
    const n = Math.min(pdf.numPages, maxPages)
    for (let i = 1; i <= n; i++) {
      const page = await pdf.getPage(i)
      const base = page.getViewport({ scale: 1 })
      // limita o lado maior a ~1500px (modelos de visão reduzem imagens grandes de qualquer forma)
      const scale = Math.min(2, 1500 / Math.max(base.width, base.height))
      const viewport = page.getViewport({ scale })
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

  return []
}

export async function extractTextFromDocument(file: File): Promise<string> {
  const ext = file.name.toLowerCase().split('.').pop() || ''
  switch (ext) {
    case 'pdf':
      return extractTextFromPdf(file)
    case 'png':
    case 'jpg':
    case 'jpeg':
      return extractTextFromImage(file)
    case 'docx':
      return extractTextFromDocx(file)
    default:
      throw new Error('Formato não suportado. Use PDF, PNG, JPG ou DOCX.')
  }
}
