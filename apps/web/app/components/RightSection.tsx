import React from 'react';
import { Search, MoreHorizontal } from 'lucide-react';

export function RightSection() {
  return (
    <div className="hidden lg:flex w-[350px] flex-col gap-4 pl-8 pt-2">
      <div className="sticky top-0 z-10 bg-black pt-1 pb-2">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 group-focus-within:text-blue-500">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full rounded-full bg-gray-900 py-3 pl-12 pr-4 text-white placeholder-gray-500 outline-none focus:bg-black focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl bg-gray-900 p-4">
        <h2 className="text-xl font-bold leading-6">Subscribe to Premium</h2>
        <p className="text-[15px] leading-5 text-gray-200">Subscribe to unlock new features and if eligible, receive a share of ads revenue.</p>
        <button className="mt-1 rounded-full bg-blue-500 px-4 py-1.5 font-bold text-white hover:bg-blue-600 transition duration-200">Subscribe</button>
      </div>

      <div className="flex flex-col rounded-2xl bg-gray-900 pt-3">
        <h2 className="mb-2 px-4 text-xl font-extrabold">What's happening</h2>
        {[
          { category: 'Entertainment · Trending', name: '#NextJS15', posts: '54.2K posts' },
          { category: 'Technology · Trending', name: 'Artificial Intelligence', posts: '125K posts' },
          { category: 'Sports · Trending', name: 'Premier League', posts: '89.1K posts' },
          { category: 'Politics · Trending', name: 'Elections 2024', posts: '2.1M posts' },
        ].map((item, i) => (
          <div key={i} className="flex cursor-pointer items-center justify-between px-4 py-3 transition hover:bg-gray-800">
            <div className="flex flex-col text-sm">
              <span className="text-gray-500">{item.category}</span>
              <span className="font-bold text-white">{item.name}</span>
              <span className="text-gray-500">{item.posts}</span>
            </div>
            <button className="rounded-full p-2 text-gray-500 hover:bg-blue-500/10 hover:text-blue-500">
              <MoreHorizontal size={18} />
            </button>
          </div>
        ))}
        <div className="cursor-pointer rounded-b-2xl p-4 text-blue-500 transition hover:bg-gray-800">Show more</div>
      </div>

      <div className="flex flex-col rounded-2xl bg-gray-900 pt-3">
        <h2 className="mb-2 px-4 text-xl font-extrabold">Who to follow</h2>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex cursor-pointer items-center justify-between px-4 py-3 transition hover:bg-gray-800">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-gray-700"></div>
              <div className="flex flex-col">
                <span className="font-bold text-white hover:underline">User {i}</span>
                <span className="text-gray-500">@user{i}</span>
              </div>
            </div>
            <button className="rounded-full bg-white px-4 py-1.5 font-bold text-black hover:bg-gray-200">Follow</button>
          </div>
        ))}
        <div className="cursor-pointer rounded-b-2xl p-4 text-blue-500 transition hover:bg-gray-800">Show more</div>
      </div>
      
      <div className="px-4 text-sm text-gray-500 flex flex-wrap gap-x-2">
        <span>Terms of Service</span>
        <span>Privacy Policy</span>
        <span>Cookie Policy</span>
        <span>Accessibility</span>
        <span>Ads info</span>
        <span>© 2025 Y Corp.</span>
      </div>
    </div>
  );
}
