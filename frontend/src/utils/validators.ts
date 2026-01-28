export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateUsername = (username: string): boolean => {
  // Username: 3-20 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
  return usernameRegex.test(username)
}

export const validatePassword = (password: string): {
  isValid: boolean
  errors: string[]
} => {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const validateConfirmPassword = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword
}

export const validateReferralCode = (code: string): boolean => {
  // Referral code: 6-12 alphanumeric characters
  const codeRegex = /^[a-zA-Z0-9]{6,12}$/
  return codeRegex.test(code)
}

export const validateTwoFactorCode = (code: string): boolean => {
  // 2FA code: 6 digits
  const codeRegex = /^\d{6}$/
  return codeRegex.test(code)
}
