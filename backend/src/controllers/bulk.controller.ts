import { Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { sendSuccess, sendCreated } from '../utils/response';
import { AuthenticatedRequest } from '../types/auth.types';
import logger from '../utils/logger';

// ========================================
// 📥 BULK IMPORT APIs (Admin only - For N8N)
// ========================================

/**
 * POST /api/admin/bulk/lecturers
 * Bulk import lecturers từ N8N/Excel
 * 
 * Body: [
 *   { fullName: "...", staffId: "...", email: "...", degreeCode: "TS" },
 *   ...
 * ]
 */
export const bulkImportLecturers = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const lecturers = req.body.data || req.body; // Support both formats

    if (!Array.isArray(lecturers) || lecturers.length === 0) {
        throw new AppError('Data phải là array và không được rỗng', 400);
    }

    const results = {
        total: lecturers.length,
        success: 0,
        count: 0, // For frontend compatibility
        errors: [] as any[],
    };

    for (let i = 0; i < lecturers.length; i++) {
        const lecturer = lecturers[i];

        try {
            // Validate
            if (!lecturer.fullName || !lecturer.staffId) {
                results.errors.push({
                    row: i + 1,
                    data: lecturer,
                    error: 'fullName và staffId là bắt buộc',
                });
                continue;
            }

            // Find degreeId if degreeCode provided
            let degreeId = null;
            if (lecturer.degreeCode) {
                const degree = await prisma.academicDegree.findUnique({
                    where: { code: lecturer.degreeCode },
                });
                if (degree) {
                    degreeId = degree.id;
                }
            }

            // Upsert (insert or update if exists)
            await prisma.lecturer.upsert({
                where: { staffId: lecturer.staffId },
                update: {
                    fullName: lecturer.fullName,
                    email: lecturer.email || null,
                    degreeId: degreeId,
                },
                create: {
                    fullName: lecturer.fullName,
                    staffId: lecturer.staffId,
                    email: lecturer.email || null,
                    degreeId: degreeId,
                },
            });

            results.success++;
        } catch (error: any) {
            results.errors.push({
                row: i + 1,
                data: lecturer,
                error: error.message,
            });
        }
    }

    results.count = results.success; // For frontend compatibility

    logger.success(
        `Bulk import lecturers: ${results.success}/${results.total} thành công`
    );
    sendCreated(res, results, 'Bulk import lecturers hoàn tất');
};

/**
 * POST /api/admin/bulk/subjects
 * Bulk import subjects
 */
export const bulkImportSubjects = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const subjects = req.body.data || req.body;

    if (!Array.isArray(subjects) || subjects.length === 0) {
        throw new AppError('Data phải là array và không được rỗng', 400);
    }

    const results = {
        total: subjects.length,
        success: 0,
        errors: [] as any[],
    };

    for (let i = 0; i < subjects.length; i++) {
        const subject = subjects[i];

        try {
            if (!subject.code || !subject.name) {
                results.errors.push({
                    row: i + 1,
                    data: subject,
                    error: 'code và name là bắt buộc',
                });
                continue;
            }

            await prisma.subject.upsert({
                where: { code: subject.code },
                update: {
                    name: subject.name,
                    credits: subject.credits ? parseInt(subject.credits) : null,
                },
                create: {
                    code: subject.code,
                    name: subject.name,
                    credits: subject.credits ? parseInt(subject.credits) : null,
                },
            });

            results.success++;
        } catch (error: any) {
            results.errors.push({
                row: i + 1,
                data: subject,
                error: error.message,
            });
        }
    }

    logger.success(`Bulk import subjects: ${results.success}/${results.total} thành công`);
    sendCreated(res, results, 'Bulk import subjects hoàn tất');
};

/**
 * POST /api/admin/bulk/terms
 * Bulk import academic terms
 */
