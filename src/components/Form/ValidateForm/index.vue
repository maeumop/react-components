<script setup lang="ts">
import type { ComponentInternalInstance, ComputedRef, VNode } from 'vue';
import { Fragment, computed, h, provide, ref, useSlots } from 'vue';
import { VALIDATE_FORM_KEY, validateExplorKey } from './const';
import type { ValidatableComponent, ValidateExplorKey, ValidateFormInjection } from './types';

const slots = useSlots();
const frm = ref<HTMLFormElement>();
const isCover = ref<boolean>(false);
const formValidItems: VNode[] = [];
const RenderSlotItems: ComputedRef = computed(() =>
  h(Fragment, slots.default ? slots.default() : []),
);

/**
 * addComponent 함수를 통해 컴포넌트 인스턴스 추가 된 컴포넌트 유효성 검사
 *
 * @param silence 에러 메세지 무시 여부
 */
const validate = (silence: boolean = false): boolean => {
  let isValid = true;
  let moveNode: Node | null = null;

  // 역순 순회로 안전하게 제거
  for (const node of formValidItems) {
    const instance = node.component as ComponentInternalInstance & {
      exposed?: ValidatableComponent;
    };

    const { check } = instance.exposed;
    if (typeof check === 'function') {
      const result = check(silence);

      if (!result && instance.vnode.el && moveNode === null) {
        moveNode = instance.vnode.el as Node;
        isValid = false;
      }
    }
  }

  if (!isValid) {
    targetFirstEl(moveNode);
  }

  return isValid;
};

// 첫 번째 에러 요소로 스크롤
const targetFirstEl = (node: Node | null): void => {
  if (frm.value && node !== null) {
    (node as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

/**
 * 폼에 등록된 모든 컴포넌트 값을 리셋 및 유효성 검사 초기화
 */
const resetForm = (): void => {
  if (frm.value) {
    explore(validateExplorKey.resetForm);
  }
};

/**
 * 폼에 등록된 모든 컴포넌트 유효성 검사 초기화
 */
const resetValidate = (): void => {
  if (frm.value) {
    explore(validateExplorKey.resetValidate);
  }
};

/**
 * 컴포넌트 인스턴스에서 제공하는 함수 호출
 *
 * @param instance 컴포넌트 인스턴스
 * @param flag 플래그
 */
const validateCheck = (instance: ComponentInternalInstance, flag: ValidateExplorKey): void => {
  const { resetForm, resetValidate } = (instance.exposed as ValidatableComponent) ?? {};

  switch (flag) {
    case validateExplorKey.resetForm:
      if (typeof resetForm === 'function') {
        resetForm();

        if (typeof resetValidate === 'function') {
          resetValidate();
        }
      }

      break;
    case validateExplorKey.resetValidate:
      if (typeof resetValidate === 'function') {
        resetValidate();
      }
  }
};

const explore = (flag: ValidateExplorKey): void => {
  for (let i = formValidItems.length - 1; i >= 0; i--) {
    const node = formValidItems[i];
    const instance = node.component;

    if (!instance || instance.isUnmounted) {
      formValidItems.splice(i, 1);
      continue;
    }

    validateCheck(instance, flag);
  }
};

/**
 * 컴포넌트 인스턴스 추가 (inject 용)
 *
 * @param node 컴포넌트 인스턴스
 */
const addComponent = (node: VNode): void => {
  if (frm.value && node.component?.isMounted) {
    formValidItems.push(node);
  }
};

/**
 * 폼 보호 여부
 *
 * @param protect 폼 보호 여부
 */
const formProtection = (protect: boolean = true): void => {
  isCover.value = protect;
};

// addComponent 함수를 provide로 제공 (validate 가능한 컴포넌트에 inject 받아 사용)
provide<ValidateFormInjection>(VALIDATE_FORM_KEY, {
  addComponent,
});

defineExpose({
  formProtection,
  resetValidate,
  resetForm,
  validate,
});
</script>

<template>
  <form ref="frm" :class="isCover ? 'validate-form' : ''" @submit.prevent>
    <RenderSlotItems />

    <div class="form-cover" v-if="isCover"></div>
  </form>
</template>

<style scoped lang="scss">
.validate-form {
  position: relative;

  .form-cover {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    background-color: rgba(#fff, 0.3);
  }
}
</style>

<script lang="ts">
export default { name: 'ValidateForm' };
</script>
