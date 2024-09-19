'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import UserService from '../hooks/UserService';
import Image from 'next/image';
import logo from '../public/logo.jpg';
import avatar from '../public/avatar.png';

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItems,
  TransitionChild,
} from '@headlessui/react';
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import Link from 'next/link'; 

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter(); 
  const isAuthenticated = UserService.isAuthenticated();

  const [navigation, setNavigation] = useState([
    { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
    { name: 'Agricutural Articals', href: '#', icon: CalendarIcon, current: false },
    { name: 'Dairy Farming', href: '#', icon: DocumentDuplicateIcon, current: false },
    { name: 'Beef farming', href: '#', icon: ChartPieIcon, current: false },
    
  ]);

  const updateNavigationForAdmin = () => {
    if (isAdmin) {
      setNavigation((prevNavigation) => [
        ...prevNavigation,       
        { name: 'User Management', href: '/admin/user-management', icon: FolderIcon, current: false },
      ]);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login'); 
      return;
    }
  
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please log in.');
          setLoading(false);
          return;
        }
  
        const response = await UserService.getProfile(token);
        setProfile(response.our_users); 
        setIsAdmin(UserService.isAdmin()); 
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile information.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, [isAuthenticated, router]);
  

  useEffect(() => {
    updateNavigationForAdmin();
  }, [isAdmin]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleLogout = (event) => {
    event.preventDefault(); 
    const confirmLogout = window.confirm('Are you sure you want to logout this user?');
    if (confirmLogout) {
      UserService.logout(); 
      router.push('/'); // Redirect to homepage after logout
    }
  };

  const userNavigation = [
    { name: 'Your profile', href: '/profile' },
    { name: 'Sign out', href: '/', onClick: handleLogout },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <>
      <div>
        <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon aria-hidden="true" className="h-6 w-6 text-white" />
                  </button>
                </div>
              </TransitionChild>
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center">
                  <Image alt="oddsSTORE" src={logo} className="h-8 w-auto" />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? 'bg-indigo-700 text-white'
                                  : 'text-indigo-200 hover:bg-indigo-700 hover:text-white',
                                'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  item.current ? 'text-white' : 'text-indigo-200 group-hover:text-white',
                                  'h-6 w-6 shrink-0'
                                )}
                              />
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li className="mt-auto">
                      <a
                        href="#"
                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white"
                      >
                        <Cog6ToothIcon
                          aria-hidden="true"
                          className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
                        />
                        Settings
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

              {/* Static sidebar for desktop */}
              <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <Image alt="oddsSTORE" src={logo} className="h-8 w-auto" />
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className={classNames(
                                  item.current
                                    ? 'bg-indigo-700 text-white'
                                    : 'text-indigo-200 hover:bg-indigo-700 hover:text-white',
                                  'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                                )}
                              >
                                <item.icon
                                  aria-hidden="true"
                                  className={classNames(
                                    item.current ? 'text-white' : 'text-indigo-200 group-hover:text-white',
                                    'h-6 w-6 shrink-0'
                                  )}
                                />
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li className="mt-auto">
                        <a
                          href="/profile"
                          className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white"
                        >
                          <Cog6ToothIcon
                            aria-hidden="true"
                            className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
                          />
                          Profile
                        </a>
                        <a
                          href="/account"
                          className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white"
                        >
                          <Cog6ToothIcon
                            aria-hidden="true"
                            className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
                          />
                          Account
                        </a>
                        <a
                          href="#"
                          className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white"
                        >
                          <Cog6ToothIcon
                            aria-hidden="true"
                            className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
                          />
                          Settings
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>

              <div className="lg:pl-72">
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                  <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
                    <span className="sr-only">Open sidebar</span>
                    <Bars3Icon aria-hidden="true" className="h-6 w-6" />
                  </button>

                  {/* Separator */}
                  <div aria-hidden="true" className="h-6 w-px bg-gray-900/10 lg:hidden" />

                  <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                    <form action="#" method="GET" className="relative flex flex-1">
                      <label htmlFor="search-field" className="sr-only">
                        Search
                      </label>
                      <MagnifyingGlassIcon
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                      />
                      <input
                        id="search-field"
                        name="search"
                        type="search"
                        placeholder="Search..."
                        className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                      />
                    </form>
                    <div className="flex items-center gap-x-4 lg:gap-x-6">
                      <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                        <span className="sr-only">View notifications</span>
                        <BellIcon aria-hidden="true" className="h-6 w-6" />
                      </button>

                      {/* Separator */}
                      <div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" />

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative">
        <MenuButton className="-m-1.5 flex items-center p-1.5">
          <span className="sr-only">Open user menu</span>
          <Image alt="" src={avatar} className="h-8 w-8 rounded-full bg-gray-50" />
          <span className="hidden lg:flex lg:items-center">
            <span aria-hidden="true" className="ml-4 text-sm font-semibold leading-6 text-gray-900">
              <p>{profile?.name || 'N/A'}</p>
            </span>
            <ChevronDownIcon aria-hidden="true" className="ml-2 h-5 w-5 text-gray-400" />
          </span>
        </MenuButton>
        <Menu.Items
          transition
          className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
        >
          {userNavigation.map((item) => (
            <Menu.Item key={item.name}>
              {({ active }) => (
                <a
                  href={item.href}
                  onClick={item.onClick} 
                  className={`block px-3 py-1 text-sm leading-6 ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-900'}`}
                >
                  {item.name}
                </a>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Menu>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
