'use client';

import React, { createContext, useContext, useState } from 'react';
import { Lecturer } from '@/types/academic';

interface ComparisonContextType {
  selectedLecturers: Lecturer[];
  addToCompare: (lecturer: Lecturer) => void;
  removeFromCompare: (lecturerId: string) => void;
  clearComparison: () => void;
  isInComparison: (lecturerId: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [selectedLecturers, setSelectedLecturers] = useState<Lecturer[]>([]);

  const addToCompare = (lecturer: Lecturer) => {
    if (selectedLecturers.some((l) => l.id === lecturer.id)) return;
    setSelectedLecturers((prev) => [...prev, lecturer]);
  };

  const removeFromCompare = (lecturerId: string) => {
    setSelectedLecturers((prev) => prev.filter((l) => l.id !== lecturerId));
  };

  const clearComparison = () => {
    setSelectedLecturers([]);
  };

  const isInComparison = (lecturerId: string) => {
    return selectedLecturers.some((l) => l.id === lecturerId);
  };

  return (
    <ComparisonContext.Provider
      value={{
        selectedLecturers,
        addToCompare,
        removeFromCompare,
        clearComparison,
        isInComparison,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};
