// 색상 테마 클래스 정의 (assets 색상 테마 클래스 사용)
export const spinnerColor = {
  default: 'default',
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
} as const;

// 기본 설정
export const spinnerDefaultOptions = {
  limitTime: 10,
  color: 'default',
} as const;

export const spinnerStatus = {
  hidden: 'hidden',
  showing: 'showing',
  hiding: 'hiding',
} as const;
