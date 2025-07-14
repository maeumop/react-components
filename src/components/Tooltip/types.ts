import type { tooltipColor, tooltipPosition } from './const';

export interface TooltipModel {
  close(): void;
}

export type TooltipPosition = (typeof tooltipPosition)[keyof typeof tooltipPosition];

export type TooltipColor = (typeof tooltipColor)[keyof typeof tooltipColor];

export interface TooltipProps {
  /** 툴팁 메시지 (문자열 또는 문자열 배열) */
  message?: string | string[];
  /** 툴팁 제목 (선택사항) */
  title?: string;
  /** 툴팁 위치 */
  position?: TooltipPosition;
  /** 호버링 모드 활성화 */
  hovering?: boolean;
  /** 닫기 버튼 표시 */
  btnClose?: boolean;
  /** 블록 레벨 요소로 표시 */
  block?: boolean;
  /** 툴팁 색상 테마 */
  color?: TooltipColor;
  /** 다크 테마 적용 */
  dark?: boolean;
  /** 툴팁 너비 (픽셀) */
  width?: number;
  /** 툴팁 패딩 */
  padding?: string;
}

export interface TooltipSlots {
  /** 기본 슬롯 - 툴팁이 감쌀 요소 */
  default: (props: { toggle: () => void }) => unknown;
  /** 커스텀 내용 슬롯 */
  content: (props: { close: () => void }) => unknown;
}

export interface TooltipEmits {
  /** 툴팁 표시 상태 변경 */
  (e: 'update:show', value: boolean): void;
}
