'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Adjusted for Next.js app directory
import UserService from '../../../../hooks/UserService'; // Adjust the path if necessary
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { useAuth } from '../../../../hooks/useAuth'; // Import the useAuth hook

function UpdateUser() {
    const router = useRouter();
    const { userId } = useParams();
    const { loading: authLoading, isAuthorized } = useAuth('/login'); // Use the useAuth hook

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        role: '',
        city: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthorized && userId) {
            fetchUserDataById(userId);
        }
    }, [isAuthorized, userId]);

    const fetchUserDataById = async (userId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await UserService.getUserById(userId, token);
            if (response && response.ourUsers) {
                setUserData(response.ourUsers);
            } else {
                setError('User data not found.');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Failed to fetch user data.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevUserData) => ({
            ...prevUserData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const confirmUpdate = window.confirm('Are you sure you want to update this user?');
        if (!confirmUpdate) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await UserService.updateUser(userId, userData, token);
            router.push('/admin/user-management');
        } catch (error) {
            console.error('Error updating user profile:', error);
            setError('An error occurred while updating the user profile.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return <div className="text-gray-300 text-center py-4">Authenticating...</div>;
    }

    if (!isAuthorized) {
        return null; // Don't render the component if the user is not authorized
    }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <nav aria-label="Breadcrumb" className="hidden sm:flex">
                    <ol role="list" className="flex items-center space-x-4">
                        <li>
                            <div className="flex">
                                <a href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                                    Dashboard
                                </a>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <ChevronRightIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-gray-400" />
                                <a href="/admin/user-management" className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                                    User Management
                                </a>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <ChevronRightIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-gray-400" />
                                <a href="#" className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                                    Update User
                                </a>
                            </div>
                        </li>
                    </ol>
                </nav>
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Update User
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
                    {loading && <p>Loading...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                Name
                            </label>
                            <div className="mt-2">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={userData.name || ''}
                                    onChange={handleInputChange}
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={userData.email || ''}
                                    onChange={handleInputChange}
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">
                                Role
                            </label>
                            <div className="mt-2">
                                <input
                                    id="role"
                                    name="role"
                                    type="text"
                                    value={userData.role || ''}
                                    onChange={handleInputChange}
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                                City
                            </label>
                            <div className="mt-2">
                                <input
                                    id="city"
                                    name="city"
                                    type="text"
                                    value={userData.city || ''}
                                    onChange={handleInputChange}
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdateUser;
