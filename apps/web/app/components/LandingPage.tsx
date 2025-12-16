import React from 'react';
import Link from 'next/link';

export function LandingPage({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="relative flex flex-1 items-center justify-center bg-black lg:min-h-screen">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-1/2 w-1/2 fill-white lg:h-2/3 lg:w-2/3">
          <g>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </g>
        </svg>
      </div>
      
      <div className="flex flex-1 flex-col justify-center bg-black p-8 text-white lg:p-16">
        <div className="flex max-w-lg flex-col gap-12">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-12 w-12 fill-white lg:hidden">
            <g>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </g>
          </svg>
          
          <h1 className="text-6xl font-extrabold tracking-tight sm:text-7xl">Happening now</h1>
          <h2 className="text-3xl font-bold sm:text-4xl">Join today.</h2>
          
          <div className="flex w-[300px] flex-col gap-3">
             <button className="flex items-center justify-center gap-2 rounded-full bg-white px-8 py-2.5 text-sm font-bold text-black transition hover:bg-gray-200">
               <svg viewBox="0 0 24 24" className="h-5 w-5">
                 <g>
                   <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                   <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                   <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                   <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                 </g>
               </svg>
               Sign up with Google
             </button>
             <button className="flex items-center justify-center gap-2 rounded-full bg-white px-8 py-2.5 text-sm font-bold text-black transition hover:bg-gray-200">
               <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                 <g>
                   <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.64.03 0 .05.01.05.01zm-3.215 4.54c-1.586 0-2.75.89-3.32 1.88-.45 1.17-.52 2.54.46 4.24.9 1.55 2.25 3.55 3.71 3.55.76 0 1.16-.41 1.83-.41.67 0 1.09.41 1.83.41.85 0 2.25-1.33 2.96-2.91-.65-.32-1.69-1.44-1.73-2.55-.04-1.48 1.29-2.23 1.35-2.27-1.02-1.3-2.6-1.94-3.52-1.94h-.01z"></path>
                 </g>
               </svg>
               Sign up with Apple
             </button>
             
             <div className="flex items-center gap-2 py-1">
               <div className="h-px flex-1 bg-gray-700"></div>
               <span className="text-sm">or</span>
               <div className="h-px flex-1 bg-gray-700"></div>
             </div>

             <Link href="/signup">
                <button className="w-full rounded-full bg-blue-500 px-8 py-2.5 text-sm font-bold text-white transition hover:bg-blue-600">
                  Create account
                </button>
             </Link>
             
             <p className="text-[11px] text-gray-500 max-w-[300px]">
               By signing up, you agree to the <a href="#" className="text-blue-500 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>, including <a href="#" className="text-blue-500 hover:underline">Cookie Use</a>.
             </p>

             <div className="mt-12 flex flex-col gap-4">
               <h3 className="font-bold">Already have an account?</h3>
               <Link href="/login">
                  <button className="w-full rounded-full border border-gray-600 px-8 py-2.5 text-sm font-bold text-blue-400 transition hover:bg-blue-500/10">
                    Sign in
                  </button>
               </Link>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
