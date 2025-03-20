import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from "../config";

export default function Register() {
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [roles, setRoles] = useState([]);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        accountType: '',
        password: '',
        confirmPassword: '',
        terms: false
    });
    
    useEffect(() => {
        axios.get(`${API_BASE_URL}/system/roles`)
            .then(response => {
                setRoles(response.data);
                setFormData({
                    firstName: '',
                    lastName: '',
                    username: '',
                    email: '',
                    accountType: response.data[0].role, // Set default role
                    password: '',
                    confirmPassword: '',
                    terms: false
                });
            })
            .catch(error => {
                console.error('There was an error fetching the roles!', error);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        axios.post(`${API_BASE_URL}/auth/register`, {
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: formData.username,
            email: formData.email,
            role: formData.accountType,
            password: formData.password,
            enabled: formData.accountType === 'OWNER' ? false : true,
        })
        .then(response => {
            alert('Registration successful');
            // Reset form data
                setFormData({
                    firstName: '',
                    lastName: '',
                    username: '',
                    email: '',
                    accountType: roles[0].role, // Reset to default role    
                    password: '',
                    confirmPassword: '',
                    terms: false,
                });
            
        })
        .catch(error => {
                if (error.response && error.response.status === 409) {
                    alert('Username or email already exists');
                } else {
                    console.error('There was an error registering the user!', error);
                }
            });
    };

    return (
        <>
            <div className="p-10 bg-white relative">
                <div className="absolute top-0 right-0 p-4">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        New
                    </span>
                </div>

                <div className="mb-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
                    <p className="text-gray-600">Join our community today</p>
                    <div className="h-1 w-16 bg-blue-600 mt-4 rounded-full"></div>
                </div>

                <form className="space-y-2" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <i className="fa fa-user text-gray-400"></i>
                            </div>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                autoComplete="username"
                                required
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3.5 transition duration-150"
                                placeholder="yourusername"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-2">
                                First name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <i className="fa fa-user text-gray-400"></i>
                                </div>
                                <input
                                    type="text"
                                    id="first-name"
                                    name="firstName"
                                    autoComplete="given-name"
                                    required
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3.5 transition duration-150"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-2">
                                Last name
                            </label>
                            <input
                                type="text"
                                id="last-name"
                                name="lastName"
                                autoComplete="family-name"
                                required
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 transition duration-150"
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <i className="fa fa-envelope text-gray-400"></i>
                            </div>
                            <input
                                type="email"
                                id="register-email"
                                name="email"
                                autoComplete="email"
                                required
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3.5 transition duration-150"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="account-type" className="block text-sm font-medium text-gray-700 mb-2">
                            Register as
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <i className="fa fa-users text-gray-400"></i>
                            </div>
                            <select
                                id="account-type"
                                name="accountType"
                                required
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3.5 transition duration-150 appearance-none"
                                value={formData.accountType}
                                onChange={handleChange}
                            >
                                {roles.map(role => (
                                    <option key={role.id} value={role.role}>{role.role}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <i className="fa fa-lock text-gray-400"></i>
                            </div>
                            <input
                                type={showRegisterPassword ? "text" : "password"}
                                id="register-password"
                                name="password"
                                autoComplete="new-password"
                                required
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3.5 transition duration-150"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition"
                                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                            >
                                {showRegisterPassword ? (
                                    <i className="fa fa-eye"></i>
                                ) : (
                                    <i className="fa fa-eye"></i>
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <i className="fa fa-lock text-gray-400"></i>
                            </div>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirm-password"
                                name="confirmPassword"
                                autoComplete="new-password"
                                required
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3.5 transition duration-150"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <i className="fa fa-eye"></i>
                                ) : (
                                    <i className="fa fa-eye"></i>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            required
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={formData.terms}
                            onChange={handleChange}
                        />
                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                            I agree to the{" "}
                            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium transition">
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium transition">
                                Privacy Policy
                            </a>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-3.5 text-center transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        Create Account
                    </button>
                </form>
            </div>
        </>
    )
}