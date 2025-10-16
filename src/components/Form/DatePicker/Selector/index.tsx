import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { CSSTransition } from 'react-transition-group';
import type { DropdownStateType, SelectorProps } from '../types';
import { useDatePickerStore } from '../store';

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

  // 아이템 초기화
  const initializeItems = (): void => {
    setItems([]);

    if (year) {
      const maxYear = max ? max : new Date().getFullYear();

      for (let i = maxYear; i >= min; i--) {
        setItems(prev => [...prev, i]);
      }
    } else if (month) {
      for (let i = 0; i < 12; i++) {
        setItems(prev => [...prev, i]);
      }
    }
  };

  // 아이템 변경 감지
  useEffect(() => {
    if (year) {
      initializeItems();
    }
  }, [max]);

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
    [flag, year, setDateState, setDropdownState, setFocusedIndex, setSearchText],
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
  }, [focusedIndex, itemListRef.current]);

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
    [setFocusedIndex, changedDate],
  );

  // 아이템 포커스 처리
  const handleItemFocus = useCallback(
    (index: number): void => {
      setFocusedIndex(index);
    },
    [setFocusedIndex],
  );

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
    [flag, year, setDropdownState, setSearchText, setFocusedIndex],
  );

  const itemListWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeItems();
    document.addEventListener('click', outsideClickEvent);

    return () => document.removeEventListener('click', outsideClickEvent);
  });

  return (
    <div
      ref={selectorRef}
      onClick={handleClick}
      onKeyDown={handleKeydown}
      tabIndex={0}
      className={['selector-trigger', { month, year }].join(' ')}
    >
      <div className="selector-trigger-text">
        {getDateString}
        <Icon icon="mdi:chevron-down" className={`selector-icon ${isShow ? 'rotated' : ''}`} />
      </div>

      <CSSTransition
        in={isShow}
        timeout={200}
        classNames="trans-slide-down"
        unmountOnExit
        nodeRef={itemListWrapRef}
      >
        <div
          ref={itemListWrapRef}
          className={['selector-box', { month, year }].join(' ')}
          onClick={e => e.stopPropagation()}
        >
          <div className="selector-box-wrap">
            <ul ref={itemListRef} onClick={e => e.stopPropagation()}>
              {filteredItems.map((num, index) => (
                <li
                  key={`date-${num}`}
                  className={`${num === getDate ? 'active' : ''}${focusedIndex === index ? ' focused' : ''}`}
                  onClick={e => handleItemClick(e, num, index)}
                  onFocus={() => handleItemFocus(index)}
                  tabIndex={isShow ? 0 : -1}
                >
                  {year ? num : num + 1}
                </li>
              ))}
            </ul>

            <div className="no-results" role="status" aria-live="polite">
              검색 결과가 없습니다.
            </div>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
};

SelectorBase.displayName = 'Selector';

export const Selector = React.memo(SelectorBase);
