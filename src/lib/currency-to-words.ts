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
  const million = Math.floor(n / 1000000)
  const rest = n % 1000000
  const parts: string[] = []
  if (million === 1) parts.push('um milhão')
  else parts.push(`${below1Million(million)} milhões`)
  if (rest > 0) parts.push(below1Million(rest))
  return parts.join(' e ')
}

export function currencyToWords(value: number): string {
  const reais = Math.floor(Math.abs(value))
  const centavos = Math.round((Math.abs(value) - reais) * 100)
  const parts: string[] = []

  if (reais === 0) parts.push('zero reais')
  else if (reais === 1) parts.push('um real')
  else parts.push(`${numberToWords(reais)} reais`)

  if (centavos > 0) {
    if (centavos === 1) parts.push('um centavo')
    else parts.push(`${numberToWords(centavos)} centavos`)
  }

  return parts.join(' e ')
}
