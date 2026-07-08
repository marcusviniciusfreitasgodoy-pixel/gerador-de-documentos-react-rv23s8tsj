import { renderFromUrl } from '@/lib/docx-generator'

const CHECKLIST_TEMPLATE_URL =
  'https://gist.githubusercontent.com/marcusviniciusfreitasgodoy-pixel/2fc9ab475e6486132bab6a43b8dc1d34/raw/be647c82910caefafb2bd28562e939d44dde6482/checklist_base64.txt'
const CHECKLIST_EXPECTED_BYTES = 39663

export async function generateChecklistDocx(data: Record<string, string>): Promise<void> {
  await renderFromUrl(
    CHECKLIST_TEMPLATE_URL,
    CHECKLIST_EXPECTED_BYTES,
    data,
    'checklist-documental.docx',
  )
}
