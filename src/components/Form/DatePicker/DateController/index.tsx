import React, { useCallback, useMemo } from 'react';
import type { DateControllerProps } from '../types';
import { Selector } from '../Selector';
import { useDatePickerStore } from '../store';
import {
  KeyboardDoubleArrowLeft as ChevronDoubleLeftIcon,
  KeyboardArrowLeft as ChevronLeftIcon,
  KeyboardArrowRight as ChevronRightIcon,
  KeyboardDoubleArrowRight as ChevronDoubleRightIcon,
} from '@mui/icons-material';
import './style.scss';

const DateControllerBase = (props: DateControllerProps) => {
  const store = useDatePickerStore();
  const { dateState, setDateState } = store;

  // 현재 연도/월 메모이제이션
  const currentYear = useMemo<number>(() => {
    const flag: string = props.end ? 'end' : 'start';
    return dateState[flag].year;
  }, [dateState, props.end]);

  const currentMonth = useMemo<number>(() => {
    const flag: string = props.end ? 'end' : 'start';
    return dateState[flag].month;
  }, [dateState, props.end]);

  // 연도 변경 가능 여부 확인
  const canDecreaseYear = useMemo<boolean>(
    () => currentYear > props.minYear,
    [currentYear, props.minYear],
  );

  const canIncreaseYear = useMemo<boolean>(() => {
    return currentYear < props.maxYear;
  }, [currentYear, props.maxYear]);

  // 월 변경 가능 여부 확인
  const canDecreaseMonth = useMemo<boolean>(() => {
    if (currentMonth > 1) return true;

    return currentYear > props.minYear;
  }, [currentMonth, currentYear, props.minYear]);

  const canIncreaseMonth = useMemo<boolean>(() => {
    if (currentMonth < 12) return true;
    return currentYear < props.maxYear;
  }, [currentMonth, currentYear, props.maxYear]);

  /**
   * 연도 변경
   * @param v
   * @param calc
   */
  const changedYear = useCallback(
    (v: number, calc: boolean = false): void => {
      const flag: string = props.end ? 'end' : 'start';
      let year: number = v;

      if (calc) {
        year = dateState[flag].year + v;

        if (year > props.maxYear) {
          year = props.maxYear;
        } else if (year < props.minYear) {
          year = props.minYear;
        }
      }

      setDateState(flag, 'year', year);
    },
    [dateState, props.end, props.maxYear, props.minYear, setDateState],
  );

  /**
   * 월 변경, 계산 된 내용이 1 미만, 12 초과 일 경우 연도를 새로 계산하여 적용
   * @param v
   * @param calc
   */
  const changedMonth = useCallback(
    (v: number, calc: boolean = false): void => {
      const flag: string = props.end ? 'end' : 'start';
      let month: number = v;

      if (calc) {
        month = dateState[flag].month + v;

        let year: number = dateState[flag].year;

        if (month > 12) {
          month = 1;
          year++;
        } else if (month <= 0) {
          month = 12;
          year--;
        }

        setDateState(flag, 'year', year);
      }

      setDateState(flag, 'month', month);
    },
    [dateState, props.end, setDateState],
  );

  // 키보드 이벤트 처리
  const handleKeydown = useCallback(
    (
      event: React.KeyboardEvent<HTMLButtonElement>,
      action: 'year' | 'month',
      direction: 'prev' | 'next',
    ): void => {
      event.preventDefault();

      if (event.key === 'Enter' || event.key === ' ') {
        if (action === 'year') {
          if (direction === 'prev' && canDecreaseYear) {
            changedYear(-1, true);
          } else if (direction === 'next' && canIncreaseYear) {
            changedYear(1, true);
          }
        } else {
          if (direction === 'prev' && canDecreaseMonth) {
            changedMonth(-1, true);
          } else if (direction === 'next' && canIncreaseMonth) {
            changedMonth(1, true);
          }
        }
      }
    },
    [
      canDecreaseYear,
      canIncreaseYear,
      canDecreaseMonth,
      canIncreaseMonth,
      changedYear,
      changedMonth,
    ],
  );

  // onClick 핸들러들 메모이제이션
  const handleYearPrev = useCallback(() => changedYear(-1, true), [changedYear]);
  const handleYearNext = useCallback(() => changedYear(1, true), [changedYear]);
  const handleMonthPrev = useCallback(() => changedMonth(-1, true), [changedMonth]);
  const handleMonthNext = useCallback(() => changedMonth(1, true), [changedMonth]);

  // onKeyDown 핸들러들 메모이제이션
  const handleKeydownYearPrev = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => handleKeydown(e, 'year', 'prev'),
    [handleKeydown],
  );
  const handleKeydownYearNext = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => handleKeydown(e, 'year', 'next'),
    [handleKeydown],
  );
  const handleKeydownMonthPrev = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => handleKeydown(e, 'month', 'prev'),
    [handleKeydown],
  );
  const handleKeydownMonthNext = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => handleKeydown(e, 'month', 'next'),
    [handleKeydown],
  );

  // className 메모이제이션
  const yearPrevClassName = useMemo(
    () => `control-button year-prev ${!canDecreaseYear ? 'disabled' : ''}`,
    [canDecreaseYear],
  );
  const yearNextClassName = useMemo(
    () => `control-button year-next ${!canIncreaseYear ? 'disabled' : ''}`,
    [canIncreaseYear],
  );
  const monthPrevClassName = useMemo(
    () => `control-button month-prev ${!canDecreaseMonth ? 'disabled' : ''}`,
    [canDecreaseMonth],
  );
  const monthNextClassName = useMemo(
    () => `control-button month-next ${!canIncreaseMonth ? 'disabled' : ''}`,
    [canIncreaseMonth],
  );

  return (
    <div className="select-month">
      <button
        type="button"
        className={yearPrevClassName}
        disabled={!canDecreaseYear}
        onClick={handleYearPrev}
        onKeyDown={handleKeydownYearPrev}
        tabIndex={0}
      >
        <ChevronDoubleLeftIcon />
      </button>

      {/*  월 이전 버튼 */}
      <button
        type="button"
        className={monthPrevClassName}
        disabled={!canDecreaseMonth}
        onClick={handleMonthPrev}
        onKeyDown={handleKeydownMonthPrev}
        tabIndex={0}
      >
        <ChevronLeftIcon />
      </button>

      {/*  연도/월 선택기 */}
      <div className="selector-group">
        <Selector year end={props.end} max={props.maxYear} min={props.minYear} />
        <Selector month end={props.end} />
      </div>

      {/* 월 다음 버튼 */}
      <button
        type="button"
        className={monthNextClassName}
        disabled={!canIncreaseMonth}
        onClick={handleMonthNext}
        onKeyDown={handleKeydownMonthNext}
        tabIndex={0}
      >
        <ChevronRightIcon />
      </button>

      {/* 연도 다음 버튼 */}
      <button
        type="button"
        className={yearNextClassName}
        disabled={!canIncreaseYear}
        onClick={handleYearNext}
        onKeyDown={handleKeydownYearNext}
        tabIndex={0}
      >
        <ChevronDoubleRightIcon />
      </button>
    </div>
  );
};

DateControllerBase.displayName = 'DateController';

export const DateController = React.memo(DateControllerBase);
