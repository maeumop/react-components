export const statusSelectorColor = {
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
} as const;

export const statusSelectorSize = {
  small: 'small',
  medium: 'medium',
  large: 'large',
} as const;

export const statusSelectorDefaultOptions = {
  circle: false,
  readOnly: false,
  bgColor: '#efefef',
  size: 'medium',
} as const;
