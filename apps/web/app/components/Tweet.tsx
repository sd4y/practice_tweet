import React, { useState, useEffect } from 'react';
import { MessageCircle, Repeat, Heart, BarChart2, Share, MoreHorizontal, Trash2, Edit2 } from 'lucide-react';
import api from '../lib/api';
import Link from 'next/link';

interface TweetProps {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar?: string;
  authorId: string;
  time: string;
  content: string;
  image?: string;
  likes: number;
  retweets: number;
  replies: number;
  views: number;
  isComment?: boolean;
  currentUser?: any;
  onDelete?: () => void;
  isLiked?: boolean;
}

export function Tweet({ 
  id,
  authorName, 
  authorHandle, 
  authorAvatar,
  authorId,
  time, 
  content: initialContent, 
  image,
  likes, 
  retweets, 
  replies: initialReplies, 
  views,
  isComment = false,
  currentUser,
  onDelete,
  isLiked = false
}: TweetProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setLiked(isLiked);
    setLikeCount(likes);
  }, [isLiked, likes]);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return alert('Please login to like tweets');

    const prevLiked = liked;
    const prevCount = likeCount;

    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);

    try {
      await api.post(`/tweets/${id}/like`);
    } catch (error) {
      console.error('Failed to toggle like:', error);
      setLiked(prevLiked);
      setLikeCount(prevCount);
    }
  };

  const [replies, setReplies] = useState(initialReplies);
  const [showReplies, setShowReplies] = useState(false);
  const [repliesList, setRepliesList] = useState<any[]>([]);
  const [replyContent, setReplyContent] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };

  useEffect(() => {
    const closeOptions = () => setShowOptions(false);
    if (showOptions) window.addEventListener('click', closeOptions);
    return () => window.removeEventListener('click', closeOptions);
  }, [showOptions]);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditContent(content);
    setShowOptions(false);
  };

  const handleSaveEdit = async () => {
    try {
      await api.patch(`/tweets/${id}`, { content: editContent });
      setContent(editContent);
      setIsEditing(false);
    } catch (error) {
      alert('Failed to update tweet');
    }
  };

  const handleToggleReplies = async () => {
    if (!showReplies && repliesList.length === 0) {
      try {
        const response = await api.get(`/tweets/${id}`);
        if (response.data && response.data.children) {
          setRepliesList(response.data.children);
        }
      } catch (error) {
        console.error('Failed to load replies:', error);
      }
    }
    setShowReplies(!showReplies);
  };

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;
    try {
      await api.post('/tweets', { content: replyContent, parentId: id });
      setReplyContent('');
      const response = await api.get(`/tweets/${id}`);
      setRepliesList(response.data.children);
      setReplies(prev => prev + 1);
    } catch (error) {
      alert('Failed to send reply');
    }
  };

  const isOwner = currentUser?.userId === authorId;

  const handleDelete = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm('Are you sure you want to delete this?')) return;
    try {
      await api.delete(`/tweets/${id}`);
      if (onDelete) onDelete();
    } catch (error) {
      alert('Failed to delete');
    }
  };

  // Rendering logic for Comment vs Main Post
  const Wrapper = isComment ? 'div' : 'article';
  
  return (
    <Wrapper className={`flex w-full gap-3 border-b border-gray-800 p-4 transition ${!isComment ? 'hover:bg-white/5 cursor-pointer' : ''}`}>
     <Link href={`/profile/${encodeURIComponent(authorHandle)}`} className="h-10 w-10 min-w-[40px] rounded-full bg-gray-700 bg-cover bg-center" style={{ backgroundImage: authorAvatar ? `url(${authorAvatar})` : undefined }} onClick={(e) => e.stopPropagation()}>
      </Link>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <Link href={`/profile/${encodeURIComponent(authorHandle)}`} className="flex items-center gap-1 hover:underline" onClick={(e) => e.stopPropagation()}>
                <span className="font-bold text-white text-base">{authorName}</span>
                <span>@{authorHandle}</span>
            </Link>
            <span>·</span>
            <span>{time}</span>
          </div>
          <div className="relative">
            <button className="rounded-full p-2 text-gray-500 hover:bg-blue-500/10 hover:text-blue-500 transition" onClick={toggleOptions}>
              <MoreHorizontal size={18} />
            </button>
            {showOptions && (
              <div className="absolute right-0 top-full z-10 w-32 rounded-lg bg-black shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-gray-800 overflow-hidden">
                {isOwner && (
                  <>
                    <button className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-gray-900 transition text-sm" onClick={handleEditClick}>
                      <Edit2 size={14} /> Edit
                    </button>
                    <button className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-gray-900 transition text-sm text-red-500" onClick={handleDelete}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </>
                )}
                {!isOwner && (
                   <button className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-gray-900 transition text-sm">
                      Mute @{authorHandle}
                   </button>
                )}
              </div>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="mt-2 flex flex-col gap-2">
            <textarea 
              className="w-full rounded p-2 text-black" 
              value={editContent} 
              onChange={(e) => setEditContent(e.target.value)} 
            />
            <div className="flex gap-2">
              <button className="rounded px-3 py-1 bg-gray-700 text-white" onClick={() => setIsEditing(false)}>Cancel</button>
              <button className="rounded px-3 py-1 bg-blue-500 text-white" onClick={handleSaveEdit}>Save</button>
            </div>
          </div>
        ) : (
          <p className="mt-1 text-white whitespace-pre-wrap text-[15px] leading-6">{content}</p>
        )}

        {image && !isEditing && (
          <div className="mt-3 overflow-hidden rounded-2xl border border-gray-800">
            <img src={image} alt="Tweet image" className="w-full object-cover" />
          </div>
        )}

        {/* Action Bar */}
        <div className="mt-3 flex max-w-md justify-between text-gray-500">
          <ActionButton icon={MessageCircle} count={replies} label="Reply" onClick={handleToggleReplies} color="blue" />
          <ActionButton icon={Repeat} count={retweets} label="Retweet" color="green" />
          <ActionButton 
            icon={Heart} 
            count={likeCount} 
            label="Like" 
            active={liked} 
            onClick={handleLike} 
            color="pink" 
            fill={liked}
          />
          <ActionButton icon={BarChart2} count={views} label="Views" color="blue" />
          <ActionButton icon={Share} label="Share" color="blue" />
        </div>

        {/* Reply Section */}
        {showReplies && (
          <div className="mt-4 border-t border-gray-800 pt-4">
             <div className="flex gap-3 mb-4">
               <div className="h-8 w-8 rounded-full bg-gray-700"></div>
               <div className="flex flex-1 flex-col gap-2">
                 <input 
                    type="text" 
                    placeholder="Post your reply" 
                    className="w-full bg-transparent text-white outline-none placeholder:text-gray-500 pb-2 border-b border-gray-800 focus:border-blue-500 transition"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                 />
                 <div className="flex justify-end">
                   <button 
                     className="rounded-full bg-blue-500 px-4 py-1.5 font-bold text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                     onClick={handleReplySubmit}
                     disabled={!replyContent.trim()}
                   >
                     Reply
                   </button>
                 </div>
               </div>
             </div>
             <div>
               {repliesList.map(reply => (
                 <Tweet 
                   key={reply.id} 
                   {...reply} 
                   authorName={reply.author.name}
                   authorHandle={reply.author.username}
                   authorAvatar={reply.author.avatar}
                   time={new Date(reply.createdAt).toLocaleDateString()}
                   likes={reply._count?.likes || 0}
                   replies={reply._count?.children || 0}
                   isComment={true}
                   currentUser={currentUser}
                   onDelete={() => {
                      api.get(`/tweets/${id}`).then(res => setRepliesList(res.data.children));
                   }}
                 />
               ))}
             </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
}

function ActionButton({ icon: Icon, count, label, onClick, color, active, fill }: any) {
  const colorClass = {
    blue: 'hover:text-blue-500 group-hover:bg-blue-500/10',
    green: 'hover:text-green-500 group-hover:bg-green-500/10',
    pink: 'hover:text-pink-600 group-hover:bg-pink-600/10',
  }[color as string] || 'hover:text-blue-500 group-hover:bg-blue-500/10';

  const textClass = {
    blue: 'group-hover:text-blue-500',
    green: 'group-hover:text-green-500',
    pink: 'group-hover:text-pink-600',
  }[color as string] || 'group-hover:text-blue-500';

  return (
    <button 
      className={`group flex items-center gap-1 transition ${active ? 'text-pink-600' : ''}`} 
      onClick={onClick} 
      title={label}
    >
      <div className={`rounded-full p-2 transition ${colorClass}`}>
        <Icon size={18} fill={fill ? "currentColor" : "none"} />
      </div>
      {count !== undefined && <span className={`text-sm transition ${textClass}`}>{count || ''}</span>}
    </button>
  );
}
