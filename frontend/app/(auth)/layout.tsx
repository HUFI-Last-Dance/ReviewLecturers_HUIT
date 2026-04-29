import { Header } from '@/components/layout/header';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full bg-slate-200 dark:bg-slate-950 flex flex-col transition-colors duration-300">
            {/* Navbar */}
            <Header />

            {/* Main Content Area */}
            <main className="flex-1 flex items-center justify-center p-4 pt-20 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-[100px]" />
                    <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-[100px]" />
                </div>

                {/* Form Container */}
                <div className="relative z-10 w-full max-w-md">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-slate-800 dark:bg-slate-900 py-8 transition-colors duration-300">
                <div className="container mx-auto px-4 text-center text-slate-300 dark:text-slate-400 text-sm font-medium">
                    <p>© {new Date().getFullYear()} ReviewLecturers. Built for students, by students.</p>
                </div>
            </footer>
        </div>
    );
}
