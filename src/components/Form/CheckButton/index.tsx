import { Icon } from '@iconify/react';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { checkButtonIcons, checkButtonType } from './const';
import './style.scss';
import type { CheckButtonItem, CheckButtonModel, CheckButtonProps } from './types';

const getRadioIcon = (isSelected: boolean, isDisabled: boolean) => {
  if (isSelected) return checkButtonIcons.radio.checked;
  return isDisabled ? checkButtonIcons.radio.disabled : checkButtonIcons.radio.unchecked;
};

const getCheckboxIcon = (isSelected: boolean, isDisabled: boolean) => {
  if (isSelected) return checkButtonIcons.checkbox.checked;
  return isDisabled ? checkButtonIcons.checkbox.disabled : checkButtonIcons.checkbox.unchecked;
};

const CheckButton = forwardRef<CheckButtonModel, CheckButtonProps>(
  (
    {
      items = [],
      name,
      value,
      type = 'checkbox',
      maxLength = 0,
      validate = [],
      errorMessage = '',
      button = false,
      block = false,
      color = 'primary',
      disabled = false,
      label,
      required = false,
      lineLimit = 0,
      all = false,
      onChange,
      onIndexChange,
      onAfterChange,
    },
    ref,
  ) => {
    // 내부 상태
    const [val, setVal] = useState<string | string[]>(
      value ?? (type === checkButtonType.radio ? '' : []),
    );
    const [message, setMessage] = useState('');
    const [errorTransition, setErrorTransition] = useState(false);

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
        return `check-button-group ${color}${disabled ? ' disabled' : ''}`;
      }

      return `origin-check-button${block ? ' block' : ''}`;
    }, [color, disabled]);

    // 선택 상태
    const isItemSelected = useCallback(
      (v: string) => {
        if (type === checkButtonType.radio) {
          return val === v;
        }

        return Array.isArray(val) && val.includes(v);
      },
      [val, type],
    );

    // 값 변경 핸들러
    const handleItemChange = useCallback(
      (index: number, v: string) => {
        let newVal: string | string[] = v;

        if (type === checkButtonType.radio) {
          newVal = v;
        } else {
          newVal = Array.isArray(val) ? [...val] : [];

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

        setVal(newVal);
        onChange?.(newVal);
        onIndexChange?.(index);
        onAfterChange?.();
      },
      [type, val, maxLength, onChange, processedItems, all],
    );

    // 유효성 검사
    const check = useCallback(
      (silence = false): boolean => {
        if (disabled) {
          return true;
        }

        if (errorMessage) {
          if (!silence) {
            setMessage(errorMessage);
            setErrorTransition(true);
          }

          return false;
        }

        if (!validate.length) {
          if (!silence) {
            setMessage('');
            setErrorTransition(false);
          }

          return true;
        }

        for (const validator of validate) {
          let valueToValidate: string | string[];

          if (type === checkButtonType.checkbox) {
            // 체크박스의 경우 선택된 값들의 배열을 전달
            valueToValidate = Array.isArray(val) ? val : [];
          } else {
            // 라디오의 경우 선택된 단일 값을 전달
            valueToValidate = val;
          }

          const result = validator(valueToValidate);

          if (typeof result !== 'boolean') {
            if (!silence) {
              setMessage(result);
              setErrorTransition(true);
            }

            return false;
          }
        }

        if (!silence) {
          setMessage('');
          setErrorTransition(false);
        }

        return true;
      },
      [disabled, errorMessage, validate, val],
    );

    const resetForm = useCallback(() => {
      setVal(type === 'radio' ? '' : []);
    }, [type]);

    const resetValidate = useCallback(() => {
      setMessage('');
      setErrorTransition(false);
    }, []);

    // 외부 value prop 변경 시 내부 상태 동기화
    useEffect(() => {
      setVal(value ?? (type === 'radio' ? '' : []));
    }, [value, type]);

    // value 변경 시 자동 validation 실행
    useEffect(() => {
      if (validate.length > 0) {
        check();
      }
    }, [val, validate]);

    // 에러 트랜지션 자동 해제
    useEffect(() => {
      if (errorTransition) {
        const timer = setTimeout(() => setErrorTransition(false), 300);
        return () => clearTimeout(timer);
      }
    }, [errorTransition]);

    // 라인 제한
    const needLineBreak = (i: number) => lineLimit > 0 && (i + 1) % lineLimit === 0;

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
      <div className="check-button">
        {label && (
          <div className="options-wrap">
            <label className="input-label">
              {label}
              {required && <span className="required">*</span>}
            </label>
          </div>
        )}
        {button ? (
          <div className={checkButtonStyleClass}>
            {processedItems.map(({ text, value: v }, i) => (
              <React.Fragment key={`${name}-keyword-${i}`}>
                <input
                  type="checkbox"
                  id={`${name}${i}`}
                  name={name}
                  disabled={disabled}
                  value={v}
                  checked={Array.isArray(val) && val.includes(v)}
                  onChange={() => handleItemChange(i, v)}
                />
                <label
                  className={processedItems.length - 1 === i ? 'last' : ''}
                  htmlFor={`${name}${i}`}
                >
                  {text}
                </label>
              </React.Fragment>
            ))}
          </div>
        ) : (
          processedItems.map(({ text, value: v }, i) => (
            <React.Fragment key={`${name}-check-button-${i}`}>
              <div className={checkButtonStyleClass}>
                <label className={color} htmlFor={`${name}${i}`}>
                  <input
                    type={type}
                    disabled={disabled}
                    id={`${name}${i}`}
                    name={name}
                    value={v}
                    checked={isItemSelected(v)}
                    onChange={() => handleItemChange(i, v)}
                  />
                  <Icon
                    className="check-icon"
                    icon={
                      type === checkButtonType.radio
                        ? getRadioIcon(isItemSelected(v), disabled)
                        : getCheckboxIcon(Array.isArray(val) && val.includes(v), disabled)
                    }
                  />
                  {text}
                </label>
              </div>
              {needLineBreak(i) && <div className="line-break" />}
            </React.Fragment>
          ))
        )}
        {message && <div className={feedbackStatus}>{message}</div>}
      </div>
    );
  },
);

CheckButton.displayName = 'CheckButton';

export default CheckButton;
