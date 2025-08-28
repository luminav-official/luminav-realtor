import type { Property } from '@prisma/client';
import Link from 'next/link';

// A simple placeholder for an image component
const ImagePlaceholder = () => (
  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
    <span className="text-gray-500">Image</span>
  </div>
);

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <Link href={`/properties/${property.id}`} className="block border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300">
      <ImagePlaceholder />
      <div className="p-4">
        <p className="text-sm text-gray-500">{property.propertyType} | {property.tradeType}</p>
        <h3 className="text-lg font-semibold mt-1 truncate" title={property.title}>
          {property.title}
        </h3>
        <p className="text-gray-600 mt-2 truncate">{property.address}</p>
        <p className="text-xl font-bold text-blue-600 mt-4">
          {property.price.toLocaleString()}만원
        </p>
        <div className="text-sm text-gray-500 mt-4 flex justify-between">
          <span>방 {property.rooms}개</span>
          <span>{property.size}m²</span>
        </div>
      </div>
    </Link>
  );
}
