import type { MouseEventHandler, ReactNode } from 'react';
import type { IconComponent } from '../types';

export interface StyledButtonProps {
  href?: string;
  target?: string;
  btnStyle?: string;
  color?: string;
  block?: boolean;
  onlyIcon?: boolean;
  loading?: boolean;
  disabled?: boolean;
  iconRight?: boolean;
  small?: boolean;
  default?: boolean;
  large?: boolean;
  outline?: boolean;
  tag?: string;
  dropMenuToggle?: boolean;
  width?: string | number;
  icon?: IconComponent;
  children?: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLElement>;
}

export interface StyledButtonOptions {
  class: string[];
  onClick: (event: MouseEvent) => void;
  href?: string;
  target?: string;
  type?: string;
}
