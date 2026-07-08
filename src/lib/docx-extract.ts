import PizZip from 'pizzip'

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
        const xmlContent = documentXml.asText()
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
        resolve(lines.join('\n'))
      } catch (err) {
        reject(new Error('Falha ao extrair texto do documento.'))
      }
    }
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo.'))
    reader.readAsArrayBuffer(file)
  })
}
