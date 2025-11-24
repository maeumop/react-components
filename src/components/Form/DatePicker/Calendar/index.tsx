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
    initial: { opacity: 0, x: '4rem' },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0 },
  },
  right: {
    initial: { opacity: 0, x: '-4rem' },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0 },
  },
  down: {
    initial: { opacity: 0, y: '-4rem' },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
  },
  up: {
    initial: { opacity: 0, y: '4rem' },
    animate: { opacity: 1, y: 0 },
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

  useEffect(() => {
    const date = end ? endDate : startDate;

    if (date) {
      setSelected(caseStartEnd, date);
    } else {
      setSelected(caseStartEnd, '');
    }
  }, [startDate, endDate, end, caseStartEnd, setSelected]);

  // 년, 월 변경시 transition 설정
  useEffect(() => {
    const beforeDate = new Date(before.year, before.month - 1, 1).getTime();
    const stateDate = new Date(state.year, state.month - 1, 1).getTime();

    if (stateDate > beforeDate) {
      setTransitionName(transitionCase.left); // 년, 월 증가: 왼쪽으로
    } else {
      setTransitionName(transitionCase.right); // 년, 월 감소: 오른쪽으로
    }

    // key 변경으로 transition 트리거
    setCalendarKey(prev => prev + 1);
  }, [state.year, state.month, before.year, before.month]);

  const dayClassName = useCallback((type: string, j: number): string => {
    const classes = [type];

    if (j === 0) classes.push('sun');
    if (j === 6) classes.push('sat');

    return classes.join(' ').trim();
  }, []);

  // 헤더 className 메모이제이션
  const getHeaderClassName = useCallback((index: number): string => {
    const classes: string[] = [];
    if (index === 0) classes.push('sun');
    if (index === 6) classes.push('sat');
    return classes.join(' ').trim();
  }, []);

  // 현재 transition variant 가져오기
  const currentVariant = transitionVariants[transitionName];

  return (
    <div className="select-calendar-wrap">
      <AnimatePresence mode="wait" initial={false}>
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
              <li key={`start-head-${name}`} className={getHeaderClassName(i)}>
                {name}
              </li>
            ))}
          </ul>
          {dateRender.map((li, i) => (
            <ul key={`start-tr-${i}`} role="row">
              {li.map((item, j) => (
                <li
                  key={`calendar-${item.type}-${item.day}`}
                  className={dayClassName(item.type, j)}
                  onClick={e => selectedDay(i, j, e)}
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
