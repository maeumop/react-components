import type { ListTableListCheckIconType } from './types';

/**
 * ListCheck.vue checkbox icon 상수 (Iconify 형식)
 */
export const listTableCheckboxIcon: ListTableListCheckIconType = {
  disabled: 'mdi:checkbox-blank',
  checked: 'mdi:checkbox-marked',
  blank: 'mdi:checkbox-blank-outline',
} as const;

/**
 * ListCheck.vue radio icon 상수 (Iconify 형식)
 */
export const listTableRadioIcon: ListTableListCheckIconType = {
  disabled: 'mdi:circle',
  checked: 'mdi:radiobox-marked',
  blank: 'mdi:radiobox-blank',
} as const;

/**
 * ListTable 기본 옵션
 */
export const listTableDefaultOptions = {
  emptyText: '데이터가 없습니다.',
  loading: false,
  observer: false,
  header: [],
  footer: [],
} as const;

/**
 * 테이블 스타일 상수
 */
export const listTableStyleConstants = {
  headerHeight: '5rem',
  rowHeight: '5rem',
  padding: '1rem 1.6rem',
  fontSize: '1.4rem',
  headerFontWeight: 500,
  bodyFontWeight: 400,
} as const;
