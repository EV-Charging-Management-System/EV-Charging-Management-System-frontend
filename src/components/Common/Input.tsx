import React from 'react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string | null
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...rest }) => {
  return (
    <div>
      {label && <label className="form-label">{label}</label>}
      <input className={`form-input ${className}`} {...rest} />
      {error && <div className="error-message">{error}</div>}
    </div>
  )
}

export default Input
