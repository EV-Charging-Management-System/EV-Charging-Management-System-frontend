'use client'

import type React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import type { LoginRequest } from '../../utils/types'
import './Login.css'

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginRequest>({
    Email: '',
    PasswordHash: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  console.log('[Login] current user in localStorage:', localStorage.getItem('user'))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev: LoginRequest) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
    const resp = await login(formData)
    console.log('[Login] login response:', resp)
        // on success, go to home page
        if (resp && resp.success !== false) {
          navigate('/home')
          return
        }
    } catch (err) {
      console.error('Login attempt failed:', err)
      // If network error or backend not available, try local fallback
      const isNetworkError = !(err as any)?.response
      if (isNetworkError) {
        // Try to use persisted 'user' first (set by Register fallback or previous login)
        const persistedUserRaw = localStorage.getItem('user')
        if (persistedUserRaw) {
          const u = JSON.parse(persistedUserRaw)
          // naive check: if emails match
          if (u.email === formData.Email || u.phoneNumber === formData.Email) {
            navigate('/')
            return
          }
        }

        // Then try local_users fallback
        const localUsersRaw = localStorage.getItem('local_users')
        const localUsers = localUsersRaw ? JSON.parse(localUsersRaw) : []
        const credential = formData.Email
        const matched = localUsers.find((u: any) => (u.emailAddress === credential || u.phoneNumber === credential) && u.password === formData.PasswordHash)
        if (matched) {
          // Emulate successful login
          localStorage.setItem('user', JSON.stringify({ name: matched.fullName, email: matched.emailAddress }))
          navigate('/')
          return
        }

        setError('Network Error: cannot reach authentication server. You can use local/demo account if available.')
        return
      }

      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    console.log('Google login clicked')
  }

  return (
    <div className="login-container">
      {/* Left side - Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Optimizing your<br />
            journey
          </h1>
          <h2 className="hero-subtitle">
            Powering your life
          </h2>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="form-section">
        <div className="form-wrapper">
          {/* Logo and Navigation */}
          <div className="top-nav">
            <Link to="/" className="nav-link">
              <img src="/logo.jpg" alt="EV Charging Logo" className="h-8 object-contain" />
            </Link>
            <Link to="/login" className="nav-link active">Login</Link>
          </div>

          {/* Login Form */}
          <div className="login-card">
            <h2 className="form-title">Login</h2>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              {/* Username Input */}
              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">👤</span>
                  Username
                </label>
                <input
                  type="text"
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  placeholder="Email or username"
                  className="form-input"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">🔒</span>
                  Password
                </label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="PasswordHash"
                    value={formData.PasswordHash}
                    onChange={handleChange}
                    placeholder="........"
                    className="form-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="form-options">
                <label className="remember-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="checkbox"
                  />
                  <span>Remember Me</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-login"
              >
                {loading ? (
                  <span className="loading">
                    <span className="spinner"></span>
                    Loading...
                  </span>
                ) : (
                  <>🔌 Login</>
                )}
              </button>

              {/* Divider */}
              <div className="divider">
                <span>OR</span>
              </div>

              {/* Google Login Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="btn-google"
              >
                <svg className="google-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              {/* Sign Up Link */}
              <div className="signup-link">
                <span>Don't have an account? </span>
                <Link to="/register" className="link-primary">
                  SIGN UP
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
