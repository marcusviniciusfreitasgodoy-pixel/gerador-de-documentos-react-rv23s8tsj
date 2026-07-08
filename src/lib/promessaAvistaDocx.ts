import { downloadDocxFromTemplate } from '@/lib/docx-generator'
import { promessaAvistaTemplateBytes } from '@/lib/promessaAvistaDocxBase64'

export function generatePromessaAvistaDocx(data: Record<string, string>): void {
  downloadDocxFromTemplate(
    promessaAvistaTemplateBytes(),
    data,
    'compromisso-de-compra-e-venda-avista.docx',
  )
}
