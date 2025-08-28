import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Create a dummy user
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log(`Created/found user: ${user.name}`);

  // 2. Create dummy properties
  const properties = [
    {
      title: '강남역 역세권 신축 오피스텔',
      address: '서울시 강남구 역삼동 123-45',
      latitude: 37.4979, // 강남역 위도
      longitude: 127.0276, // 강남역 경도
      price: 15000, // 만원 단위 (1.5억)
      size: 25.5, // m²
      rooms: 1,
      description: '강남역 도보 5분 거리의 최신축 오피스텔입니다. 풀옵션을 갖추고 있으며, 보안이 철저합니다.',
      options: ['에어컨', '세탁기', '냉장고', '인덕션'],
      propertyType: '오피스텔',
      tradeType: '전세',
      images: ['/images/placeholder-1.jpg', '/images/placeholder-2.jpg'],
      videos: [],
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      ownerId: user.id,
    },
    {
      title: '홍대입구역 인근 넓은 투룸 빌라',
      address: '서울시 마포구 서교동 678-90',
      latitude: 37.5569, // 홍대입구역 위도
      longitude: 126.9239, // 홍대입구역 경도
      price: 28000, // 2.8억
      size: 55.0,
      rooms: 2,
      description: '홍대 상권과 가까우면서도 조용한 주택가에 위치한 빌라입니다. 리모델링하여 내부가 깔끔합니다.',
      options: ['에어컨', '세탁기', '가스레인지', '신발장'],
      propertyType: '빌라',
      tradeType: '매매',
      images: ['/images/placeholder-3.jpg', '/images/placeholder-4.jpg'],
      videos: [],
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      ownerId: user.id,
    },
    {
      title: '판교 테크노밸리 인접 3룸 아파트',
      address: '경기도 성남시 분당구 삼평동 111-22',
      latitude: 37.402, // 판교역 위도
      longitude: 127.1087, // 판교역 경도
      price: 1000, // 보증금 1000만원
      size: 84.0,
      rooms: 3,
      description: '판교 테크노밸리로 출퇴근하기 좋은 위치의 아파트입니다. 월세 200만원 조건입니다.',
      options: ['시스템에어컨', '붙박이장', '오븐', '식기세척기'],
      propertyType: '아파트',
      tradeType: '월세',
      images: ['/images/placeholder-5.jpg'],
      videos: [],
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      ownerId: user.id,
    },
  ];

  for (const prop of properties) {
    const result = await prisma.property.create({
      data: prop,
    });
    console.log(`Created property: ${result.title}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
