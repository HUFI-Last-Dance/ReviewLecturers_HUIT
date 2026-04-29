
import { PrismaClient } from '@prisma/client';

// Simple Vietnamese diacritics removal (copied from utils)
function removeVietnameseDiacritics(str: string): string {
    if (!str) return '';
    const diacriticsMap: { [key: string]: string } = {
        'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
        'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
        'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
        'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
        'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
        'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
        'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
        'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
        'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
        'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
        'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
        'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
        'đ': 'd',
        'À': 'A', 'Á': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
        'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
        'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
        'È': 'E', 'É': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
        'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
        'Ì': 'I', 'Í': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
        'Ò': 'O', 'Ó': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
        'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
        'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
        'Ù': 'U', 'Ú': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
        'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
        'Ỳ': 'Y', 'Ý': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y',
        'Đ': 'D',
    };
    return str.split('').map(char => diacriticsMap[char] || char).join('');
}

const prisma = new PrismaClient();

async function main() {
    console.log('Starting backfill...');

    const lecturers = await prisma.lecturer.findMany({
        include: {
            teachingAssignments: {
                include: {
                    reviews: {
                        select: {
                            upvoteCount: true,
                            downvoteCount: true,
                            _count: {
                                select: {
                                    replies: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    console.log(`Found ${lecturers.length} lecturers to process.`);
    let updatedCount = 0;

    for (const lecturer of lecturers) {
        const cleanName = removeVietnameseDiacritics(lecturer.fullName.toLowerCase());

        let reviewsCount = 0;
        let totalReviewVotes = 0;

        lecturer.teachingAssignments.forEach(ta => {
            ta.reviews.forEach(review => {
                reviewsCount += 1 + (review._count?.replies || 0);
                totalReviewVotes += review.upvoteCount + review.downvoteCount;
            });
        });

        const lecturerVotes = (lecturer.upvoteCount || 0) + (lecturer.downvoteCount || 0);
        const engagementScore = (lecturerVotes * 2) + totalReviewVotes + reviewsCount;

        await prisma.lecturer.update({
            where: { id: lecturer.id },
            data: {
                cleanName,
                engagementScore,
                totalReviews: reviewsCount,
                totalReviewVotes: totalReviewVotes
            }
        });

        updatedCount++;
        if (updatedCount % 50 === 0) process.stdout.write('.');
    }

    console.log(`\nCompleted backfill for ${updatedCount} lecturers.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
