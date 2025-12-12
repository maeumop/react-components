import React, { useCallback, useMemo } from 'react';
import type { OptionItemProps, OptionListProps } from './types';
import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Search as SearchIcon,
  Autorenew as LoadingIcon,
} from '@mui/icons-material';

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
        {multiple &&
          (isSelected ? (
            <CheckBoxIcon className="checkbox" sx={{ width: 20, height: 20 }} />
          ) : (
            <CheckBoxOutlineBlankIcon className="checkbox" sx={{ width: 20, height: 20 }} />
          ))}
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
      <div className="option-list">
        {/* 검색 영역 */}
        {searchable && (
          <div className="search" onClick={e => e.stopPropagation()}>
            <div className="search-wrap">
              <input
                ref={searchInputRef}
                placeholder="검색어 입력"
                type="text"
                onChange={onSearchTextChange}
              />
              <SearchIcon sx={{ width: 28, height: 28 }} />
            </div>
          </div>
        )}

        {/* 옵션 리스트 */}
        <ul ref={optionListRef} className="scrollbar">
          {/* 전체 선택/해제 */}
          {multiple && !maxLength && !searchable && (
            <li className={optionItemClassName} onClick={onSelectAll}>
              {isSelectAll ? (
                <CheckBoxIcon className={checkBoxClassName} sx={{ width: 20, height: 20 }} />
              ) : (
                <CheckBoxOutlineBlankIcon
                  className={checkBoxClassName}
                  sx={{ width: 20, height: 20 }}
                />
              )}
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
              <LoadingIcon sx={{ width: 24, height: 24 }} />
            </li>
          )}
        </ul>

        {/* 적용 버튼 */}
        {btnAccept && (
          <a href="#" className="btn-accept" onClick={onAccept}>
            적용 + {selectedValueCount}
          </a>
        )}
      </div>
    );
  },
);

OptionList.displayName = 'OptionList';
