import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { useValidation } from '../hooks';
import type { OptionItem, SelectBoxProps } from './types';
import type { RuleFunc } from '../types';
import { useComponentHelper } from '@/components/helper';
import { layerPosition } from '@/components/const';

// 스크롤 가능한 상위 요소들을 찾기
const findScrollableParents = (element: HTMLElement): HTMLElement[] => {
  const scrollableParents: HTMLElement[] = [];
  let current = element.parentElement;

  while (current && current !== document.body) {
    const computedStyle = window.getComputedStyle(current);
    const overflow = computedStyle.overflow + computedStyle.overflowY + computedStyle.overflowX;

    if (
      overflow.includes('auto') ||
      overflow.includes('scroll') ||
      current.scrollHeight > current.clientHeight
    ) {
      scrollableParents.push(current);
    }

    current = current.parentElement;
  }

  return scrollableParents;
};

export const useSelectBox = (props: SelectBoxProps) => {
  const {
    value,
    options,
    block = false,
    validate = [],
    errorMessage = '',
    width,
    multiple = false,
    readonly = false,
    disabled = false,
    btnAccept = false,
    maxLength = 0,
    searchable = false,
    blurValidate = true,
    clearable = false,
    isLoading = false,
    className,
    thin = false,
    onChange,
    onChangeIndex,
    onAfterChange,
  } = props;
  const isMounted = useRef<boolean>(false);

  // 반응형 상태
  const [isShowOption, setIsShowOption] = useState<boolean>(false);

  // 선택된 값들
  const [selectedText, setSelectedText] = useState<string | string[]>(multiple ? [] : '');
  const [selectedValue, setSelectedValue] = useState<string | string[]>(multiple ? [] : '');

  // 유효성 검사 훅 사용
  const {
    message,
    errorTransition,
    check,
    resetValidate,
    validateValue,
    setMessage,
    setErrorTransition,
  } = useValidation<string | string[]>({
    validate,
    errorMessage,
    disabled,
    value: selectedValue,
  });

  // 검색 텍스트
  const [searchText, setSearchText] = useState<string>('');

  // DOM 참조
  const selectBoxRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionContainerRef = useRef<HTMLDivElement>(null);
  const optionListRef = useRef<HTMLUListElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  // 레이어 위치 스타일
  const [layerPositionStyle, setLayerPositionStyle] = useState<React.CSSProperties>({});
  const [position, setPosition] = useState<'top' | 'bottom'>('bottom');

  // 인라인 스타일 메모이제이션
  const containerStyle = useMemo<React.CSSProperties>(() => (width ? { width } : {}), [width]);

  const [selectedKeyIndex, setSelectedKeyIndex] = useState<number>(0);

  // 이벤트 리스너 참조 (메모리 누수 방지) - useRef로 변경
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollEventListenersRef = useRef<
    Array<{
      element: HTMLElement | Window;
      listener: () => void;
    }>
  >([]);
  const scrollObserverRef = useRef<IntersectionObserver | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const scrollTimeoutRef = useRef<number | null>(null);

  // 옵션 리스트 (메모이제이션 적용)
  const optionList = useMemo(() => {
    if (searchable) {
      return options.filter(({ text }) => text.toLowerCase().includes(searchText.toLowerCase()));
    }

    return options;
  }, [searchable, options, searchText]);

  const isSelectAll = useMemo<boolean>(() => {
    if (!multiple || !Array.isArray(selectedValue)) {
      return false;
    }

    return optionList.length > 0 && optionList.every(item => selectedValue.includes(item.value));
  }, [multiple, optionList, selectedValue]);

  // 선택된 텍스트 배열 반환
  const getShowText = useMemo<string[]>(() => {
    if (btnAccept) {
      return Array.isArray(selectedText) ? selectedText : [selectedText];
    }

    const values: string[] = Array.isArray(value) ? value : [value];

    return options.filter(item => values.includes(item.value)).map(({ text }) => text);
  }, [btnAccept, options, selectedText, value]);

  // 클리어 버튼 표시 여부
  const clearButtonShow = useMemo<boolean>(() => {
    if (!clearable || disabled || readonly) return false;
    if (Array.isArray(value)) return value.length > 0;
    return !!value;
  }, [clearable, disabled, readonly, value]);

  const iconClassName = useMemo<string>(
    () => ['arrow', isShowOption ? 'rotate' : ''].join(' ').trim(),
    [isShowOption],
  );

  // 컨테이너 클래스명 메모이제이션
  const containerClassName = useMemo<string>(
    () => ['select-box', block ? 'block' : '', className].join(' ').trim(),
    [block, className],
  );

  // 피드백 상태 클래스
  const feedbackStatus = useMemo<string>(
    () => ['description', errorTransition ? 'error' : ''].join(' ').trim(),
    [errorTransition],
  );

  // 컨트롤러 클래스
  const controllerClassName = useMemo<string>(() => {
    return [
      'control-wrap',
      disabled ? 'disabled' : '',
      readonly ? 'readonly' : '',
      message ? 'error' : '',
      isShowOption ? 'active' : '',
      thin ? 'thin' : '',
    ]
      .join(' ')
      .trim();
  }, [disabled, readonly, message, isShowOption]);

  const setDefaultModelValue = useCallback((): void => {
    if (multiple) {
      setSelectedText([]);
    } else {
      setSelectedText('');
    }

    options.forEach(item => {
      if (multiple && Array.isArray(value) && value.includes(item.value)) {
        setSelectedText(prev => (Array.isArray(prev) ? [...prev, item.text] : [item.text]));
      } else if (value === item.value) {
        setSelectedText(item.text);
        setSelectedValue(item.value);
      }
    });
  }, [value, multiple, options]);

  const updateValue = useCallback(
    async (v: string | string[], index: number = -1): Promise<void> => {
      onChange?.(v);
      onChangeIndex?.(index);
      onAfterChange?.(v);

      // 사용자 상호작용으로 인한 값 변경이므로 유효성 검사 실행
      await validateValue();
    },
    [onChange, onChangeIndex, onAfterChange, validateValue],
  );

  const resetForm = useCallback((): void => {
    resetValidate();

    if (multiple) {
      setSelectedText([]);
      setSelectedValue([]);
      onChange?.([]);
    } else {
      setSelectedText('');
      setSelectedValue('');
      onChange?.('');
    }
  }, [multiple, onChange]);

  const selectOption = useCallback(
    (v: string, index: number, e: React.MouseEvent<HTMLLIElement> | null = null): void => {
      if (e !== null) {
        e.stopPropagation();
      }

      const selectedItem = options[index];

      if (!selectedItem) {
        return;
      }

      let newSelectedValue: string | string[];
      let newSelectedText: string | string[];

      if (multiple && Array.isArray(selectedValue) && Array.isArray(selectedText)) {
        const indexOf: number = selectedValue.indexOf(v);

        if (indexOf > -1) {
          newSelectedValue = selectedValue.filter((_, i) => i !== indexOf);
          newSelectedText = selectedText.filter((_, i) => i !== indexOf);
        } else {
          newSelectedValue = [...selectedValue, v];
          newSelectedText = [...selectedText, selectedItem.text];
        }
      } else {
        newSelectedValue = v;
        newSelectedText = selectedItem.text;
      }

      // 상태 업데이트
      setSelectedValue(newSelectedValue);
      setSelectedText(newSelectedText);

      if (!btnAccept) {
        updateValue(newSelectedValue, index);
      }

      if (!multiple) {
        setIsShowOption(false);
      }
    },
    [btnAccept, multiple, options, selectedValue, selectedText, updateValue],
  );

  const isOptionSelected = useCallback(
    (v: string): boolean => {
      if (multiple && Array.isArray(selectedValue)) {
        return selectedValue.includes(v);
      }

      return selectedValue === v;
    },
    [multiple, selectedValue],
  );

  const removeSelected = useCallback(
    (index: number, e: React.MouseEvent<SVGSVGElement> | null = null): void => {
      if (e !== null) {
        e.stopPropagation();
      }

      if (multiple && Array.isArray(selectedValue) && Array.isArray(selectedText)) {
        const newSelectedText = selectedText.filter((_, i) => i !== index);
        const newSelectedValue = selectedValue.filter((_, i) => i !== index);

        setSelectedText(newSelectedText);
        setSelectedValue(newSelectedValue);

        if (!btnAccept) {
          updateValue(newSelectedValue);
        }
      }
    },
    [btnAccept, multiple, selectedValue, selectedText, updateValue],
  );

  const isOptionFocused = useCallback(
    (i: number): boolean => {
      let index: number = i;

      if (multiple) {
        index = !searchable ? i + 1 : i;
      }

      return selectedKeyIndex === index;
    },
    [multiple, searchable, selectedKeyIndex],
  );

  const selectAll = useCallback(
    (e: React.MouseEvent<HTMLLIElement> | null = null): void => {
      if (e !== null) {
        e.stopPropagation();
      }

      if (!multiple) {
        return;
      }

      if (!isSelectAll) {
        // 전체 선택
        const newSelectedText = optionList.map(({ text }) => text);
        const newSelectedValue = optionList.map(({ value }) => value);

        setSelectedText(newSelectedText);
        setSelectedValue(newSelectedValue);

        if (!btnAccept) {
          updateValue(newSelectedValue);
        }
      } else {
        // 전체 해제
        setSelectedText([]);
        setSelectedValue([]);

        if (!btnAccept) {
          updateValue([]);
        }
      }
    },
    [multiple, isSelectAll, optionList, btnAccept, updateValue],
  );

  // componentHelper를 useRef로 안정화
  const componentHelperRef = useRef(useComponentHelper());

  // option list layer 포지션 설정
  const setLayerPosition = useCallback((): void => {
    const rect: DOMRect | undefined = selectBoxRef.current?.getBoundingClientRect();

    if (!rect) return;

    // position 계산
    const { style, position } = componentHelperRef.current.calcLayerPosition({
      parent: selectBoxRef.current as HTMLElement,
      layer: optionContainerRef.current as HTMLElement,
      position: layerPosition.bottom,
      width: rect.width,
      autoPosition: true,
    });

    // position 상태 업데이트
    setPosition(() => position as 'top' | 'bottom');
    setLayerPositionStyle(() => style);
  }, []);

  const toggleOption = useCallback((): void => {
    if (disabled || readonly) {
      return;
    }

    if (!isShowOption) {
      setLayerPosition();
    }

    setIsShowOption(!isShowOption);

    if (isShowOption) {
      if (searchable && searchInputRef.current) {
        searchInputRef.current.value = '';
        setSearchText('');
      }

      setSelectedKeyIndex(0);

      setTimeout(() => {
        const selected = optionListRef.current?.querySelector('.selected');
        selected?.scrollIntoView();
      });
    }
  }, [disabled, readonly, searchable, isShowOption]);

  // 적용 버튼 클릭 이벤트 핸들러
  const accept = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>): void => {
      e.stopPropagation();
      setIsShowOption(false);
      updateValue(selectedValue);
    },
    [selectedValue, updateValue],
  );

  const noneAccept = useCallback((): void => {
    if (!btnAccept) {
      return;
    }

    // 원래 값으로 복원
    const originalValues = Array.isArray(value) ? [...value] : [value];
    const originalTexts = options
      .filter(option => originalValues.includes(option.value))
      .map(option => option.text);

    setSelectedText(originalTexts);
    setSelectedValue(originalValues);
    updateValue(originalValues);
  }, [btnAccept, value, options, updateValue]);

  const outSideClickEvent = useCallback(
    (evt: MouseEvent): void => {
      const target = evt.target as HTMLElement;

      if (!mainRef.current) {
        return;
      }

      // SelectBox 컴포넌트 내부 클릭인지 확인 (main 요소 기준)
      if (mainRef.current.contains(target)) {
        return;
      }

      // 옵션 레이어 내부 클릭인지 확인
      if (optionContainerRef.current && optionContainerRef.current.contains(target)) {
        return;
      }

      // 외부 클릭 시 옵션 목록 닫기
      if (btnAccept) {
        noneAccept();
      }

      setIsShowOption(false);
    },
    [btnAccept, noneAccept],
  );

  // Intersection Observer를 사용한 옵션 레이어 위치 감지 (개선된 버전)
  const setupIntersectionObserver = useCallback((): void => {
    if (!optionListRef.current) {
      return;
    }

    scrollObserverRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          // 옵션 레이어가 화면에서 벗어나거나 충분히 보이지 않을 때만 닫기
          if (!entry.isIntersecting) {
            // 지연 시간을 늘려서 옵션 레이어가 완전히 렌더링될 시간을 줌
            scrollTimeoutRef.current = window.setTimeout(() => {
              setIsShowOption(false);
            }, 150);
          } else if (entry.isIntersecting && scrollTimeoutRef.current) {
            // 다시 보이면 타이머 취소
            clearTimeout(scrollTimeoutRef.current);
            scrollTimeoutRef.current = null;
          }
        });
      },
      {
        root: null, // viewport 기준
        rootMargin: '20px', // 여유 공간을 늘림
        threshold: [0, 0.25, 0.5, 0.75, 1.0], // 임계값 조정
      },
    );

    scrollObserverRef.current.observe(optionListRef.current);
  }, []);

  // Resize Observer를 사용한 레이아웃 변경 감지
  const setupResizeObserver = useCallback((): void => {
    if (!mainRef.current) {
      return;
    }

    // ResizeObserver를 사용하지 않음 - 불필요한 리렌더링 방지
    // option list가 열릴 때 한 번만 위치를 계산하는 것으로 충분
    // 만약 레이아웃 변경 시 위치 재계산이 필요하면 window resize 이벤트 사용 고려
  }, []);

  // 최적화된 스크롤 이벤트 설정 (Intersection Observer 우선 사용)
  const setupOptimizedScrollEvents = useCallback((): void => {
    // window 스크롤 이벤트 등록 (Intersection Observer 보조 역할)
    const scrollListener = () => {
      // 스크롤 시 옵션 레이어 닫기
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      setIsShowOption(false);
    };

    window.addEventListener('scroll', scrollListener, { passive: true });
    scrollEventListenersRef.current.push({ element: window, listener: scrollListener });

    // SelectBox의 상위 스크롤 가능한 요소들도 감지
    if (mainRef.current) {
      const scrollableParents = findScrollableParents(mainRef.current);

      scrollableParents.forEach(parent => {
        parent.addEventListener('scroll', scrollListener, { passive: true });
        scrollEventListenersRef.current.push({ element: parent, listener: scrollListener });
      });
    }
  }, []);

  // value 값 초기화
  const onClickClear = useCallback(
    (e: React.MouseEvent<SVGSVGElement>): void => {
      e.stopPropagation();

      // 값 초기화
      updateValue(multiple ? [] : '');

      // 폼 리셋 (유효성 검사 초기화)
      resetForm();

      // 옵션 레이어가 열려있다면 닫기
      if (isShowOption) {
        setIsShowOption(false);
      }
    },
    [isShowOption, multiple, updateValue, resetForm],
  );

  // 검색 텍스트 변경 이벤트 핸들러
  const searchTextHandler = useCallback((evt: React.FormEvent<HTMLInputElement>): void => {
    evt.stopPropagation();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const v = (evt.target as HTMLInputElement).value;
      setSearchText(v);

      setTimeout(() => {
        if (optionListRef.current) {
          const li = optionListRef.current.querySelector<HTMLLIElement>('.option-item');
          li?.scrollIntoView({ block: 'center' });
        }
      });
    }, 300);
  }, []);

  // 방향키 이동 이벤트 핸들러
  const onArrowKeyHandler = useCallback(
    (evt: KeyboardEvent): void => {
      // INPUT 태그에서 입력 중일 때는 이벤트 처리하지 않음
      if ((evt.target as HTMLElement).tagName === 'INPUT') {
        return;
      }

      const li = optionListRef.current?.querySelectorAll<HTMLLIElement>('.option-item');

      if (!li) {
        return;
      }

      const len = li.length;
      const code = evt.code.toLowerCase();

      if (code === 'arrowdown') {
        evt.preventDefault();
        evt.stopPropagation();

        setSelectedKeyIndex(prev => {
          const newIndex = prev >= len - 1 ? 0 : prev + 1;

          // 다음 렌더링 사이클에서 스크롤 실행
          setTimeout(() => {
            const targetElement = li[newIndex];

            if (targetElement) {
              targetElement.scrollIntoView({ block: 'center' });
            }
          }, 0);

          return newIndex;
        });
      } else if (code === 'arrowup') {
        evt.preventDefault();
        evt.stopPropagation();

        setSelectedKeyIndex(prev => {
          const newIndex = prev <= 0 ? len - 1 : prev - 1;

          // 다음 렌더링 사이클에서 스크롤 실행
          setTimeout(() => {
            const targetElement = li[newIndex];

            if (targetElement) {
              targetElement.scrollIntoView({ block: 'center' });
            }
          }, 0);

          return newIndex;
        });
      } else if (['numpadenter', 'enter', 'space'].includes(code)) {
        evt.preventDefault();
        evt.stopPropagation();

        if (multiple && !searchable && selectedKeyIndex === 0) {
          selectAll();
        } else {
          const currentIndex = selectedKeyIndex;
          if (currentIndex > -1 && currentIndex < optionList.length) {
            const { value } = optionList[currentIndex];
            selectOption(value, currentIndex);
          }
        }
      }
    },
    [selectedKeyIndex, optionList, selectAll, multiple, searchable, selectOption],
  );

  // escape 키 이벤트 핸들러
  const onEscapeKeyHandler = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>): void => {
      const code = event.code.toLowerCase();

      if (code === 'escape') {
        setIsShowOption(false);
        noneAccept();

        const { eventPhase } = event;

        if ([1, 2].includes(eventPhase)) {
          event.stopPropagation();
        }
      }
    },
    [noneAccept],
  );

  // useEffect
  useEffect(() => {
    if (errorMessage) {
      setMessage(errorMessage);
    }
  }, [errorMessage]);

  const prevValidate = useRef<RuleFunc[]>(validate);

  useEffect(() => {
    // 유효성 검사 규칙이 실제로 변경된 경우에만 재검사
    if (validate !== prevValidate.current) {
      prevValidate.current = validate;
      check();
    }
  }, [validate, check, selectedValue]);

  const prevValue = useRef<string | string[]>(value);

  useEffect(() => {
    // 값이 실제로 변경된 경우에만 처리
    if (value !== prevValue.current) {
      prevValue.current = value;
      setDefaultModelValue();

      // 값이 변경된 경우 유효성 검사 실행
      check();
    }
  }, [value, setDefaultModelValue, check]);

  const prevOptions = useRef<OptionItem[]>(options);

  useEffect(() => {
    // 옵션이 실제로 변경된 경우에만 처리
    if (options !== prevOptions.current) {
      prevOptions.current = options;
      setDefaultModelValue();

      // 옵션이 변경된 경우 유효성 검사 실행
      check();
    }
  }, [options, setDefaultModelValue, check]);

  const prevDisabled = useRef<boolean>(disabled);

  useEffect(() => {
    // 비활성화 상태로 변경된 경우에만 유효성 검사 초기화
    if (disabled !== prevDisabled.current && disabled) {
      prevDisabled.current = disabled;
      resetValidate();
    }
  }, [disabled, resetValidate]);

  useEffect(() => {
    if (isShowOption) {
      // 옵션 레이어가 완전히 렌더링된 후에 이벤트 리스너 등록
      setTimeout(() => {
        setupIntersectionObserver();
        setupResizeObserver();
        setupOptimizedScrollEvents();
      }, 100);

      document.addEventListener('click', outSideClickEvent);
      document.addEventListener('keydown', onArrowKeyHandler);
    } else {
      // 옵션 목록이 닫히면서 유효성 검사를 실행
      if (isMounted.current && blurValidate) {
        check();
      }
    }

    return () => {
      setSearchText('');
      document.removeEventListener('click', outSideClickEvent);
      document.removeEventListener('keydown', onArrowKeyHandler);

      // 스크롤 이벤트 리스너 정리
      scrollEventListenersRef.current.forEach(({ element, listener }) => {
        if (element === window) {
          window.removeEventListener('scroll', listener);
        } else if (element instanceof HTMLElement) {
          element.removeEventListener('scroll', listener);
        }
      });
      scrollEventListenersRef.current = [];

      // Observer 정리
      if (scrollObserverRef.current) {
        scrollObserverRef.current.disconnect();
        scrollObserverRef.current = null;
      }

      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }

      // timeout 정리
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
    };
  }, [isShowOption, blurValidate, selectedValue, outSideClickEvent, onArrowKeyHandler, check]);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  // OptionList에 전달할 props를 하나의 객체로 묶기
  const optionListProps = {
    optionList,
    multiple,
    searchable,
    maxLength,
    isLoading,
    btnAccept,
    selectedValue,
    selectedKeyIndex,
    isSelectAll,
    onSelectOption: selectOption,
    onSelectAll: selectAll,
    onAccept: accept,
    searchInputRef,
    onSearchTextChange: searchTextHandler,
    isOptionSelected,
    isOptionFocused,
    optionListRef,
  };

  return {
    // OptionList props
    optionListProps,

    // 나머지 props
    searchTextHandler,
    onEscapeKeyHandler,
    onArrowKeyHandler,
    onClickClear,
    selectOption,
    selectAll,
    updateValue,
    resetForm,
    check,
    resetValidate,
    validateValue,
    setMessage,
    setErrorTransition,
    message,
    errorTransition,
    selectedValue,
    selectedText,
    getShowText,
    clearButtonShow,
    iconClassName,
    containerStyle,
    containerClassName,
    mainRef,
    selectBoxRef,
    searchInputRef,
    optionContainerRef,
    optionListRef,
    layerPositionStyle,
    selectedKeyIndex,
    isShowOption,
    toggleOption,
    accept,
    isSelectAll,
    optionList,
    isOptionSelected,
    isOptionFocused,
    noneAccept,
    outSideClickEvent,
    setLayerPosition,
    feedbackStatus,
    controllerClassName,
    removeSelected,
    position,
  };
};
