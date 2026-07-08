import { renderFromUrl } from '@/lib/docx-generator'

const TERMO_CHAVES_TEMPLATE_URL =
  'https://gist.githubusercontent.com/marcusviniciusfreitasgodoy-pixel/2fc9ab475e6486132bab6a43b8dc1d34/raw/935c59ae029e6c52e8ceb4932ca5dbe0cbd33c4d/termo_chaves_base64.txt'
const TERMO_CHAVES_EXPECTED_BYTES = 38429

export async function generateTermoChavesDocx(data: Record<string, string>): Promise<void> {
  await renderFromUrl(
    TERMO_CHAVES_TEMPLATE_URL,
    TERMO_CHAVES_EXPECTED_BYTES,
    data,
    'termo-de-entrega-das-chaves.docx',
  )
}
