import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Gift,
  Settings,
  Shield,
  BarChart3,
} from 'lucide-react'
import { useAppSelector } from '../../../store'
import { ROUTES, USER_ROLES } from '../../../utils/constants'

const Sidebar: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)

  const menuItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: ROUTES.DASHBOARD,
    },
    {
      name: 'Earnings',
      icon: DollarSign,
      path: ROUTES.EARNINGS,
    },
    {
      name: 'Referrals',
      icon: Gift,
      path: ROUTES.REFERRALS,
    },
    {
      name: 'Settings',
      icon: Settings,
      path: ROUTES.SETTINGS,
    },
  ]

  const adminMenuItems = [
    {
      name: 'Admin Panel',
      icon: Shield,
      path: ROUTES.ADMIN,
    },
    {
      name: 'Analytics',
      icon: BarChart3,
      path: '/admin/analytics',
    },
    {
      name: 'Users',
      icon: Users,
      path: '/admin/users',
    },
  ]

  const isAdmin = user?.role === USER_ROLES.ADMIN

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-dark-900 border-r border-dark-800">
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800'
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <div className="my-4 border-t border-dark-800"></div>
            <div className="px-4 py-2 text-xs font-semibold text-dark-500 uppercase tracking-wider">
              Admin
            </div>
            {adminMenuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-secondary-600 text-white'
                      : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800'
                  }`
                }
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </>
        )}
      </nav>
    </aside>
  )
}

export default Sidebar
