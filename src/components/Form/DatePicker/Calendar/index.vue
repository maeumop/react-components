<script setup lang="ts">
import { computed, inject, nextTick, ref, watch } from 'vue';
import { transitionCase } from '../const';
import { useDatePickerHelper } from '../helper';
import type {
  CalendarEmits,
  CalendarProps,
  DateCellType,
  DatePickerStore,
  DateStateValueType,
  TransitionCase,
} from '../types';

const props = withDefaults(defineProps<CalendarProps>(), {
  modelValue: '',
  end: false,
});

const emit = defineEmits<CalendarEmits>();

const store = inject('datePickerStore') as DatePickerStore;
const {
  startDate,
  endDate,
  curYear,
  curMonth,
  curDay,
  beforeState,
  dateState,
  selectedDate,
  setStartDate,
  setEndDate,
  setSelected,
} = store;
const helper = useDatePickerHelper();

const caseStartEnd: string = props.end ? 'end' : 'start';
const before: DateStateValueType = beforeState[caseStartEnd];
const state: DateStateValueType = dateState[caseStartEnd];

const isShow = ref<boolean>(true);
const focusedDateIndex = ref<{ row: number; col: number } | null>(null);

const head: string[] = ['일', '월', '화', '수', '목', '금', '토'];
const transitionName = ref<TransitionCase>(transitionCase.down);

// transition을 위한 별도 상태 변수
const isTransitioning = ref<boolean>(false);

// 달력 데이터 메모이제이션
const dateRender = computed<DateCellType[][]>(() => {
  return generateCalendarData();
});

// 달력 데이터 생성 함수
const generateCalendarData = (): DateCellType[][] => {
  const calendarData: DateCellType[][] = [];
  const startWeek: number = new Date(state.year, state.month - 1, 1).getDay();
  const lastDay: number = new Date(state.year, state.month, 0).getDate();

  let day: number = 1;
  let afterDay: number = 1;
  let beforeDay: number = helper.getBeforeDay(state.year, state.month - 1, startWeek);

  // 달력 총 7일 6줄을 생성한다
  for (let i = 0; i < 6; i++) {
    calendarData[i] = [];
  }

  let objData: DateCellType = { day: 0, type: '' };
  const { year, month } = state;

  for (let j = 0; j < 6 * 7; j++) {
    if (j >= startWeek && day <= lastDay) {
      const formatDate = helper.getDateString(year, month, day, props.separator);

      if (selectedDate[caseStartEnd] === formatDate) {
        objData = { day, type: 'selected' };
      } else if (year === curYear.value && month === curMonth.value && day === curDay.value) {
        objData = { day, type: 'today' };
      } else {
        objData = { day, type: 'current' };
      }

      // 시작 날짜와 끝 날짜 사이에 색상 표시
      if (objData.type !== 'selected' && props.range) {
        const time = new Date(formatDate).getTime();

        // 시작일과 종료일이 모두 선택된 경우에만 범위 표시
        if (startDate.value && endDate.value) {
          const startTime = new Date(startDate.value).getTime();
          const endTime = new Date(endDate.value).getTime();
          const minTime = Math.min(startTime, endTime);
          const maxTime = Math.max(startTime, endTime);

          if (time >= minTime && time <= maxTime) {
            objData.type = 'date-range';
          }
        }

        // 종료일 선택 시 시작일이 없어도 선택 가능하도록 제한 완화
        if (props.end && startDate.value) {
          const startTime = new Date(startDate.value).getTime();
          if (time < startTime) {
            objData.type = 'disabled';
          }
        } else if (props.end === false && endDate.value) {
          const endTime = new Date(endDate.value).getTime();
          if (time > endTime) {
            objData.type = 'disabled';
          }
        }
      }

      day++;
    } else if (day > lastDay) {
      objData = { day: afterDay++, type: 'afterMonth' };
    } else if (j < startWeek) {
      objData = { day: beforeDay++, type: 'beforeMonth' };
    }

    const index = Math.floor(j / 7);
    calendarData[index][j % 7] = objData;
  }

  return calendarData;
};

// 날짜 선택 처리
const selectedDay = (tr: number, td: number): void => {
  const { type, day } = dateRender.value[tr][td];

  if (['current', 'today', 'date-range'].includes(type)) {
    const date: string = helper.getDateString(state.year, state.month, day, props.separator);
    setSelected(caseStartEnd, date);

    if (props.end) {
      // 종료일 선택 시 시작일이 없어도 선택 가능
      setEndDate(selectedDate[caseStartEnd]);
    } else {
      setStartDate(selectedDate[caseStartEnd]);
    }

    // 범위 선택 모드에서는 날짜 선택 시 창을 닫지 않음
    // 단일 날짜 선택 모드에서만 창이 닫힘
    emit('update:date', props.end);
  }
};

