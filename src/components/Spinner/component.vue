<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { spinnerColor } from './const';
import type { SpinnerColor, SpinnerExpose, SpinnerProps } from './types';

const props = withDefaults(defineProps<SpinnerProps>(), {
  limitTime: 10,
  color: spinnerColor.default,
});

// 반응형 상태 관리
const timeout = ref<number>(0);
const delay = ref<number>(0.5);
const progress = ref<number>(0);
const isShow = ref<boolean>(false);
const message = ref<string>('Loading...');
const currentColor = ref<SpinnerColor>(props.color);

// 컴포넌트 정리
const destroy = (): void => {
  props.destroy();
};

// 지연 함수
const waiting = (): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, delay.value * 1000);
  });
};

// 진행 상태 관리
const setProgress = async (flag: 'increment' | 'decrement'): Promise<void> => {
  if (flag === 'increment') {
    progress.value++;
  } else {
    progress.value--;
  }

  await waiting();

  if (progress.value > 0) {
    isShow.value = true;

    // 기존 타임아웃 정리
    clearTimeout(timeout.value);

    // 새로운 타임아웃 설정
    timeout.value = setTimeout(() => {
      progress.value = 0;
      isShow.value = false;
    }, props.limitTime * 1000);
  } else {
    progress.value = 0;
    isShow.value = false;
  }
};

// 스피너 표시
const show = (msg: string = ''): void => {
  if (msg) {
    message.value = msg;
  }

  setProgress('increment');
};

// 스피너 숨김
const hide = (): void => {
  setProgress('decrement');
};

// 스피너 즉시 닫기
const close = (): void => {
  clearTimeout(timeout.value);
  progress.value = 0;
  isShow.value = false;
};

// 테마 설정
const setColor = (color: SpinnerColor): void => {
  currentColor.value = color;
};

const themeClass = computed(() => {
  return currentColor.value;
});

// props 변경 감지
watch(
  () => props.color,
  newColor => {
    if (newColor) {
      setColor(newColor);
    }
  },
);

// 컴포넌트 언마운트 시 정리
onBeforeUnmount(() => {
  clearTimeout(timeout.value);
});

// 외부 노출 메서드
defineExpose<SpinnerExpose>({
  show,
  hide,
  close,
  delay,
  setColor,
});
</script>

<template>
  <Teleport to="body">
    <Transition appear name="fade" @after-leave="destroy">
      <div class="spinner-overlay" v-show="isShow">
        <Transition appear name="scale">
          <div class="spinner-container" :class="themeClass" v-show="isShow">
            <Icon icon="svg-spinners:ring-resize" class="spinner-icon" width="100" height="100" />
            <p class="spinner-text">{{ message }}</p>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@use './style';
</style>
