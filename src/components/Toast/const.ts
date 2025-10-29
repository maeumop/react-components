export const toastColor = {
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  warning: 'warning',
  info: 'info',
  error: 'error',
} as const;

export const toastPosition = {
  topLeft: 'top-left',
  top: 'top',
  topRight: 'top-right',
  bottomLeft: 'bottom-left',
  bottom: 'bottom',
  bottomRight: 'bottom-right',
} as const;

export const toastDefaultOptions = {
  color: toastColor.success,
  duration: 3000,
  position: toastPosition.bottomRight,
} as const;
