import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
}

const Button: React.FC<ButtonProps> = ({ children, loading, className = '', disabled, ...rest }) => {
  const isDisabled = disabled || loading
  return (
    <button
      {...rest}
      disabled={isDisabled}
      className={`${className} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <span className="loading">
          <span className="spinner" aria-hidden="true"></span>
          <span className="ml-2">Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  )
}

export default Button
