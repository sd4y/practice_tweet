import React, { useState, useEffect, useRef } from 'react';
import { Tweet } from './Tweet';
import { Image, FileText, AlignLeft, Smile, Calendar, MapPin } from 'lucide-react';
import styles from './Feed.module.css';
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
  _count: {
    likes: number;
    children: number;
  };
  isLiked?: boolean;
}

export function Feed() {
  const [tweets, setTweets] = useState<TweetData[]>([]);
  const [newTweetContent, setNewTweetContent] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const fetchTweets = async () => {
    try {
      const response = await api.get('/tweets');
      setTweets(response.data);
    } catch (error) {
      console.error('Failed to fetch tweets:', error);
    } finally {
      setIsLoading(false);
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
    fetchTweets();
    fetchUser();
  }, []);

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
      fetchTweets(); // Refresh feed
    } catch (error) {
      console.error('Failed to post tweet:', error);
    }
  };

  return (
    <div className={styles.feed}>
      <div className={styles.header}>
        <div className={styles.tabs}>
          <div className={`${styles.tab} ${styles.activeTab}`}>
            <span>For you</span>
            <div className={styles.indicator}></div>
          </div>
          <div className={styles.tab}>
            <span>Following</span>
          </div>
        </div>
      </div>
      
      <div className={styles.compose}>
        <div className={styles.avatar}></div>
        <div className={styles.inputWrapper}>
          <input 
            type="text" 
            placeholder="What is happening?!" 
            className={styles.input}
            value={newTweetContent}
            onChange={(e) => setNewTweetContent(e.target.value)}
          />
          {imageUrl && (
            <div style={{ marginTop: 10, position: 'relative', display: 'inline-block' }}>
              <img src={imageUrl} alt="Upload preview" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 16 }} />
              <button 
                onClick={() => setImageUrl(null)}
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>
          )}
          <div className={styles.composeTools}>
            <div className={styles.toolIcons}>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
              />
              <button 
                className={styles.toolButton} 
                aria-label="Media"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image size={20} />
              </button>
              <button className={styles.toolButton} aria-label="GIF">
                <FileText size={20} />
              </button>
              <button className={styles.toolButton} aria-label="Poll">
                <AlignLeft size={20} />
              </button>
              <button className={styles.toolButton} aria-label="Emoji">
                <Smile size={20} />
              </button>
              <button className={styles.toolButton} aria-label="Schedule">
                <Calendar size={20} />
              </button>
              <button className={styles.toolButton} aria-label="Location">
                <MapPin size={20} />
              </button>
            </div>
            <button className={styles.postButton} onClick={handlePostTweet}>Post</button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div style={{ padding: 20, textAlign: 'center', color: 'white' }}>Loading...</div>
      ) : (
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
            likes={tweet._count.likes} 
            retweets={0} // Not implemented yet
            replies={tweet._count.children} 
            views={0} // Not implemented yet
            currentUser={currentUser}
            onDelete={() => fetchTweets()}
            isLiked={tweet.isLiked}
          />
        ))
      )}
    </div>
  );
}
