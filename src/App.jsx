import { useContext } from 'react'
import './App.css'
import {Toaster} from 'react-hot-toast';
import { AuthContext } from './contexts/AuthContext'
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard.jsx';
import LandingPage from './pages/LandingPage.jsx';
function App() {
  const {user,loading}=useContext(AuthContext);
  if(loading) return (
    <div className='flex min-h-screen items-center justify-center b-gray-950 text-white'>
      <h1 className='text-xl'>Initializing Vault...</h1>
    </div>
  )
  return (
    <BrowserRouter>
      <div className='min-h-screen bg-gray-950 text-white'>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/" element={<LandingPage/>} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path='/reset-password/:token' element={<ResetPassword/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
