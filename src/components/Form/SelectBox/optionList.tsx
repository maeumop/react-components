import { Icon } from '@iconify/react';
import React, { useCallback, useMemo } from 'react';
import type { OptionItemProps, OptionListProps } from './types';

const OptionItemList = React.memo<OptionItemProps>(
  ({ item, index, multiple, isSelected, isFocused, onSelect }) => {
    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLLIElement>) => {
        onSelect(item.value, index, e);
      },
      [item.value, index, onSelect],
    );

    const className = useMemo(
      () => ['option-item', isSelected && 'selected', isFocused && 'key-selected'].join(' '),
      [isSelected, isFocused],
    );

    return (
      <li className={className} onClick={handleClick}>
        {multiple && (
          <Icon
            className="checkbox"
            icon={isSelected ? 'mdi:checkbox-marked' : 'mdi:checkbox-blank-outline'}
            width={20}
            height={20}
          />
        )}
        {item.text}
      </li>
    );
  },
);

OptionItemList.displayName = 'OptionItemComponent';

export const OptionList = React.memo<OptionListProps>(
  ({
    optionList,
    multiple,
    searchable,
    maxLength,
    isLoading,
    btnAccept,
    selectedValue,
    selectedKeyIndex,
    isSelectAll,
    onSelectOption,
    onSelectAll,
    onAccept,
    searchInputRef,
    onSearchTextChange,
    isOptionSelected,
    isOptionFocused,
    optionListRef,
  }) => {
    const selectedValueCount = useMemo(
      () => (Array.isArray(selectedValue) ? selectedValue.length : 0),
      [selectedValue],
    );

    const optionItemClassName = useMemo(
      () => ['option-item', selectedKeyIndex === 0 && !searchable ? 'key-selected' : ''].join(' '),
      [selectedKeyIndex, searchable],
    );

    const checkBoxClassName = useMemo(
      () => ['checkbox', isSelectAll && 'checked'].join(' '),
      [isSelectAll],
    );

    return (
      <>
        {/* 검색 영역 */}
        {searchable && (
          <div className="search" onClick={e => e.stopPropagation()}>
            <div className="search-wrap">
              <input
                ref={searchInputRef}
                placeholder="검색어 입력"
                type="text"
                onInput={onSearchTextChange}
              />
              <Icon icon="mdi:magnify" width={28} height={28} />
            </div>
          </div>
        )}

        {/* 옵션 리스트 */}
        <ul ref={optionListRef} className="scrollbar">
          {/* 전체 선택/해제 */}
          {multiple && !maxLength && !searchable && (
            <li className={optionItemClassName} onClick={onSelectAll}>
              <Icon
                className={checkBoxClassName}
                icon={isSelectAll ? 'mdi:checkbox-marked' : 'mdi:checkbox-blank-outline'}
                width={20}
                height={20}
              />
              {isSelectAll ? '전체 해제' : '전체 선택'}
            </li>
          )}

          {/* 옵션 아이템들 */}
          {optionList.length ? (
            optionList.map((item, i) => (
              <OptionItemList
                key={`select-${item.value}`}
                item={item}
                index={i}
                multiple={multiple}
                isSelected={isOptionSelected(item.value)}
                isFocused={isOptionFocused(i)}
                onSelect={onSelectOption}
              />
            ))
          ) : (
            <li className="empty-option-item">검색된 내용이 없습니다.</li>
          )}

          {/* 로딩 상태 */}
          {isLoading && (
            <li className="items-loading">
              <Icon icon="mdi:google-circles-extended" width={24} height={24} />
            </li>
          )}
        </ul>

        {/* 적용 버튼 */}
        {btnAccept && (
          <a href="#" className="btn-accept" onClick={onAccept}>
            적용 + {selectedValueCount}
          </a>
        )}
      </>
    );
  },
);

OptionList.displayName = 'OptionList';
