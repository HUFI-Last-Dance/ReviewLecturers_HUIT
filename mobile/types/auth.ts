export interface User {
    id: string;
    email: string;
    fullName: string;
    avatar?: string;
    roles: string[];
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    success: boolean;
    data: {
        user: User;
        token: string;
    };
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
    fullName: string;
}
