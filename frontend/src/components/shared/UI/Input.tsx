import React, { forwardRef } from 'react'
import type { LucideIcon } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: LucideIcon
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-dark-200 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="h-5 w-5 text-dark-400" />
            </div>
          )}
          <input
            ref={ref}
            className={`w-full px-4 py-2 ${
              Icon ? 'pl-10' : ''
            } bg-dark-800 border ${
              error ? 'border-red-500 focus:ring-red-500' : 'border-dark-700 focus:ring-primary-500'
            } rounded-lg text-dark-50 placeholder-dark-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${className}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-dark-400">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
