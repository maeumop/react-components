import type { ForwardedRef, JSX } from 'react';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { listTableDefaultOptions } from './const';
import ListTableCheck from './listCheck';
import './style.scss';
import TableSpinner from './tableSpinner';
import type { ListTableExpose, ListTableItem, ListTableProps } from './types';

/**
 * ListTable 컴포넌트 (메인 테이블)
 */
const ListTableInner = <T extends ListTableItem = ListTableItem>(
  {
    items = [],
    header = [],
    footer = [],
    emptyText = listTableDefaultOptions.emptyText,
    loading = listTableDefaultOptions.loading,
    observer = listTableDefaultOptions.observer,
    width,
    height,
    checkMode,
    disableFilter,
    onCheckedAll,
    onChecked,
    onObserve,
    children,
  }: ListTableProps<T>,
  ref: ForwardedRef<ListTableExpose>,
) => {
  // 내부 상태
  const [checkedAll, setCheckedAll] = useState(false);
  const [checkedIndexList, setCheckedIndexList] = useState<number[]>([]);
  const [dataList, setDataList] = useState<T[]>(items);
  const [isObserving, setIsObserving] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  // 스타일
  const tableWidth = useMemo<CSSProperties>(() => (width ? { width } : {}), [width]);
  const tableHeight = useMemo<CSSProperties>(() => (height ? { height } : {}), [height]);

  // 체크 모드 여부
  const isCheckMode = useMemo(() => checkMode === 'checkbox' || checkMode === 'radio', [checkMode]);

  // 선택 가능한 인덱스
  const selectableIndices = useMemo(
    () =>
      items.map((_, idx) => idx).filter(idx => !(disableFilter && disableFilter(items[idx], idx))),
    [items, disableFilter],
  );

  // 전체 선택 여부
  const isAllSelectableChecked = useMemo(() => {
    if (selectableIndices.length === 0) return false;
    return selectableIndices.every(idx => checkedIndexList.includes(idx));
  }, [selectableIndices, checkedIndexList]);

  // 선택된 아이템
  const checkedItems = useMemo(
    () => items.filter((_, idx) => checkedIndexList.includes(idx)),
    [items, checkedIndexList],
  );

  // 체크박스 전체 토글
  const handleCheckAll = useCallback(
    (checked: boolean) => {
      if (checkMode !== 'checkbox') {
        if (!checked) {
          setCheckedIndexList([]);
          setCheckedAll(false);
          onCheckedAll?.(false);
        }
        return;
      }
      setCheckedIndexList(checked ? [...selectableIndices] : []);
      setCheckedAll(checked);
      onCheckedAll?.(checked);
    },
    [checkMode, selectableIndices, onCheckedAll],
  );

  // 개별 체크 토글
  const handleCheckItem = useCallback(
    (index: number, checked: boolean) => {
      if (index < 0 || index >= dataList.length) return;
      const disabled = disableFilter && disableFilter(dataList[index], index);
      if (disabled && checked) return;
      if (checkMode === 'radio') {
        setCheckedIndexList(checked ? [index] : []);
        setCheckedAll(false);
        onChecked?.(checked, index, checked ? [items[index]] : []);
        return;
      }
      setCheckedIndexList(prev => {
        const set = new Set(prev);
        if (checked) set.add(index);
        else set.delete(index);
        return Array.from(set);
      });
    },
    [checkMode, dataList, disableFilter, items, onChecked],
  );

  // 체크 상태 변경 시 콜백
  useEffect(() => {
    if (checkMode === 'checkbox') {
      setCheckedAll(isAllSelectableChecked);
    }
    if (onChecked && checkedIndexList.length > 0) {
      onChecked(false, -1, checkedItems);
    }
  }, [checkedIndexList]);

  // 데이터 변경 감지
  useEffect(() => {
    setDataList(items);
  }, [items]);

  // Intersection Observer
  useEffect(() => {
    if (!observer || !observerRef.current || isObserving) return;
    const obs = new window.IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            onObserve?.();
          }
        });
      },
      { threshold: 0.1 },
    );
    obs.observe(observerRef.current);
    setIsObserving(true);
    return () => {
      obs.disconnect();
      setIsObserving(false);
    };
  }, [observer, onObserve, isObserving]);

  // Expose 메서드 (ref)
  useImperativeHandle(
    ref,
    () => ({
      observerStart: () => setIsObserving(true),
      observerStop: () => setIsObserving(false),
      checkedToggle: (bool?: boolean) => handleCheckAll(!!bool),
    }),
    [handleCheckAll],
  );

  // 렌더 함수
  return (
    <div className="list-table" style={tableHeight}>
      <table style={tableWidth}>
        {/* 헤더 */}
        <thead>
          <tr>
            {isCheckMode && (
              <th style={{ width: 50 }}>
                {checkMode === 'checkbox' && (
                  <ListTableCheck
                    type="checkbox"
                    modelValue={checkedAll}
                    disabled={loading}
                    onChange={handleCheckAll}
                  />
                )}
              </th>
            )}
            {header.map((item, idx) => (
              <th
                key={idx}
                style={{ width: item.width, textAlign: item.align || 'left' }}
                colSpan={item.colspan}
              >
                {item.text}
              </th>
            ))}
          </tr>
        </thead>
        {/* 바디 */}
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={header.length + (isCheckMode ? 1 : 0)}>
                <TableSpinner />
              </td>
            </tr>
          ) : dataList.length === 0 ? (
            <tr>
              <td colSpan={header.length + (isCheckMode ? 1 : 0)} className="no-data">
                {emptyText}
              </td>
            </tr>
          ) : (
            dataList.map((item, idx) => {
              const disabled = disableFilter ? disableFilter(item, idx) : false;
              return (
                <tr key={item.id} className={disabled ? 'disabled' : ''}>
                  {isCheckMode && (
                    <td>
                      <ListTableCheck
                        type={checkMode}
                        modelValue={checkedIndexList.includes(idx)}
                        disabled={disabled}
                        onChange={checked => handleCheckItem(idx, checked)}
                      />
                    </td>
                  )}
                  {/* children: render props 패턴만 지원 */}
                  {children && typeof children === 'function'
                    ? children({ props: item, index: idx, disabled })
                    : null}
                </tr>
              );
            })
          )}
        </tbody>
        {/* 푸터 */}
        {footer.length > 0 && (
          <tfoot>
            <tr>
              {footer.map((item, idx) => {
                const Tag = (item.tag || 'td') as keyof JSX.IntrinsicElements;
                return React.createElement(
                  Tag as keyof JSX.IntrinsicElements,
                  {
                    key: idx,
                    colSpan: item.colspan,
                    style: { textAlign: item.align || 'left' },
                  },
                  item.text,
                );
              })}
            </tr>
          </tfoot>
        )}
      </table>
      {/* 무한 스크롤 감지용 엘리먼트 */}
      {observer && <div ref={observerRef} className="observer-target" />}
    </div>
  );
};

const ListTable = React.memo(forwardRef(ListTableInner)) as <
  T extends ListTableItem = ListTableItem,
>(
  props: ListTableProps<T> & { ref?: ForwardedRef<ListTableExpose> },
) => JSX.Element;

// displayName을 ListTable에 명시적으로 할당
Object.assign(ListTable, { displayName: 'ListTable' });

export default ListTable;
