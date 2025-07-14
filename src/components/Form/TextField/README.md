# TextField 컴포넌트

Vue 3 + TypeScript로 개발된 텍스트 입력 컴포넌트입니다. 기본 입력, 유효성 검사, 아이콘, textarea 등 다양한 기능을 지원합니다.

## 주요 기능

- ✅ 기본 텍스트 입력 (input, textarea)
- ✅ 유효성 검사 (validate 함수, pattern)
- ✅ 아이콘 지원 (왼쪽/오른쪽 위치)
- ✅ 글자 수 카운팅
- ✅ 클리어 버튼
- ✅ 에러 메시지 표시
- ✅ 자동 포커스
- ✅ 비활성화/읽기 전용 모드
- ✅ 반응형 디자인

## Props

| Prop           | Type                   | Default     | Description               |
| -------------- | ---------------------- | ----------- | ------------------------- |
| `modelValue`   | `string`               | `''`        | 입력값 (v-model)          |
| `type`         | `'text' \| 'password'` | `'text'`    | 입력 타입                 |
| `placeholder`  | `string`               | `''`        | 플레이스홀더 텍스트       |
| `label`        | `string`               | `''`        | 라벨 텍스트               |
| `required`     | `boolean`              | `false`     | 필수 입력 여부            |
| `disabled`     | `boolean`              | `false`     | 비활성화 여부             |
| `readonly`     | `boolean`              | `false`     | 읽기 전용 여부            |
| `multiline`    | `boolean`              | `false`     | textarea 모드 여부        |
| `rows`         | `number`               | `5`         | textarea 행 수            |
| `height`       | `string`               | `''`        | textarea 높이             |
| `width`        | `string`               | `''`        | 입력 필드 너비            |
| `block`        | `boolean`              | `false`     | 전체 너비 사용 여부       |
| `icon`         | `string`               | `''`        | 아이콘 이름               |
| `iconLeft`     | `boolean`              | `false`     | 아이콘을 왼쪽에 배치      |
| `iconAction`   | `Function`             | `undefined` | 아이콘 클릭 이벤트        |
| `clearable`    | `boolean`              | `false`     | 클리어 버튼 표시 여부     |
| `isCounting`   | `boolean`              | `false`     | 글자 수 카운팅 여부       |
| `maxLength`    | `number`               | `0`         | 최대 글자 수              |
| `autofocus`    | `boolean`              | `false`     | 자동 포커스 여부          |
| `validate`     | `RuleFunc[]`           | `[]`        | 유효성 검사 함수 배열     |
| `pattern`      | `[RegExp, string]`     | `undefined` | 정규식 패턴과 에러 메시지 |
| `blurValidate` | `boolean`              | `true`      | blur 시 유효성 검사 여부  |
| `errorMessage` | `string`               | `''`        | 에러 메시지               |
| `hideMessage`  | `boolean`              | `false`     | 에러 메시지 숨김 여부     |

## Events

| Event               | Parameters        | Description         |
| ------------------- | ----------------- | ------------------- |
| `update:modelValue` | `(value: string)` | 입력값 변경 시 발생 |
| `blur`              | `(event: Event)`  | 포커스 아웃 시 발생 |

## Expose Methods

| Method          | Parameters            | Return    | Description             |
| --------------- | --------------------- | --------- | ----------------------- |
| `check`         | `(silence?: boolean)` | `boolean` | 유효성 검사 실행        |
| `resetForm`     | -                     | `void`    | 폼 초기화               |
| `resetValidate` | -                     | `void`    | 유효성 검사 상태 초기화 |

## 사용 예제

### 기본 입력

```vue
<template>
  <TextField v-model="text" placeholder="기본 텍스트 입력" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TextField from './index.vue';

const text = ref('');
</script>
```

### 유효성 검사

```vue
<template>
  <TextField v-model="email" :validate="[validateEmail]" placeholder="이메일 입력" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TextField from './index.vue';
import type { RuleFunc } from '@/components/types';

const email = ref('');

const validateEmail: RuleFunc = value => {
  if (typeof value !== 'string') return '문자열을 입력해주세요.';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return '올바른 이메일 형식을 입력해주세요.';
  }
  return true;
};
</script>
```

### 아이콘과 클리어 버튼

```vue
<template>
  <TextField
    v-model="searchText"
    icon="mdi:magnify"
    :iconAction="handleSearch"
    placeholder="검색어 입력"
    clearable
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TextField from './index.vue';

const searchText = ref('');

const handleSearch = () => {
  console.log('검색:', searchText.value);
};
</script>
```

### Textarea

```vue
<template>
  <TextField
    v-model="content"
    :multiline="true"
    :rows="4"
    placeholder="여러 줄 텍스트 입력"
    label="메모"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TextField from './index.vue';

const content = ref('');
</script>
```

### 글자 수 카운팅

```vue
<template>
  <TextField
    v-model="description"
    :isCounting="true"
    :maxLength="100"
    placeholder="최대 100자까지 입력"
    label="소개글"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TextField from './index.vue';

const description = ref('');
</script>
```

### 패턴 검사

```vue
<template>
  <TextField
    v-model="phoneNumber"
    :pattern="[phonePattern, '올바른 전화번호 형식을 입력해주세요.']"
    placeholder="전화번호 입력 (000-0000-0000)"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TextField from './index.vue';

const phoneNumber = ref('');
const phonePattern = /^\d{3}-\d{4}-\d{4}$/;
</script>
```

## 스타일 커스터마이징

컴포넌트는 SCSS로 작성되어 있으며, CSS 변수를 통해 테마를 커스터마이징할 수 있습니다.

```scss
// 주요 CSS 변수
:root {
  --textfield-border-color: #e9ecef;
  --textfield-focus-color: #667eea;
  --textfield-error-color: #dc3545;
  --textfield-text-color: #333;
  --textfield-placeholder-color: #6c757d;
}
```

## 접근성

- ARIA 라벨 지원
- 키보드 네비게이션 지원
- 스크린 리더 호환성
- 포커스 표시기 제공

## 브라우저 지원

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+
