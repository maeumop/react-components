import { Icon } from '@iconify/react';
import React, { useCallback } from 'react';
import { listTableCheckboxIcon, listTableRadioIcon } from './const';
import type { ListTableListCheckProps } from './types';

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
  // 아이콘 결정
  const iconName = (() => {
    if (disabled) {
      return type === 'radio' ? listTableRadioIcon.disabled : listTableCheckboxIcon.disabled;
    }

    if (modelValue) {
      return type === 'radio' ? listTableRadioIcon.checked : listTableCheckboxIcon.checked;
    }

    return type === 'radio' ? listTableRadioIcon.blank : listTableCheckboxIcon.blank;
  })();

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
      <Icon icon={iconName} className="check-icon" />
    </label>
  );
};

export default React.memo(ListTableCheck);
