'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';

export function Footer() {
    const { t } = useLanguage();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/huit-logo.jpg"
                                    alt="HUIT Logo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <span className="text-lg font-bold text-blue-800 dark:text-blue-400">HUIT REVIEW</span>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Trường ĐH Công Thương TP.HCM</p>
                            </div>
                        </Link>
                        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-sm">
                            Nền tảng chia sẻ đánh giá giảng viên, môn học dành cho sinh viên trường Đại học Công Thương TP.HCM.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Liên kết nhanh</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 text-sm transition-colors">
                                    {t('nav.home')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/lecturers" className="text-slate-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 text-sm transition-colors">
                                    {t('nav.lecturers')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-slate-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 text-sm transition-colors">
                                    {t('nav.about')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Liên hệ</h3>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                            <li>📍 140 Lê Trọng Tấn, Phường Tây Thạnh, TP.HCM</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-slate-200 dark:border-slate-800 mt-8 pt-6 text-center">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        © {currentYear} {t('footer.tagline')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
