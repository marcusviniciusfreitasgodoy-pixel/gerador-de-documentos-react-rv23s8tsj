import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function maskCpf(value: string) {
  let v = value.replace(/\D/g, '')
  if (v.length > 11) v = v.slice(0, 11)

  return v
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export function maskCurrency(value: string) {
  const v = value.replace(/\D/g, '')
  if (!v) return ''

  const number = parseInt(v, 10) / 100
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(number)
}
