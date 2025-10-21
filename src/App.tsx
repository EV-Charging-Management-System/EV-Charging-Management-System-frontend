import React from 'react'
import './index.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import RequireAuth from './components/Common/RequireAuth'
import Toast from './components/Common/Toast'

// Auth pages
import Login from './components/Auth/Login'
import RegisterForm from './components/Auth/Register'
import ErrorBoundary from './components/Common/ErrorBoundary'
import Logout from './components/Auth/Logout'

// Feature pages from Phuc branch
import HomePage from './components/Auth/HomePage'
import Premium from './components/Auth/Premium'
import PremiumDetail from './components/Auth/PremiumDetail'
import ViTraSau from './components/Auth/ViTraSau'
import BookingOnlineStation from './components/Auth/BookingOnlineStation'
import Payment from './components/Auth/Payment'
import Contact from './components/Auth/Contact'
import Business from './components/Auth/Business'
import Blog from './components/Auth/Blog'
import BookingDetail from './components/Auth/BookingDetail'
import ChargingSchedule from './components/Auth/ChargingSchedule'
import ChargingSession from './components/Auth/ChargingSession'
import Pay from './components/Auth/Pay'
import HomePageStaff from './components/Auth/HomePageStaff'
import ProfileStaff from './components/Auth/ProfileStaff'
import LocationDetail from './components/Auth/LocationDetail'
import Location from './components/Auth/Location'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toast />
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<ErrorBoundary><RegisterForm /></ErrorBoundary>} />
          <Route path="/logout" element={<Logout />} />

          {/* default open to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Main pages (protected) */}
          <Route path="/home" element={<RequireAuth><HomePage /></RequireAuth>} />
          <Route path="/booking-online-station" element={<RequireAuth><BookingOnlineStation /></RequireAuth>} />
          <Route path="/premium" element={<RequireAuth><Premium /></RequireAuth>} />
          <Route path="/premium/:type" element={<RequireAuth><PremiumDetail /></RequireAuth>} />
          <Route path="/vi-tra-sau" element={<RequireAuth><ViTraSau /></RequireAuth>} />
          <Route path="/blog" element={<RequireAuth><Blog /></RequireAuth>} />
          <Route path="/payment" element={<RequireAuth><Payment /></RequireAuth>} />
          <Route path="/contact" element={<RequireAuth><Contact /></RequireAuth>} />
          <Route path="/business" element={<RequireAuth><Business /></RequireAuth>} />
          <Route path="/booking-detail/:id" element={<RequireAuth><BookingDetail /></RequireAuth>} />
          <Route path="/charging-schedule" element={<RequireAuth><ChargingSchedule /></RequireAuth>} />
          <Route path="/charging-session" element={<RequireAuth><ChargingSession /></RequireAuth>} />
          <Route path="/pay" element={<RequireAuth><Pay /></RequireAuth>} />

          {/* Staff pages */}
          <Route path="/staff" element={<RequireAuth><HomePageStaff /></RequireAuth>} />
          <Route path="/staff/profile" element={<RequireAuth><ProfileStaff /></RequireAuth>} />
          <Route path="/staff/location" element={<RequireAuth><Location /></RequireAuth>} />
          <Route path="/staff/location/:id" element={<RequireAuth><LocationDetail /></RequireAuth>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
