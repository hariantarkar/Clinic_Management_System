import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Login from './Pages/Login/Login.jsx'
import SignupPage from './Pages/Register/SinupPage.jsx'
import ForgotPassword from './Pages/Login/ForgotPassword.jsx'
import ForgotPasswordPage from './Pages/Password/ForgotPasswordPage.jsx'
import ResetPasswordPage from './Pages/Password/ResetPasswordPage.jsx'
import AdminDashboard from './Pages/AdminDashboard/AdminDashboard.jsx'
import DoctorDashboard from './Pages/DoctorDashboard/DoctorDashboard.jsx'
import PatientDashboard from './Pages/patient-dashboard/PatientDashboard.jsx'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/patient" element={<PatientDashboard />} />

        {/* Any unknown path falls back to the login page */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>


  )
}

export default App
