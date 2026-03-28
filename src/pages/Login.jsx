import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import API from '../api/axios';
import { validateLogin } from '../utils/validators';
export default  function Login() {
    const [formData,setFormData]=useState({username: '',password: ''});
    const {login}=useContext(AuthContext);
    const navigate=useNavigate();
    const handleSubmit=async(e)=>{
        e.preventDefault();
        const { isValid, errors } = validateLogin(formData);
        if (!isValid) {
            return alert(errors.username || errors.password);
        }
        try {
            const res=await API.post('/auth/login',formData);
            login(res.data.token, res.data.user);
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.msg || "Login Failed");
        }
    }
    return (
        <div className='flex min-h-screen items-center justify-center bg-teal-50 p-4'>
            <div className='w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-white'>
                <h2 className='text-3xl font-bold text-blue-500 mb-6 text-center'>Vault Login</h2>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <input type="email"
                     autoComplete="new-password"
                     placeholder='Email Address'
                     className='w-full rounded-lg bg-teal-50 text-gray-900 p-3 border border-gray-400 focus:outline-none focus:border-blue-500' 
                     onChange={(e)=>setFormData({...formData,username:e.target.value})}
                     required
                    />
                    <input type="password"
                     autoComplete="new-password"
                     placeholder='Master Password'
                     className='w-full rounded-lg bg-teal-50 text-gray-900 p-3 border border-gray-400 focus:outline-none focus:border-blue-500'
                     onChange={(e)=>setFormData({...formData,password:e.target.value})}
                     required
                    />
                    <div className='flex justify-end'>
                        <Link to="/forgot-password" className='text-xs text-blue-800 hover:underline font-medium'>
                            Forgot Password?
                        </Link>
                    </div>
                    <button className='w-full rounded-lg bg-blue-600 py-3 font-bold hover:bg-blue-700 transition-all'>Unlock Vault</button>
                </form>
                <p className='mt-4 text-center text-gray-400'>New here? <Link to="/register" className='text-blue-400 hover:underline'>Create Account</Link></p>
            </div>
        </div>
    );
}
