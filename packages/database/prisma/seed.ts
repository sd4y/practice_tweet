import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const password = '$2b$10$EpRnTzVlqHNP0.fKb.U9H.microburp1234567890'; // Placeholder hash

  // User 1: Fictional Idol (Replaced Winter)
  const luna = await prisma.user.upsert({
    where: { email: 'luna@star.com' },
    update: {},
    create: {
      email: 'luna@star.com',
      username: 'luna_official',
      name: 'LUNA 🌙',
      password,
      bio: 'Just aiming for the stars! ✨',
      avatar: 'http://127.0.0.1:3001/uploads/idol1.png',
    },
  });

  // User 2: Meme Bot
  const memeBot = await prisma.user.upsert({
    where: { email: 'memes@funny.com' },
    update: {},
    create: {
      email: 'memes@funny.com',
      username: 'daily_memes_v2', // Changed to avoid conflict
      name: 'Daily Coding Memes',
      password,
      bio: 'Posting funny coding memes daily 🤖',
      avatar: '',
    },
  });

  // User 3: Aesthetic Vibes
  const skyLover = await prisma.user.upsert({
    where: { email: 'sky@vibes.com' },
    update: {},
    create: {
      email: 'sky@vibes.com',
      username: 'sky_aesthetic_v2', // Changed to avoid conflict
      name: 'Sky & Scenery',
      password,
      bio: 'Capturing beautiful moments 🌅',
      avatar: '',
    },
  });

  // User 4: AI Influencer
  const aiInfluencer = await prisma.user.upsert({
    where: { email: 'nova@ai.com' },
    update: {},
    create: {
      email: 'nova@ai.com',
      username: 'nova_ai',
      name: 'NOVA [AI]',
      password,
      bio: 'Digital Dreams & Cyber Reality 🌐',
      avatar: 'http://127.0.0.1:3001/uploads/ai_influencer1.png',
    },
  });

  // User 5: Daily Life (Ordinary & Pretty)
  const dailyLife = await prisma.user.upsert({
    where: { email: 'sujin@daily.com' },
    update: {},
    create: {
      email: 'sujin@daily.com',
      username: 'sujin_daily',
      name: 'Sujin Kim',
      password,
      bio: 'Coffee, Books, and cozy vibes ☕️📖',
      avatar: 'http://127.0.0.1:3001/uploads/daily1.png',
    },
  });

  // User 6: Hana & Friends (New Photo Booth Persona)
  const hanaFriends = await prisma.user.upsert({
    where: { email: 'hana@besties.com' },
    update: {},
    create: {
      email: 'hana@besties.com',
      username: 'hana_besties',
      name: 'Hana & Friends 💖',
      password,
      bio: 'Memories with my favorites ✨ Life 4 Cuts collector 📸',
      avatar: 'http://127.0.0.1:3001/uploads/hana_photobooth.png',
    },
  });

  console.log({ luna, memeBot, skyLover, aiInfluencer, dailyLife, hanaFriends });

  // Tweets

  // User 7: Pixie (New Ponytail Persona)
  const pixie = await prisma.user.upsert({
    where: { email: 'pixie@style.com' },
    update: {},
    create: {
      email: 'pixie@style.com',
      username: 'pixie_official',
      name: 'Pixie ✨',
      password,
      bio: 'Daily hairstyles & OOTD 🎀 Ponytail lover',
      avatar: 'http://127.0.0.1:3001/uploads/pixie_cafe.png',
    },
  });

  console.log({ luna, memeBot, skyLover, aiInfluencer, dailyLife, hanaFriends, pixie });

  // Tweets

  /* (Previous tweets commented out) */

  // Pixie's Ponytail Collection.zip

  // 1. Cafe
  try {
    console.log('Creating Pixie Tweet 1...');
    await prisma.tweet.create({
      data: {
        content: 'Pixie\'s Ponytail Collection.zip 📂 1. Cafe Vibe ☕️ Cozy afternoon.',
        image: 'http://127.0.0.1:3001/uploads/pixie_cafe.png',
        authorId: pixie.id,
      },
    });
    console.log('Pixie Tweet 1 created.');
  } catch (e: any) {
    console.error('Failed to create Pixie Tweet 1:', e.code, e.meta, e.message);
  }

  // 2. Backstage
  try {
    console.log('Creating Pixie Tweet 2...');
    await prisma.tweet.create({
      data: {
        content: 'Pixie\'s Ponytail Collection.zip 📂 2. Backstage Prep 💄 Moments before stage.',
        image: 'http://127.0.0.1:3001/uploads/pixie_backstage.png',
        authorId: pixie.id,
      },
    });
    console.log('Pixie Tweet 2 created.');
  } catch (e: any) {
    console.error('Failed to create Pixie Tweet 2:', e.code, e.meta, e.message);
  }

  // 3. Car
  try {
    console.log('Creating Pixie Tweet 3...');
    await prisma.tweet.create({
      data: {
        content: 'Pixie\'s Ponytail Collection.zip 📂 3. On the way 🚗 Chasing sunsets.',
        image: 'http://127.0.0.1:3001/uploads/pixie_car.png',
        authorId: pixie.id,
      },
    });
    console.log('Pixie Tweet 3 created.');
  } catch (e: any) {
    console.error('Failed to create Pixie Tweet 3:', e.code, e.meta, e.message);
  }
  try {
    console.log('Creating Ponytail Tweet...');
    await prisma.tweet.create({
      data: {
        content: 'Morning practice vibe 🔥 Putting my hair up and getting ready to work! 💪 #practice #kpop #idol',
        image: 'http://127.0.0.1:3001/uploads/idol_ponytail_v2.png',
        authorId: luna.id,
      },
    });
    console.log('Ponytail Tweet created.');
  } catch (e: any) {
    console.error('Failed to create Ponytail Tweet:', e.code, e.meta, e.message);
  }

  // Hana's Group Tweet (New Persona)
  try {
    console.log('Creating Hana Group Tweet...');
    await prisma.tweet.create({
      data: {
        content: 'Another collection for our wall! 📸💖 The pastel outfits were so cute today! Love you girls! 😘 #besties #life4cuts',
        image: 'http://127.0.0.1:3001/uploads/hana_photobooth.png',
        authorId: hanaFriends.id,
      },
    });
    console.log('Hana Group Tweet created.');
  } catch (e: any) {
    console.error('Failed to create Hana Group Tweet:', e.code, e.meta, e.message);
  }

  // Sujin's Travel Tweet (Existing)
  try {
    console.log('Creating Travel Tweet...');
    await prisma.tweet.create({
      data: {
        content: 'Take me back to this moment. 🇮🇹✨ Missing the gelato and the sun. 🍦☀️ #travel #throwback',
        image: 'http://127.0.0.1:3001/uploads/travel_gf.png',
        authorId: dailyLife.id,
      },
    });
    console.log('Travel Tweet created.');
  } catch (e: any) {
    console.error('Failed to create Travel Tweet:', e.code, e.meta, e.message);
  }

  // Sujin's Travel Tweet
  try {
    console.log('Creating Travel Tweet...');
    await prisma.tweet.create({
      data: {
        content: 'Take me back to this moment. 🇮🇹✨ Missing the gelato and the sun. 🍦☀️ #travel #throwback',
        image: 'http://127.0.0.1:3001/uploads/travel_gf.png',
        authorId: dailyLife.id,
      },
    });
    console.log('Travel Tweet created.');
  } catch (e: any) {
    console.error('Failed to create Travel Tweet:', e.code, e.meta, e.message);
  }

  console.log('Seed data created!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
