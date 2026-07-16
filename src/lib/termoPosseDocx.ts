import { renderFromUrl, extractTextFromUrl } from '@/lib/docx-generator'

const TERMO_POSSE_TEMPLATE_URL =
  'https://gist.githubusercontent.com/marcusviniciusfreitasgodoy-pixel/2fc9ab475e6486132bab6a43b8dc1d34/raw/c05a2f9dd3303f8977ab8e7a2a0a6e10a1219b88/termo_posse_base64.txt'
const TERMO_POSSE_EXPECTED_BYTES = 38892

export async function generateTermoPosseDocx(data: Record<string, string>): Promise<void> {
  await renderFromUrl(
    TERMO_POSSE_TEMPLATE_URL,
    TERMO_POSSE_EXPECTED_BYTES,
    data,
    'termo-de-transmissao-da-posse.docx',
  )
}

export async function getTermoPosseText(data: Record<string, string>): Promise<string> {
  return extractTextFromUrl(TERMO_POSSE_TEMPLATE_URL, TERMO_POSSE_EXPECTED_BYTES, data)
}
