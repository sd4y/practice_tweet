import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Home, Search, Bell, Mail, User, MoreHorizontal, PenTool, Bookmark } from 'lucide-react';

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
        bottom: window.innerHeight - rect.top, 
      });
    }
    setShowProfileMenu(!showProfileMenu);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileButtonRef.current && 
        !profileButtonRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('.profile-menu')
      ) {
        setShowProfileMenu(false);
      }
    };

    const handleScroll = () => {
       if (showProfileMenu) setShowProfileMenu(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true); 
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [showProfileMenu]);

  return (
    <header className="hidden sm:flex flex-col items-end pr-2 xl:w-[275px]">
      <div className="fixed top-0 flex h-full w-[88px] flex-col justify-between py-2 xl:w-[275px]">
        <div className="flex flex-col items-center xl:items-start">
          <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full hover:bg-gray-900 xl:ml-1">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 text-white fill-white">
              <g>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </g>
            </svg>
          </div>
          
          <nav className="flex w-full flex-col gap-2">
            <NavItem href="/main" icon={Home} label="Home" active />
            <NavItem href="/explore" icon={Search} label="Explore" />
            <NavItem href="/notifications" icon={Bell} label="Notifications" />
            <NavItem href="/messages" icon={Mail} label="Messages" />
            <NavItem href="/bookmarks" icon={Bookmark} label="Bookmarks" />
            <NavItem href="/profile" icon={User} label="Profile" />
            <NavItemBtn icon={MoreHorizontal} label="More" />
          </nav>
          
          <button className="mt-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-lg transition hover:bg-blue-600 xl:h-14 xl:w-[90%]">
            <PenTool className="h-6 w-6 text-white xl:hidden" />
            <span className="hidden text-lg font-bold text-white xl:block">Post</span>
          </button>
        </div>

        {currentUser && (
          <div className="relative mb-4 flex w-full items-center justify-center xl:justify-start">
            <button 
              className="group flex w-full items-center gap-3 rounded-full p-3 transition hover:bg-gray-900"
              onClick={toggleMenu}
              ref={profileButtonRef}
            >
              <div 
                className="h-10 w-10 h-min-10 w-min-10 rounded-full bg-gray-700 bg-cover bg-center bg-no-repeat" 
                style={{ backgroundImage: currentUser.avatar ? `url(${currentUser.avatar})` : undefined }} 
              />
              <div className="hidden flex-col items-start xl:flex">
                <span className="font-bold text-white">{currentUser.name}</span>
                <span className="text-gray-500">@{currentUser.username}</span>
              </div>
              <MoreHorizontal size={18} className="ml-auto hidden text-white xl:block" />
            </button>
            
            {showProfileMenu && menuStyle && (
              <div 
                className="profile-menu fixed flex flex-col rounded-xl bg-black shadow-[0_0_15px_rgba(255,255,255,0.2)] border border-gray-800"
                style={{
                  left: menuStyle.left,
                  bottom: menuStyle.bottom + 10,
                  width: 300,
                  zIndex: 50
                }}
              >
                 <button className="text-left w-full px-4 py-3 font-bold text-white hover:bg-gray-900 transition rounded-t-xl">Add an existing account</button>
                 <button className="text-left w-full px-4 py-3 font-bold text-white hover:bg-gray-900 transition rounded-b-xl" onClick={handleLogout}>Log out @{currentUser.username}</button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

function NavItem({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active?: boolean }) {
  return (
    <Link href={href} className="flex items-center justify-center xl:justify-start">
      <div className={`flex items-center gap-4 rounded-full p-3 px-4 transition hover:bg-gray-900 ${active ? 'font-bold' : ''}`}>
        <Icon size={26} className="text-white" strokeWidth={active ? 3 : 2} />
        <span className="hidden text-xl text-white xl:block">{label}</span>
      </div>
    </Link>
  );
}

function NavItemBtn({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <button className="flex items-center justify-center xl:justify-start w-full">
      <div className="flex items-center gap-4 rounded-full p-3 px-4 transition hover:bg-gray-900">
        <Icon size={26} className="text-white" strokeWidth={2} />
        <span className="hidden text-xl text-white xl:block">{label}</span>
      </div>
    </button>
  );
}
