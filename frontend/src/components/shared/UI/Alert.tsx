import React from 'react'
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react'

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  onClose?: () => void
  className?: string
}

const Alert: React.FC<AlertProps> = ({ type, message, onClose, className = '' }) => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const classes = {
    success: 'bg-green-900/20 border-green-700 text-green-400',
    error: 'bg-red-900/20 border-red-700 text-red-400',
    warning: 'bg-yellow-900/20 border-yellow-700 text-yellow-400',
    info: 'bg-blue-900/20 border-blue-700 text-blue-400',
  }

  const Icon = icons[type]

  return (
    <div className={`flex items-start px-4 py-3 rounded-lg border ${classes[type]} ${className}`}>
      <Icon className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
      <p className="flex-1 text-sm">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-3 flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export default Alert
