<script setup lang="ts">
import { Icon } from '@iconify/vue';
import type { CSSProperties, StyleValue } from 'vue';
import {
  computed,
  getCurrentInstance,
  inject,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from 'vue';
import type { RuleFunc } from '../../types';
import { VALIDATE_FORM_KEY } from '../ValidateForm/const';
import { ValidateFormInjection } from '../ValidateForm/types';
import type { SelectBoxEmits, SelectBoxItem, SelectBoxProps } from './types';

const props = withDefaults(defineProps<SelectBoxProps>(), {
  block: false,
  label: '',
  inLabel: false,
  placeholder: '',
  errorMessage: '',
  items: (): SelectBoxItem[] => [],
  validate: (): RuleFunc[] => [],
  multiple: false,
  readonly: false,
  disabled: false,
  required: false,
  isShort: false,
  btnAccept: false,
  labelText: false,
  maxLength: 0,
  searchable: false,
  hideMessage: false,
  blurValidate: true,
  isLoading: false,
});

const emit = defineEmits<SelectBoxEmits>();

// 반응형 상태
const isValidate = ref<boolean>(true);
const message = ref<string>('');
const errorTransition = ref<boolean>(false);
const isShowOption = ref<boolean>(false);
const showBottom = ref<boolean>(false);
const isSearchFilter = ref<boolean>(false);
const transitionStatus = ref<boolean>(false);

// 선택된 값들
const selectedText = ref<string | string[]>(props.multiple ? [] : '');
const selectedValue = ref<string | string[]>(props.multiple ? [] : '');

// 옵션 리스트 (메모이제이션 적용)
const optionList = computed(() => {
  if (isSearchFilter.value && props.searchable) {
    return props.options.filter(({ text }) =>
      text.toLowerCase().includes(searchText.value.toLowerCase()),
    );
  }
  return props.options;
});

// 검색 텍스트
const searchText = ref<string>('');

// DOM 참조
const SelectBox = ref<HTMLDivElement>();
const SearchInput = ref<HTMLInputElement>();
const OptionList = ref<HTMLUListElement>();
const main = ref<HTMLDivElement>();

// 레이어 위치 스타일
const layerPositionStyle = reactive<CSSProperties>({
  top: '',
  left: '',
  bottom: '',
  width: '',
});

const selectedKeyIndex = ref<number>(0);

// 이벤트 리스너 참조 (메모리 누수 방지)
let timeout: number = 0;

// 스크롤 이벤트 리스너 배열 (여러 요소에 등록할 수 있도록)
const scrollEventListeners: Array<{
  element: HTMLElement | Window;
  listener: () => void;
}> = [];

// Computed 속성들
const isSelectAll = computed<boolean>(() => {
  if (!props.multiple || !Array.isArray(selectedValue.value)) {
    return false;
  }

  return (
    optionList.value.length > 0 &&
    optionList.value.every(item => selectedValue.value.includes(item.value))
  );
});

const wrapperStyle = computed<StyleValue>(() => ({
  block: props.block,
}));

const getShowText = computed<string[]>(() => {
  if (props.btnAccept) {
    return Array.isArray(selectedText.value) ? selectedText.value : [selectedText.value];
  }

  const values: string[] = Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue];

  return props.options.filter(option => values.includes(option.value)).map(({ text }) => text);
});

const clearButtonShow = computed<boolean>(() => {
  if (!props.clearable || props.disabled || props.readonly) {
    return false;
  }

  if (Array.isArray(props.modelValue)) {
    return props.modelValue.length > 0;
  }

  return !!props.modelValue;
});

// Watch 함수들
watch(
  () => props.errorMessage,
  v => {
    if (v) {
      isValidate.value = false;
      message.value = props.errorMessage;
    }
  },
);

watch(
  () => props.validate,
  (newValue, oldValue) => {
    // 유효성 검사 규칙이 실제로 변경된 경우에만 재검사
    if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
      nextTick(() => {
        check(true);
      });
    }
  },
);

