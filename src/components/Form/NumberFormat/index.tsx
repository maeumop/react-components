import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import './style.scss';
import type { NumberFormatModel, NumberFormatProps } from './types';
import { useComponentHelper } from '../../helper';
import { useAppendFormComponent, useValidation } from '../hooks';
import { ErrorMessage } from '../ErrorMessage';

const NumberFormat = forwardRef<NumberFormatModel, NumberFormatProps>(
  (
    {
      value = 0,
      onChange,
      onBlur,
      onFocus,
      label = '',
      placeholder = '',
      validate = [],
      errorMessage = '',
      disabled = false,
      block = false,
      width,
      autofocus = false,
      maxLength,
      readonly = false,
      required = false,
      hideMessage = false,
      className,
    },
    ref,
  ) => {
    // 내부 상태
    const inputRef = useRef<HTMLInputElement>(null);

    const {
      message,
      isMounted,
      errorTransition,
      check,
      resetValidate,
      setMessage,
      setErrorTransition,
    } = useValidation<number | string>({
      validate,
      errorMessage,
      disabled,
      value,
      onMounted: () => {
        if (inputRef.current) {
          if (autofocus) {
            inputRef.current.focus();
          }

          if (value) {
            inputRef.current.value = numberFormat(value);
          }
        }
      },
    });
    const { numberFormat, commaStringToNumber } = useComponentHelper();

    // wrapper 스타일
    const wrapperClass = useMemo(() => {
      return ['number-format-wrap', label ? 'with-label' : '', block ? 'block' : '', className]
        .join(' ')
        .trim();
    }, [label, block, className]);

    // input 스타일
    const inputClass = useMemo(() => {
      return message ? 'error' : '';
    }, [message]);

    // 값 변경 핸들러
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) {
          return;
        }

        const val = commaStringToNumber(e.target.value);

        if (!isNaN(val)) {
          e.target.value = numberFormat(val);
          onChange?.(val);
        }
      },
      [onChange, disabled],
    );

    // 포커스/블러 시 0 처리
    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.target.value === '0') {
          e.target.value = '';
          onChange?.(0);
        }

        onFocus?.(e);
      },
      [onChange, onFocus],
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.target.value.length === 0) {
          e.target.value = '0';
          onChange?.(0);
        }

        check();
        onBlur?.(e);
      },
      [onChange, onBlur, check],
    );

    // 폼 초기화
    const resetForm = useCallback(() => {
      if (inputRef.current) {
        inputRef.current.value = '0';
      }

      setMessage('');
      setErrorTransition(false);
      onChange?.(0);
    }, [onChange]);

    // value 변경 시 validate 리셋 및 포맷 적용
    useEffect(() => {
      if (isMounted && !errorMessage) {
        setMessage('');
        setErrorTransition(false);

        if (inputRef.current) {
          inputRef.current.value = numberFormat(value);
        }
      }
    }, [value, errorMessage]);

    // disabled 변경 시 validate 리셋
    useEffect(() => {
      if (!errorMessage) {
        setMessage('');
        setErrorTransition(false);
      }
    }, [disabled]);

    const { motherRef } = useAppendFormComponent({
      check,
      resetForm,
      resetValidate,
    });

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
      <div className={wrapperClass} style={{ width }} ref={motherRef}>
        {label && (
          <div className="options-wrap">
            <label className="input-label">
              {label}
              {required && <span className="required">*</span>}
            </label>
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          className={inputClass}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readonly}
          maxLength={maxLength ? Number(maxLength) : undefined}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          defaultValue={numberFormat(value)}
          style={{ textAlign: 'right' }}
        />

        {/* 에러 메시지 트랜지션 */}
        {!hideMessage && message && (
          <ErrorMessage
            message={message}
            errorTransition={errorTransition}
            onAnimationEnd={() => setErrorTransition(false)}
          />
        )}
      </div>
    );
  },
);

NumberFormat.displayName = 'NumberFormat';

export default React.memo(NumberFormat);
