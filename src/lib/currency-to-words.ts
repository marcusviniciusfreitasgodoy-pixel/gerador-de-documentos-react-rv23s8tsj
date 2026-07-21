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

// Escala por posição da tripla (grupo de 3 dígitos): índice 1 = milhar,
// 2 = milhão, 3 = bilhão. "mil" é invariável; milhão/bilhão têm plural.
const ESCALA_SINGULAR = ['', 'mil', 'milhão', 'bilhão']
const ESCALA_PLURAL = ['', 'mil', 'milhões', 'bilhões']

function numberToWords(n: number): string {
  if (n === 0) return 'zero'

  // Decompõe em triplas de 3 dígitos (base 1000), da menos significativa para a
  // mais. Ex.: 1.234.567 -> [567, 234, 1] (unidades, milhar, milhão).
  const triplas: number[] = []
  let x = Math.floor(n)
  while (x > 0) {
    triplas.push(x % 1000)
    x = Math.floor(x / 1000)
  }

  // Monta a frase de cada tripla NÃO-zero, da mais significativa para a menos.
  const frases: { valor: number; texto: string }[] = []
  for (let i = triplas.length - 1; i >= 0; i--) {
    const v = triplas[i]
    if (v === 0) continue
    let texto: string
    if (i === 0) texto = below1000(v)
    else if (i === 1) texto = v === 1 ? 'mil' : `${below1000(v)} mil`
    else texto = `${below1000(v)} ${v === 1 ? ESCALA_SINGULAR[i] : ESCALA_PLURAL[i]}`
    frases.push({ valor: v, texto })
  }

  // Junta os grupos com VÍRGULA, exceto o ÚLTIMO: antes dele usa-se " e " quando
  // a última tripla é < 100 OU múltiplo exato de 100 (regra do português). Por
  // isso "mil e vinte" e "mil e duzentos", mas "sessenta e três mil, duzentos e
  // cinquenta" (250 não é < 100 nem centena redonda). O join(' e ') anterior
  // produzia "...mil E duzentos e cinquenta", errado em todo documento.
  let resultado = frases[0].texto
  for (let k = 1; k < frases.length; k++) {
    const ehUltimo = k === frases.length - 1
    const v = frases[k].valor
    const usaE = ehUltimo && (v < 100 || v % 100 === 0)
    resultado += (usaE ? ' e ' : ', ') + frases[k].texto
  }
  return resultado
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
