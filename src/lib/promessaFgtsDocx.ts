import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import { extractTextFromRenderedDoc } from '@/lib/docx-extract'

// TEMPLATE OBJETO-ENXUTO: pin 8b6b4c28 = 42056 bytes.
// A Cláusula Primeira descreve o imóvel UMA vez. O pin anterior (1245ba91 = 42142)
// repetia endereço, bairro, CEP, vagas e fração DEPOIS da {imovel_descricao} — e como
// a descrição vem da matrícula e já traz tudo isso, o mesmo bem saía descrito duas
// vezes, com vocabulários diferentes ("freguesia de Jacarepaguá" × "Barra da Tijuca"),
// o que num contrato lê como contradição. Quem individualiza o imóvel é matrícula+RGI;
// os campos estruturados seguem no formulário, alimentando o dossiê e os outros docs.
// Além do partes-flexíveis e do "qualquer cidade", a cláusula de atualização cadastral do IPTU segue condicional:
// {#iptu_rj} versão reforçada (60d + Lei 5.400/2012 + multa) / {^iptu_rj} 30d.
const TEMPLATE_URL =
  'https://gist.githubusercontent.com/marcusviniciusfreitasgodoy-pixel/2fc9ab475e6486132bab6a43b8dc1d34/raw/8b6b4c2826f28cf1819c27298dd1fb2e229fc203/promessa_fgts_base64.txt'
const EXPECTED_BYTE_COUNT = 42056

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
async function renderPromessaFgtsDoc(data: Record<string, unknown>): Promise<Docxtemplater> {
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

export async function generatePromessaFgtsDocx(data: Record<string, unknown>): Promise<void> {
  const doc = await renderPromessaFgtsDoc(data)

  const blob = doc.getZip().generate({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'promessa-de-compra-e-venda-fgts.docx'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Renderiza a minuta em memória e devolve o texto plano (sem baixar) para
// enviar direto ao Validador.
export async function getPromessaFgtsText(data: Record<string, unknown>): Promise<string> {
  const doc = await renderPromessaFgtsDoc(data)
  return extractTextFromRenderedDoc(doc)
}
