<script setup lang="ts">
import { Icon } from '@iconify/vue';
import {
  computed,
  getCurrentInstance,
  inject,
  nextTick,
  onMounted,
  onUnmounted,
  provide,
  ref,
  watch,
} from 'vue';
import type { RuleFunc } from '../../types';
import { VALIDATE_FORM_KEY } from '../ValidateForm/const';
import { ValidateFormInjection } from '../ValidateForm/types';
import CalendarPart from './Calendar/index.vue';
import DateController from './DateController/index.vue';
import { useDatePickerHelper } from './helper';
import { useDatePickerStore } from './store';
import type { Calendar, DatePickerEmits, DatePickerProps, ToggleButtonType } from './types';

const props = withDefaults(defineProps<DatePickerProps>(), {
  validate: (): RuleFunc[] => [],
  range: false,
  label: '',
  placeholder: '',
  separator: '-',
  minYear: 1900,
  maxYear: Number(new Date().getFullYear()) + 10,
  block: false,
  required: false,
  hideMessage: false,
  maxRange: 0,
  readonly: false,
  disabled: false,
  blurValidate: true,
  defaultDate: false,
});
const emit = defineEmits<DatePickerEmits>();
const datePickerStore = useDatePickerStore();
provide('datePickerStore', datePickerStore);

const { startDate, endDate, setStartDate, setEndDate, setDateState, setSelected, init } =
  datePickerStore;

const helper = useDatePickerHelper();

const el = ref<HTMLElement>();
const inputArea = ref<HTMLDivElement>();

const isShow = ref<boolean>(false);
const picker = ref<HTMLElement>();
const holderText = ref<string[]>(['', '']);
const toggleDateButton = ref<ToggleButtonType[]>([
  { text: '오늘', checked: false },
  { text: '어제', checked: false },
  { text: '최근 7일(오늘 포함)', checked: false },
  { text: '최근 7일(오늘 제외)', checked: false },
  { text: '이번 달', checked: false },
  { text: '지난 달', checked: false },
]);

const selectedError = ref<string>('');
const message = ref<string | boolean>('');
const onError = ref<boolean>(false);
const errorTransition = ref<boolean>(false);
const isValidate = ref<boolean>(true);
const _modelValue = ref<string | string[]>(props.modelValue);

// 범위 선택 모드에서 임시 저장용 변수
const tempStartDate = ref<string>('');
const tempEndDate = ref<string>('');

const startCalendar = ref<Calendar>();
const endCalendar = ref<Calendar>();

// 스크롤 이벤트 리스너 배열 (여러 요소에 등록할 수 있도록)
const scrollEventListeners: Array<{
  element: HTMLElement | Window;
  listener: () => void;
}> = [];

// 스크롤 이벤트 등록/해제 함수
const addAllScrollEvents = () => {
  if (el.value) {
    setScrollEvent(el.value);
  }

  addWindowScrollEvent();
};
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

// 달력 열림/닫힘에 따라 스크롤 이벤트 등록/해제
watch(isShow, v => {
  if (v) {
    addAllScrollEvents();
  } else {
    removeAllScrollEvents();
  }
});

watch(
  () => [startDate.value, endDate.value],
  (newValue, oldValue) => {
    // 날짜가 실제로 변경된 경우에만 에러 초기화
    if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
      resetError();
    }
  },
);

watch(
  () => props.modelValue,
  (newValue, oldValue) => {
    // 값이 실제로 변경된 경우에만 처리
    if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
      dateUpdate(newValue);

      // datePicker 디폴트값으로 변경시 달력도 초기화 될 수 있도록 처리
      if (props.range && Array.isArray(newValue) && Array.isArray(oldValue)) {
        if (newValue[0] !== oldValue[0] || newValue[1] !== oldValue[1]) {
          if (newValue[0] && newValue[1]) {
            setDateCalender();

            // toggleDateButton 버튼을 클릭했을때 구분하여 버튼 checked 처리
            if (clickToggleDateButton) {
              clickToggleDateButton = false;
            } else {
              toggleDateButton.value.forEach(item => (item.checked = false));
            }
          }
        }
      }
    }
  },
);

