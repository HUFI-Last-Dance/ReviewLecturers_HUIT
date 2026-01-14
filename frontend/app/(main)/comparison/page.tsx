
'use client';

import { useSearchParams, useRouter } from 'next/navigation'; // Added useRouter
import { useQuery } from '@tanstack/react-query';
import { academicService } from '@/services/academic.service';
import { LecturerDetailResponse } from '@/types/academic';
import { ArrowLeft, BookOpen, Star, AlertCircle } from 'lucide-react'; // Added icons
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ComparisonPage() {
    const searchParams = useSearchParams();
    const router = useRouter(); // Added router
    const ids = searchParams.get('ids')?.split(',') || [];

    // Redirect if not enough IDs
    if (ids.length < 2) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">Cần chọn ít nhất 2 giảng viên</h2>
                <p className="text-slate-500 mb-6">Vui lòng quay lại danh sách và chọn giảng viên để so sánh.</p>
                <Link href="/lecturers" className="inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 active:scale-95 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 shadow-lg shadow-blue-500/30 border-0 h-10 px-4 py-2">
                    Quay lại danh sách
                </Link>
            </div>
        );
    }

    // Fetch details for all selected lecturers
    // Using simple Promise.all inside queryFn for now.
    // In React Query v5, useQueries hook is better but this is simpler for v4/compatibility.
    const { data: lecturers, isLoading } = useQuery({
        queryKey: ['comparison', ids],
        queryFn: async () => {
            const promises = ids.map(id => academicService.getLecturerById(id));
            const responses = await Promise.all(promises);
            return responses.map(res => res.data);
        },
        enabled: ids.length >= 2
    });

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2].map(i => (
                        <div key={i} className="h-96 bg-slate-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (!lecturers || lecturers.length === 0) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/lecturers" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
                <ArrowLeft size={20} className="mr-2" /> Quay lại danh sách
            </Link>

            <h1 className="text-3xl font-bold mb-8 text-center text-slate-900 dark:text-slate-100">So sánh Giảng viên</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-x-auto pb-8">
                {lecturers.map(lecturer => (
                    <div key={lecturer.id} className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col pt-12 relative overflow-hidden">
                        {/* Decorative Background Blob */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-900/10 pointer-events-none" />

                        {/* Avatar & Name */}
                        <div className="flex flex-col items-center mb-8 relative z-10">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-1 mb-4 shadow-xl">
                                <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-indigo-600 to-purple-600">
                                    {lecturer.fullName.charAt(0)}
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-slate-100 mb-1">{lecturer.fullName}</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">{lecturer.degree?.name || 'Giảng viên'}</p>
                            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{lecturer.staffId}</p>
                        </div>

                        {/* Key Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 text-center border border-green-100 dark:border-green-800">
                                <span className="block text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{lecturer.upvoteCount}</span>
                                <span className="text-xs font-bold uppercase tracking-wider text-green-700 dark:text-green-300">Hài lòng</span>
                            </div>
                            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 text-center border border-red-100 dark:border-red-800">
                                <span className="block text-3xl font-bold text-red-500 dark:text-red-400 mb-1">{lecturer.downvoteCount}</span>
                                <span className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-300">Không hài lòng</span>
                            </div>
                        </div>

                        {/* Detailed Metrics */}
                        <div className="space-y-6 flex-1">
                            {/* Engagement Score */}
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                                <span className="text-slate-600 dark:text-slate-300 font-medium">Điểm tương tác</span>
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                    <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{lecturer.engagementScore || 0}</span>
                                </div>
                            </div>

                            {/* Reviews Count */}
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                                <span className="text-slate-600 dark:text-slate-300 font-medium">Tổng Review</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                        {lecturer.teachingAssignments.reduce((acc, curr) => acc + (curr.reviewsCount || 0), 0)}
                                    </span>
                                    <span className="text-sm text-slate-500">lượt</span>
                                </div>
                            </div>

                            {/* Assignments Count */}
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                                <span className="text-slate-600 dark:text-slate-300 font-medium">Lớp đã dạy</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                        {lecturer.teachingAssignments.length}
                                    </span>
                                    <span className="text-sm text-slate-500">lớp</span>
                                </div>
                            </div>
                        </div>

                        {/* Action */}
                        <div className="mt-8">
                            <div className="mt-8">
                                <Link
                                    href={`/lecturers/${lecturer.id}`}
                                    className="inline-flex w-full items-center justify-center rounded-xl text-lg font-bold shadow-lg shadow-indigo-200 dark:shadow-none bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 py-6"
                                >
                                    Xem chi tiết
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
