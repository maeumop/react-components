import React, { forwardRef, useImperativeHandle } from 'react';
import type { Ref } from 'react';
import type { CheckButtonModel, CheckButtonProps } from './types';
import { useCheckButton } from './hook';
import CheckBox from './checkBox';
import './style.scss';

const CheckButtonBase = ({
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
  ref,
}: CheckButtonProps & { ref: Ref<CheckButtonModel> }) => {
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
          ))}
        </div>
      ) : (
        processedItems.map(({ text, value: v }, i) => (
          <CheckBox
            key={`${name}-check-button-${i}`}
            name={name}
            disabled={disabled}
            type={type}
            color={color}
            text={text}
            parentValue={value}
            value={v}
            index={i}
            lineLimit={lineLimit}
            checkButtonStyleClass={checkButtonStyleClass}
            isItemSelected={isItemSelected}
            handleItemChange={handleItemChange}
          />
        ))
      )}

      {message && <div className={feedbackStatus}>{message}</div>}
    </div>
  );
};

const CheckButton = forwardRef<CheckButtonModel, CheckButtonProps>((props, ref) => {
  return <CheckButtonBase {...props} ref={ref} />;
});

CheckButton.displayName = 'CheckButton';

export default React.memo(CheckButton);
