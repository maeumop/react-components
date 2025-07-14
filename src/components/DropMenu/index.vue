<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { computed, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import { dropMenuColor, dropMenuPosition, dropMenuTransition } from './const';
import type { DropMenuEmits, DropMenuItem, DropMenuProps } from './types';

const props = withDefaults(defineProps<DropMenuProps>(), {
  position: dropMenuPosition.bottom,
  transition: dropMenuTransition.slide,
  color: dropMenuColor.primary,
  disabled: false,
  disableAutoClose: false,
});

const emit = defineEmits<DropMenuEmits>();

// 반응형 상태
const isOpen = ref<boolean>(false);
const dropMenuRef = ref<HTMLDivElement>();
const menuRef = ref<HTMLUListElement>();

// 계산된 속성
const transitionName = computed<string>(() => `${props.transition}-${props.position}`);

const layerPositionStyle = reactive<CSSProperties>({
  top: '',
  bottom: '',
  left: '',
  right: '',
  width: '',
  minWidth: '',
});

// 메뉴 토글 함수
const toggle = async (): Promise<void> => {
  if (props.disabled) {
    return;
  }

  if (!isOpen.value) {
    await openMenu();
  } else {
    closeMenu();
  }
};

// 메뉴 열기
const openMenu = async (): Promise<void> => {
  if (!dropMenuRef.value) {
    return;
  }

  const windowHeight: number = window.innerHeight;
  const windowWidth: number = window.innerWidth;
  const rect: DOMRect = dropMenuRef.value.getBoundingClientRect();

  // 위치 초기화
  layerPositionStyle.top = '';
  layerPositionStyle.bottom = '';
  layerPositionStyle.left = '';
  layerPositionStyle.right = '';

  // 위치 계산
  switch (props.position) {
    case dropMenuPosition.top: {
      layerPositionStyle.left = `${rect.left}px`;
      layerPositionStyle.bottom = `${windowHeight - rect.top}px`;
      break;
    }
    case dropMenuPosition.right: {
      layerPositionStyle.left = `${rect.right}px`;
      layerPositionStyle.top = `${rect.top}px`;
      break;
    }
    case dropMenuPosition.left: {
      layerPositionStyle.right = `${windowWidth - rect.left}px`;
      layerPositionStyle.top = `${rect.top}px`;
      break;
    }
    default: {
      layerPositionStyle.left = `${rect.left}px`;
      layerPositionStyle.top = `${rect.top + rect.height}px`;
      break;
    }
  }

  // 너비 설정
  if (props.width) {
    layerPositionStyle.width = `${props.width}px`;
  } else {
    layerPositionStyle.minWidth = `${rect.width}px`;
  }

  isOpen.value = true;
  emit('open');

  // 포커스 관리
  await nextTick();

  if (menuRef.value) {
    const firstFocusableElement = menuRef.value.querySelector('a, button') as HTMLElement;
    if (firstFocusableElement) {
      firstFocusableElement.focus();
    }
  }
};

// 메뉴 닫기
const closeMenu = (): void => {
  isOpen.value = false;
  emit('close');
};

// 외부 클릭 감지
const handleOutsideClick = (event: Event): void => {
  if (props.disableAutoClose) {
    return;
  }

  const target = event.target as Element;

  if (dropMenuRef.value && !dropMenuRef.value.contains(target)) {
    closeMenu();
  }
};

// 키보드 이벤트 처리
const handleKeydown = (event: KeyboardEvent): void => {
  if (!isOpen.value) {
    return;
  }

  switch (event.key) {
    case 'Escape': {
      closeMenu();
      break;
    }
    case 'ArrowDown': {
      event.preventDefault();
      focusNextItem();
      break;
    }
    case 'ArrowUp': {
      event.preventDefault();
      focusPreviousItem();
      break;
    }
  }
};

// 다음 아이템 포커스
const focusNextItem = (): void => {
  if (!menuRef.value) {
    return;
  }

  const focusableElements = menuRef.value.querySelectorAll('a, button:not([disabled])');
  const currentIndex = Array.from(focusableElements).findIndex(el => el === document.activeElement);
  const nextIndex = (currentIndex + 1) % focusableElements.length;

  (focusableElements[nextIndex] as HTMLElement)?.focus();
};

// 이전 아이템 포커스
const focusPreviousItem = (): void => {
  if (!menuRef.value) {
    return;
  }

  const focusableElements = menuRef.value.querySelectorAll('a, button:not([disabled])');
  const currentIndex = Array.from(focusableElements).findIndex(el => el === document.activeElement);
  const prevIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;

  (focusableElements[prevIndex] as HTMLElement)?.focus();
};

// 메뉴 아이템 클릭 처리
const handleItemClick = (item: DropMenuItem, index: number, event: Event): void => {
  event.preventDefault();

  if (item.disabled) {
    return;
  }

  try {
    item.action();
    emit('itemClick', item, index);
  } catch (error) {
    console.error('DropMenu item action error:', error);
  }

  if (!props.disableAutoClose) {
    closeMenu();
  }
};

// 스크롤 이벤트 처리
const handleScroll = (): void => {
  if (isOpen.value && !props.disableAutoClose) {
    closeMenu();
  }
};

// 라이프사이클 훅
onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
  document.addEventListener('keydown', handleKeydown);
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
  document.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div
    ref="dropMenuRef"
    :class="['drop-menu', props.color, { disabled: props.disabled }]"
    @click="toggle"
    @keydown.enter="toggle"
    @keydown.space.prevent="toggle"
    role="button"
    :aria-expanded="isOpen"
    :aria-haspopup="true"
    :aria-disabled="props.disabled"
    tabindex="0"
  >
    <slot :toggle="isOpen"></slot>

    <Transition :name="transitionName">
      <ul
        v-show="isOpen"
        ref="menuRef"
        :style="layerPositionStyle"
        :class="['drop-menu-wrap', props.position]"
        role="menu"
        :aria-label="`드롭다운 메뉴`"
      >
        <li v-for="(item, index) in props.items" :key="`menu-item-${index}`" role="none">
          <a
            href="#"
            :class="{ disabled: item.disabled }"
            @click="handleItemClick(item, index, $event)"
            @keydown.enter="handleItemClick(item, index, $event)"
            @keydown.space.prevent="handleItemClick(item, index, $event)"
            role="menuitem"
            :aria-disabled="item.disabled"
            tabindex="-1"
          >
            <span>{{ item.text }}</span>
            <Icon v-if="item.icon" :icon="item.icon" width="20" height="20" />
          </a>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
@use './style';
</style>

<script lang="ts">
export default { name: 'DropMenu' };
</script>
