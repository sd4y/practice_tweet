'use client';

import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { NotificationItem } from '../components/NotificationItem';
import api from '../lib/api';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        setNotifications(res.data);
      } catch (error) {
        console.error('Failed to load notifications', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <MainLayout>
      <div className="flex flex-col min-h-screen border-r border-gray-800">
        <div className="sticky top-0 z-10 border-b border-gray-800 bg-black/80 px-4 py-3 backdrop-blur-md">
          <h1 className="text-xl font-bold text-white">Notifications</h1>
        </div>

        <div>
          {loading ? (
            <div className="p-10 text-center text-gray-500">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="p-10 text-center text-gray-500">No notifications yet</div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                type={notification.type}
                user={notification.issuer}
                tweet={notification.tweet}
                read={notification.read}
              />
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
