import type { RuleFunc } from '../../types';

export interface NumberFormatProps {
  value: number | string;
  onChange?: (value: number) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  validate?: RuleFunc[];
  errorMessage?: string;
  disabled?: boolean;
  block?: boolean;
  width?: string;
  autofocus?: boolean;
  maxLength?: string | number;
  readonly?: boolean;
  required?: boolean;
  hideMessage?: boolean;
}

export interface NumberFormatModel {
  check: (silence?: boolean) => boolean;
  resetForm: () => void;
  resetValidate: () => void;
}
