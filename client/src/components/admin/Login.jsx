import React, { useState } from 'react';
import axios from 'axios';
import { Lock } from 'lucide-react';

const Login = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            const token = res.data.token;
            localStorage.setItem('token', token);
            setToken(token);
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary">
            <div className="bg-secondary p-8 rounded-xl border border-slate-700 w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center text-accent">
                        <Lock size={32} />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-white text-center mb-6">Admin Login</h2>

                {error && <div className="bg-red-500/20 text-red-500 p-3 rounded mb-4 text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-400 mb-2">Username</label>
                        <input
                            type="text"
                            className="input-field"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-2">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full btn-primary mt-4">Login</button>

                    <div className="text-center mt-4">
                        <a href="/" className="text-accent text-sm hover:underline">Back to Website</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
