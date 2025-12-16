'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../lib/api';
import { Twitter } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', formData);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black text-white">
      <div className="flex w-full max-w-md flex-col gap-6 rounded-2xl bg-black p-8 sm:bg-black">
        <div className="flex justify-center">
          <Twitter className="h-10 w-10 text-white fill-white" />
        </div>
        <h1 className="text-3xl font-bold">Join Y today</h1>
        
        {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full rounded border border-gray-700 bg-black p-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Username"
            className="w-full rounded border border-gray-700 bg-black p-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
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
            Create account
          </button>
        </form>

        <div className="text-gray-500 text-sm">
          Have an account already?{' '}
          <Link href="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
