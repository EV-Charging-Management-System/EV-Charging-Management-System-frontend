'use client'
import './index.css'
import type React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Auth/Login'
import RegisterForm from './components/Auth/Register'
import ErrorBoundary from './components/Common/ErrorBoundary'
import { AuthProvider } from './context/AuthContext'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<ErrorBoundary><RegisterForm /></ErrorBoundary>} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
