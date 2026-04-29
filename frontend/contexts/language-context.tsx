'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { vi } from '@/locales/vi';
import { en } from '@/locales/en';

type Language = 'vi' | 'en';
type Translations = typeof vi;

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('vi');
    const [translations, setTranslations] = useState<Translations>(vi);

    useEffect(() => {
        const savedLang = localStorage.getItem('language') as Language;
        if (savedLang && (savedLang === 'vi' || savedLang === 'en')) {
            setLanguage(savedLang);
            setTranslations(savedLang === 'vi' ? vi : en);
        }
    }, []);

    const changeLanguage = (lang: Language) => {
        setLanguage(lang);
        setTranslations(lang === 'vi' ? vi : en);
        localStorage.setItem('language', lang);
    };

    const t = (key: string): string => {
        const keys = key.split('.');
        let value: any = translations;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k as keyof typeof value];
            } else {
                return key; // Return key if not found
            }
        }

        return typeof value === 'string' ? value : key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
