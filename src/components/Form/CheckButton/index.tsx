import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { CheckButtonModel, CheckButtonProps } from './types';
import { useCheckButton } from './hook';
import CheckBox from './checkBox';
import './style.scss';
import { useAppendFormComponent } from '../hooks';

const CheckButton = forwardRef<CheckButtonModel, CheckButtonProps>((props, ref) => {
  const {
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
    className,
  } = props;

  const {
    check,
    resetForm,
    resetValidate,
    checkButtonStyleClass,
    processedItems,
    handleItemChange,
    message,
    feedbackStatus,
    isItemSelected,
  } = useCheckButton({
    items,
    value,
    type,
    maxLength,
    validate,
    errorMessage,
    button,
    block,
    color,
    disabled,
    all,
    onChange,
    onIndexChange,
    onAfterChange,
    className,
    lineLimit,
  });

  const checkBoxProps = {
    name,
    disabled,
    type,
    color,
    parentValue: value,
    lineLimit,
    checkButtonStyleClass,
    isItemSelected,
    handleItemChange,
  };

  const initCount = useRef<number>(0);

  useEffect(() => {
    console.log(initCount.current);
    if (process.env.NODE_ENV === 'development' && initCount.current < 2) {
      return;
    }

    if (initCount.current) {
      check();
    }
  }, [value]);

  useEffect(() => {
    initCount.current++;
  }, []);

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
    <div className="check-button" ref={motherRef}>
      {label && (
        <div className="options-wrap">
          <label className="input-label">
            {label}
            {required && <span className="required">*</span>}
          </label>
        </div>
      )}

      <div
        className={checkButtonStyleClass}
        style={{ gridTemplateColumns: `repeat(${lineLimit}, 1fr)` }}
      >
        {processedItems.map(({ text, value: v }, i) => {
          return button ? (
            <React.Fragment key={`${name}-keyword-${i}`}>
              <input
                type="checkbox"
                id={`${name}${i}`}
                name={name}
                disabled={disabled}
                value={v}
                checked={Array.isArray(value) && value.includes(v)}
                onChange={() => handleItemChange(i, v)}
              />
              <label
                className={processedItems.length - 1 === i ? 'last' : ''}
                htmlFor={`${name}${i}`}
              >
                {text}
              </label>
            </React.Fragment>
          ) : (
            <CheckBox
              key={`${name}-check-button-${i}`}
              text={text}
              value={v}
              index={i}
              {...checkBoxProps}
            />
          );
        })}
      </div>

      {message && <div className={feedbackStatus}>{message}</div>}
    </div>
  );
});

CheckButton.displayName = 'CheckButtonBase';

export default React.memo(CheckButton);
