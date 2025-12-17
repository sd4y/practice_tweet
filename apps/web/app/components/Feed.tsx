import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Tweet } from './Tweet';
import { Image, FileText, AlignLeft, Smile, Calendar, MapPin } from 'lucide-react';
import api from '../lib/api';

interface TweetData {
  id: string;
  content: string;
  image?: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  retweets: number;
  views: number;
  _count: {
    likes: number;
    children: number;
  };
  isLiked?: boolean;
}

interface FeedProps {
  type?: 'all' | 'following';
}

export function Feed({ type = 'all' }: FeedProps) {
  const router = useRouter();
  const [tweets, setTweets] = useState<TweetData[]>([]);
  const [newTweetContent, setNewTweetContent] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setImageUrl(response.data.url);
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image');
    }
  };

  const fetchTweets = async (pageNum: number = 1) => {
    if (pageNum === 1) setIsLoading(true);
    else setLoadingMore(true);

    try {
      const endpoint = type === 'following' ? '/tweets?following=true' : '/tweets';
      // Append pagination params
      const url = `${endpoint}${endpoint.includes('?') ? '&' : '?'}page=${pageNum}&limit=3`;
      
      const response = await api.get(url);
      const newTweets = response.data;
      
      if (newTweets.length < 3) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      if (pageNum === 1) {
        setTweets(newTweets);
      } else {
        setTweets(prev => [...prev, ...newTweets]);
      }
    } catch (error) {
      console.error('Failed to fetch tweets:', error);
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/profile');
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setTweets([]);
    fetchTweets(1);
    fetchUser();
  }, [type]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTweets(nextPage);
  };

  const handlePostTweet = async () => {
    if (!newTweetContent.trim() && !imageUrl) return;
    try {
      await api.post('/tweets', { 
        content: newTweetContent,
        image: imageUrl 
      });
      setNewTweetContent('');
      setImageUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setPage(1);
      fetchTweets(1); 
    } catch (error) {
      console.error('Failed to post tweet:', error);
    }
  };

  return (
    <div className="flex w-full min-h-screen flex-col border-r border-gray-800 pb-20">
      <div className="sticky top-0 z-10 flex w-full border-b border-gray-800 bg-black/80 backdrop-blur-md">
        <div className="flex w-full">
          <div 
            onClick={() => router.push('/main')}
            className={`flex flex-1 cursor-pointer flex-col items-center justify-center p-4 hover:bg-gray-900 transition relative ${type === 'all' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
          >
            <span className={type === 'all' ? "font-bold" : "font-medium"}>For you</span>
            {type === 'all' && <div className="absolute bottom-0 h-1 w-14 rounded-full bg-blue-500"></div>}
          </div>
          <div 
            onClick={() => router.push('/following')}
            className={`flex flex-1 cursor-pointer flex-col items-center justify-center p-4 hover:bg-gray-900 transition relative ${type === 'following' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
          >
            <span className={type === 'following' ? "font-bold" : "font-medium"}>Following</span>
            {type === 'following' && <div className="absolute bottom-0 h-1 w-14 rounded-full bg-blue-500"></div>}
          </div>
        </div>
      </div>
      
      <div className="flex w-full gap-4 border-b border-gray-800 p-4">
        <div className="h-10 w-10 min-w-[40px] rounded-full bg-gray-700 bg-cover bg-center" style={{ backgroundImage: currentUser?.avatar ? `url(${currentUser.avatar})` : undefined }}></div>
        <div className="flex flex-1 flex-col gap-4">
          <input 
            type="text" 
            placeholder="What is happening?!" 
            className="w-full bg-transparent text-xl text-white outline-none placeholder:text-gray-500"
            value={newTweetContent}
            onChange={(e) => setNewTweetContent(e.target.value)}
          />
          {imageUrl && (
            <div className="relative mt-2 inline-block">
              <img src={imageUrl} alt="Upload preview" className="max-h-[300px] max-w-full rounded-2xl" />
              <button 
                onClick={() => setImageUrl(null)}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
              >
                ×
              </button>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-gray-800 pt-3">
            <div className="flex gap-1 text-blue-500">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <ToolButton icon={Image} onClick={() => fileInputRef.current?.click()} />
              <ToolButton icon={FileText} />
              <ToolButton icon={AlignLeft} />
              <ToolButton icon={Smile} />
              <ToolButton icon={Calendar} />
              <ToolButton icon={MapPin} />
            </div>
            <button 
              className={`rounded-full px-5 py-2 font-bold text-white transition ${!newTweetContent.trim() && !imageUrl ? 'bg-blue-500/50 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`} 
              onClick={handlePostTweet}
              disabled={!newTweetContent.trim() && !imageUrl}
            >
              Post
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="p-10 text-center text-gray-500">Loading...</div>
      ) : (
        <>
          {tweets.map((tweet) => (
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
              likes={tweet._count.likes} 
              retweets={tweet.retweets} 
              replies={tweet._count.children} 
              views={tweet.views}
              currentUser={currentUser}
              onDelete={() => fetchTweets(1)}
              isLiked={tweet.isLiked}
            />
          ))}
          {hasMore && tweets.length > 0 && (
             <div className="flex justify-center p-6 border-b border-gray-800">
               <button 
                 onClick={handleLoadMore}
                 disabled={loadingMore}
                 className="text-blue-500 hover:bg-blue-500/10 px-4 py-2 rounded-full transition disabled:opacity-50"
               >
                 {loadingMore ? 'Loading...' : 'Load More'}
               </button>
             </div>
          )}
        </>
      )}
    </div>
  );
}

function ToolButton({ icon: Icon, onClick }: { icon: any; onClick?: () => void }) {
  return (
    <button className="rounded-full p-2.5 hover:bg-blue-500/10 transition" onClick={onClick}>
      <Icon size={20} />
    </button>
  );
}
