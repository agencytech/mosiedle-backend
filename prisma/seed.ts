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
  console.log({ bartek });
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
