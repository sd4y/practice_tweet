'use client';

import React, { useEffect, useState } from 'react';
import { MainLayout } from '../../components/MainLayout';
import { Tweet } from '../../components/Tweet';
import { Calendar, MapPin, Link as LinkIcon, ArrowLeft, Mail, MoreHorizontal } from 'lucide-react';
import api from '../../lib/api';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function UserProfilePage() {
  const { username } = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [tweets, setTweets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const decodedUsername = decodeURIComponent(username as string);
        const [profileRes, meRes] = await Promise.all([
          api.get(`/users/${decodedUsername}`),
          api.get('/auth/profile')
        ]);
        
        setProfile(profileRes.data);
        setCurrentUser(meRes.data);
        
        // Fetch tweets correctly using the user ID from profile response
        const userTweetsRes = await api.get(`/tweets?authorId=${profileRes.data.id}&excludeReplies=true`);
        setTweets(userTweetsRes.data);

      } catch (error) {
        console.error('Failed to load profile', error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
        fetchData();
    }
  }, [username]);

  const handleMessageClick = async () => {
    if (!profile) return;
    try {
        await api.post('/conversations', { otherUserId: profile.id });
        router.push('/messages');
    } catch (error) {
        console.error('Failed to start conversation', error);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout>
        <div className="p-4 text-center text-white">User not found</div>
      </MainLayout>
    );
  }

  const isMe = currentUser?.id === profile.id;

  return (
    <MainLayout>
      <div className="flex min-h-screen flex-col border-r border-gray-800 pb-20">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-gray-800 bg-black/80 px-4 py-1 backdrop-blur-md">
          <Link href="/" className="rounded-full p-2 transition hover:bg-gray-800">
            <ArrowLeft className="h-5 w-5 text-white" />
          </Link>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-white leading-5">{profile.name}</h2>
            <span className="text-sm text-gray-500">{profile._count.tweets} posts</span>
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative h-48 w-full bg-gray-800">
          {profile.coverImage && (
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${profile.coverImage})` }}
            />
          )}
        </div>

        {/* Profile Details */}
        <div className="relative px-4 pb-4">
          <div className="flex justify-between">
            <div className={`absolute -top-16 h-32 w-32 rounded-full border-4 border-black bg-gray-900 bg-cover bg-center`}
                 style={{ backgroundImage: profile.avatar ? `url(${profile.avatar})` : undefined }}
            />
            <div className="ml-auto mt-3 flex gap-2">
                <div onClick={handleMessageClick} className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-600 transition hover:bg-gray-900 cursor-pointer">
                    <Mail className="h-5 w-5 text-white" />
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-600 transition hover:bg-gray-900 cursor-pointer">
                    <MoreHorizontal className="h-5 w-5 text-white" />
                </div>
                {isMe ? (
                    <Link href="/profile">
                        <button className="rounded-full border border-gray-600 px-4 py-1.5 font-bold text-white transition hover:bg-gray-900">
                            Edit profile
                        </button>
                    </Link>
                ) : (
                    <button 
                        onClick={async () => {
                            try {
                                if (profile.isFollowing) {
                                    await api.delete(`/users/${profile.id}/follow`);
                                    setProfile((prev: any) => ({ ...prev, isFollowing: false, _count: { ...prev._count, followers: prev._count.followers - 1 } }));
                                } else {
                                    await api.post(`/users/${profile.id}/follow`);
                                    setProfile((prev: any) => ({ ...prev, isFollowing: true, _count: { ...prev._count, followers: prev._count.followers + 1 } }));
                                }
                            } catch (error) {
                                console.error('Failed to toggle follow', error);
                            }
                        }}
                        className={`rounded-full px-4 py-1.5 font-bold transition ${
                            profile.isFollowing 
                            ? 'border border-gray-600 text-white hover:border-red-500 hover:text-red-500 hover:bg-red-500/10' 
                            : 'bg-white text-black hover:bg-gray-200'
                        }`}
                    >
                        {profile.isFollowing ? 'Following' : 'Follow'}
                    </button>
                )}
            </div>
          </div>

          <div className="mt-4">
            <h1 className="text-xl font-bold text-white">{profile.name}</h1>
            <span className="text-gray-500">@{profile.username}</span>
          </div>

          <div className="mt-4 text-white">
            <p>{profile.bio || "No bio yet."}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-gray-500">
            {profile.location && (
              <div className="flex items-center gap-1">
                <MapPin size={18} />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.website && (
              <div className="flex items-center gap-1">
                <LinkIcon size={18} />
                <a href={profile.website} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{profile.website}</a>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar size={18} />
              <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="mt-3 flex gap-4 text-sm text-gray-500">
            <span className="hover:underline cursor-pointer"><strong className="text-white">{profile._count.following}</strong> Following</span>
            <span className="hover:underline cursor-pointer"><strong className="text-white">{profile._count.followers}</strong> Followers</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-2 flex border-b border-gray-800">
          {['Posts', 'Replies', 'Highlights', 'Media', 'Likes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`flex-1 p-4 font-bold transition hover:bg-white/5 ${
                activeTab === tab.toLowerCase()
                  ? 'border-b-4 border-blue-500 text-white'
                  : 'text-gray-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tweets Feed */}
        <div className="flex-1">
          {tweets.map(tweet => (
            <Tweet key={tweet.id} {...tweet} />
          ))}
          {tweets.length === 0 && (
             <div className="p-8 text-center text-gray-500">
                 No posts yet
             </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
