import React, { useState } from 'react';
import { MessageCircle, Repeat, Heart, BarChart2, Share, MoreHorizontal, ThumbsUp, ThumbsDown, Trash2, Edit2 } from 'lucide-react';
import styles from './Tweet.module.css';
import api from '../lib/api';

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

  // Update local state if props change (re-fetch)
  React.useEffect(() => {
    setLiked(isLiked);
    setLikeCount(likes);
  }, [isLiked, likes]);

  // Update content if props change
  React.useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
       alert('Please login to like tweets');
       return;
    }

    const prevLiked = liked;
    const prevCount = likeCount;

    // Optimistic update
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);

    try {
      await api.post(`/tweets/${id}/like`);
    } catch (error) {
      console.error('Failed to toggle like:', error);
      // Revert on error
      setLiked(prevLiked);
      setLikeCount(prevCount);
    }
  };
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replies, setReplies] = useState(initialReplies);
  const [showReplies, setShowReplies] = useState(false);
  const [repliesList, setRepliesList] = useState<any[]>([]);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [showOptions, setShowOptions] = useState(false);

  // Toggle options menu
  const toggleOptions = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };

  // Close options when clicking outside (simple effect)
  React.useEffect(() => {
    const closeOptions = () => setShowOptions(false);
    if (showOptions) {
      window.addEventListener('click', closeOptions);
    }
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
      setContent(editContent); // Update local content
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update tweet:', error);
      alert('Failed to update tweet');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(content);
  };

  const handleToggleReplies = async () => {
    // If opening, and no replies loaded yet, fetch them
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
    // Toggle the section visibility
    setShowReplies(!showReplies);
  };

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;
    try {
      await api.post('/tweets', {
        content: replyContent,
        parentId: id
      });
      setReplyContent('');
      // Force refresh of replies
      const response = await api.get(`/tweets/${id}`);
      setRepliesList(response.data.children);
      setReplies(prev => prev + 1);
    } catch (error) {
      console.error('Failed to reply:', error);
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
      console.error('Failed to delete tweet:', error);
      alert('Failed to delete');
    }
  };

  // Comment Layout
  if (isComment) {
    return (
      <div className={styles.comment}>
        <div style={{ display: 'flex' }}>
          <div className={styles.avatar} style={{ backgroundImage: authorAvatar ? `url(${authorAvatar})` : undefined }}></div>
          <div className={styles.content}>
            <div className={styles.header}>
              <span className={styles.name}>{authorName}</span>
              <span className={styles.time}>{time}</span>
            </div>
            
            {isEditing ? (
              <div style={{ marginTop: 8 }}>
                 <textarea 
                    className={styles.editArea} 
                    value={editContent} 
                    onChange={(e) => setEditContent(e.target.value)} 
                 />
                 <div className={styles.editButtons}>
                    <button className={styles.cancelButton} onClick={handleCancelEdit}>Cancel</button>
                    <button className={styles.saveButton} onClick={handleSaveEdit}>Save</button>
                 </div>
              </div>
            ) : (
              <div className={styles.text}>{content}</div>
            )}

            {image && !isEditing && (
              <div className={styles.imageWrapper} style={{ marginTop: 10 }}>
                 <img src={image} alt="Tweet attachment" style={{ maxWidth: '100%', borderRadius: 16 }} />
              </div>
            )}
            
            <div className={styles.actions}>
              <div className={styles.tooltipContainer}>
                <button 
                  className={styles.commentActionButton} 
                  aria-label="Like"
                  onClick={handleLike}
                  style={{ color: liked ? '#f91880' : 'inherit' }}
                >
                  {liked ? <Heart size={14} fill="#f91880" /> : <Heart size={14} />}
                  {likeCount > 0 && <span>{likeCount}</span>}
                </button>
                <span className={styles.tooltip}>{liked ? 'Unlike' : 'Like'}</span>
              </div>

              <div className={styles.tooltipContainer}>
                <button className={styles.commentActionButton} onClick={handleToggleReplies} style={{ fontWeight: 500 }}>
                  답글
                </button>
                <span className={styles.tooltip}>Reply</span>
              </div>

              {isOwner && (
                <div className={`${styles.tooltipContainer} ${styles.moreButtonWrapper}`}>
                  <button className={styles.commentActionButton} onClick={toggleOptions} aria-label="More">
                    <MoreHorizontal size={14} color="#666" />
                  </button>
                  {showOptions && (
                    <div className={styles.dropdownMenu}>
                       <button className={styles.dropdownItem} onClick={handleEditClick}>
                          <Edit2 size={14} /> Edit
                       </button>
                       <button className={`${styles.dropdownItem} ${styles.delete}`} onClick={handleDelete}>
                          <Trash2 size={14} /> Delete
                       </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {showReplies && (
              <div style={{ marginTop: 10 }}>
                 <div style={{ marginBottom: 10, display: 'flex', gap: 10 }}>
                   <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#555' }}></div>
                   <div style={{ flex: 1 }}>
                     <input 
                        type="text" 
                        value={replyContent} 
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Add a reply..."
                        style={{
                          width: '100%',
                          backgroundColor: 'transparent',
                          border: 'none',
                          borderBottom: '1px solid #555',
                          padding: '4px 0',
                          color: 'white',
                          fontSize: '13px',
                          marginBottom: 8
                        }}
                     />
                     <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <button 
                          onClick={() => setShowReplies(false)}
                          style={{ background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: 12 }}
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleReplySubmit}
                          disabled={!replyContent.trim()}
                          style={{
                            backgroundColor: replyContent.trim() ? '#3ea6ff' : '#333',
                            color: replyContent.trim() ? 'black' : '#777',
                            border: 'none',
                            padding: '4px 12px',
                            borderRadius: 12,
                            cursor: replyContent.trim() ? 'pointer' : 'default',
                            fontWeight: 'bold',
                            fontSize: 12
                          }}
                        >
                          Reply
                        </button>
                     </div>
                   </div>
                </div>
                {/* Recursive replies to comments */}
                {repliesList.map((reply: any) => (
                   <Tweet 
                     key={reply.id}
                     id={reply.id}
                     authorName={reply.author.name || 'Unknown'} 
                     authorHandle={reply.author.username || 'unknown'} 
                     authorAvatar={reply.author.avatar}
                     authorId={reply.author.id}
                     time={new Date(reply.createdAt).toLocaleDateString()} 
                     content={reply.content} 
                     image={reply.image}
                     likes={reply._count?.likes || 0} 
                     retweets={0} 
                     replies={reply._count?.children || 0} 
                     views={0}
                     isComment={true} 
                     currentUser={currentUser}
                     isLiked={reply.isLiked}
                     onDelete={() => {
                        // Refresh replies logic: re-fetch from ID
                        handleToggleReplies().then(() => {
                            // actually handleToggleReplies simply toggles if not empty.
                            // We need to Force fetch.
                            api.get(`/tweets/${id}`).then(res => setRepliesList(res.data.children));
                        });
                     }}
                   />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Original Tweet Layout for Main Post
  return (
    <article className={styles.tweet}>
      <div className={styles.avatar} style={{ backgroundImage: authorAvatar ? `url(${authorAvatar})` : undefined }}></div>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.authorInfo}>
            <span className={styles.name}>{authorName}</span>
            <span className={styles.handle}>@{authorHandle}</span>
            <span className={styles.dot}>·</span>
            <span className={styles.time}>{time}</span>
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            {isOwner && (
               <div className={`${styles.tooltipContainer} ${styles.moreButtonWrapper}`}>
                  <button className={styles.moreButton} onClick={toggleOptions} aria-label="More">
                     <MoreHorizontal size={18} />
                  </button>
                  {showOptions && (
                    <div className={styles.dropdownMenu} style={{ right: 0, top: '100%' }}>
                       <button className={styles.dropdownItem} onClick={handleEditClick}>
                          <Edit2 size={16} /> Edit
                       </button>
                       <button className={`${styles.dropdownItem} ${styles.delete}`} onClick={(e) => handleDelete(e)}>
                          <Trash2 size={16} /> Delete
                       </button>
                    </div>
                  )}
               </div>
            )}
            {!isOwner && (
              <button className={styles.moreButton}>
                <MoreHorizontal size={18} />
              </button>
            )}
          </div>
        </div>
        
        {isEditing ? (
          <div style={{ marginTop: 8 }}>
             <textarea 
                className={styles.editArea} 
                value={editContent} 
                onChange={(e) => setEditContent(e.target.value)} 
             />
             <div className={styles.editButtons}>
                <button className={styles.cancelButton} onClick={handleCancelEdit}>Cancel</button>
                <button className={styles.saveButton} onClick={handleSaveEdit}>Save</button>
             </div>
          </div>
        ) : (
          <div className={styles.text}>{content}</div>
        )}

        {image && !isEditing && (
          <div className={styles.imageWrapper} style={{ marginTop: 12 }}>
             <img src={image} alt="Tweet attachment" style={{ maxWidth: '100%', borderRadius: 16, border: '1px solid #333' }} />
          </div>
        )}

        <div className={styles.actions}>
          <div className={styles.tooltipContainer}>
            <button className={styles.actionButton} aria-label="Reply" onClick={handleToggleReplies}>
              <MessageCircle size={18} />
              <span className={styles.actionCount}>{replies}</span>
            </button>
            <span className={styles.tooltip}>Reply</span>
          </div>

          <div className={styles.tooltipContainer}>
            <button className={styles.actionButton} aria-label="Retweet">
              <Repeat size={18} />
              <span className={styles.actionCount}>{retweets}</span>
            </button>
            <span className={styles.tooltip}>Retweet</span>
          </div>

          <div className={styles.tooltipContainer}>
            <button 
              className={`${styles.actionButton} ${liked ? styles.liked : ''}`} 
              aria-label="Like"
              onClick={handleLike}
            >
              {liked ? <Heart size={18} fill="#f91880" color="#f91880" /> : <Heart size={18} />}
              <span className={styles.actionCount} style={{ color: liked ? '#f91880' : 'inherit' }}>{likeCount}</span>
            </button>
            <span className={styles.tooltip}>{liked ? 'Unlike' : 'Like'}</span>
          </div>

          <div className={styles.tooltipContainer}>
            <button className={styles.actionButton} aria-label="View">
              <BarChart2 size={18} />
              <span className={styles.actionCount}>{views}</span>
            </button>
            <span className={styles.tooltip}>Views</span>
          </div>

          <div className={styles.tooltipContainer}>
             <button className={styles.actionButton} aria-label="Share">
              <Share size={18} />
            </button>
            <span className={styles.tooltip}>Share</span>
          </div>
        </div>
        
        {showReplies && (
          <div style={{ marginTop: 15, borderTop: '1px solid #333', paddingTop: 15 }}>
            <div style={{ marginBottom: 20, display: 'flex', gap: 10 }}>
               <div style={{ width: 30, height: 30, borderRadius: '50%', backgroundColor: '#555' }}></div>
               <div style={{ flex: 1 }}>
                 <input 
                    type="text" 
                    value={replyContent} 
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Add a reply..."
                    style={{
                      width: '100%',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid #555',
                      padding: '5px 0',
                      color: 'white',
                      marginBottom: 10
                    }}
                 />
                 <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <button 
                      onClick={() => setShowReplies(false)}
                      style={{ background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: 13 }}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleReplySubmit}
                      disabled={!replyContent.trim()}
                      style={{
                        backgroundColor: replyContent.trim() ? '#3ea6ff' : '#333',
                        color: replyContent.trim() ? 'black' : '#777',
                        border: 'none',
                        padding: '6px 15px',
                        borderRadius: 18,
                        cursor: replyContent.trim() ? 'pointer' : 'default',
                        fontWeight: 'bold',
                        fontSize: 13
                      }}
                    >
                      Reply
                    </button>
                 </div>
               </div>
            </div>

            {repliesList.map((reply: any) => (
               <Tweet 
                 key={reply.id}
                 id={reply.id}
                 authorName={reply.author.name || 'Unknown'} 
                 authorHandle={reply.author.username || 'unknown'} 
                 authorAvatar={reply.author.avatar}
                 authorId={reply.author.id}
                 time={new Date(reply.createdAt).toLocaleDateString()} 
                 content={reply.content} 
                 likes={reply._count?.likes || 0} 
                 retweets={0} 
                 replies={reply._count?.children || 0} 
                 views={0} 
                 isComment={true}
                 currentUser={currentUser}
                 isLiked={reply.isLiked}
                 onDelete={() => {
                    api.get(`/tweets/${id}`).then(res => {
                        setRepliesList(res.data.children);
                        setReplies(prev => Math.max(0, prev - 1)); // Decrement parent's reply count
                    });
                 }}
               />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
