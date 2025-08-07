import type { RuleFunc } from '../types';

export interface OptionItem {
  text: string;
  value: string;
}

export type SelectBoxItem = OptionItem;

export interface SelectBoxProps {
  value: string | string[];
  options: SelectBoxItem[];
  label?: string;
  inLabel?: boolean;
  placeholder?: string;
  block?: boolean;
  validate?: RuleFunc[];
  errorMessage?: string;
  width?: string;
  multiple?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  required?: boolean;
  isShort?: boolean;
  btnAccept?: boolean;
  labelText?: boolean;
  maxLength?: number;
  searchable?: boolean;
  hideMessage?: boolean;
  blurValidate?: boolean;
  clearable?: boolean;
  isLoading?: boolean;
  // onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void;
  // onFocus?: (e: React.FocusEvent<HTMLDivElement>) => void;
  onChange?: (value: string | string[]) => void;
  onChangeIndex?: (index: number) => void;
  onAfterChange?: (value: string | string[]) => void;
}

export interface SelectBoxModel {
  check(silence?: boolean): boolean;
  resetForm(): void;
  resetValidate(): void;
}

// 전체 옵션 목록 컴포넌트
export interface OptionListProps {
  // 옵션 데이터
  optionList: OptionItem[];
  multiple: boolean;
  searchable: boolean;
  maxLength: number;
  isLoading: boolean;
  btnAccept: boolean;

  // 선택 상태
  selectedValue: string | string[];
  selectedKeyIndex: number;
  isSelectAll: boolean;

  // 이벤트 핸들러
  onSelectOption: (value: string, index: number, e: React.MouseEvent<HTMLLIElement>) => void;
  onSelectAll: (e: React.MouseEvent<HTMLLIElement>) => void;
  onAccept: (e: React.MouseEvent<HTMLAnchorElement>) => void;

  // 검색 관련
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
  onSearchTextChange?: (evt: React.FormEvent<HTMLInputElement>) => void;

  // 유틸리티 함수
  isOptionSelected: (value: string) => boolean;
  isOptionFocused: (index: number) => boolean;

  // ref 전달
  optionListRef?: React.RefObject<HTMLUListElement | null>;
}

// 옵션 아이템 컴포넌트
export interface OptionItemProps {
  item: OptionItem;
  index: number;
  multiple: boolean;
  isSelected: boolean;
  isFocused: boolean;
  onSelect: (value: string, index: number, e: React.MouseEvent<HTMLLIElement>) => void;
}
