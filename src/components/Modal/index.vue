<script setup lang="ts">
import { computed, onBeforeUnmount, ref, StyleValue, useSlots, watchEffect } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { modalPosition, modalTransition } from './const';
import type { ModalEmits, ModalProps, ModalTransition } from './types';

const props = withDefaults(defineProps<ModalProps>(), {
  modelValue: false,
  escClose: false,
  position: 'popup',
  screenCover: false,
  width: '320px',
  fullscreen: false,
});

const emit = defineEmits<ModalEmits>();

const slots = useSlots();

const isShow = ref<boolean>(false);
const isVisible = ref<boolean>(false);
const keyEventStyle = ref<string>('');
const modalBg = ref<NodeListOf<HTMLDivElement>>();

const modal = ref<HTMLDivElement>();

const transitionName = computed<ModalTransition>(() => modalTransition[props.position]);
const boxStyle = computed<string[]>(() => {
  const styles = ['modal-box', keyEventStyle.value, props.position];

  if (props.position !== 'popup' && props.screenCover) {
    styles.push('screen-cover');
  }

  if (props.fullscreen) {
    styles.push('fullscreen');
  }

  return styles;
});

const bgStyle = computed<string[]>(() => {
  const styles = ['modal-bg'];

  if (!isShow.value) {
    styles.push('hide');
  }

  return styles;
});

const boxStyleValue = computed<StyleValue>(() => {
  if (props.fullscreen) {
    return {
      width: '100vw',
      maxWidth: '100vw',
      height: '100vh',
      maxHeight: '100vh',
    };
  } else if (props.position === modalPosition.right || props.position === modalPosition.left) {
    return {
      width: props.width,
      maxWidth: props.width,
      height: '100vh',
      maxHeight: '100vh',
    };
  } else {
    return {
      width: props.width,
      maxWidth: props.width,
    };
  }
});

/**
 * 모달 창 닫기
 */
const close = (callback: (() => void) | null = null): void => {
  if (callback instanceof Function) {
    callback();
  }

  // 트랜지션을 위해 isVisible을 먼저 false로 설정
  isVisible.value = false;

  // 창이 제거되기 전이기 때문에 팝업의 수는 기본 1
  if (modalBg.value && modalBg.value.length === 1) {
    document.body.classList.remove('no-scroll');
  }
};

const dispose = (): void => {
  modal.value?.removeEventListener('keydown', keyDownEvent);
  modal.value?.removeEventListener('keyup', keyUpEvent);

  // 트랜지션이 완료된 후 no-scroll 클래스 제거
  document.body.classList.remove('no-scroll');

  emit('update:modelValue', false);
};

/**
 * 모달 박스 트랜지션 완료 후 처리
 */
const handleBoxLeave = (): void => {
  // 트랜지션이 완료된 후 isShow도 false로 설정 (더 긴 지연)
  isShow.value = false;
};

/**
 * 모달 박스 트랜지션 시작 시 처리
 */
const handleBoxEnter = (): void => {
  // 모달 박스 트랜지션이 시작될 때 처리
  console.log('Modal box transition started');
};

/**
 * ESC 키로 닫기 처리
 * @param event
 */
const keyDownEvent = (event: KeyboardEvent): void => {
  if (event.key.toLowerCase() === 'escape') {
    if (props.escClose) {
      close();
    } else {
      keyEventStyle.value = 'big';
    }
  }
};

const keyUpEvent = (event: KeyboardEvent): void => {
  if (event.key.toLowerCase() === 'escape' && !props.escClose) {
    keyEventStyle.value = '';
  }
};

/**
 * 이벤트 주입
 */
const setEvents = (): void => {
  modalBg.value = document.body.querySelectorAll<HTMLDivElement>('.modal-bg:not(.hide)');

  if (modal.value) {
    modal.value.addEventListener('keydown', keyDownEvent);
    modal.value.addEventListener('keyup', keyUpEvent);
    modal.value.focus();
  }
};

if (props.accessBack) {
  onBeforeRouteLeave(() => !isShow.value);
}

watchEffect(() => {
  if (props.modelValue) {
    // modal open - 트랜지션을 위해 순차적으로 설정
    isShow.value = true;
    // 약간의 지연 후 isVisible을 true로 설정하여 트랜지션 시작
    setTimeout(() => {
      isVisible.value = true;
    }, 10);
  } else {
    // modal close - 트랜지션을 위해 isVisible을 먼저 false로 설정
    isVisible.value = false;
    // 트랜지션이 완료된 후 isShow도 false로 설정
    setTimeout(() => {
      isShow.value = false;
    }, 300); // 0.3초로 조정
  }
});

watchEffect(
  () => {
    if (props.modelValue) {
      // modal open
      document.body.classList.add('no-scroll');
    }
  },
  { flush: 'post' },
);

onBeforeUnmount(() => {
  modal.value?.removeEventListener('keydown', keyDownEvent);
  modal.value?.removeEventListener('keyup', keyUpEvent);
});

defineExpose({
  close,
});
</script>

<template>
  <Teleport to="body">
    <Transition appear name="modal-fade" @after-leave="dispose" @before-enter="setEvents">
      <div
        ref="modal"
        tabindex="0"
        role="dialog"
        :aria-modal="true"
        :aria-labelledby="props.title ? 'modal-title' : undefined"
        :aria-describedby="slots.body ? 'modal-body' : undefined"
        :class="bgStyle"
        v-bind="$attrs"
        v-show="isShow"
      >
        <Transition
          appear
          :name="transitionName"
          @after-leave="handleBoxLeave"
          @after-enter="handleBoxEnter"
        >
          <div :style="boxStyleValue" :class="boxStyle" v-show="isVisible">
            <div class="modal-header">
              <div class="title-text" :id="props.title ? 'modal-title' : undefined">
                <span class="text">{{ props.title }}</span>
                <slot name="title"></slot>
              </div>

              <Icon
                icon="mdi:window-close"
                size="22"
                class="close"
                aria-label="모달 닫기"
                @click.prevent="close()"
                v-if="!props.hideClose"
              />
            </div>
            <div class="modal-body" :id="slots.body ? 'modal-body' : undefined">
              <slot name="body" :close="close"></slot>
            </div>
            <div class="modal-action" v-if="slots.action">
              <slot name="action" :close="close"></slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
@use './style';
</style>
<style lang="scss">
.no-scroll {
  overflow: hidden;

  /// @deprecated @/views/editor/index.vue 해당 페이지가 없으므로 삭제 예정.
  .scroll {
    /* @/views/editor/index.vue 에서 'scroll' 핸들링을 하고 있습니다. */
    overflow: hidden !important;
  }
}
</style>
<script lang="ts">
export default { name: 'Modal' };
</script>
