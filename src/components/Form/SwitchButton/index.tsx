import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { switchButtonColor } from './const';
import './style.scss';
import type { SwitchButtonModel, SwitchButtonProps } from './types';
import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
} from '@mui/icons-material';
import { useAppendFormComponent, useValidation } from '../hooks';
import { ErrorMessage } from '../ErrorMessage';

const SwitchButton = forwardRef<SwitchButtonModel, React.PropsWithChildren<SwitchButtonProps>>(
  (
    {
      value = false,
      onChange,
      label = null,
      trueValue = true,
      falseValue = false,
      readonly = false,
      checkbox = false,
      color = switchButtonColor.primary,
      disabled = false,
      validate,
      errorMessage = '',
      children,
    },
    ref,
  ) => {
    // 내부 상태

    const { message, errorTransition, check, resetValidate, setErrorTransition } = useValidation<
      string | boolean
    >({
      validate,
      errorMessage,
      disabled,
      value,
    });

    const inputId = useMemo(() => `switch-btn-${Math.random().toString(36).slice(2, 10)}`, []);
    const inputRef = useRef<HTMLInputElement>(null);

    // 값 변경 핸들러
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (readonly) {
          // 상태가 변경되지 않도록 처리
          e.preventDefault();
          return;
        }

        const checked = e.target.checked;
        onChange?.(checked ? trueValue : falseValue);
      },
      [onChange, readonly, trueValue, falseValue],
    );

    const labelText = useMemo(() => {
      return Array.isArray(label) ? (value === trueValue ? label[1] : label[0]) : label;
    }, [label, value, trueValue]);

    // 폼 초기화
    const resetForm = useCallback(() => {
      onChange?.(falseValue);
      resetValidate();
    }, [onChange, falseValue, resetValidate]);

    // value 변경 시 validate 리셋
    useEffect(() => {
      resetValidate();
    }, [value, resetValidate]);

    // 에러 트랜지션 자동 해제
    useEffect(() => {
      if (errorTransition) {
        const timer = setTimeout(() => setErrorTransition(false), 300);
        return () => clearTimeout(timer);
      }
    }, [errorTransition]);

    // 인라인 콜백 메모이제이션
    const handleErrorAnimationEnd = useCallback(() => {
      setErrorTransition(false);
    }, []);

    // className 메모이제이션
    const wrapperClassName = useMemo(() => ['switch-wrap', color].join(' '), [color]);

    const labelClassName = useMemo(
      () => ['switch', checkbox ? 'checkbox' : ''].join(' '),
      [checkbox],
    );

    // 체크박스 아이콘 렌더링
    const renderCheckboxIcon = useMemo(() => {
      if (value === trueValue) {
        return <CheckBoxIcon />;
      }

      return <CheckBoxOutlineBlankIcon />;
    }, [value, trueValue]);

    const { motherRef } = useAppendFormComponent({
      check,
      resetForm,
      resetValidate,
    });

    // imperative handle (expose)
    useImperativeHandle(
      ref,
      () => ({
        check,
        resetForm,
        resetValidate,
      }),
      [check, resetForm, resetValidate],
    );

    return (
      <div className={wrapperClassName} ref={motherRef}>
        <label htmlFor={inputId} className={labelClassName}>
          <input
            id={inputId}
            ref={inputRef}
            type="checkbox"
            disabled={disabled || readonly}
            checked={value === trueValue}
            onChange={handleChange}
            aria-checked={value === trueValue ? 'true' : 'false'}
            role="switch"
          />
          {checkbox ? (
            <>{renderCheckboxIcon}</>
          ) : (
            <span>
              <i />
            </span>
          )}
          {/* 라벨 트랜지션 */}
          <div className="label-text" aria-live="polite">
            {children || labelText}
          </div>
        </label>

        {/* 에러 메시지 트랜지션 */}
        {message && (
          <ErrorMessage
            message={message}
            errorTransition={errorTransition}
            onAnimationEnd={handleErrorAnimationEnd}
          />
        )}
      </div>
    );
  },
);

SwitchButton.displayName = 'SwitchButton';

export default SwitchButton;
