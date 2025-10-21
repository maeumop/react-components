import type { ReactNode } from 'react';
import type { RuleFunc } from '../types';

export interface ValidateWrapProps {
  checkValue: string | string[] | number | number[];
  validate?: RuleFunc[];
  errorMessage?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  children: (props: { onBlur: () => void }) => ReactNode;
  addOn?: ReactNode;
  className?: string;
  resetValue?: () => void;
}

export interface ValidateWrapRef {
  check(silence?: boolean): boolean;
  resetForm(): void;
  resetValidate(): void;
}
