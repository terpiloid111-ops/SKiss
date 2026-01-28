import axiosInstance from './axios'
import type {
  LoginRequest,
  RegisterRequest,
  TwoFactorVerifyRequest,
  AuthResponse,
  TwoFactorSetupResponse,
} from '../types/auth.types'
import type { ApiResponse } from './types'

export const authApi = {
  // Login
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>('/auth/login', data)
    return response.data.data!
  },

  // Register
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>('/auth/register', data)
    return response.data.data!
  },

  // Logout
  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  },

  // Refresh token
  refresh: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const response = await axiosInstance.post<ApiResponse<{ accessToken: string }>>(
      '/auth/refresh',
      { refreshToken }
    )
    return response.data.data!
  },

  // 2FA Setup
  setupTwoFactor: async (): Promise<TwoFactorSetupResponse> => {
    const response = await axiosInstance.post<ApiResponse<TwoFactorSetupResponse>>(
      '/auth/2fa/setup'
    )
    return response.data.data!
  },

  // 2FA Verify
  verifyTwoFactor: async (data: TwoFactorVerifyRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      '/auth/2fa/verify',
      data
    )
    return response.data.data!
  },

  // 2FA Enable
  enableTwoFactor: async (code: string): Promise<void> => {
    await axiosInstance.post('/auth/2fa/enable', { code })
  },

  // 2FA Disable
  disableTwoFactor: async (code: string): Promise<void> => {
    await axiosInstance.post('/auth/2fa/disable', { code })
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await axiosInstance.get('/auth/me')
    return response.data.data
  },
}

export default authApi
