import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store'
import { verifyTwoFactor, clearError } from '../../store/slices/authSlice'
import Button from '../../components/shared/UI/Button'
import Input from '../../components/shared/UI/Input'
import Alert from '../../components/shared/UI/Alert'
import Card from '../../components/shared/UI/Card'
import { validateTwoFactorCode } from '../../utils/validators'
import { ROUTES } from '../../utils/constants'

const TwoFactorPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isLoading, error, isAuthenticated, requiresTwoFactor, twoFactorToken } =
    useAppSelector((state) => state.auth)

  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')

  useEffect(() => {
    if (!requiresTwoFactor || !twoFactorToken) {
      navigate(ROUTES.LOGIN)
    } else if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD)
    }
  }, [isAuthenticated, requiresTwoFactor, twoFactorToken, navigate])

  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setCode(value)
    if (codeError) {
      setCodeError('')
    }
  }

  const validate = (): boolean => {
    if (!code) {
      setCodeError('2FA code is required')
      return false
    }

    if (!validateTwoFactorCode(code)) {
      setCodeError('Invalid 2FA code (must be 6 digits)')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    if (!twoFactorToken) {
      navigate(ROUTES.LOGIN)
      return
    }

    dispatch(
      verifyTwoFactor({
        token: twoFactorToken,
        code,
      })
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gradient">Two-Factor Authentication</h1>
          <p className="text-dark-400 mt-2">Enter the 6-digit code from your authenticator app</p>
        </div>

        {error && <Alert type="error" message={error} className="mb-6" />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Authentication Code"
            name="code"
            type="text"
            placeholder="000000"
            value={code}
            onChange={handleChange}
            error={codeError}
            maxLength={6}
            className="text-center text-2xl tracking-widest font-mono"
            required
          />

          <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
            Verify Code
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(ROUTES.LOGIN)}
            className="text-sm text-dark-400 hover:text-dark-200 transition-colors"
          >
            Back to login
          </button>
        </div>
      </Card>
    </div>
  )
}

export default TwoFactorPage
