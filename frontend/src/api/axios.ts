import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import { toast } from 'react-toastify'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add token to requests
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors and token refresh
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await axios.post(`${baseURL}/auth/refresh`, { refreshToken })
          const { accessToken } = response.data

          localStorage.setItem('accessToken', accessToken)

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
          }

          return axiosInstance(originalRequest)
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Handle error messages
    if (error.response?.data) {
      const errorData = error.response.data as any
      const message = errorData.message || errorData.error || 'An error occurred'
      toast.error(message)
    } else if (error.message) {
      toast.error(error.message)
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
