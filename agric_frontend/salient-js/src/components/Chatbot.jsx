'use client'

import avatar from '../public/avatar.png';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import {
  FaceFrownIcon,
  FaceSmileIcon,
  FireIcon,
  HandThumbUpIcon,
  HeartIcon,
  PaperClipIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';

const moods = [
  { name: 'Excited', value: 'excited', icon: FireIcon, iconColor: 'text-white', bgColor: 'bg-red-500' },
  { name: 'Loved', value: 'loved', icon: HeartIcon, iconColor: 'text-white', bgColor: 'bg-pink-400' },
  { name: 'Happy', value: 'happy', icon: FaceSmileIcon, iconColor: 'text-white', bgColor: 'bg-green-400' },
  { name: 'Sad', value: 'sad', icon: FaceFrownIcon, iconColor: 'text-white', bgColor: 'bg-yellow-400' },
  { name: 'Thumbsy', value: 'thumbsy', icon: HandThumbUpIcon, iconColor: 'text-white', bgColor: 'bg-blue-500' },
  { name: 'I feel nothing', value: null, icon: XMarkIcon, iconColor: 'text-gray-400', bgColor: 'bg-transparent' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Chatbot() {
  const [selected, setSelected] = useState(moods[5]);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const iframeRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handlePaste = (event) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        setImage(URL.createObjectURL(blob));
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  // Refresh iframe on page load
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src; // This will reload the iframe
    }
    const handleLogoutMessage = (event) => {
      if (event.data.type === 'logout') {
          console.log('User logged out from dashboard');
          iframeRef.current.src = iframeRef.current.src; // Reload the iframe
      }
  };

  window.addEventListener('message', handleLogoutMessage);

  return () => {
      window.removeEventListener('message', handleLogoutMessage);
  };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center px-4 pb-4">
      <div className="w-full max-w-3xl bg-gray-200 p-4 shadow-lg rounded-lg flex flex-col">
        {/* Chatbot Iframe */}
        <iframe
          ref={iframeRef}
          src="https://www.chatbase.co/chatbot-iframe/4TSb50CcEj7ZeRPW-mWr0"
          width="100%"
          style={{ height: '100%', minHeight: '700px' }}
          frameBorder="0"
        />

        {/* User Avatar */}
        <div className="flex-shrink-0">
          <Image
            alt=""
            src={avatar}
            className="inline-block h-10 w-10 rounded-full"
          />
        </div>

        {/* Form Input Area */}
        {/* You can add other UI components or inputs here */}

      </div>

      {/* Embed Chatbase Chatbot Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.embeddedChatbotConfig = {
              chatbotId: "4TSb50CcEj7ZeRPW-mWr0",
              domain: "www.chatbase.co"
            };
          `,
        }}
      />
      <script
        src="https://www.chatbase.co/embed.min.js"
        chatbotId="4TSb50CcEj7ZeRPW-mWr0"
        domain="www.chatbase.co"
        defer
      />
    </div>
  );
}
