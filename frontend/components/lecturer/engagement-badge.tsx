'use client';

import { useState } from 'react';
import { Flame } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useLanguage } from '@/contexts/language-context';

interface EngagementBadgeProps {
    score: number;
    className?: string;
}

export function EngagementBadge({ score, className }: EngagementBadgeProps) {
    const [open, setOpen] = useState(false);
    const { t } = useLanguage();

    // Parse tooltip text (Format: "Title: Description")
    const tooltipFull = t('lecturers.hot_tooltip');
    const [title, description] = tooltipFull.split(':');

    const isHot = score > 50;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    className={`p-3 rounded-full border shadow-sm transition-all duration-300 hover:scale-110 focus:outline-hidden ${isHot
                            ? 'bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-900/30 dark:border-orange-800'
                            : 'bg-slate-50 text-slate-300 border-slate-100 dark:bg-slate-800 dark:border-slate-700'
                        } ${className}`}
                    onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => setOpen(false)}
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpen(!open);
                    }}
                >
                    <Flame className={`w-8 h-8 ${isHot ? 'animate-pulse text-orange-600' : 'text-orange-500 opacity-50'}`} />
                </button>
            </PopoverTrigger>
            <PopoverContent
                className="w-64 p-3 bg-slate-900 text-white border-slate-800 shadow-2xl rounded-xl z-50 pointer-events-none"
                side="top"
                align="end"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
            >
                <div className="space-y-1.5">
                    <p className="font-bold text-orange-400 flex items-center gap-1.5 text-xs">
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        {title}
                        <span className="ml-auto bg-slate-800 px-1.5 py-0.5 rounded text-white font-mono text-[10px]">
                            {score}
                        </span>
                    </p>
                    <p className="text-[11px] leading-relaxed text-slate-300">
                        {description}
                    </p>
                </div>
            </PopoverContent>
        </Popover>
    );
}
