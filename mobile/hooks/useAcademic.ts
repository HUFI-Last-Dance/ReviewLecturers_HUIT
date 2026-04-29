import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { academicService } from '@/services/academic.service';

// Hook lấy danh sách giảng viên
export function useLecturers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    degreeCode?: string;
    sort?: string;
}) {
    return useQuery({
        queryKey: ['lecturers', params],
        queryFn: () => academicService.getLecturers(params),
        staleTime: 1000 * 60 * 5, // 5 phút
    });
}

// Hook lấy chi tiết giảng viên
export function useLecturer(id: string) {
    return useQuery({
        queryKey: ['lecturer', id],
        queryFn: () => academicService.getLecturerById(id),
        enabled: !!id,
    });
}

// Hook lấy chi tiết assignment
export function useAssignment(id: string) {
    return useQuery({
        queryKey: ['assignment', id],
        queryFn: () => academicService.getAssignmentById(id),
        enabled: !!id,
    });
}

// Hook vote giảng viên
export function useVoteLecturer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, voteType }: { id: string; voteType: 'UPVOTE' | 'DOWNVOTE' }) =>
            academicService.voteLecturer(id, voteType),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['lecturer', id] });
            queryClient.invalidateQueries({ queryKey: ['lecturers'] });
        },
    });
}

// Hook bookmark
export function useToggleBookmark() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => academicService.toggleBookmark(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lecturers'] });
            queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
        },
    });
}

// Hook lấy bookmarks
export function useBookmarks(params?: { page?: number; limit?: number }) {
    return useQuery({
        queryKey: ['bookmarks', params],
        queryFn: () => academicService.getMyBookmarks(params),
    });
}
