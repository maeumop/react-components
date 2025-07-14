<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { computed } from 'vue';
import { badgeColor, badgePosition, badgeSize } from './const';
import type { BadgeProps } from './types';

const props = withDefaults(defineProps<BadgeProps>(), {
  color: badgeColor.primary,
  position: badgePosition.right,
  size: badgeSize.default,
});

// 뱃지 스타일 클래스 생성
const badgeStyle = computed<string[]>(() => {
  const classes = ['badge'];
  // 색상 클래스 - badgeColors의 키 값들을 직접 확인
  const validColors = Object.keys(badgeColor);

  if (validColors.includes(props.color)) {
    classes.push(props.color);
  } else {
    classes.push(badgeColor.error);
    console.warn('Invalid color:', props.color, 'Valid colors:', validColors);
  }

  // 위치 클래스
  classes.push(props.position);

  // 크기 클래스
  classes.push(props.size);

  return classes;
});

// 래퍼 클래스 생성
const wrapperClass = computed(() => {
  const classes = ['badge-wrapper'];
  if (props.wrapperClass) {
    classes.push(props.wrapperClass);
  }

  return classes.join(' ');
});

// 뱃지 클래스 생성
const badgeClass = computed(() => {
  const classes = badgeStyle.value;
  if (props.badgeClass) {
    classes.push(props.badgeClass);
  }

  return classes.join(' ');
});

// 접근성 라벨 생성
const ariaLabel = computed(() => {
  if (props.text) {
    return `${props.text}개의 알림`;
  }

  return '알림';
});
</script>

<template>
  <div :class="wrapperClass">
    <slot></slot>
    <div :class="[badgeClass]" :aria-label="ariaLabel" role="status">
      <template v-if="props.icon">
        <Icon :icon="props.icon" />
      </template>
      <template v-else>
        {{ props.text }}
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './style';
</style>

<script lang="ts">
export default { name: 'Badge' };
</script>
