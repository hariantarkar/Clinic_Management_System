import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Login from './Pages/Login/Login.jsx'
import SignupPage from './Pages/Register/SinupPage.jsx'
function App() {

  return (
    <>
     <Login/>
     <SignupPage/>
    </>
  )
}

export default App
