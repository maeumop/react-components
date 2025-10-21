import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CancelRounded as ClearIcon } from '@mui/icons-material';
import { textFieldType } from './const';
import type { TextFieldModel, TextFieldProps } from './types';
import './style.scss';

const TextField = forwardRef<TextFieldModel, TextFieldProps>((props, ref) => {
  const {
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
  } = props;

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
    const classNames = [
      className,
      message ? 'error' : '',
      icon && iconLeft ? 'left-space' : '',
      icon && !iconLeft ? 'right-space' : '',
    ].join(' ');

    return classNames.trim();
  }, [message, icon, iconLeft, className]);

  // textarea 스타일
  const textareaClass = useMemo(() => {
    return [className, message ? 'error' : ''].join(' ').trim();
  }, [className, message]);

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

  // blur 핸들러
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onBlur?.(e);

      if (blurValidate && check()) {
        // trim 적용
        const val = e.target.value.trim();

        if (val !== value) {
          onChange?.(val);
        }
      }
    },
    [onBlur, blurValidate, value, onChange, check],
  );

  // 클리어 버튼 클릭
  const handleClear = useCallback(() => {
    onChange?.('');
  }, [onChange]);

  // 아이콘 클릭
  const handleIconClick = useCallback(
    (e: React.MouseEvent) => {
      if (iconAction) {
        iconAction(e);
      }
    },
    [iconAction],
  );

  // 폼 초기화
  const resetForm = useCallback(() => {
    onChange?.('');
    setMessage('');
    setErrorTransition(false);
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

  // value 변경 시 validate 리셋 (해당 컴포넌트의 value만)
  useEffect(() => {
    if (isMounted.current && !errorMessage) {
      resetValidate();
    }
  }, [value, errorMessage, resetValidate]);

  // disabled 변경 시 validate 리셋
  useEffect(() => {
    if (!errorMessage) {
      resetValidate();
    }
  }, [disabled, errorMessage, resetValidate]);

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

  const IconComponent = icon;

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
          className={textareaClass}
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
            {IconComponent && iconLeft && (
              <IconComponent
                sx={{ width: 24, height: 24 }}
                className="cursor icon-left"
                onClick={handleIconClick}
              />
            )}
            {/* 오른쪽 아이콘 */}
            {IconComponent && !iconLeft && (
              <IconComponent
                sx={{ width: 24, height: 24 }}
                className="icon-right"
                onClick={handleIconClick}
              />
            )}
            {/* 클리어 버튼 */}
            {clearButtonShow && (
              <ClearIcon
                sx={{ width: 20, height: 20 }}
                className={['clear-value', icon && !iconLeft ? 'with-icon' : ''].join(' ')}
                onClick={handleClear}
              />
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
    </div>
  );
});

TextField.displayName = 'TextField';

export default React.memo(TextField);
