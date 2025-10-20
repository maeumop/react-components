import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { switchButtonColor } from './const';
import './style.scss';
import type { SwitchButtonModel, SwitchButtonProps } from './types';
import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
} from '@mui/icons-material';

const SwitchButton = forwardRef<SwitchButtonModel, SwitchButtonProps>(
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
    },
    ref,
  ) => {
    // 내부 상태
    const [message, setMessage] = useState('');
    const [errorTransition, setErrorTransition] = useState(false);
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

    // 유효성 검사
    const check = useCallback(
      (silence = false): boolean => {
        if (validate !== undefined) {
          let valid = true;
          if (typeof validate === 'function') {
            const result = validate(value);

            if (typeof result === 'string') {
              valid = false;

              if (!silence) {
                setMessage(result);
                setErrorTransition(true);
              }
            } else if (result === false) {
              valid = false;

              if (!silence) {
                setMessage(`${labelText}을(를) 선택해주세요.`);
                setErrorTransition(true);
              }
            }
          } else if (value !== trueValue) {
            valid = false;

            if (!silence) {
              setMessage(
                typeof validate === 'string' ? validate : `${labelText}을(를) 선택해주세요.`,
              );
              setErrorTransition(true);
            }
          }

          if (valid) {
            setMessage('');
            setErrorTransition(false);
            return true;
          }

          return false;
        }

        return true;
      },
      [validate, value, labelText, trueValue],
    );

    // 유효성 상태 초기화
    const resetValidate = useCallback(() => {
      setMessage('');
      setErrorTransition(false);
    }, []);

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

    // 트랜지션 클래스
    const feedbackStatus = useMemo(
      () => ['description', errorTransition ? 'error' : ''].join(' ').trim(),
      [errorTransition],
    );

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
      <div className={wrapperClassName}>
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
            {labelText}
          </div>
        </label>

        {/* 에러 메시지 트랜지션 */}
        {message && (
          <div className={feedbackStatus} onAnimationEnd={handleErrorAnimationEnd}>
            {message}
          </div>
        )}
      </div>
    );
  },
);

SwitchButton.displayName = 'SwitchButton';

export default SwitchButton;
