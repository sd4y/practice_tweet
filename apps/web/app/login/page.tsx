'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../lib/api';
import { Twitter } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    console.log('Login form submitted');
    try {
      console.log('Sending login request...', formData);
      const res = await api.post('/auth/login', formData);
      console.log('Login success', res.data);
      localStorage.setItem('token', res.data.access_token);
      // window.location.href = '/main'; // Full reload to update auth state // DISABLED FOR DEBUGGING
      alert('Login request finished. Check console logs.');
    } catch (err: any) {
      console.error('Login Error Check:', err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black text-white">
      <div className="flex w-full max-w-md flex-col gap-6 rounded-2xl bg-black p-8 sm:bg-black">
        <div className="flex justify-center">
          <Twitter className="h-10 w-10 text-white fill-white" />
        </div>
        <h1 className="text-3xl font-bold">Sign in to Y</h1>
        
        {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded border border-gray-700 bg-black p-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded border border-gray-700 bg-black p-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          
          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-white py-3 font-bold text-black transition hover:bg-gray-200"
          >
            Log in
          </button>
        </form>

        <div className="text-gray-500 text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
