import type { IconComponent } from '@/components/types';
import type { RuleFunc } from '../types';
import { textFieldType } from './const';

export type TextFieldType = (typeof textFieldType)[keyof typeof textFieldType];

export interface TextFieldProps {
  value: string;
  onChange?: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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
  icon?: IconComponent;
  iconLeft?: boolean;
  iconAction?: (event: React.MouseEvent) => void;
  clearable?: boolean;
  autofocus?: boolean;
  errorMessage?: string;
  className?: string;
}

export interface TextFieldModel {
  check: (silence?: boolean) => boolean;
  resetForm: () => void;
  resetValidate: () => void;
}