export const bulkImportTerms = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const terms = req.body.data || req.body;

    if (!Array.isArray(terms) || terms.length === 0) {
        throw new AppError('Data phải là array và không được rỗng', 400);
    }

    const results = {
        total: terms.length,
        success: 0,
        count: 0,
        errors: [] as any[],
    };

    for (let i = 0; i < terms.length; i++) {
        const term = terms[i];

        try {
            if (!term.code || !term.name) {
                results.errors.push({
                    row: i + 1,
                    data: term,
                    error: 'code và name là bắt buộc',
                });
                continue;
            }

            // Upsert by code
            await prisma.academicTerm.upsert({
                where: { code: term.code },
                update: {
                    name: term.name,
                    startDate: term.startDate ? new Date(term.startDate) : null,
                    endDate: term.endDate ? new Date(term.endDate) : null,
                },
                create: {
                    code: term.code,
                    name: term.name,
                    startDate: term.startDate ? new Date(term.startDate) : null,
                    endDate: term.endDate ? new Date(term.endDate) : null,
                },
            });

            results.success++;
        } catch (error: any) {
            results.errors.push({
                row: i + 1,
                data: term,
                error: error.message,
            });
        }
    }

    results.count = results.success;
    logger.success(`Bulk import terms: ${results.success}/${results.total} thành công`);
    sendCreated(res, results, 'Bulk import terms hoàn tất');
};

/**
 * POST /api/admin/bulk/assignments
 * Bulk import teaching assignments
 * 
 * Body: [
 *   {
 *     lecturerStaffId: "GV001",
 *     subjectCode: "IT001",
 *     termName: "HK1 2024-2025",
 *     classCode: "IT001.M11",
 *     campusName: "Cơ sở 1"
 *   },
 *   ...
 * ]
 */
export const bulkImportAssignments = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const assignments = req.body.data || req.body;

    if (!Array.isArray(assignments) || assignments.length === 0) {
        throw new AppError('Data phải là array và không được rỗng', 400);
    }

    const results = {
        total: assignments.length,
        success: 0,
        errors: [] as any[],
    };

    for (let i = 0; i < assignments.length; i++) {
        const assignment = assignments[i];

        try {
            if (!assignment.lecturerStaffId || !assignment.subjectCode || !assignment.termCode) {
                results.errors.push({
                    row: i + 1,
                    data: assignment,
                    error: 'lecturerStaffId, subjectCode và termCode là bắt buộc',
                });
                continue;
            }

            // Find related records
            const lecturer = await prisma.lecturer.findUnique({
                where: { staffId: assignment.lecturerStaffId },
            });

            if (!lecturer) {
                results.errors.push({
                    row: i + 1,
                    data: assignment,
                    error: `Lecturer not found: ${assignment.lecturerStaffId}`,
                });
                continue;
            }

            const subject = await prisma.subject.findUnique({
                where: { code: assignment.subjectCode },
            });

            if (!subject) {
                results.errors.push({
                    row: i + 1,
                    data: assignment,
                    error: `Subject not found: ${assignment.subjectCode}`,
                });
                continue;
            }

            // Use termCode instead of termName
            const term = await prisma.academicTerm.findUnique({
                where: { code: assignment.termCode },
            });

            if (!term) {
                results.errors.push({
                    row: i + 1,
                    data: assignment,
                    error: `Term not found: ${assignment.termCode}`,
                });
                continue;
            }

            // Find or create campus (optional)
            let campusId = null;
            if (assignment.campusName) {
                const campus = await prisma.campus.findFirst({
                    where: { name: assignment.campusName },
                });

                if (campus) {
                    campusId = campus.id;
                } else {
                    const newCampus = await prisma.campus.create({
                        data: { name: assignment.campusName },
                    });
                    campusId = newCampus.id;
                }
            }

            // Check if assignment exists
            const existing = await prisma.teachingAssignment.findFirst({
                where: {
                    lecturerId: lecturer.id,
                    subjectId: subject.id,
                    termId: term.id,
                    classCode: assignment.classCode || null,
                },
            });

            if (!existing) {
                // Create
                await prisma.teachingAssignment.create({
                    data: {
                        lecturerId: lecturer.id,
                        subjectId: subject.id,
                        termId: term.id,
                        classCode: assignment.classCode || null,
                        campusId,
                    },
                });
            }

            results.success++;
        } catch (error: any) {
            results.errors.push({
                row: i + 1,
                data: assignment,
                error: error.message,
            });
        }
    }

    logger.success(
        `Bulk import assignments: ${results.success}/${results.total} thành công`
    );
    sendCreated(res, results, 'Bulk import assignments hoàn tất');
};
