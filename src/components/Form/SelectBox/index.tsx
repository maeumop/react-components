import { Icon } from '@iconify/react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CSSTransition } from 'react-transition-group';
import type { RuleFunc } from '../../types';
import './style.scss';
import type { OptionItem, SelectBoxModel, SelectBoxProps } from './types';

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

const SelectBox = forwardRef<SelectBoxModel, SelectBoxProps>((props, ref) => {
  // props 분해
  const {
    value,
    options,
    label = '',
    inLabel = false,
    placeholder = '',
    block = false,
    validate = [],
    errorMessage = '',
    width,
    multiple = false,
    readonly = false,
    disabled = false,
    required = false,
    isShort = false,
    btnAccept = false,
    labelText = false,
    maxLength = 0,
    searchable = false,
    hideMessage = false,
    blurValidate = true,
    clearable = false,
    isLoading = false,
    onChange,
    onChangeIndex,
    onAfterChange,
  } = props;

  // 반응형 상태
  const [message, setMessage] = useState<string>('');
  const [errorTransition, setErrorTransition] = useState<boolean>(false);
  const [isShowOption, setIsShowOption] = useState<boolean>(false);
  const [showBottom, setShowBottom] = useState<boolean>(false);
  const [transitionStatus, setTransitionStatus] = useState<boolean>(false);

  // 선택된 값들
  const [selectedText, setSelectedText] = useState<string | string[]>(multiple ? [] : '');
  const [selectedValue, setSelectedValue] = useState<string | string[]>(multiple ? [] : '');

  // 검색 텍스트
  const [searchText, setSearchText] = useState<string>('');

  // DOM 참조
  const selectBoxRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionContainerRef = useRef<HTMLDivElement>(null);
  const optionListRef = useRef<HTMLUListElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  // 레이어 위치 스타일
  const [layerPositionStyle, setLayerPositionStyle] = useState<React.CSSProperties>({
    top: '',
    left: '',
    bottom: '',
    width: '',
  });

  const [selectedKeyIndex, setSelectedKeyIndex] = useState<number>(0);

  // 이벤트 리스너 참조 (메모리 누수 방지)
  let timeout: NodeJS.Timeout | null = null;

  // 스크롤 이벤트 리스너 배열 (여러 요소에 등록할 수 있도록)
  const scrollEventListeners: Array<{
    element: HTMLElement | Window;
    listener: () => void;
  }> = [];

  // 개선된 스크롤 감지 시스템
  let scrollObserver: IntersectionObserver | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let scrollTimeout: number | null = null;

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
    if (!clearable || disabled || readonly) {
      return false;
    }

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return !!value;
  }, [clearable, disabled, readonly, value]);

  const iconClassName = useMemo<string>(
    () => ['arrow', isShowOption && 'rotate'].join(' ').trim(),
    [isShowOption],
  );

  // 피드백 상태 클래스
  const feedbackStatus = useMemo<string>(
    () => ['description', errorTransition && 'error'].join(' ').trim(),
    [errorTransition],
  );

  // 컨트롤러 클래스
  const controllerClassName = useMemo<string>(() => {
    return [
      'control-wrap',
      disabled && 'disabled',
      readonly && 'readonly',
      message && 'error',
      isShowOption && 'active',
    ]
      .join(' ')
      .trim();
  }, [disabled, readonly, message, isShowOption]);

  const optionBoxPositionClassName = useMemo<string>(
    () => ['option-list', showBottom ? 'show-bottom' : 'show-top'].join(' ').trim(),
    [showBottom],
  );

  const setDefaultModelValue = useCallback((): void => {
    if (Array.isArray(value)) {
      setSelectedValue([...value]);
    } else {
      setSelectedValue('');
    }

    if (multiple) {
      setSelectedText([]);
    } else {
      setSelectedText('');
    }

    options.forEach(item => {
      if (multiple && Array.isArray(value)) {
        if (value.includes(item.value) && Array.isArray(selectedText)) {
          setSelectedText([...selectedText, item.text]);
        }
      } else {
        if (value === item.value) {
          setSelectedText(item.text);
          setSelectedValue(item.value);
        }
      }
    });
  }, [value, multiple, options]);

  const updateValue = useCallback(
    (v: string | string[], index: number = -1): void => {
      onChange?.(v);
      onChangeIndex?.(index);
      onAfterChange?.(v);

      // 사용자 상호작용으로 인한 값 변경이므로 유효성 검사 실행
      setTimeout(() => {
        check();
      });
    },
    [onChange, onChangeIndex, onAfterChange],
  );

  // 유효성 검사
  const check = useCallback(
    (silence: boolean = false): boolean => {
      // 비활성화 상태인 경우 검증 성공
      if (disabled) {
        return true;
      }

      // 강제 에러 메시지가 있는 경우 검증 실패
      if (errorMessage) {
        if (!silence) {
          setMessage(errorMessage);
          setErrorTransition(true);
        }

        return false;
      }

      // 유효성 검사 규칙이 없는 경우 성공으로 처리
      if (!validate.length) {
        if (!silence) {
          setMessage('');
          setErrorTransition(false);
        }

        return true;
      }

      // 데이터 검증
      for (let i: number = 0; i < validate.length; i++) {
        const result: string | boolean = validate[i](selectedValue);

        if (typeof result === 'string') {
          if (!silence) {
            setMessage(result);
            setErrorTransition(true);
          }

          return false;
        }
      }

      // 모든 검증을 통과한 경우
      if (!silence) {
        setMessage('');
        setErrorTransition(false);
      }

      return true;
    },
    [disabled, errorMessage, validate],
  );

  const resetForm = useCallback((): void => {
    if (multiple) {
      setSelectedText([]);
      setSelectedValue([]);
      onChange?.([]);
    } else {
      setSelectedText('');
      setSelectedValue('');
      onChange?.('');
    }
  }, [multiple]);

  const resetValidate = (): void => {
    setMessage('');
    setErrorTransition(false);
  };

  const selectOption = useCallback(
    (v: string, index: number, e: React.MouseEvent<HTMLLIElement> | null = null): void => {
      if (e !== null) {
        e.stopPropagation();
        e.preventDefault();
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
    [multiple, selectedValue, value],
  );

  const removeSelected = useCallback(
    (index: number): void => {
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
        e.preventDefault();
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

  const calculateLayerPosition = useCallback((): void => {
    const windowHeight: number = window.innerHeight;
    const rect: DOMRect | undefined = selectBoxRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    const shouldShowBottom = windowHeight / 2 < rect.top;
    setShowBottom(shouldShowBottom);

    const newStyle: React.CSSProperties = {
      position: 'fixed',
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      zIndex: 1000,
    };

    if (shouldShowBottom) {
      newStyle.bottom = `${windowHeight - rect.top + 6}px`;
    } else {
      newStyle.top = `${rect.top + rect.height + 6}px`;
    }

    setLayerPositionStyle(newStyle);
  }, [setShowBottom, setLayerPositionStyle]);

  const toggleOption = useCallback((): void => {
    if (disabled || readonly || transitionStatus) {
      return;
    }

    if (!isShowOption) {
      calculateLayerPosition();
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
  }, [disabled, readonly, transitionStatus, searchable, isShowOption, calculateLayerPosition]);

  // 검색 텍스트 변경 이벤트 핸들러
  const searchTextHandler = useCallback(
    (evt: React.KeyboardEvent<HTMLInputElement>): void => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        const v = (evt.target as HTMLInputElement).value;
        setSearchText(v);

        setTimeout(() => {
          if (optionListRef.current) {
            const li = optionListRef.current.querySelector<HTMLLIElement>('.option-item');
            li?.scrollIntoView({ block: 'center' });
          }
        });
      }, 300);
    },
    [selectedKeyIndex],
  );

  // 적용 버튼 클릭 이벤트 핸들러
  const accept = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>): void => {
      e.preventDefault();
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

      if (!isShowOption || !mainRef.current) {
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
    [btnAccept, isShowOption, mainRef, noneAccept],
  );

  // Intersection Observer를 사용한 옵션 레이어 위치 감지 (개선된 버전)
  const setupIntersectionObserver = useCallback((): void => {
    if (!optionListRef.current) {
      return;
    }

    scrollObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          // 옵션 레이어가 화면에서 벗어나거나 충분히 보이지 않을 때만 닫기
          if (!entry.isIntersecting && isShowOption) {
            // 지연 시간을 늘려서 옵션 레이어가 완전히 렌더링될 시간을 줌
            scrollTimeout = window.setTimeout(() => {
              if (isShowOption) {
                setIsShowOption(false);
              }
            }, 150);
          } else if (entry.isIntersecting && scrollTimeout) {
            // 다시 보이면 타이머 취소
            clearTimeout(scrollTimeout);
            scrollTimeout = null;
          }
        });
      },
      {
        root: null, // viewport 기준
        rootMargin: '20px', // 여유 공간을 늘림
        threshold: [0, 0.25, 0.5, 0.75, 1.0], // 임계값 조정
      },
    );

    scrollObserver.observe(optionListRef.current);
  }, [isShowOption, optionListRef]);

  // Resize Observer를 사용한 레이아웃 변경 감지
  const setupResizeObserver = useCallback((): void => {
    if (!mainRef.current) {
      return;
    }

    resizeObserver = new ResizeObserver(() => {
      if (isShowOption) {
        // 레이아웃 변경 시 옵션 레이어 위치 재계산 (지연 적용)
        setTimeout(() => {
          calculateLayerPosition();
        }, 50);
      }
    });

    resizeObserver.observe(mainRef.current);
  }, [isShowOption, mainRef, calculateLayerPosition]);

  // 최적화된 스크롤 이벤트 설정 (Intersection Observer 우선 사용)
  const setupOptimizedScrollEvents = useCallback((): void => {
    // window 스크롤 이벤트 등록 (Intersection Observer 보조 역할)
    const scrollListener = () => {
      if (isShowOption) {
        // 스크롤 시 옵션 레이어 닫기 (지연 시간 증가)
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }

        setIsShowOption(false);
        calculateLayerPosition();
      }
    };

    window.addEventListener('scroll', scrollListener, { passive: true });
    scrollEventListeners.push({ element: window, listener: scrollListener });

    // SelectBox의 상위 스크롤 가능한 요소들도 감지
    if (mainRef.current) {
      const scrollableParents = findScrollableParents(mainRef.current);

      scrollableParents.forEach(parent => {
        parent.addEventListener('scroll', scrollListener, { passive: true });
        scrollEventListeners.push({ element: parent, listener: scrollListener });
      });
    }
  }, [isShowOption, scrollTimeout, calculateLayerPosition]);

  // value 값 초기화
  const clearValue = useCallback((): void => {
    // 값 초기화
    updateValue(multiple ? [] : '');

    // 폼 리셋 (유효성 검사 초기화)
    resetForm();

    // 옵션 레이어가 열려있다면 닫기
    if (isShowOption) {
      setIsShowOption(false);
    }
  }, [isShowOption, updateValue, resetForm]);

  // 방향키 이동 이벤트 핸들러
  const onArrowKeyHandler = useCallback(
    (event: KeyboardEvent): void => {
      event.preventDefault();

      if (!isShowOption) {
        return;
      }

      const li = optionListRef.current?.querySelectorAll<HTMLLIElement>('.option-item');

      if (!li) {
        return;
      }

      const len = li.length;
      const code = event.code.toLowerCase();

      if (code === 'arrowdown' && selectedKeyIndex < len) {
        setSelectedKeyIndex(prev => prev + 1);

        if (selectedKeyIndex >= len) {
          setSelectedKeyIndex(0);
        }

        li[selectedKeyIndex].scrollIntoView({ block: 'center' });
      } else if (code === 'arrowup' && selectedKeyIndex >= -1) {
        setSelectedKeyIndex(prev => prev - 1);

        if (selectedKeyIndex === -1) {
          setSelectedKeyIndex(len - 1);
        }

        li[selectedKeyIndex].scrollIntoView({ block: 'center' });
      } else if (['numpadenter', 'enter'].includes(code)) {
        if (multiple && !searchable && selectedKeyIndex === 0) {
          selectAll();
        } else {
          const index = multiple && !searchable ? selectedKeyIndex - 1 : selectedKeyIndex;

          if (index > -1 && index < optionList.length) {
            const { value } = optionList[index];
            selectOption(value, index);
          }
        }
      }
    },
    [isShowOption, selectedKeyIndex, optionList, selectAll, multiple, searchable],
  );

  // escape 키 이벤트 핸들러
  const onEscapeKeyHandler = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>): void => {
      const code = event.code.toLowerCase();

      if (isShowOption && code === 'escape') {
        setIsShowOption(false);
        noneAccept();

        const { eventPhase } = event;

        if ([1, 2].includes(eventPhase)) {
          event.stopPropagation();
        }
      }
    },
    [isShowOption, noneAccept, toggleOption],
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
    if (JSON.stringify(validate) !== JSON.stringify(prevValidate.current)) {
      setTimeout(() => {
        check(true);
      });
    }
  }, [validate]);

  const prevValue = useRef<string | string[]>(value);

  useEffect(() => {
    // 값이 실제로 변경된 경우에만 처리
    if (JSON.stringify(value) !== JSON.stringify(prevValue.current)) {
      setDefaultModelValue();

      // 값이 변경된 경우 유효성 검사 실행
      setTimeout(() => {
        check(true);
      });
    }
  }, [value]);

  const prevOptions = useRef<OptionItem[]>(options);

  useEffect(() => {
    // 옵션이 실제로 변경된 경우에만 처리
    if (JSON.stringify(options) !== JSON.stringify(prevOptions)) {
      setDefaultModelValue();

      // 옵션이 변경된 경우 유효성 검사 실행
      check(true);
    }
  }, [options]);

  const prevDisabled = useRef<boolean>(disabled);

  useEffect(() => {
    // 비활성화 상태로 변경된 경우에만 유효성 검사 초기화
    if (disabled !== prevDisabled.current && disabled) {
      resetValidate();
    }
  }, [disabled]);

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
    }

    return () => {
      document.removeEventListener('click', outSideClickEvent);
      document.removeEventListener('keydown', onArrowKeyHandler);

      // 스크롤 이벤트 리스너 정리
      scrollEventListeners.forEach(({ element, listener }) => {
        if (element === window) {
          window.removeEventListener('scroll', listener);
        } else if (element instanceof HTMLElement) {
          element.removeEventListener('scroll', listener);
        }
      });
    };
  }, [isShowOption, blurValidate, check]);

  // expose 메서드
  useImperativeHandle(
    ref,
    () => ({
      check,
      resetForm,
      resetValidate,
    }),
    [check, resetForm, resetValidate],
  );

  return (
    <div
      ref={mainRef}
      tabIndex={0}
      style={width ? { width } : undefined}
      className={['select-box', block ? 'block' : ''].join(' ')}
      onClick={() => toggleOption()}
      onKeyDown={onEscapeKeyHandler}
    >
      {label && !inLabel && (
        <div className="options-wrap">
          <label className="input-label">
            {label}
            {required && <span className="required">*</span>}
          </label>
        </div>
      )}
      <div ref={selectBoxRef} className={controllerClassName}>
        {/* 선택 텍스트/태그 */}
        {multiple ? (
          getShowText.length ? (
            <div className="text">
              {labelText ? (
                !isShort ? (
                  getShowText.map((txt, i) => (
                    <span className="item" key={i}>
                      {txt}
                      <Icon
                        icon="mdi:window-close"
                        className="remove-icon"
                        width={13}
                        height={13}
                        onClick={e => {
                          e.stopPropagation();
                          removeSelected(i);
                        }}
                      />
                    </span>
                  ))
                ) : (
                  <>
                    <span>{getShowText[0]}</span>
                    {getShowText.length > 1 && <>&nbsp;+ {getShowText.length - 1}</>}
                  </>
                )
              ) : !isShort ? (
                <>
                  {inLabel && <span className="label">{label}: </span>}
                  {getShowText.join(', ')}
                </>
              ) : (
                <>
                  {inLabel && <span className="label">{label}: </span>}
                  {getShowText[0]}
                  {getShowText.length > 1 && <> + {getShowText.length - 1}</>}
                </>
              )}
            </div>
          ) : (
            <div className="text ph">
              {inLabel && <span className="label">{label}: </span>}
              {placeholder}
            </div>
          )
        ) : getShowText.length > 0 ? (
          <div className="text">
            {inLabel && <span className="label">{label}: </span>}
            {getShowText[0]}
          </div>
        ) : (
          <div className="text ph">
            {inLabel && <span className="label">{label}: </span>}
            {placeholder}
          </div>
        )}

        {/* 클리어 버튼 */}
        {clearButtonShow && (
          <a
            href="#"
            className="btn-clear"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              clearValue();
            }}
          >
            <Icon icon="mdi:close-circle" width={20} height={20} />
          </a>
        )}

        {/* 화살표 아이콘 */}
        <Icon className={iconClassName} icon="mdi:chevron-down" width={20} height={20} />

        {/* 옵션 레이어 */}
        <CSSTransition
          in={isShowOption}
          timeout={200}
          classNames={showBottom ? 'options-view-bottom' : 'options-view'}
          unmountOnExit
          nodeRef={optionContainerRef}
          onExited={() => setTransitionStatus(false)}
        >
          <div
            style={layerPositionStyle}
            className={optionBoxPositionClassName}
            ref={optionContainerRef}
          >
            {/* 검색 영역 */}
            {searchable && (
              <div className="search" onClick={e => e.stopPropagation()}>
                <div className="search-wrap">
                  <input
                    ref={searchInputRef}
                    placeholder="검색어 입력"
                    type="text"
                    onKeyUp={searchTextHandler}
                  />
                  <Icon icon="mdi:magnify" width={28} height={28} />
                </div>
              </div>
            )}

            {/* 옵션 리스트 */}
            <ul ref={optionListRef} className="scrollbar">
              {/* 전체 선택/해제 */}
              {multiple && !maxLength && !searchable && (
                <li
                  className={[
                    'option-item',
                    selectedKeyIndex === 0 && !searchable && 'key-selected',
                  ].join(' ')}
                  onClick={selectAll}
                >
                  <Icon
                    className={['checkbox', isSelectAll && 'checked'].join(' ')}
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
                  <li
                    key={`select-${item.value}`}
                    className={[
                      'option-item',
                      isOptionSelected(item.value) && 'selected',
                      isOptionFocused(i) && 'key-selected',
                    ].join(' ')}
                    onClick={e => selectOption(item.value, i, e)}
                  >
                    {multiple && (
                      <Icon
                        className="checkbox"
                        icon={
                          isOptionSelected(item.value)
                            ? 'mdi:checkbox-marked'
                            : 'mdi:checkbox-blank-outline'
                        }
                        width={20}
                        height={20}
                      />
                    )}
                    {item.text}
                  </li>
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
              <a href="#" className="btn-accept" onClick={accept}>
                적용 + {selectedValue.length}
              </a>
            )}
          </div>
        </CSSTransition>
      </div>

      {/* 에러 메시지 */}
      {message && !hideMessage && (
        <div className={feedbackStatus} onAnimationEnd={() => setErrorTransition(false)}>
          {message}
        </div>
      )}
    </div>
  );
});

SelectBox.displayName = 'SelectBox';

export default SelectBox;
