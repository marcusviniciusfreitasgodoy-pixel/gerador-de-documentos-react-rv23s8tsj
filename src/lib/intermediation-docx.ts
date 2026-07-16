import { renderFromUrl, extractTextFromUrl } from '@/lib/docx-generator'

const AUTORIZACAO_TEMPLATE_URL =
  'https://gist.githubusercontent.com/marcusviniciusfreitasgodoy-pixel/2fc9ab475e6486132bab6a43b8dc1d34/raw/51225c500d20503996bd055fd251ebe98a23dffe/autorizacao_base64.txt'
const AUTORIZACAO_EXPECTED_BYTES = 38634

export async function generateIntermediationDocx(data: Record<string, string>): Promise<void> {
  await renderFromUrl(
    AUTORIZACAO_TEMPLATE_URL,
    AUTORIZACAO_EXPECTED_BYTES,
    data,
    'autorizacao-de-intermediacao.docx',
  )
}

export async function getIntermediationText(data: Record<string, string>): Promise<string> {
  return extractTextFromUrl(AUTORIZACAO_TEMPLATE_URL, AUTORIZACAO_EXPECTED_BYTES, data)
}
