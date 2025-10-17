import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import './style.scss';
import type { NumberFormatModel, NumberFormatProps } from './types';

const format = (v: number | string): string => {
  if (v === '-' || v === '') {
    return String(v);
  }

  const num = Number(v);

  if (isNaN(num)) {
    return '0';
  }

  return new Intl.NumberFormat().format(num);
};

const getNumber = (v: string): number => {
  let val = v
    .replace(/[^\d-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^$/, '');

  val = val.charAt(0) === '-' ? '-' + val.replace(/[-]/g, '') : val.replace(/[-]/g, '');

  return Number(val);
};

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
    const [message, setMessage] = useState('');
    const [errorTransition, setErrorTransition] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const isMounted = useRef(false);

    // wrapper 스타일
    const wrapperClass = useMemo(() => {
      return ['input-wrap', label ? 'with-label' : '', block ? 'block' : '', className]
        .join(' ')
        .trim();
    }, [label, block, className]);

    // input 스타일
    const inputClass = useMemo(() => {
      return message ? 'error' : '';
    }, [message]);

    const feedbackStatus = useMemo(() => {
      return ['feedback', errorTransition ? 'error' : ''].join(' ').trim();
    }, [errorTransition]);

    // 값 변경 핸들러
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) {
          return;
        }

        const val = getNumber(e.target.value);
        const numValue = Number(val);

        if (!isNaN(numValue)) {
          e.target.value = format(numValue);
          onChange?.(numValue);
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

    // 유효성 검사
    const check = useCallback(
      (silence = false): boolean => {
        if (disabled) {
          return true;
        }

        // errorMessage가 설정되어 있으면 실패
        if (errorMessage) {
          if (!silence) {
            setMessage(errorMessage);
            setErrorTransition(true);
          }
          return false;
        }

        // validate 함수들 실행
        if (validate.length) {
          const val = getNumber(inputRef.current?.value || '0');

          for (const validateFunc of validate) {
            const result = validateFunc(val);

            if (typeof result === 'string') {
              if (!silence) {
                setMessage(result);
                setErrorTransition(true);
              }
              return false;
            }
          }
        }

        // 검증 통과
        if (!silence) {
          setMessage('');
          setErrorTransition(false);
        }

        return true;
      },
      [disabled, errorMessage, validate],
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

    // 유효성 상태 초기화
    const resetValidate = useCallback(() => {
      setMessage('');
      setErrorTransition(false);
    }, []);

    // 외부 errorMessage 변경 시 상태 동기화
    useEffect(() => {
      if (errorMessage) {
        setMessage(errorMessage);
        setErrorTransition(true);
      } else {
        setMessage('');
        setErrorTransition(false);
      }
    }, [errorMessage]);

    // value 변경 시 validate 리셋 및 포맷 적용
    useEffect(() => {
      if (isMounted.current && !errorMessage) {
        setMessage('');
        setErrorTransition(false);

        if (inputRef.current) {
          inputRef.current.value = format(value);
        }
      }
    }, [value, errorMessage]);

    // disabled 변경 시 validate 리셋
    useEffect(() => {
      if (!errorMessage) {
        setMessage('');
        setErrorTransition(false);
      }
    }, [disabled, errorMessage]);

    // 마운트 시
    useEffect(() => {
      isMounted.current = true;

      if (inputRef.current) {
        if (autofocus) {
          inputRef.current.focus();
        }

        if (value) {
          inputRef.current.value = format(value);
        }
      }
    }, [autofocus, value]);

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
      <div className={wrapperClass} style={{ width }}>
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
          maxLength={Number(maxLength)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          defaultValue={format(value)}
          style={{ textAlign: 'right' }}
        />
        {/* 에러 메시지 트랜지션 */}
        {!hideMessage && message && (
          <div className={feedbackStatus} onAnimationEnd={() => setErrorTransition(false)}>
            {message}
          </div>
        )}
      </div>
    );
  },
);

NumberFormat.displayName = 'NumberFormat';

export default React.memo(NumberFormat);
