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

  console.log({ bartek, gustaw, firstCommunity });
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
