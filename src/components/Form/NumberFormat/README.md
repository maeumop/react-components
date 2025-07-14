# NumberFormat Component

숫자 입력 필드에 천단위 콤마(,)를 자동으로 포맷팅하는 Vue 3 컴포넌트입니다.

## 주요 기능

- **자동 천단위 콤마 포맷팅**: 입력 시 실시간으로 천단위 콤마 추가
- **음수 지원**: 음수 입력 및 표시 지원
- **유효성 검사**: 커스텀 유효성 검사 함수 지원
- **접근성**: 라벨, 필수 표시, 키보드 네비게이션 지원
- **상태 관리**: disabled, readonly 상태 지원

## 사용 방법

### 기본 사용법

```vue
<script setup lang="ts">
import { ref } from 'vue';
import NumberFormat from '@/components/Form/NumberFormat/index.vue';

const price = ref<number>(0);
</script>

<template>
  <NumberFormat v-model="price" placeholder="가격 입력" />
</template>
```

### 라벨과 필수 표시

```vue
<template>
  <NumberFormat v-model="price" label="가격" placeholder="가격을 입력하세요" required block />
</template>
```

### 유효성 검사

```vue
<script setup lang="ts">
import { ref } from 'vue';
import NumberFormat from '@/components/Form/NumberFormat/index.vue';

const amount = ref<number>(0);

const validateRequired = (value: unknown): string | boolean => {
  if (typeof value !== 'number' || value === 0) {
    return '필수 입력 항목입니다.';
  }
  return true;
};

const validateRange = (value: unknown): string | boolean => {
  if (typeof value !== 'number') {
    return '숫자를 입력해주세요.';
  }
  if (value < 1000 || value > 1000000) {
    return '1,000 ~ 1,000,000 사이의 값을 입력해주세요.';
  }
  return true;
};
</script>

<template>
  <NumberFormat
    v-model="amount"
    :validate="[validateRequired, validateRange]"
    placeholder="1,000 ~ 1,000,000"
    required
    block
  />
</template>
```

## Props

| Name         | Type             | Default | Description                    |
| ------------ | ---------------- | ------- | ------------------------------ |
| modelValue   | number \| string | -       | **필수** - 컴포넌트의 값       |
| label        | string           | ''      | 입력 필드 위에 표시할 라벨     |
| placeholder  | string           | ''      | 입력 필드의 placeholder 텍스트 |
| validate     | RuleFunc[]       | []      | 유효성 검사 함수 배열          |
| errorMessage | string           | ''      | 강제로 표시할 에러 메시지      |
| disabled     | boolean          | false   | 입력 필드 비활성화             |
| block        | boolean          | false   | display: block으로 표시        |
| width        | string           | -       | 컴포넌트의 너비                |
| autofocus    | boolean          | false   | 페이지 로드 시 자동 포커스     |
| maxLength    | string \| number | ''      | 최대 입력 길이                 |
| readonly     | boolean          | false   | 읽기 전용 모드                 |
| required     | boolean          | false   | 필수 입력 표시 (\*)            |
| hideMessage  | boolean          | false   | 에러 메시지 숨김               |

## Events

| Name              | Parameters          | Description                           |
| ----------------- | ------------------- | ------------------------------------- |
| update:modelValue | (value: number)     | 값이 변경될 때 발생                   |
| blur              | (event: FocusEvent) | 입력 필드에서 포커스가 벗어날 때 발생 |
| focus             | (event: FocusEvent) | 입력 필드에 포커스가 들어올 때 발생   |

## Exposed Methods

| Name          | Parameters          | Return  | Description                 |
| ------------- | ------------------- | ------- | --------------------------- |
| check         | (silence?: boolean) | boolean | 유효성 검사 실행            |
| resetForm     | ()                  | void    | 폼 초기화 (값을 0으로 설정) |
| resetValidate | ()                  | void    | 유효성 검사 상태 초기화     |

## 스타일링

컴포넌트는 다음과 같은 CSS 클래스를 제공합니다:

- `.input-wrap`: 메인 컨테이너
- `.input-wrap.with-label`: 라벨이 있는 경우
- `.input-wrap.block`: block 표시 모드
- `.options-wrap`: 라벨과 추가 옵션을 감싸는 컨테이너
- `.input-label`: 라벨 스타일
- `.required`: 필수 표시 (\*) 스타일
- `input.error`: 에러 상태의 입력 필드
- `.feedback`: 에러 메시지 컨테이너
- `.feedback.error`: 에러 메시지 표시 상태

## 특징

### 자동 포맷팅

- 입력 시 실시간으로 천단위 콤마 추가
- 음수 입력 지원
- 빈 값일 때 0으로 자동 설정

### 포커스/블러 처리

- 포커스 시 값이 0이면 빈 값으로 변경
- 블러 시 빈 값이면 0으로 설정

### 유효성 검사

- 커스텀 유효성 검사 함수 지원
- 에러 메시지 표시
- 애니메이션 효과

### 접근성

- 라벨과 입력 필드 연결
- 키보드 네비게이션 지원
- 스크린 리더 호환

## 예제

더 많은 사용 예제는 [예제 페이지](./ex.vue)를 참조하세요.

## 주의사항

1. **숫자만 입력 가능**: 숫자와 하이픈(-)만 입력 가능
2. **소수점 미지원**: 현재 버전에서는 정수만 지원
3. **최대값 제한**: JavaScript Number 타입의 제한을 따름

## 변경 이력

### v1.0.0

- 초기 버전 릴리즈
- 기본 천단위 콤마 포맷팅
- 유효성 검사 시스템
- 접근성 기능

:arrow_up: [Form Components 목차](../README.md)
