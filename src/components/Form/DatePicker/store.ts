import { reactive, ref } from 'vue';
import type { DatePickerStore, DateStateType, DropdownStateType, SelectedDateType } from './types';

/**
 * 기간 선택 달력에서 사용되는 참조용
 */
export const useDatePickerStore = (): DatePickerStore => {
  const date: Date = new Date();

  const startDate = ref<string>('');
  const endDate = ref<string>('');
  const curYear = ref<number>(date.getFullYear());
  const curMonth = ref<number>(date.getMonth());
  const curDay = ref<number>(date.getDate());

  const dateState = reactive<DateStateType>({
    start: {
      year: date.getFullYear(),
      month: date.getMonth(),
    },
    end: {
      year: date.getFullYear(),
      month: date.getMonth(),
    },
  });

  const beforeState = reactive<DateStateType>({
    start: {
      year: date.getFullYear(),
      month: date.getMonth(),
    },
    end: {
      year: date.getFullYear(),
      month: date.getMonth(),
    },
  });

  const selectedDate = reactive<SelectedDateType>({
    start: '',
    end: '',
  });

  const dropdownState = reactive<DropdownStateType>({
    startYear: false,
    startMonth: false,
    endYear: false,
    endMonth: false,
  });

  /**
   * startDate update
   * @param v
   */
  const setStartDate = (v: string): void => {
    startDate.value = v;
  };

  const setEndDate = (v: string): void => {
    endDate.value = v;
  };

  /**
   * dateState update
   * @param main start | end
   * @param sub year | month
   * @param v
   */
  const setDateState = (main: string, sub: string, v: number): void => {
    beforeState[main][sub] = dateState[main][sub];
    dateState[main][sub] = v;
  };

  /**
   * selectedDate update
   * @param flag start | end
   * @param v
   */
  const setSelected = (flag: string, v: string): void => {
    selectedDate[flag] = v;
  };

  /**
   * 드롭다운 상태 업데이트
   * @param flag start | end
   * @param type year | month
   * @param isOpen 열림/닫힘 상태
   */
  const setDropdownState = (
    flag: 'start' | 'end',
    type: 'year' | 'month',
    isOpen: boolean,
  ): void => {
    const key = `${flag}${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof DropdownStateType;

    // 다른 드롭다운이 열려있으면 닫기
    if (isOpen) {
      dropdownState.startYear = false;
      dropdownState.startMonth = false;
      dropdownState.endYear = false;
      dropdownState.endMonth = false;
      dropdownState[key] = true;
    } else {
      dropdownState[key] = false;
    }
  };

  /**
   * 모든 드롭다운 닫기
   */
  const closeAllDropdowns = (): void => {
    dropdownState.startYear = false;
    dropdownState.startMonth = false;
    dropdownState.endYear = false;
    dropdownState.endMonth = false;
  };

  /**
   * 각종 변수 초기화
   */
  const init = (): void => {
    const dt: Date = new Date();

    curYear.value = dt.getFullYear();
    curMonth.value = dt.getMonth() + 1;
    curDay.value = dt.getDate();

    setDateState('start', 'year', dt.getFullYear());
    setDateState('start', 'month', dt.getMonth() + 1);
    setDateState('end', 'year', dt.getFullYear());
    setDateState('end', 'month', dt.getMonth() + 1);

    setStartDate('');
    setEndDate('');
    closeAllDropdowns();
  };

  return {
    startDate,
    endDate,
    curYear,
    curMonth,
    curDay,
    dateState,
    beforeState,
    selectedDate,
    dropdownState,
    setStartDate,
    setEndDate,
    setDateState,
    setSelected,
    setDropdownState,
    closeAllDropdowns,
    init,
  };
};
