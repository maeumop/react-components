<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { statusSelectorColor, statusSelectorDefaultOptions } from './const';
import type { StatusSelectorEmits, StatusSelectorItem, StatusSelectorProps } from './types';

const props = withDefaults(defineProps<StatusSelectorProps>(), {
  circle: statusSelectorDefaultOptions.circle,
  readOnly: statusSelectorDefaultOptions.readOnly,
  bgColor: statusSelectorDefaultOptions.bgColor,
  size: statusSelectorDefaultOptions.size,
});

const emit = defineEmits<StatusSelectorEmits>();

// 반응형 상태
const isShow = ref<boolean>(false);
const selectedIndex = ref<number>(-1);
const focusedIndex = ref<number>(-1);
const selectorRef = ref<HTMLDivElement>();
const listRef = ref<HTMLUListElement>();

// 계산된 속성
const selectedOption = computed<StatusSelectorItem | undefined>(() => {
  return props.options.find(option => option.value === props.modelValue);
});

const currentText = computed<string>(() => {
  return selectedOption.value?.text ?? '선택해주세요';
});

const currentColor = computed<string>(() => {
  return selectedOption.value?.color ?? 'grey';
});

const wrapStyle = computed(() => {
  return { backgroundColor: props.bgColor };
});

// 유효성 검사
const validateOptions = (options: StatusSelectorItem[]): void => {
  if (!options || options.length === 0) {
    throw new Error('StatusSelector requires at least one option');
  }
};

// 메서드
const toggle = (): void => {
  if (props.readOnly) {
    return;
  }

  isShow.value = !isShow.value;

  if (isShow.value) {
    nextTick(() => {
      // 드롭다운이 열릴 때 현재 선택된 항목에 포커스
      if (selectedIndex.value >= 0) {
        focusedIndex.value = selectedIndex.value;
        focusItemByIndex(selectedIndex.value);
      } else {
        focusFirstItem();
      }
    });
  }
};

const close = (): void => {
  isShow.value = false;
  focusedIndex.value = -1;
};

const selectOption = (index: number): void => {
  if (index < 0 || index >= props.options.length) {
    return;
  }

  const option = props.options[index];
  selectedIndex.value = index;
  focusedIndex.value = index;

  emit('update:modelValue', option.value);
  emit('update:selectedIndex', index);
  emit('change', option.value, index);

  close();
};

const focusFirstItem = (): void => {
  if (listRef.value && props.options.length > 0) {
    focusedIndex.value = 0;
    focusItemByIndex(0);
  }
};

const focusNextItem = (): void => {
  if (!listRef.value || props.options.length === 0) {
    return;
  }

  const nextIndex = focusedIndex.value < 0 ? 0 : (focusedIndex.value + 1) % props.options.length;
  focusItemByIndex(nextIndex);
};

const focusPreviousItem = (): void => {
  if (!listRef.value || props.options.length === 0) {
    return;
  }

  const prevIndex = focusedIndex.value <= 0 ? props.options.length - 1 : focusedIndex.value - 1;
  focusItemByIndex(prevIndex);
};

const focusItemByIndex = (index: number): void => {
  if (!listRef.value || index < 0 || index >= props.options.length) {
    return;
  }

  focusedIndex.value = index;
  const focusableElements = listRef.value.querySelectorAll('li');
  if (focusableElements[index]) {
    (focusableElements[index] as HTMLLIElement).focus();
  }
};

// 키보드 이벤트 처리
const handleKeydown = (event: KeyboardEvent): void => {
  if (props.readOnly) {
    return;
  }

  switch (event.key) {
    case 'Enter':
    case ' ': {
      event.preventDefault();
      if (isShow.value) {
        if (focusedIndex.value >= 0 && focusedIndex.value < props.options.length) {
          selectOption(focusedIndex.value);
        }
      } else {
        toggle();
      }
      break;
    }
    case 'Escape': {
      if (isShow.value) {
        close();
      }
      break;
    }
    case 'ArrowDown': {
      event.preventDefault();
      if (isShow.value) {
        focusNextItem();
      } else {
        toggle();
      }
      break;
    }
    case 'ArrowUp': {
      event.preventDefault();
      if (isShow.value) {
        focusPreviousItem();
      }
      break;
    }
  }
};

// 외부 클릭 감지
const handleOutsideClick = (event: Event): void => {
  const target = event.target as Element;
  if (selectorRef.value && !selectorRef.value.contains(target)) {
    close();
  }
};

// 색상 클래스 계산
const getColorClass = (color: string): string => {
  const predefinedColors = Object.values(statusSelectorColor) as string[];
  return predefinedColors.includes(color) ? color : '';
};

// 라이프사이클 훅
onMounted(() => {
  validateOptions(props.options);

  // 초기 선택된 옵션 찾기
  const initialIndex = props.options.findIndex(option => option.value === props.modelValue);
  if (initialIndex !== -1) {
    selectedIndex.value = initialIndex;
  }

  document.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
});
</script>

<template>
  <div
    ref="selectorRef"
    :class="['status-selector', `size-${props.size}`, { readonly: props.readOnly }]"
    @click="toggle"
    @keydown="handleKeydown"
    role="combobox"
    :aria-expanded="isShow"
    :aria-haspopup="true"
    :aria-disabled="props.readOnly"
    tabindex="0"
  >
    <div :class="['wrap', { readonly: props.readOnly }]" :style="wrapStyle">
      <span
        v-if="props.circle"
        :class="['circle', getColorClass(currentColor)]"
        :style="getColorClass(currentColor) ? {} : { backgroundColor: currentColor }"
        aria-hidden="true"
      />
      <span :style="getColorClass(currentColor) ? {} : { color: currentColor }">
        {{ currentText }}
      </span>
      <svg
        v-if="!props.readOnly"
        :class="{ rotate: isShow }"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M7 10L12 15L17 10"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <Transition name="fade">
      <ul v-show="isShow" ref="listRef" role="listbox" :aria-label="`상태 선택 옵션`">
        <li
          v-for="(item, index) in props.options"
          :key="`selector-${index}`"
          :class="{ selected: index === selectedIndex }"
          @click.stop="selectOption(index)"
          @keydown.enter="selectOption(index)"
          @keydown.space.prevent="selectOption(index)"
          @focus="focusedIndex = index"
          role="option"
          :aria-selected="index === selectedIndex"
          tabindex="0"
        >
          <div class="selector-wrap">
            <span
              v-if="props.circle"
              :class="['circle', getColorClass(item.color)]"
              :style="getColorClass(item.color) ? {} : { backgroundColor: item.color }"
              aria-hidden="true"
            />
            {{ item.text }}
          </div>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
@use './style';
</style>

<script lang="ts">
export default { name: 'StatusSelector' };
</script>
