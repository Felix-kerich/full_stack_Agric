// src/app/(auth)/register/page.jsx

"use client"; // Mark this file as a client component

import React, { useState } from 'react';
import UserService from '../../../hooks/UserService'; // Adjust the path if needed
import { useRouter } from 'next/navigation'; // Use Next.js router
import Image from 'next/image'; // Use Next.js Image component
import logo from '../../../public/logo.jpg'; // Ensure correct path


const UserRegistrationPage = () => {
  const router = useRouter(); // Use Next.js router

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
    city: '',
  });

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    specialChar: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false); // State to track terms checkbox

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === 'email' ? value.toLowerCase() : value;

    if (name === 'password') {
      validatePassword(value);
    }

    setFormData({ ...formData, [name]: newValue });
  };

  const validatePassword = (password) => {
    setPasswordCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      specialChar: /[!@#$%^&*()_+{}\[\]:;"'<>,.?~`]/.test(password),
    });
  };

  const isPasswordValid = () => {
    return (
      passwordCriteria.length &&
      passwordCriteria.uppercase &&
      passwordCriteria.lowercase &&
      passwordCriteria.specialChar
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid()) {
      alert('Password does not meet the criteria.');
      return;
    }

    if (!agreeTerms) {
      alert('You must agree to the Terms and Conditions.');
      return;
    }

    try {
      await UserService.UserRegister(formData);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'USER',
        city: '',
      });
      alert('Registration successful, please log in.');
      router.push('/verify'); // Use Next.js router for navigation
    } catch (error) {
      console.error('Error registering user:', error);
      alert('An error occurred while registering the user. Please try again.');
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image alt="OddsSTORE" src={logo} className="mx-auto h-10 w-auto" />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Register a new account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <ul className="mt-2 text-sm text-gray-500">
                <li className={`flex items-center ${passwordCriteria.length ? 'text-green-600' : 'text-red-600'}`}>
                  <span className={`inline-block w-2 h-2 mr-2 rounded-full ${passwordCriteria.length ? 'bg-green-600' : 'bg-red-600'}`}></span> At least 8 characters
                </li>
                <li className={`flex items-center ${passwordCriteria.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                  <span className={`inline-block w-2 h-2 mr-2 rounded-full ${passwordCriteria.uppercase ? 'bg-green-600' : 'bg-red-600'}`}></span> At least one uppercase letter
                </li>
                <li className={`flex items-center ${passwordCriteria.lowercase ? 'text-green-600' : 'text-red-600'}`}>
                  <span className={`inline-block w-2 h-2 mr-2 rounded-full ${passwordCriteria.lowercase ? 'bg-green-600' : 'bg-red-600'}`}></span> At least one lowercase letter
                </li>
                <li className={`flex items-center ${passwordCriteria.specialChar ? 'text-green-600' : 'text-red-600'}`}>
                  <span className={`inline-block w-2 h-2 mr-2 rounded-full ${passwordCriteria.specialChar ? 'bg-green-600' : 'bg-red-600'}`}></span> At least one special character
                </li>
              </ul>
            </div>

            {/* City Field */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                City
              </label>
              <div className="mt-2">
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter your city"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-center">
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <a
                  href="/terms-and-conditions"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Terms and Conditions
                </a>
              </label>
            </div>

            {/* Register Button */}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Register
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <a href="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserRegistrationPage;
