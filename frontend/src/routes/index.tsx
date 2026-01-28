import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/shared/Layout/Layout'
import PrivateRoute from './PrivateRoute'
import AdminRoute from './AdminRoute'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import TwoFactorPage from '../pages/auth/TwoFactorPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import { ROUTES } from '../utils/constants'

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTES.TWO_FACTOR} element={<TwoFactorPage />} />

      {/* Protected routes */}
      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route
          path={ROUTES.PROFILE}
          element={
            <div className="text-white">
              <h1 className="text-2xl font-bold">Profile Page</h1>
              <p className="text-dark-400 mt-2">Coming soon...</p>
            </div>
          }
        />
        <Route
          path={ROUTES.SETTINGS}
          element={
            <div className="text-white">
              <h1 className="text-2xl font-bold">Settings Page</h1>
              <p className="text-dark-400 mt-2">Coming soon...</p>
            </div>
          }
        />
        <Route
          path={ROUTES.EARNINGS}
          element={
            <div className="text-white">
              <h1 className="text-2xl font-bold">Earnings Page</h1>
              <p className="text-dark-400 mt-2">Coming soon...</p>
            </div>
          }
        />
        <Route
          path={ROUTES.REFERRALS}
          element={
            <div className="text-white">
              <h1 className="text-2xl font-bold">Referrals Page</h1>
              <p className="text-dark-400 mt-2">Coming soon...</p>
            </div>
          }
        />
      </Route>

      {/* Admin routes */}
      <Route
        path={ROUTES.ADMIN}
        element={
          <AdminRoute>
            <Layout />
          </AdminRoute>
        }
      >
        <Route
          index
          element={
            <div className="text-white">
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="text-dark-400 mt-2">Coming soon...</p>
            </div>
          }
        />
      </Route>

      {/* Default redirect */}
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  )
}

export default AppRoutes
