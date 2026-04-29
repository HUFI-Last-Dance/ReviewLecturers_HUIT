import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Lecturer } from '@/types/academic';

interface ComparisonContextType {
    selectedLecturers: Lecturer[];
    addLecturer: (lecturer: Lecturer) => void;
    removeLecturer: (id: string) => void;
    clearAll: () => void;
    isSelected: (id: string) => boolean;
    canCompare: boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: ReactNode }) {
    const [selectedLecturers, setSelectedLecturers] = useState<Lecturer[]>([]);

    const addLecturer = (lecturer: Lecturer) => {
        if (!isSelected(lecturer.id)) {
            setSelectedLecturers((prev) => [...prev, lecturer]);
        }
    };

    const removeLecturer = (id: string) => {
        setSelectedLecturers((prev) => prev.filter((l) => l.id !== id));
    };

    const clearAll = () => {
        setSelectedLecturers([]);
    };

    const isSelected = (id: string) => {
        return selectedLecturers.some((l) => l.id === id);
    };

    return (
        <ComparisonContext.Provider
            value={{
                selectedLecturers,
                addLecturer,
                removeLecturer,
                clearAll,
                isSelected,
                canCompare: selectedLecturers.length >= 2,
            }}
        >
            {children}
        </ComparisonContext.Provider>
    );
}

export function useComparison() {
    const context = useContext(ComparisonContext);
    if (context === undefined) {
        throw new Error('useComparison must be used within a ComparisonProvider');
    }
    return context;
}
