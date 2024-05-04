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
    where: { email: 'bartek@paczesny.pl' },
    update: {},
    create: {
      email: 'bartek@paczesny.pl',
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
          email: 'bartek@paczesny.pl',
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

  const announcements = [
    {
      title: 'Witamy w społeczności!',
      text: 'Poznaj swoich sąsiadów i odkryj funkcje tej platformy!',
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
      icon: '📢', // Announcement icon
      expire_at: new Date('2024-05-31T00:00:00Z'),
    },
    {
      title: 'Harmonogram najbliższej konserwacji',
      text: 'W dniu [Data] od [Godzina] do [Godzina] odbędzie się planowana konserwacja. W tym czasie niektóre funkcje mogą być niedostępne.',
      author: {
        connect: {
          email: 'bartek@paczesny.pl',
        },
      },
      importance: 1,
      icon: '🔧', // Wrench icon for maintenance
      expire_at: new Date('2024-05-10T00:00:00Z'),
    },
    {
      title: 'Alert o zaginięciu zwierzęcia!',
      text: 'Z mieszkania 3 zaginął piesek o imieniu TWÓJ STARY. Jeśli masz jakiekolwiek informacje, skontaktuj się z Gustawem Sołdeckim pod numerem telefonu 690 690 690 lub adresem e-mail gugisek@gmail.com.',
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
      importance: 2,
      icon: '🐶', // Dog icon (adjust based on pet type)
      expire_at: new Date('2024-05-15T00:00:00Z'),
    },
    {
      title: 'Impreza sąsiedzka!',
      text: 'Zapraszamy na imprezę sąsiedzką w części wspólnej [Data] o [Godzina]. Przynieś potrawę do podzielenia się i poznaj swoich sąsiadów!',
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
      importance: 1,
      icon: '️🍽️', // Plate and utensils icon
      expire_at: new Date('2024-05-20T00:00:00Z'),
    },
    {
      title: 'Przypomnienie o dostarczeniu paczki',
      text: 'Przy recepcji czeka na odbiór paczka adresowana do [Twoje imię i nazwisko].',
      communities: {
        connect: {
          code: '4321DCBA',
        },
      },
      author: {
        connect: {
          email: 'bartek@paczesny.pl',
        },
      },
      importance: 0,
      icon: '📦', // Package icon
      expire_at: new Date('2024-05-25T00:00:00Z'),
    },
    {
      title: 'Nowy sprzęt na siłowni!',
      text: 'Na siłownię dotarła nowa bieżnia! Przyjdź i ją wypróbuj.',
      communities: {
        connect: {
          code: '4321DCBA',
        },
      },
      author: {
        connect: {
          email: 'bartek@paczesny.pl',
        },
      },
      importance: 0,
      icon: '️🏋️', // Woman athlete icon
      expire_at: new Date('2024-06-01T00:00:00Z'),
    },
    {
      title: 'Ankieta dla mieszkańców - Twoja opinia jest ważna!',
      text: 'Cenimy Twoją opinię! Poświęć kilka minut na wypełnienie naszej ankiety dla mieszkańców i pomóż nam ulepszyć społeczność.',
      communities: {
        connect: {
          code: '4321DCBA',
        },
      },
      author: {
        connect: {
          email: 'bartek@paczesny.pl',
        },
      },
      importance: 1,
      icon: '📊', // Bar chart icon
      expire_at: new Date('2024-05-17T00:00:00Z'),
    },
  ];

  for (const a of announcements) {
    await prisma.announcement.create({
      data: a,
    });
  }

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
