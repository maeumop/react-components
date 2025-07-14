<script setup lang="ts">
import { computed, getCurrentInstance, inject, nextTick, onMounted, ref, watch } from 'vue';
import type { RuleFunc } from '../../types';
import { VALIDATE_FORM_KEY } from '../ValidateForm/const';
import { ValidateFormInjection } from '../ValidateForm/types';
import { checkButtonColor, checkButtonIcons, checkButtonType } from './const';
import type { CheckButtonEmits, CheckButtonItem, CheckButtonProps } from './types';

const props = withDefaults(defineProps<CheckButtonProps>(), {
  type: 'checkbox',
  all: false,
  maxLength: 0,
  items: (): CheckButtonItem[] => [],
  validate: (): RuleFunc[] => [],
  button: false,
  block: false,
  color: checkButtonColor.primary,
  lineLimit: 0,
});

const emit = defineEmits<CheckButtonEmits>();

const list = ref<CheckButtonItem[]>([]);
const val = ref<string | string[]>(props.type === checkButtonType.radio ? '' : []);
const isValidate = ref<boolean>(true);
const checkPass = ref<boolean>(false);
const message = ref<string>('');
const errorTransition = ref<boolean>(false);

// 아이콘 상태 계산
const getRadioIcon = (isSelected: boolean, isDisabled: boolean): string => {
  if (isSelected) {
    return checkButtonIcons.radio.checked;
  }
  return isDisabled ? checkButtonIcons.radio.disabled : checkButtonIcons.radio.unchecked;
};

const getCheckboxIcon = (isSelected: boolean, isDisabled: boolean): string => {
  if (isSelected) {
    return checkButtonIcons.checkbox.checked;
  }
  return isDisabled ? checkButtonIcons.checkbox.disabled : checkButtonIcons.checkbox.unchecked;
};

// 아이템 선택 상태 확인
const isItemSelected = (value: string): boolean => {
  if (props.type === checkButtonType.radio) {
    return props.modelValue === value;
  }
  return Array.isArray(props.modelValue) && props.modelValue.includes(value);
};

// 아이템 변경 처리
const handleItemChange = (index: number, value: string): void => {
  if (props.type === checkButtonType.radio) {
    setIndex(index);
  } else {
    checkValue(index, value);
  }
};

// 초기화 로직을 computed로 개선
const processedItems = computed<CheckButtonItem[]>(() => {
  let items = props.items || [];

  if (props.all) {
    items = [{ text: '전체 선택', value: '' }, ...items];
  }

  return items;
});

// 초기값 설정
const initializeValue = (): void => {
  if (props.modelValue) {
    val.value = props.modelValue;
  } else {
    val.value = props.type === checkButtonType.radio ? '' : [];
  }
};

// 컴포넌트 마운트 시 초기화
onMounted(() => {
  initializeValue();
});

// props.items 변경 시 list 업데이트
watch(
  () => processedItems.value,
  items => {
    list.value = items;
  },
  { immediate: true },
);

watch(
  () => props.errorMessage,
  v => {
    // 임의로 지정된 에러가 있는 경우 에러 아이콘 표기
    if (v) {
      message.value = v;
      isValidate.value = false;
      checkPass.value = false;
      errorTransition.value = true;
    } else {
      message.value = '';
      isValidate.value = true;
      checkPass.value = true;
      errorTransition.value = false;
    }
  },
);

watch(
  () => props.modelValue,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      val.value = newValue ?? (props.type === checkButtonType.radio ? '' : []);
      // 값이 실제로 변경된 경우에만 유효성 검사 실행
      nextTick(() => {
        check(true);
      });
    }
  },
);

watch(val, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    // 내부 값이 변경된 경우에만 유효성 검사 실행
    nextTick(() => {
      check(true);
    });
  }
});

watch(
  () => props.validate,
  () => {
    // 유효성 검사 규칙이 변경된 경우에만 재검사
    nextTick(() => {
      check(true);
    });
  },
);

