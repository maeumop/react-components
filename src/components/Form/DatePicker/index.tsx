import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import type { Ref } from 'react';
import { Icon } from '@iconify/react';
import type { RuleFunc } from '../types';
import { Calendar } from './Calendar';
import { DateController } from './DateController';
import { useDatePickerHelper } from './helper';
import { useDatePickerStore } from './store';
import type { DatePickerModel, DatePickerProps, ToggleButtonType } from './types';
import { useValidation } from '../hooks';
import { CSSTransition } from 'react-transition-group';

const DatePickerBase = ({
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
  value,
  onChange,
  onUpdateSet,
  ref,
}: DatePickerProps & { ref: Ref<DatePickerModel> }) => {
  const store = useDatePickerStore();

  const { startDate, endDate, setStartDate, setEndDate, setDateState, setSelected, init } = store;

  const helper = useDatePickerHelper();

  const elRef = useRef<HTMLDivElement>(null);
  const inputAreaRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const [isShow, setIsShow] = useState<boolean>(false);
  const [holderText, setHolderText] = useState<string[]>(['', '']);
  const [toggleDateButton, setToggleDateButton] = useState<ToggleButtonType[]>([
    { text: '오늘', checked: false },
    { text: '어제', checked: false },
    { text: '최근 7일(오늘 포함)', checked: false },
    { text: '최근 7일(오늘 제외)', checked: false },
    { text: '이번 달', checked: false },
    { text: '지난 달', checked: false },
  ]);

  const [selectedError, setSelectedError] = useState<string>('');
  const [message, setMessage] = useState<string | boolean>('');
  const [onError, setOnError] = useState<boolean>(false);
  const [errorTransition, setErrorTransition] = useState<boolean>(false);
  const [isValidate, setIsValidate] = useState<boolean>(true);

  // 범위 선택 모드에서 임시 저장용 변수
  const [tempStartDate, setTempStartDate] = useState<string>('');
  const [tempEndDate, setTempEndDate] = useState<string>('');

  const startCalendarRef = useRef<typeof Calendar>(null);
  const endCalendarRef = useRef<typeof Calendar>(null);

  // 스크롤 이벤트 리스너 배열 (여러 요소에 등록할 수 있도록)
  const scrollEventListeners: Array<{
    element: HTMLElement | Window;
    listener: () => void;
  }> = [];

  // 달력 열림/닫힘에 따라 스크롤 이벤트 등록/해제
  useEffect(() => {
    if (isShow) {
      addAllScrollEvents();
    } else {
      removeAllScrollEvents();
    }
  }, [isShow]);

  const oldStartDate = useRef<string>(startDate);
  const oldEndDate = useRef<string>(endDate);

  useEffect(() => {
    oldStartDate.current = startDate;

    // 날짜가 실제로 변경된 경우에만 에러 초기화
    if (JSON.stringify(startDate) !== JSON.stringify(oldStartDate.current)) {
      resetError();
    }
  }, [startDate]);

  useEffect(() => {
    oldEndDate.current = endDate;

    // 날짜가 실제로 변경된 경우에만 에러 초기화
    if (JSON.stringify(endDate) !== JSON.stringify(oldEndDate.current)) {
      resetError();
    }
  }, [endDate]);

  const oldValue = useRef<string | string[]>(value);

  useEffect(() => {
    // 값이 실제로 변경된 경우에만 처리
    if (JSON.stringify(value) !== JSON.stringify(oldValue.current)) {
      dateUpdate(value);

      // datePicker 디폴트값으로 변경시 달력도 초기화 될 수 있도록 처리
      if (range && Array.isArray(value) && Array.isArray(oldValue.current)) {
        if (value[0] !== oldValue.current[0] || value[1] !== oldValue.current[1]) {
          if (value[0] && value[1]) {
            setDateCalender();

            // toggleDateButton 버튼을 클릭했을때 구분하여 버튼 checked 처리
            if (clickToggleDateButton) {
              clickToggleDateButton = false;
            } else {
              toggleDateButton.forEach(item => (item.checked = false));
            }
          }
        }
      }
    }
  }, [value]);

  const oldValidate = useRef<RuleFunc[]>(validate);

  useEffect(() => {
    // 유효성 검사 규칙이 실제로 변경된 경우에만 재검사
    if (JSON.stringify(validate) !== JSON.stringify(oldValidate.current)) {
      setTimeout(() => {
        check(true);
      });
    }
  }, [validate]);

  const oldDisabled = useRef<boolean>(disabled);

  useEffect(() => {
    // 비활성화 상태로 변경된 경우에만 유효성 검사 초기화
    if (disabled !== oldDisabled.current && disabled) {
      resetValidate();
    }
  }, [disabled]);

  // update
  const dateUpdate = (v: string | string[]): void => {
    if (range && Array.isArray(v)) {
      setStartDate(v[0]);
      setEndDate(v[1]);
      setSelected('start', v[0]);
      setSelected('end', v[1]);

      if (v[0] && v[1]) {
        v.forEach((item, index) => {
          const _date = item.split('-').map(_item => Number(_item));
          setDateState(index ? 'end' : 'start', 'year', _date[0]);
          setDateState(index ? 'end' : 'start', 'month', _date[1]);
        });
      }
    } else if (typeof v === 'string') {
      if (v !== '') {
        setStartDate(v);
        setSelected('start', v);
      }
    }
  };

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
   * 배치된 위치에 따라 달력이 보여지는 위치와 방향을 변경
   */
  const toggleCalendar = useCallback((): void => {
    if (!isShow && inputAreaRef.current && pickerRef.current) {
      const { top, bottom, left, right, transformOrigin } = helper.getLayerPosition(
        inputAreaRef.current,
        range,
      );

      pickerRef.current.style.top = top;
      pickerRef.current.style.bottom = bottom;
      pickerRef.current.style.left = left;
      pickerRef.current.style.right = right;
      pickerRef.current.style.transformOrigin = transformOrigin;
    }

    if (!readonly && !disabled) {
      // 달력을 열 때 현재 선택된 날짜를 임시 저장
      if (!isShow && range) {
        setTempStartDate(startDate);
        setTempEndDate(endDate);
      }

      setIsShow(!isShow);
    }
  }, [isShow, readonly, disabled, range, startDate, endDate]);

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

    setTimeout(() => {
      // startCalendar.current?.makeCalendar();

      if (range) {
        // endCalendar.current?.makeCalendar();
      }
    });

    updateValue();
  }, [startDate, endDate]);

  let clickToggleDateButton = false;
  /**
   * props.range === true 일때 버튼을 클릭하여 case에 맞춰서 날짜 지정
   * @param flag
   */
  const pickCaseDate = useCallback(
    (index: number): void => {
      clickToggleDateButton = true;
      toggleDateButton.forEach((item, i) => {
        item.checked = false;

        if (index === i) {
          item.checked = true;
        }
      });

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
    [separator],
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

        setTimeout(() => {
          // startCalendar.current?.makeCalendar();
          // endCalendar.current?.makeCalendar();
        });
      }

      // 빠른 선택 버튼 초기화
      setToggleDateButton(toggleDateButton.map(item => ({ ...item, checked: false })));
    }

    setIsShow(false);
  }, [range, tempStartDate, tempEndDate, separator, toggleDateButton, isShow]);

  /**
   * 적용 버튼 클릭
   */
  const accept = useCallback((): void => {
    if (range && !startDate && !endDate) {
      setErrorMsg();
      return;
    }

    updateValue();
    onUpdateSet([startDate, endDate]);
    onChange([startDate, endDate]);

    // 적용 시 임시 저장 변수도 업데이트
    if (range) {
      setTempStartDate(startDate);
      setTempEndDate(endDate);
    }

    setIsShow(false);
  }, [range, startDate, endDate]);

  /**
   * model update
   */
  const updateValue = useCallback((): void => {
    if (range) {
      // 시작일과 종료일 중 하나라도 선택된 경우 데이터 적용
      if (startDate || endDate) {
        onChange([startDate, endDate]);
      } else {
        setStartDate('');
        setEndDate('');
        onChange(['', '']);
      }
    } else {
      onChange(startDate);
    }

    // 사용자 상호작용으로 인한 값 변경이므로 유효성 검사 실행
    setTimeout(() => {
      check();
    });
  }, [range, startDate, endDate]);

  /**
   * 폼 초기화 처리
   */
  const resetForm = useCallback((): void => {
    init();

    toggleDateButton.forEach(item => (item.checked = false));

    if (startCalendarRef) {
      // startCalendar.resetSelected();
      // startCalendar.makeCalendar();
    }

    if (range && endCalendarRef) {
      // endCalendar.resetSelected();
      // endCalendar.makeCalendar();
      onChange(['', '']);
    } else {
      onChange('');
    }
  }, [range, endCalendarRef, toggleDateButton]);

  /**
   * 유효성 검사 초기화
   */
  const resetValidate = useCallback((): void => {
    setMessage('');
    setIsValidate(true);
    setErrorTransition(false);
  }, [setMessage, setIsValidate, setErrorTransition]);

  /**
   * 유효성 에러 처리 초기화
   */
  const resetError = useCallback((): void => {
    setMessage('');
    setOnError(false);
    setErrorTransition(false);
    setIsValidate(true);
  }, [setMessage, setOnError, setErrorTransition, setIsValidate]);

  /**
   * FormValidate 컴포넌트롤 통한 validation check
   */
  const check = useCallback(
    (silence: boolean = false): boolean => {
      // 비활성화 상태인 경우 검증 성공
      if (disabled) return true;

      // 유효성 검사 규칙이 없는 경우 성공으로 처리
      if (!validate.length) {
        if (!silence) {
          setMessage('');
          setOnError(false);
          setErrorTransition(false);
          setIsValidate(true);
        }

        return true;
      }

      // 데이터 검증
      for (let i = 0; i < validate.length; i++) {
        let result1: string | boolean = true;
        let result2: string | boolean = true;

        if (range) {
          result1 = validate[i](startDate);
          result2 = validate[i](endDate);
        } else {
          result1 = validate[i](startDate);
        }

        if (result1 !== true || result2 !== true) {
          if (!silence) {
            if (range) {
              setMessage((result1 && !result2) || result2);
            } else {
              setMessage(result1);
            }

            setOnError(true);
            setErrorTransition(true);
            setIsValidate(false);
          }

          return false;
        }
      }

      // 모든 검증을 통과한 경우
      if (!silence) {
        setMessage('');
        setOnError(false);
        setErrorTransition(false);
        setIsValidate(true);
      }

      return true;
    },
    [
      disabled,
      validate,
      range,
      startDate,
      endDate,
      setMessage,
      setOnError,
      setErrorTransition,
      setIsValidate,
    ],
  );

  // 스크롤 이벤트 처리
  const setScrollEvent = useCallback(
    (el: HTMLElement): void => {
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
        const listener = useCallback(() => {
          if (isShow) setIsShow(false);
        }, [isShow, setIsShow]);

        parent.addEventListener('scroll', listener, { passive: true });
        scrollEventListeners.push({ element: parent, listener });
      }

      // 재귀적으로 상위 요소 탐색
      setScrollEvent(parent);
    },
    [isShow, setIsShow],
  );

  // 스크롤 이벤트 등록/해제 함수
  const addAllScrollEvents = useCallback(() => {
    if (elRef.current) {
      setScrollEvent(elRef.current);
    }

    addWindowScrollEvent();
  }, [elRef, setScrollEvent]);

  const removeAllScrollEvents = () => {
    scrollEventListeners.forEach(({ element, listener }) => {
      if (element === window) {
        window.removeEventListener('scroll', listener);
      } else if (element instanceof HTMLElement) {
        element.removeEventListener('scroll', listener);
      }
    });

    scrollEventListeners.length = 0;
  };

  /**
   * 달력에서 전달된 날짜의 기간을 검수 하여 maxRange를 초과 한경우 컴포넌트 업데이트 안함
   * @param flag start | end
   */
  const dateTermCheck = useCallback(
    (isEnd: boolean): void => {
      // 단일 날짜 선택 모드
      if (!range) {
        updateValue();
        setIsShow(false);
        return;
      }

      toggleDateButton.forEach(item => (item.checked = false));

      setTimeout(() => {
        // 범위 선택 모드 - 시작일과 종료일이 모두 선택된 경우에만 maxRange 검사
        if (maxRange && startDate && endDate) {
          const startTime: number = new Date(startDate).getTime();
          const endTime: number = new Date(endDate).getTime();

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

        // 달력을 다시 그려준다.
        // startCalendar.current?.makeCalendar();
        // endCalendar.current?.makeCalendar();
      });
    },
    [range, startDate, endDate, setStartDate, setEndDate, setSelected, setErrorMsg, setIsShow],
  );

  // window 스크롤 이벤트 추가
  const addWindowScrollEvent = useCallback((): void => {
    const listener = useCallback(() => {
      if (isShow) setIsShow((prev: boolean) => prev ?? false);
    }, [setIsShow]);

    window.addEventListener('scroll', listener, { passive: true });
    scrollEventListeners.push({ element: window, listener });
  }, [setIsShow]);

  init();

  // const { check, resetValidate } = useValidation({ validate });

  // 외부 클릭 감지
  const onOutsideClick = (evt: MouseEvent) => {
    const target = evt.target as HTMLElement;

    if (!isShow || !elRef) return;

    // DatePicker 컴포넌트 내부 클릭인지 확인
    if (elRef.current?.contains(target)) return;

    // 외부 클릭 시 달력 닫기
    setIsShow(false);
  };

  useEffect(() => {
    dateUpdate(value);

    if (placeholder) {
      if (Array.isArray(placeholder)) {
        setHolderText(placeholder);
      } else if (typeof placeholder === 'string') {
        setHolderText([placeholder, '']);
      }
    }

    if (value) {
      if (range) {
        setStartDate(value[0]);
        setEndDate(value[1]);
      } else if (typeof value === 'string') {
        setStartDate(value);
      }

      if (defaultDate && range) {
        onChange([...value]);
      } else {
        onChange(value);
      }
    }

    document.addEventListener('click', onOutsideClick);

    return () => {
      document.removeEventListener('click', onOutsideClick);
      removeAllScrollEvents();
    };
  });

  useImperativeHandle(ref, () => ({
    check,
    resetForm,
    resetValidate,
  }));

  return (
    <div
      ref={elRef}
      className={['date-picker', { block }].filter(Boolean).join(' ')}
      role="combobox"
      aria-expanded={isShow}
      aria-haspopup="true"
      aria-describedby={message ? 'datepicker-error' : undefined}
    >
      <div className="wrap" onClick={toggleCalendar}>
        {label && (
          <div className="options-wrap">
            <label className="input-label" htmlFor={`datepicker-${label}`}>
              {label}
              {required && <span className="required">*</span>}
            </label>
          </div>
        )}

        <div
          ref={inputAreaRef}
          className={['picker-date-text', { error: message, disabled, readonly, active: isShow }]
            .filter(Boolean)
            .join(' ')}
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              toggleCalendar();
            } else if (e.key === 'Escape') {
              setIsShow(false);
            }
          }}
          aria-label={label ? `${label} 날짜 선택` : '날짜 선택'}
        >
          <input
            readOnly
            type="text"
            placeholder={placeholderText[0]}
            value={disabled ? '' : startDate}
            id={`datepicker-${label}`}
            aria-label={range ? '시작일' : '선택된 날짜'}
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
                aria-label="종료일"
              />
            </>
          )}

          <Icon icon="mdi:calendar-month" width={22} height={22} aria-hidden="true" />
        </div>

        {message && !hideMessage && (
          <div
            className={['feedback', { error: errorTransition }].filter(Boolean).join(' ')}
            id="datepicker-error"
            role="alert"
            aria-live="polite"
          >
            {message}
          </div>
        )}
      </div>

      {/* 달력 표시 */}
      <CSSTransition
        in={isShow}
        timeout={200}
        classNames="picker-scale"
        nodeRef={pickerRef}
        unmountOnExit
        onExited={() => {
          if (blurValidate) {
            check();
          }
        }}
      >
        <div ref={pickerRef} className="picker-popup">
          {range && (
            <div className="search-date" role="group" aria-label="빠른 날짜 선택">
              {toggleDateButton.map((v, i) => (
                <a
                  key={v.text}
                  href="#"
                  className={[v.checked && 'active'].filter(Boolean).join(' ')}
                  onClick={e => {
                    e.preventDefault();
                    pickCaseDate(i);
                  }}
                >
                  {v.text}
                </a>
              ))}
            </div>
          )}

          <div className="picker-wrap">
            <div className="calendar" role="group" aria-label="시작일 달력">
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
                <div className="calendar" role="group" aria-label="종료일 달력">
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
                  <div
                    className={['select-date', { 'selected-error': selectedError }]
                      .filter(Boolean)
                      .join(' ')}
                    role="status"
                    aria-live="polite"
                  >
                    {selectedDateView}
                  </div>
                  <div>
                    <a
                      href="#"
                      className="cancel"
                      onClick={e => {
                        e.preventDefault();
                        cancel();
                      }}
                    >
                      취소
                    </a>
                    <a
                      href="#"
                      className="okay"
                      onClick={e => {
                        e.preventDefault();
                        accept();
                      }}
                    >
                      적용
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </CSSTransition>
    </div>
  );
};

const DatePickerRef = forwardRef<DatePickerModel, DatePickerProps>((props, ref) => {
  return <DatePickerBase {...props} ref={ref} />;
});

DatePickerRef.displayName = 'DatePicker';

export const DatePicker = React.memo(DatePickerRef);
