import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import { promessaAvistaTemplateBytes } from '@/lib/promessaAvistaDocxBase64'

export function generatePromessaAvistaDocx(data: Record<string, string | boolean>): void {
  const templateBytes = promessaAvistaTemplateBytes()

  if (templateBytes.length !== 41519) {
    throw new Error('Template corrompido: tamanho inválido')
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
