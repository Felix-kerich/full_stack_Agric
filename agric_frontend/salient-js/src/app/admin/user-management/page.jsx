"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import UserService from '../../../hooks/UserService';
import { PaperClipIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { useAuth } from '../../../hooks/useAuth'; // Import the useAuth hook

function UserManagementPage() {
  const { loading: authLoading, isAuthorized } = useAuth('/login'); // Use the useAuth hook
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthorized) {
      fetchUsers();
    }
  }, [isAuthorized]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await UserService.getAllUsers(token);
      setUsers(response.our_users_list || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, type) => {
    try {
      const token = localStorage.getItem('token');
      await UserService.toggleUserStatus(userId, type, token);
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      setError('Failed to update user status. Please try again later.');
    }
  };

  const handleDelete = async (userId) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this user?');
      if (confirmDelete) {
        const token = localStorage.getItem('token');
        await UserService.deleteUser(userId, token);
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again later.');
    }
  };

  if (authLoading) {
    return <div className="text-gray-300 text-center py-4">Authenticating...</div>;
  }

  if (!isAuthorized) {
    return null; // Don't render the component if the user is not authorized
  }

  return (
    <div className="bg-gray-900 py-10">
      <div className="px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
        <nav aria-label="Breadcrumb" className="hidden sm:flex">
          <ol role="list" className="flex items-center space-x-4">
            <li>
              <div className="flex">
                <Link href="/dashboard">
                  <span className="text-sm font-medium text-gray-500 hover:text-gray-700">
                    Dashboard
                  </span>
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-gray-400" />
                <Link href="#">
                  <span className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                    User Management
                  </span>
                </Link>
              </div>
            </li>
          </ol>
        </nav>
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-white">Users Management</h1>
            <p className="mt-2 text-sm text-gray-300">
              A list of all users including their name, email, city, role, and status.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link href="/register">
              <button
                type="button"
                className="block rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Add User
              </button>
            </Link>
          </div>
        </div>
        {loading && (
          <div className="text-gray-300 text-center py-4">Loading...</div>
        )}
        {error && (
          <div className="text-red-500 text-center py-4">{error}</div>
        )}
        {!loading && !error && (
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0">
                        ID
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                        Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                        Email
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                        City
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                        Role
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                        Status
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {users.length > 0 ? (
                      users.map(user => (
                        <tr key={user.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
                            {user.id}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{user.name}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{user.email}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{user.city}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{user.role}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                            {user.disabled ? 'Disabled' : 'Enabled'}, {user.locked ? 'Locked' : 'Unlocked'}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                            <Link href={`/admin/update-user/${user.id}`}>
                              <span className="text-indigo-400 hover:text-indigo-300">
                                Edit
                              </span>
                            </Link>
                            <button
                              onClick={() => toggleUserStatus(user.id, 'lock')}
                              className={`ml-4 ${user.locked ? 'text-green-500' : 'text-red-500'} hover:${user.locked ? 'text-green-400' : 'text-red-400'}`}
                            >
                              {user.locked ? 'Unlock' : 'Lock'}
                            </button>
                            <button
                              onClick={() => toggleUserStatus(user.id, 'disable')}
                              className={`ml-4 ${user.disabled ? 'text-green-500' : 'text-red-500'} hover:${user.disabled ? 'text-green-400' : 'text-red-400'}`}
                            >
                              {user.disabled ? 'Enable' : 'Disable'}
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="ml-4 text-red-500 hover:text-red-400"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="py-4 text-center text-gray-300">No users found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagementPage;
