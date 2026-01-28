import type { User } from './user.types'

export interface LoginRequest {
  identifier: string // username or email
  password: string
  captcha?: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
  referralCode?: string
}

export interface TwoFactorVerifyRequest {
  token: string
  code: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken?: string
  requiresTwoFactor?: boolean
  twoFactorToken?: string
}

export interface TwoFactorSetupResponse {
  secret: string
  qrCode: string
}

export interface RefreshTokenResponse {
  accessToken: string
}
