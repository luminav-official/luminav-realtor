'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Luminav Realtor
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/properties" className="text-gray-600 hover:text-blue-600">
            전체 매물
          </Link>
          {/* Add other links here */}
        </div>
        <div className="flex items-center">
          {isLoading ? (
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
          ) : session ? (
            <div className="flex items-center space-x-4">
              <span>{session.user?.name || session.user?.email}님</span>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              로그인
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
