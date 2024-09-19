'use client';

import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation'; // Use Next.js router
import UserService from '../../hooks/UserService'; // Adjust the import path as needed

export default function VerificationDialog() {
  const [open, setOpen] = useState(true); // Control dialog visibility
  const [email, setEmail] = useState(''); // State for email input
  const [message, setMessage] = useState(''); // State for response message
  const router = useRouter(); // Initialize useRouter for navigation

  // Handler for resending the verification email
  const handleResendVerification = async () => {
    try {
      const response = await UserService.resendVerification(email); // Call the resend service
      setMessage("Verification email sent successfully!"); // Success message
    } catch (error) {
      console.error("Error resending verification email:", error);
      setMessage("Failed to resend verification email."); // Error message
    }
  };

  // Close the dialog and navigate to /login
  const handleClose = () => {
    setOpen(false); // Close dialog
    router.push('/login'); // Navigate to login page
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon aria-hidden="true" className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                  Verify Your Email
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    A verification email has been sent to your email address. Please check your inbox and follow the instructions to verify your account.
                  </p>
                  {message && (
                    <p className="mt-2 text-sm text-gray-500">{message}</p>
                  )}
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="mt-5 sm:ml-10 sm:mt-4 sm:flex sm:pl-4">
              <button
                type="button"
                onClick={handleResendVerification}
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:w-auto"
              >
                Resend Verification Email
              </button>
              <button
                type="button"
                onClick={handleClose} // Close and navigate on click
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:ml-3 sm:mt-0 sm:w-auto"
              >
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
