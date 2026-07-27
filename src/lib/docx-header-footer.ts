import { getBrokerProfile } from '@/services/broker-profile'

export interface HeaderFooterData {
  tipo_perfil: 'corretor_autonomo' | 'imobiliaria'
  nome: string
  creci: string
  creci_uf: string
  cpf: string
  razao_social: string
  nome_fantasia: string
  cnpj: string
  creci_juridico: string
  responsavel_nome: string
  responsavel_cpf: string
  responsavel_creci: string
  endereco: string
  cidade: string
  uf: string
  telefone: string
  email: string
}

const W_NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"'
const R_NS = 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"'

function escapeXmlText(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function filterNonEmpty(parts: (string | null | undefined)[]): string[] {
  return parts.filter((p): p is string => !!p && p.trim().length > 0)
}

function hRun(text: string): string {
  return `<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="20"/><w:szCs w:val="20"/><w:color w:val="666666"/></w:rPr><w:t xml:space="preserve">${escapeXmlText(text)}</w:t></w:r>`
}

function fRun(text: string): string {
  return `<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="18"/><w:szCs w:val="18"/><w:color w:val="999999"/></w:rPr><w:t xml:space="preserve">${escapeXmlText(text)}</w:t></w:r>`
}

function fPageField(): string {
  const rPr =
    '<w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="18"/><w:szCs w:val="18"/><w:color w:val="999999"/></w:rPr>'
  return `<w:r>${rPr}<w:fldChar w:fldCharType="begin"/></w:r><w:r>${rPr}<w:instrText xml:space="preserve">PAGE</w:instrText></w:r><w:r>${rPr}<w:fldChar w:fldCharType="end"/></w:r>`
}

function buildHeaderLines(d: HeaderFooterData): string[] {
  const lines: string[] = []

  if (d.tipo_perfil === 'imobiliaria') {
    const nomeDisplay = d.nome_fantasia ? `${d.razao_social} (${d.nome_fantasia})` : d.razao_social
    if (nomeDisplay.trim()) lines.push(nomeDisplay)

    const line2 = filterNonEmpty([
      d.cnpj ? `CNPJ ${d.cnpj}` : null,
      d.creci_juridico ? `CRECI-J ${d.creci_juridico}${d.creci_uf ? ' ' + d.creci_uf : ''}` : null,
    ])
    if (line2.length) lines.push(line2.join(' | '))

    if (d.responsavel_nome) {
      const line3 = filterNonEmpty([
        `Responsável: ${d.responsavel_nome}`,
        d.responsavel_cpf ? `CPF ${d.responsavel_cpf}` : null,
        d.responsavel_creci ? `CRECI ${d.responsavel_creci}` : null,
      ])
      if (line3.length) lines.push(line3.join(' | '))
    }
  } else {
    if (d.nome) lines.push(d.nome)

    const line2 = filterNonEmpty([
      d.creci ? `CRECI ${d.creci}${d.creci_uf ? ' ' + d.creci_uf : ''}` : null,
      d.cpf ? `CPF ${d.cpf}` : null,
    ])
    if (line2.length) lines.push(line2.join(' | '))
  }

  const addrParts = filterNonEmpty([d.endereco, d.cidade, d.uf])
  if (addrParts.length) {
    const addr =
      addrParts.length > 1 ? `${addrParts[0]}, ${addrParts.slice(1).join(' - ')}` : addrParts[0]
    lines.push(addr)
  }

  const contactParts = filterNonEmpty([d.telefone, d.email])
  if (contactParts.length) lines.push(contactParts.join(' | '))

  return lines
}

export function buildHeaderXml(d: HeaderFooterData): string {
  const lines = buildHeaderLines(d)

  if (lines.length === 0) {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:hdr ${W_NS} ${R_NS}>\n<w:p/>\n</w:hdr>`
  }

  const paragraphs = lines.map((line, i) => {
    const isLast = i === lines.length - 1
    const border = isLast
      ? '<w:pBdr><w:bottom w:val="single" w:sz="4" w:space="1" w:color="999999"/></w:pBdr>'
      : ''
    return `<w:p><w:pPr><w:spacing w:after="0"/><w:jc w:val="left"/>${border}</w:pPr>${hRun(line)}</w:p>`
  })

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:hdr ${W_NS} ${R_NS}>\n${paragraphs.join('\n')}\n</w:hdr>`
}

export function buildFooterXml(d: HeaderFooterData): string {
  const now = new Date()
  const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`

  const nome = d.tipo_perfil === 'imobiliaria' ? d.razao_social || d.nome_fantasia || '' : d.nome

  const creciDisplay =
    d.tipo_perfil === 'imobiliaria'
      ? d.creci_juridico
        ? `CRECI-J ${d.creci_juridico}${d.creci_uf ? ' ' + d.creci_uf : ''}`
        : ''
      : d.creci
        ? `CRECI ${d.creci}${d.creci_uf ? ' ' + d.creci_uf : ''}`
        : ''

  const parts = filterNonEmpty([
    nome || null,
    creciDisplay || null,
    `Documento gerado em ${dateStr}`,
    d.telefone || null,
    d.email || null,
  ])

  const runs: string[] = []
  if (parts.length) {
    runs.push(fRun(parts.join(' | ') + ' | '))
  }
  runs.push(fRun('Página '))
  runs.push(fPageField())

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:ftr ${W_NS} ${R_NS}>\n<w:p><w:pPr><w:spacing w:after="0"/><w:jc w:val="center"/><w:pBdr><w:top w:val="single" w:sz="4" w:space="1" w:color="999999"/></w:pBdr></w:pPr>${runs.join('')}</w:p>\n</w:ftr>`
}

export function buildStylesXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:styles ${W_NS}>\n<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr></w:rPrDefault></w:docDefaults>\n</w:styles>`
}

export function buildSectionProps(): string {
  return '<w:sectPr><w:headerReference w:type="default" r:id="rIdHdr1"/><w:footerReference w:type="default" r:id="rIdFtr1"/><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1701" w:right="1134" w:bottom="1134" w:left="1134" w:header="850" w:footer="850" w:gutter="0"/></w:sectPr>'
}

export async function fetchHeaderFooterData(): Promise<HeaderFooterData | undefined> {
  try {
    const profile = await getBrokerProfile()
    if (!profile) return undefined

    return {
      tipo_perfil: profile.tipo_perfil || 'corretor_autonomo',
      nome: profile.nome || profile.name || '',
      creci: profile.creci || '',
      creci_uf: profile.creci_uf || '',
      cpf: profile.cpf || '',
      razao_social: profile.razao_social || '',
      nome_fantasia: profile.nome_fantasia || '',
      cnpj: profile.cnpj || '',
      creci_juridico: profile.creci_juridico || '',
      responsavel_nome: profile.responsavel_nome || '',
      responsavel_cpf: profile.responsavel_cpf || '',
      responsavel_creci: profile.responsavel_creci || '',
      endereco: profile.endereco || '',
      cidade: profile.cidade || '',
      uf: profile.uf || '',
      telefone: profile.telefone || profile.phone || '',
      email: profile.email || '',
    }
  } catch {
    return undefined
  }
}
