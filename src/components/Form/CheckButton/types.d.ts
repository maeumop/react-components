import type { OptionItem, RuleFunc } from '../../types';
import type { checkButtonColor, checkButtonIcons, checkButtonType } from './const';

export type CheckButtonColor = (typeof checkButtonColor)[keyof typeof checkButtonColor];

export type CheckButtonType = (typeof checkButtonType)[keyof typeof checkButtonType];

export type CheckButtonIcons = typeof checkButtonIcons;

export type CheckButtonItem = OptionItem;

export interface CheckButtonProps {
  /** 선택 가능한 아이템 목록 */
  items: CheckButtonItem[];
  /** 폼 필드 이름 */
  name: string;
  /** 선택된 값 (v-model) */
  modelValue?: string | string[];
  /** 체크박스 또는 라디오 버튼 타입 */
  type?: CheckButtonType;
  /** 최대 체크 가능한 수량 (체크박스만 해당) */
  maxLength?: number;
  /** 유효성 검사 함수 배열 */
  validate?: RuleFunc[];
  /** 강제 에러 메시지 (검증 함수 실행하지 않음) */
  errorMessage?: string;
  /** 버튼 UI 모드 사용 여부 */
  button?: boolean;
  /** 전체 너비 사용 여부 */
  block?: boolean;
  /** 색상 테마 */
  color?: CheckButtonColor;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 라벨 텍스트 */
  label?: string;
  /** 필수 입력 여부 */
  required?: boolean;
  /** 라인 제한 (한 줄에 표시할 아이템 수) */
  lineLimit?: number;
  /** 전체 선택 버튼 추가 여부 */
  all?: boolean;
}

export interface CheckButtonModel {
  /** 유효성 검사 실행 */
  check(silence?: boolean): boolean;
  /** 폼 초기화 */
  resetForm(): void;
  /** 유효성 검사 상태 초기화 */
  resetValidate(): void;
}

export interface CheckButtonEmits {
  /** 값 업데이트 후 이벤트 */
  (event: 'update:after'): void;
  /** 모델 값 변경 이벤트 */
  (event: 'update:modelValue', value: string | string[]): void;
  /** 클릭된 인덱스 변경 이벤트 */
  (event: 'update:clickIndex', value: number): void;
}
