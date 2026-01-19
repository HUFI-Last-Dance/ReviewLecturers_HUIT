import { Suspense } from 'react';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { academicService } from '@/services/academic.service';
import { LecturerList } from '@/components/lecturer/LecturerList';

export default async function LecturersPage({
    searchParams: searchParamsPromise,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await searchParamsPromise;
    const page = Number(searchParams.page) || 1;
    const search = typeof searchParams.search === 'string' ? searchParams.search : '';
    const degreeCode = typeof searchParams.degreeCode === 'string' ? searchParams.degreeCode : undefined;

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['lecturers', page, search, degreeCode || ''],
        queryFn: () => academicService.getLecturers({
            page,
            limit: 12,
            search,
            degreeCode,
            sort: 'engagement',
        }),
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<div>Loading...</div>}>
                    <LecturerList />
                </Suspense>
            </HydrationBoundary>
        </div>
    );
}
