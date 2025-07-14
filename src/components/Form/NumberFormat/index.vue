<script setup lang="ts">
import type { StyleValue } from 'vue';
import { computed, getCurrentInstance, inject, onMounted, ref, useAttrs, watch } from 'vue';
import type { RuleFunc } from '../../types';
import { VALIDATE_FORM_KEY } from '../ValidateForm/const';
import { ValidateFormInjection } from '../ValidateForm/types';
import type { NumberFormatEmits, NumberFormatProps } from './types';

const props = withDefaults(defineProps<NumberFormatProps>(), {
  label: '',
  placeholder: '',
  validate: (): RuleFunc[] => [],
  errorMessage: '',
  disabled: false,
  block: false,
  autofocus: false,
  maxLength: undefined,
  readonly: false,
  required: false,
  hideMessage: false,
});

const emit = defineEmits<NumberFormatEmits>();

const attrs = useAttrs();

// 이벤트 속성들을 computed로 처리하여 성능 최적화
const eventComputing = computed(() => {
  const events: Record<string, unknown> = {};

  Object.keys(attrs).forEach(key => {
    if (key.startsWith('on')) {
      events[key] = attrs[key];
    }
  });

  return events;
});

const isValidate = ref<boolean>(true);
const checkPass = ref<boolean>(false);
const message = ref<string>('');
const errorTransition = ref<boolean>(false);

const Input = ref<HTMLInputElement>();

watch(
  () => props.errorMessage,
  v => {
    // 임의로 지정된 에러가 있는 경우 에러 아이콘 표기
    if (v !== '') {
      message.value = v;
      isValidate.value = false;
      errorTransition.value = true;
    } else {
      resetValidate();
    }
  },
);

// modelValue 변경 시 중복 실행 방지를 위해 flush: 'post' 옵션 추가
watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (!props.disabled && newVal && newVal !== oldVal) {
      // 외부에서 model이 업데이트 되도 유효성 검사
      resetValidate();

      if (Input.value) {
        Input.value.value = format(newVal);
      }
    }
  },
  { flush: 'post' },
);

watch(
  () => props.disabled,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
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

const wrapperStyle = computed<StyleValue>(() => [
  'input-wrap',
  {
    'with-label': props.label,
    block: props.block,
  },
]);

/**
 * 입력 폼이 focus, blur 됐을때 해당 값을 체크 하여 값을 비우거나 0으로 채워 준다.
 *
 * @param { Event } evt
 */
const zeroCheck = (evt: Event): void => {
  if (evt.type === 'focus' && Input.value?.value === '0') {
    Input.value.value = '';
    emit('update:modelValue', 0);
  } else if (evt.type === 'blur' && Input.value?.value.length === 0) {
    Input.value.value = '0';
    emit('update:modelValue', 0);
  }

  if (!attrs.onBlur && !attrs.onFocusout) {
    check();
  }
};

/**
 * 전달된 값을 천단위로 콤마(,)를 생성하여 반환
 * 숫자 검증 강화
 *
 * @param v
 * @return format number string
 */
const format = (v: number | string): string => {
  if (v === '-' || v === '') {
    return v;
  }

  const num = Number(v);
  if (isNaN(num)) {
    return '0';
  }

  return new Intl.NumberFormat().format(num);
};

const updateValue = (evt: Event): void => {
  if (props.disabled) {
    return;
  }

  const e = evt.target as HTMLInputElement;

  let value: string = e.value
    .replace(/[^\d\-]/g, '')
    .replace(/\-{2,}/g, '-')
    .replace(/^$/, '');

  value =
    value.charAt(0) === '-' ? '-'.concat(value.replace(/[-]/g, '')) : value.replace(/[-]/g, '');

  if (value) {
    e.value = format(value);
    const numValue = Number(value);
    emit('update:modelValue', isNaN(numValue) ? 0 : numValue);
  }
};

const check = (silence: boolean = false): boolean => {
  if (props.disabled) {
    return true;
  }

  // 임의로 지정된 에러가 없는 경우
  if (!props.errorMessage) {
    // validate check
    if (props.validate.length) {
      for (const validateFunc of props.validate) {
        console.log('props.modelValue', props.modelValue);
        const result: string | boolean = validateFunc(props.modelValue);

        if (typeof result === 'string') {
          if (!silence) {
            message.value = result;
            isValidate.value = false;
            checkPass.value = false;
            errorTransition.value = true;
          }

          return false;
        } else {
          message.value = '';
        }
      }
    }

    isValidate.value = true;
    checkPass.value = true;

    return true;
  }

  errorTransition.value = true;

  return false;
};

const resetForm = (): void => {
  if (Input.value) {
    Input.value.value = '0';
  }

  emit('update:modelValue', 0);
};

const resetValidate = (): void => {
  message.value = '';
  isValidate.value = true;
  errorTransition.value = false;
};

const validateForm = inject<ValidateFormInjection | null>(VALIDATE_FORM_KEY, null);
const instance = getCurrentInstance();

onMounted(() => {
  if (validateForm !== null && instance) {
    validateForm.addComponent(instance.vnode);
  }

  if (Input.value) {
    if (props.autofocus) {
      Input.value.focus();
    }

    if (props.modelValue) {
      Input.value.value = format(props.modelValue);
    }
  }
});

defineExpose({
  check,
  resetForm,
  resetValidate,
});
</script>

<template>
  <div :class="wrapperStyle" :style="{ width: props.width }">
    <div class="options-wrap" v-if="props.label">
      <label class="input-label" v-if="props.label">
        {{ props.label }}
        <span class="required" v-if="props.required">*</span>
      </label>
    </div>

    <input
      ref="Input"
      type="text"
      :class="{ error: message }"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :readonly="props.readonly"
      :maxlength="props.maxLength"
      v-bind="eventComputing"
      @focus="zeroCheck"
      @blur="zeroCheck"
      @input="updateValue"
    />

    <div :class="['feedback', { error: errorTransition }]" v-show="message && !props.hideMessage">
      {{ message }}
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './style';
</style>

<script lang="ts">
export default { name: 'NumberFormat' };
</script>
