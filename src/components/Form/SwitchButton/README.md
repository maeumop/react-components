# SwitchButton 스위치 버튼 컴포넌트

## 개요

SwitchButton 컴포넌트는 토글 스위치 또는 체크박스 형태로 사용할 수 있는 UI 컴포넌트입니다. 다양한 색상, 라벨, 유효성 검사, 접근성, 폼 연동 기능을 제공합니다.

## 주요 변경점 및 개선사항

- 타입 정의 파일(`types.d.ts`) 분리 및 엄격한 타입 적용
- 색상 옵션 상수화(`const.ts`)
- 체크박스/스위치 모드 지원(`checkbox` prop)
- 접근성 개선(고유 id, ARIA 속성, 키보드 내비게이션)
- 유효성 검사 및 메시지 표시 기능 강화
- `@iconify/vue` 기반 아이콘 사용
- 스타일 SCSS 분리 및 BEM 구조 적용
- **스타일 적용 문제 해결** (`@import` 사용)
- **modelValue watch 로직 개선** (무한 루프 방지)
- **예제 페이지 디자인 통일성 개선**
- **사이즈 옵션 제거**: `small` prop 제거하고 기본 사이즈로 통일
- **폰트 크기 조정**: 다른 컴포넌트들과 일치하는 `0.875rem` 적용

## Props

| 이름       | 타입                                                                                | 필수 | 기본값            | 설명                      |
| ---------- | ----------------------------------------------------------------------------------- | ---- | ----------------- | ------------------------- |
| modelValue | `string \| boolean`                                                                 | ●    |                   | 현재 값 (v-model)         |
| label      | `string[]`                                                                          |      | ['미설정','설정'] | [false, true] 상태별 라벨 |
| trueValue  | `string \| boolean`                                                                 |      | true              | true 상태 값              |
| falseValue | `string \| boolean`                                                                 |      | false             | false 상태 값             |
| readonly   | `boolean`                                                                           |      | false             | 읽기 전용                 |
| checkbox   | `boolean`                                                                           |      | false             | 체크박스 스타일 사용      |
| color      | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info' \| 'dark'` |      | 'primary'         | 색상 테마                 |
| disabled   | `boolean`                                                                           |      | false             | 비활성화                  |
| validate   | `string \| (value) => boolean \| string`                                            |      |                   | 유효성 검사 함수/메시지   |

## Emits

| 이벤트명          | payload           | 설명                      |
| ----------------- | ----------------- | ------------------------- |
| update:modelValue | string \| boolean | 값 변경 시                |
| update:after      | -                 | 값 변경 후(nextTick) 호출 |

## Expose

| 메서드명      | 설명                 |
| ------------- | -------------------- |
| check         | 유효성 검사 실행     |
| resetForm     | 값 및 유효성 초기화  |
| resetValidate | 유효성 메시지 초기화 |

## Slots

- 지원하지 않음

## 사용 예시

```vue
<template>
  <SwitchButton
    v-model="value"
    :label="['OFF', 'ON']"
    color="secondary"
    :checkbox="true"
    :validate="validateFn"
    :disabled="isDisabled"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SwitchButton from './index.vue';

const value = ref(false);
const isDisabled = ref(false);
const validateFn = (val: unknown) => {
  if (val !== true) return 'ON 상태를 선택하세요.';
  return true;
};
</script>
```

## 접근성

- 고유 id, ARIA 속성, role="switch" 적용
- 키보드 내비게이션 지원

## 스타일 커스터마이즈

- SCSS(BEM) 구조, 색상 테마 확장 가능
- `@/components/Form/SwitchButton/style.scss` 참고

## 기타

- `@iconify/vue` 아이콘 사용
- 폼 유효성 검사 연동 지원
- 자세한 사용법은 예제(ex.vue) 참고

## 최근 개선사항

- **스타일 적용 문제 해결**: `@use` → `@import` 변경으로 스타일 정상 적용
- **로직 개선**: modelValue watch에서 무한 루프 방지 로직 추가
- **예제 페이지 개선**: 기존 컴포넌트들과 동일한 레이아웃/디자인 적용
- **사이즈 옵션 제거**: `small` prop을 제거하고 기본 사이즈로 통일하여 일관성 향상
- **폰트 크기 통일**: 다른 폼 컴포넌트들과 동일한 `0.875rem` 폰트 크기 적용
- **컴팩트한 디자인**: 스위치 크기를 `3rem × 1.5rem`으로 조정하여 더욱 깔끔한 UI 제공