watch(
  () => props.modelValue,
  (newValue, oldValue) => {
    // 값이 실제로 변경된 경우에만 처리
    if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
      setDefaultModelValue();
      // 값이 변경된 경우 유효성 검사 실행
      nextTick(() => {
        check(true);
      });
    }
  },
);

watch(
  () => props.options,
  (newValue, oldValue) => {
    // 옵션이 실제로 변경된 경우에만 처리
    if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
      setDefaultModelValue();
      // 옵션이 변경된 경우 유효성 검사 실행
      nextTick(() => {
        check(true);
      });
    }
  },
  { deep: true },
);

watch(
  () => props.disabled,
  (newValue, oldValue) => {
    // 비활성화 상태로 변경된 경우에만 유효성 검사 초기화
    if (newValue !== oldValue && newValue) {
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

// 메서드들
const setDefaultModelValue = (): void => {
  if (Array.isArray(props.modelValue)) {
    selectedValue.value = [...props.modelValue];
  } else {
    selectedValue.value = '';
  }

  if (props.multiple) {
    selectedText.value = [];
  } else {
    selectedText.value = '';
  }

  props.options.forEach(item => {
    if (props.multiple && Array.isArray(props.modelValue)) {
      if (props.modelValue.includes(item.value) && Array.isArray(selectedText.value)) {
        selectedText.value.push(item.text);
      }
    } else {
      if (props.modelValue === item.value) {
        selectedText.value = item.text;
        selectedValue.value = item.value;
      }
    }
  });
};

const updateValue = (v: string | string[], index: number = -1): void => {
  emit('update:modelValue', v);
  emit('update:selectedIndex', index);
  emit('change', v);
  // 사용자 상호작용으로 인한 값 변경이므로 유효성 검사 실행
  nextTick(() => {
    check();
  });
};

const check = (silence: boolean = false): boolean => {
  // 비활성화 상태인 경우 검증 성공
  if (props.disabled) {
    return true;
  }

  // 강제 에러 메시지가 있는 경우 검증 실패
  if (props.errorMessage) {
    if (!silence) {
      message.value = props.errorMessage;
      isValidate.value = false;
      errorTransition.value = true;
    }
    return false;
  }

  // 유효성 검사 규칙이 없는 경우 성공으로 처리
  if (!props.validate.length) {
    if (!silence) {
      message.value = '';
      isValidate.value = true;
      errorTransition.value = false;
    }
    return true;
  }

  // 데이터 검증
  for (let i: number = 0; i < props.validate.length; i++) {
    const result: string | boolean = props.validate[i](selectedValue.value);

    if (typeof result === 'string') {
      if (!silence) {
        message.value = result;
        isValidate.value = false;
        errorTransition.value = true;
      }
      return false;
    }
  }

  // 모든 검증을 통과한 경우
  if (!silence) {
    message.value = '';
    isValidate.value = true;
    errorTransition.value = false;
  }

  return true;
};

const resetForm = (): void => {
  if (props.multiple) {
    selectedText.value = [];
    selectedValue.value = [];
    emit('update:modelValue', []);
  } else {
    selectedText.value = '';
    selectedValue.value = '';
    emit('update:modelValue', '');
  }
};

const resetValidate = (): void => {
  message.value = '';
  isValidate.value = true;
  errorTransition.value = false;
};

const selectOption = (v: string): void => {
  let index = -1;
  const selectedItem = optionList.value.find((item, i) => {
    if (item.value === v) {
      index = i;
      return true;
    }
    return false;
  });

  if (!selectedItem) {
    return;
  }

  if (props.multiple && Array.isArray(selectedValue.value) && Array.isArray(selectedText.value)) {
    const indexOf: number = selectedValue.value.indexOf(v);

    if (indexOf > -1) {
      selectedValue.value.splice(indexOf, 1);
      selectedText.value.splice(indexOf, 1);
    } else {
      selectedValue.value.push(v);
      selectedText.value.push(selectedItem.text);
    }
  } else {
    selectedValue.value = v;
    selectedText.value = selectedItem.text;
  }

  if (!props.btnAccept) {
    updateValue(selectedValue.value, index);
  }

  if (!props.multiple) {
    toggleOption();
  }
};

const isOptionSelected = (v: string): boolean => {
  if (props.multiple) {
    return Array.isArray(selectedValue.value) && selectedValue.value.includes(v);
  }
  return props.modelValue === v;
};

const removeSelected = (index: number): void => {
  if (props.multiple && Array.isArray(selectedValue.value) && Array.isArray(selectedText.value)) {
    selectedText.value.splice(index, 1);
    selectedValue.value.splice(index, 1);
  }

  if (!props.btnAccept) {
    updateValue(selectedValue.value);
  }
};

const isOptionFocused = (i: number): boolean => {
  let index: number = i;
  if (props.multiple) {
    index = !isSearchFilter.value ? i + 1 : i;
  }
  return selectedKeyIndex.value === index;
};

const selectAll = (): void => {
  if (!props.multiple) {
    return;
  }

  const value: boolean = isSelectAll.value;
  selectedText.value = [];
  selectedValue.value = [];

  if (!value) {
    optionList.value.forEach(({ text, value }) => {
      (selectedText.value as string[]).push(text);
      (selectedValue.value as string[]).push(value);
    });
  }

  if (!props.btnAccept) {
    updateValue([...selectedValue.value]);
  }
};

const toggleOption = (): void => {
  if (props.disabled || props.readonly || transitionStatus.value) {
    return;
  }

  if (!isShowOption.value) {
    calculateLayerPosition();
  }

  isShowOption.value = !isShowOption.value;

  if (isShowOption.value) {
    if (props.searchable && SearchInput.value) {
      SearchInput.value.value = '';
      searchText.value = '';
      isSearchFilter.value = false;
    }

    selectedKeyIndex.value = 0;

    nextTick(() => {
      const selected = OptionList.value?.querySelector('.selected');
      selected?.scrollIntoView();
    });
  }
};

const calculateLayerPosition = (): void => {
  const windowHeight: number = window.innerHeight;
  const rect: DOMRect | undefined = SelectBox.value?.getBoundingClientRect();

  if (!rect) {
    return;
  }

  showBottom.value = windowHeight / 2 < rect.top;

  layerPositionStyle.top = '';
  layerPositionStyle.bottom = '';
  layerPositionStyle.left = `${rect.left}px`;
  layerPositionStyle.width = `${rect.width}px`;

  if (showBottom.value) {
    layerPositionStyle.bottom = `${windowHeight - rect.top + 6}px`;
  } else {
    layerPositionStyle.top = `${rect.top + rect.height + 6}px`;
  }
};

const searchTextHandler = (evt: KeyboardEvent): void => {
  const key = evt.key.toLowerCase();
  clearTimeout(timeout);

  if (['arrowup', 'arrowdown', 'enter'].includes(key)) {
    return;
  }

  selectedKeyIndex.value = 0;
  timeout = setTimeout(() => {
    const { value } = evt.target as HTMLInputElement;
    searchText.value = value;
    isSearchFilter.value = !!value;

    nextTick(() => {
      if (OptionList.value) {
        const li = OptionList.value.querySelector<HTMLLIElement>('.option-item');
        li?.scrollIntoView({ block: 'center' });
      }
    });
  }, 300);
};

const accept = (): void => {
  isShowOption.value = false;
  updateValue(selectedValue.value);
};

const noneAccept = (): void => {
  if (!props.btnAccept) {
    return;
  }

  selectedText.value = [];
  selectedValue.value = [];

  selectedValue.value = [...props.modelValue];
  for (let index = 0; index < props.options.length; index++) {
    const option = props.options[index];
    if (selectedValue.value.includes(option.value)) {
      selectedText.value.push(option.text);
    }
    if (selectedText.value.length === selectedValue.value.length) {
      break;
    }
  }

  updateValue([...selectedValue.value]);
};

const outSideClickEvent = (evt: MouseEvent): void => {
  const target = evt.target as HTMLElement;

  if (!isShowOption.value || !main.value) {
    return;
  }

  // SelectBox 컴포넌트 내부 클릭인지 확인 (main 요소 기준)
  if (main.value.contains(target)) {
    return;
  }

  // 외부 클릭 시 옵션 목록 닫기
  if (props.btnAccept) {
    noneAccept();
  }
  isShowOption.value = false;
};

const preventDefaultScrollEvent = (evt: KeyboardEvent): void => {
  if (isShowOption.value) {
    const code = evt.code.toLowerCase();
    if (['arrowdown', 'arrowup'].includes(code)) {
      evt.preventDefault();
    }
  }
};

const setScrollEvent = (el: HTMLElement): void => {
  const parent = el.parentElement as HTMLElement;

  if (!parent || parent.tagName.toLowerCase() === 'html') {
    return;
  }

  // 스크롤 가능한 요소인지 확인 (overflow: auto/scroll)
  const computedStyle = window.getComputedStyle(parent);
  const overflow = computedStyle.overflow + computedStyle.overflowY + computedStyle.overflowX;

  if (
    overflow.includes('auto') ||
    overflow.includes('scroll') ||
    parent.scrollHeight > parent.clientHeight
  ) {
    const listener = () => {
      if (isShowOption.value) {
        isShowOption.value = false;
      }
    };

    parent.addEventListener('scroll', listener, { passive: true });
    scrollEventListeners.push({ element: parent, listener });
  }

  // 재귀적으로 상위 요소 탐색
  setScrollEvent(parent);
};

// window 스크롤 이벤트 추가
const addWindowScrollEvent = (): void => {
  const listener = () => {
    if (isShowOption.value) {
      isShowOption.value = false;
    }
  };

  window.addEventListener('scroll', listener, { passive: true });
  scrollEventListeners.push({ element: window, listener });
};

const clearValue = (): void => {
  updateValue(props.multiple ? [] : '');
};

const onBlur = (): void => {
  nextTick(() => {
    emit('blur', selectedValue.value);
  });
};

const onKeyDownHandler = (event: KeyboardEvent): void => {
  if (!isShowOption.value) {
    return;
  }

  const li = OptionList.value?.querySelectorAll<HTMLLIElement>('.option-item');
  if (!li) {
    return;
  }

  const len = li.length;
  const code = event.code.toLowerCase();

  if (code === 'arrowdown' && selectedKeyIndex.value < len) {
    selectedKeyIndex.value++;
    if (selectedKeyIndex.value >= len) {
      selectedKeyIndex.value = 0;
    }
    li[selectedKeyIndex.value].scrollIntoView({ block: 'center' });
  } else if (code === 'arrowup' && selectedKeyIndex.value >= -1) {
    selectedKeyIndex.value--;
    if (selectedKeyIndex.value === -1) {
      selectedKeyIndex.value = len - 1;
    }
    li[selectedKeyIndex.value].scrollIntoView({ block: 'center' });
  } else if (['numpadenter', 'enter'].includes(code)) {
    if (props.multiple && !isSearchFilter.value && selectedKeyIndex.value === 0) {
      selectAll();
    } else {
      const index =
        props.multiple && !isSearchFilter.value
          ? selectedKeyIndex.value - 1
          : selectedKeyIndex.value;
      if (index > -1 && index < optionList.value.length) {
        const value = optionList.value[index].value;
        selectOption(value);
      }
    }
  }
};

const onKeyUpHandler = (event: KeyboardEvent): void => {
  const code = event.code.toLowerCase();
  if (code === 'tab' && document.activeElement instanceof HTMLElement && SelectBox.value) {
    const parentElement = SelectBox.value.parentElement;
    const isFocused: boolean = parentElement
      ? document.activeElement.contains(parentElement)
      : false;

    if (!isFocused) {
      noneAccept();
      toggleOption();
    }
  }
};

const onEscapeKeyHandler = (event: KeyboardEvent): void => {
  const code = event.code.toLowerCase();

  if (isShowOption.value && code === 'escape') {
    isShowOption.value = false;
    noneAccept();

    const { eventPhase } = event;
    if ([1, 2].includes(eventPhase)) {
      event.stopPropagation();
    }
  }
};

// 이벤트 리스너 관리
watch(isShowOption, v => {
  if (v) {
    document.addEventListener('keydown', onKeyDownHandler);
    document.addEventListener('keyup', onKeyUpHandler);
  } else {
    document.removeEventListener('keydown', onKeyDownHandler);
    document.removeEventListener('keyup', onKeyUpHandler);
  }
});

const validateForm = inject<ValidateFormInjection | null>(VALIDATE_FORM_KEY, null);
const instance = getCurrentInstance();

onMounted(() => {
  if (validateForm !== null && instance) {
    validateForm.addComponent(instance.vnode);
  }

  setDefaultModelValue();

  if (main.value) {
    setScrollEvent(main.value);
  }

  // window 스크롤 이벤트 추가
  addWindowScrollEvent();

  document.addEventListener('click', outSideClickEvent);
  document.addEventListener('keydown', preventDefaultScrollEvent, { capture: true });
});

onUnmounted(() => {
  document.removeEventListener('click', outSideClickEvent);
  document.removeEventListener('keydown', onKeyDownHandler);
  document.removeEventListener('keyup', onKeyUpHandler);
  document.removeEventListener('keydown', preventDefaultScrollEvent, { capture: true });

  // 스크롤 이벤트 리스너 정리
  scrollEventListeners.forEach(({ element, listener }) => {
    if (element === window) {
      window.removeEventListener('scroll', listener);
    } else if (element instanceof HTMLElement) {
      element.removeEventListener('scroll', listener);
    }
  });
  scrollEventListeners.length = 0;

  if (timeout) {
    clearTimeout(timeout);
  }
});

defineExpose({
  check,
  resetForm,
  resetValidate,
});
</script>

<template>
  <div
    ref="main"
    tabindex="0"
    :style="{ width: props.width }"
    :class="['select-box', wrapperStyle]"
    @focus="!isShowOption && toggleOption()"
    @keydown.escape.capture="onEscapeKeyHandler"
  >
    <div class="options-wrap" v-if="!props.inLabel && props.label">
      <label class="input-label" v-if="props.label">
        {{ props.label }}
        <span class="required" v-if="props.required">*</span>
      </label>
    </div>

    <div
      ref="SelectBox"
      :class="[
        'control-wrap',
        {
          disabled: props.disabled,
          readonly: props.readonly,
          error: message,
          active: isShowOption,
        },
      ]"
      @click="toggleOption"
    >
      <template v-if="props.multiple">
        <div class="text" v-if="getShowText.length">
          <template v-if="props.labelText">
            <template v-if="!props.isShort">
              <span :key="`selectedItem${i}`" class="item" v-for="(txt, i) in getShowText">
                {{ txt }}
                <Icon
                  icon="mdi:window-close"
                  class="remove-icon"
                  :width="13"
                  :height="13"
                  @click.stop="removeSelected(i)"
                />
              </span>
            </template>
            <template v-else>
              <span>{{ getShowText[0] }}</span>

              <template v-if="getShowText.length > 1">
                &nbsp; + {{ getShowText.length - 1 }}
              </template>
            </template>
          </template>
          <template v-else>
            <template v-if="!props.isShort">
              <span class="label" v-if="props.inLabel"> {{ props.label }}: </span>

              {{ getShowText.join(', ') }}
            </template>
            <template v-else>
              <span class="label" v-if="props.inLabel"> {{ props.label }}: </span>

              {{ getShowText[0] }}
              <template v-if="getShowText.length > 1"> + {{ getShowText.length - 1 }} </template>
            </template>
          </template>
        </div>
        <div class="text ph" v-else>
          <span class="label" v-if="props.inLabel"> {{ props.label }}: </span>

          {{ props.placeholder }}
        </div>
      </template>
      <template v-else>
        <div class="text" v-if="getShowText.length > 0">
          <span class="label" v-if="props.inLabel"> {{ props.label }}: </span>

          {{ getShowText[0] }}
        </div>
        <div class="text ph" v-else>
          <span class="label" v-if="props.inLabel"> {{ props.label }}: </span>

          {{ props.placeholder }}
        </div>
      </template>

      <a href="#" class="btn-clear" @click.stop.prevent="clearValue" v-if="clearButtonShow">
        <Icon icon="mdi:close-circle" :width="20" :height="20" />
      </a>

      <Icon
        :class="['arrow', { rotate: isShowOption }]"
        icon="mdi:chevron-down"
        :width="20"
        :height="20"
      />

      <Transition
        :name="showBottom ? 'options-view-bottom' : 'options-view'"
        @leave="[onBlur(), props.blurValidate && check()]"
        @enter="transitionStatus = true"
        @after-enter="transitionStatus = false"
      >
        <div
          :style="layerPositionStyle"
          :class="['option-list', showBottom ? 'show-bottom' : 'show-top']"
          v-show="isShowOption"
        >
          <div class="search" @click.stop v-if="props.searchable">
            <div class="search-wrap">
              <input
                ref="SearchInput"
                placeholder="검색어 입력"
                type="text"
                @keydown.up.prevent="onKeyDownHandler"
                @keydown.down.prevent="onKeyDownHandler"
                @keydown.enter.prevent="onKeyDownHandler"
                @keydown.stop="searchTextHandler"
              />
              <Icon icon="mdi:magnify" :width="28" :heigh="28" />
            </div>
          </div>
          <ul ref="OptionList" class="scrollbar">
            <li
              :class="['option-item', selectedKeyIndex === 0 && !isSearchFilter && 'key-selected']"
              @click.stop="selectAll"
              v-if="props.multiple && !props.maxLength && !isSearchFilter"
            >
              <Icon
                :class="['checkbox', isSelectAll && 'checked']"
                :icon="isSelectAll ? 'mdi:checkbox-marked' : 'mdi:checkbox-blank-outline'"
                :width="20"
                :height="20"
              />
              {{ isSelectAll ? '전체 해제' : '전체 선택' }}
            </li>
            <template v-if="optionList.length">
              <li
                :key="`select-${item.value}`"
                :class="[
                  'option-item',
                  { selected: isOptionSelected(item.value), 'key-selected': isOptionFocused(i) },
                ]"
                @click.stop="selectOption(item.value)"
                v-for="(item, i) in optionList"
              >
                <template v-if="props.multiple">
                  <Icon
                    class="checkbox"
                    :icon="
                      isOptionSelected(item.value)
                        ? 'mdi:checkbox-marked'
                        : 'mdi:checkbox-blank-outline'
                    "
                    :width="20"
                    :height="20"
                  />
                </template>
                {{ item.text }}
              </li>
            </template>
            <template v-else>
              <li @click.stop>검색된 내용이 없습니다.</li>
            </template>
            <li class="items-loading" v-if="props.isLoading">
              <Icon icon="mdi:google-circles-extended" :width="24" :height="24" />
            </li>
          </ul>
          <a href="#" class="btn-accept" @click.stop.prevent="accept" v-if="props.btnAccept">
            적용 + {{ selectedValue.length }}
          </a>
        </div>
      </Transition>
    </div>

    <div :class="['feedback', { error: errorTransition }]" v-show="message && !props.hideMessage">
      {{ message }}
    </div>
  </div>
</template>

<script lang="ts">
export default { name: 'SelectBox' };
</script>

<style scoped lang="scss">
@use './style';
</style>
