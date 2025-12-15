"use client";

import { useState, useEffect } from "react";
import { Feed } from "./components/Feed";
import { LandingPage } from "./components/LandingPage";
import { MainLayout } from "./components/MainLayout";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  if (!isLoggedIn) {
    return (
      <LandingPage onLoginSuccess={() => setIsLoggedIn(true)} />
    );
  }

  return (
    <MainLayout>
      <Feed />
    </MainLayout>
  );
}
