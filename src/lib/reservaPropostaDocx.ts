import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import { extractTextFromRenderedDoc } from '@/lib/docx-extract'

const TEMPLATE_URL =
  'https://gist.githubusercontent.com/marcusviniciusfreitasgodoy-pixel/2fc9ab475e6486132bab6a43b8dc1d34/raw/a813b97b59d65522bc0fca278903366f51ef7e44/proposta_reserva_base64.txt'
const EXPECTED_BYTE_COUNT = 39037

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64.trim())
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

// Busca o template do gist, valida o tamanho e renderiza — caminho único
// compartilhado pelo download e pela extração de texto (validação).
async function renderPropostaDoc(data: Record<string, unknown>): Promise<Docxtemplater> {
  const response = await fetch(TEMPLATE_URL)
  if (!response.ok) {
    throw new Error(`Falha ao buscar template: ${response.status} ${response.statusText}`)
  }

  const base64Text = await response.text()
  const templateBytes = base64ToUint8Array(base64Text)

  if (templateBytes.length !== EXPECTED_BYTE_COUNT) {
    throw new Error(
      `Template corrompido: tamanho inválido (${templateBytes.length} bytes, esperado ${EXPECTED_BYTE_COUNT})`,
    )
  }

  const zip = new PizZip(templateBytes)
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    delimiters: { start: '{', end: '}' },
  })

  doc.render(data)
  return doc
}

export async function generateReservaPropostaDocx(data: Record<string, unknown>): Promise<void> {
  const doc = await renderPropostaDoc(data)

  const blob = doc.getZip().generate({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'proposta-de-compra-e-reserva.docx'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Renderiza a minuta em memória e devolve o texto plano (sem baixar) para
// enviar direto ao Validador.
export async function getReservaPropostaText(data: Record<string, unknown>): Promise<string> {
  const doc = await renderPropostaDoc(data)
  return extractTextFromRenderedDoc(doc)
}
