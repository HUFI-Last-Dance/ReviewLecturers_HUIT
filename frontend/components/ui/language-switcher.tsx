'use client';

import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 px-0 border border-slate-200">
                    <span className="font-bold text-xs">{language === 'vi' ? 'VN' : 'EN'}</span>
                    <span className="sr-only">Toggle language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('vi')} className={language === 'vi' ? 'bg-slate-100' : ''}>
                    🇻🇳 Tiếng Việt
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-slate-100' : ''}>
                    🇺🇸 English
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
