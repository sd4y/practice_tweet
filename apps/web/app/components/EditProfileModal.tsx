'use client';

import React, { useState } from 'react';
import { X, Camera } from 'lucide-react';
import api from '../lib/api';

interface EditProfileModalProps {
  user: any;
  onClose: () => void;
  onUpdate: (updatedUser: any) => void;
}

export function EditProfileModal({ user, onClose, onUpdate }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    bio: user.bio || '',
    location: user.location || '',
    website: user.website || '',
    avatar: user.avatar || '',
    coverImage: user.coverImage || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.patch('/users/profile', formData);
      onUpdate(res.data);
      onClose();
    } catch (error) {
      console.error('Failed to update profile', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar' | 'coverImage') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const res = await api.post('/uploads', formData, {
           headers: { 'Content-Type': 'multipart/form-data' }
        });
        setFormData(prev => ({ ...prev, [field]: res.data.url }));
      } catch (error) {
        console.error(`Failed to upload ${field}`, error);
        alert('Image upload failed');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-black border border-gray-700 p-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-800 transition">
              <X size={20} className="text-white" />
            </button>
            <h2 className="text-xl font-bold text-white">Edit profile</h2>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-full bg-white px-5 py-1.5 font-bold text-black hover:bg-gray-200 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>

        <div className="relative mb-6">
           {/* Cover Image Placeholder */}
           <div className="h-32 w-full bg-gray-700 bg-cover bg-center rounded-md flex items-center justify-center relative group" style={{ backgroundImage: formData.coverImage ? `url(${formData.coverImage})` : undefined }}>
              <div className="bg-black/30 absolute inset-0 group-hover:bg-black/50 transition"></div>
              <Camera className="text-white z-10 opacity-50 font-bold" />
               <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'coverImage')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
           </div>
           
           {/* Avatar Placeholder */}
           <div className="absolute -bottom-8 left-4 h-20 w-20 rounded-full border-4 border-black bg-gray-600 bg-cover bg-center flex items-center justify-center group" style={{ backgroundImage: formData.avatar ? `url(${formData.avatar})` : undefined }}>
              <div className="bg-black/30 absolute inset-0 rounded-full group-hover:bg-black/50 transition"></div>
              <Camera className="text-white z-10 opacity-50 font-bold" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'avatar')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
              />
           </div>
        </div>
        
        <div className="mt-12 space-y-4">

          <div className="relative rounded border border-gray-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <label className="absolute left-2 top-1 text-xs text-gray-500">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-transparent px-2 pb-1 pt-5 text-white focus:outline-none peer"
              placeholder="Name"
            />
          </div>

          <div className="relative rounded border border-gray-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <label className="absolute left-2 top-1 text-xs text-gray-500">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full bg-transparent px-2 pb-1 pt-5 text-white focus:outline-none resize-none h-24"
              placeholder="Bio"
            />
          </div>

          <div className="relative rounded border border-gray-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <label className="absolute left-2 top-1 text-xs text-gray-500">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full bg-transparent px-2 pb-1 pt-5 text-white focus:outline-none"
              placeholder="Location"
            />
          </div>

          <div className="relative rounded border border-gray-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <label className="absolute left-2 top-1 text-xs text-gray-500">Website</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full bg-transparent px-2 pb-1 pt-5 text-white focus:outline-none"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
