import PizZip from 'pizzip'

// Extrai texto de um word/document.xml, um parágrafo por linha (preserva a
// separação de cláusulas — essencial para o Validador citar por cláusula).
export function extractTextFromDocumentXml(xmlContent: string): string {
  const paragraphs = xmlContent.match(/<w:p[\s\S]*?<\/w:p>/g) || []
  const lines: string[] = []
  for (const para of paragraphs) {
    const textRuns = para.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g) || []
    const lineText = textRuns
      .map((t) => t.replace(/<w:t[^>]*>/, '').replace(/<\/w:t>/, ''))
      .join('')
    if (lineText.trim()) {
      lines.push(lineText)
    }
  }
  return lines.join('\n')
}

// Extrai o texto plano de um documento docxtemplater JÁ renderizado (pós-render).
// Usa a MESMA extração do upload, então o Validador recebe texto idêntico ao de
// um .docx carregado manualmente.
export function extractTextFromRenderedDoc(doc: { getZip: () => PizZip }): string {
  const documentXml = doc.getZip().file('word/document.xml')
  if (!documentXml) {
    throw new Error('Documento renderizado inválido: document.xml não encontrado.')
  }
  return extractTextFromDocumentXml(documentXml.asText())
}

export function extractTextFromDocx(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result
        if (!arrayBuffer) {
          reject(new Error('Não foi possível ler o arquivo.'))
          return
        }
        const zip = new PizZip(arrayBuffer as ArrayBuffer)
        const documentXml = zip.file('word/document.xml')
        if (!documentXml) {
          reject(new Error('Arquivo .docx inválido: document.xml não encontrado.'))
          return
        }
        resolve(extractTextFromDocumentXml(documentXml.asText()))
      } catch (err) {
        reject(new Error('Falha ao extrair texto do documento.'))
      }
    }
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo.'))
    reader.readAsArrayBuffer(file)
  })
}
