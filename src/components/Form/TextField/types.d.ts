import type { RuleFunc } from '../../types';

export type TextFieldType = (typeof textFieldType)[keyof typeof textFieldType];

export interface TextFieldProps {
  modelValue: string;
  type?: TextFieldType;
  rows?: number;
  label?: string;
  placeholder?: string;
  height?: string;
  width?: string;
  block?: boolean;
  validate?: RuleFunc[];
  blurValidate?: boolean;
  pattern?: [RegExp, string?];
  maxLength?: number;
  multiline?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  isCounting?: boolean;
  required?: boolean;
  hideMessage?: boolean;
  icon?: string;
  iconLeft?: boolean;
  iconAction?: (event?: Event) => void;
  clearable?: boolean;
  // 잘 사용하지 않는 기능
  autofocus?: boolean;
  errorMessage?: string;
}

export type KeyEvent = (typeof textFieldEvent)[keyof typeof textFieldEvent];

export interface TextFieldEmits {
  (event: 'update:modelValue', value: string): void;
  (event: 'blur', value: FocusEvent): void;
  (event: KeyEvent, value: KeyboardEvent): void;
}
