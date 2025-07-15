import { Icon } from '@iconify/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { statusSelectorColor, statusSelectorDefaultOptions } from './const';
import './style.scss';
import type { StatusSelectorProps } from './types';

// StatusSelector 컴포넌트
const StatusSelector: React.FC<StatusSelectorProps> = ({
  value,
  options,
  circle = statusSelectorDefaultOptions.circle,
  readOnly = statusSelectorDefaultOptions.readOnly,
  bgColor = statusSelectorDefaultOptions.bgColor,
  size = statusSelectorDefaultOptions.size,
  onChange,
}) => {
  // 내부 상태
  const [isShow, setIsShow] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectorRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const ulTransitionRef = useRef<HTMLUListElement>(null); // 트랜지션용 ref

  // 현재 선택된 옵션
  const selectedOption = options.find(option => option.value === value);
  const currentText = selectedOption?.text ?? '선택해주세요';
  const currentColor = selectedOption?.color ?? 'grey';

  // 스타일
  const wrapStyle = { backgroundColor: bgColor };

  // 옵션 유효성 검사
  useEffect(() => {
    if (!options || options.length === 0) {
      throw new Error('StatusSelector requires at least one option');
    }
  }, [options]);

  // 최초 마운트 시 선택 인덱스 설정
  useEffect(() => {
    const initialIndex = options.findIndex(option => option.value === value);
    if (initialIndex !== -1) {
      setSelectedIndex(initialIndex);
    }
  }, [options, value]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setIsShow(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // 색상 클래스 계산
  const getColorClass = (color: string): string => {
    const predefinedColors = Object.values(statusSelectorColor) as string[];
    return predefinedColors.includes(color) ? color : '';
  };

  // 토글 함수
  const toggle = useCallback(() => {
    if (readOnly) {
      return;
    }
    setIsShow(prev => !prev);
    if (!isShow) {
      setTimeout(() => {
        if (selectedIndex >= 0) {
          setFocusedIndex(selectedIndex);
          focusItemByIndex(selectedIndex);
        } else {
          focusFirstItem();
        }
      }, 0);
    }
  }, [readOnly, isShow, selectedIndex]);

  // 닫기 함수
  const close = useCallback(() => {
    setIsShow(false);
    setFocusedIndex(-1);
  }, []);

  // 옵션 선택
  const selectOption = useCallback(
    (index: number) => {
      if (index < 0 || index >= options.length) {
        return;
      }
      const option = options[index];
      setSelectedIndex(index);
      setFocusedIndex(index);
      if (onChange) {
        onChange(option.value, index);
      }
      close();
    },
    [options, onChange, close],
  );

  // 포커스 이동
  const focusFirstItem = useCallback(() => {
    if (listRef.current && options.length > 0) {
      setFocusedIndex(0);
      focusItemByIndex(0);
    }
  }, [options]);

  const focusNextItem = useCallback(() => {
    if (!listRef.current || options.length === 0) {
      return;
    }
    const nextIndex = focusedIndex < 0 ? 0 : (focusedIndex + 1) % options.length;
    focusItemByIndex(nextIndex);
  }, [focusedIndex, options]);

  const focusPreviousItem = useCallback(() => {
    if (!listRef.current || options.length === 0) {
      return;
    }
    const prevIndex = focusedIndex <= 0 ? options.length - 1 : focusedIndex - 1;
    focusItemByIndex(prevIndex);
  }, [focusedIndex, options]);

  const focusItemByIndex = useCallback(
    (index: number) => {
      if (!listRef.current || index < 0 || index >= options.length) {
        return;
      }
      setFocusedIndex(index);
      const focusableElements = listRef.current.querySelectorAll('li');
      if (focusableElements[index]) {
        (focusableElements[index] as HTMLLIElement).focus();
      }
    },
    [options],
  );

  // 키보드 이벤트 핸들러
  const handleKeydown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (readOnly) {
        return;
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (isShow) {
          if (focusedIndex >= 0 && focusedIndex < options.length) {
            selectOption(focusedIndex);
          }
        } else {
          toggle();
        }
      } else if (event.key === 'Escape') {
        if (isShow) {
          close();
        }
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (isShow) {
          focusNextItem();
        } else {
          toggle();
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (isShow) {
          focusPreviousItem();
        }
      }
    },
    [
      readOnly,
      isShow,
      focusedIndex,
      options.length,
      selectOption,
      toggle,
      close,
      focusNextItem,
      focusPreviousItem,
    ],
  );

  return (
    <div
      ref={selectorRef}
      className={['status-selector', `size-${size}`, readOnly ? 'readonly' : ''].join(' ')}
      onClick={toggle}
      onKeyDown={handleKeydown}
      role="combobox"
      aria-expanded={isShow}
      aria-haspopup="listbox"
      aria-disabled={readOnly}
      tabIndex={0}
    >
      <div className={['wrap', readOnly ? 'readonly' : ''].join(' ')} style={wrapStyle}>
        {circle && (
          <span
            className={['circle', getColorClass(currentColor)].join(' ')}
            style={getColorClass(currentColor) ? {} : { backgroundColor: currentColor }}
            aria-hidden="true"
          />
        )}
        <span style={getColorClass(currentColor) ? {} : { color: currentColor }}>
          {currentText}
        </span>
        {!readOnly && (
          <Icon
            icon="mdi:chevron-down"
            width={12}
            height={12}
            className={isShow ? 'rotate' : ''}
            aria-hidden="true"
          />
        )}
      </div>
      {/* 옵션 목록 트랜지션 */}
      <CSSTransition
        in={isShow}
        timeout={200}
        classNames="fade"
        unmountOnExit
        nodeRef={ulTransitionRef}
      >
        <ul
          ref={el => {
            listRef.current = el;
            ulTransitionRef.current = el;
          }}
          role="listbox"
          aria-label="상태 선택 옵션"
        >
          {options.map((item, index) => (
            <li
              key={`selector-${index}`}
              className={index === selectedIndex ? 'selected' : ''}
              tabIndex={0}
              onClick={e => {
                e.stopPropagation();
                selectOption(index);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  selectOption(index);
                }
              }}
              aria-selected={index === selectedIndex}
            >
              <div className="selector-wrap">
                {circle && (
                  <span
                    className={['circle', getColorClass(item.color)].join(' ')}
                    style={getColorClass(item.color) ? {} : { backgroundColor: item.color }}
                    aria-hidden="true"
                  />
                )}
                <span style={getColorClass(item.color) ? {} : { color: item.color }}>
                  {item.text}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </CSSTransition>
    </div>
  );
};

export default React.memo(StatusSelector);
