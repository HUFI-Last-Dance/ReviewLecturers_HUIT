import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/auth.service';
import { User, LoginPayload, RegisterPayload } from '@/types/auth';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const isAuth = await authService.isAuthenticated();
            if (isAuth) {
                const response = await authService.getMe();
                if (response.success) {
                    setUser(response.data);
                }
            }
        } catch (error) {
            console.error('Failed to refresh user:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const login = async (payload: LoginPayload) => {
        const response = await authService.login(payload);
        if (response.success) {
            setUser(response.data.user);
        } else {
            throw new Error('Login failed');
        }
    };

    const register = async (payload: RegisterPayload) => {
        const response = await authService.register(payload);
        if (response.success) {
            setUser(response.data.user);
        } else {
            throw new Error('Registration failed');
        }
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
