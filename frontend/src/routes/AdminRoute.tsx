import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../store'
import { ROUTES, USER_ROLES } from '../utils/constants'
import Spinner from '../components/shared/UI/Spinner'

interface AdminRouteProps {
  children: React.ReactNode
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (user?.role !== USER_ROLES.ADMIN) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return <>{children}</>
}

export default AdminRoute
