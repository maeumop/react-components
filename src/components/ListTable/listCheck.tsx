import React, { useCallback } from 'react';
import type { ListTableListCheckProps } from './types';
import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  RadioButtonChecked as RadioButtonCheckedIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
} from '@mui/icons-material';

/**
 * ListTableCheck 컴포넌트 (체크박스/라디오)
 */
const ListTableCheck: React.FC<ListTableListCheckProps> = ({
  modelValue = false,
  value,
  disabled = false,
  type = 'checkbox',
  onChange,
}) => {
  // 아이콘 렌더링
  const renderIcon = () => {
    if (type === 'radio') {
      if (disabled) {
        return <RadioButtonUncheckedIcon className="check-icon" />;
      }
      return modelValue ? (
        <RadioButtonCheckedIcon className="check-icon" />
      ) : (
        <RadioButtonUncheckedIcon className="check-icon" />
      );
    } else {
      if (disabled) {
        return <CheckBoxOutlineBlankIcon className="check-icon" />;
      }
      return modelValue ? (
        <CheckBoxIcon className="check-icon" />
      ) : (
        <CheckBoxOutlineBlankIcon className="check-icon" />
      );
    }
  };

  // 체크 이벤트
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      onChange?.(e.target.checked);
    },
    [disabled, onChange],
  );

  return (
    <label className="checkbox-wrap">
      <input
        type={type}
        disabled={disabled}
        value={value}
        checked={!!modelValue}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      {renderIcon()}
    </label>
  );
};

export default React.memo(ListTableCheck);
