import type { buttonColors, buttonSizes, buttonStyles } from './const';

export type ButtonColors = (typeof buttonColors)[keyof typeof buttonColors];
export type ButtonSizes = (typeof buttonSizes)[keyof typeof buttonSizes];
export type ButtonStyles = (typeof buttonStyles)[keyof typeof buttonStyles];

export interface StyledButtonProps {
  color?: ButtonColors;
  class?: string;
  href?: string;
  target?: string;
  style?: ButtonStyles;
  icon?: string;
  iconRight?: boolean;
  onlyIcon?: boolean;
  block?: boolean;
  loading?: boolean;
  disabled?: boolean;
  small?: boolean;
  default?: boolean;
  large?: boolean;
  outline?: boolean;
  tag?: string;
  dropMenuToggle?: boolean;
  width?: string | number;
}

export interface StyledButtonOptions {
  class: string[];
  onClick: (event: MouseEvent) => void;
  href?: string;
  target?: string;
  type?: string;
}
