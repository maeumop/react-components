import React, { useMemo } from 'react';
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
  isItemSelected,
  handleItemChange,
}: CheckBoxProps) => {
  const buttonRender = useMemo(() => {
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
  }, [type, parentValue, value]);

  const blockStyle = useMemo(() => {
    return lineLimit > 0
      ? {
          flex: 1,
        }
      : undefined;
  }, [lineLimit]);

  return (
    <>
      <label className={color} style={blockStyle} htmlFor={`${name}${index}`}>
        <input
          type={type}
          disabled={disabled}
          id={`${name}${index}`}
          name={name}
          value={value}
          checked={isItemSelected(value)}
          onChange={() => handleItemChange(index, value)}
        />

        {buttonRender}

        {text}
      </label>
    </>
  );
};

export default React.memo(CheckBox);
