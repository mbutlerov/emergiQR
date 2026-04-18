import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhone(phone: string): string {
  return phone.replace(/\s+/g, '').trim()
}

export function getPublicUrl(publicId: string): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${base}/e/${publicId}`
}

export const BLOOD_TYPES = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
  'unknown',
] as const
