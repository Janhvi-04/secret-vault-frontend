import { useState } from 'react';
import API from '../api/axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const response = await API.post('/auth/forgot-password', { username });
            setMessage(response.data.msg);
        } catch (err) {
            setError(err.response?.data?.msg || "Something went wrong. Try again.");
        }
    };
    return (
        <div className="flex min-h-screen items-center justify-center bg-teal-50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-white">
                <h2 className="text-3xl font-bold text-blue-500 mb-2 text-center">Reset Password</h2>
                <p className="text-gray-500 text-center mb-6 text-sm">Enter your username to receive a reset link.</p>
                {message && <p className="mb-4 p-3 rounded bg-green-50 text-green-700 text-sm text-center">{message}</p>}
                {error && <p className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Username"
                        className="w-full rounded-lg bg-teal-50 text-gray-900 p-3 border border-gray-400 focus:outline-none focus:border-blue-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <button className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 transition-all">
                        Send Reset Link
                    </button>
                </form>
                <div className="mt-4 text-center text-sm">
                    <Link to="/login" className="text-blue-500 hover:underline">Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;