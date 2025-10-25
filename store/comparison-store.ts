import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SchoolWithLocations, SchoolWithCourses } from '@/lib/types';

interface ComparisonState {
  schools: SchoolWithLocations[];
  detailedSchools: SchoolWithCourses[];
  addSchool: (school: SchoolWithLocations) => boolean;
  removeSchool: (schoolId: string) => void;
  clearAll: () => void;
  isInComparison: (schoolId: string) => boolean;
  canAddMore: () => boolean;
  loadSchoolDetails: (schoolId: string) => Promise<void>;
  getSchoolDetails: (schoolId: string) => SchoolWithCourses | undefined;
}

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set, get) => ({
      schools: [],
      detailedSchools: [],

      addSchool: (school: SchoolWithLocations) => {
        const state = get();

        if (state.schools.length >= 3) {
          return false;
        }

        if (state.schools.some(s => s.id === school.id)) {
          return false;
        }

        set({ schools: [...state.schools, school] });
        get().loadSchoolDetails(school.id);
        return true;
      },

      removeSchool: (schoolId: string) => {
        set(state => ({
          schools: state.schools.filter(s => s.id !== schoolId),
          detailedSchools: state.detailedSchools.filter(s => s.id !== schoolId)
        }));
      },

      clearAll: () => {
        set({ schools: [], detailedSchools: [] });
      },

      isInComparison: (schoolId: string) => {
        return get().schools.some(s => s.id === schoolId);
      },

      canAddMore: () => {
        return get().schools.length < 3;
      },

      loadSchoolDetails: async (schoolId: string) => {
        try {
          const response = await fetch(`/api/schools/${schoolId}`);
          if (!response.ok) {
            console.error('Failed to load school details');
            return;
          }
          const data = await response.json();
          const schoolDetails: SchoolWithCourses = data.school;

          set(state => {
            const existing = state.detailedSchools.find(s => s.id === schoolId);
            if (existing) {
              return state;
            }
            return {
              detailedSchools: [...state.detailedSchools, schoolDetails]
            };
          });
        } catch (error) {
          console.error('Error loading school details:', error);
        }
      },

      getSchoolDetails: (schoolId: string) => {
        return get().detailedSchools.find(s => s.id === schoolId);
      },
    }),
    {
      name: 'driving-school-comparison',
    }
  )
);
