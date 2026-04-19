import type { LoginPayload } from '@/types/auth.types'

export function emailIsValid(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function loginValidator(payload: LoginPayload): { valid: boolean; message: string } {
  if (!payload.email.trim() || !payload.password.trim()) {
    return { valid: false, message: 'Email and password are required.' }
  }

  if (!emailIsValid(payload.email)) {
    return { valid: false, message: 'Enter a valid work email address.' }
  }

  return { valid: true, message: '' }
}
