<script setup lang="ts" generic="T extends ListTableItem = ListTableItem">
/**
 * ListTable 컴포넌트
 * 정렬기능을 활성화 시킨 상태에서 라인당 추가되는 하위 데이터에 대한 변화를 감지하지 못합니다.
 */
import type { StyleValue } from 'vue';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watchEffect } from 'vue';
import type {
  ListTableEmits,
  ListTableExpose,
  ListTableFooter,
  ListTableHeader,
  ListTableItem,
  ListTableProps,
} from './types';

import { listTableDefaultOptions } from './const';
import ListTableCheck from './listCheck.vue';
import TableSpinner from './TableSpinner.vue';

const props = withDefaults(defineProps<ListTableProps<T>>(), {
  items: (): T[] => [],
  header: (): ListTableHeader[] => [],
  footer: (): ListTableFooter[] => [],
  emptyText: listTableDefaultOptions.emptyText,
  loading: listTableDefaultOptions.loading,
  observer: listTableDefaultOptions.observer,
});

const emit = defineEmits<ListTableEmits<T>>();

const slots = useSlots();

// 반응형 상태
const colspan = ref<number>(0);
const tableHeader = ref<ListTableHeader[]>([]);
const dataList = ref<ListTableItem[]>([]);

// 체크 관련 상태
const checkedAll = ref<boolean>(false);
const checkedIndexList = ref<number[]>([]);

// 계산된 속성
const tableWidth = computed<StyleValue>(() => {
  return { width: props.width };
});

const tableHeight = computed<StyleValue>(() => {
  return { height: props.height };
});

const isCheckMode = computed<boolean>(() =>
  props.checkMode ? ['checkbox', 'radio'].includes(props.checkMode) : false,
);

// 선택된 아이템들
const checkedItems = computed<T[]>(() =>
  props.items.filter((_, index) => checkedIndexList.value.includes(index)),
);

// 선택 가능한 아이템들의 인덱스
const selectableIndices = computed<number[]>(() =>
  props.items.map((_, index) => index).filter(index => !disabledFilter(index)),
);

// 모든 선택 가능한 아이템이 선택되었는지 확인
const isAllSelectableChecked = computed<boolean>(() => {
  if (selectableIndices.value.length === 0) {
    return false;
  }
  return selectableIndices.value.every(index => checkedIndexList.value.includes(index));
});

// 유효성 검사
const validateProps = (): void => {
  if (!Array.isArray(props.items)) {
    throw new Error('ListTable: items must be an array');
  }
  if (props.header && !Array.isArray(props.header)) {
    throw new Error('ListTable: header must be an array');
  }
  if (props.footer && !Array.isArray(props.footer)) {
    throw new Error('ListTable: footer must be an array');
  }
};

// 헤더 설정
const setHeader = (): void => {
  if (props.header.length) {
    tableHeader.value = props.header.map(item => ({
      text: item.text,
      width: item.width,
      colspan: item.colspan ?? 0,
      align: item.align ?? 'left',
    }));

    // colspan 계산: 체크박스 컬럼 + 헤더 컬럼 수
    colspan.value = (isCheckMode.value ? 1 : 0) + props.header.length;
  }
};

// 비활성화 필터
const disabledFilter = (index: number): boolean => {
  const item = index >= 0 && index < dataList.value.length ? dataList.value[index] : null;
  const filter = typeof props.disableFilter === 'function' ? props.disableFilter : null;

  if (item && filter) {
    return filter(item as T, index);
  }

  return false;
};

// 체크 상태 확인
const checkedFilter = (index: number): boolean => checkedIndexList.value.includes(index);

// 전체 체크 토글 (단순화된 버전)
const handleCheckAll = (checked: boolean): void => {
  if (props.checkMode !== 'checkbox') {
    // radio 모드에서는 해제만 가능
    if (!checked) {
      checkedIndexList.value = [];
      checkedAll.value = false;
      emit('checkedAll', false);
    }
    return;
  }

  checkedIndexList.value = checked ? [...selectableIndices.value] : [];
  checkedAll.value = checked;

  // 슬롯이 정의되지 않은 경우에만 이벤트 발생
  if (!slots['checkAll'] || !slots['checkItems']) {
    emit('checkedAll', checked);
  }
};

// 개별 아이템 체크 토글 (단순화된 버전)
const handleCheckItem = (index: number, checked: boolean): void => {
  if (index < 0 || index >= dataList.value.length) {
    return;
  }

  const disabled = disabledFilter(index);
  if (disabled && checked) {
    return; // 비활성화된 아이템은 선택 불가
  }

  if (props.checkMode === 'radio') {
    // 라디오 모드: 단일 선택만 가능
    checkedIndexList.value = checked ? [index] : [];
    checkedAll.value = false;

    if (!slots['checkItems']) {
      emit('checked', checked, index, checked ? [props.items[index]] : []);
    }
    return;
  }

  // 체크박스 모드: 다중 선택 가능
  const newCheckedList = new Set(checkedIndexList.value);

  if (checked) {
    newCheckedList.add(index);
  } else {
    newCheckedList.delete(index);
  }

  checkedIndexList.value = Array.from(newCheckedList);

  // 전체 선택 상태 업데이트
  checkedAll.value = isAllSelectableChecked.value;

  if (!slots['checkItems']) {
    emit('checked', checked, index, checkedItems.value);
  }
};

