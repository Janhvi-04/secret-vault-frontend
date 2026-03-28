import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import API from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { validateRegistration } from '../utils/validators';
export default function Register() {
    const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { isValid, errors } = validateRegistration(formData);
    if (!isValid) {
        const firstError = Object.values(errors)[0];
        return alert(firstError);
    }
        try {
            const res = await API.post('/auth/register', {username: formData.username, password: formData.password});
            login(res.data.token, res.data.user);
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.msg || "Registration Failed");
        }
    };
    return (
        <div className="flex min-h-screen items-center justify-center bg-teal-50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-white">
                <div className='text-center'>
                    <h2 className="text-3xl font-bold text-blue-500 mb-3 text-center">Join the Vault</h2>
                    <p className="mb-4 text-gray-700 italic text-medium">Set your master credentials to begin.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="email" 
                        placeholder="Email Address"
                        className="w-full rounded-lg bg-teal-50 text-gray-900 p-3 border border-gray-400 focus:outline-none focus:border-blue-500"
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Create Password"
                        className="w-full rounded-lg bg-teal-50 text-gray-900 p-3 border border-gray-400 focus:outline-none focus:border-blue-500"
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                    />
                    <input
              type="password"
              placeholder="Confirm Password"
              className="w-full rounded-lg bg-teal-50 text-gray-900 p-3 border border-gray-400 focus:outline-none focus:border-blue-500"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
                    <button className="w-full rounded-lg bg-blue-600 py-3 font-bold hover:bg-blue-700 transition-all">
                        Register Account
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-400">
                    Already registered? <Link to="/login" className="text-blue-400 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}


