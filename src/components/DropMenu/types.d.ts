import type { dropMenuColor, dropMenuPosition, dropMenuTransition } from './const';

export type DropMenuColor = (typeof dropMenuColor)[keyof typeof dropMenuColor];
export type DropMenuPosition = (typeof dropMenuPosition)[keyof typeof dropMenuPosition];
export type DropMenuTransition = (typeof dropMenuTransition)[keyof typeof dropMenuTransition];

export interface DropMenuItem {
  /** 메뉴 아이템 텍스트 */
  text: string;
  /** 클릭 시 실행할 함수 */
  action: () => void;
  /** 아이콘 (Iconify 아이콘명) */
  icon?: string;
  /** 비활성화 여부 */
  disabled?: boolean;
}

export interface DropMenuProps {
  /** 드롭다운 메뉴 아이템 목록 */
  items: DropMenuItem[];
  /** 메뉴가 표시될 위치 */
  position?: DropMenuPosition;
  /** 애니메이션 효과 */
  transition?: DropMenuTransition;
  /** 메뉴 너비 (픽셀) */
  width?: number;
  /** 메뉴 색상 테마 */
  color?: DropMenuColor;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 자동 닫힘 비활성화 */
  disableAutoClose?: boolean;
}

export interface DropMenuEmits {
  (event: 'open'): void;
  (event: 'close'): void;
  (event: 'itemClick', item: DropMenuItem, index: number): void;
}