// 스크롤 감지 관련
const observerRef = ref<HTMLDivElement>();
const isObserving = ref<boolean>(false);

const observerStart = (): void => {
  if (!props.observer || !observerRef.value || isObserving.value) {
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          emit('observe');
        }
      });
    },
    { threshold: 0.1 },
  );

  observer.observe(observerRef.value);
  isObserving.value = true;
};

const observerStop = (): void => {
  isObserving.value = false;
};

// 라이프사이클 훅
onMounted(() => {
  validateProps();
  setHeader();

  if (props.observer) {
    nextTick(() => {
      observerStart();
    });
  }
});

onBeforeUnmount(() => {
  observerStop();
});

// 데이터 변경 감지
watchEffect(() => {
  dataList.value = props.items;
});

// Expose 메서드
defineExpose<ListTableExpose>({
  observerStart,
  observerStop,
  checkedToggle: (bool?: boolean) => handleCheckAll(bool ?? false),
});
</script>

<template>
  <div class="list-table" :style="tableHeight">
    <table :style="tableWidth">
      <!-- 헤더 -->
      <thead v-if="slots.header">
        <slot name="header" />
      </thead>
      <thead v-else>
        <tr>
          <th v-if="isCheckMode" width="50">
            <slot name="checkAll" v-if="props.checkMode === 'checkbox'">
              <ListTableCheck
                type="checkbox"
                :model-value="checkedAll"
                :disabled="props.loading"
                @update:model-value="handleCheckAll"
                v-if="!slots['checkItems']"
              />
            </slot>
          </th>
          <th
            v-for="item in tableHeader"
            :key="`head-${item.text}`"
            :width="item.width"
            :class="item.align"
          >
            <span>{{ item.text }}</span>
          </th>
        </tr>
      </thead>

      <!-- 바디 -->
      <tbody v-if="dataList.length > 0">
        <template v-if="isCheckMode">
          <!-- 체크 모드 -->
          <tr v-for="(item, index) in dataList" :key="`row-${index}`">
            <td width="50">
              <slot
                name="checkItems"
                :index="index"
                :disabled="disabledFilter(index)"
                :props="item"
                v-if="slots.checkItems"
              />
              <ListTableCheck
                v-else
                :type="props.checkMode"
                :disabled="disabledFilter(index)"
                :model-value="checkedFilter(index)"
                @update:model-value="handleCheckItem(index, $event)"
              />
            </td>
            <slot
              name="items"
              :props="item as T"
              :disabled="disabledFilter(index)"
              :index="index"
            />
          </tr>

          <tr v-if="props.loading">
            <td :colspan="colspan">
              <TableSpinner />
            </td>
          </tr>
        </template>
        <template v-else>
          <!-- 기본 모드 -->
          <slot
            name="items"
            v-for="(item, index) in dataList"
            :key="`row-${index}`"
            :props="item as T"
            :index="index"
            :disabled="disabledFilter(index)"
          />

          <tr v-if="props.loading">
            <td :colspan="colspan">
              <TableSpinner />
            </td>
          </tr>
        </template>
      </tbody>
      <tbody v-else>
        <!-- 빈 데이터 -->
        <tr>
          <td v-if="!props.loading" class="no-data" :colspan="colspan">
            <template v-if="slots.empty">
              <slot name="empty" />
            </template>
            <template v-else>
              {{ props.emptyText }}
            </template>
          </td>
        </tr>

        <tr v-if="props.loading">
          <td :colspan="colspan">
            <TableSpinner />
          </td>
        </tr>
      </tbody>

      <!-- 푸터 -->
      <tfoot v-if="props.footer.length">
        <tr>
          <template v-for="(item, i) in props.footer" :key="`foot-${i}`">
            <th v-if="item.tag === 'th'" :colspan="item.colspan" :class="item.align">
              {{ item.text }}
            </th>
            <td v-else :colspan="item.colspan" :class="item.align">
              <b>{{ item.text }}</b>
            </td>
          </template>
        </tr>
      </tfoot>
      <tfoot v-else-if="slots.footer">
        <slot name="footer" />
      </tfoot>
    </table>

    <!-- 스크롤 감지용 요소 -->
    <div v-if="props.observer" ref="observerRef" class="observer-target" />
  </div>
</template>

<style scoped lang="scss">
@use './style';
</style>

<script lang="ts">
export default { name: 'ListTable' };
</script>
