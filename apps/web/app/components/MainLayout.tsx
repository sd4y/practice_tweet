import React, { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { RightSection } from './RightSection';
import styles from './MainLayout.module.css';
import api from '../lib/api';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/auth/profile');
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };
    fetchUser();
  }, []);

  // Clone children to pass currentUser if they are valid React elements
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { currentUser } as any);
    }
    return child;
  });

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Sidebar currentUser={currentUser} />
        <main className={styles.main}>
          {childrenWithProps}
        </main>
        <RightSection />
      </div>
    </div>
  );
}
