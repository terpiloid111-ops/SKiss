import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Gift, UserPlus } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store'
import { register, clearError } from '../../store/slices/authSlice'
import Button from '../../components/shared/UI/Button'
import Input from '../../components/shared/UI/Input'
import Alert from '../../components/shared/UI/Alert'
import Card from '../../components/shared/UI/Card'
import {
  validateEmail,
  validateUsername,
  validatePassword,
  validateConfirmPassword,
} from '../../utils/validators'
import { ROUTES } from '../../utils/constants'

const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD)
    }
  }, [isAuthenticated, navigate])

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

    if (!formData.username) {
      newErrors.username = 'Username is required'
    } else if (!validateUsername(formData.username)) {
      newErrors.username = 'Username must be 3-20 characters, alphanumeric and underscores only'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address'
    }

    const passwordValidation = validatePassword(formData.password)
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0]
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (!validateConfirmPassword(formData.password, formData.confirmPassword)) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    dispatch(register(formData))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gradient">Create Account</h1>
          <p className="text-dark-400 mt-2">Join SKiss and start earning</p>
        </div>

        {error && <Alert type="error" message={error} className="mb-6" />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Username"
            name="username"
            type="text"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            icon={User}
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon={Mail}
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={Lock}
            helperText="Min 8 characters with uppercase, lowercase, number & special character"
            required
          />

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            icon={Lock}
            required
          />

          <Input
            label="Referral Code (Optional)"
            name="referralCode"
            type="text"
            placeholder="Enter referral code if you have one"
            value={formData.referralCode}
            onChange={handleChange}
            error={errors.referralCode}
            icon={Gift}
          />

          <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-dark-400">
            Already have an account?{' '}
            <Link
              to={ROUTES.LOGIN}
              className="text-primary-500 hover:text-primary-400 font-medium transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}

export default RegisterPage