// 키보드 네비게이션
const handleKeydown = (event: KeyboardEvent, row: number, col: number): void => {
  const { type } = dateRender.value[row][col];

  if (['beforeMonth', 'afterMonth', 'disabled'].includes(type)) {
    return;
  }

  let newRow = row;
  let newCol = col;

  switch (event.key) {
    case 'ArrowLeft':
      if (col > 0) {
        newCol = col - 1;
      } else if (row > 0) {
        newRow = row - 1;
        newCol = 6;
      }
      break;
    case 'ArrowRight':
      if (col < 6) {
        newCol = col + 1;
      } else if (row < 5) {
        newRow = row + 1;
        newCol = 0;
      }
      break;
    case 'ArrowUp':
      if (row > 0) {
        newRow = row - 1;
      }
      break;
    case 'ArrowDown':
      if (row < 5) {
        newRow = row + 1;
      }
      break;
    case 'Enter':
    case ' ':
      event.preventDefault();
      selectedDay(row, col);
      return;
    default:
      return;
  }

  // 유효한 날짜인지 확인
  const newCell = dateRender.value[newRow]?.[newCol];
  if (newCell && !['beforeMonth', 'afterMonth', 'disabled'].includes(newCell.type)) {
    focusedDateIndex.value = { row: newRow, col: newCol };
  }
};

// 포커스 설정
const setFocus = (row: number, col: number): void => {
  focusedDateIndex.value = { row, col };
};

// 날짜 셀의 ARIA 라벨 생성
const getAriaLabel = (cell: DateCellType): string => {
  const { day, type } = cell;

  if (type === 'beforeMonth' || type === 'afterMonth') {
    return `${day}일 (다른 달)`;
  }

  if (type === 'disabled') {
    return `${day}일 (선택 불가)`;
  }

  if (type === 'today') {
    return `${day}일 (오늘)`;
  }

  if (type === 'selected') {
    return `${day}일 (선택됨)`;
  }

  if (type === 'date-range') {
    return `${day}일 (범위 내)`;
  }

  return `${day}일`;
};

// 날짜 셀의 선택 가능 여부 확인
const isSelectable = (type: string): boolean => {
  return ['current', 'today', 'date-range'].includes(type);
};

// 날짜 셀의 포커스 가능 여부 확인
const isFocusable = (type: string): boolean => {
  return !['beforeMonth', 'afterMonth', 'disabled'].includes(type);
};

watch([startDate, endDate], v => {
  const date = props.end ? endDate.value : startDate.value;

  if (v) {
    setSelected(caseStartEnd, date);
  } else {
    setSelected(caseStartEnd, '');
  }
});

watch(
  () => state.year,
  v => {
    if (v > before.year) {
      transitionName.value = transitionCase.down;
    } else {
      transitionName.value = transitionCase.up;
    }

    // transition 효과를 위해 잠시 숨기고 다시 보이기
    isTransitioning.value = true;
    isShow.value = false;
  },
);

watch(
  () => state.month,
  v => {
    if (v > before.month) {
      transitionName.value = transitionCase.left;
    } else {
      transitionName.value = transitionCase.right;
    }

    // transition 효과를 위해 잠시 숨기고 다시 보이기
    isTransitioning.value = true;
    isShow.value = false;
  },
);

const resetTransition = (): void => {
  setTimeout(() => {
    isShow.value = true;
    isTransitioning.value = false;
    // 포커스 초기화
    nextTick(() => {
      focusedDateIndex.value = null;
    });
  }, 20);
};

const resetSelected = (): void => {
  setSelected(caseStartEnd, '');
};

defineExpose({
  resetSelected,
  makeCalendar: () => {
    // computed로 변경되어 자동으로 업데이트됨
  },
});
</script>

<template>
  <div
    class="select-calendar-wrap"
    role="grid"
    :aria-label="props.end ? '종료일 달력' : '시작일 달력'"
  >
    <Transition :name="transitionName" @after-leave="resetTransition">
      <div class="select-calendar" v-show="isShow">
        <ul class="header" role="row">
          <li
            :key="`start-head-${name}`"
            :class="{ sun: i === 0, sat: i === 6 }"
            v-for="(name, i) in head"
            role="columnheader"
            :aria-label="`${name}요일`"
          >
            {{ name }}
          </li>
        </ul>
        <ul :key="`start-tr-${i}`" v-for="(li, i) in dateRender" role="row">
          <li
            :key="`calendar-${item.type}-${item.day}`"
            :class="[
              item.type,
              {
                sun: j === 0,
                sat: j === 6,
                focused: focusedDateIndex?.row === i && focusedDateIndex?.col === j,
              },
            ]"
            @click.stop.prevent="selectedDay(i, j)"
            @keydown="handleKeydown($event, i, j)"
            @focus="setFocus(i, j)"
            :tabindex="isFocusable(item.type) ? 0 : -1"
            :aria-label="getAriaLabel(item)"
            :aria-selected="item.type === 'selected'"
            :aria-disabled="!isSelectable(item.type)"
            role="gridcell"
            v-for="(item, j) in li"
          >
            {{ item.day }}
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
@use './style';
</style>

<script lang="ts">
export default { name: 'Calendar' };
</script>
