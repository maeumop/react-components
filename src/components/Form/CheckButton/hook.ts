import { useCallback, useEffect, useMemo } from 'react';

import { useValidation } from '../hooks';

import { checkButtonType } from './const';
import type { CheckButtonItem, CheckButtonProps } from './types';

export const useCheckButton = ({
  items = [],
  value,
  type = 'checkbox',
  maxLength = 0,
  validate = [],
  errorMessage = '',
  button = false,
  block = false,
  color = 'primary',
  disabled = false,
  all = false,
  onChange,
  onIndexChange,
  onAfterChange,
  className,
  lineLimit = 0,
}: Omit<CheckButtonProps, 'name' | 'label' | 'required'>) => {
  const { message, errorTransition, check, resetValidate, setErrorTransition } = useValidation<
    string | string[]
  >({
    validate,
    errorMessage,
    disabled,
    value,
  });

  // 전체 선택 기능
  const processedItems = useMemo<CheckButtonItem[]>(() => {
    let options = items || [];

    if (all) {
      options = [{ text: '전체 선택', value: '' }, ...options];
    }

    return options;
  }, [all, items]);

  const feedbackStatus = useMemo(() => {
    return `feedback ${errorTransition ? 'error' : ''}`;
  }, [errorTransition]);

  const checkButtonStyleClass = useMemo(() => {
    if (button) {
      return `check-button-group ${color}${disabled ? 'disabled' : ''} ${className}`;
    }

    return `origin-check-button ${block ? 'block' : ''} ${lineLimit > 0 ? 'grid' : ''}`;
  }, [color, disabled, lineLimit]);

  // 선택 상태
  const isItemSelected = useCallback(
    (v: string) => {
      if (type === checkButtonType.radio) {
        return value === v;
      }

      return Array.isArray(value) && value.includes(v);
    },
    [value, type],
  );

  // 값 변경 핸들러
  const handleItemChange = useCallback(
    (index: number, v: string) => {
      let newVal: string | string[] = v;

      if (type === checkButtonType.radio) {
        newVal = v;
      } else {
        newVal = Array.isArray(value) ? [...value] : [];

        if (newVal.includes(v)) {
          if (all && v === '') {
            newVal = []; // 전체 선택을 해제 했을 경우 모든 아이템을 해제
          } else {
            newVal = newVal.filter(item => item !== v && item !== '');
          }
        } else {
          if (maxLength > 0 && newVal.length >= maxLength) {
            newVal = newVal.slice(1);
          }

          // 전체 선택 처리
          if (all && v === '') {
            if (newVal.length === processedItems.length - 1) {
              newVal = [];
            } else {
              newVal = processedItems.filter((_, i) => i !== 0).map(item => item.value);
              newVal.push('');
            }
          } else {
            newVal.push(v);

            // 모든 아이템이 선택 되었을 경우 전체 선택 처리
            if (all && newVal.length === processedItems.length - 1 && !newVal.includes('')) {
              newVal.unshift('');
            }
          }
        }
      }

      onChange(newVal);
      onIndexChange?.(index);
      onAfterChange?.();
    },
    [type, value, maxLength, onChange, processedItems, all],
  );

  const resetForm = useCallback(() => {
    resetValidate();
    onChange(type === 'radio' ? '' : []);
  }, [type, onChange, resetValidate]);

  // 에러 트랜지션 자동 해제
  useEffect(() => {
    if (errorTransition) {
      const timer = setTimeout(() => setErrorTransition(false), 300);
      return () => clearTimeout(timer);
    }
  }, [errorTransition]);

  return {
    check,
    resetForm,
    resetValidate,
    checkButtonStyleClass,
    processedItems,
    handleItemChange,
    isItemSelected,
    message,
    feedbackStatus,
    errorTransition,
    setErrorTransition,
  };
};
