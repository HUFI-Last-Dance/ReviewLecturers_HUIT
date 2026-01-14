export interface Lecturer {
    id: string;
    fullName: string;
    staffId?: string;
    email?: string;
    degree?: {
        code: string;
        name: string;
    };
    avatar?: string;
    upvoteCount?: number;
    downvoteCount?: number;
    myVote?: 'UPVOTE' | 'DOWNVOTE' | null;
    assignmentsCount?: number;
    reviewsCount?: number;
    engagementScore?: number;
    _count?: {
        teachingAssignments: number;
        reviews: number;
    };
    isBookmarked?: boolean;
}

export interface Subject {
    id: string;
    code: string;
    name: string;
    credits: number;
}

export interface AcademicTerm {
    id: string;
    name: string;
    year?: string;
    startDate?: string;
    endDate?: string;
}

export interface Campus {
    id: string;
    name: string;
    address?: string;
}

export interface Review {
    id: string;
    content: string;
    isAnonymous: boolean;
    author: { id: string; fullName: string } | null;
    upvoteCount: number;
    downvoteCount: number;
    repliesCount: number;
    createdAt: string;
    userVote?: 'UPVOTE' | 'DOWNVOTE' | null; // From API
    replies?: Reply[];
    feedbackCommunication?: string;
    feedbackKnowledge?: string;
    feedbackExpertise?: string;
    feedbackAttitude?: string;
}

export interface Reply {
    id: string;
    content: string;
    user: { id: string; fullName: string }; // Reply always has user connected or logic
    isAnonymous: boolean;
    upvoteCount: number;
    downvoteCount: number;
    replies?: Reply[]; // Recursively nested
    createdAt: string;
    myVote?: 'UPVOTE' | 'DOWNVOTE' | null;
}

export interface TeachingAssignment {
    id: string;
    lecturerId: string;
    subjectId: string;
    termId: string;
    classCode?: string;
    campus?: Campus;
    lecturer: Lecturer;
    subject: Subject;
    term: AcademicTerm;
    reviewsCount?: number;
}

// Chi tiết Assignment bao gồm Reviews
export interface TeachingAssignmentDetail extends TeachingAssignment {
    reviews: Review[];
}

export interface LecturerListResponse {
    success: boolean;
    data: {
        lecturers: Lecturer[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}

export interface LecturerDetailResponse {
    success: boolean;
    data: Lecturer & {
        teachingAssignments: TeachingAssignment[];
    };
}

export interface AssignmentDetailResponse {
    success: boolean;
    data: TeachingAssignmentDetail;
}
