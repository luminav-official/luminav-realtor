import PropertyCard from '@/components/ui/PropertyCard';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

interface PropertiesPageProps {
  searchParams: {
    keyword?: string;
    tradeType?: string;
    propertyType?: string;
  };
}

async function getProperties(searchParams: PropertiesPageProps['searchParams']) {
  const { keyword, tradeType, propertyType } = searchParams;

  const where: Prisma.PropertyWhereInput = {};

  if (keyword) {
    where.OR = [
      { title: { contains: keyword, mode: 'insensitive' } },
      { address: { contains: keyword, mode: 'insensitive' } },
      { description: { contains: keyword, mode: 'insensitive' } },
    ];
  }

  if (tradeType) {
    where.tradeType = tradeType;
  }

  if (propertyType) {
    where.propertyType = propertyType;
  }

  const properties = await prisma.property.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
  });
  return properties;
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const properties = await getProperties(searchParams);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">전체 매물</h1>

      {/* Search and Filter Bar */}
      <form method="GET" className="mb-8 p-4 rounded-lg bg-gray-100 border">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <input
            type="text"
            name="keyword"
            defaultValue={searchParams.keyword || ''}
            placeholder="키워드 (지역, 단지명...)"
            className="w-full px-4 py-2 border rounded-md col-span-1 md:col-span-3 lg:col-span-2"
          />
          <select name="tradeType" defaultValue={searchParams.tradeType || ''} className="w-full px-4 py-2 border rounded-md">
            <option value="">거래 종류 (전체)</option>
            <option value="월세">월세</option>
            <option value="전세">전세</option>
            <option value="매매">매매</option>
          </select>
          <select name="propertyType" defaultValue={searchParams.propertyType || ''} className="w-full px-4 py-2 border rounded-md">
            <option value="">매물 종류 (전체)</option>
            <option value="아파트">아파트</option>
            <option value="오피스텔">오피스텔</option>
            <option value="빌라">빌라</option>
          </select>
        </div>
        <div className="mt-4 flex justify-end">
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            검색
          </button>
        </div>
      </form>

      {/* Property List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {properties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">검색 결과에 맞는 매물이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
