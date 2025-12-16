'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { RightSection } from './RightSection';
import api from '../lib/api';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/auth/profile');
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="flex min-h-screen justify-center bg-black text-white">
      <div className="flex w-full max-w-[1265px] xl:px-8">
        <Sidebar currentUser={currentUser} />
        <main className="flex max-w-[600px] w-full flex-grow flex-col border-x border-gray-800">
          {children}
        </main>
        <RightSection />
      </div>
    </div>
  );
}
