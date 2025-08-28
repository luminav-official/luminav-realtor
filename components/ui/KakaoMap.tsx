'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  latitude: number;
  longitude: number;
  className?: string;
}

export default function KakaoMap({ latitude, longitude, className }: KakaoMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const kakaoMapApiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

    if (!kakaoMapApiKey) {
      console.error('Kakao Map API key is missing. Please set NEXT_PUBLIC_KAKAO_MAP_API_KEY environment variable.');
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapApiKey}&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (mapContainer.current) {
          const mapOption = {
            center: new window.kakao.maps.LatLng(latitude, longitude),
            level: 3,
          };
          const map = new window.kakao.maps.Map(mapContainer.current, mapOption);

          const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
          });
          marker.setMap(map);
        }
      });
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [latitude, longitude]);

  return (
    <div ref={mapContainer} className={className}>
      {!process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY && (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <span className="text-red-500">카카오 지도 API 키가 필요합니다.</span>
        </div>
      )}
    </div>
  );
}