watch(
  () => props.validate,
  (newValue, oldValue) => {
    // 유효성 검사 규칙이 실제로 변경된 경우에만 재검사
    if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
      nextTick(() => {
        check(true);
      });
    }
  },
);

watch(
  () => props.disabled,
  (newValue, oldValue) => {
    // 비활성화 상태로 변경된 경우에만 유효성 검사 초기화
    if (newValue !== oldValue && newValue) {
      resetValidate();
    }
  },
);

watch(errorTransition, v => {
  if (v) {
    setTimeout(() => {
      errorTransition.value = false;
    }, 300);
  }
});

// update
const dateUpdate = (v: string | string[]): void => {
  if (props.range && Array.isArray(v)) {
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
const selectedDateView = computed<string>(() => {
  if (!props.range) {
    return '';
  }

  if (selectedError.value !== '') {
    // 날짜 선택을 잘못한 경우 오류 메시지 표시
    return selectedError.value;
  }

  // 시작일과 종료일 중 하나라도 선택된 경우 표시
  if (startDate.value !== '' || endDate.value !== '') {
    const start = startDate.value || '선택 안됨';
    const end = endDate.value || '선택 안됨';
    return `${start} ~ ${end}`;
  }

  return '';
});

// 플레이스홀더 텍스트 메모이제이션
const placeholderText = computed<string[]>(() => {
  if (props.placeholder) {
    if (Array.isArray(props.placeholder)) {
      return props.placeholder;
    } else if (typeof props.placeholder === 'string') {
      return [props.placeholder, ''];
    }
  }
  return ['', ''];
});

// 최대/최소 연도 메모이제이션
const maxYear = computed<number>(() => props.maxYear);
const minYear = computed<number>(() => props.minYear);

/**
 * 배치된 위치에 따라 달력이 보여지는 위치와 방향을 변경
 */
const toggleCalendar = (): void => {
  if (!isShow.value && inputArea.value && picker.value) {
    const { top, bottom, left, right, transformOrigin } = helper.getLayerPosition(
      inputArea.value,
      props.range,
    );

    picker.value.style.top = top;
    picker.value.style.bottom = bottom;
    picker.value.style.left = left;
    picker.value.style.right = right;
    picker.value.style.transformOrigin = transformOrigin;
  }

  if (!props.readonly && !props.disabled) {
    // 달력을 열 때 현재 선택된 날짜를 임시 저장
    if (!isShow.value && props.range) {
      tempStartDate.value = startDate.value;
      tempEndDate.value = endDate.value;
    }

    isShow.value = !isShow.value;
  }
};

const setDateCalender = (): void => {
  // 해당 달력으로 변환
  const s = props.separator;
  const start: string[] = startDate.value.split(s);
  const end: string[] = endDate.value.split(s);

  // 선택되는 날짜에 대한 처리는 Calendar 컴포넌트 내부에서 실행됨
  setDateState('start', 'year', Number(start[0]));
  setDateState('start', 'month', Number(start[1]));
  setDateState('end', 'year', Number(end[0]));
  setDateState('end', 'month', Number(end[1]));

  nextTick(() => {
    startCalendar.value?.makeCalendar();

    if (props.range) {
      endCalendar.value?.makeCalendar();
    }
  });

  updateValue();

  // 범위 선택 모드에서는 자동으로 창을 닫지 않음
  // 사용자가 적용 버튼을 클릭할 때만 창이 닫힘
};

let clickToggleDateButton = false;
/**
 * props.range === true 일때 버튼을 클릭하여 case에 맞춰서 날짜 지정
 * @param flag
 */
const pickCaseDate = (index: number): void => {
  clickToggleDateButton = true;
  toggleDateButton.value.forEach((item, i) => {
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

  const s = props.separator;
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
};

/**
 * 에러 메시지를 표시한 후 3초 후 제거
 * @param msg 에러 메시지 내용
 */
const setErrorMsg = (msg: string = '날짜를 선택해주세요.'): void => {
  selectedError.value = msg;

  setTimeout(() => {
    selectedError.value = '';
  }, 3000);
};

/**
 * 취소 버튼 클릭
 * 임시 저장된 날짜로 되돌리기
 */
const cancel = (): void => {
  if (props.range) {
    // 임시 저장된 날짜로 되돌리기
    setStartDate(tempStartDate.value);
    setEndDate(tempEndDate.value);
    setSelected('start', tempStartDate.value);
    setSelected('end', tempEndDate.value);

    // 달력 상태도 임시 저장된 날짜로 업데이트
    if (tempStartDate.value && tempEndDate.value) {
      const s = props.separator;
      const start: string[] = tempStartDate.value.split(s);
      const end: string[] = tempEndDate.value.split(s);

      setDateState('start', 'year', Number(start[0]));
      setDateState('start', 'month', Number(start[1]));
      setDateState('end', 'year', Number(end[0]));
      setDateState('end', 'month', Number(end[1]));

      nextTick(() => {
        startCalendar.value?.makeCalendar();
        endCalendar.value?.makeCalendar();
      });
    }

    // 빠른 선택 버튼 초기화
    toggleDateButton.value.forEach(item => (item.checked = false));
  }

  isShow.value = false;
};

/**
 * 적용 버튼 클릭
 */
const accept = (): void => {
  if (props.range && !startDate.value && !endDate.value) {
    setErrorMsg();
    return;
  }

  updateValue();
  emit('update:set', [startDate.value, endDate.value]);
  _modelValue.value = [startDate.value, endDate.value];

  // 적용 시 임시 저장 변수도 업데이트
  if (props.range) {
    tempStartDate.value = startDate.value;
    tempEndDate.value = endDate.value;
  }

  isShow.value = false;
};

/**
 * model update
 */
const updateValue = (): void => {
  if (props.range) {
    // 시작일과 종료일 중 하나라도 선택된 경우 데이터 적용
    if (startDate.value || endDate.value) {
      emit('update:modelValue', [startDate.value, endDate.value]);
    } else {
      setStartDate('');
      setEndDate('');
      emit('update:modelValue', ['', '']);
    }
  } else {
    emit('update:modelValue', startDate.value);
  }

  // 사용자 상호작용으로 인한 값 변경이므로 유효성 검사 실행
  nextTick(() => {
    check();
  });
};

/**
 * 폼 초기화 처리
 */
const resetForm = (): void => {
  init();

  toggleDateButton.value.forEach(item => (item.checked = false));

  if (startCalendar.value) {
    startCalendar.value.resetSelected();
    startCalendar.value.makeCalendar();
  }

  if (props.range && endCalendar.value) {
    endCalendar.value.resetSelected();
    endCalendar.value.makeCalendar();
    emit('update:modelValue', ['', '']);
  } else {
    emit('update:modelValue', '');
  }
};

/**
 * 유효성 검사 초기화
 */
const resetValidate = (): void => {
  message.value = '';
  isValidate.value = true;
  errorTransition.value = false;
};

/**
 * 유효성 에러 처리 초기화
 */
const resetError = (): void => {
  message.value = '';
  onError.value = false;
  errorTransition.value = false;
  isValidate.value = true;
};

/**
 * FormValidate 컴포넌트롤 통한 validation check
 */
const check = (silence: boolean = false): boolean => {
  // 비활성화 상태인 경우 검증 성공
  if (props.disabled) {
    return true;
  }

  // 유효성 검사 규칙이 없는 경우 성공으로 처리
  if (!props.validate.length) {
    if (!silence) {
      message.value = '';
      onError.value = false;
      errorTransition.value = false;
      isValidate.value = true;
    }
    return true;
  }

  // 데이터 검증
  for (let i = 0; i < props.validate.length; i++) {
    let result1: string | boolean = true;
    let result2: string | boolean = true;

    if (props.range) {
      result1 = props.validate[i](startDate.value);
      result2 = props.validate[i](endDate.value);
    } else {
      result1 = props.validate[i](startDate.value);
    }

    if (result1 !== true || result2 !== true) {
      if (!silence) {
        if (props.range) {
          message.value = (result1 && !result2) || result2;
        } else {
          message.value = result1;
        }
        onError.value = true;
        errorTransition.value = true;
        isValidate.value = false;
      }

      return false;
    }
  }

  // 모든 검증을 통과한 경우
  if (!silence) {
    message.value = '';
    onError.value = false;
    errorTransition.value = false;
    isValidate.value = true;
  }

  return true;
};

// 외부 클릭 감지
const outsideClickEvent = (evt: MouseEvent): void => {
  const target = evt.target as HTMLElement;

  if (!isShow.value || !el.value) {
    return;
  }

  // DatePicker 컴포넌트 내부 클릭인지 확인
  if (el.value.contains(target)) {
    return;
  }

  // 외부 클릭 시 달력 닫기
  isShow.value = false;
};

// 스크롤 이벤트 처리
const setScrollEvent = (el: HTMLElement): void => {
  const parent = el.parentElement as HTMLElement;

  if (!parent || parent.tagName.toLowerCase() === 'html') {
    return;
  }

  // 스크롤 가능한 요소인지 확인 (overflow: auto/scroll)
  const computedStyle = window.getComputedStyle(parent);
  const overflow = computedStyle.overflow + computedStyle.overflowY + computedStyle.overflowX;

  if (
    overflow.includes('auto') ||
    overflow.includes('scroll') ||
    parent.scrollHeight > parent.clientHeight
  ) {
    const listener = () => {
      if (isShow.value) {
        isShow.value = false;
      }
    };

    parent.addEventListener('scroll', listener, { passive: true });
    scrollEventListeners.push({ element: parent, listener });
  }

  // 재귀적으로 상위 요소 탐색
  setScrollEvent(parent);
};

/**
 * 달력에서 전달된 날짜의 기간을 검수 하여 maxRange를 초과 한경우 컴포넌트 업데이트 안함
 * @param flag start | end
 */
const dateTermCheck = (isEnd: boolean): void => {
  // 단일 날짜 선택 모드
  if (!props.range) {
    updateValue();
    isShow.value = false;
    return;
  }

  toggleDateButton.value.forEach(item => (item.checked = false));

  nextTick(() => {
    // 범위 선택 모드 - 시작일과 종료일이 모두 선택된 경우에만 maxRange 검사
    if (props.maxRange && startDate.value && endDate.value) {
      const startTime: number = new Date(startDate.value).getTime();
      const endTime: number = new Date(endDate.value).getTime();

      // 선택 최대 기간이 설정된 경우 날짜를 계산하여 선택이 안되도록 처리
      const term: number = Math.abs(endTime - startTime) / (86400 * 1000) + 1;

      // 만약 기간이 초과 한다면 변수를 초기화 하고, 다시 랜더링 하지 않는다.
      if (props.maxRange < term) {
        if (!isEnd) {
          setStartDate('');
        } else {
          setEndDate('');
        }

        setErrorMsg(`최대 선택기간 ${props.maxRange}일을 초과 하였습니다.`);
        return;
      }
    }

    // 달력을 다시 그려준다.
    startCalendar.value?.makeCalendar();
    endCalendar.value?.makeCalendar();
  });
};

// window 스크롤 이벤트 추가
const addWindowScrollEvent = (): void => {
  const listener = () => {
    if (isShow.value) {
      isShow.value = false;
    }
  };
  window.addEventListener('scroll', listener, { passive: true });
  scrollEventListeners.push({ element: window, listener });
};

init();

dateUpdate(props.modelValue);

if (props.placeholder) {
  if (Array.isArray(props.placeholder)) {
    holderText.value = props.placeholder;
  } else if (typeof props.placeholder === 'string') {
    holderText.value[0] = props.placeholder;
  }
}

if (props.modelValue) {
  if (props.range) {
    setStartDate(props.modelValue[0]);
    setEndDate(props.modelValue[1]);
  } else if (typeof props.modelValue === 'string') {
    setStartDate(props.modelValue);
  }

  if (props.defaultDate) {
    if (props.range) {
      _modelValue.value = [...props.modelValue];
    } else if (typeof props.modelValue === 'string') {
      _modelValue.value = props.modelValue;
    }
    _modelValue.value = props.modelValue;
  }
}

const validateForm = inject<ValidateFormInjection | null>(VALIDATE_FORM_KEY, null);
const instance = getCurrentInstance();

onMounted(() => {
  if (validateForm !== null && instance) {
    validateForm.addComponent(instance.vnode);
  }

  document.addEventListener('click', outsideClickEvent);
});

onUnmounted(() => {
  document.removeEventListener('click', outsideClickEvent);
  removeAllScrollEvents();
});

defineExpose({
  check,
  resetForm,
  resetValidate,
});
</script>

<template>
  <div
    ref="el"
    :class="['date-picker', { block }]"
    role="combobox"
    :aria-expanded="isShow"
    aria-haspopup="true"
    :aria-describedby="message ? 'datepicker-error' : undefined"
  >
    <div class="wrap" @click="toggleCalendar">
      <div class="options-wrap" v-if="props.label">
        <label class="input-label" :for="`datepicker-${props.label}`">
          {{ props.label }}
          <span class="required" v-if="props.required">*</span>
        </label>
      </div>

      <div
        ref="inputArea"
        :class="[
          'picker-date-text',
          { error: message, disabled: props.disabled, readonly: props.readonly, active: isShow },
        ]"
        tabindex="0"
        @keydown.enter="toggleCalendar"
        @keydown.escape="isShow = false"
        :aria-label="props.label ? `${props.label} 날짜 선택` : '날짜 선택'"
      >
        <input
          readonly
          type="text"
          :placeholder="placeholderText[0]"
          :value="props.disabled ? '' : startDate"
          :id="`datepicker-${props.label}`"
          :aria-label="props.range ? '시작일' : '선택된 날짜'"
        />
        <template v-if="props.range">
          <span class="input-group-text" aria-label="날짜 범위 구분자">~</span>
          <input
            readonly
            type="text"
            :placeholder="placeholderText[1]"
            :value="props.disabled ? '' : endDate"
            aria-label="종료일"
          />
        </template>

        <Icon icon="mdi:calendar-month" :width="22" :height="22" aria-hidden="true" />
      </div>

      <div
        :class="['feedback', { error: errorTransition }]"
        v-show="message && !props.hideMessage"
        id="datepicker-error"
        role="alert"
        aria-live="polite"
      >
        {{ message }}
      </div>
    </div>

    <!-- 달력 표시 -->
    <Transition name="picker-scale" @leave="[emit('blur'), props.blurValidate && check()]">
      <div
        ref="picker"
        class="picker-popup"
        v-show="isShow"
        role="dialog"
        aria-modal="true"
        :aria-label="props.range ? '날짜 범위 선택' : '날짜 선택'"
      >
        <template v-if="props.range">
          <div class="search-date" role="group" aria-label="빠른 날짜 선택">
            <a
              :key="v.text"
              href="#"
              :class="[v.checked && 'active']"
              @click.prevent="pickCaseDate(i)"
              v-for="(v, i) in toggleDateButton"
              role="button"
              :aria-pressed="v.checked"
              :aria-label="v.text"
            >
              {{ v.text }}
            </a>
          </div>
        </template>

        <div class="picker-wrap">
          <div class="calendar" role="group" aria-label="시작일 달력">
            <DateController :max-year="maxYear" :min-year="minYear" />

            <CalendarPart
              ref="startCalendar"
              :separator="props.separator"
              :range="props.range"
              :max-range="props.maxRange"
              @update:date="dateTermCheck"
            />
          </div>

          <template v-if="props.range">
            <div class="calendar" role="group" aria-label="종료일 달력">
              <DateController end :max-year="maxYear" :min-year="minYear" />

              <CalendarPart
                end
                ref="endCalendar"
                :separator="props.separator"
                :range="props.range"
                :max-range="props.maxRange"
                @update:date="dateTermCheck"
              />
            </div>

            <div class="btn-area" role="group" aria-label="날짜 선택 액션">
              <div
                :class="['select-date', { 'selected-error': selectedError }]"
                role="status"
                aria-live="polite"
              >
                {{ selectedDateView }}
              </div>
              <div>
                <a
                  href="#"
                  class="cancel"
                  @click.prevent="cancel"
                  role="button"
                  aria-label="날짜 선택 취소"
                >
                  취소
                </a>
                <a
                  href="#"
                  class="okay"
                  @click.prevent="accept"
                  role="button"
                  aria-label="날짜 선택 적용"
                >
                  적용
                </a>
              </div>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
@use './style';
</style>

<script lang="ts">
export default { name: 'DatePicker' };
</script>
