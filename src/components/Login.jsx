import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        const postData = {
            'username': username,
            'password': password
        };
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
        });
        const response = await res.json();
        const statusCode = res.status;

        if (statusCode == 200) {
            localStorage.setItem("user", JSON.stringify(response.userDetail));
            localStorage.setItem("access_token", response.accessToken);
            localStorage.setItem("refresh_token", response.refreshToken);
            const role = response.userDetail.role.toLowerCase();
            navigate('/' + role);
        }
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const role = user.role ? user.role.toLowerCase() : null;
        if (role) {
            navigate('/' + role);
        }
    }, []);

    return (
        <>
            <div className="p-10 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                    <p className="text-gray-600">Sign in to access your account</p>
                    <div className="h-1 w-16 bg-blue-600 mt-4 rounded-full"></div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <i className="fa fa-envelope h-5 w-5 text-gray-400"></i>
                            </div>
                            <input
                                type="text"
                                id="login-email"
                                name="email"
                                autoComplete="email"
                                value={username}
                                required
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3.5 transition duration-150"
                                placeholder="your@email.com"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between mb-2">
                            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <i className="fa fa-lock h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showLoginPassword ? "text" : "password"}
                                id="login-password"
                                name="password"
                                value={password}
                                autoComplete="current-password"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3.5 transition duration-150"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition"
                                onClick={() => setShowLoginPassword(!showLoginPassword)}
                            >
                                {showLoginPassword ? (
                                    <i className="fa fa-eye"></i>
                                ) : (
                                    <i className="fa fa-eye"></i>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={login}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-3.5 text-center transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        Sign in
                    </button>
                </div>
            </div>
        </>
    )
}