export interface RuleFunc {
  (v: string | string[] | number | number[]): string | boolean;
}

// validate rule type
export interface Rules {
  [index: string]: RuleFunc[];
}

export interface UseValidationProps<T = unknown> {
  validate: RuleFunc[];
  errorMessage?: string;
  disabled?: boolean;
  value?: T;
  onValidationChange?: (isValid: boolean, message: string) => void;
}

export interface UseValidationReturn<T = unknown> {
  message: string;
  errorTransition: boolean;
  check: (value: T, silence?: boolean) => boolean;
  resetValidate: () => void;
  setMessage: (message: string) => void;
  setErrorTransition: (errorTransition: boolean) => void;
  validateValue: (value: T) => Promise<boolean>;
}
