import type { switchButtonColor } from './const';

export type SwitchButtonColor = (typeof switchButtonColor)[keyof typeof switchButtonColor];

export interface SwitchButtonProps {
  value: string | boolean;
  onChange?: (value: string | boolean) => void;
  label?: string[]; // [0 => false label, 1 => true label]
  trueValue?: string | boolean;
  falseValue?: string | boolean;
  readonly?: boolean;
  checkbox?: boolean;
  color?: SwitchButtonColor;
  disabled?: boolean;
  validate?: string | ((value: unknown) => boolean | string);
}

export interface SwitchButtonModel {
  check: (silence?: boolean) => boolean;
  resetForm: () => void;
  resetValidate: () => void;
}
