/** 페이지네이션 기본 옵션 */
export const paginationDefaultOptions = {
  size: 20,
  block: 10,
  total: 0,
  disabled: false,
  ariaLabel: '페이지네이션',
  pageSizeOptions: [10, 20, 50, 100],
} as const;
