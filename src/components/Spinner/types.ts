import { spinnerColor } from './const';

export type SpinnerColor = (typeof spinnerColor)[keyof typeof spinnerColor];
export interface SpinnerOptions {
  limitTime?: number;
  color?: SpinnerColor;
}

export interface SpinnerContextType {
  spinnerShow: (msg?: string, options?: SpinnerOptions) => void;
  spinnerHide: () => void;
  isLoading: boolean;
}
