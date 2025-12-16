import { PrismaClient } from '@prisma/client';
// import * as bcrypt from 'bcrypt'; // bcrypt is not available in this package

const prisma = new PrismaClient();

async function main() {
  const password = '$2a$10$abcdefghijklmnopqrstuvwxyz123456'; // Dummy hash

  const users = [
    { username: 'user1', email: 'user1@example.com', name: 'User One', bio: 'First virtual user', location: 'Seoul' },
    { username: 'testuser', email: 'test@example.com', name: 'Test User', bio: 'I like testing', location: 'Lab' },
    { username: 'elonmusk', email: 'elon@x.com', name: 'Elon Musk', bio: 'Mars & Cars', location: 'Texas' },
    { username: 'dev_guru', email: 'dev@code.com', name: 'Developer Guru', bio: 'Coding all day', location: 'Remote' },
  ];

  for (const u of users) {
    const upsertUser = await prisma.user.upsert({
      where: { email: u.email },
      update: {
          username: u.username,
          name: u.name,
          bio: u.bio,
          location: u.location
      } as any,
      create: {
        email: u.email,
        username: u.username,
        name: u.name,
        password,
        bio: u.bio,
        location: u.location,
      } as any,
    });
    console.log(`Upserted user: ${upsertUser.username}`);
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
