<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { computed, onUnmounted, ref, shallowRef } from 'vue';
import { messageBoxTransition } from './const';
import type { MessageBoxExpose, MessageBoxOptions } from './types';

const props = withDefaults(defineProps<MessageBoxOptions>(), {
  width: '320px',
  btnOkayText: '확인',
  btnCancelText: '취소',
  escCancel: true,
  enterOkay: true,
  noScrollStyleClass: 'hide-scroll',
  transition: messageBoxTransition.scale,
});

const isShow = ref<boolean>(true);
const msgBoxBg = shallowRef<HTMLDivElement>();
const spinnerShow = ref<boolean>(false);

// 접근성을 위한 computed 속성
const dialogId = computed(() => `messagebox-${Date.now()}`);
const titleId = computed(() => `${dialogId.value}-title`);
const contentId = computed(() => `${dialogId.value}-content`);

// 트랜지션 이름 computed
const transitionName = computed(() => props.transition || messageBoxTransition.scale);

// 스크롤바 너비 계산 함수
const getScrollbarWidth = (): number => {
  // 더 정확한 스크롤바 너비 계산
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  document.body.appendChild(outer);

  const inner = document.createElement('div');
  outer.appendChild(inner);

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  outer.parentNode?.removeChild(outer);

  return scrollbarWidth;
};

// 스크롤바 공간 설정 함수
const setScrollbarSpace = (): void => {
  const scrollbarWidth = getScrollbarWidth();
  if (scrollbarWidth > 0) {
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
  }
};

// 스크롤바 공간 제거 함수
const removeScrollbarSpace = (): void => {
  document.documentElement.style.removeProperty('--scrollbar-width');
};

// 스크롤바 제거 함수
const disableScroll = (): void => {
  if (props.noScrollStyleClass) {
    // 스크롤바 공간 설정
    setScrollbarSpace();
    // 스크롤 제거 (클래스와 인라인 스타일 모두 적용)
    document.body.classList.add(props.noScrollStyleClass);
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `var(--scrollbar-width, 0px)`;
    console.log('스크롤바 제거됨'); // 디버깅용
  }
};

// 스크롤바 복원 함수
const enableScroll = (): void => {
  if (props.noScrollStyleClass) {
    document.body.classList.remove(props.noScrollStyleClass);
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    removeScrollbarSpace();
    console.log('스크롤바 복원됨'); // 디버깅용
  }
};

const keyupEvent = (evt: KeyboardEvent): void => {
  // Enter 키를 눌렀을 때 okay 실행
  if (evt.key === 'Enter' && props.enterOkay) {
    if (typeof props.asyncOkay === 'function') {
      asyncClickOkay();
    } else {
      clickOkay();
    }
  }

  // ESC 키를 눌렀을때 창을 닫아 줌(cancel과 동일)
  if (evt.key === 'Escape' && props.escCancel) {
    clickCancel();
  }
};

const hide = (): void => {
  const boxes: NodeList = document.body.querySelectorAll('.msg-box-bg');
  console.log('현재 MessageBox 개수:', boxes.length); // 디버깅용

  if (boxes.length === 1 && props.noScrollStyleClass) {
    // 마지막 MessageBox가 닫힐 때만 스크롤바 복원
    enableScroll();
  }

  isShow.value = false;
};

/**
 * 이벤트 주입
 */
const setEvents = (): void => {
  // 스크롤바 제거
  disableScroll();

  // 키보드 이벤트 추가
  document.addEventListener('keyup', keyupEvent);
  msgBoxBg.value?.focus();
};

const close = async (): Promise<void> => {
  if (props.destroy instanceof Function) {
    document.removeEventListener('keyup', keyupEvent);
    await props.destroy();
  }
};

const clickOkay = (): void => {
  if (spinnerShow.value) {
    return;
  }

  if (props.okay instanceof Function) {
    props.okay();
  }

  hide();
};

const asyncClickOkay = async (): Promise<void> => {
  if (spinnerShow.value) {
    return;
  }

  spinnerShow.value = true;

  try {
    if (props.asyncOkay instanceof Function) {
      await props.asyncOkay();
    }
  } catch (error) {
    console.error('MessageBox asyncOkay error:', error);
  } finally {
    hide();
  }
};

const clickCancel = (): void => {
  if (!spinnerShow.value) {
    if (props.cancel instanceof Function) {
      props.cancel();
    }

    hide();
  }
};

onUnmounted(() => {
  // 언제나 정상 종료가 되는 것은 아니기에
  // 컴포넌트 unmount 시에도 이벤트 정리 해주세요!
  document.removeEventListener('keyup', keyupEvent);
});

defineExpose<MessageBoxExpose>({
  hide,
});
</script>

<template>
  <Transition name="msg-box-fade">
    <div
      ref="msgBoxBg"
      class="msg-box-bg"
      tabindex="0"
      v-show="isShow"
      role="dialog"
      :aria-labelledby="titleId"
      :aria-describedby="contentId"
      :aria-modal="true"
    >
      <Transition appear :name="transitionName" @before-enter="setEvents" @after-leave="close">
        <div class="msg-box" :style="{ width: props.width }" v-show="isShow" :id="dialogId">
          <h5 class="title" :id="titleId" v-if="props.title">
            {{ props.title }}
          </h5>
          <div class="contents" :id="contentId" v-html="props.message"></div>
          <div class="actions">
            <button
              type="button"
              class="btn-okay"
              @click="typeof props.asyncOkay === 'function' ? asyncClickOkay() : clickOkay()"
              :disabled="spinnerShow"
            >
              <template v-if="spinnerShow">
                <Icon icon="svg-spinners:ring-resize" class="loading" />
              </template>
              <template v-else>
                {{ props.btnOkayText }}
              </template>
            </button>
            <button
              type="button"
              class="btn-cancel"
              @click="clickCancel"
              v-if="props.type === 'confirm'"
              :disabled="spinnerShow"
            >
              {{ props.btnCancelText }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
@use './style';
</style>

<script lang="ts">
export default { name: 'MessageBox' };
</script>
