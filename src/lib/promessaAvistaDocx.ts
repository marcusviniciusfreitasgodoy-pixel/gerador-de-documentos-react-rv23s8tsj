import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'

const TEMPLATE_URL =
  'https://gist.githubusercontent.com/marcusviniciusfreitasgodoy-pixel/2fc9ab475e6486132bab6a43b8dc1d34/raw/d2a5285f6eb8b436bc5838bcfb3a62ef5a15dfe8/promessa_base64.txt'
const EXPECTED_BYTE_COUNT = 41647

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64.trim())
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

export async function generatePromessaAvistaDocx(
  data: Record<string, string | boolean>,
): Promise<void> {
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

  const blob = doc.getZip().generate({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'promessa-de-compra-e-venda.docx'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
