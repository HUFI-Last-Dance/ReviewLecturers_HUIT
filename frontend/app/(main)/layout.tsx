import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <Header />

            <main className="flex-1 pt-16 pb-12 w-full">
                {children}
            </main>

            <Footer />
        </div>
    );
}
