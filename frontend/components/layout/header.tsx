'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { Button } from '@/components/ui/button';
import { LogOut, User, Menu, Search, ShieldCheck, Bookmark } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
    >
      <div className="relative w-4 h-4">
        <Sun className="absolute w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </div>
      <span>{theme === 'dark' ? 'Chế độ sáng' : 'Chế độ tối'}</span>
    </button>
  );
}

export function Header() {
  const { user, logout, isLoading } = useAuth();
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.lecturers'), href: '/lecturers' },
    { label: t('nav.about'), href: '/about' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-white/20 dark:border-slate-800/20 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          {/* HUIT Logo */}
          <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/huit-logo.jpg" alt="HUIT Logo" className="w-full h-full object-cover" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-bold text-lg leading-none text-blue-800 dark:text-blue-400">
              HUIT REVIEW
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
              TRƯỜNG ĐH CÔNG THƯƠNG TP.HCM
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400',
                isActive(item.href)
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-300',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          <button className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
            <Search className="w-5 h-5" />
          </button>

          {!isLoading ? (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-none">
                      {user.fullName}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {user.roles.includes('admin') ? 'Admin' : 'Student'}
                    </span>
                  </div>

                  {/* Simple Dropdown for Demo */}
                  <div className="relative group">
                    <div
                      className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 cursor-pointer"
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                      <User className="w-5 h-5" />
                    </div>

                    {/* Dropdown Menu */}
                    <div
                      className={cn(
                        'absolute right-0 top-full w-48 pt-2 animate-in fade-in slide-in-from-top-2',
                        isProfileOpen ? 'block' : 'hidden group-hover:block',
                      )}
                    >
                      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 p-1">
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          Hồ sơ cá nhân
                        </Link>

                        <Link
                          href="/profile/bookmarks"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Bookmark className="w-4 h-4" />
                          Giảng viên đã lưu
                        </Link>

                        {user.roles.includes('admin') ? (
                          <Link
                            href="/admin/dashboard"
                            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <ShieldCheck className="w-4 h-4" />
                            Admin Dashboard
                          </Link>
                        ) : null}

                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                        <ThemeToggle />

                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          <LogOut className="w-4 h-4" />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
                    >
                      {t('common.login')}
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      size="sm"
                      className="hidden sm:inline-flex bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                    >
                      {t('auth.register')}
                    </Button>
                  </Link>
                </div>
              )}
            </>
          ) : null}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600 dark:text-slate-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen ? (
        <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-2 shadow-lg">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-3 rounded-lg hover:bg-slate-50 text-sm font-medium text-slate-700"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </header>
  );
}
