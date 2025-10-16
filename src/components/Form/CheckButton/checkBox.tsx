import React from 'react';
import { checkButtonColor, checkButtonType } from './const';
import {
  CheckBoxOutlineBlankRounded,
  CheckBoxRounded,
  RadioButtonUncheckedRounded,
  RadioButtonCheckedRounded,
} from '@mui/icons-material';
import type { CheckBoxProps } from './types';

const CheckBox = ({
  name,
  text,
  parentValue,
  value,
  index,
  type = checkButtonType.radio,
  color = checkButtonColor.primary,
  disabled = false,
  lineLimit = 0,
  checkButtonStyleClass,
  isItemSelected,
  handleItemChange,
}: CheckBoxProps) => {
  // 라인 제한
  const lineBreak = () => {
    if (lineLimit > 0 && (index + 1) % lineLimit === 0) {
      return <div className="line-break" />;
    }

    return null;
  };

  const buttonRender = () => {
    if (type === checkButtonType.radio) {
      return parentValue === value ? (
        <RadioButtonCheckedRounded className="check-icon" />
      ) : (
        <RadioButtonUncheckedRounded className="check-icon" />
      );
    }

    return parentValue.includes(value) ? (
      <CheckBoxRounded className="check-icon" />
    ) : (
      <CheckBoxOutlineBlankRounded className="check-icon" />
    );
  };

  return (
    <>
      <div className={checkButtonStyleClass}>
        <label className={color} htmlFor={`${name}${index}`}>
          <input
            type={type}
            disabled={disabled}
            id={`${name}${index}`}
            name={name}
            value={value}
            checked={isItemSelected(value)}
            onChange={() => handleItemChange(index, value)}
          />

          {buttonRender()}

          {text}
        </label>

        {lineBreak()}
      </div>
    </>
  );
};

export default React.memo(CheckBox);
