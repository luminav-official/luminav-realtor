import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import KakaoMap from '@/components/ui/KakaoMap';
import FavoriteButton from '@/components/ui/FavoriteButton';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

async function getProperty(id: string) {
  try {
    const property = await prisma.property.findUnique({
      where: { id },
    });
    if (!property) {
      notFound();
    }
    return property;
  } catch (error) {
    notFound();
  }
}

const ImagePlaceholder = ({ className = '' }: { className?: string }) => (
  <div className={`w-full h-full bg-gray-200 flex items-center justify-center ${className}`}>
    <span className="text-gray-500">Image</span>
  </div>
);

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = await getProperty(params.id);
  const session = await getServerSession(authOptions);

  let isFavorited = false;
  if (session?.user) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId: session.user.id,
          propertyId: params.id,
        },
      },
    });
    isFavorited = !!favorite;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-4 lg:hidden">{property.title}</h1>
          <div className="w-full h-96 mb-8 bg-gray-100 rounded-lg">
            <ImagePlaceholder className="rounded-lg" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">매물 위치</h2>
          <KakaoMap 
            latitude={property.latitude}
            longitude={property.longitude}
            className="w-full h-96 rounded-lg"
          />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8 border rounded-lg p-6 shadow-lg">
            <h1 className="text-3xl font-bold mb-4 hidden lg:block">{property.title}</h1>
            <p className="text-gray-600 mb-4">{property.address}</p>
            <div className="my-6">
              <p className="text-sm text-gray-500">{property.tradeType}</p>
              <p className="text-4xl font-extrabold text-blue-600">{property.price.toLocaleString()}만원</p>
            </div>
            <div className="space-y-2 text-lg">
              <div className="flex justify-between"><span>방 개수</span><span className="font-semibold">{property.rooms}개</span></div>
              <div className="flex justify-between"><span>평수</span><span className="font-semibold">{property.size}m²</span></div>
              <div className="flex justify-between"><span>종류</span><span className="font-semibold">{property.propertyType}</span></div>
            </div>
            <div className="mt-6">
              <h3 className="font-semibold text-xl mb-2">옵션</h3>
              <div className="flex flex-wrap gap-2">
                {property.options.map(option => (
                  <span key={option} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">{option}</span>
                ))}
              </div>
            </div>
            <div className="mt-8">
              <div className="w-full h-12 bg-yellow-300 rounded-lg flex items-center justify-center">
                <p className="font-bold">[카카오톡 상담 버튼 예정]</p>
              </div>
              <FavoriteButton propertyId={property.id} isInitiallyFavorited={isFavorited} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">상세 설명</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {property.description}
        </p>
      </div>
    </div>
  );
}
