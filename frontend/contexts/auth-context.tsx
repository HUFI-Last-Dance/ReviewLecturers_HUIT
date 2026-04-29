'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/auth';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    updateUser: (user: User) => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check local storage on mount
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error('Failed to parse user', e);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = (user: User, token: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    const updateUser = (newUser: User) => {
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
    }

    const refreshUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                updateUser(data.data);
            }
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser, refreshUser }}>
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
