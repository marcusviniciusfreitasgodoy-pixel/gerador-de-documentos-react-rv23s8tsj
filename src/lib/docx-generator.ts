import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import { extractTextFromRenderedDoc } from '@/lib/docx-extract'

function escapeXml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64.trim())
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

export function para(
  text: string,
  opts?: {
    bold?: boolean
    align?: 'center' | 'left' | 'right' | 'both'
    size?: number
    after?: number
    before?: number
  },
): string {
  const size = opts?.size ?? 24
  const pPr: string[] = []
  if (opts?.align) pPr.push(`<w:jc w:val="${opts.align}"/>`)
  const sp: string[] = []
  if (opts?.after !== undefined) sp.push(`<w:after w:val="${opts.after}"/>`)
  if (opts?.before !== undefined) sp.push(`<w:before w:val="${opts.before}"/>`)
  if (sp.length) pPr.push(`<w:spacing>${sp.join('')}</w:spacing>`)
  const rPr = `<w:rPr>${opts?.bold ? '<w:b/>' : ''}<w:sz w:val="${size}"/><w:szCs w:val="${size}"/></w:rPr>`
  return `<w:p>${pPr.length ? `<w:pPr>${pPr.join('')}</w:pPr>` : ''}<w:r>${rPr}<w:t xml:space="preserve">${text}</w:t></w:r></w:p>`
}

// Monta o .docx em memória a partir de um XML construído em código e renderiza os
// placeholders. Compartilhado por downloadDocx (baixa) e getTextFromDocumentXml
// (devolve texto para o Validador).
function renderDocumentXml(documentXml: string, data: Record<string, string>): Docxtemplater {
  const escaped: Record<string, string> = {}
  for (const [k, v] of Object.entries(data)) escaped[k] = escapeXml(v)

  const zip = new PizZip()
  zip.file(
    '[Content_Types].xml',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>',
  )
  zip.file(
    '_rels/.rels',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>',
  )
  zip.file('word/document.xml', documentXml)

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    nullGetter: () => '',
  })
  doc.render(escaped)
  return doc
}

export function downloadDocx(
  documentXml: string,
  data: Record<string, string>,
  filename: string,
): void {
  const doc = renderDocumentXml(documentXml, data)

  const blob = doc.getZip().generate({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Mesma minuta renderizada em memória, em texto plano, sem baixar — para o Validador.
export function getTextFromDocumentXml(documentXml: string, data: Record<string, string>): string {
  return extractTextFromRenderedDoc(renderDocumentXml(documentXml, data))
}

export function downloadDocxFromTemplate(
  templateBytes: Uint8Array,
  data: Record<string, string>,
  filename: string,
): void {
  const escaped: Record<string, string> = {}
  for (const [k, v] of Object.entries(data)) escaped[k] = escapeXml(v)

  const zip = new PizZip(templateBytes)
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    nullGetter: () => '',
  })
  doc.render(escaped)

  const blob = doc.getZip().generate({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function renderFromUrl(
  templateUrl: string,
  expectedBytes: number,
  data: Record<string, string>,
  filename: string,
): Promise<void> {
  const response = await fetch(templateUrl)
  if (!response.ok) {
    throw new Error(`Falha ao buscar template: ${response.status} ${response.statusText}`)
  }

  const base64Text = await response.text()
  const templateBytes = base64ToUint8Array(base64Text)

  if (templateBytes.length !== expectedBytes) {
    throw new Error(
      `Template corrompido: tamanho inválido (${templateBytes.length} bytes, esperado ${expectedBytes} bytes)`,
    )
  }

  const zip = new PizZip(templateBytes)
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    delimiters: { start: '{', end: '}' },
    nullGetter: () => '',
  })

  doc.render(data)

  const blob = doc.getZip().generate({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Irmão do renderFromUrl: busca o template, valida o tamanho, renderiza em
// memória e devolve o texto plano (sem baixar) para enviar ao Validador.
export async function extractTextFromUrl(
  templateUrl: string,
  expectedBytes: number,
  data: Record<string, string>,
): Promise<string> {
  const response = await fetch(templateUrl)
  if (!response.ok) {
    throw new Error(`Falha ao buscar template: ${response.status} ${response.statusText}`)
  }

  const base64Text = await response.text()
  const templateBytes = base64ToUint8Array(base64Text)

  if (templateBytes.length !== expectedBytes) {
    throw new Error(
      `Template corrompido: tamanho inválido (${templateBytes.length} bytes, esperado ${expectedBytes} bytes)`,
    )
  }

  const zip = new PizZip(templateBytes)
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    delimiters: { start: '{', end: '}' },
    nullGetter: () => '',
  })

  doc.render(data)
  return extractTextFromRenderedDoc(doc)
}

const RECIBO_TEMPLATE_URL =
  'https://gist.githubusercontent.com/marcusviniciusfreitasgodoy-pixel/2fc9ab475e6486132bab6a43b8dc1d34/raw/d61558ea1013a37120fac596a56d852238446e5c/recibo_base64.txt'
const RECIBO_EXPECTED_BYTES = 38661

export async function generateDocx(data: Record<string, string>): Promise<void> {
  await renderFromUrl(
    RECIBO_TEMPLATE_URL,
    RECIBO_EXPECTED_BYTES,
    data,
    'recibo-de-sinal-arras.docx',
  )
}

export async function getReciboText(data: Record<string, string>): Promise<string> {
  return extractTextFromUrl(RECIBO_TEMPLATE_URL, RECIBO_EXPECTED_BYTES, data)
}
