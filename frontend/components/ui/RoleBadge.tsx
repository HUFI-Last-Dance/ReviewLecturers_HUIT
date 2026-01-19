'use client';

import { useState } from 'react';
import { GraduationCap, Award, ShieldCheck } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface RoleBadgeProps {
    roles?: string[];
    className?: string;
}

export function RoleBadge({ roles, className }: RoleBadgeProps) {
    const [open, setOpen] = useState(false);

    if (!roles || roles.length === 0) return null;

    const isAdmin = roles.includes('admin');
    const isLecturer = roles.includes('lecturer');
    const isStudent = roles.includes('student');

    const roleInfo = isAdmin
        ? { label: 'Quản trị viên', color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400', icon: ShieldCheck }
        : isLecturer
            ? { label: 'Giảng viên', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400', icon: Award }
            : isStudent
                ? { label: 'Sinh viên', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', icon: GraduationCap }
                : null;

    if (!roleInfo) return null;

    const Icon = roleInfo.icon;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    className={`inline-flex items-center justify-center p-1 rounded-full ${roleInfo.color} cursor-pointer hover:scale-110 transition-transform focus:outline-hidden ${className}`}
                    onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => setOpen(false)}
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpen(!open);
                    }}
                >
                    <Icon className="w-3.5 h-3.5" />
                </button>
            </PopoverTrigger>
            <PopoverContent
                className="w-fit px-3 py-1.5 pointer-events-none"
                side="top"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
            >
                <p className="text-xs font-semibold">{roleInfo.label}</p>
            </PopoverContent>
        </Popover>
    );
}
