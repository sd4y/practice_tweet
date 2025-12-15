import React from 'react';
import { Search, MoreHorizontal } from 'lucide-react';
import styles from './RightSection.module.css';

export function RightSection() {
  return (
    <aside className={styles.container}>
      <div className={styles.searchContainer}>
        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} size={20} />
          <input type="text" placeholder="Search" className={styles.searchInput} />
        </div>
      </div>

      <div className={styles.premiumCard}>
        <h2 className={styles.premiumTitle}>Subscribe to Premium</h2>
        <p className={styles.premiumText}>Subscribe to unlock new features and if eligible, receive a share of ads revenue.</p>
        <button className={styles.premiumButton}>Subscribe</button>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>What's happening</h2>
        {[
          { category: 'Entertainment · Trending', name: '#NextJS15', posts: '54.2K posts' },
          { category: 'Technology · Trending', name: 'Artificial Intelligence', posts: '125K posts' },
          { category: 'Sports · Trending', name: 'Premier League', posts: '89.1K posts' },
          { category: 'Politics · Trending', name: 'Elections 2024', posts: '2.1M posts' },
        ].map((item, i) => (
          <div key={i} className={styles.trendItem}>
            <div className={styles.trendInfo}>
              <span className={styles.trendMeta}>{item.category}</span>
              <span className={styles.trendName}>{item.name}</span>
              <span className={styles.trendCount}>{item.posts}</span>
            </div>
            <button className={styles.moreButton}>
              <MoreHorizontal size={18} />
            </button>
          </div>
        ))}
        <div className={styles.showMore}>Show more</div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Who to follow</h2>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.followItem}>
            <div className={styles.avatar}></div>
            <div className={styles.followInfo}>
              <span className={styles.followName}>User {i}</span>
              <span className={styles.followHandle}>@user{i}</span>
            </div>
            <button className={styles.followButton}>Follow</button>
          </div>
        ))}
        <div className={styles.showMore}>Show more</div>
      </div>
    </aside>
  );
}
