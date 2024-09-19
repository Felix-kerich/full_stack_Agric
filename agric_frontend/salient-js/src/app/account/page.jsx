"use client";

import React, { useState, useEffect } from 'react';
import UserService from '../../hooks/UserService';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import avatar from '../../public/avatar.png';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const AccountPage = () => {
    const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push("/login");
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
        console.error("Error fetching profile:", err);
        setError('Failed to load profile information.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500">Loading account information...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <nav aria-label="Breadcrumb" className="hidden sm:flex">
          <ol role="list" className="flex items-center space-x-4">
            <li>
              <div className="flex">
                <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                  Dashboard
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-gray-400" />
                <Link href="#" className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                  Account
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
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="text-lg font-semibold text-gray-900">{profile?.name || 'N/A'}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="text-lg font-semibold text-gray-900">{profile?.email || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">City</h3>
              <p className="text-lg font-semibold text-gray-900">{profile?.city || 'N/A'}</p>
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500">Payment Status</h3>
                {profile?.is_payment_made ? (
                    <p className="text-lg font-semibold text-green-600">
                    Amount Paid: {profile?.amount_paid ? `$${profile.amount_paid}` : 'N/A'}
                    </p>
                ) : (
                    <p className="text-lg font-semibold text-red-500">Not Paid</p>
                )}
            </div>

            {/* Display Payment Information */}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Payment Information</h3>
              <p className="text-lg font-semibold text-gray-900">
                Payment status: {profile?.paymentStatus || 'Pending'}
              </p>
            </div>

            <div className="flex space-x-4 mt-6">
              <Link href="/make-mpesa-payment" className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Make Payment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
