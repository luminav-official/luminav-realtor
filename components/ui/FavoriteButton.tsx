'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface FavoriteButtonProps {
  propertyId: string;
  isInitiallyFavorited: boolean;
}

// A simple heart SVG icon
const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill={filled ? 'currentColor' : 'none'}
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 21l-7.682-7.682a4.5 4.5 0 010-6.364z"
    />
  </svg>
);

export default function FavoriteButton({ propertyId, isInitiallyFavorited }: FavoriteButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(isInitiallyFavorited);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavorite = async () => {
    if (status !== 'authenticated') {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    const originalState = isFavorited;
    // Optimistic update
    setIsFavorited(!originalState);

    const res = await fetch('/api/favorites', {
      method: isFavorited ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId }),
    });

    if (!res.ok) {
      // Revert on error
      setIsFavorited(originalState);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
    
    // Refresh server-side props to ensure consistency
    router.refresh();
    setIsLoading(false);
  };

  if (status === 'loading') {
    return <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>;
  }

  if (status !== 'authenticated') {
    return (
        <button 
            onClick={() => router.push('/login')}
            className="w-full h-12 mt-2 bg-blue-500 text-white rounded-lg flex items-center justify-center font-bold"
        >
            로그인 후 찜하기
        </button>
    )
  }

  return (
    <button
      onClick={handleFavorite}
      disabled={isLoading}
      className={`w-full h-12 mt-2 rounded-lg flex items-center justify-center font-bold transition-colors ${isFavorited ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
    >
      <HeartIcon filled={isFavorited} />
      <span className="ml-2">{isFavorited ? '찜 해제' : '찜하기'}</span>
    </button>
  );
}
