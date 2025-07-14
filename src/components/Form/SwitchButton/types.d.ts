import type { switchButtonColor } from './const';

export type SwitchButtonColor = (typeof switchButtonColor)[keyof typeof switchButtonColor];

export interface SwitchButtonProps {
  modelValue: string | boolean;
  label?: string[]; // [0 => false label, 1 => true label]
  trueValue?: string | boolean;
  falseValue?: string | boolean;
  readonly?: boolean;
  checkbox?: boolean;
  color?: SwitchButtonColor;
  disabled?: boolean;
  validate?: string | ((value: unknown) => boolean | string);
}

export interface SwitchButtonEmits {
  (event: 'update:modelValue', value: string | boolean): void;
  (event: 'update:after'): void;
}

export interface SwitchButtonModel {
  check(silence?: boolean): void;
  resetForm(): void;
  resetValidate(): void;
}
