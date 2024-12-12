// app/hooks/useSessionExpiration.js
'use client';
import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function useSessionExpiration() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.error === 'SessionExpired') {
      signOut({ redirect: false }).then(() => {
        router.push('/');
      });
    }
  }, [session, router]);

  return session;
}
