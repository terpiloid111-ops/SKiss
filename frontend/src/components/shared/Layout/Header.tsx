import React from 'react'
import { Link } from 'react-router-dom'
import { Bell, User, LogOut, Settings } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../../../store'
import { logout } from '../../../store/slices/authSlice'
import { ROUTES } from '../../../utils/constants'

const Header: React.FC = () => {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const [showUserMenu, setShowUserMenu] = React.useState(false)

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <header className="sticky top-0 z-40 bg-dark-900/95 backdrop-blur-sm border-b border-dark-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg"></div>
            <span className="text-xl font-bold text-gradient">SKiss</span>
          </Link>

          {/* Right side */}
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-dark-400 hover:text-dark-200 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-dark-800 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-dark-200">{user.username}</span>
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-48 bg-dark-800 border border-dark-700 rounded-lg shadow-lg py-1 z-20">
                      <Link
                        to={ROUTES.PROFILE}
                        className="flex items-center px-4 py-2 text-sm text-dark-200 hover:bg-dark-700 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      <Link
                        to={ROUTES.SETTINGS}
                        className="flex items-center px-4 py-2 text-sm text-dark-200 hover:bg-dark-700 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                      <hr className="my-1 border-dark-700" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-dark-700 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to={ROUTES.LOGIN}
                className="text-sm font-medium text-dark-200 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
