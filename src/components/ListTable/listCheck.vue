<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { computed } from 'vue';
import { listTableCheckboxIcon, listTableRadioIcon } from './const';
import type { ListTableListCheckIconKeys, ListTableListCheckProps } from './types';

const props = withDefaults(defineProps<ListTableListCheckProps>(), {
  type: 'checkbox',
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
}>();

const iconName = computed<string>(() => {
  let type: ListTableListCheckIconKeys = 'blank';

  if (props.disabled) {
    type = 'disabled';
  } else if (props.modelValue) {
    type = 'checked';
  }

  return props.type === 'radio' ? listTableRadioIcon[type] : listTableCheckboxIcon[type];
});

const checkEvent = (event: Event): void => {
  if (!props.disabled) {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.checked);
  }
};
</script>

<template>
  <label class="checkbox-wrap">
    <input
      :type="props.type"
      :disabled="props.disabled"
      :value="props.value"
      :checked="props.modelValue === true"
      @input="checkEvent"
      v-show="false"
    />
    <Icon :icon="iconName" class="check-icon" />
  </label>
</template>

<style scoped lang="scss">
.checkbox-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;

  &:hover:not(:has(input:disabled)) {
    background-color: rgba(59, 130, 246, 0.1);
    transform: scale(1.05);
  }

  &:active:not(:has(input:disabled)) {
    transform: scale(0.95);
  }

  &:has(input:disabled) {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .check-icon {
    width: 1.3rem;
    height: 1.3rem;
    transition: all 0.2s ease;

    &:hover {
      filter: brightness(1.1);
    }
  }
}
</style>

<script lang="ts">
export default { name: 'ListTableCheck' };
</script>
