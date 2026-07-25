import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const adminUser = await prisma.user.upsert({
        where: { discordId: 'DISCORD_ADMIN_ID' },
        update: {},
        create: {
            discordId: 'DISCORD_ADMIN_ID',
            username: 'AdminUser',
            role: 'ADMIN',
        },
    });

    const testTournament = await prisma.tournament.upsert({
        where: { id: '00000000-0000-0000-0000-000000000001' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000001',
            name: 'Global Spring Tournament - Test Event',
            description: 'A controlled test tournament using single elimination format.',
            game: 'League of Legends',
            status: 'OPEN',
            format: 'SINGLE_ELIMINATION',
            maxTeams: 16,
            organizerId: adminUser.id,
        },
    });

    console.log({ adminUser, testTournament });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
