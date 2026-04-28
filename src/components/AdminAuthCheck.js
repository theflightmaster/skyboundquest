'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminAuthCheck() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    const loginTime = localStorage.getItem('adminLoginTime');

    if (!isAuthenticated || !loginTime) {
      router.push('/admin/login');
      return;
    }

    // Check if session is older than 24 hours
    const hoursSinceLogin = (Date.now() - parseInt(loginTime)) / (1000 * 60 * 60);
    if (hoursSinceLogin > 24) {
      localStorage.removeItem('adminAuthenticated');
      localStorage.removeItem('adminLoginTime');
      router.push('/admin/login');
    }
  }, [router]);

  return null;
}