import type { badgeColor, badgePosition, badgeSize } from './const';
import type { IconComponent } from '../types';

export type BadgeColor = (typeof badgeColor)[keyof typeof badgeColor];
export type BadgePosition = (typeof badgePosition)[keyof typeof badgePosition];
export type BadgeSize = (typeof badgeSize)[keyof typeof badgeSize];

export interface BadgeProps {
  color?: string;
  position?: string;
  size?: BadgeSize;
  text?: string | number;
  icon?: IconComponent;
  wrapperClass?: string;
  badgeClass?: string;
  style?: React.CSSProperties;
}
