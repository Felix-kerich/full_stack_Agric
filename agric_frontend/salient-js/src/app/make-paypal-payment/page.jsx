"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserService from '../../hooks/UserService';
import avatar from '../../public/avatar.png';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

export default function PaypalPayment() {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD'); // Default currency
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push("/login");
          setError('No token found. Please log in.');
          return;
        }

        const response = await UserService.getProfile(token);
        if (response && response.our_users) {
          setProfile(response.our_users);
          setProfilePic(response.our_users.profilePicUrl || avatar);
        } else {
          setError('Profile data is missing.');
        }
      } catch (err) {
        setError('Failed to load profile information.');
      }
    };

    fetchProfile();
  }, [router]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (parseFloat(amount) <= 0) {
      alert('Amount must be greater than zero.');
      setIsLoading(false);
      return;
    }

    const paymentRequest = {
      amount: parseFloat(amount),
      currency,
      description,
      method: 'paypal',
    };

    try {
      const response = await fetch('http://localhost:8081/api/paypal/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'There was an issue with the payment.');
      }

      const approvalUrl = await response.text();
      window.location.href = approvalUrl;
    } catch (error) {
      setError(error.message || 'There was an error processing your payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile && !error) {
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
                  <span className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">PayPal Payment</span>
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
            <Image
              src={avatar}
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

            <form onSubmit={handlePayment} className="space-y-6">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium leading-6 text-gray-900">
                  Amount
                </label>
                <div className="mt-2">
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="currency" className="block text-sm font-medium leading-6 text-gray-900">
                  Currency
                </label>
                <div className="mt-2">
                  <select
                    id="currency"
                    name="currency"
                    required
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    {/* Add more currencies as needed */}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                  Description
                </label>
                <div className="mt-2">
                  <input
                    id="description"
                    name="description"
                    type="text"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex w-full justify-center rounded-md ${isLoading ? 'bg-gray-500' : 'bg-indigo-600'} px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                >
                  {isLoading ? 'Processing...' : 'Make Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
