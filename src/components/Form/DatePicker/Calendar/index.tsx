import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { transitionCase } from '../const';
import { useDatePickerHelper } from '../helper';
import { useDatePickerStore } from '../store';
import type { CalendarProps, DateCellType, DateStateValueType, TransitionCase } from '../types';
import { AnimatePresence, motion } from 'framer-motion';
import './style.scss';

const head: string[] = ['일', '월', '화', '수', '목', '금', '토'];

// framer-motion transition variants
const transitionVariants = {
  left: {
    initial: { opacity: 0, x: '2rem', scale: 0.98, filter: 'blur(1px)' },
    animate: { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0 },
  },
  right: {
    initial: { opacity: 0, x: '-2rem', scale: 0.98, filter: 'blur(1px)' },
    animate: { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0 },
  },
  down: {
    initial: { opacity: 0, y: '-2rem', scale: 0.98, filter: 'blur(1px)' },
    animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0 },
  },
  up: {
    initial: { opacity: 0, y: '2rem', scale: 0.98, filter: 'blur(1px)' },
    animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0 },
  },
};

const CalendarBase = ({
  end = false,
  separator = '-',
  range = false,
  updateDate,
}: CalendarProps) => {
  const helper = useDatePickerHelper();
  const store = useDatePickerStore();
  const {
    startDate,
    endDate,
    curYear,
    curMonth,
    curDay,
    beforeState,
    dateState,
    selectedDate,
    setStartDate,
    setEndDate,
    setSelected,
  } = store;

  const caseStartEnd: string = end ? 'end' : 'start';
  const before: DateStateValueType = beforeState[caseStartEnd];
  const state: DateStateValueType = dateState[caseStartEnd];

  const [focusedDateIndex, setFocusedDateIndex] = useState<{ row: number; col: number } | null>();
  const [transitionName, setTransitionName] = useState<TransitionCase>(transitionCase.down);
  const [calendarKey, setCalendarKey] = useState<number>(0);

  // 달력 데이터 생성 함수
  const generateCalendarData = useCallback((): DateCellType[][] => {
    const calendarData: DateCellType[][] = [];
    const startWeek: number = new Date(state.year, state.month - 1, 1).getDay();
    const lastDay: number = new Date(state.year, state.month, 0).getDate();

    let day: number = 1;
    let afterDay: number = 1;
    let beforeDay: number = helper.getBeforeDay(state.year, state.month - 1, startWeek);

    // 달력 총 7일 6줄을 생성한다
    for (let i = 0; i < 6; i++) {
      calendarData[i] = [];
    }

    let objData: DateCellType = { day: 0, type: '' };
    const { year, month } = state;

    for (let j = 0; j < 6 * 7; j++) {
      if (j >= startWeek && day <= lastDay) {
        const formatDate = helper.getDateString(year, month, day, separator);

        if (selectedDate[caseStartEnd] === formatDate) {
          objData = { day, type: 'selected' };
        } else if (year === curYear && month === curMonth && day === curDay) {
          objData = { day, type: 'today' };
        } else {
          objData = { day, type: 'current' };
        }

        // 시작 날짜와 끝 날짜 사이에 색상 표시
        if (objData.type !== 'selected' && range) {
          const time = new Date(formatDate).getTime();

          // 시작일과 종료일이 모두 선택된 경우에만 범위 표시
          if (startDate && endDate) {
            const startTime = new Date(startDate).getTime();
            const endTime = new Date(endDate).getTime();
            const minTime = Math.min(startTime, endTime);
            const maxTime = Math.max(startTime, endTime);

            if (time >= minTime && time <= maxTime) {
              objData.type = 'date-range';
            }
          }

          // 종료일 선택 시 시작일이 없어도 선택 가능하도록 제한 완화
          if (end && startDate) {
            const startTime = new Date(startDate).getTime();

            if (time < startTime) {
              objData.type = 'disabled';
            }
          } else if (end === false && endDate) {
            const endTime = new Date(endDate).getTime();

            if (time > endTime) {
              objData.type = 'disabled';
            }
          }
        }

        day++;
      } else if (day > lastDay) {
        objData = { day: afterDay++, type: 'afterMonth' };
      } else if (j < startWeek) {
        objData = { day: beforeDay++, type: 'beforeMonth' };
      }

      const index = Math.floor(j / 7);
      calendarData[index][j % 7] = objData;
    }

    return calendarData;
  }, [
    state,
    curYear,
    curMonth,
    curDay,
    selectedDate,
    startDate,
    endDate,
    range,
    separator,
    caseStartEnd,
    end,
    helper,
  ]);

  // 달력 데이터 메모이제이션
  const dateRender = useMemo<DateCellType[][]>(() => {
    return generateCalendarData();
  }, [generateCalendarData]);

  // 날짜 선택 처리
  const selectedDay = useCallback(
    (tr: number, td: number, e?: React.MouseEvent): void => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      const { type, day } = dateRender[tr][td];

      // 시작일 선택 시 계산된 date를 직접 설정
      if (['current', 'today', 'date-range'].includes(type)) {
        const date: string = helper.getDateString(state.year, state.month, day, separator);
        setSelected(caseStartEnd, date);

        if (end) {
          // 종료일 선택 시 계산된 date를 직접 설정
          setEndDate(date);
        } else {
          setStartDate(date);
        }

        // 범위 선택 모드에서는 날짜 선택 시 창을 닫지 않음
        // 단일 날짜 선택 모드에서만 창이 닫힘
        setTimeout(() => {
          updateDate(end);
        }, 0);
      }
    },
    [
      dateRender,
      helper,
      state.year,
      state.month,
      separator,
      caseStartEnd,
      setSelected,
      end,
      setEndDate,
      setStartDate,
      updateDate,
    ],
  );

  // 키보드 네비게이션
  const handleKeydown = useCallback(
    (event: React.KeyboardEvent<HTMLLIElement>, row: number, col: number): void => {
      const { type } = dateRender[row][col];

      if (['beforeMonth', 'afterMonth', 'disabled'].includes(type)) {
        return;
      }

      let newRow = row;
      let newCol = col;

      switch (event.key) {
        case 'ArrowLeft':
          if (col > 0) {
            newCol = col - 1;
          } else if (row > 0) {
            newRow = row - 1;
            newCol = 6;
          }
          break;
        case 'ArrowRight':
          if (col < 6) {
            newCol = col + 1;
          } else if (row < 5) {
            newRow = row + 1;
            newCol = 0;
          }
          break;
        case 'ArrowUp':
          if (row > 0) {
            newRow = row - 1;
          }
          break;
        case 'ArrowDown':
          if (row < 5) {
            newRow = row + 1;
          }
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          selectedDay(row, col);
          return;
        default:
          return;
      }

      // 유효한 날짜인지 확인
      const newCell = dateRender[newRow]?.[newCol];
      if (newCell && !['beforeMonth', 'afterMonth', 'disabled'].includes(newCell.type)) {
        setFocusedDateIndex({ row: newRow, col: newCol });
      }
    },
    [dateRender, selectedDay],
  );

  // 포커스 설정
  const setFocus = useCallback((row: number, col: number): void => {
    setFocusedDateIndex({ row, col });
  }, []);

  // 날짜 셀의 ARIA 라벨 생성
  const getAriaLabel = useCallback((cell: DateCellType): string => {
    const { day, type } = cell;

    if (type === 'beforeMonth' || type === 'afterMonth') {
      return `${day}일 (다른 달)`;
    }

    if (type === 'disabled') {
      return `${day}일 (선택 불가)`;
    }

    if (type === 'today') {
      return `${day}일 (오늘)`;
    }

    if (type === 'selected') {
      return `${day}일 (선택됨)`;
    }

    if (type === 'date-range') {
      return `${day}일 (범위 내)`;
    }

    return `${day}일`;
  }, []);

  // 날짜 셀의 선택 가능 여부 확인
  const isSelectable = useCallback((type: string): boolean => {
    return ['current', 'today', 'date-range'].includes(type);
  }, []);

  // 날짜 셀의 포커스 가능 여부 확인
  const isFocusable = useCallback((type: string): boolean => {
    return !['beforeMonth', 'afterMonth', 'disabled'].includes(type);
  }, []);

  useEffect(() => {
    const date = end ? endDate : startDate;

    if (date) {
      setSelected(caseStartEnd, date);
    } else {
      setSelected(caseStartEnd, '');
    }
  }, [startDate, endDate, end, caseStartEnd, setSelected]);

  useEffect(() => {
    // 년도와 월 변경을 함께 확인하여 transition 방향 결정
    const yearChanged = state.year !== before.year;
    const monthChanged = state.month !== before.month;

    if (yearChanged && !monthChanged) {
      // 1. 년도만 변경된 경우
      if (state.year > before.year) {
        setTransitionName(transitionCase.down); // 년도 증가: 아래로
      } else {
        setTransitionName(transitionCase.up); // 년도 감소: 위로
      }
    } else if (!yearChanged && monthChanged) {
      // 2. 월만 변경된 경우 (년도는 동일)
      if (state.month > before.month) {
        setTransitionName(transitionCase.left); // 월 증가: 왼쪽으로
      } else {
        setTransitionName(transitionCase.right); // 월 감소: 오른쪽으로
      }
    } else if (yearChanged && monthChanged) {
      // 3. 년도와 월이 모두 변경된 경우 (예: 12월 → 다음해 1월)
      if (state.year > before.year) {
        setTransitionName(transitionCase.down); // 년도 증가: 아래로
      } else {
        setTransitionName(transitionCase.up); // 년도 감소: 위로
      }
    }

    // key 변경으로 transition 트리거
    setCalendarKey(prev => prev + 1);

    // 포커스 초기화
    setTimeout(() => {
      setFocusedDateIndex(null);
    });
  }, [state.year, state.month, before.year, before.month]);

  const dayClassName = useCallback(
    (type: string, i: number, j: number): string => {
      const classes = [type];

      if (j === 0) classes.push('sun');
      if (j === 6) classes.push('sat');
      if (focusedDateIndex?.row === i && focusedDateIndex?.col === j) classes.push('focused');

      return classes.join(' ');
    },
    [focusedDateIndex],
  );

  // 헤더 className 메모이제이션
  const getHeaderClassName = useCallback((index: number): string => {
    const classes: string[] = [];
    if (index === 0) classes.push('sun');
    if (index === 6) classes.push('sat');
    return classes.join(' ');
  }, []);

  // 현재 transition variant 가져오기
  const currentVariant = transitionVariants[transitionName];

  return (
    <div
      className="select-calendar-wrap"
      role="grid"
      aria-label={end ? '종료일 달력' : '시작일 달력'}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={calendarKey}
          className="select-calendar"
          initial={currentVariant.initial}
          animate={currentVariant.animate}
          transition={{
            duration: 0.15,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <ul className="header" role="row">
            {head.map((name, i) => (
              <li
                key={`start-head-${name}`}
                className={getHeaderClassName(i)}
                role="columnheader"
                aria-label={`${name}요일`}
              >
                {name}
              </li>
            ))}
          </ul>
          {dateRender.map((li, i) => (
            <ul key={`start-tr-${i}`} role="row">
              {li.map((item, j) => (
                <li
                  key={`calendar-${item.type}-${item.day}`}
                  className={dayClassName(item.type, i, j)}
                  onClick={e => selectedDay(i, j, e)}
                  onKeyDown={e => handleKeydown(e, i, j)}
                  onFocus={() => setFocus(i, j)}
                  tabIndex={isFocusable(item.type) ? 0 : -1}
                  aria-label={getAriaLabel(item)}
                  aria-selected={item.type === 'selected'}
                  aria-disabled={!isSelectable(item.type)}
                  role="gridcell"
                >
                  {item.day}
                </li>
              ))}
            </ul>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

CalendarBase.displayName = 'Calendar';

export const Calendar = React.memo(CalendarBase);
