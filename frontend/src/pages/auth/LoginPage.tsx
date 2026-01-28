import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, LogIn } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store'
import { login, clearError } from '../../store/slices/authSlice'
import Button from '../../components/shared/UI/Button'
import Input from '../../components/shared/UI/Input'
import Alert from '../../components/shared/UI/Alert'
import Card from '../../components/shared/UI/Card'
import { ROUTES } from '../../utils/constants'

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isLoading, error, isAuthenticated, requiresTwoFactor } = useAppSelector(
    (state) => state.auth
  )

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isAuthenticated && !requiresTwoFactor) {
      navigate(ROUTES.DASHBOARD)
    } else if (requiresTwoFactor) {
      navigate(ROUTES.TWO_FACTOR)
    }
  }, [isAuthenticated, requiresTwoFactor, navigate])

  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      })
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.identifier) {
      newErrors.identifier = 'Email or username is required'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    dispatch(login(formData))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gradient">Welcome Back</h1>
          <p className="text-dark-400 mt-2">Login to your SKiss account</p>
        </div>

        {error && <Alert type="error" message={error} className="mb-6" />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email or Username"
            name="identifier"
            type="text"
            placeholder="Enter your email or username"
            value={formData.identifier}
            onChange={handleChange}
            error={errors.identifier}
            icon={Mail}
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={Lock}
            required
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-dark-700 bg-dark-800 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-dark-400">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-primary-500 hover:text-primary-400 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
            Login
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-dark-400">
            Don't have an account?{' '}
            <Link
              to={ROUTES.REGISTER}
              className="text-primary-500 hover:text-primary-400 font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}

export default LoginPage
