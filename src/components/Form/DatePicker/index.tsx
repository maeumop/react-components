import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { CalendarMonth as DatePickerIcon } from '@mui/icons-material';
import { CancelRounded as ClearIcon } from '@mui/icons-material';
import { Calendar } from './Calendar';
import { DateController } from './DateController';
import { useDatePickerHelper } from './helper';
import { DatePickerStoreProvider, useDatePickerStore, useDatePickerStoreInstance } from './store';
import type { DatePickerModel, DatePickerProps, ToggleButtonType } from './types';
import { AnimatePresence, motion } from 'framer-motion';
import { useComponentHelper } from '../../helper';
import { transitionType } from '../../const';
import type { LayerPositionType } from '../../types';
import { useAppendFormComponent, useValidation } from '../hooks';
import { ErrorMessage } from '../ErrorMessage';
import './style.scss';

const DatePickerBase = forwardRef<DatePickerModel, DatePickerProps>((props, ref) => {
  const {
    validate = [],
    range = false,
    label = '',
    placeholder = '',
    separator = '-',
    minYear = 1900,
    maxYear = Number(new Date().getFullYear()) + 10,
    block = false,
    required = false,
    hideMessage = false,
    maxRange = 0,
    readonly = false,
    disabled = false,
    blurValidate = true,
    defaultDate = false,
    clearable = false,
    value,
    className,
    errorMessage = '',
    onChange,
  } = props;

  // value 변경 시 유효성 검사
  const initCount = useRef<number>(0);

  const { message, setMessage, errorTransition, check, resetValidate, setErrorTransition } =
    useValidation<string | string[]>({
      validate,
      disabled,
      value,
      errorMessage,
      onMounted: () => {
        if (initCount.current < 2) {
          initCount.current++;
        }
      },
    });

  const helper = useDatePickerHelper();
  const store = useDatePickerStore();
  const storeInstance = useDatePickerStoreInstance(); // getState()를 사용하기 위한 인스턴스
  const { startDate, endDate, setStartDate, setEndDate, setDateState, setSelected, init } = store;

  const elRef = useRef<HTMLDivElement>(null);
  const inputAreaRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const [isShow, setIsShow] = useState<boolean>(false);
  const [toggleDateButton, setToggleDateButton] = useState<ToggleButtonType[]>([
    { text: '오늘', checked: false },
    { text: '어제', checked: false },
    { text: '최근 7일(오늘 포함)', checked: false },
    { text: '최근 7일(오늘 제외)', checked: false },
    { text: '이번 달', checked: false },
    { text: '지난 달', checked: false },
  ]);

  const [selectedError, setSelectedError] = useState<string>('');

  // 범위 선택 모드에서 임시 저장용 변수
  const [tempStartDate, setTempStartDate] = useState<string>('');
  const [tempEndDate, setTempEndDate] = useState<string>('');

  // 스크롤 이벤트 리스너 배열 (여러 요소에 등록할 수 있도록)
  const scrollEventListenersRef = useRef<
    Array<{
      element: HTMLElement | Window;
      listener: () => void;
    }>
  >([]);

  // 빠른 날짜 선택 버튼 클릭 여부 추적
  const clickToggleDateButtonRef = useRef<boolean>(false);

  // 선택된 날짜 기간을 보여준다.
  const selectedDateView = useMemo<string>(() => {
    if (!range) {
      return '';
    }

    if (selectedError !== '') {
      // 날짜 선택을 잘못한 경우 오류 메시지 표시
      return selectedError;
    }

    // 시작일과 종료일 중 하나라도 선택된 경우 표시
    if (startDate !== '' || endDate !== '') {
      const start = startDate || '선택 안됨';
      const end = endDate || '선택 안됨';

      return `${start} ~ ${end}`;
    }

    return '';
  }, [startDate, endDate, selectedError]);

  // 플레이스홀더 텍스트 메모이제이션
  const placeholderText = useMemo<string[]>(() => {
    if (placeholder && Array.isArray(placeholder)) {
      return placeholder;
    } else if (typeof placeholder === 'string') {
      return [placeholder, ''];
    }

    return ['', ''];
  }, [placeholder]);

  /**
   * model update
   */
  const updateValue = useCallback((): void => {
    // getState()로 최신 상태를 직접 읽기
    const { startDate: currentStartDate, endDate: currentEndDate } = storeInstance.getState();

    if (range) {
      // 시작일과 종료일이 모두 선택되어야 한다.
      if (currentStartDate && currentEndDate) {
        onChange?.([currentStartDate, currentEndDate]);
      } else {
        setStartDate('');
        setEndDate('');
        onChange?.(['', '']);
      }
    } else {
      onChange?.(currentStartDate);
    }
  }, [range, storeInstance, onChange, setStartDate, setEndDate]);

  /**
   * 적용 버튼 클릭
   */
  const accept = useCallback((): void => {
    if (range && !startDate && !endDate) {
      setErrorMsg();
      return;
    }

    updateValue();

    // 적용 시 임시 저장 변수도 업데이트
    if (range) {
      setTempStartDate(startDate);
      setTempEndDate(endDate);
    }

    setIsShow(false);
  }, [range, startDate, endDate, updateValue, onChange]);

  /**
   * 달력에서 전달된 날짜의 기간을 검수 하여 maxRange를 초과 한경우 컴포넌트 업데이트 안함
   * @param flag start | end
   */
  const dateTermCheck = useCallback(
    (isEnd: boolean): void => {
      // getState()로 최신 상태를 직접 읽기
      const { startDate: currentStartDate, endDate: currentEndDate } = storeInstance.getState();

      // 날짜 선택 시 이전 오류 메시지 즉시 제거
      if (message || selectedError) {
        setMessage('');
        setSelectedError('');
      }

      // 단일 날짜 선택 모드
      if (!range) {
        updateValue();
        setIsShow(false);
        return;
      }

      setToggleDateButton(prev => prev.map(item => ({ ...item, checked: false })));

      // 범위 선택 모드 - 시작일과 종료일이 모두 선택된 경우에만 maxRange 검사
      if (maxRange && currentStartDate && currentEndDate) {
        const startTime: number = new Date(currentStartDate).getTime();
        const endTime: number = new Date(currentEndDate).getTime();

        // 선택 최대 기간이 설정된 경우 날짜를 계산하여 선택이 안되도록 처리
        const term: number = Math.abs(endTime - startTime) / (86400 * 1000) + 1;

        // 만약 기간이 초과 한다면 변수를 초기화 하고, 다시 랜더링 하지 않는다.
        if (maxRange < term) {
          if (!isEnd) {
            setStartDate('');
          } else {
            setEndDate('');
          }

          setErrorMsg(`최대 선택기간 ${maxRange}일을 초과 하였습니다.`);
          return;
        }
      }
    },
    [
      range,
      maxRange,
      updateValue,
      storeInstance,
      setStartDate,
      setEndDate,
      setMessage,
      setSelectedError,
    ],
  );

  const setDateCalender = useCallback((): void => {
    // 해당 달력으로 변환
    const s = separator;
    const start: string[] = startDate.split(s);
    const end: string[] = endDate.split(s);

    // 선택되는 날짜에 대한 처리는 Calendar 컴포넌트 내부에서 실행됨
    setDateState('start', 'year', Number(start[0]));
    setDateState('start', 'month', Number(start[1]));
    setDateState('end', 'year', Number(end[0]));
    setDateState('end', 'month', Number(end[1]));

    updateValue();
  }, [startDate, endDate, separator, setDateState, updateValue]);

  /**
   * props.range === true 일때 버튼을 클릭하여 case에 맞춰서 날짜 지정
   * @param flag
   */
  const pickCaseDate = useCallback(
    (index: number): void => {
      clickToggleDateButtonRef.current = true;

      // 불변 업데이트
      setToggleDateButton(prev =>
        prev.map((item, i) => ({
          ...item,
          checked: index === i,
        })),
      );

      let date: Date = new Date();

      if (index === 4) {
        date = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      } else if (index === 5) {
        date = new Date(date.getFullYear(), date.getMonth(), 0);
      }

      const year: string = date.getFullYear().toString();
      let month: string = (date.getMonth() + 1).toString();
      let day: string = date.getDate().toString();

      month = month.length === 1 ? `0${month}` : month;
      day = day.length === 1 ? `0${day}` : day;

      const s = separator;
      const format = `Y${s}m${s}d`;

      switch (index) {
        case 0:
          setStartDate(helper.getDateFormat(date, format, 0));
          setEndDate(helper.getDateFormat(date, format, 0));
          break;
        case 1:
          setStartDate(helper.getDateFormat(date, format, -1));
          setEndDate(helper.getDateFormat(date, format, -1));
          break;
        case 2:
          setStartDate(helper.getDateFormat(date, format, -6));
          setEndDate(helper.getDateFormat(date, format, 0));
          break;
        case 3:
          setStartDate(helper.getDateFormat(date, format, -7));
          setEndDate(helper.getDateFormat(date, format, -1));
          break;
        case 4:
        case 5:
          setStartDate(`${year}${s}${month}${s}01`);
          setEndDate(`${year}${s}${month}${s}${day}`);
          break;
      }

      setDateCalender();

      // 범위 선택 모드에서는 빠른 선택 버튼 클릭 시에도 창을 유지
      // 사용자가 적용 버튼을 클릭할 때만 창이 닫힘
    },
    [separator, setStartDate, setEndDate, setDateCalender, helper],
  );

  /**
   * 에러 메시지를 표시한 후 3초 후 제거
   * @param msg 에러 메시지 내용
   */
  const setErrorMsg = (msg: string = '날짜를 선택해주세요.'): void => {
    setSelectedError(msg);

    setTimeout(() => {
      setSelectedError('');
    }, 3000);
  };

  /**
   * 취소 버튼 클릭
   * 임시 저장된 날짜로 되돌리기
   */
  const cancel = useCallback((): void => {
    if (range) {
      // 임시 저장된 날짜로 되돌리기
      setStartDate(tempStartDate);
      setEndDate(tempEndDate);
      setSelected('start', tempStartDate);
      setSelected('end', tempEndDate);

      // 달력 상태도 임시 저장된 날짜로 업데이트
      if (tempStartDate && tempEndDate) {
        const s = separator;
        const start: string[] = tempStartDate.split(s);
        const end: string[] = tempEndDate.split(s);

        setDateState('start', 'year', Number(start[0]));
        setDateState('start', 'month', Number(start[1]));
        setDateState('end', 'year', Number(end[0]));
        setDateState('end', 'month', Number(end[1]));
      }

      // 빠른 선택 버튼 초기화
      setToggleDateButton(prev => prev.map(item => ({ ...item, checked: false })));
    }

    setIsShow(false);
  }, [
    range,
    tempStartDate,
    tempEndDate,
    separator,
    setStartDate,
    setEndDate,
    setSelected,
    setDateState,
  ]);

  // 스크롤 이벤트 처리 - 일반 함수로 변경
  const setScrollEvent = (el: HTMLElement): void => {
    const parent = el.parentElement as HTMLElement;

    if (!parent || parent.tagName.toLowerCase() === 'html') return;

    // 스크롤 가능한 요소인지 확인 (overflow: auto/scroll)
    const computedStyle = window.getComputedStyle(parent);
    const overflow = computedStyle.overflow + computedStyle.overflowY + computedStyle.overflowX;

    const isScrollable =
      overflow.includes('auto') ||
      overflow.includes('scroll') ||
      parent.scrollHeight > parent.clientHeight;

    if (isScrollable) {
      // 일반 함수로 변경
      const listener = () => {
        setIsShow(false);
      };

      parent.addEventListener('scroll', listener, { passive: true });
      scrollEventListenersRef.current.push({ element: parent, listener });
    }

    // 재귀적으로 상위 요소 탐색
    setScrollEvent(parent);
  };

  // 스크롤 이벤트 등록/해제 함수
  const removeAllScrollEvents = useCallback(() => {
    scrollEventListenersRef.current.forEach(({ element, listener }) => {
      if (element === window) {
        window.removeEventListener('scroll', listener);
      } else if (element instanceof HTMLElement) {
        element.removeEventListener('scroll', listener);
      }
    });

    scrollEventListenersRef.current = [];
  }, []);

  const addAllScrollEvents = useCallback(() => {
    if (elRef.current) {
      setScrollEvent(elRef.current);
    }

    addWindowScrollEvent();
  }, []);

  // window 스크롤 이벤트 추가
  const addWindowScrollEvent = useCallback((): void => {
    const listener = () => {
      setIsShow(false);
    };

    window.addEventListener('scroll', listener, { passive: true });
    scrollEventListenersRef.current.push({ element: window, listener });
  }, []);

  // 외부 클릭 감지
  const onOutsideClick = useCallback(
    (evt: MouseEvent) => {
      evt.stopPropagation();
      const target = evt.target as HTMLElement;

      if (!isShow || !inputAreaRef.current) return;

      // DatePicker 컴포넌트 내부 클릭인지 확인
      if (inputAreaRef.current.contains(target)) return;

      // 외부 클릭 시 달력 닫기
      setIsShow(false);
    },
    [isShow],
  );

  // 초기화
  useEffect(() => {
    init();
  }, [init]);

  // 날짜가 선택되면 오류 메시지 제거 (보험 처리)
  useEffect(() => {
    if ((selectedError || message) && (startDate || endDate)) {
      setSelectedError('');
      setMessage('');
    }
  }, [startDate, endDate, message, selectedError]);

  // 외부 클릭 이벤트 등록
  useEffect(() => {
    if (isShow) {
      document.addEventListener('click', onOutsideClick);
      addAllScrollEvents();

      return () => {
        document.removeEventListener('click', onOutsideClick);
        removeAllScrollEvents();
      };
    }
  }, [isShow, onOutsideClick, addAllScrollEvents, removeAllScrollEvents]);

  // 초기 값 설정
  useEffect(() => {
    if (value) {
      if (range && Array.isArray(value)) {
        setStartDate(value[0]);
        setEndDate(value[1]);

        if (defaultDate) {
          onChange?.([...value]);
        }
      } else if (typeof value === 'string') {
        setStartDate(value);
      }
    }
  }, []);

  const mainClassName = useMemo(() => {
    return ['date-picker', block ? 'block' : '', className].join(' ').trim();
  }, [block]);

  const onClickCancel = useCallback(() => {
    cancel();
  }, [cancel]);

  const onClickOkay = useCallback(() => {
    accept();
  }, [accept]);

  const handleTransitionExited = useCallback(() => {
    if (blurValidate) {
      check();
    }
  }, [blurValidate, check]);

  const pickerDateTextClassName = useMemo(
    () =>
      [
        'picker-date-text',
        message ? 'error' : '',
        disabled ? 'disabled' : '',
        readonly ? 'readonly' : '',
        isShow ? 'active' : '',
      ]
        .join(' ')
        .trim(),
    [message, disabled, readonly, isShow],
  );

  const selectDateClassName = useMemo(
    () => ['select-date', selectedError ? 'selected-error' : ''].join(' '),
    [selectedError],
  );

  const componentHelper = useRef(useComponentHelper());
  const [positionStyle, setPositionStyle] = useState<React.CSSProperties>({});
  const [position, setPosition] = useState<string>('bottom');

  /**
   * 배치된 위치에 따라 달력이 보여지는 위치와 방향을 변경
   */
  const toggleCalendar = useCallback((): void => {
    if (isShow && !inputAreaRef.current) return;

    const rect: DOMRect = inputAreaRef.current!.getBoundingClientRect();
    const windowHeight: number = window.innerHeight;

    const calculatedPosition: 'top' | 'bottom' = windowHeight / 2 < rect.top ? 'top' : 'bottom';

    const { style, position } = componentHelper.current.calcLayerPosition({
      parent: inputAreaRef.current as HTMLElement,
      layer: pickerRef.current as HTMLElement,
      position: calculatedPosition,
      autoPosition: true,
    });

    style.transformOrigin = position === 'bottom' ? 'top left' : 'bottom left';

    setPosition(() => position);
    setPositionStyle(() => style);

    if (!readonly && !disabled) {
      // 달력을 열 때 현재 선택된 날짜를 임시 저장
      if (!isShow && range) {
        setTempStartDate(() => startDate);
        setTempEndDate(() => endDate);
      }

      setIsShow(prev => !prev);
    }
  }, [readonly, disabled, range, startDate, endDate]);

  // componentHelper를 useRef로 안정화
  const componentHelperRef = useRef(useComponentHelper());

  const variants = useMemo(() => {
    return componentHelperRef.current.getTransitionVariant(
      transitionType.scale,
      position as LayerPositionType,
    );
  }, [position]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        toggleCalendar();
      } else if (e.key === 'Escape') {
        setIsShow(false);
      }
    },
    [toggleCalendar],
  );

  // 클리어 버튼 노출 여부
  const clearButtonShow = useMemo(() => {
    const valueIsEmpty = range ? !startDate && !endDate : !startDate;
    return clearable && !valueIsEmpty && !disabled && !readonly;
  }, [clearable, startDate, endDate, disabled, readonly]);

  const onClickClear = useCallback(
    (evt: React.MouseEvent<SVGSVGElement>) => {
      evt.stopPropagation();

      if (range) {
        setStartDate('');
        setEndDate('');
        onChange?.(['', '']);
      } else {
        setStartDate('');
        onChange?.('');
      }
    },
    [onChange],
  );

  // resetForm 상태
  const isReset = useRef<boolean>(false);

  useEffect(() => {
    if (isReset.current) {
      isReset.current = false;
      return;
    }

    if (process.env.NODE_ENV === 'development' && initCount.current < 2) {
      return;
    }

    check();
  }, [value]);

  /**
   * 폼 초기화 처리
   */
  const resetForm = useCallback((): void => {
    isReset.current = true;
    setToggleDateButton(prev => prev.map(item => ({ ...item, checked: false })));

    if (range) {
      setStartDate('');
      setEndDate('');
      onChange?.(['', '']);
    } else {
      setStartDate('');
      onChange?.('');
    }

    resetValidate();
  }, [range, isReset, onChange, resetValidate]);

  useAppendFormComponent({
    check,
    resetForm,
    resetValidate,
    motherRef: elRef as React.RefObject<HTMLDivElement>,
  });

  useImperativeHandle(ref, () => ({
    check,
    resetForm,
    resetValidate,
  }));

  return (
    <div ref={elRef} className={mainClassName}>
      <div className="wrap">
        {label && (
          <div className="options-wrap">
            <label className="input-label" htmlFor={`datepicker-${label}`}>
              {label}
              {required && <span className="required">*</span>}
            </label>
          </div>
        )}

        <div ref={inputAreaRef} className="date-picker-wrapper">
          <div
            className={pickerDateTextClassName}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onClick={toggleCalendar}
          >
            <input
              readOnly
              type="text"
              placeholder={placeholderText[0]}
              value={disabled ? '' : startDate}
              id={`datepicker-${label}`}
            />
            {range && (
              <>
                <span className="input-group-text" aria-label="날짜 범위 구분자">
                  ~
                </span>
                <input
                  readOnly
                  type="text"
                  placeholder={placeholderText[1]}
                  value={disabled ? '' : endDate}
                />
              </>
            )}

            {clearButtonShow && (
              <ClearIcon sx={{ fontSize: 22 }} className="clear-value" onClick={onClickClear} />
            )}

            <DatePickerIcon className="date-picker-icon" sx={{ fontSize: 22 }} />
          </div>

          {/* 달력 표시 */}
          <AnimatePresence onExitComplete={handleTransitionExited}>
            {isShow && (
              <motion.div
                ref={pickerRef}
                className="picker-popup"
                style={positionStyle}
                initial={variants.initial}
                animate={variants.animate}
                exit={variants.exit}
                transition={variants.transition}
              >
                {range && (
                  <div className="search-date" role="group" aria-label="빠른 날짜 선택">
                    {toggleDateButton.map((v, i) => (
                      <button
                        type="button"
                        key={v.text}
                        className={[v.checked && 'active'].filter(Boolean).join(' ')}
                        onClick={() => pickCaseDate(i)}
                      >
                        {v.text}
                      </button>
                    ))}
                  </div>
                )}

                <div className="picker-wrap">
                  <div className="calendar">
                    <DateController maxYear={maxYear} minYear={minYear} />

                    <Calendar
                      separator={separator}
                      range={range}
                      updateDate={dateTermCheck}
                      value={startDate}
                    />
                  </div>

                  {range && (
                    <>
                      <div className="calendar">
                        <DateController end maxYear={maxYear} minYear={minYear} />

                        <Calendar
                          end
                          separator={separator}
                          range={range}
                          updateDate={dateTermCheck}
                          value={endDate}
                        />
                      </div>

                      <div className="btn-area" role="group" aria-label="날짜 선택 액션">
                        <div className={selectDateClassName} role="status" aria-live="polite">
                          {selectedDateView}
                        </div>
                        <div>
                          <button type="button" className="cancel" onClick={onClickCancel}>
                            취소
                          </button>
                          <button type="button" className="okay" onClick={onClickOkay}>
                            적용
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {message && !hideMessage && (
          <ErrorMessage
            message={message}
            errorTransition={errorTransition}
            onAnimationEnd={() => setErrorTransition(false)}
          />
        )}
      </div>
    </div>
  );
});

DatePickerBase.displayName = 'DatePicker';

/**
 * DatePicker - Provider로 감싼 최종 컴포넌트
 * 각 인스턴스마다 독립적인 store를 가짐
 */
const DatePicker = forwardRef<DatePickerModel, DatePickerProps>((props, ref) => {
  return (
    <DatePickerStoreProvider>
      <DatePickerBase {...props} ref={ref} />
    </DatePickerStoreProvider>
  );
});

DatePicker.displayName = 'DatePicker';

export default React.memo(DatePicker);
