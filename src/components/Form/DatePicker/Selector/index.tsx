import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { DropdownStateType, SelectorProps } from '../types';
import { useDatePickerStore } from '../store';
import { KeyboardArrowDown as ChevronDownIcon } from '@mui/icons-material';
import { useComponentHelper } from '../../../helper';
import { layerPosition, transitionType } from '../../../const';
import './style.scss';

// 개별 아이템 컴포넌트
const SelectorItem = React.memo<{
  num: number;
  index: number;
  isActive: boolean;
  isFocused: boolean;
  isYear: boolean;
  isShow: boolean;
  onItemClick: (e: React.MouseEvent<HTMLLIElement>, num: number, index: number) => void;
  onItemFocus: (index: number) => void;
}>(({ num, index, isActive, isFocused, isYear, isShow, onItemClick, onItemFocus }) => {
  const className = useMemo(
    () => `${isActive ? 'active' : ''} ${isFocused ? 'focused' : ''}`,
    [isActive, isFocused],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLLIElement>) => onItemClick(e, num, index),
    [onItemClick, num, index],
  );

  const handleFocus = useCallback(() => onItemFocus(index), [onItemFocus, index]);

  return (
    <li
      key={`date-${num}`}
      className={className}
      onClick={handleClick}
      onFocus={handleFocus}
      tabIndex={isShow ? 0 : -1}
    >
      {isYear ? num : num + 1}
    </li>
  );
});

SelectorItem.displayName = 'SelectorItem';

