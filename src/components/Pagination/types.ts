/** 페이지네이션 Props (React용) */
export interface PaginationProps {
  /** 현재 페이지 번호 (controlled) */
  value: number;
  /** 한 페이지당 데이터 수량 */
  size?: number;
  /** 표시할 페이지 번호 개수 */
  block?: number;
  /** 데이터의 총 수량 */
  total?: number;
  /** 비활성화 상태 */
  disabled?: boolean;
  /** 페이지 크기 옵션 */
  pageSizeOptions?: number[];
  /** 페이지 변경 핸들러 */
  onChange?: (page: number) => void;
  /** 페이지 크기 변경 핸들러 */
  onPageSizeChange?: (size: number) => void;
}

/** 페이지네이션 아이템 */
export interface PaginationItem {
  /** 페이지 번호 */
  num: number;
  /** 현재 페이지 여부 */
  isOn: boolean;
}
