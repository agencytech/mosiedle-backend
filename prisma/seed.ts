import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const bartek = await prisma.user.upsert({
    where: { email: 'bartek@paczesny.pl' },
    update: {},
    create: {
      email: 'bartek@paczesny.pl',
      fullName: 'Bartek Paczesny',
      password: 'drowssap',
      role: {
        create: {
          name: 'ADMIN',
        },
      },
    },
  });

  const gustaw = await prisma.user.upsert({
    where: { email: 'gugisek@gmail.com' },
    update: {},
    create: {
      email: 'gugisek@gmail.com',
      fullName: 'Gustaw Sołdecki',
      password: 'password',
      role: {
        create: {
          name: 'MEMBER',
        },
      },
    },
  });

  const firstCommunity = await prisma.community.upsert({
    where: { code: '1234ABCD' },
    update: {},
    create: {
      code: '1234ABCD',
      name: 'First Community',
      street_name: 'ul. Jagiellońska 12, Warszawa',
      contact_email: 'example@email.com',
      members: {
        connect: {
          email: 'gugisek@gmail.com',
        },
      },
    },
  });

  const secondCommunity = await prisma.community.upsert({
    where: { code: '4321DCBA' },
    update: {},
    create: {
      code: '4321DCBA',
      name: 'Second Community',
      street_name: 'ul. Jagiellońska 13, Warszawa',
      contact_email: 'kutas@kozla.pl',
      members: {
        connect: {
          email: 'bartek@paczesny.pl',
        },
      },
    },
  });

  const announcement = await prisma.announcement.create({
    data: {
      title: 'Hello World',
      text: 'This is a test announcement',
      communities: {
        connect: {
          code: '1234ABCD',
        },
      },
      author: {
        connect: {
          email: 'bartek@paczesny.pl',
        },
      },
      importance: 0,
      icon: '🚀',
      expire_at: new Date('2024-05-01T00:00:00Z'),
    },
  });

  console.log({
    bartek,
    gustaw,
    firstCommunity,
    secondCommunity,
    announcement,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
