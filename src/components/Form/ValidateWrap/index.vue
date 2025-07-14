<script setup lang="ts">
import { getCurrentInstance, inject, onMounted, ref, useSlots, watch } from 'vue';
import type { RuleFunc } from '../../types';
import { VALIDATE_FORM_KEY } from '../ValidateForm/const';
import { ValidateFormInjection } from '../ValidateForm/types';
import type { ValidateWrapProps } from './types';

const props = withDefaults(defineProps<ValidateWrapProps>(), {
  validate: (): RuleFunc[] => [],
  errorMessage: '',
});

const isValidate = ref<boolean>(true);
const message = ref<string>('');
const errorTransition = ref<boolean>(false);
const slots = useSlots();

watch(
  () => props.checkValue,
  () => {
    resetForm();
  },
);

watch(
  () => props.errorMessage,
  v => {
    message.value = v;
  },
);

watch(errorTransition, v => {
  if (v) {
    setTimeout(() => {
      errorTransition.value = false;
    }, 300);
  }
});

const check = (silence: boolean = false): boolean => {
  if (props.disabled) {
    return true;
  }

  // errorMessage가 설정되어 있으면 해당 메시지 사용
  if (props.errorMessage) {
    if (!silence) {
      message.value = props.errorMessage;
      errorTransition.value = true;
      isValidate.value = false;
    }
    return false;
  }

  // validate 함수들 실행
  if (props.validate.length) {
    for (const validateFunc of props.validate) {
      const result = validateFunc(props.checkValue);

      if (typeof result === 'string') {
        if (!silence) {
          message.value = result;
          errorTransition.value = true;
          isValidate.value = false;
        }

        return false;
      }
    }
  }

  // 모든 검증 통과
  message.value = '';
  errorTransition.value = false;
  isValidate.value = true;
  return true;
};

const resetForm = (): void => {
  isValidate.value = true;
  message.value = '';
  errorTransition.value = false;
};

const resetValidate = (): void => {
  resetForm();
};

const childBlur = (): void => {
  check();
};

const validateForm = inject<ValidateFormInjection | null>(VALIDATE_FORM_KEY, null);
const instance = getCurrentInstance();

onMounted(() => {
  // validateForm이 제공되지 않은 경우에도 컴포넌트가 정상 작동하도록 처리
  if (validateForm !== null && instance) {
    validateForm.addComponent(instance.vnode);
  }
});

defineExpose({
  check,
  resetForm,
  resetValidate,
});
</script>

<template>
  <div class="validate-wrap">
    <div class="options-wrap" v-if="props.label">
      <label class="input-label" v-if="props.label">
        {{ props.label }}
        <span class="required" v-if="props.required">*</span>
      </label>
      <div class="add-option" v-if="slots['add-on']">
        <slot name="add-on"></slot>
      </div>
    </div>

    <div :class="['input-wrap', { error: errorTransition }]">
      <slot :on-blur="childBlur"></slot>
    </div>

    <div :class="['feedback', { error: errorTransition }]">
      {{ message }}
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './style';
</style>
<script lang="ts">
export default { name: 'ValidateWrap' };
</script>
