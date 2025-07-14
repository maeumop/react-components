<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { onUnmounted, ref, watch } from 'vue';
import { toastColor, toastIcon } from './const';
import type { ToastColor, ToastIcon, ToastListType, ToastOptions } from './types';

const props = withDefaults(defineProps<ToastOptions>(), {
  delay: 3000,
  maxShowMessage: 4,
});

const color = ref<ToastColor>(toastColor.success);
const icon = ref<ToastIcon>(toastIcon.success);
const message = ref<string>('');

const toastItems = ref<ToastListType[]>([]);
const timeoutMap = ref<Map<number, number>>(new Map());
const animatingKeys = ref<Set<number>>(new Set());
let key = 0;

/**
 * Toast message 를 보여주고, 해당 내용을 delay 시간 만큼 유지 시킨후 제거 한다.
 */
const show = (): void => {
  const currentKey = key;

  toastItems.value.push({
    key: currentKey,
    color: color.value,
    icon: icon.value,
    message: message.value,
  });

  // 표시 시간이 지나면 자동으로 메시지 삭제
  const timeoutId = setTimeout((): void => {
    hideByKey(currentKey);
  }, props.delay);

  timeoutMap.value.set(currentKey, timeoutId);
  key++;

  // 최대 개수 제한
  if (toastItems.value.length > props.maxShowMessage) {
    const firstItem = toastItems.value[0];
    if (firstItem) {
      hideByKey(firstItem.key);
    }
  }
};

/**
 * Toast message 제거 (인덱스 기반)
 * @param index 사용자가 클릭한 message index
 */
const hide = (index: number = 0): void => {
  if (index >= 0 && index < toastItems.value.length) {
    const item = toastItems.value[index];
    hideByKey(item.key);
  }
};

/**
 * Toast message 제거 (키 기반)
 * @param messageKey 메시지의 고유 키
 */
const hideByKey = (messageKey: number): void => {
  // 이미 애니메이션 중인 경우 무시
  if (animatingKeys.value.has(messageKey)) {
    return;
  }

  // 애니메이션 시작
  animatingKeys.value.add(messageKey);

  // timeout 정리
  const timeoutId = timeoutMap.value.get(messageKey);
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutMap.value.delete(messageKey);
  }

  // 애니메이션 완료 후 리스트에서 제거
  setTimeout((): void => {
    const index = toastItems.value.findIndex(item => item.key === messageKey);
    if (index !== -1) {
      toastItems.value.splice(index, 1);
    }
    animatingKeys.value.delete(messageKey);
  }, 300); // CSS 애니메이션 시간과 동일
};

/**
 * 변수 초기화
 */
const clear = (): void => {
  // 모든 timeout 정리
  timeoutMap.value.forEach(timeoutId => {
    clearTimeout(timeoutId);
  });
  timeoutMap.value.clear();

  key = 0;
  message.value = '';
  toastItems.value = [];
  animatingKeys.value.clear();
};

/**
 * 메시지 설정 메서드
 */
const setMessage = (msg: string, msgColor?: ToastColor, msgIcon?: ToastIcon): void => {
  message.value = msg;
  if (msgColor) {
    color.value = msgColor;
  }
  if (msgIcon) {
    icon.value = msgIcon;
  }
};

watch(toastItems.value, items => {
  if (!items.length) {
    clear();
  }
});

onUnmounted(() => {
  clear();
  props.destroy();
});

defineExpose({
  show,
  setMessage,
  hide,
  clear,
});
</script>

<template>
  <div class="toast-bg" role="region" aria-label="알림 메시지">
    <TransitionGroup name="toast-view">
      <div
        :key="`toast-${item.key}`"
        :class="[
          'toast-body',
          item.color ? `bg-${item.color}` : '',
          animatingKeys.has(item.key) ? 'toast-leaving' : '',
        ]"
        @click="hide(i)"
        @keydown.enter="hide(i)"
        @keydown.space="hide(i)"
        :tabindex="0"
        role="alert"
        :aria-live="item.color === 'error' ? 'assertive' : 'polite'"
        :aria-label="`${item.color} 알림: ${item.message}`"
        v-for="(item, i) in toastItems"
      >
        <Icon :icon="item.icon" class="icon" v-if="item.icon" aria-hidden="true" />
        <span class="message" v-html="item.message"></span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">
@use './style';
</style>
