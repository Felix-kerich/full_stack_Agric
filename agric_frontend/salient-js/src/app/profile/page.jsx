// Add this directive to make this file a Client Component in Next.js
"use client";

import React, { useState, useEffect } from 'react';
import UserService from '../../hooks/UserService';
import { ChevronRightIcon, CameraIcon } from '@heroicons/react/20/solid'; // Added CameraIcon
import avatar from '../../public/avatar.png';
import { useRouter } from 'next/navigation';

const Profile = () => {
    const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    name: '',
    email: '',
    city: '',
    password: '',
    oldPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
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
        console.log('Profile response:', response); // Debug log

        if (response && response.our_users) {
          setProfile(response.our_users);
          setUpdatedData({
            name: response.our_users.name || '',
            email: response.our_users.email || '',
            city: response.our_users.city || '',
            password: '', // Clear password field
            oldPassword: '',
            confirmPassword: ''
          });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const userId = profile?.id; // Use optional chaining to ensure profile is defined
      if (!userId) {
        setError('User ID is missing.');
        return;
      }
      const response = await UserService.updateUserForUser(userId, updatedData, token);
      setProfile(response.updated_user);
      setEditMode(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (updatedData.password !== updatedData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await UserService.changePassword(updatedData.oldPassword, updatedData.password, token);
      alert('Password changed successfully.');
      setUpdatedData((prevData) => ({
        ...prevData,
        oldPassword: '',
        password: '',
        confirmPassword: ''
      }));
    } catch (err) {
      console.error('Error changing password:', err);
      setError('Failed to change password.');
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file)); // Preview the selected image
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading profile information...</div>;
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
                <a href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                  Dashboard
                </a>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-gray-400" />
                <a href="#" className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                  Profile
                </a>
              </div>
            </li>
          </ol>
        </nav>

        <div className="bg-white px-4 py-6 shadow sm:rounded-lg sm:px-12">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {profile?.name || 'Your Name'}
          </h2>

          <div className="flex items-center">
            <img
              src={profilePic || profile?.profilePicUrl || avatar } // Fallback to a default profile pic
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover"
            />
            {editMode && (
              <div className="ml-4">
                <label htmlFor="profilePic" className="flex items-center cursor-pointer text-indigo-600">
                  <CameraIcon className="h-6 w-6" />
                  <input
                    id="profilePic"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    className="sr-only"
                  />
                </label>
              </div>
            )}
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6 mt-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={updatedData.name}
                onChange={handleInputChange}
                disabled={!editMode}
                className="block w-full mt-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={updatedData.email}
                onChange={handleInputChange}
                disabled={!editMode}
                className="block w-full mt-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={updatedData.city}
                onChange={handleInputChange}
                disabled={!editMode}
                className="block w-full mt-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            {editMode && (
              <>
                <div className="relative">
                  <label htmlFor="oldPassword" className="block text-sm font-medium leading-6 text-gray-900">
                    Old Password
                  </label>
                  <input
                    id="oldPassword"
                    name="oldPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={updatedData.oldPassword}
                    onChange={handleInputChange}
                    className="block w-full mt-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>

                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    New Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={updatedData.password}
                    onChange={handleInputChange}
                    className="block w-full mt-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={updatedData.confirmPassword}
                    onChange={handleInputChange}
                    className="block w-full mt-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                <div className="flex items-center justify-between mt-4">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </form>

          {!editMode && (
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className="mt-6 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
