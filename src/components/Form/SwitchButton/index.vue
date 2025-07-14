<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { getCurrentInstance, inject, nextTick, onMounted, ref, watch } from 'vue';
import { VALIDATE_FORM_KEY } from '../ValidateForm/const';
import { ValidateFormInjection } from '../ValidateForm/types';
import { switchButtonColor } from './const';
import type { SwitchButtonEmits, SwitchButtonProps } from './types';

const props = withDefaults(defineProps<SwitchButtonProps>(), {
  label: (): string[] => ['미설정', '설정'],
  validate: undefined,
  trueValue: true,
  falseValue: false,
  color: switchButtonColor.primary,
});

const emit = defineEmits<SwitchButtonEmits>();

const onError = ref<boolean>(false);
const errorTransition = ref<boolean>(false);
const message = ref<string>('');
const isValidate = ref<boolean>(true);

// 고유 id 생성 (접근성)
const inputId = `switch-btn-${Math.random().toString(36).slice(2, 10)}`;

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    // 유효성 검사가 있을 때만 리셋하고, 값이 실제로 변경된 경우에만 처리
    if (props.validate && newVal !== oldVal) {
      resetValidate();
    }
  },
);

watch(errorTransition, v => {
  if (v) {
    setTimeout(() => {
      errorTransition.value = false;
    }, 300);
  }
});

/**
 * 유효성 검사
 */
const check = (silence: boolean = false): boolean => {
  if (props.validate !== undefined) {
    let valid = true;
    if (typeof props.validate === 'function') {
      const result = (props.validate as (value: unknown) => boolean | string)(props.modelValue);
      if (typeof result === 'string') {
        valid = false;
        if (!silence) {
          message.value = result;
          onError.value = true;
          isValidate.value = false;
          errorTransition.value = true;
        }
      } else if (result === false) {
        valid = false;
        if (!silence) {
          message.value = `${props.label[1]}을(를) 선택해주세요.`;
          onError.value = true;
          isValidate.value = false;
          errorTransition.value = true;
        }
      }
    } else if (props.modelValue !== props.trueValue) {
      valid = false;
      if (!silence) {
        message.value =
          typeof props.validate === 'string'
            ? props.validate
            : `${props.label[1]}을(를) 선택해주세요.`;
        onError.value = true;
        isValidate.value = false;
        errorTransition.value = true;
      }
    }
    if (valid) {
      // 검증 성공 시 에러 상태 초기화
      message.value = '';
      onError.value = false;
      isValidate.value = true;
      errorTransition.value = false;
      return true;
    }
    return false;
  }
  return true;
};

/**
 * 폼 리셋 (초기화)
 */
const resetForm = (): void => {
  emit('update:modelValue', props.falseValue);
  resetValidate();
};

/**
 * 유효성 메시지 리셋
 */
const resetValidate = (): void => {
  message.value = '';
  onError.value = false;
  isValidate.value = true;
  // errorTransition은 CSS 애니메이션이 완료된 후 자동으로 처리됨
};

/**
 * 값 변경 핸들러
 */
const updateValue = (evt: Event): void => {
  const e = evt.target as HTMLInputElement;
  if (props.readonly) {
    // 상태가 변경 되지 않도록 처리
    e.checked = !e.checked;
    return;
  }

  emit('update:modelValue', e.checked ? props.trueValue : props.falseValue);

  nextTick(() => {
    emit('update:after');
  });
};

const instance = getCurrentInstance();
const validateForm = inject<ValidateFormInjection | null>(VALIDATE_FORM_KEY, null);

onMounted(() => {
  if (validateForm !== null && instance) {
    validateForm.addComponent(instance.vnode);
  }
});

defineExpose({
  resetValidate,
  check,
  resetForm,
});
</script>

<template>
  <div :class="['switch-wrap', props.color]">
    <label :for="inputId" :class="['switch', { checkbox: props.checkbox }]">
      <input
        :id="inputId"
        type="checkbox"
        :disabled="props.disabled || props.readonly"
        :checked="props.modelValue == props.trueValue"
        @change="updateValue"
        :aria-checked="props.modelValue == props.trueValue ? 'true' : 'false'"
        role="switch"
      />

      <template v-if="props.checkbox">
        <Transition name="check-scale" mode="out-in">
          <Icon icon="mdi:checkbox-marked" v-if="props.modelValue == props.trueValue" />
          <Icon
            :icon="props.disabled ? 'mdi:checkbox-blank' : 'mdi:checkbox-blank-outline'"
            v-else
          />
        </Transition>
      </template>
      <template v-else>
        <span><i></i></span>
      </template>

      <Transition name="label-fade" mode="out-in">
        <div class="label-text" v-if="props.modelValue === props.trueValue" aria-live="polite">
          {{ props.label[1] }}
        </div>
        <div class="label-text" v-else aria-live="polite">{{ props.label[0] }}</div>
      </Transition>
    </label>

    <div :class="['description', { error: errorTransition }]" v-show="message">
      {{ message }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use './style.scss';
</style>

<script lang="ts">
export default { name: 'SwitchButton' };
</script>
