import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
}) => {
  return (
    <div
      className={`bg-dark-900 border border-dark-800 rounded-xl shadow-lg p-6 ${
        hover ? 'hover:shadow-xl hover:border-dark-700 transition-all cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Card
