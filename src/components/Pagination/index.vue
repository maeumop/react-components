<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { computed, ref, watch, watchEffect } from 'vue';
import { paginationDefaultOptions } from './const';
import type { PaginationEmits, PaginationItem, PaginationProps } from './types';

const props = withDefaults(defineProps<PaginationProps>(), {
  size: paginationDefaultOptions.size,
  block: paginationDefaultOptions.block,
  total: paginationDefaultOptions.total,
  disabled: paginationDefaultOptions.disabled,
  ariaLabel: paginationDefaultOptions.ariaLabel,
  pageSizeOptions: (): number[] => [...paginationDefaultOptions.pageSizeOptions],
});

const emit = defineEmits<PaginationEmits>();

// 반응형 상태
const pageList = ref<PaginationItem[]>([]);
const maxPage = ref<number>(1);
const pageBlock = ref<number>(10);
const startPage = ref<number>(1);
const endPage = ref<number>(1);
const prev = ref<number>(0);
const next = ref<number>(0);

// 계산된 속성
const nowPage = computed<number>(() => {
  let result: number = 1;

  if (props.modelValue) {
    result = props.modelValue;
    result = Math.max(1, Math.min(result, maxPage.value));
  }

  return result;
});

const isDisabledPrev = computed(() => Boolean(props.disabled) || nowPage.value <= 1);
const isDisabledNext = computed(() => Boolean(props.disabled) || nowPage.value >= maxPage.value);
const isDisabledFirst = computed(() => Boolean(props.disabled) || nowPage.value <= 1);
const isDisabledLast = computed(() => Boolean(props.disabled) || nowPage.value >= maxPage.value);
const totalPages = computed<number>(() => Math.ceil((props.total ?? 1) / props.size));
const startItem = computed<number>(() => (nowPage.value - 1) * props.size + 1);
const endItem = computed<number>(() => Math.min(nowPage.value * props.size, props.total));

// 페이지 리스트 생성
const makePageList = (now: number = nowPage.value): void => {
  pageList.value = [];
  maxPage.value = totalPages.value;

  if (maxPage.value <= 0) {
    maxPage.value = 1;
  }

  startPage.value = Math.floor((now - 1) / pageBlock.value) * pageBlock.value + 1;
  endPage.value = Math.min(startPage.value + pageBlock.value - 1, maxPage.value);

  if (endPage.value === 0) {
    endPage.value = 1;
  }

  prev.value = Math.max(startPage.value - 1, 1);
  next.value = Math.min(startPage.value + pageBlock.value, maxPage.value);

  for (let num = startPage.value; num <= endPage.value; num++) {
    pageList.value.push({
      num,
      isOn: now === num,
    });
  }
};

// 페이지 변경
const updateValue = (v: number): void => {
  if (props.disabled) {
    return;
  }

  const newPage = Math.max(1, Math.min(v, maxPage.value));
  if (newPage !== nowPage.value) {
    emit('update:modelValue', newPage);
  }
};

// 페이지 크기 변경
const handlePageSizeChange = (event: Event): void => {
  const target = event.target as HTMLSelectElement;
  const newSize = parseInt(target.value, 10);
  emit('pageSizeChange', newSize);
};

// 키보드 이벤트 처리
const handleKeyDown = (event: KeyboardEvent, page: number): void => {
  if (props.disabled) {
    return;
  }

  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      updateValue(page);
      break;
    case 'ArrowLeft':
      event.preventDefault();
      updateValue(nowPage.value - 1);
      break;
    case 'ArrowRight':
      event.preventDefault();
      updateValue(nowPage.value + 1);
      break;
    case 'Home':
      event.preventDefault();
      updateValue(1);
      break;
    case 'End':
      event.preventDefault();
      updateValue(maxPage.value);
      break;
  }
};

// 감시자
watch(
  () => [props.total, props.size, props.block],
  () => {
    makePageList();
  },
);

watch(
  () => props.block,
  () => {
    pageBlock.value = props.block ?? 10;
  },
);

watchEffect(
  () => {
    makePageList(props.modelValue);
  },
  { flush: 'post' },
);

// 초기화
makePageList();
</script>

<template>
  <nav class="pagination" :aria-label="props.ariaLabel" role="navigation">
    <!-- 페이지 정보 표시 -->
    <div class="pagination-info" v-if="props.total > 0">
      <span class="pagination-text">
        {{ startItem }} - {{ endItem }} / {{ props.total }}개 항목
      </span>
    </div>

    <!-- 페이지네이션 컨트롤 -->
    <ul class="pagination-list" role="list">
      <!-- 첫 페이지 -->
      <li :class="['pagination-item', { disabled: isDisabledFirst }]" role="listitem">
        <button
          type="button"
          class="pagination-button"
          :disabled="isDisabledFirst"
          :aria-label="`첫 페이지로 이동`"
          @click="updateValue(1)"
          @keydown="handleKeyDown($event, 1)"
        >
          <Icon icon="mdi:chevron-double-left" size="20" />
        </button>
      </li>

      <!-- 이전 페이지 블록 -->
      <li :class="['pagination-item', { disabled: isDisabledPrev }]" role="listitem">
        <button
          type="button"
          class="pagination-button"
          :disabled="isDisabledPrev"
          :aria-label="`이전 ${props.block}페이지로 이동`"
          @click="updateValue(prev)"
          @keydown="handleKeyDown($event, prev)"
        >
          <Icon icon="mdi:chevron-left" size="20" />
        </button>
      </li>

      <!-- 페이지 번호들 -->
      <li
        v-for="item in pageList"
        :key="`page-${item.num}`"
        :class="['pagination-item', { active: item.isOn }]"
        role="listitem"
      >
        <button
          type="button"
          class="pagination-button"
          :aria-label="`${item.num}페이지로 이동`"
          :aria-current="item.isOn ? 'page' : undefined"
          @click="updateValue(item.num)"
          @keydown="handleKeyDown($event, item.num)"
        >
          {{ item.num }}
        </button>
      </li>

      <!-- 다음 페이지 블록 -->
      <li :class="['pagination-item', { disabled: isDisabledNext }]" role="listitem">
        <button
          type="button"
          class="pagination-button"
          :disabled="isDisabledNext"
          :aria-label="`다음 ${props.block}페이지로 이동`"
          @click="updateValue(next)"
          @keydown="handleKeyDown($event, next)"
        >
          <Icon icon="mdi:chevron-right" size="20" />
        </button>
      </li>

      <!-- 마지막 페이지 -->
      <li :class="['pagination-item', { disabled: isDisabledLast }]" role="listitem">
        <button
          type="button"
          class="pagination-button"
          :disabled="isDisabledLast"
          :aria-label="`마지막 페이지로 이동`"
          @click="updateValue(maxPage)"
          @keydown="handleKeyDown($event, maxPage)"
        >
          <Icon icon="mdi:chevron-double-right" size="20" />
        </button>
      </li>
    </ul>

    <!-- 페이지 크기 선택 -->
    <div class="pagination-size-selector" v-if="props.pageSizeOptions.length > 0">
      <label for="page-size" class="pagination-size-label"> 페이지당 항목: </label>
      <select
        id="page-size"
        class="pagination-size-select"
        :value="props.size"
        @change="handlePageSizeChange"
        :disabled="props.disabled"
      >
        <option v-for="option in props.pageSizeOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </div>
  </nav>
</template>

<style scoped lang="scss">
@use './style';
</style>

<script lang="ts">
export default { name: 'Pagination' };
</script>
