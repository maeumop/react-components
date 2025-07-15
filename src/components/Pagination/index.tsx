import { Icon } from '@iconify/react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { paginationDefaultOptions } from './const';
import './style.scss';
import type { PaginationItem, PaginationProps } from './types';

/**
 * 페이지네이션 컴포넌트 (React)
 * 모든 props, 이벤트, 접근성, 키보드 네비게이션 지원
 */
const Pagination: React.FC<PaginationProps> = ({
  value,
  size = paginationDefaultOptions.size,
  block = paginationDefaultOptions.block,
  total = paginationDefaultOptions.total,
  disabled = paginationDefaultOptions.disabled,
  ariaLabel = paginationDefaultOptions.ariaLabel,
  pageSizeOptions = [...paginationDefaultOptions.pageSizeOptions],
  onChange,
  onPageSizeChange,
}) => {
  // 내부 상태
  const [pageList, setPageList] = useState<PaginationItem[]>([]);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [pageBlock, setPageBlock] = useState<number>(block ?? 10);
  // startPage, endPage 제거
  const [prev, setPrev] = useState<number>(0);
  const [next, setNext] = useState<number>(0);

  // 현재 페이지 계산
  const nowPage = useMemo(() => {
    let result = 1;

    if (value) {
      result = value;

      if (result < 1) {
        result = 1;
      } else if (result > maxPage) {
        result = maxPage;
      }
    }

    return result;
  }, [value, maxPage]);

  // 비활성화 상태 계산
  const isDisabledPrev = useMemo(() => Boolean(disabled) || nowPage <= 1, [disabled, nowPage]);
  const isDisabledNext = useMemo(
    () => Boolean(disabled) || nowPage >= maxPage,
    [disabled, nowPage, maxPage],
  );
  const isDisabledFirst = useMemo(() => Boolean(disabled) || nowPage <= 1, [disabled, nowPage]);
  const isDisabledLast = useMemo(
    () => Boolean(disabled) || nowPage >= maxPage,
    [disabled, nowPage, maxPage],
  );
  const totalPages = useMemo(() => Math.ceil((total ?? 1) / size), [total, size]);
  const startItem = useMemo(() => (nowPage - 1) * size + 1, [nowPage, size]);
  const endItem = useMemo(() => {
    const end = nowPage * size;

    if (end > total) {
      return total;
    }

    return end;
  }, [nowPage, size, total]);

  // 페이지 리스트 생성 함수
  const makePageList = useCallback(
    (now: number = nowPage) => {
      const list: PaginationItem[] = [];
      let max = totalPages;

      if (max <= 0) {
        max = 1;
      }

      setMaxPage(max);

      const start = Math.floor((now - 1) / pageBlock) * pageBlock + 1;
      let end = Math.min(start + pageBlock - 1, max);

      if (end === 0) {
        end = 1;
      }

      setPrev(Math.max(start - 1, 1));
      setNext(Math.min(start + pageBlock, max));

      for (let num = start; num <= end; num += 1) {
        list.push({ num, isOn: now === num });
      }

      setPageList(list);
    },
    [nowPage, pageBlock, totalPages],
  );

  // 페이지 변경
  const updateValue = useCallback(
    (v: number) => {
      if (disabled) {
        return;
      }

      const newPage = Math.max(1, Math.min(v, maxPage));

      if (newPage !== nowPage && typeof onChange === 'function') {
        onChange(newPage);
      }
    },
    [disabled, maxPage, nowPage, onChange],
  );

  // 페이지 크기 변경
  const handlePageSizeChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      if (onPageSizeChange) {
        const newSize = parseInt(event.target.value, 10);
        onPageSizeChange(newSize);
      }
    },
    [onPageSizeChange],
  );

  // 키보드 이벤트 처리
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, page: number) => {
      event.preventDefault();

      if (disabled) {
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        updateValue(page);
      } else if (event.key === 'ArrowLeft') {
        updateValue(nowPage - 1);
      } else if (event.key === 'ArrowRight') {
        updateValue(nowPage + 1);
      } else if (event.key === 'Home') {
        updateValue(1);
      } else if (event.key === 'End') {
        updateValue(maxPage);
      }
    },
    [disabled, updateValue, nowPage, maxPage],
  );

  // block prop 변경 시 pageBlock 동기화
  useEffect(() => {
    setPageBlock(block ?? 10);
  }, [block]);

  // total, size, block 변경 시 페이지 리스트 재생성
  useEffect(() => {
    makePageList();
  }, [total, size, pageBlock, makePageList, value]);

  // 최초 렌더링 시 페이지 리스트 생성
  useEffect(() => {
    makePageList(value);
  }, []);

  return (
    <nav className="pagination" aria-label={ariaLabel} role="navigation">
      {/* 페이지 정보 표시 */}
      {total > 0 && (
        <div className="pagination-info">
          <span className="pagination-text">
            {startItem} - {endItem} / {total}개 항목
          </span>
        </div>
      )}
      {/* 페이지네이션 컨트롤 */}
      <ul className="pagination-list" role="list">
        {/* 첫 페이지 */}
        <li className={`pagination-item${isDisabledFirst ? ' disabled' : ''}`} role="listitem">
          <button
            type="button"
            className="pagination-button"
            disabled={isDisabledFirst}
            aria-label="첫 페이지로 이동"
            onClick={() => updateValue(1)}
            onKeyDown={e => handleKeyDown(e, 1)}
          >
            <Icon icon="mdi:chevron-double-left" width="20" height="20" />
          </button>
        </li>
        {/* 이전 페이지 블록 */}
        <li className={`pagination-item${isDisabledPrev ? ' disabled' : ''}`} role="listitem">
          <button
            type="button"
            className="pagination-button"
            disabled={isDisabledPrev}
            aria-label={`이전 ${pageBlock}페이지로 이동`}
            onClick={() => updateValue(prev)}
            onKeyDown={e => handleKeyDown(e, prev)}
          >
            <Icon icon="mdi:chevron-left" width="20" height="20" />
          </button>
        </li>
        {/* 페이지 번호들 */}
        {pageList.map(item => (
          <li
            key={`page-${item.num}`}
            className={`pagination-item${item.isOn ? ' active' : ''}`}
            role="listitem"
          >
            <button
              type="button"
              className="pagination-button"
              aria-label={`${item.num}페이지로 이동`}
              aria-current={item.isOn ? 'page' : undefined}
              onClick={() => updateValue(item.num)}
              onKeyDown={e => handleKeyDown(e, item.num)}
            >
              {item.num}
            </button>
          </li>
        ))}
        {/* 다음 페이지 블록 */}
        <li className={`pagination-item${isDisabledNext ? ' disabled' : ''}`} role="listitem">
          <button
            type="button"
            className="pagination-button"
            disabled={isDisabledNext}
            aria-label={`다음 ${pageBlock}페이지로 이동`}
            onClick={() => updateValue(next)}
            onKeyDown={e => handleKeyDown(e, next)}
          >
            <Icon icon="mdi:chevron-right" width="20" height="20" />
          </button>
        </li>
        {/* 마지막 페이지 */}
        <li className={`pagination-item${isDisabledLast ? ' disabled' : ''}`} role="listitem">
          <button
            type="button"
            className="pagination-button"
            disabled={isDisabledLast}
            aria-label="마지막 페이지로 이동"
            onClick={() => updateValue(maxPage)}
            onKeyDown={e => handleKeyDown(e, maxPage)}
          >
            <Icon icon="mdi:chevron-double-right" width="20" height="20" />
          </button>
        </li>
      </ul>
      {/* 페이지 크기 선택 */}
      {pageSizeOptions.length > 0 && (
        <div className="pagination-size-selector">
          <label htmlFor="page-size" className="pagination-size-label">
            페이지당 항목:
          </label>
          <select
            id="page-size"
            className="pagination-size-select"
            value={size}
            onChange={handlePageSizeChange}
            disabled={disabled}
          >
            {pageSizeOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
    </nav>
  );
};

export default React.memo(Pagination);
