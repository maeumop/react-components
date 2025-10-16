import { create } from 'zustand';
import type { DatePickerStore, DropdownStateType } from './types';

/**
 * 기간 선택 달력에서 사용되는 Zustand store
 */
export const useDatePickerStore = create<DatePickerStore>((set, get) => {
  const date: Date = new Date();

  return {
    // State
    startDate: '',
    endDate: '',
    curYear: date.getFullYear(),
    curMonth: date.getMonth(),
    curDay: date.getDate(),
    dateState: {
      start: {
        year: date.getFullYear(),
        month: date.getMonth(),
      },
      end: {
        year: date.getFullYear(),
        month: date.getMonth(),
      },
    },
    beforeState: {
      start: {
        year: date.getFullYear(),
        month: date.getMonth(),
      },
      end: {
        year: date.getFullYear(),
        month: date.getMonth(),
      },
    },
    selectedDate: {
      start: '',
      end: '',
    },
    dropdownState: {
      startYear: false,
      startMonth: false,
      endYear: false,
      endMonth: false,
    },

    // Actions
    setStartDate: (v: string) => {
      set({ startDate: v });
    },

    setEndDate: (v: string) => {
      set({ endDate: v });
    },

    setDateState: (main: string, sub: string, v: number) => {
      const { dateState, beforeState } = get();

      set({
        beforeState: {
          ...beforeState,
          [main]: {
            ...beforeState[main],
            [sub]: dateState[main][sub],
          },
        },
        dateState: {
          ...dateState,
          [main]: {
            ...dateState[main],
            [sub]: v,
          },
        },
      });
    },

    setSelected: (flag: string, v: string) => {
      set({
        selectedDate: {
          ...get().selectedDate,
          [flag]: v,
        },
      });
    },

    setDropdownState: (flag: 'start' | 'end', type: 'year' | 'month', isOpen: boolean) => {
      const key =
        `${flag}${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof DropdownStateType;

      if (isOpen) {
        set({
          dropdownState: {
            startYear: false,
            startMonth: false,
            endYear: false,
            endMonth: false,
            [key]: true,
          },
        });
      } else {
        set({
          dropdownState: {
            ...get().dropdownState,
            [key]: false,
          },
        });
      }
    },

    closeAllDropdowns: () => {
      set({
        dropdownState: {
          startYear: false,
          startMonth: false,
          endYear: false,
          endMonth: false,
        },
      });
    },

    init: () => {
      const dt: Date = new Date();

      set({
        curYear: dt.getFullYear(),
        curMonth: dt.getMonth() + 1,
        curDay: dt.getDate(),
        dateState: {
          start: {
            year: dt.getFullYear(),
            month: dt.getMonth() + 1,
          },
          end: {
            year: dt.getFullYear(),
            month: dt.getMonth() + 1,
          },
        },
        startDate: '',
        endDate: '',
        dropdownState: {
          startYear: false,
          startMonth: false,
          endYear: false,
          endMonth: false,
        },
      });
    },
  };
});
