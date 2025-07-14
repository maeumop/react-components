import type { ComponentPublicInstance } from 'vue';

export type ListTableCellAlign = 'left' | 'center' | 'right';
export type ListTableFooterItemTag = 'td' | 'th';

export type ListTableListCheckType = 'checkbox' | 'radio';

export type ListTableListCheckIconKeys = 'disabled' | 'checked' | 'blank';
export type ListTableListCheckIconType = { [K in ListTableListCheckIconKeys]: string };

// 목록 최상단 라벨링 Array:[{text: string, width: string, colspan: number, align: 'left' | 'center' | 'right'}] *
export interface ListTableHeader {
  /** 컬럼 제목 */
  text: string;
  /** 컬럼 너비 */
  width?: string;
  /** 텍스트 정렬 */
  align?: ListTableCellAlign;
  /** 컬럼 병합 */
  colspan?: number;
}

/** 테이블 데이터 아이템 기본 인터페이스 */
export interface ListTableItem {
  /** 고유 식별자 */
  id: string | number;
  /** 추가 데이터 */
  [key: string]: unknown;
}

export interface ListTableFooter {
  /** 컬럼 병합 */
  colspan?: number;
  /** 텍스트 정렬 */
  align?: ListTableCellAlign;
  /** HTML 태그 */
  tag?: ListTableFooterItemTag;
  /** 푸터 텍스트 */
  text: string | number;
}

/** ListTable Props */
export interface ListTableProps<T extends ListTableItem = ListTableItem> {
  /** 테이블 헤더 */
  header?: ListTableHeader[];
  /** 테이블 푸터 */
  footer?: ListTableFooter[];
  /** 빈 데이터 메시지 */
  emptyText?: string;
  /** 테이블 너비 */
  width?: string;
  /** 테이블 높이 */
  height?: string;
  /** 스크롤 감지 활성화 */
  observer?: boolean;
  /** 로딩 상태 */
  loading?: boolean;
  /** 테이블 데이터 */
  items: T[];
  /** 체크 모드 */
  checkMode?: ListTableListCheckType;
  /** 비활성화 필터 함수 */
  disableFilter?: (item: T, index: number) => boolean;
}

/** 아이템 슬롯 Props */
export interface ListTableItemSlot<T extends ListTableItem = ListTableItem> {
  /** 아이템 데이터 */
  props: T;
  /** 아이템 인덱스 */
  index: number;
  /** 비활성화 상태 */
  disabled: boolean;
}

/** 컴포넌트 Expose 메서드 */
export interface ListTableExpose {
  /** 스크롤 감지 시작 */
  observerStart: () => void;
  /** 스크롤 감지 중지 */
  observerStop: () => void;
  /** 전체 체크 토글 */
  checkedToggle: (bool?: boolean) => void;
}

/** Template Ref 타입 */
export type ListTableModel<T extends ListTableItem = ListTableItem> = ComponentPublicInstance<
  ListTableProps<T>
> &
  ListTableExpose;

/** 컴포넌트 Events */
export interface ListTableEmits<T extends ListTableItem = ListTableItem> {
  /** 전체 체크 이벤트 */
  (event: 'checkedAll', value: boolean): void;
  /** 개별 체크 이벤트 */
  (event: 'checked', value: boolean, index: number, items: T[]): void;
  /** 스크롤 감지 이벤트 */
  (event: 'observe'): void;
}

/** 체크박스 Props */
export interface ListTableListCheckProps {
  /** 체크 상태 */
  modelValue?: boolean;
  /** 값 */
  value?: string;
  /** 비활성화 상태 */
  disabled?: boolean;
  /** 체크 타입 */
  type?: ListTableListCheckType;
}
