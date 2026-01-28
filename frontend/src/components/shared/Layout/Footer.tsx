import React from 'react'
import { Link } from 'react-router-dom'
import { APP_NAME } from '../../../utils/constants'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark-900 border-t border-dark-800 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-dark-400">
            © {currentYear} {APP_NAME}. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Link
              to="/about"
              className="text-sm text-dark-400 hover:text-dark-200 transition-colors"
            >
              About
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-dark-400 hover:text-dark-200 transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-dark-400 hover:text-dark-200 transition-colors"
            >
              Terms
            </Link>
            <Link
              to="/contact"
              className="text-sm text-dark-400 hover:text-dark-200 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
