import type { statusSelectorColor, statusSelectorSize } from './const';

export type StatusSelectorColor = (typeof statusSelectorColor)[keyof typeof statusSelectorColor];
export type StatusSelectorSize = (typeof statusSelectorSize)[keyof typeof statusSelectorSize];

export interface StatusSelectorItem {
  /** 상태 텍스트 */
  text: string;
  /** 상태 값 */
  value: string;
  /** 상태 색상 */
  color: StatusSelectorColor | string;
}

export interface StatusSelectorProps {
  /** 현재 선택된 값 (v-model) */
  modelValue: string;
  /** 선택 가능한 옵션 목록 */
  options: StatusSelectorItem[];
  /** 원형 표시기 사용 여부 */
  circle?: boolean;
  /** 읽기 전용 모드 */
  readOnly?: boolean;
  /** 배경 색상 */
  bgColor?: string;
  /** 컴포넌트 크기 */
  size?: StatusSelectorSize;
}

export interface StatusSelectorEmits {
  (event: 'update:modelValue', value: string): void;
  (event: 'update:selectedIndex', value: number): void;
  (event: 'change', value: string, index: number): void;
}
