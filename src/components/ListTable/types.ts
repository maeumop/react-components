import type { ReactNode } from 'react';
import {
  listTableCellAlign,
  listTableFooterItemTag,
  listTableListCheckIconKeys,
  listTableListCheckType,
} from './const';

export type ListTableCellAlign = (typeof listTableCellAlign)[keyof typeof listTableCellAlign];
export type ListTableFooterItemTag =
  (typeof listTableFooterItemTag)[keyof typeof listTableFooterItemTag];
export type ListTableListCheckType =
  (typeof listTableListCheckType)[keyof typeof listTableListCheckType];
export type ListTableListCheckIconKeys =
  (typeof listTableListCheckIconKeys)[keyof typeof listTableListCheckIconKeys];
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
export interface ListTableProps<T = Record<string, unknown>> {
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
  onCheckedAll?: (checked: boolean) => void;
  onChecked?: (checked: boolean, index: number, items: T[]) => void;
  onObserve?: () => void;
  children?: (slot: { props: T; index: number; disabled: boolean }) => ReactNode;
}

/** 아이템 슬롯 Props */
export interface ListTableItemSlot<T = Record<string, unknown>> {
  /** 아이템 데이터 */
  props: T;
  /** 아이템 인덱스 */
  index: number;
  /** 비활성화 상태 */
  disabled: boolean;
}

/** 컴포넌트 Expose 메서드 (React에서는 ref로 대체) */
export interface ListTableExpose {
  observerStart: () => void;
  observerStop: () => void;
  checkedToggle: (bool?: boolean) => void;
}

/** 컴포넌트 이벤트 타입 (React에서는 콜백 props로 대체) */
export interface ListTableEmits<T = Record<string, unknown>> {
  onCheckedAll?: (checked: boolean) => void;
  onChecked?: (checked: boolean, index: number, items: T[]) => void;
  onObserve?: () => void;
}

/** 체크박스/라디오 Props */
export interface ListTableListCheckProps {
  modelValue?: boolean;
  value?: string;
  disabled?: boolean;
  type?: ListTableListCheckType;
  onChange?: (checked: boolean) => void;
}
