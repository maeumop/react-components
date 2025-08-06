import type { RuleFunc } from '../../types';

export interface OptionItem {
  text: string;
  value: string;
}

export type SelectBoxItem = OptionItem;

export interface SelectBoxProps {
  value: string | string[];
  options: SelectBoxItem[];
  label?: string;
  inLabel?: boolean;
  placeholder?: string;
  block?: boolean;
  validate?: RuleFunc[];
  errorMessage?: string;
  width?: string;
  multiple?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  required?: boolean;
  isShort?: boolean;
  btnAccept?: boolean;
  labelText?: boolean;
  maxLength?: number;
  searchable?: boolean;
  hideMessage?: boolean;
  blurValidate?: boolean;
  clearable?: boolean;
  isLoading?: boolean;
  // onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void;
  // onFocus?: (e: React.FocusEvent<HTMLDivElement>) => void;
  onChange?: (value: string | string[]) => void;
  onChangeIndex?: (index: number) => void;
  onAfterChange?: (value: string | string[]) => void;
}

export interface SelectBoxModel {
  check(silence?: boolean): boolean;
  resetForm(): void;
  resetValidate(): void;
}
