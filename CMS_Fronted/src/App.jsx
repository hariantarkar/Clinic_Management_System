import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Login from './Pages/Login/Login.jsx'
import SignupPage from './Pages/Register/SinupPage.jsx'
import Home from './Pages/Login/Home.jsx'
import ForgotPassword from './Pages/Login/ForgotPassword.jsx'
function App() {

  return (
     <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignupPage />} />

        {/* 🔧 Swap this placeholder for your real dashboard route */}
        <Route path="/dashboard" element={<div>Dashboard (build me)</div>} />

        {/* Any unknown path falls back to the login page */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <ForgotPassword/>
    </BrowserRouter>

  )
}

export default App
