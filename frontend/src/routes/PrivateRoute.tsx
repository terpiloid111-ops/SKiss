import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../store'
import { ROUTES } from '../utils/constants'
import Spinner from '../components/shared/UI/Spinner'

interface PrivateRouteProps {
  children: React.ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <Spinner size="lg" />
      </div>
    )
  }

  return isAuthenticated ? <>{children}</> : <Navigate to={ROUTES.LOGIN} replace />
}

export default PrivateRoute
