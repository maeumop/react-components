import type { badgeColor, badgePosition, badgeSize } from './const';

export type BadgeColor = (typeof badgeColor)[keyof typeof badgeColor];
export type BadgePosition = (typeof badgePosition)[keyof typeof badgePosition];
export type BadgeSize = (typeof badgeSize)[keyof typeof badgeSize];

export interface BadgeProps {
  /** 뱃지에 표시할 텍스트 */
  text?: string;
  /** 뱃지 색상 */
  color?: BadgeColor;
  /** 뱃지 크기 */
  size?: BadgeSize;
  /** 뱃지 위치 */
  position?: BadgePosition;
  /** 뱃지에 표시할 아이콘 (Iconify 아이콘명) */
  icon?: string;
  /** 뱃지가 표시될 요소의 클래스명 */
  wrapperClass?: string;
  /** 뱃지 자체의 클래스명 */
  badgeClass?: string;
}
