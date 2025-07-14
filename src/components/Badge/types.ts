import type { ReactNode } from 'react';
import type { badgeColor, badgePosition, badgeSize } from './const';

export type BadgeColor = (typeof badgeColor)[keyof typeof badgeColor];
export type BadgePosition = (typeof badgePosition)[keyof typeof badgePosition];
export type BadgeSize = (typeof badgeSize)[keyof typeof badgeSize];

export interface BadgeProps {
  color?: string;
  position?: string;
  size?: string;
  text?: string | number;
  icon?: string;
  wrapperClass?: string;
  badgeClass?: string;
  children?: ReactNode;
  style?: React.CSSProperties;
}
