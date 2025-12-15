import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Home, Search, Bell, Mail, User, MoreHorizontal, PenTool } from 'lucide-react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  currentUser?: {
    id: string;
    username: string;
    name: string;
    avatar?: string;
  };
}

export function Sidebar({ currentUser }: SidebarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const [menuStyle, setMenuStyle] = useState<{ left: number; bottom: number } | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const toggleMenu = () => {
    if (!showProfileMenu && profileButtonRef.current) {
      const rect = profileButtonRef.current.getBoundingClientRect();
      setMenuStyle({
        left: rect.left,
        bottom: window.innerHeight - rect.top, // Position above the button
      });
    }
    setShowProfileMenu(!showProfileMenu);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside button AND menu (we can't easily check menu ref if it's rendered outside, but here it's inline)
      // Actually, since we're not using Portal, it is in the DOM.
      // But we need a ref for the menu if we want to be precise. 
      // For now, clicking anywhere else closes it.
      if (
        profileButtonRef.current && 
        !profileButtonRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(`.${styles.profileMenu}`)
      ) {
        setShowProfileMenu(false);
      }
    };

    const handleScroll = () => {
       if (showProfileMenu) setShowProfileMenu(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true); // Close on scroll to prevent detachment
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [showProfileMenu]);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.logoSvg}>
            <g>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </g>
          </svg>
        </div>
        <nav className={styles.nav}>
          <div className={styles.tooltipContainer}>
            <Link href="/" className={styles.navItem}>
              <Home size={26} />
              <span>Home</span>
            </Link>
            <span className={styles.tooltip}>Home</span>
          </div>
          <div className={styles.tooltipContainer}>
            <Link href="/explore" className={styles.navItem}>
              <Search size={26} />
              <span>Explore</span>
            </Link>
            <span className={styles.tooltip}>Explore</span>
          </div>
          <div className={styles.tooltipContainer}>
            <Link href="/notifications" className={styles.navItem}>
              <Bell size={26} />
              <span>Notifications</span>
            </Link>
            <span className={styles.tooltip}>Notifications</span>
          </div>
          <div className={styles.tooltipContainer}>
            <Link href="/messages" className={styles.navItem}>
              <Mail size={26} />
              <span>Messages</span>
            </Link>
            <span className={styles.tooltip}>Messages</span>
          </div>
          <div className={styles.tooltipContainer}>
            <Link href="/profile" className={styles.navItem}>
              <User size={26} />
              <span>Profile</span>
            </Link>
            <span className={styles.tooltip}>Profile</span>
          </div>
          <div className={styles.tooltipContainer}>
            <button className={styles.navItem}>
              <MoreHorizontal size={26} />
              <span>More</span>
            </button>
            <span className={styles.tooltip}>More</span>
          </div>
        </nav>
        
        <button className={styles.tweetButton}>
          <span className={styles.tweetButtonText}>Post</span>
          <PenTool className={styles.tweetButtonIcon} size={24} />
        </button>

        {currentUser && (
          <div className={styles.profileSection}>
            <button 
              className={styles.profileButton} 
              onClick={toggleMenu}
              ref={profileButtonRef}
            >
              <div 
                className={styles.avatar} 
                style={{ backgroundImage: currentUser.avatar ? `url(${currentUser.avatar})` : undefined }} 
              />
              <div className={styles.userInfo}>
                <span className={styles.name}>{currentUser.name}</span>
                <span className={styles.username}>@{currentUser.username}</span>
              </div>
              <MoreHorizontal size={18} className={styles.moreIcon} />
            </button>
            
            {showProfileMenu && menuStyle && (
              <div 
                className={styles.profileMenu}
                style={{
                  position: 'fixed',
                  left: menuStyle.left,
                  bottom: menuStyle.bottom,
                  marginBottom: 10, // slight gap
                  width: 300 // ensure width is set
                }}
              >
                 <button className={styles.menuItem}>Add an existing account</button>
                 <button className={styles.menuItem} onClick={handleLogout}>Log out @{currentUser.username}</button>
              </div>
            )}
            
            <span className={styles.tooltip}>Accounts</span>
          </div>
        )}
      </div>
    </header>
  );
}
