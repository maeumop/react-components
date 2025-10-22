import { createStore } from 'zustand';
import type { DatePickerStore, DropdownStateType } from '../types';

/**
 * 각 DatePicker 인스턴스마다 독립적인 store를 생성하는 factory 함수
 */
export const createDatePickerStore = () => {
  const date: Date = new Date();

  return createStore<DatePickerStore>((set, get) => ({
    // State
    startDate: '',
    endDate: '',
    curYear: date.getFullYear(),
    curMonth: date.getMonth() + 1, // 1-12 범위로 통일
    curDay: date.getDate(),
    dateState: {
      start: {
        year: date.getFullYear(),
        month: date.getMonth() + 1, // 1-12 범위로 통일
      },
      end: {
        year: date.getFullYear(),
        month: date.getMonth() + 1, // 1-12 범위로 통일
      },
    },
    beforeState: {
      start: {
        year: date.getFullYear(),
        month: date.getMonth() + 1, // 1-12 범위로 통일
      },
      end: {
        year: date.getFullYear(),
        month: date.getMonth() + 1, // 1-12 범위로 통일
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
  }));
};
