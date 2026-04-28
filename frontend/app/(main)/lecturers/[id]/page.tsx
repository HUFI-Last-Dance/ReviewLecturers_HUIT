'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { academicService } from '@/services/academic.service';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Calendar, Filter, Flame } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import { LecturerVoteButtons } from '@/components/lecturer/lecturer-vote-buttons'; // Restored import
import { BookmarkButton } from '@/components/lecturer/BookmarkButton'; // Added
import { useComparison } from '@/contexts/comparison-context'; // Added

import { EngagementBadge } from '@/components/lecturer/engagement-badge';

interface Term {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
}

export default function LecturerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { t } = useLanguage();
    const [selectedTermId, setSelectedTermId] = useState<string>('all');
    const { addToCompare, removeFromCompare, isInComparison, selectedLecturers } = useComparison(); // Added hook

    const { data, isLoading, isError } = useQuery({
        queryKey: ['lecturer', id],
        queryFn: () => academicService.getLecturerById(id),
        enabled: !!id,
    });

    // Fetch terms for filter
    const { data: termsData } = useQuery({
        queryKey: ['terms'],
        queryFn: () => academicService.getTerms(),
    });

    const terms: Term[] = termsData?.data || [];

    // Get unique terms from this lecturer's assignments
    const lecturerTerms = useMemo(() => {
        if (!data?.data?.teachingAssignments) return [];
        const termIds = new Set<string>();
        const uniqueTerms: { id: string; name: string }[] = [];

        data.data.teachingAssignments.forEach((assignment: any) => {
            if (!termIds.has(assignment.term.id)) {
                termIds.add(assignment.term.id);
                uniqueTerms.push(assignment.term);
            }
        });

        // Sort by term order from API (already sorted by startDate desc)
        return uniqueTerms.sort((a, b) => {
            const aIndex = terms.findIndex(t => t.id === a.id);
            const bIndex = terms.findIndex(t => t.id === b.id);
            return aIndex - bIndex;
        });
    }, [data?.data?.teachingAssignments, terms]);

    // Filter and sort assignments
    const filteredAssignments = useMemo(() => {
        if (!data?.data?.teachingAssignments) return [];

        let assignments = [...data.data.teachingAssignments];

        // Filter by selected term
        if (selectedTermId !== 'all') {
            assignments = assignments.filter((a: any) => a.term.id === selectedTermId);
        }

        // Sort by term startDate (newest first), then by createdAt
        assignments.sort((a: any, b: any) => {
            const aTermIndex = terms.findIndex(t => t.id === a.term.id);
            const bTermIndex = terms.findIndex(t => t.id === b.term.id);
            if (aTermIndex !== bTermIndex) return aTermIndex - bTermIndex;
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });

        return assignments;
    }, [data?.data?.teachingAssignments, selectedTermId, terms]);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 animate-pulse">
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-8" />
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm h-64 mb-8" />
                <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
            </div>
        );
    }

    if (isError || !data?.data) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-xl font-bold text-red-500">{t('lecturers.not_found')}</h2>
                <Button onClick={() => router.back()} className="mt-4" variant="outline">{t('common.back')}</Button>
            </div>
        );
    }

    const lecturer = data.data;

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <Button
                variant="ghost"
                className="mb-6 pl-0 hover:bg-transparent hover:text-blue-600 dark:hover:text-blue-400 dark:text-slate-300"
                onClick={() => router.back()}
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('lecturers.back_to_list')}
            </Button>

            {/* Profile Header */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-8 items-start relative overflow-visible mb-10 transition-colors duration-300">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-bl-full -z-0 opacity-50 overflow-hidden" />

                {/* Hotness Indicator */}
                <div className="absolute top-4 right-4 z-20">
                    <EngagementBadge score={lecturer.engagementScore || 0} />
                </div>

                <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-4xl shadow-xl shadow-blue-500/20 z-10 shrink-0">
                    {lecturer.fullName.charAt(0)}
                </div>

                <div className="flex-1 z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                            {lecturer.degree?.code || t('lecturers.default_degree')}
                        </span>
                        {lecturer.degree?.name && (
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                ({lecturer.degree.name})
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                        {lecturer.fullName}
                    </h1>
                    {lecturer.staffId && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 font-mono">
                            Mã GV: {lecturer.staffId}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-4 md:gap-8 border-t border-slate-100 dark:border-slate-700 pt-6">
                        <div className="flex items-center gap-3">
                            <LecturerVoteButtons
                                lecturerId={lecturer.id}
                                upvotes={lecturer.upvoteCount || 0}
                                downvotes={lecturer.downvoteCount || 0}
                                myVote={lecturer.myVote}
                            />

                            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2" />

                            <BookmarkButton
                                lecturerId={lecturer.id}
                                initialIsBookmarked={lecturer.isBookmarked}
                                className="h-10 w-10 rounded-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-600 shadow-sm"
                            />

                            <div
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors cursor-pointer ${isInComparison(lecturer.id)
                                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-400"
                                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700"
                                    }`}
                                onClick={() => {
                                    if (isInComparison(lecturer.id)) {
                                        removeFromCompare(lecturer.id);
                                    } else {
                                        if (selectedLecturers.length < 2) {
                                            addToCompare(lecturer);
                                        }
                                    }
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={isInComparison(lecturer.id)}
                                    readOnly
                                    disabled={false}
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 pointer-events-none"
                                />
                                <span className="text-sm font-medium">So sánh</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 dark:text-blue-400">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-bold text-lg text-slate-900 dark:text-slate-100">
                                    {data.data.teachingAssignments.length}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">{t('lecturers.teaching_assignments')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Teaching Assignments Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    {t('lecturers.teaching_history_reviews')}
                </h2>

                {/* Term Filter */}
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                        value={selectedTermId}
                        onChange={(e) => setSelectedTermId(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 cursor-pointer"
                    >
                        <option value="all">Tất cả học kỳ ({data.data.teachingAssignments.length})</option>
                        {lecturerTerms.map((term) => {
                            const count = data.data.teachingAssignments.filter((a: any) => a.term.id === term.id).length;
                            return (
                                <option key={term.id} value={term.id}>
                                    {term.name} ({count})
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredAssignments.map((assignment: any) => (
                    <Link
                        key={assignment.id}
                        href={`/assignments/${assignment.id}`}
                        className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-600 hover:shadow-md transition-all group"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-mono text-sm font-bold bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                                        {assignment.subject.code}
                                    </span>
                                    <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
                                    <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                        {assignment.term.name}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {assignment.subject.name}
                                </h3>
                                {assignment.classCode && (
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('lecturers.class')}: {assignment.classCode}</p>
                                )}
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    {assignment.reviewsCount} nhận xét
                                </span>
                                <span className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-1.5 rounded-lg text-sm font-semibold group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                                    {t('lecturers.view_reviews')}
                                    <ArrowLeft className="w-4 h-4 rotate-180" />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}

                {filteredAssignments.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                        <p className="text-slate-500 dark:text-slate-400">Không có môn học nào trong học kỳ này</p>
                    </div>
                )}
            </div>
        </div>
    );
}
