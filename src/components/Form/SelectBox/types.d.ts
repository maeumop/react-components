import type { OptionItem, RuleFunc } from '../../types';

export type SelectBoxItem = OptionItem;

export interface SelectBoxProps {
  modelValue: string | string[];
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
}

export interface SelectBoxEmits {
  (event: 'update:modelValue', value: string | string[]): void;
  (event: 'update:selectedIndex', index: number): void;
  (event: 'blur', value: string | string[]): void;
  (event: 'focus', event: FocusEvent): void;
  (event: 'change', value: string | string[]): void;
}

export interface SelectBoxModel {
  check(silence?: boolean): boolean;
  resetForm(): void;
  resetValidate(): void;
}
