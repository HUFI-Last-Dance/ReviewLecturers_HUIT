
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Setting up Database Triggers...');

    // 1. Create Function to remove Vietnamese accents
    // This is a comprehensive PL/pgSQL function
    await prisma.$executeRawUnsafe(`
        CREATE OR REPLACE FUNCTION remove_vietnamese_accents(str text) RETURNS text AS $$
        BEGIN
            RETURN translate(
                lower(str),
                'àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ',
                'aaaaaaaaaaaaaaaaaeeeeeeeeeeediiiiiooooooooooooooooouuuuuuuuuuuyyyyy'
            );
        END;
        $$ LANGUAGE plpgsql IMMUTABLE;
    `);
    console.log('✅ Created unaccent function.');

    // 2. Create Trigger Function
    await prisma.$executeRawUnsafe(`
        CREATE OR REPLACE FUNCTION auto_update_clean_name() RETURNS TRIGGER AS $$
        BEGIN
            NEW.clean_name := remove_vietnamese_accents(NEW.full_name);
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `);
    console.log('✅ Created trigger function.');

    // 3. Create Trigger on Lecturers table
    // We drop it first to ensure idempotency
    await prisma.$executeRawUnsafe(`
        DROP TRIGGER IF EXISTS trigger_update_clean_name ON lecturers;
    `);

    await prisma.$executeRawUnsafe(`
        CREATE TRIGGER trigger_update_clean_name
        BEFORE INSERT OR UPDATE OF full_name ON lecturers
        FOR EACH ROW
        EXECUTE FUNCTION auto_update_clean_name();
    `);
    console.log('✅ Installed trigger on "lecturers" table.');

    console.log('----------------------------------------');
    console.log('DONE! Database will now auto-generate cleanName for any insert/update.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
