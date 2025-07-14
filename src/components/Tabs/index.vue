<script setup lang="ts">
import {
  Comment,
  computed,
  ref,
  Static,
  Text,
  useSlots,
  watch,
  type VNode,
  type VNodeTypes,
} from 'vue';
import type { TabsEmits, TabsProps } from './types.d';

const props = withDefaults(defineProps<TabsProps>(), {
  inBox: false,
  activeTab: 0,
  variant: 'default',
  transition: 'slide',
  disabled: () => [],
});

const emit = defineEmits<TabsEmits>();

const slots = useSlots();

const Tabs = ref<HTMLDivElement>();
const transitionWrapper = ref<HTMLDivElement>();
const active = ref<number>(props.activeTab ?? 0);
const currentTransition = ref<string>('tab-slide-left');

// 트랜지션 이름을 props.transition에 따라 결정
const getTransitionName = (direction: 'left' | 'right'): string => {
  const baseTransition = props.transition;

  if (baseTransition === 'slide') {
    return direction === 'left' ? 'tab-slide-left' : 'tab-slide-right';
  }

  if (baseTransition === 'flip') {
    return direction === 'left' ? 'tab-flip-left' : 'tab-flip-right';
  }

  return `tab-${baseTransition}`;
};

// 외부 activeTab prop과 내부 active 동기화
watch(
  () => props.activeTab,
  val => {
    if (typeof val === 'number' && val !== active.value) {
      const direction = active.value < val ? 'left' : 'right';
      currentTransition.value = getTransitionName(direction);
      active.value = val;
    }
  },
);

/**
 * slot.default 아래의 vNode[] 중 :key 속성을 부여받지 못하는 vNode들 제거
 */
const RenderSlotItems = computed<VNode[]>(() => {
  const vNodes: VNode[] = slots.default ? slots.default() : [];
  return vNodes.filter(vnode => !([Comment, Text, Static] as VNodeTypes[]).includes(vnode.type));
});

/**
 * 현재 활성 탭의 콘텐츠만 반환
 */
const activeContent = computed(() => {
  return RenderSlotItems.value[active.value];
});

/**
 * 탭 항목을 클릭 할때 현재 인덱스 값 및 transition 스타일 변경
 *
 * @param index 선택된 탭 index
 */
const setIndex = (index: number): void => {
  if (props.disabled?.[index] || active.value === index) {
    return;
  }

  const direction = active.value < index ? 'left' : 'right';
  currentTransition.value = getTransitionName(direction);
  active.value = index;

  emit('update:activeTab', index);
  emit('changeTab', index);
};
</script>

<template>
  <div ref="Tabs" class="tabs" :data-variant="props.variant">
    <div class="tab-item-wrap">
      <ul class="tab-items" role="tablist">
        <li
          v-for="(item, index) in props.tabItems"
          :key="`tabs-${index}`"
          :class="[
            { active: index === active },
            props.disabled && props.disabled[index] ? 'disabled' : '',
            props.variant,
          ]"
          role="tab"
          :aria-selected="index === active"
          :aria-disabled="props.disabled && props.disabled[index] ? 'true' : 'false'"
          @click="setIndex(index)"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <div :class="['tab-contents', props.inBox && 'in-box']">
      <div ref="transitionWrapper" class="transition-wrapper">
        <Transition :name="currentTransition" mode="out-in">
          <div :key="`tab-content-${active}`" class="tab-panel">
            <component :is="activeContent" />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './style';
</style>
<script lang="ts">
export default { name: 'Tabs' };
</script>
