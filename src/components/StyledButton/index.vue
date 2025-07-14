<script setup lang="ts">
import type { VNode } from 'vue';
import { computed, h, reactive } from 'vue';
import { buttonStyles } from './const';
import type { StyledButtonOptions, StyledButtonProps } from './types';

const props = withDefaults(defineProps<StyledButtonProps>(), {
  href: '#',
  target: '_blank',
  style: buttonStyles.filled,
  right: false,
  block: false,
  onlyIcon: false,
  loading: false,
  disabled: false,
  iconRight: false,
  small: false,
  default: false,
  large: false,
  outline: false,
  tag: 'a',
  dropMenuToggle: false,
  width: undefined,
});

const emit = defineEmits<{
  (event: 'click', value: MouseEvent): void;
}>();

const buttonStyle = computed<string[]>(() => {
  const classes = ['btn'];

  // 버튼 타입
  if (props.onlyIcon) {
    classes.push('icon');
  } else if (props.style === 'text') {
    classes.push('text');
  }

  // 색상 클래스
  if (props.color) {
    classes.push(props.color);
  }

  // 크기 클래스
  if (props.large) {
    classes.push('large');
  } else if (props.default) {
    classes.push('default');
  } else if (props.small) {
    classes.push('small');
  } else {
    classes.push('default'); // 기본값은 small
  }

  // 스타일 클래스
  if (props.style === 'outline' || props.outline) {
    classes.push('outline');
  }

  // 블록 클래스
  if (props.block) {
    classes.push('block');
  }

  // 비활성화 클래스
  if (props.disabled || props.loading) {
    classes.push('disabled');
  }

  // 추가 클래스
  if (props.class) {
    classes.push(props.class);
  }

  return classes;
});

const buttonInlineStyle = computed(() => {
  const style: Record<string, string> = {};

  if (props.width) {
    if (typeof props.width === 'number') {
      style.width = `${props.width}px`;
    } else {
      style.width = props.width;
    }
  }

  return style;
});

const hrefState = computed<string>(() => {
  if (!props.disabled) {
    return props.href ? props.href : '#';
  }

  return '';
});

const iconSize = computed<number>(() => {
  if (props.large) {
    return 24;
  } else if (props.default) {
    return 20;
  } else if (props.small) {
    return 18;
  } else {
    return 18; // 기본값은 small
  }
});

const options = reactive<StyledButtonOptions>({
  class: buttonStyle.value,
  onClick: (event: MouseEvent): void => {
    if (props.href === '#') {
      event.preventDefault();

      if (!props.disabled && !props.loading) {
        emit('click', event);
      }
    }
  },
});

if (props.tag.toLowerCase() === 'a') {
  options.href = hrefState.value;
  options.target = props.target;
} else if (props.tag.toLowerCase() === 'button') {
  options.type = 'button';
}

const WrapperTag = computed<VNode>(() => h(props.style === 'text' ? 'a' : props.tag, options));
</script>

<template>
  <WrapperTag :class="buttonStyle" :style="buttonInlineStyle">
    <div class="btn-wrap">
      <template v-if="!props.onlyIcon">
        <template v-if="props.loading">
          <Icon class="loading" icon="mdi:loading" :width="iconSize" :height="iconSize" />
        </template>
        <template v-else>
          <template v-if="props.icon && !props.iconRight">
            <Icon
              :class="{ rotate: props.dropMenuToggle }"
              :width="iconSize"
              :height="iconSize"
              :icon="props.icon"
            />
          </template>

          <slot></slot>

          <template v-if="props.icon && props.iconRight">
            <Icon
              :class="{ rotate: props.dropMenuToggle }"
              :width="iconSize"
              :height="iconSize"
              :icon="props.icon"
            />
          </template>
        </template>
      </template>
      <template v-else>
        <div class="only-icon">
          <Icon :width="iconSize" :height="iconSize" :icon="props.icon" />
        </div>
      </template>
    </div>
  </WrapperTag>
</template>

<style scoped lang="scss">
@use './style';
</style>

<script lang="ts">
export default { name: 'StyledButton' };
</script>
