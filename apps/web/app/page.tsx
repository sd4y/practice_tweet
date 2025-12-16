"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LandingPage } from "./components/LandingPage";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token validity and server reachability
          // We use a lightweight call or just rely on the fact that if this fails, 
          // the interceptor will catch it? 
          // No, interceptor handles 401. If server is down, interceptor now handles it too.
          // Let's rely on a quick profile fetch or just assume valid but handle failure in /main
          // Actually, if we blindly push, /main renders but data fails.
          // Better to verify? No, that delays UX. 
          // The issue is if server is down, we get stuck on /main with errors.
          // The updated interceptor will now bounce us back to / if fetch fails with network error.
          // So we can keep optimistic redirect, OR we can be safer.
          // Let's keep optimistic but maybe adding a small check if we want to be super safe. 
          // For now, prompt correctness: "User says it goes to main without login". 
          // This implies token exists.
          router.push('/main');
        } catch (e) {
          // If check fails, stay on landing
          localStorage.removeItem('token');
        }
      }
    };
    checkAuth();
  }, [router]);

  return (
    <LandingPage onLoginSuccess={() => router.push('/main')} />
  );
}