const SelectorBase = ({
  max = 0,
  min = 1900,
  year = false,
  month = false,
  end = false,
}: SelectorProps) => {
  const store = useDatePickerStore();
  const { dateState, setDateState, dropdownState, setDropdownState } = store;

  // 목록
  const itemListRef = useRef<HTMLUListElement>(null);

  const [items, setItems] = useState<number[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const flag: 'start' | 'end' = end ? 'end' : 'start';

  // 현재 드롭다운 상태 계산
  const isShow = useMemo<boolean>(() => {
    const key = `${flag}${year ? 'Year' : 'Month'}` as keyof DropdownStateType;
    return dropdownState[key];
  }, [flag, year, dropdownState]);

  // 필터링된 아이템 메모이제이션
  const filteredItems = useMemo<number[]>(() => {
    if (!searchText) return items;

    const search = searchText.toLowerCase();

    return items.filter(item => item.toString().includes(search));
  }, [searchText, items]);

  // 현재 선택된 값 메모이제이션
  const getDateString = useMemo<string>(() => {
    return year ? dateState[flag].year + '년' : dateState[flag].month + '월';
  }, [flag, year, dateState]);

  const getDate = useMemo<number>(() => {
    return year ? dateState[flag].year : dateState[flag].month - 1;
  }, [flag, year, dateState]);

  // 아이템 초기화 - useMemo로 변경
  const initialItems = useMemo<number[]>(() => {
    if (year) {
      const maxYear = max ? max : new Date().getFullYear();
      const yearItems: number[] = [];

      for (let i = maxYear; i >= min; i--) {
        yearItems.push(i);
      }

      return yearItems;
    } else if (month) {
      return Array.from({ length: 12 }, (_, i) => i);
    }

    return [];
  }, [year, month, max, min]);

  // items 초기화
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  // 드롭다운 표시 상태 감지
  useEffect(() => {
    if (isShow) {
      setSearchText('');
      setFocusedIndex(-1);

      if (itemListRef.current) {
        setTimeout(() => {
          const li = itemListRef.current!.querySelector<HTMLLIElement>('li.active');
          const top: number = li ? li.offsetTop - li.offsetHeight : 0;
          itemListRef.current!.scrollTop = top;
        });
      }
    }
  }, [isShow]);

  /**
   * 선택된 연, 월 적용
   * @param v
   */
  const changedDate = useCallback(
    (v: number) => {
      setDateState(flag, year ? 'year' : 'month', year ? v : v + 1);
      setDropdownState(flag, year ? 'year' : 'month', false);
      setFocusedIndex(-1);
      setSearchText('');
    },
    [flag, year, setDateState, setDropdownState],
  );

  // 클릭 이벤트 처리
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>): void => {
      event.preventDefault();
      event.stopPropagation();
      const currentType = year ? 'year' : 'month';
      setDropdownState(flag, currentType, !isShow);
    },
    [flag, year, isShow, setDropdownState],
  );

  // 포커스된 아이템으로 스크롤
  const scrollToFocused = useCallback(() => {
    setTimeout(() => {
      if (itemListRef.current && focusedIndex >= 0) {
        const items = itemListRef.current.querySelectorAll('li');
        const focusedItem = items[focusedIndex];

        if (focusedItem) {
          focusedItem.scrollIntoView({ block: 'nearest' });
        }
      }
    });
  }, [focusedIndex]);

  // 키보드 네비게이션
  const handleKeydown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>): void => {
      event.preventDefault();

      if (isShow) return;

      if (!isShow && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        setDropdownState(flag, year ? 'year' : 'month', true);
      }

      switch (event.key) {
        case 'ArrowDown':
          if (focusedIndex < filteredItems.length - 1) {
            setFocusedIndex(prev => prev + 1);
          } else {
            setFocusedIndex(0);
          }

          scrollToFocused();
          break;
        case 'ArrowUp':
          if (focusedIndex > 0) {
            setFocusedIndex(prev => prev - 1);
          } else {
            setFocusedIndex(filteredItems.length - 1);
          }

          scrollToFocused();
          break;
        case 'Enter':
          if (focusedIndex >= 0) {
            changedDate(filteredItems[focusedIndex]);
          }

          break;
        case 'Escape':
          setDropdownState(flag, year ? 'year' : 'month', false);
          setSearchText('');
          setFocusedIndex(-1);
          break;
        case 'Home':
          setFocusedIndex(0);
          scrollToFocused();
          break;
        case 'End':
          setFocusedIndex(filteredItems.length - 1);
          scrollToFocused();
          break;
      }
    },
    [
      flag,
      year,
      isShow,
      setDropdownState,
      filteredItems,
      focusedIndex,
      changedDate,
      scrollToFocused,
    ],
  );

  // 아이템 클릭 처리
  const handleItemClick = useCallback(
    (event: React.MouseEvent<HTMLLIElement>, item: number, index: number): void => {
      event.stopPropagation();

      setFocusedIndex(index);
      changedDate(item);
    },
    [changedDate],
  );

  // 아이템 포커스 처리
  const handleItemFocus = useCallback((index: number): void => {
    setFocusedIndex(index);
  }, []);

  const selectorRef = useRef<HTMLDivElement>(null);

  /**
   * 년, 월 드롭 다운 레이어 외의 구역을 클릭 할 경우 레이어 닫기
   * @param evt
   */
  const outsideClickEvent = useCallback(
    (evt: Event): void => {
      const target = evt.target as HTMLElement;

      if (!selectorRef.current?.contains(target)) {
        setDropdownState(flag, year ? 'year' : 'month', false);
        setSearchText('');
        setFocusedIndex(-1);
      }
    },
    [flag, year, setDropdownState],
  );

  // 외부 클릭 이벤트 등록
  useEffect(() => {
    document.addEventListener('click', outsideClickEvent);

    return () => document.removeEventListener('click', outsideClickEvent);
  }, [outsideClickEvent]);

  // 인라인 함수 메모이제이션
  const handleStopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  // className 메모이제이션
  const selectorTriggerClassName = useMemo(
    () => ['selector-trigger', month ? 'month' : '', year ? 'year' : ''].filter(Boolean).join(' '),
    [month, year],
  );

  const selectorIconClassName = useMemo(() => `selector-icon ${isShow ? 'rotated' : ''}`, [isShow]);

  const selectorBoxClassName = useMemo(
    () => ['selector-box', month ? 'month' : '', year ? 'year' : ''].filter(Boolean).join(' '),
    [month, year],
  );

  const componentHelperRef = useRef(useComponentHelper());

  const variants = useMemo(() => {
    return componentHelperRef.current.getTransitionVariant(
      transitionType.slide,
      layerPosition.bottom,
    );
  }, []);

  return (
    <div
      ref={selectorRef}
      onClick={handleClick}
      onKeyDown={handleKeydown}
      tabIndex={0}
      className={selectorTriggerClassName}
    >
      <div className="selector-trigger-text">
        {getDateString}
        <ChevronDownIcon className={selectorIconClassName} />
      </div>

      <AnimatePresence>
        {isShow && (
          <motion.div
            className={selectorBoxClassName}
            onClick={handleStopPropagation}
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={variants.transition}
          >
            <div className="selector-box-wrap">
              <ul ref={itemListRef} onClick={handleStopPropagation}>
                {filteredItems.map((num, index) => (
                  <SelectorItem
                    key={`date-${num}`}
                    num={num}
                    index={index}
                    isActive={num === getDate}
                    isFocused={focusedIndex === index}
                    isYear={year}
                    isShow={isShow}
                    onItemClick={handleItemClick}
                    onItemFocus={handleItemFocus}
                  />
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

SelectorBase.displayName = 'Selector';

export const Selector = React.memo(SelectorBase);
