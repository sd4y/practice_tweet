'use client';

import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { Tweet } from '../components/Tweet';
import api from '../lib/api';
import { ArrowLeft, Calendar, MapPin, Link as LinkIcon, Mail } from 'lucide-react';
import Link from 'next/link';

import { EditProfileModal } from '../components/EditProfileModal';

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tweets, setTweets] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    const fetchProfileAndTweets = async () => {
      try {
        // 1. Fetch current user
        const userRes = await api.get('/auth/profile');
        setCurrentUser(userRes.data);

        // 2. Fetch user's tweets
        const tweetsRes = await api.get(`/tweets?authorId=${userRes.data.id}`);
        setTweets(tweetsRes.data);
      } catch (error) {
        console.error("Failed to load profile data", error);
      }
    };
    fetchProfileAndTweets();
  }, []);

  if (!currentUser) return <div className="text-white p-10">Loading profile...</div>;

  return (
    <MainLayout>
      <div className="flex flex-col min-h-screen pb-20">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center gap-6 bg-black/80 px-4 py-1 backdrop-blur-md">
          <Link href="/" className="rounded-full p-2 hover:bg-gray-900 transition text-white">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-white leading-6">{currentUser.name}</h2>
            <span className="text-sm text-gray-500">{tweets.length} posts</span>
          </div>
        </div>

        {/* Cover Image */}
        <div className="h-48 w-full bg-gray-800 bg-cover bg-center" style={{ backgroundImage: currentUser.coverImage ? `url(${currentUser.coverImage})` : undefined }}>
            {!currentUser.coverImage && <div className="w-full h-full bg-slate-700"></div>}
        </div>

        {/* Profile Info */}
        <div className="relative px-4 pb-4">
          <div className="absolute -top-16 left-4 h-32 w-32 rounded-full border-4 border-black bg-gray-900 bg-cover bg-center" style={{ backgroundImage: currentUser.avatar ? `url(${currentUser.avatar})` : undefined }}></div>
          
          <div className="flex justify-end pt-3">
            <button 
              onClick={() => setIsEditing(true)}
              className="rounded-full border border-gray-600 px-4 py-1.5 font-bold text-white hover:bg-white/10 transition"
            >
              Edit profile
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-1">
            <h1 className="text-xl font-extrabold text-white">{currentUser.name}</h1>
            <span className="text-gray-500">@{currentUser.username}</span>
          </div>

          <div className="mt-3 text-white">
            {currentUser.bio || "No bio yet."}
          </div>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
            {currentUser.location && (
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>{currentUser.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>Joined {new Date(currentUser.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="mt-3 flex gap-4 text-sm">
             <div className="flex gap-1 hover:underline cursor-pointer">
               <span className="font-bold text-white">{currentUser._count?.following || 0}</span>
               <span className="text-gray-500">Following</span>
             </div>
             <div className="flex gap-1 hover:underline cursor-pointer">
               <span className="font-bold text-white">{currentUser._count?.followers || 0}</span>
               <span className="text-gray-500">Followers</span>
             </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-2 flex border-b border-gray-800">
          {['Posts', 'Replies', 'Highlights', 'Media', 'Likes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`relative flex flex-1 items-center justify-center p-4 font-bold transition hover:bg-white/10 ${
                activeTab === tab.toLowerCase() ? 'text-white' : 'text-gray-500'
              }`}
            >
              {tab}
              {activeTab === tab.toLowerCase() && (
                <div className="absolute bottom-0 h-1 w-14 rounded-full bg-blue-500"></div>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {activeTab === 'posts' && (
            tweets.map((tweet) => (
              <Tweet 
                key={tweet.id}
                id={tweet.id}
                authorName={tweet.author.name || 'Unknown'} 
                authorHandle={tweet.author.username || 'unknown'} 
                authorAvatar={tweet.author.avatar}
                authorId={tweet.author.id}
                time={new Date(tweet.createdAt).toLocaleDateString()} 
                content={tweet.content} 
                image={tweet.image}
                likes={tweet.likes} 
                retweets={tweet.retweets} 
                replies={tweet._count.children} 
                views={tweet.views}
                currentUser={currentUser}
                isLiked={tweet.isLiked}
              />
            ))
          )}
          {activeTab !== 'posts' && (
             <div className="p-10 text-center text-gray-500">
               Nothing to see here yet — check back later!
             </div>
          )}
        </div>
        
        {isEditing && (
          <EditProfileModal
            user={currentUser}
            onClose={() => setIsEditing(false)}
            onUpdate={(updatedUser) => setCurrentUser(updatedUser)}
          />
        )}
      </div>
    </MainLayout>
  );
}
