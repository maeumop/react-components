import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { statusSelectorColor, statusSelectorDefaultOptions } from './const';
import type { StatusSelectorProps, StatusSelectorItem } from './types';
import { KeyboardArrowDown as ChevronDownIcon } from '@mui/icons-material';
import './style.scss';

// Animation variants
const dropdownVariants = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: 'easeInOut' as const },
};

// 미리 정의된 색상 목록 (컴포넌트 외부로 이동)
const predefinedColors = Object.values(statusSelectorColor) as string[];

// 옵션 아이템 컴포넌트
const OptionItem = React.memo<{
  item: StatusSelectorItem;
  index: number;
  isSelected: boolean;
  circle: boolean;
  getColorClass: (color: string) => string;
  onSelect: (index: number) => void;
}>(({ item, index, isSelected, circle, getColorClass, onSelect }) => {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect(index);
    },
    [index, onSelect],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        onSelect(index);
      }
    },
    [index, onSelect],
  );

  const colorClass = useMemo(() => getColorClass(item.color), [item.color, getColorClass]);

  const circleClassName = useMemo(
    () => ['circle', colorClass].filter(Boolean).join(' '),
    [colorClass],
  );

  const circleStyle = useMemo(
    () => (colorClass ? {} : { backgroundColor: item.color }),
    [colorClass, item.color],
  );

  const textStyle = useMemo(
    () => (colorClass ? {} : { color: item.color }),
    [colorClass, item.color],
  );

  return (
    <li
      className={isSelected ? 'selected' : ''}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="selector-wrap">
        {circle && <span className={circleClassName} style={circleStyle} />}
        <span style={textStyle}>{item.text}</span>
      </div>
    </li>
  );
});

OptionItem.displayName = 'OptionItem';

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

  // 현재 선택된 옵션 (메모이제이션)
  const selectedOption = useMemo(
    () => options.find(option => option.value === value),
    [options, value],
  );

  const currentText = useMemo(() => selectedOption?.text ?? '선택해주세요', [selectedOption]);

  const currentColor = useMemo(() => selectedOption?.color ?? 'grey', [selectedOption]);

  // 스타일 (메모이제이션)
  const wrapStyle = useMemo(() => ({ backgroundColor: bgColor }), [bgColor]);

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

  // 색상 클래스 계산 (메모이제이션)
  const getColorClass = useCallback((color: string): string => {
    return predefinedColors.includes(color) ? color : '';
  }, []);

  // 토글 함수
  const toggle = useCallback(() => {
    if (readOnly) return;

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
      if (readOnly) return;

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();

        if (isShow && focusedIndex >= 0 && focusedIndex < options.length) {
          selectOption(focusedIndex);
        } else {
          toggle();
        }
      } else if (event.key === 'Escape' && isShow) {
        close();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();

        if (isShow) {
          focusNextItem();
        } else {
          toggle();
        }
      } else if (event.key === 'ArrowUp' && isShow) {
        event.preventDefault();
        focusPreviousItem();
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

  // 메모이제이션된 className들
  const selectorClassName = useMemo(
    () => ['status-selector', `size-${size}`, readOnly ? 'readonly' : ''].join(' '),
    [size, readOnly],
  );

  const wrapClassName = useMemo(() => ['wrap', readOnly ? 'readonly' : ''].join(' '), [readOnly]);

  const currentColorClass = useMemo(
    () => getColorClass(currentColor),
    [currentColor, getColorClass],
  );

  const circleClassName = useMemo(
    () => ['circle', currentColorClass].filter(Boolean).join(' '),
    [currentColorClass],
  );

  const circleStyle = useMemo(
    () => (currentColorClass ? {} : { backgroundColor: currentColor }),
    [currentColorClass, currentColor],
  );

  const textStyle = useMemo(
    () => (currentColorClass ? {} : { color: currentColor }),
    [currentColorClass, currentColor],
  );

  const iconClassName = useMemo(() => (isShow ? 'rotate' : ''), [isShow]);

  return (
    <div
      ref={selectorRef}
      className={selectorClassName}
      onClick={toggle}
      onKeyDown={handleKeydown}
      tabIndex={0}
    >
      <div className={wrapClassName} style={wrapStyle}>
        {circle && <span className={circleClassName} style={circleStyle} />}
        <span style={textStyle}>{currentText}</span>
        {!readOnly && <ChevronDownIcon sx={{ width: 12, height: 12 }} className={iconClassName} />}
      </div>
      {/* 옵션 목록 트랜지션 */}
      <AnimatePresence>
        {isShow && (
          <motion.ul
            ref={listRef}
            initial={dropdownVariants.initial}
            animate={dropdownVariants.animate}
            exit={dropdownVariants.exit}
            transition={dropdownVariants.transition}
          >
            {options.map((item, index) => (
              <OptionItem
                key={`selector-${item.value}-${index}`}
                item={item}
                index={index}
                isSelected={index === selectedIndex}
                circle={circle}
                getColorClass={getColorClass}
                onSelect={selectOption}
              />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(StatusSelector);
