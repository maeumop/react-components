<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { computed, inject } from 'vue';
import type { DateControllerProps, DatePickerStore } from '../types';

import Selector from '../Selector/index.vue';

const props = defineProps<DateControllerProps>();

const store = inject('datePickerStore') as DatePickerStore;
const { dateState, setDateState } = store;

// 현재 연도/월 메모이제이션
const currentYear = computed<number>(() => {
  const flag: string = props.end ? 'end' : 'start';
  return dateState[flag].year;
});

const currentMonth = computed<number>(() => {
  const flag: string = props.end ? 'end' : 'start';
  return dateState[flag].month;
});

// 연도 변경 가능 여부 확인
const canDecreaseYear = computed<boolean>(() => {
  return currentYear.value > props.minYear;
});

const canIncreaseYear = computed<boolean>(() => {
  return currentYear.value < props.maxYear;
});

// 월 변경 가능 여부 확인
const canDecreaseMonth = computed<boolean>(() => {
  if (currentMonth.value > 1) {
    return true;
  }
  return currentYear.value > props.minYear;
});

const canIncreaseMonth = computed<boolean>(() => {
  if (currentMonth.value < 12) {
    return true;
  }
  return currentYear.value < props.maxYear;
});

/**
 * 연도 변경
 * @param v
 * @param calc
 */
const changedYear = (v: number, calc: boolean = false): void => {
  const flag: string = props.end ? 'end' : 'start';
  let year: number = v;

  if (calc) {
    year = dateState[flag].year + v;

    if (year > props.maxYear) {
      year = props.maxYear;
    } else if (year < props.minYear) {
      year = props.minYear;
    }
  }

  setDateState(flag, 'year', year);
};

/**
 * 월 변경, 계산 된 내용이 1 미만, 12 초과 일 경우 연도를 새로 계산하여 적용
 * @param v
 * @param calc
 */
const changedMonth = (v: number, calc: boolean = false): void => {
  const flag: string = props.end ? 'end' : 'start';
  let month: number = v;

  if (calc) {
    month = dateState[flag].month + v;

    let year: number = dateState[flag].year;

    if (month > 12) {
      month = 1;
      year++;
    } else if (month <= 0) {
      month = 12;
      year--;
    }

    setDateState(flag, 'year', year);
  }

  setDateState(flag, 'month', month);
};

// 키보드 이벤트 처리
const handleKeydown = (
  event: KeyboardEvent,
  action: 'year' | 'month',
  direction: 'prev' | 'next',
): void => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();

    if (action === 'year') {
      if (direction === 'prev' && canDecreaseYear.value) {
        changedYear(-1, true);
      } else if (direction === 'next' && canIncreaseYear.value) {
        changedYear(1, true);
      }
    } else {
      if (direction === 'prev' && canDecreaseMonth.value) {
        changedMonth(-1, true);
      } else if (direction === 'next' && canIncreaseMonth.value) {
        changedMonth(1, true);
      }
    }
  }
};

// ARIA 라벨 생성
const getAriaLabel = (action: 'year' | 'month', direction: 'prev' | 'next'): string => {
  const calendarType = props.end ? '종료일' : '시작일';
  const actionText = action === 'year' ? '연도' : '월';
  const directionText = direction === 'prev' ? '이전' : '다음';

  return `${calendarType} ${actionText} ${directionText}`;
};
</script>

<template>
  <div
    class="select-month"
    role="toolbar"
    :aria-label="props.end ? '종료일 날짜 컨트롤' : '시작일 날짜 컨트롤'"
  >
    <!-- 연도 이전 버튼 -->
    <button
      type="button"
      class="control-button year-prev"
      :class="{ disabled: !canDecreaseYear }"
      :disabled="!canDecreaseYear"
      @click="changedYear(-1, true)"
      @keydown="handleKeydown($event, 'year', 'prev')"
      :aria-label="getAriaLabel('year', 'prev')"
      tabindex="0"
    >
      <Icon icon="mdi:chevron-double-left" />
    </button>

    <!-- 월 이전 버튼 -->
    <button
      type="button"
      class="control-button month-prev"
      :class="{ disabled: !canDecreaseMonth }"
      :disabled="!canDecreaseMonth"
      @click="changedMonth(-1, true)"
      @keydown="handleKeydown($event, 'month', 'prev')"
      :aria-label="getAriaLabel('month', 'prev')"
      tabindex="0"
    >
      <Icon icon="mdi:chevron-left" />
    </button>

    <!-- 연도/월 선택기 -->
    <div class="selector-group" role="group" aria-label="연도 및 월 선택">
      <Selector year :end="props.end" :max="maxYear" :min="minYear" />
      <Selector month :end="props.end" />
    </div>

    <!-- 월 다음 버튼 -->
    <button
      type="button"
      class="control-button month-next"
      :class="{ disabled: !canIncreaseMonth }"
      :disabled="!canIncreaseMonth"
      @click="changedMonth(1, true)"
      @keydown="handleKeydown($event, 'month', 'next')"
      :aria-label="getAriaLabel('month', 'next')"
      tabindex="0"
    >
      <Icon icon="mdi:chevron-right" />
    </button>

    <!-- 연도 다음 버튼 -->
    <button
      type="button"
      class="control-button year-next"
      :class="{ disabled: !canIncreaseYear }"
      :disabled="!canIncreaseYear"
      @click="changedYear(1, true)"
      @keydown="handleKeydown($event, 'year', 'next')"
      :aria-label="getAriaLabel('year', 'next')"
      tabindex="0"
    >
      <Icon icon="mdi:chevron-double-right" />
    </button>
  </div>
</template>

<style scoped lang="scss">
@use './style';
</style>

<script lang="ts">
export default { name: 'DateController' };
</script>
