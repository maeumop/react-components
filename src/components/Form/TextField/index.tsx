import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { CancelRounded as ClearIcon } from '@mui/icons-material';
import { textFieldType } from './const';
import type { TextFieldModel, TextFieldProps } from './types';
import { useAppendFormComponent, useValidation } from '../hooks';
import './style.scss';
import { ErrorMessage } from '../ErrorMessage';

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
    onClick,
    className,
  } = props;

  // useValidation 훅 사용
  const {
    message,
    isMounted,
    errorTransition,
    check,
    resetValidate,
    setMessage,
    setErrorTransition,
  } = useValidation<string>({
    validate,
    errorMessage,
    disabled,
    value,
    onMounted: () => {
      if (autofocus) {
        if (multiline) {
          textareaRef.current?.focus();
        } else {
          inputRef.current?.focus();
        }
      }
    },
  });

  // 내부 ref
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // pattern 검사를 추가한 check 함수
  const checkWithPattern = useCallback(
    (silence = false): boolean => {
      // pattern 검사 (useValidation 이전에 실행)
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

      // useValidation의 check 실행
      return check(silence);
    },
    [pattern, value, check, setMessage, setErrorTransition],
  );

  // blur 핸들러
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onBlur?.(e);

      if (blurValidate && checkWithPattern()) {
        // trim 적용
        const val = e.target.value.trim();

        if (val !== value) {
          onChange?.(val);
        }
      }
    },
    [onBlur, blurValidate, value, onChange, checkWithPattern],
  );

  // click 핸들러
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onClick?.(e);
    },
    [onClick],
  );

  // 클리어 버튼 클릭
  const handleClear = useCallback(() => {
    onChange?.('');
  }, [onChange]);

  // 아이콘 클릭
  const handleIconClick = useCallback(
    (e: React.MouseEvent) => {
      if (typeof iconAction === 'function') {
        iconAction(e);
      }
    },
    [iconAction],
  );

  // 폼 초기화
  const resetForm = useCallback(() => {
    onChange?.('');
    resetValidate();
  }, [onChange, resetValidate]);

  // value 변경 시 validate 리셋 (useValidation 훅에서 자동으로 처리되지 않으므로 필요)
  useEffect(() => {
    if (isMounted) {
      setMessage('');
      resetValidate();
    }
  }, [value, resetValidate]);

  const { motherRef } = useAppendFormComponent({
    check: checkWithPattern,
    resetForm,
    resetValidate,
  });

  // imperative handle (expose)
  useImperativeHandle(
    ref,
    () => ({
      check: checkWithPattern,
      resetForm,
      resetValidate,
    }),
    [checkWithPattern, resetForm, resetValidate],
  );

  const IconComponent = icon;

  return (
    <div className={wrapperClass} style={{ width }} ref={motherRef}>
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
          maxLength={maxLength > 0 ? maxLength : undefined}
          onBlur={handleBlur}
          onClick={handleClick}
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
              onClick={handleClick}
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
        <ErrorMessage
          message={message}
          errorTransition={errorTransition}
          onAnimationEnd={() => setErrorTransition(false)}
        />
      )}
    </div>
  );
});

TextField.displayName = 'TextField';

export default React.memo(TextField);
