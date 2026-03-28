import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from '../api/axios';
import { validateResetPassword } from "../utils/validators";
export default function ResetPassword() {
    const {token}=useParams();
    const navigate=useNavigate();
    const [password,setPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('');
    const [message,setMessage]=useState('');
    const handleSubmit=async(e)=>{
        e.preventDefault();
        const { isValid, errors } = validateResetPassword(password, confirmPassword);
        if (!isValid) {
            return alert(errors.password || errors.confirm);
        }
        try {
            const res=await API.post(`/auth/reset-password/${token}`,{password});
            alert("Password reset successfull! Redirecting to login...");
            setTimeout(()=>{
                navigate('/login');
            },3000);
        } catch (err) {
            setMessage(err.response?.data?.msg || "Reset failed. Link might be expired.");
        }
    }
    return (
        <div className="flex min-h-screen items-center justify-center bg-teal-50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-white">
                <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">Create Password</h2>
                {message && <p className="text-red-500 text-sm mb-4 text-center">{message}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="password"
                    placeholder="New Password"
                    className="w-full rounded-lg bg-teal-50 text-gray-900 p-3 border border-gray-400 focus:outline-none focus:border-blue-500"
                    onChange={(e)=>setPassword(e.target.value)}
                    required
                    />
                    <input type="password"
                    placeholder="Confirm Password"
                    className="w-full rounded-lg bg-teal-50 text-gray-900 p-3 border border-gray-400 focus:outline-none focus:border-blue-500"
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                    required
                    />
                    <button className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 transition-all">Update Password</button>
                </form>
            </div>
        </div>
    );
}