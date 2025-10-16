import { Icon } from '@iconify/react';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { textFieldType } from './const';
import type { TextFieldModel, TextFieldProps } from './types';
import './style.scss';
import FloatingBackButton from '@/views/FloatingBackButton';

const TextField = forwardRef<TextFieldModel, TextFieldProps>(
  (
    {
      value = '',
      type = textFieldType.text,
      rows = 5,
      label,
      placeholder,
      height,
      width,
      block = false,
      validate = [],
      blurValidate = true,
      pattern,
      maxLength = 0,
      multiline = false,
      disabled = false,
      readonly = false,
      isCounting = false,
      required = false,
      hideMessage = false,
      icon,
      iconLeft = false,
      iconAction,
      clearable = false,
      autofocus = false,
      errorMessage = '',
      onChange,
      onBlur,
      className,
    },
    ref,
  ) => {
    // 내부 상태
    const [message, setMessage] = useState('');
    const [errorTransition, setErrorTransition] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const isMounted = useRef(false);

    // wrapper 스타일
    const wrapperClass = useMemo(() => {
      return ['input-wrap', block ? 'block' : ''].join(' ').trim();
    }, [block]);

    // input 스타일
    const inputClass = useMemo(() => {
      let classNames = '';

      if (multiline) {
        classNames = `${message ? 'error' : ''}`;
      } else {
        classNames = [
          message ? 'error' : '',
          icon && iconLeft ? 'left-space' : '',
          icon && !iconLeft ? 'right-space' : '',
        ].join(' ');
      }

      classNames = [
        className,
        message ? 'error' : '',
        icon && iconLeft ? 'left-space' : '',
        icon && !iconLeft ? 'right-space' : '',
      ].join(' ');

      return classNames.trim();
    }, [message, icon, iconLeft, className]);

    // 클리어 버튼 노출 여부
    const clearButtonShow = useMemo(() => {
      return clearable && value !== '' && !disabled && !readonly;
    }, [clearable, value, disabled, readonly]);

    const feedbackStatus = useMemo(() => {
      return ['feedback', errorTransition ? 'error' : ''].join(' ').trim();
    }, [errorTransition]);

    // 값 변경 핸들러
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let val = e.target.value;

        if (isCounting && maxLength && val.length > maxLength) {
          val = val.substring(0, maxLength);
        }

        onChange?.(val);
      },
      [onChange, isCounting, maxLength],
    );

    // blur 핸들러
    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onBlur?.(e);
        if (blurValidate) {
          if (check()) {
            // trim 적용
            const val = e.target.value.trim();

            if (val !== value) {
              onChange?.(val);
            }
          }
        }
      },
      [onBlur, blurValidate, value, onChange],
    );

    // 클리어 버튼 클릭
    const handleClear = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        onChange?.('');
      },
      [onChange],
    );

    // 아이콘 클릭
    const handleIconClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();

        if (iconAction) {
          iconAction(e);
        }
      },
      [iconAction],
    );

    // 유효성 검사
    const check = useCallback(
      (silence = false): boolean => {
        if (disabled) {
          return true;
        }

        // 강제 에러 메시지
        if (errorMessage) {
          if (!silence) {
            setMessage(errorMessage);
            setErrorTransition(true);
          }

          return false;
        }
        // pattern 검사
        if (pattern && Array.isArray(pattern)) {
          const [regExp, errMsg] = pattern;

          if (regExp && !regExp.test(value)) {
            if (!silence) {
              setMessage(errMsg ?? '형식이 일치하지 않습니다.');
              setErrorTransition(true);
            }

            return false;
          }
        }
        // validate 함수 검사
        if (validate.length) {
          for (const validateFunc of validate) {
            const result = validateFunc(value);

            if (typeof result === 'string') {
              if (!silence) {
                setMessage(result);
                setErrorTransition(true);
              }

              return false;
            }
          }
        }

        if (!silence) {
          setMessage('');
          setErrorTransition(false);
        }

        return true;
      },
      [disabled, errorMessage, pattern, value, validate],
    );

    // 폼 초기화
    const resetForm = useCallback(() => {
      onChange?.('');
    }, [onChange]);

    // 유효성 상태 초기화
    const resetValidate = useCallback(() => {
      if (!errorMessage) {
        setMessage('');
        setErrorTransition(false);
      }
    }, [errorMessage]);

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

    // value 변경 시 validate 리셋
    useEffect(() => {
      if (isMounted.current) {
        resetValidate();
      }
    }, [value]);

    // validate 배열 변경 시 validate 리셋
    useEffect(() => {
      resetValidate();
    }, [validate]);

    // disabled 변경 시 validate 리셋
    useEffect(() => {
      resetValidate();
    }, [disabled]);

    // 마운트 시
    useEffect(() => {
      isMounted.current = true;

      if (autofocus) {
        if (multiline) {
          textareaRef.current?.focus();
        } else {
          inputRef.current?.focus();
        }
      }
    }, [autofocus, multiline]);

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
        {(label || (isCounting && maxLength)) && (
          <div className="options-wrap">
            {label && (
              <label className="input-label">
                {label}
                {required && <span className="required">*</span>}
              </label>
            )}
            {isCounting && maxLength ? (
              <div className="counting">
                {value.length} / {maxLength}
              </div>
            ) : null}
          </div>
        )}
        {multiline ? (
          <textarea
            ref={textareaRef}
            className={`${className} ${message ? 'error' : ''}`}
            style={height ? { height } : undefined}
            rows={rows}
            placeholder={placeholder}
            value={disabled ? '' : value}
            readOnly={readonly}
            disabled={disabled}
            onBlur={handleBlur}
            onChange={handleChange}
          />
        ) : (
          <div className="with-slot">
            <div className="input-relative">
              <input
                ref={inputRef}
                type={type}
                className={inputClass}
                style={width ? { width } : undefined}
                placeholder={placeholder}
                value={disabled ? '' : value}
                disabled={disabled}
                readOnly={readonly}
                maxLength={maxLength > 0 ? maxLength : undefined}
                autoComplete={type === 'password' ? 'on' : 'off'}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {/* 왼쪽 아이콘 */}
              {icon &&
                iconLeft &&
                (typeof iconAction === 'function' ? (
                  <a href="#" onClick={handleIconClick}>
                    <Icon icon={icon} width={24} height={24} className="icon-left" />
                  </a>
                ) : (
                  <Icon icon={icon} width={24} height={24} className="icon-left" />
                ))}
              {/* 오른쪽 아이콘 */}
              {icon &&
                !iconLeft &&
                (typeof iconAction === 'function' ? (
                  <a href="#" onClick={handleIconClick}>
                    <Icon icon={icon} width={24} height={24} className="icon-right" />
                  </a>
                ) : (
                  <Icon icon={icon} width={24} height={24} className="icon-right" />
                ))}
              {/* 클리어 버튼 */}
              {clearButtonShow && (
                <a
                  href="#"
                  className={['btn-clear', icon && !iconLeft ? 'with-icon' : ''].join(' ')}
                  onClick={handleClear}
                >
                  <Icon icon="mdi:close-circle" width={20} height={20} />
                </a>
              )}
            </div>
            {/* slot 자리 */}
          </div>
        )}
        {/* 에러 메시지 트랜지션 */}
        {!hideMessage && message && (
          <div className={feedbackStatus} onAnimationEnd={() => setErrorTransition(false)}>
            {message}
          </div>
        )}

        <FloatingBackButton />
      </div>
    );
  },
);

TextField.displayName = 'TextField';

export default React.memo(TextField);
