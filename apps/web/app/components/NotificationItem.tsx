'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, UserPlus, Repeat, Quote } from 'lucide-react';

interface NotificationItemProps {
  type: 'LIKE' | 'REPLY' | 'FOLLOW' | 'RETWEET' | 'QUOTE';
  user: {
    id: string;
    username: string;
    name: string;
    avatar?: string;
  };
  tweet?: {
    id: string;
    content: string;
  };
  read: boolean;
}

export function NotificationItem({ type, user, tweet, read }: NotificationItemProps) {
  const getIcon = () => {
    switch (type) {
      case 'LIKE':
        return <Heart className="text-pink-600 fill-pink-600" size={24} />;
      case 'REPLY':
        return <MessageCircle className="text-blue-500 fill-blue-500" size={24} />;
      case 'FOLLOW':
        return <UserPlus className="text-blue-500 fill-blue-500" size={24} />;
      case 'RETWEET':
        return <Repeat className="text-green-500" size={24} />;
      case 'QUOTE':
        return <Quote className="text-green-500" size={24} />;
      default:
        return <div className="w-6 h-6" />;
    }
  };

  const getText = () => {
    switch (type) {
      case 'LIKE':
        return 'liked your tweet';
      case 'REPLY':
        return 'replied to your tweet';
      case 'FOLLOW':
        return 'followed you';
      case 'RETWEET':
        return 'retweeted your tweet';
      case 'QUOTE':
        return 'quoted your tweet';
      default:
        return '';
    }
  };

  return (
    <div className={`flex gap-4 border-b border-gray-800 p-4 transition hover:bg-white/5 ${!read ? 'bg-blue-500/5' : ''}`}>
      <div className="flex-shrink-0 pt-1">
        {getIcon()}
      </div>
      <div className="flex flex-col gap-2">
        <Link href={`/profile/${user.username}`}>
           <div className="flex items-center gap-2">
             <div className="h-8 w-8 rounded-full bg-gray-700 bg-cover bg-center" style={{ backgroundImage: user.avatar ? `url(${user.avatar})` : undefined }}></div>
             <span className="font-bold text-white hover:underline">{user.name}</span>
           </div>
        </Link>
        <div className="text-gray-300">
          <span className="text-gray-500">{getText()}</span>
          {tweet && (
             <div className="mt-1 text-gray-500 line-clamp-2">
               {tweet.content}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
