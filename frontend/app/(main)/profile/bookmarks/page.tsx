
'use client';

import { useQuery } from '@tanstack/react-query';
import { academicService } from '@/services/academic.service';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { BookmarkButton } from '@/components/lecturer/BookmarkButton';
import { useLanguage } from '@/contexts/language-context';

export default function BookmarksPage() {
    const { t } = useLanguage();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['my-bookmarks'],
        queryFn: () => academicService.getMyBookmarks({ page: 1, limit: 100 }), // Simplified for now
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Giảng viên đã lưu</h1>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 h-48 shadow-sm border border-slate-100 animate-pulse" />
                    ))}
                </div>
            ) : isError ? (
                <p className="text-red-500">Lỗi tải dữ liệu.</p>
            ) : (
                <>
                    {data?.data.lecturers.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-slate-500">Bạn chưa lưu giảng viên nào.</p>
                            <Link href="/lecturers" className="text-indigo-600 hover:underline mt-2 inline-block">
                                Khám phá ngay
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data?.data.lecturers.map((lecturer) => (
                                <Link
                                    href={`/lecturers/${lecturer.id}`}
                                    key={lecturer.id}
                                    className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl border-2 border-white dark:border-slate-700 shadow-sm group-hover:scale-105 transition-transform">
                                            {lecturer.fullName.charAt(0)}
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 px-2 py-1 rounded-full border border-slate-100 dark:border-slate-700">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-green-600 dark:text-green-400 font-bold text-xs">{lecturer.upvoteCount || 0}</span>
                                                    <span className="text-green-500">▲</span>
                                                </div>
                                                <div className="w-[1px] h-3 bg-slate-200 dark:bg-slate-600"></div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-red-500">▼</span>
                                                    <span className="text-red-600 dark:text-red-400 font-bold text-xs">{lecturer.downvoteCount || 0}</span>
                                                </div>
                                            </div>
                                            <BookmarkButton
                                                lecturerId={lecturer.id}
                                                initialIsBookmarked={true}
                                                className="bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-100 dark:border-slate-700"
                                            />
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {lecturer.fullName}
                                    </h3>

                                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-700">
                                        <div className="flex items-center gap-1">
                                            <BookOpen className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                            {lecturer.assignmentsCount || 0} {t('lecturers.classes')}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                                            {lecturer.reviewsCount || 0} {t('lecturers.reviews')}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
