export const toastColor = {
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  warning: 'warning',
  info: 'info',
  error: 'error',
} as const;

export const toastIcon = {
  primary: 'mdi:check-circle-outline',
  secondary: 'mdi:check-circle-outline',
  success: 'mdi:check-circle-outline',
  warning: 'mdi:chat-alert',
  info: 'mdi:information-variant-circle-outline',
  error: 'mdi:close-octagon',
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
