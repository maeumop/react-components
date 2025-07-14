<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { computed, inject, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import type { DatePickerStore, DropdownStateType, SelectorProps } from '../types';

const props = withDefaults(defineProps<SelectorProps>(), {
  max: 0,
  min: 1900,
  year: false,
  month: false,
  end: false,
});

const store = inject('datePickerStore') as DatePickerStore;
const { dateState, setDateState, dropdownState, setDropdownState } = store;

// 목록
const el = ref<HTMLElement>();
const items = ref<number[]>([]);
const searchText = ref<string>('');
const focusedIndex = ref<number>(-1);

const flag: 'start' | 'end' = props.end ? 'end' : 'start';

// 현재 드롭다운 상태 계산
const isShow = computed<boolean>(() => {
  const key = `${flag}${props.year ? 'Year' : 'Month'}` as keyof DropdownStateType;
  return dropdownState[key];
});

// 필터링된 아이템 메모이제이션
const filteredItems = computed<number[]>(() => {
  if (!searchText.value) {
    return items.value;
  }

  const search = searchText.value.toLowerCase();
  return items.value.filter(item => item.toString().includes(search));
});

// 현재 선택된 값 메모이제이션
const getDateString = computed<string>(() => {
  return props.year ? dateState[flag].year + '년' : dateState[flag].month + '월';
});

const getDate = computed<number>(() => {
  return props.year ? dateState[flag].year : dateState[flag].month - 1;
});

// 아이템 초기화
const initializeItems = (): void => {
  items.value = [];

  if (props.year) {
    const maxYear = props.max ? props.max : new Date().getFullYear();
    for (let i = maxYear; i >= props.min; i--) {
      items.value.push(i);
    }
  } else if (props.month) {
    for (let i = 0; i < 12; i++) {
      items.value.push(i);
    }
  }
};

// 아이템 변경 감지
watch(
  () => props.max,
  () => {
    if (props.year) {
      initializeItems();
    }
  },
);

// 드롭다운 표시 상태 감지
watch(isShow, v => {
  if (v) {
    searchText.value = '';
    focusedIndex.value = -1;

    nextTick(() => {
      if (el.value) {
        const li = el.value.querySelector<HTMLLIElement>('li.active');
        const top: number = li ? li.offsetTop - li.offsetHeight : 0;
        el.value.scrollTop = top;
      }
    });
  }
});

/**
 * 선택된 연, 월 적용
 * @param v
 */
const changedDate = (v: number): void => {
  setDateState(flag, props.year ? 'year' : 'month', props.year ? v : v + 1);
  setDropdownState(flag, props.year ? 'year' : 'month', false);
  searchText.value = '';
  focusedIndex.value = -1;
};

// 클릭 이벤트 처리
const handleClick = (event: Event): void => {
  event.preventDefault();
  event.stopPropagation();
  const currentType = props.year ? 'year' : 'month';
  const newState = !isShow.value;
  setDropdownState(flag, currentType, newState);
};

// 키보드 네비게이션
const handleKeydown = (event: KeyboardEvent): void => {
  if (!isShow.value) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setDropdownState(flag, props.year ? 'year' : 'month', true);
    }
    return;
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      if (focusedIndex.value < filteredItems.value.length - 1) {
        focusedIndex.value++;
      } else {
        focusedIndex.value = 0;
      }
      scrollToFocused();
      break;
    case 'ArrowUp':
      event.preventDefault();
      if (focusedIndex.value > 0) {
        focusedIndex.value--;
      } else {
        focusedIndex.value = filteredItems.value.length - 1;
      }
      scrollToFocused();
      break;
    case 'Enter':
      event.preventDefault();
      if (focusedIndex.value >= 0) {
        changedDate(filteredItems.value[focusedIndex.value]);
      }
      break;
    case 'Escape':
      event.preventDefault();
      setDropdownState(flag, props.year ? 'year' : 'month', false);
      searchText.value = '';
      focusedIndex.value = -1;
      break;
    case 'Home':
      event.preventDefault();
      focusedIndex.value = 0;
      scrollToFocused();
      break;
    case 'End':
      event.preventDefault();
      focusedIndex.value = filteredItems.value.length - 1;
      scrollToFocused();
      break;
  }
};

// 포커스된 아이템으로 스크롤
const scrollToFocused = (): void => {
  nextTick(() => {
    if (el.value && focusedIndex.value >= 0) {
      const items = el.value.querySelectorAll('li');
      const focusedItem = items[focusedIndex.value];
      if (focusedItem) {
        focusedItem.scrollIntoView({ block: 'nearest' });
      }
    }
  });
};

// 아이템 클릭 처리
const handleItemClick = (event: Event, item: number, index: number): void => {
  event.stopPropagation();
  focusedIndex.value = index;
  changedDate(item);
};

// 아이템 포커스 처리
const handleItemFocus = (index: number): void => {
  focusedIndex.value = index;
};

const Selector = ref<HTMLDivElement>();

/**
 * 년, 월 드롭 다운 레이어 외의 구역을 클릭 할 경우 레이어 닫기
 * @param evt
 */
const outsideClickEvent = (evt: Event): void => {
  const target = evt.target as HTMLElement;

  if (!Selector.value?.contains(target)) {
    setDropdownState(flag, props.year ? 'year' : 'month', false);
    searchText.value = '';
    focusedIndex.value = -1;
  }
};

// ARIA 라벨 생성
const getAriaLabel = (): string => {
  const calendarType = props.end ? '종료일' : '시작일';
  const selectorType = props.year ? '연도' : '월';
  return `${calendarType} ${selectorType} 선택`;
};

onMounted(() => {
  initializeItems();
  document.addEventListener('click', outsideClickEvent);
});

onUnmounted(() => {
  document.removeEventListener('click', outsideClickEvent);
});
</script>

<template>
  <div
    ref="Selector"
    @click="handleClick"
    @keydown="handleKeydown"
    :tabindex="0"
    :aria-label="getAriaLabel()"
    :aria-expanded="isShow"
    :aria-haspopup="true"
    role="combobox"
    :class="['selector-trigger', { month: props.month, year: props.year }]"
  >
    <div class="selector-trigger-text">
      {{ getDateString }}
      <Icon icon="mdi:chevron-down" class="selector-icon" :class="{ rotated: isShow }" />
    </div>

    <Transition appear name="trans-slide-down">
      <div
        :class="['selector-box', { month: props.month, year: props.year }]"
        v-show="isShow"
        role="listbox"
        :aria-label="getAriaLabel()"
        @click.stop
      >
        <div class="selector-box-wrap">
          <ul ref="el" @click.stop>
            <li
              :key="`date-${num}`"
              :class="{
                active: num === getDate,
                focused: focusedIndex === index,
              }"
              @click="handleItemClick($event, num, index)"
              @focus="handleItemFocus(index)"
              :tabindex="isShow ? 0 : -1"
              :aria-selected="num === getDate"
              role="option"
              v-for="(num, index) in filteredItems"
            >
              {{ props.year ? num : num + 1 }}
            </li>
          </ul>

          <!-- 검색 결과 없음 메시지 -->
          <div
            v-if="searchText && filteredItems.length === 0"
            class="no-results"
            role="status"
            aria-live="polite"
          >
            검색 결과가 없습니다.
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
@use './style';
</style>

<script lang="ts">
export default { name: 'Selector' };
</script>
