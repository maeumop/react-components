import { modalPosition, modalTransition } from './const';

export type ModalPosition = (typeof modalPosition)[keyof typeof modalPosition];
export type ModalTransition = (typeof modalTransition)[keyof typeof modalTransition];

export interface ModalModel {
  close(callback?: () => void): void;
}

export interface ModalProps {
  /** 모달 표시 여부 */
  modelValue: boolean;
  /** ESC 키로 닫기 가능 여부 */
  escClose?: boolean;
  /** 모달 위치 */
  position?: ModalPosition;
  /** 화면 전체 덮기 여부 */
  screenCover?: boolean;
  /** 모달 너비 */
  width?: string;
  /** 제목 */
  title?: string;
  /** 닫기 버튼 숨김 여부 */
  hideClose?: boolean;
  /** 뒤로가기 방지 여부 */
  accessBack?: boolean;
  /** 전체 화면 모달 여부 */
  fullscreen?: boolean;
}

export interface ModalEmits {
  /** 모달 표시 상태 변경 */
  'update:modelValue': [value: boolean];
  /** 모달 닫힘 */
  close: [];
}
