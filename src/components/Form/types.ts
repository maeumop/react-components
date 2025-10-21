export interface RuleFunc {
  (v: string | string[] | number | number[]): string | boolean;
}

export interface UseValidationProps<T = unknown> {
  validate?: RuleFunc[];
  errorMessage?: string;
  disabled?: boolean;
  value?: T;
  onValidationChange?: (isValid: boolean, message: string) => void;
}

export interface UseValidationReturn {
  message: string;
  errorTransition: boolean;
  check: (silence?: boolean) => boolean;
  resetValidate: () => void;
  setMessage: (message: string) => void;
  setErrorTransition: (errorTransition: boolean) => void;
  validateValue: () => Promise<boolean>;
}
