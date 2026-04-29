
'use client';

import { useComparison } from '@/contexts/comparison-context';
import { Button } from '@/components/ui/button';
import { X, ArrowRightLeft } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export function ComparisonBar() {
    const { selectedLecturers, removeFromCompare, clearComparison } = useComparison();

    if (selectedLecturers.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-full px-6 py-3 flex items-center gap-6"
            >
                <div className="flex items-center gap-4 border-r border-slate-200 dark:border-slate-700 pr-6 mr-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        So sánh ({selectedLecturers.length}):
                    </span>
                    <div className="flex -space-x-3 overflow-x-auto max-w-[200px] py-1 px-1 scrollbar-hide mask-linear-fade">
                        {selectedLecturers.map(lecturer => (
                            <div key={lecturer.id} className="relative group shrink-0">
                                <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs uppercase shadow-sm" title={lecturer.fullName}>
                                    {lecturer.fullName.charAt(0)}
                                </div>
                                <button
                                    onClick={() => removeFromCompare(lecturer.id)}
                                    className="absolute -top-1 -right-1 z-10 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                >
                                    <X size={10} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <Button variant="ghost" size="sm" onClick={clearComparison} className="text-slate-500 hover:text-red-500">
                        Hủy
                    </Button>
                    <Link
                        href={`/comparison?ids=${selectedLecturers.map(l => l.id).join(',')}`}
                        className={`inline-flex items-center justify-center gap-2 rounded-full px-6 h-9 text-sm font-medium transition-colors ${selectedLecturers.length < 2
                            ? "bg-slate-300 text-slate-500 cursor-not-allowed pointer-events-none"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                            }`}
                        aria-disabled={selectedLecturers.length < 2}
                    >
                        So sánh ngay <ArrowRightLeft size={16} />
                    </Link>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
