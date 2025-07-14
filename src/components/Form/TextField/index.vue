<script setup lang="ts">
import { Icon } from '@iconify/vue';
import type { StyleValue } from 'vue';
import { computed, getCurrentInstance, inject, onMounted, ref, watch } from 'vue';
import type { RuleFunc } from '../../types';
import { VALIDATE_FORM_KEY } from '../ValidateForm/const';
import { ValidateFormInjection } from '../ValidateForm/types';
import { textFieldType } from './const';
import type { TextFieldEmits, TextFieldProps } from './types';

const props = withDefaults(defineProps<TextFieldProps>(), {
  rows: 5,
  type: textFieldType.text,
  validate: (): RuleFunc[] => [],
  blurValidate: true,
  errorMessage: '',
  maxLength: 0,
});

const emit = defineEmits<TextFieldEmits>();

const isValidate = ref<boolean>(true);
const message = ref<string>('');
const errorTransition = ref<boolean>(false);
const Textarea = ref<HTMLTextAreaElement>();
const Input = ref<HTMLInputElement>();

watch(
  () => props.errorMessage,
  v => {
    if (v) {
      message.value = v;
      isValidate.value = false;
      errorTransition.value = true;
    } else {
      message.value = '';
      isValidate.value = true;
      errorTransition.value = false;
    }
  },
);

watch(
  () => props.validate,
  (newVal, oldVal) => {
    if (newVal && newVal.length !== oldVal.length) {
      resetValidate();
    }
  },
);

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    // 값이 변경되면 유효성 검사를 초기화
    if (!props.disabled && newVal && newVal !== oldVal) {
      resetValidate();
    }
  },
  { flush: 'post' },
);

watch(
  () => props.disabled,
  (newVal, oldVal) => {
    // disabled 상태가 변경되면 유효성 검사를 초기화
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
    block: props.block,
  },
]);

const inputStyleClass = computed<StyleValue>(() => [
  {
    error: message.value,
    'left-space': props.icon && props.iconLeft,
    'right-space': props.icon && !props.iconLeft,
  },
]);

const updateValue = (evt: Event): void => {
  const target = evt.target as HTMLInputElement | HTMLTextAreaElement;

  if (props.isCounting && props.maxLength) {
    if (target.value.length > props.maxLength) {
      const cut = target.value.substring(0, props.maxLength);
      target.value = cut;
    }
  }
  emit('update:modelValue', target.value);
};

const clearValue = (): void => {
  emit('update:modelValue', '');
};

const clearButtonShow = computed<boolean>(
  () => props.clearable && props.modelValue !== '' && !props.disabled && !props.readonly,
);

const updateTrimValue = (evt: Event): void => {
  const target = evt.target as HTMLInputElement | HTMLTextAreaElement;
  const result: string = target.value.trim();

  if (result.length > 0) {
    emit('update:modelValue', result);
  }
};

const check = (silence?: boolean): boolean => {
  if (props.disabled) {
    return true;
  }

  if (props.errorMessage === '') {
    const checkValue: string = (props.multiline ? Textarea.value?.value : Input.value?.value) ?? '';

    // pattern check
    if (Array.isArray(props.pattern)) {
      const [regExp, errMsg] = props.pattern;

      if (regExp && !regExp.test(checkValue)) {
        if (!silence) {
          message.value = errMsg ?? '형식이 일치하지 않습니다.';
          isValidate.value = false;
          errorTransition.value = true;
        }
        return false;
      }
    }

    // validate check
    if (props.validate.length) {
      for (const validateFunc of props.validate) {
        const result: string | boolean = validateFunc(checkValue);

        if (typeof result === 'string') {
          if (!silence) {
            message.value = result;
            isValidate.value = false;
            errorTransition.value = true;
          }

          return false;
        } else {
          message.value = '';
        }
      }
    }

    isValidate.value = true;
    return true;
  }

  errorTransition.value = true;
  return false;
};

const resetForm = (): void => {
  emit('update:modelValue', '');
};

const resetValidate = (): void => {
  console.log('resetValidate', props.modelValue);
  isValidate.value = true;
  if (!props.errorMessage) {
    message.value = '';
    errorTransition.value = false;
  }
};

const validateForm = inject<ValidateFormInjection | null>(VALIDATE_FORM_KEY, null);
const instance = getCurrentInstance();

onMounted(() => {
  if (validateForm !== null && instance) {
    validateForm.addComponent(instance.vnode);
  }

  if (props.autofocus) {
    if (props.multiline) {
      Textarea.value?.focus();
    } else {
      Input.value?.focus();
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
  <div ref="TextField" :class="wrapperStyle" :style="{ width: props.width }">
    <div class="options-wrap" v-if="props.label || (props.isCounting && props.maxLength)">
      <label class="input-label" v-if="props.label">
        {{ props.label }}
        <span class="required" v-if="props.required">*</span>
      </label>

      <div class="counting" v-if="props.isCounting && props.maxLength">
        {{ modelValue.length }} / {{ props.maxLength }}
      </div>
    </div>

    <template v-if="props.multiline">
      <textarea
        ref="Textarea"
        :class="{ error: message }"
        :style="[{ height: props.height }]"
        :rows="props.rows"
        :placeholder="props.placeholder"
        :value="props.disabled ? '' : props.modelValue"
        :readonly="props.readonly"
        :disabled="disabled"
        @blur="[emit('blur', $event), props.blurValidate && check() && updateTrimValue($event)]"
        @input="updateValue"
      ></textarea>
    </template>
    <template v-else>
      <div class="with-slot">
        <div class="input-relative">
          <input
            ref="Input"
            :type="props.type"
            :class="inputStyleClass"
            :style="[{ width: props.width }]"
            :placeholder="props.placeholder"
            :value="props.disabled ? '' : props.modelValue"
            :disabled="props.disabled"
            :readonly="props.readonly"
            :maxlength="props.maxLength > 0 ? props.maxLength : ''"
            :autocomplete="props.type === 'password' ? 'on' : 'off'"
            @blur="[emit('blur', $event), props.blurValidate && check() && updateTrimValue($event)]"
            @input="updateValue"
          />

          <!-- 왼쪽 아이콘 -->
          <template v-if="props.icon && props.iconLeft">
            <a
              href="#"
              @click.prevent="props.iconAction"
              v-if="typeof props.iconAction === 'function'"
            >
              <Icon :icon="props.icon" :width="24" :height="24" class="icon-left" />
            </a>
            <Icon :icon="props.icon" :width="24" :height="24" class="icon-left" v-else />
          </template>

          <!-- 오른쪽 아이콘 -->
          <template v-if="props.icon && !props.iconLeft">
            <a
              href="#"
              @click.prevent="props.iconAction"
              v-if="typeof props.iconAction === 'function'"
            >
              <Icon :icon="props.icon" :width="24" :height="24" class="icon-right" />
            </a>
            <Icon :icon="props.icon" :width="24" :height="24" class="icon-right" v-else />
          </template>

          <!-- 클리어 버튼 -->
          <a
            href="#"
            :class="['btn-clear', props.icon && !props.iconLeft && 'with-icon']"
            @click.prevent="clearValue"
            v-if="clearButtonShow"
          >
            <Icon icon="mdi:close-circle" :width="20" :height="20" />
          </a>
        </div>
        <slot></slot>
      </div>
    </template>

    <div :class="['feedback', { error: errorTransition }]" v-show="message && !props.hideMessage">
      {{ message }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use './style.scss' as *;
</style>

<script lang="ts">
export default { name: 'TextField' };
</script>
