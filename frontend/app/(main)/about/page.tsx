'use client';

import { useLanguage } from '@/contexts/language-context';
import { Users, Database, ShieldAlert, GraduationCap } from 'lucide-react';

export default function AboutPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Hero Section */}
            <section className="relative py-20 bg-blue-700 dark:bg-blue-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/huit-banner.png')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        {t('about.title')}
                    </h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        {t('about.subtitle')}
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16 max-w-4xl space-y-12">

                {/* Mission Section */}
                <section className="flex flex-col md:flex-row gap-8 items-start bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
                        <GraduationCap className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                            {t('about.mission_title')}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            {t('about.mission_content')}
                        </p>
                    </div>
                </section>

                {/* Origin Section */}
                <section className="flex flex-col md:flex-row gap-8 items-start bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400 shrink-0">
                        <Users className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                            {t('about.origin_title')}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            {t('about.origin_content')}
                        </p>
                    </div>
                </section>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Data Source */}
                    <section className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="mb-4 text-emerald-600 dark:text-emerald-400">
                            <Database className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                            {t('about.data_title')}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            {t('about.data_content')}
                        </p>
                    </section>

                    {/* Disclaimer */}
                    <section className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="mb-4 text-orange-600 dark:text-orange-400">
                            <ShieldAlert className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                            {t('about.disclaimer_title')}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            {t('about.disclaimer_content')}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
