const UNITS = [
  '',
  'um',
  'dois',
  'três',
  'quatro',
  'cinco',
  'seis',
  'sete',
  'oito',
  'nove',
  'dez',
  'onze',
  'doze',
  'treze',
  'quatorze',
  'quinze',
  'dezesseis',
  'dezessete',
  'dezoito',
  'dezenove',
]
const TENS = [
  '',
  '',
  'vinte',
  'trinta',
  'quarenta',
  'cinquenta',
  'sessenta',
  'setenta',
  'oitenta',
  'noventa',
]
const HUNDREDS = [
  '',
  'cento',
  'duzentos',
  'trezentos',
  'quatrocentos',
  'quinhentos',
  'seiscentos',
  'setecentos',
  'oitocentos',
  'novecentos',
]

function below100(n: number): string {
  if (n < 20) return UNITS[n]
  const t = Math.floor(n / 10)
  const u = n % 10
  return u === 0 ? TENS[t] : `${TENS[t]} e ${UNITS[u]}`
}

function below1000(n: number): string {
  if (n === 100) return 'cem'
  const h = Math.floor(n / 100)
  const rest = n % 100
  if (h === 0) return below100(rest)
  if (rest === 0) return HUNDREDS[h]
  return `${HUNDREDS[h]} e ${below100(rest)}`
}

function below1Million(n: number): string {
  const thousand = Math.floor(n / 1000)
  const rest = n % 1000
  const parts: string[] = []
  if (thousand > 0) {
    parts.push(thousand === 1 ? 'mil' : `${below1000(thousand)} mil`)
  }
  if (rest > 0) parts.push(below1000(rest))
  return parts.join(' e ')
}

function numberToWords(n: number): string {
  if (n === 0) return 'zero'
  if (n < 1000000) return below1Million(n)
  if (n < 1000000000) {
    const million = Math.floor(n / 1000000)
    const rest = n % 1000000
    const parts: string[] = []
    if (million === 1) parts.push('um milhão')
    else parts.push(`${below1Million(million)} milhões`)
    if (rest > 0) parts.push(below1Million(rest))
    return parts.join(' e ')
  }
  // Sem este ramo, 1.000.000.000 caia em below1Million e saia "um mil milhoes".
  const billion = Math.floor(n / 1000000000)
  const rest = n % 1000000000
  const parts: string[] = []
  if (billion === 1) parts.push('um bilhão')
  else parts.push(`${below1Million(billion)} bilhões`)
  if (rest > 0) parts.push(numberToWords(rest))
  return parts.join(' e ')
}

export function currencyToWords(value: number): string {
  // A1: arredonda para centavos ANTES de separar. Fazer floor nos reais e round
  // nos centavos em separado podia gerar 100 centavos — 999,995 saia como
  // "novecentos e noventa e nove reais e cem centavos" enquanto a cifra
  // formatada mostrava R$ 1.000,00. Extenso e figura se contradiziam, e o
  // extenso e o que prevalece juridicamente.
  const totalCentavos = Math.round(Math.abs(value) * 100)
  const reais = Math.floor(totalCentavos / 100)
  const centavos = totalCentavos % 100
  const parts: string[] = []

  if (reais === 0) parts.push('zero reais')
  else if (reais === 1) parts.push('um real')
  else {
    const ext = numberToWords(reais)
    // "um milhão DE reais": a preposição é obrigatória quando o número TERMINA
    // em milhão/bilhão. Sem isto, R$ 1.000.000,00 (valor corriqueiro de imóvel)
    // saía por extenso como "um milhão reais". Com resto não entra:
    // "um milhão e quinhentos mil reais" está correto sem o "de".
    const precisaDe = /(milhão|milhões|bilhão|bilhões)$/.test(ext)
    parts.push(`${ext}${precisaDe ? ' de' : ''} reais`)
  }

  if (centavos > 0) {
    if (centavos === 1) parts.push('um centavo')
    else parts.push(`${numberToWords(centavos)} centavos`)
  }

  return parts.join(' e ')
}
