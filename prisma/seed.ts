import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await Promise.all([
    prisma.patchNotes.create({
      data: {
        language: 'en',
        patch: '1.0',
        changes: ['Added watering history', 'Added app translation'],
      },
    }),
    prisma.patchNotes.create({
      data: {
        language: 'en',
        patch: '1.1',
        changes: [
          'Added importing plants',
          'Added plant reminders',
          'Added images history',
        ],
      },
    }),
    prisma.patchNotes.create({
      data: {
        language: 'en',
        patch: '1.2',
        changes: [
          'Added dark theme',
          'Added push notification reminders',
          'Added taking pictures of plant',
        ],
      },
    }),
  ]);
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
