export const checkButtonColor = {
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
  light: 'light',
  dark: 'dark',
} as const;

export const checkButtonType = {
  checkbox: 'checkbox',
  radio: 'radio',
} as const;

export const checkButtonIcons = {
  radio: {
    checked: 'mdi:radiobox-marked',
    unchecked: 'mdi:radiobox-blank',
    disabled: 'mdi:circle',
  },
  checkbox: {
    checked: 'mdi:checkbox-marked',
    unchecked: 'mdi:checkbox-blank-outline',
    disabled: 'mdi:checkbox-blank',
  },
} as const;
