import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BranchWithSchool, BranchWithDetails } from '@/lib/types';

interface ComparisonState {
  schools: BranchWithSchool[];
  detailedBranches: BranchWithDetails[];
  addSchool: (school: BranchWithSchool) => boolean;
  removeSchool: (schoolId: number) => void;
  clearAll: () => void;
  isInComparison: (schoolId: number) => boolean;
  canAddMore: () => boolean;
  loadBranchDetails: (branchId: number) => Promise<void>;
  getBranchDetails: (branchId: number) => BranchWithDetails | undefined;
}

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set, get) => ({
      schools: [],
      detailedBranches: [],

      addSchool: (school: BranchWithSchool) => {
        const state = get();

        if (state.schools.length >= 3) {
          return false;
        }

        if (state.schools.some(s => s.id === school.id)) {
          return false;
        }

        set({ schools: [...state.schools, school] });
        get().loadBranchDetails(school.id);
        return true;
      },

      removeSchool: (schoolId: number) => {
        set(state => ({
          schools: state.schools.filter(s => s.id !== schoolId),
          detailedBranches: state.detailedBranches.filter(b => b.id !== schoolId)
        }));
      },

      clearAll: () => {
        set({ schools: [], detailedBranches: [] });
      },

      isInComparison: (schoolId: number) => {
        return get().schools.some(s => s.id === schoolId);
      },

      canAddMore: () => {
        return get().schools.length < 3;
      },

      loadBranchDetails: async (branchId: number) => {
        try {
          const response = await fetch(`/api/schools/${branchId}`);
          if (!response.ok) {
            console.error('Failed to load branch details');
            return;
          }
          const data = await response.json();
          const branchDetails: BranchWithDetails = data.school;

          set(state => {
            const existing = state.detailedBranches.find(b => b.id === branchId);
            if (existing) {
              return state;
            }
            return {
              detailedBranches: [...state.detailedBranches, branchDetails]
            };
          });
        } catch (error) {
          console.error('Error loading branch details:', error);
        }
      },

      getBranchDetails: (branchId: number) => {
        return get().detailedBranches.find(b => b.id === branchId);
      },
    }),
    {
      name: 'driving-school-comparison',
    }
  )
);
