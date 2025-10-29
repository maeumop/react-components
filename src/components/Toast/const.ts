export const toastColor = {
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  warning: 'warning',
  info: 'info',
  error: 'error',
} as const;

export const toastPosition = {
  top: 'top',
  bottom: 'bottom',
  topRight: 'top-right',
  topLeft: 'top-left',
  bottomRight: 'bottom-right',
  bottomLeft: 'bottom-left',
} as const;

export const toastDefaultOptions = {
  color: toastColor.success,
  duration: 3000,
  position: toastPosition.bottomRight,
} as const;
