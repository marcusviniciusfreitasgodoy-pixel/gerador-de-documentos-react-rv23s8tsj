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

export function maskCnpj(value: string) {
  let v = value.replace(/\D/g, '')
  if (v.length > 14) v = v.slice(0, 14)
  return v
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
}

export function maskCpfCnpj(value: string) {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 11) return maskCpf(value)
  return maskCnpj(value)
}

export function maskPhone(value: string) {
  let v = value.replace(/\D/g, '')
  if (v.length > 11) v = v.slice(0, 11)
  if (v.length <= 10) {
    return v.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d{1,4})$/, '$1-$2')
  }
  return v.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{1,4})$/, '$1-$2')
}

export function maskCep(value: string) {
  let v = value.replace(/\D/g, '')
  if (v.length > 8) v = v.slice(0, 8)
  return v.replace(/(\d{5})(\d{1,3})$/, '$1-$2')
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
