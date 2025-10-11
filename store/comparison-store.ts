import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { School } from '@/lib/types';

interface ComparisonState {
  schools: School[];
  addSchool: (school: School) => boolean;
  removeSchool: (schoolId: string) => void;
  clearAll: () => void;
  isInComparison: (schoolId: string) => boolean;
  canAddMore: () => boolean;
}

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set, get) => ({
      schools: [],

      addSchool: (school: School) => {
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

      removeSchool: (schoolId: string) => {
        set(state => ({
          schools: state.schools.filter(s => s.id !== schoolId)
        }));
      },

      clearAll: () => {
        set({ schools: [] });
      },

      isInComparison: (schoolId: string) => {
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
