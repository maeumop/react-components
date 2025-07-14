# CheckButton Component

체크박스와 라디오 버튼을 지원하는 폼 컴포넌트입니다. 다양한 UI 모드와 검증 기능을 제공합니다.

## 📋 목차

- [설치](#설치)
- [기본 사용법](#기본-사용법)
- [Props](#props)
- [Events](#events)
- [Methods](#methods)
- [예제](#예제)

## 🚀 설치

### 1. Iconify 설치 (필수)

```bash
npm install @iconify/vue
```

### 2. 전역 등록

```typescript
import CheckButton from '@/components/Form/CheckButton';

app.component('CheckButton', CheckButton);
```

## 💡 기본 사용법

### 체크박스 기본 사용법

```vue
<template>
  <CheckButton v-model="selectedItems" :items="checkboxItems" name="interests" label="관심사" />
</template>

<script setup>
import { ref } from 'vue';

const selectedItems = ref([]);
const checkboxItems = [
  { text: '운동', value: 'sports' },
  { text: '독서', value: 'reading' },
  { text: '음악', value: 'music' },
  { text: '여행', value: 'travel' },
];
</script>
```

### 라디오 버튼 기본 사용법

```vue
<template>
  <CheckButton
    v-model="selectedGender"
    :items="genderItems"
    name="gender"
    type="radio"
    label="성별"
  />
</template>

<script setup>
import { ref } from 'vue';

const selectedGender = ref('');
const genderItems = [
  { text: '남성', value: 'male' },
  { text: '여성', value: 'female' },
  { text: '기타', value: 'other' },
];
</script>
```

## 📝 Props

| Prop           | Type                 | Default      | Description                          |
| -------------- | -------------------- | ------------ | ------------------------------------ |
| `items`        | `CheckButtonItem[]`  | `[]`         | 선택 가능한 아이템 목록              |
| `name`         | `string`             | -            | 폼 필드 이름 (필수)                  |
| `modelValue`   | `string \| string[]` | -            | 선택된 값 (v-model)                  |
| `type`         | `CheckButtonType`    | `'checkbox'` | 체크박스 또는 라디오 버튼 타입       |
| `maxLength`    | `number`             | `0`          | 최대 체크 가능한 수량 (체크박스만)   |
| `validate`     | `RuleFunc[]`         | `[]`         | 유효성 검사 함수 배열                |
| `errorMessage` | `string`             | -            | 강제 에러 메시지                     |
| `button`       | `boolean`            | `false`      | 버튼 UI 모드 사용 여부               |
| `block`        | `boolean`            | `false`      | 전체 너비 사용 여부                  |
| `color`        | `CheckButtonColor`   | `'primary'`  | 색상 테마                            |
| `disabled`     | `boolean`            | `false`      | 비활성화 여부                        |
| `label`        | `string`             | -            | 라벨 텍스트                          |
| `required`     | `boolean`            | `false`      | 필수 입력 여부                       |
| `lineLimit`    | `number`             | `0`          | 라인 제한 (한 줄에 표시할 아이템 수) |
| `all`          | `boolean`            | `false`      | 전체 선택 버튼 추가 여부             |

### CheckButtonType

```typescript
type CheckButtonType = 'checkbox' | 'radio';
```

### CheckButtonColor

```typescript
type CheckButtonColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'light'
  | 'dark';
```

### CheckButtonItem

```typescript
interface CheckButtonItem {
  text: string;
  value: string;
}
```

## Events

| Event               | Payload                       | Description                    |
| ------------------- | ----------------------------- | ------------------------------ |
| `update:modelValue` | `(value: string \| string[])` | 선택된 값이 변경될 때 발생     |
| `update:clickIndex` | `(index: number)`             | 클릭된 인덱스가 변경될 때 발생 |
| `update:after`      | -                             | 값 업데이트 후 발생            |

## Methods

컴포넌트에서 노출되는 메서드들입니다.

### check(silence?: boolean): boolean

유효성 검사를 실행합니다.

```typescript
const checkButtonRef = ref();

// 유효성 검사 실행
const isValid = checkButtonRef.value.check();

// 조용한 유효성 검사 (에러 메시지 표시하지 않음)
const isValidSilent = checkButtonRef.value.check(true);
```

### resetForm(): void

폼을 초기화합니다.

```typescript
const checkButtonRef = ref();

// 폼 초기화
checkButtonRef.value.resetForm();
```

### resetValidate(): void

유효성 검사 상태를 초기화합니다.

```typescript
const checkButtonRef = ref();

// 유효성 검사 상태 초기화
checkButtonRef.value.resetValidate();
```

## 🎨 예제

### 기본 체크박스

```vue
<template>
  <CheckButton v-model="selectedHobbies" :items="hobbyItems" name="hobbies" label="취미" />
</template>

<script setup>
import { ref } from 'vue';

const selectedHobbies = ref([]);
const hobbyItems = [
  { text: '독서', value: 'reading' },
  { text: '운동', value: 'sports' },
  { text: '음악 감상', value: 'music' },
  { text: '요리', value: 'cooking' },
];
</script>
```

### 라디오 버튼

```vue
<template>
  <CheckButton
    v-model="selectedSize"
    :items="sizeItems"
    name="size"
    type="radio"
    label="사이즈"
    required
  />
</template>

<script setup>
import { ref } from 'vue';

const selectedSize = ref('');
const sizeItems = [
  { text: 'S', value: 'small' },
  { text: 'M', value: 'medium' },
  { text: 'L', value: 'large' },
  { text: 'XL', value: 'xlarge' },
];
</script>
```

### 버튼 UI 모드

```vue
<template>
  <CheckButton
    v-model="selectedOptions"
    :items="optionItems"
    name="options"
    button
    color="success"
    label="옵션 선택"
  />
</template>

<script setup>
import { ref } from 'vue';

const selectedOptions = ref([]);
const optionItems = [
  { text: '옵션 1', value: 'option1' },
  { text: '옵션 2', value: 'option2' },
  { text: '옵션 3', value: 'option3' },
];
</script>
```

### 다양한 색상

```vue
<template>
  <div class="color-examples">
    <CheckButton
      v-model="selected1"
      :items="items"
      name="primary"
      color="primary"
      label="Primary"
    />

    <CheckButton
      v-model="selected2"
      :items="items"
      name="success"
      color="success"
      label="Success"
    />

    <CheckButton
      v-model="selected3"
      :items="items"
      name="warning"
      color="warning"
      label="Warning"
    />

    <CheckButton v-model="selected4" :items="items" name="error" color="error" label="Error" />
  </div>
</template>
```

### 최대 선택 제한

```vue
<template>
  <CheckButton
    v-model="selectedItems"
    :items="items"
    name="limited"
    :maxLength="2"
    label="최대 2개 선택"
  />
</template>

<script setup>
import { ref } from 'vue';

const selectedItems = ref([]);
const items = [
  { text: '항목 1', value: 'item1' },
  { text: '항목 2', value: 'item2' },
  { text: '항목 3', value: 'item3' },
  { text: '항목 4', value: 'item4' },
];
</script>
```

### 전체 선택 기능

```vue
<template>
  <CheckButton v-model="selectedItems" :items="items" name="all" all label="전체 선택 포함" />
</template>

<script setup>
import { ref } from 'vue';

const selectedItems = ref([]);
const items = [
  { text: '항목 1', value: 'item1' },
  { text: '항목 2', value: 'item2' },
  { text: '항목 3', value: 'item3' },
];
</script>
```

### 유효성 검사

```vue
<template>
  <CheckButton
    ref="checkButtonRef"
    v-model="selectedItems"
    :items="items"
    name="validated"
    :validate="validators"
    label="유효성 검사"
    required
  />

  <button @click="validate">검증 실행</button>
</template>

<script setup>
import { ref } from 'vue';

const checkButtonRef = ref();
const selectedItems = ref([]);
const items = [
  { text: '항목 1', value: 'item1' },
  { text: '항목 2', value: 'item2' },
  { text: '항목 3', value: 'item3' },
];

const validators = [
  value => {
    if (Array.isArray(value) && value.length === 0) {
      return '최소 1개 이상 선택해주세요.';
    }
    return true;
  },
  value => {
    if (Array.isArray(value) && value.length > 2) {
      return '최대 2개까지만 선택 가능합니다.';
    }
    return true;
  },
];

const validate = () => {
  const isValid = checkButtonRef.value.check();
  console.log('유효성 검사 결과:', isValid);
};
</script>
```

### 라인 제한

```vue
<template>
  <CheckButton
    v-model="selectedItems"
    :items="items"
    name="lineLimit"
    :lineLimit="3"
    label="라인 제한 (3개씩)"
  />
</template>

<script setup>
import { ref } from 'vue';

const selectedItems = ref([]);
const items = [
  { text: '항목 1', value: 'item1' },
  { text: '항목 2', value: 'item2' },
  { text: '항목 3', value: 'item3' },
  { text: '항목 4', value: 'item4' },
  { text: '항목 5', value: 'item5' },
  { text: '항목 6', value: 'item6' },
];
</script>
```

## ♿ 접근성

- **키보드 네비게이션**: Tab 키로 포커스 이동, Space/Enter로 선택
- **스크린 리더 지원**: 적절한 ARIA 속성과 라벨 연결
- **시각적 피드백**: 선택 상태와 비활성화 상태의 명확한 구분
- **포커스 표시**: 키보드 포커스 시 시각적 표시

## 🔧 기술적 세부사항

### 아이콘 시스템

컴포넌트는 Iconify를 사용하여 Material Design Icons를 표시합니다:

- **라디오 버튼**: `mdi:radiobox-marked`, `mdi:radiobox-blank`, `mdi:circle`
- **체크박스**: `mdi:checkbox-marked`, `mdi:checkbox-blank-outline`, `mdi:checkbox-blank`

### 성능 최적화

- **Computed 속성**: 아이템 처리 로직 최적화
- **조건부 렌더링**: 필요한 경우에만 렌더링
- **이벤트 최적화**: 불필요한 리렌더링 방지

### 색상 시스템

컴포넌트는 공통 색상 시스템을 상속받아 일관된 디자인을 제공합니다.

---

**업데이트 히스토리**

- 2024.01: 아이콘 시스템 개선, 성능 최적화, 타입 안전성 강화
- 2023.05: 최대 선택 제한, 전체 선택 기능 추가
- 2023.04: 최초 작성
