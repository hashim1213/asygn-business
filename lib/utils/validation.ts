export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^$$?([0-9]{3})$$?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
  return phoneRegex.test(phone)
}

export function validateRequired(value: any): boolean {
  if (typeof value === "string") {
    return value.trim().length > 0
  }
  if (Array.isArray(value)) {
    return value.length > 0
  }
  return value != null
}

export function validateMinLength(value: string, minLength: number): boolean {
  return value.length >= minLength
}

export function validateMaxLength(value: string, maxLength: number): boolean {
  return value.length <= maxLength
}

export function validateNumber(value: any): boolean {
  return !isNaN(Number(value)) && isFinite(Number(value))
}

export function validatePositiveNumber(value: any): boolean {
  return validateNumber(value) && Number(value) > 0
}

export function validateRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Form validation helpers
export function createValidator<T>(rules: Partial<Record<keyof T, Array<(value: any) => string | undefined>>>) {
  return (values: T): Partial<Record<keyof T, string>> => {
    const errors: Partial<Record<keyof T, string>> = {}

    Object.keys(rules).forEach((key) => {
      const fieldRules = rules[key as keyof T]
      const value = values[key as keyof T]

      if (fieldRules) {
        for (const rule of fieldRules) {
          const error = rule(value)
          if (error) {
            errors[key as keyof T] = error
            break
          }
        }
      }
    })

    return errors
  }
}

// Common validation rules
export const required =
  (message = "This field is required") =>
  (value: any) =>
    validateRequired(value) ? undefined : message

export const email =
  (message = "Invalid email address") =>
  (value: string) =>
    validateEmail(value) ? undefined : message

export const phone =
  (message = "Invalid phone number") =>
  (value: string) =>
    validatePhone(value) ? undefined : message

export const minLength = (min: number, message?: string) => (value: string) =>
  validateMinLength(value, min) ? undefined : message || `Must be at least ${min} characters`

export const maxLength = (max: number, message?: string) => (value: string) =>
  validateMaxLength(value, max) ? undefined : message || `Must be no more than ${max} characters`

export const positiveNumber =
  (message = "Must be a positive number") =>
  (value: any) =>
    validatePositiveNumber(value) ? undefined : message
