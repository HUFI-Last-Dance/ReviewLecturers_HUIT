
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start adding default degree...');

    const degreeData = { code: 'GV', name: 'Giảng viên', order: 0 };

    const existing = await prisma.academicDegree.findUnique({
        where: { code: degreeData.code },
    });

    if (!existing) {
        await prisma.academicDegree.create({ data: degreeData });
        console.log(`✅ Created degree: ${degreeData.code} - ${degreeData.name}`);
    } else {
        console.log(`⏭️  Degree already exists: ${degreeData.code}`);
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
