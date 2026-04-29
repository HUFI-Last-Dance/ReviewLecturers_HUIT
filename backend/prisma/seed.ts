import prisma from '../src/config/database';
import { hashPassword } from '../src/utils/password';
import logger from '../src/utils/logger';

// ========================================
// 🌱 SEED SCRIPT - ROLES & ADMIN
// ========================================
// Script này tạo:
// - 3 roles: admin, student, lecturer
// - 1 admin account
// - 2 student accounts (để test)
// - 1 lecturer record (chưa verify)
// ========================================

async function main() {
    logger.info('🌱 Starting seed process...');

    // ========================================
    // 1️⃣ SEED ROLES
    // ========================================
    logger.info('Creating roles...');

    const roles = [
        { name: 'admin', description: 'Quản trị viên - Quyền cao nhất' },
        { name: 'student', description: 'Sinh viên - Có thể viết nhận xét' },
        { name: 'lecturer', description: 'Giảng viên - Được xác thực' },
    ];

    for (const roleData of roles) {
        const existingRole = await prisma.role.findUnique({
            where: { name: roleData.name },
        });

        if (!existingRole) {
            await prisma.role.create({ data: roleData });
            logger.success(`✅ Created role: ${roleData.name}`);
        } else {
            logger.info(`⏭️  Role already exists: ${roleData.name}`);
        }
    }

    // ========================================
    // 1.5️⃣ SEED ACADEMIC DEGREES (Học vị)
    // ========================================
    logger.info('Creating academic degrees...');

    const degrees = [
        { code: 'CN', name: 'Cử nhân', order: 1 },
        { code: 'ThS', name: 'Thạc sĩ', order: 2 },
        { code: 'TS', name: 'Tiến sĩ', order: 3 },
        { code: 'PGS', name: 'Phó Giáo sư', order: 4 },
        { code: 'GS', name: 'Giáo sư', order: 5 },
    ];

    for (const degreeData of degrees) {
        const existing = await prisma.academicDegree.findUnique({
            where: { code: degreeData.code },
        });

        if (!existing) {
            await prisma.academicDegree.create({ data: degreeData });
            logger.success(`✅ Created degree: ${degreeData.code} - ${degreeData.name}`);
        } else {
            logger.info(`⏭️  Degree already exists: ${degreeData.code}`);
        }
    }

    // ========================================
    // 2️⃣ SEED ADMIN ACCOUNT
    // ========================================
    logger.info('Creating admin account...');

    const adminEmail = 'admin@reviewlecturers.com';
    const adminPassword = 'admin123'; // ⚠️ CHANGE THIS IN PRODUCTION

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!existingAdmin) {
        const hashedPassword = await hashPassword(adminPassword);

        const admin = await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                fullName: 'Admin System',
                studentId: null,
            },
        });

        // Gán role admin
        const adminRole = await prisma.role.findUnique({
            where: { name: 'admin' },
        });

        if (adminRole) {
            await prisma.userRole.create({
                data: {
                    userId: admin.id,
                    roleId: adminRole.id,
                },
            });
        }

        logger.success(`✅ Created admin account: ${adminEmail}`);
        logger.warn(`⚠️  Password: ${adminPassword} (CHANGE THIS!)`);
    } else {
        logger.info('⏭️  Admin account already exists');
    }

    // ========================================
    // 3️⃣ SEED STUDENT ACCOUNTS
    // ========================================
    logger.info('Creating student accounts...');

    const students = [
        {
            email: 'student1@example.com',
            password: 'student123',
            fullName: 'Nguyễn Văn A',
            studentId: 'SV001',
        },
        {
            email: 'student2@example.com',
            password: 'student123',
            fullName: 'Trần Thị B',
            studentId: 'SV002',
        },
    ];

    const studentRole = await prisma.role.findUnique({
        where: { name: 'student' },
    });

    for (const studentData of students) {
        const existing = await prisma.user.findUnique({
            where: { email: studentData.email },
        });

        if (!existing) {
            const hashedPassword = await hashPassword(studentData.password);

            const student = await prisma.user.create({
                data: {
                    email: studentData.email,
                    password: hashedPassword,
                    fullName: studentData.fullName,
                    studentId: studentData.studentId,
                },
            });

            // Gán role student
            if (studentRole) {
                await prisma.userRole.create({
                    data: {
                        userId: student.id,
                        roleId: studentRole.id,
                    },
                });
            }

            logger.success(`✅ Created student: ${studentData.email}`);
        } else {
            logger.info(`⏭️  Student already exists: ${studentData.email}`);
        }
    }

    // ========================================
    // 4️⃣ SEED LECTURER RECORD
    // ========================================
    logger.info('Creating lecturer record...');

    const lecturerData = {
        fullName: 'TS. Nguyễn Văn C',
        staffId: 'GV001',
        email: 'nguyenvanc@school.edu.vn',
    };

    const existingLecturer = await prisma.lecturer.findUnique({
        where: { staffId: lecturerData.staffId },
    });

    if (!existingLecturer) {
        await prisma.lecturer.create({
            data: lecturerData,
        });
        logger.success(`✅ Created lecturer: ${lecturerData.fullName}`);
    } else {
        logger.info('⏭️  Lecturer record already exists');
    }

    // ========================================
    // 5️⃣ SEED SUBJECTS & ASSIGNMENTS
    // ========================================
    logger.info('Creating subjects & assignments for TS. Nguyễn Văn C...');

    const lecturer = await prisma.lecturer.findUnique({ where: { staffId: 'GV001' } });

    if (lecturer) {
        // Create Term
        let term = await prisma.academicTerm.findFirst({
            where: { code: 'HK1_2324' }
        });

        if (!term) {
            term = await prisma.academicTerm.create({
                data: { code: 'HK1_2324', name: 'Học kỳ 1 - 2023-2024', startDate: new Date(), endDate: new Date() }
            });
        }

        const subjects = [
            { code: 'CNPM', name: 'Công nghệ phần mềm', credits: 4 },
            { code: 'WEB', name: 'Lập trình Web', credits: 3 },
            { code: 'CSDL', name: 'Cơ sở dữ liệu', credits: 4 },
        ];

        for (const sub of subjects) {
            const subject = await prisma.subject.upsert({
                where: { code: sub.code },
                create: sub,
                update: {}
            });

            // Check existing assignment
            const existingAssignment = await prisma.teachingAssignment.findFirst({
                where: {
                    lecturerId: lecturer.id,
                    subjectId: subject.id,
                    termId: term.id
                }
            });

            if (!existingAssignment) {
                await prisma.teachingAssignment.create({
                    data: {
                        lecturerId: lecturer.id,
                        subjectId: subject.id,
                        termId: term.id,
                        classCode: `${sub.code}_01`
                    }
                });
                logger.success(`✅ Assigned ${sub.name} to ${lecturer.fullName}`);
            } else {
                logger.info(`⏭️  Assignment ${sub.code} already exists`);
            }
        }
    }

    // ========================================
    // ✅ DONE
    // ========================================
    logger.success('🎉 Seed completed successfully!');
    logger.info('');
    logger.info('📋 ACCOUNTS CREATED:');
    logger.info(`   Admin:    ${adminEmail} / ${adminPassword}`);
    logger.info(`   Student1: student1@example.com / student123`);
    logger.info(`   Student2: student2@example.com / student123`);
    logger.info('');
    logger.info('📝 NEXT STEPS:');
    logger.info('   1. Login as admin');
    logger.info('   2. Xem danh sách users');
    logger.info('   3. Verify lecturer (liên kết user với lecturer record)');
}

// ========================================
// 🚀 RUN SEED
// ========================================

main()
    .catch((e) => {
        logger.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
