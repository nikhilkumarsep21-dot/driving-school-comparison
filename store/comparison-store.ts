import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BranchWithSchool } from '@/lib/types';

interface ComparisonState {
  schools: BranchWithSchool[];
  addSchool: (school: BranchWithSchool) => boolean;
  removeSchool: (schoolId: number) => void;
  clearAll: () => void;
  isInComparison: (schoolId: number) => boolean;
  canAddMore: () => boolean;
}

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set, get) => ({
      schools: [],

      addSchool: (school: BranchWithSchool) => {
        const state = get();

        if (state.schools.length >= 3) {
          return false;
        }

        if (state.schools.some(s => s.id === school.id)) {
          return false;
        }

        set({ schools: [...state.schools, school] });
        return true;
      },

      removeSchool: (schoolId: number) => {
        set(state => ({
          schools: state.schools.filter(s => s.id !== schoolId)
        }));
      },

      clearAll: () => {
        set({ schools: [] });
      },

      isInComparison: (schoolId: number) => {
        return get().schools.some(s => s.id === schoolId);
      },

      canAddMore: () => {
        return get().schools.length < 3;
      },
    }),
    {
      name: 'driving-school-comparison',
    }
  )
);
