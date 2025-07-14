export interface SpinnerModel {
  timeout: (limit: number) => this;
  show: (msg?: string) => void;
  delay: (sec: number) => this;
  hide: () => void;
  close: () => void;
  setColor: (color: SpinnerColor) => this;
}

export interface SpinnerProps {
  limitTime?: number;
  destroy: () => void;
  color?: SpinnerColor;
}

export interface SpinnerExpose {
  show: (msg: string) => void;
  hide: () => void;
  close: () => void;
  delay: Ref<number>;
  setColor: (color: SpinnerColor) => void;
}

// 색상 테마 타입
export type SpinnerColor = (typeof spinnerColor)[keyof typeof spinnerColor];

// 플러그인 옵션 타입
export interface SpinnerOptions {
  limitTime?: number;
  color?: SpinnerColor;
}

export type SpinnerStatus = (typeof spinnerStatus)[keyof typeof spinnerStatus];
