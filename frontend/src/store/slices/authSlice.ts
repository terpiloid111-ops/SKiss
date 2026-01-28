import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { authApi } from '../../api/auth.api'
import type {
  LoginRequest,
  RegisterRequest,
  TwoFactorVerifyRequest,
  AuthResponse,
} from '../../types/auth.types'
import type { User } from '../../types/user.types'
import { toast } from 'react-toastify'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  requiresTwoFactor: boolean
  twoFactorToken: string | null
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,
  error: null,
  requiresTwoFactor: false,
  twoFactorToken: null,
}

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authApi.register(data)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)

export const verifyTwoFactor = createAsyncThunk(
  'auth/verifyTwoFactor',
  async (data: TwoFactorVerifyRequest, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyTwoFactor(data)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '2FA verification failed')
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  await authApi.logout()
})

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const user = await authApi.getCurrentUser()
    return user
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to get user')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setToken: (state, action: PayloadAction<{ accessToken: string; refreshToken?: string }>) => {
      state.accessToken = action.payload.accessToken
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken
      }
      state.isAuthenticated = true
      localStorage.setItem('accessToken', action.payload.accessToken)
      if (action.payload.refreshToken) {
        localStorage.setItem('refreshToken', action.payload.refreshToken)
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false
        if (action.payload.requiresTwoFactor) {
          state.requiresTwoFactor = true
          state.twoFactorToken = action.payload.twoFactorToken || null
        } else {
          state.user = action.payload.user
          state.accessToken = action.payload.accessToken
          state.refreshToken = action.payload.refreshToken || null
          state.isAuthenticated = true
          state.requiresTwoFactor = false
          localStorage.setItem('accessToken', action.payload.accessToken)
          if (action.payload.refreshToken) {
            localStorage.setItem('refreshToken', action.payload.refreshToken)
          }
          toast.success('Login successful!')
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken || null
        state.isAuthenticated = true
        localStorage.setItem('accessToken', action.payload.accessToken)
        if (action.payload.refreshToken) {
          localStorage.setItem('refreshToken', action.payload.refreshToken)
        }
        toast.success('Registration successful!')
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Verify 2FA
    builder
      .addCase(verifyTwoFactor.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(verifyTwoFactor.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken || null
        state.isAuthenticated = true
        state.requiresTwoFactor = false
        state.twoFactorToken = null
        localStorage.setItem('accessToken', action.payload.accessToken)
        if (action.payload.refreshToken) {
          localStorage.setItem('refreshToken', action.payload.refreshToken)
        }
        toast.success('2FA verification successful!')
      })
      .addCase(verifyTwoFactor.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.requiresTwoFactor = false
      state.twoFactorToken = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      toast.success('Logged out successfully')
    })

    // Get current user
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      })
  },
})

export const { clearError, setToken } = authSlice.actions
export default authSlice.reducer
