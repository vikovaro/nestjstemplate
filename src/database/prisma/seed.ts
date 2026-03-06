import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { ERole } from '../../common/enums/role.enum';
const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await argon2.hash('admin');
    await prisma.user.create({
        data: {
            username: 'admin',
            password: hashedPassword,
            email: '1@gmail.com',
            phone: '+71112223344',
            role: ERole.Admin,
        },
    });

    console.log('Seed data created successfully!');
}

main()
    .catch((e) => {
        console.error('Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
