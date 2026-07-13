import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import { extractTextFromRenderedDoc } from '@/lib/docx-extract'

const TEMPLATE_URL =
  'https://gist.githubusercontent.com/marcusviniciusfreitasgodoy-pixel/2fc9ab475e6486132bab6a43b8dc1d34/raw/482a9e60a19a2b75fe2ae695062c0491f0297075/distrato_base64.txt'
const EXPECTED_BYTE_COUNT = 39769

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64.trim())
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

async function renderDistratoDoc(data: Record<string, unknown>): Promise<Docxtemplater> {
  const response = await fetch(TEMPLATE_URL)
  if (!response.ok) {
    throw new Error(`Falha ao buscar template: ${response.status} ${response.statusText}`)
  }

  const base64Text = await response.text()
  const templateBytes = base64ToUint8Array(base64Text)

  if (templateBytes.length !== EXPECTED_BYTE_COUNT) {
    throw new Error(
      `Template corrompido: tamanho inválido (${templateBytes.length} bytes, esperado ${EXPECTED_BYTE_COUNT} bytes)`,
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
  return doc
}

export async function generateDistratoDocx(data: Record<string, unknown>): Promise<void> {
  const doc = await renderDistratoDoc(data)

  const blob = doc.getZip().generate({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'distrato.docx'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function getDistratoText(data: Record<string, unknown>): Promise<string> {
  const doc = await renderDistratoDoc(data)
  return extractTextFromRenderedDoc(doc)
}