watch(
  () => props.disabled,
  (newValue, oldValue) => {
    if (newValue !== oldValue && newValue) {
      // 비활성화 상태로 변경된 경우에만 유효성 검사 초기화
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

const updateValue = (): void => {
  emit('update:modelValue', val.value);
  // 사용자 상호작용으로 인한 값 변경이므로 유효성 검사 실행
  nextTick(() => {
    check();
    emit('update:after');
  });
};

const setIndex = (index: number): void => {
  emit('update:clickIndex', index);
  updateValue();
};

const checkValue = (index: number, value: string): void => {
  setIndex(index);

  if (props.type !== checkButtonType.checkbox || value === '') {
    updateValue();
    return;
  }

  if (!Array.isArray(val.value)) {
    updateValue();
    return;
  }

  // 최대 길이 제한 처리
  if (props.maxLength > 0 && val.value.length >= props.maxLength) {
    val.value.splice(props.maxLength, 1);
  }

  // 빈 값 제거
  const emptyIndex = val.value.indexOf('');
  if (emptyIndex > -1) {
    val.value.splice(emptyIndex, 1);
  }

  updateValue();
};

/**
 * 폼을 검수하여 값을 반환, 임의로 지정된 에러가 없는 경우
 *
 * @return { Boolean }
 */
const check = (silence: boolean = false): boolean => {
  if (props.disabled) {
    return true;
  }

  // 강제 에러 메시지가 있는 경우 검증 실패
  if (props.errorMessage) {
    if (!silence) {
      message.value = props.errorMessage;
      isValidate.value = false;
      checkPass.value = false;
      errorTransition.value = true;
    }
    return false;
  }

  // 유효성 검사 규칙이 없는 경우 성공으로 처리
  if (!props.validate.length) {
    if (!silence) {
      message.value = '';
      isValidate.value = true;
      checkPass.value = true;
      errorTransition.value = false;
    }
    return true;
  }

  // 검증 실행
  for (const validator of props.validate) {
    let valueToValidate: string | string[];

    if (props.type === checkButtonType.checkbox) {
      // 체크박스의 경우 선택된 값들의 배열을 전달
      valueToValidate = Array.isArray(val.value) ? val.value : [];
    } else {
      // 라디오의 경우 선택된 단일 값을 전달
      valueToValidate = val.value;
    }

    const result: string | boolean = validator(valueToValidate);

    if (typeof result !== 'boolean') {
      if (!silence) {
        message.value = result;
        isValidate.value = false;
        checkPass.value = false;
        errorTransition.value = true;
      }
      return false;
    }
  }

  message.value = '';
  isValidate.value = true;
  checkPass.value = true;
  errorTransition.value = false;
  return true;
};

const resetValidate = (): void => {
  isValidate.value = true;
  checkPass.value = true;
  message.value = '';
  errorTransition.value = false;
};

const resetForm = (): void => {
  val.value = props.type === 'radio' ? '' : [];
};

const validateForm = inject<ValidateFormInjection | null>(VALIDATE_FORM_KEY, null);
const instance = getCurrentInstance();

onMounted(() => {
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
  <div class="check-button">
    <div class="options-wrap" v-if="props.label">
      <label class="input-label">
        {{ props.label }}
        <span class="required" v-if="props.required">*</span>
      </label>
    </div>

    <template v-if="button">
      <div :class="['check-button-group', props.color, { disabled: props.disabled }]">
        <template :key="`keyword${i}`" v-for="({ text, value }, i) in list">
          <input
            type="checkbox"
            :id="`${name}${i}`"
            :name="name"
            :disabled="props.disabled"
            :value="value"
            @change="checkValue(i, value)"
            v-model="val"
          />

          <label :class="{ last: list.length - 1 === i }" :for="`${name}${i}`">
            {{ text }}
          </label>
        </template>
      </div>
    </template>
    <template v-else>
      <template :key="`check-button-${i}`" v-for="({ text, value }, i) in list">
        <div :class="['origin-check-button', { block: props.block }]">
          <label :class="props.color" :for="`${name}${i}`">
            <input
              :type="props.type"
              :disabled="props.disabled"
              :id="`${name}${i}`"
              :name="name"
              :value="value"
              :checked="isItemSelected(value)"
              @change="handleItemChange(i, value)"
              v-model="val"
            />

            <template v-if="props.type === checkButtonType.radio">
              <Transition name="check-scale" mode="out-in">
                <Icon :icon="getRadioIcon(props.modelValue === value, props.disabled)" />
              </Transition>
            </template>
            <template v-else>
              <Transition name="check-scale" mode="out-in">
                <Icon
                  :icon="
                    getCheckboxIcon(
                      Array.isArray(props.modelValue) && props.modelValue.includes(value),
                      props.disabled,
                    )
                  "
                />
              </Transition>
            </template>

            {{ text }}
          </label>
        </div>
        <div class="line-break" v-if="(i + 1) % props.lineLimit === 0"></div>
      </template>
    </template>

    <div :class="['description', { error: errorTransition }]" v-show="message">
      {{ message }}
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './style';
</style>

<script lang="ts">
export default { name: 'CheckButton' };
</script>
