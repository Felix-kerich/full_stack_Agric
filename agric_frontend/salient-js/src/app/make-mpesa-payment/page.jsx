"use client";

import React, { useState, useEffect } from 'react';
import UserService from '../../hooks/UserService'; // Adjust import according to the new file structure
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import avatar from '../../public/avatar.png';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Use useRouter for navigation in Next.js

const MpesaPayment = () => {
  const router = useRouter(); // Hook for navigation
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [formData, setFormData] = useState({
    phone_number: '',
    amount: '',
    id: '',
    email: '',
    name: '',
  });

  // Fetch the profile data when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push("/login"); // Redirects to login page
          setError('No token found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await UserService.getProfile(token);
        console.log('Profile response:', response);

        if (response && response.our_users) {
          setProfile(response.our_users);
          setProfilePic(response.our_users.profilePicUrl || avatar);
        } else {
          setError('Profile data is missing.');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile information.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]); // Include router in dependency array

  // Update formData when the profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData((prevData) => ({
        ...prevData,
        id: profile.id,
        email: profile.email,
        name: profile.name,
      }));
    }
  }, [profile]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'email' ? value.toLowerCase() : value });
  };

  // Handle form submission for payment
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting payment with formData:', formData); // Debug log
    try {
      const token = localStorage.getItem('token');
      await UserService.makePayment(formData, token);
      alert('Payment made successfully');
      router.push('/account'); // Redirects to the account page
    } catch (error) {
      console.error('Error making payment:', error);
      alert('An error occurred while making the payment');
    }
  };

  // Render loading state
  if (loading) {
    return <div className="text-center text-gray-500">Loading account information...</div>;
  }

  // Render error state
  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  // Render the main component UI
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <nav aria-label="Breadcrumb" className="hidden sm:flex">
          <ol role="list" className="flex items-center space-x-4">
            <li>
              <div className="flex">
                <Link href="/dashboard">
                  <span className="text-sm font-medium text-gray-500 hover:text-gray-700">Dashboard</span>
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-gray-400" />
                <Link href="/account">
                  <span className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">Account</span>
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-gray-400" />
                <Link href="#">
                  <span className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">Mpesa Payment</span>
                </Link>
              </div>
            </li>
          </ol>
        </nav>

        <div className="bg-white px-4 py-6 shadow sm:rounded-lg sm:px-12">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {profile?.name || 'Account Information'}
          </h2>

          <div className="flex items-center mt-4">
            <img
              src={profilePic}
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover"
            />
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">User Id</h3>
              <p className="text-lg font-semibold text-gray-900">{profile?.id || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="text-lg font-semibold text-gray-900">{profile?.name || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="text-lg font-semibold text-gray-900">{profile?.email || 'N/A'}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="phone_number" className="text-sm font-medium text-gray-500">
                  Phone Number
                </label>
                <div className="mt-2">
                  <input
                    id="phone_number"
                    name="phone_number"
                    type="text"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="amount" className="text-sm font-medium text-gray-500">
                  Amount
                </label>
                <div className="mt-2">
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
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
                  Pay
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MpesaPayment;
