'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Feed } from '../components/Feed';
import { MainLayout } from '../components/MainLayout';

export default function MainPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return null; 
  }

  return (
    <MainLayout>
      <Feed type="all" />
    </MainLayout>
  );
}
