import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { transitionCase } from '../const';
import { useDatePickerHelper } from '../helper';
import { useDatePickerStore } from '../store';
import type { CalendarProps, DateCellType, DateStateValueType, TransitionCase } from '../types';
import { CSSTransition } from 'react-transition-group';

const head: string[] = ['일', '월', '화', '수', '목', '금', '토'];

const CalendarBase = ({
  value = '',
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

  const calendarRef = useRef<HTMLDivElement>(null);

  const caseStartEnd: string = end ? 'end' : 'start';
  const before: DateStateValueType = beforeState[caseStartEnd];
  const state: DateStateValueType = dateState[caseStartEnd];

  const [isShow, setIsShow] = useState<boolean>(true);
  const [focusedDateIndex, setFocusedDateIndex] = useState<{ row: number; col: number } | null>();

  const [transitionName, setTransitionName] = useState<TransitionCase>(transitionCase.down);

  // transition을 위한 별도 상태 변수
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

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
    state.year,
    state.month,
    state,
    curYear,
    curMonth,
    curDay,
    selectedDate,
    startDate,
    endDate,
    range,
    separator,
    helper,
  ]);

  // 달력 데이터 메모이제이션
  const dateRender = useMemo<DateCellType[][]>(() => {
    return generateCalendarData();
  }, [generateCalendarData]);

  // 날짜 선택 처리
  const selectedDay = (tr: number, td: number, e?: React.MouseEvent): void => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const { type, day } = dateRender[tr][td];

    if (['current', 'today', 'date-range'].includes(type)) {
      const date: string = helper.getDateString(state.year, state.month, day, separator);
      setSelected(caseStartEnd, date);

      if (end) {
        // 종료일 선택 시 시작일이 없어도 선택 가능
        setEndDate(selectedDate[caseStartEnd]);
      } else {
        setStartDate(selectedDate[caseStartEnd]);
      }

      // 범위 선택 모드에서는 날짜 선택 시 창을 닫지 않음
      // 단일 날짜 선택 모드에서만 창이 닫힘
      updateDate(end);
    }
  };

  // 키보드 네비게이션
  const handleKeydown = (
    event: React.KeyboardEvent<HTMLLIElement>,
    row: number,
    col: number,
  ): void => {
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
  };

  // 포커스 설정
  const setFocus = (row: number, col: number): void => {
    setFocusedDateIndex({ row, col });
  };

  // 날짜 셀의 ARIA 라벨 생성
  const getAriaLabel = (cell: DateCellType): string => {
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
  };

  // 날짜 셀의 선택 가능 여부 확인
  const isSelectable = (type: string): boolean => {
    return ['current', 'today', 'date-range'].includes(type);
  };

  // 날짜 셀의 포커스 가능 여부 확인
  const isFocusable = (type: string): boolean => {
    return !['beforeMonth', 'afterMonth', 'disabled'].includes(type);
  };

  useEffect(() => {
    const date = end ? endDate : startDate;

    if (date) {
      setSelected(caseStartEnd, date);
    } else {
      setSelected(caseStartEnd, '');
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (state.year > before.year) {
      setTransitionName(transitionCase.down);
    } else {
      setTransitionName(transitionCase.up);
    }

    // transition 효과를 위해 잠시 숨기고 다시 보이기
    setIsTransitioning(true);
    setIsShow(false);
  }, [state.year]);

  useEffect(() => {
    if (state.month > before.month) {
      setTransitionName(transitionCase.left);
    } else {
      setTransitionName(transitionCase.right);
    }

    // transition 효과를 위해 잠시 숨기고 다시 보이기
    setIsTransitioning(true);
    setIsShow(false);
  }, [state.month]);

  const resetTransition = (): void => {
    setTimeout(() => {
      setIsShow(true);
      setIsTransitioning(false);

      // 포커스 초기화
      setTimeout(() => {
        setFocusedDateIndex(null);
      });
    }, 20);
  };

  // const resetSelected = (): void => {
  //   setSelected(caseStartEnd, '');
  // };

  const dayClassName = (type: string, i: number, j: number): string => {
    const classes = [type];

    if (j === 0) classes.push('sun');
    if (j === 6) classes.push('sat');
    if (focusedDateIndex?.row === i && focusedDateIndex?.col === j) classes.push('focused');

    return classes.join(' ');
  };

  return (
    <div
      className="select-calendar-wrap"
      role="grid"
      aria-label={end ? '종료일 달력' : '시작일 달력'}
    >
      <CSSTransition
        in={isShow}
        timeout={200}
        classNames={transitionName}
        unmountOnExit
        nodeRef={calendarRef}
        onExited={resetTransition}
      >
        <div ref={calendarRef} className="select-calendar">
          <ul className="header" role="row">
            {head.map((name, i) => (
              <li
                key={`start-head-${name}`}
                className={`${i === 0 ? 'sun' : ''} ${i === 6 ? 'sat' : ''}`}
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
        </div>
      </CSSTransition>
    </div>
  );
};

CalendarBase.displayName = 'Calendar';

export const Calendar = React.memo(CalendarBase);
