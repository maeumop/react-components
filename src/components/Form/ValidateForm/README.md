# ValidateForm

Vue 3 + TypeScript로 개발된 폼 유효성 검사 컨테이너 컴포넌트입니다. 하위 컴포넌트들의 유효성 검사를 중앙에서 관리하고, 전체 폼의 검증 상태를 제어할 수 있습니다.

## 주요 기능

- **중앙 집중식 관리**: 모든 하위 컴포넌트의 유효성 검사를 한 번에 처리
- **Provide/Inject 패턴**: `addComponent` 함수를 통한 컴포넌트 등록
- **스마트 스크롤**: 검증 실패 시 첫 번째 에러 요소로 자동 스크롤
- **폼 보호 기능**: 중복 제출 방지 및 시각적 피드백 제공
- **TypeScript 지원**: 완전한 타입 안전성 보장
- **성능 최적화**: 배열 기반 컴포넌트 관리로 효율적인 검증 처리

## 기본 사용법

```vue
<template>
  <ValidateForm ref="validateFormRef">
    <TextField v-model="email" :validate="[requiredRule, emailRule]" label="이메일" required />
    <TextField
      v-model="password"
      type="password"
      :validate="[requiredRule, minLengthRule(8)]"
      label="비밀번호"
      required
    />
  </ValidateForm>

  <button @click="validateForm">검증</button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ValidateForm from './index.vue';
import TextField from '../TextField/index.vue';
import type { RuleFunc } from '../../types';

const email = ref('');
const password = ref('');
const validateFormRef = ref();

const requiredRule: RuleFunc = (value: unknown): boolean | string => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return '필수 입력 항목입니다.';
  }
  return true;
};

const emailRule: RuleFunc = (value: unknown): boolean | string => {
  if (typeof value === 'string' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return '올바른 이메일 형식이 아닙니다.';
    }
  }
  return true;
};

const minLengthRule = (min: number): RuleFunc => {
  return (value: unknown): boolean | string => {
    if (typeof value === 'string' && value.length < min) {
      return `최소 ${min}자 이상 입력해주세요.`;
    }
    return true;
  };
};

const validateForm = (): void => {
  const isValid = validateFormRef.value?.validate();

  if (isValid) {
    console.log('검증 성공!');
  } else {
    console.log('검증 실패!');
  }
};
</script>
```

## Props

ValidateForm은 현재 Props를 받지 않습니다. 모든 설정은 메서드를 통해 제어됩니다.

## Events

ValidateForm은 현재 Events를 발생시키지 않습니다. 상태 관리는 ref를 통한 메서드 호출로 처리됩니다.

## Slots

### default

폼 내부에 배치할 컴포넌트들을 포함합니다.

```vue
<ValidateForm>
  <!-- 폼 컴포넌트들 -->
  <TextField v-model="email" label="이메일" />
  <SelectBox v-model="department" :options="options" label="부서" />
</ValidateForm>
```

## 메서드

### validate(silence?: boolean): boolean

전체 폼의 유효성을 검사합니다.

**매개변수:**

- `silence`: 에러 메시지 표시 여부 (기본값: false)

**반환값:**

- `true`: 모든 검증을 통과한 경우
- `false`: 하나라도 검증에 실패한 경우

**동작:**

1. 등록된 모든 컴포넌트의 유효성 검사 실행
2. 첫 번째 에러가 발생한 요소로 자동 스크롤
3. 검증 결과 반환

```typescript
// 일반 검증 (에러 메시지 표시)
const isValid = validateFormRef.value?.validate();

// 조용한 검증 (에러 메시지 숨김)
const isValid = validateFormRef.value?.validate(true);
```

### resetForm(): void

폼에 등록된 모든 컴포넌트의 값을 리셋하고 유효성 검사를 초기화합니다.

```typescript
validateFormRef.value?.resetForm();
```

### resetValidate(): void

폼에 등록된 모든 컴포넌트의 유효성 검사 상태만 초기화하고 데이터는 유지합니다.

```typescript
validateFormRef.value?.resetValidate();
```

### formProtection(protect?: boolean): void

폼 보호 기능을 활성화/비활성화합니다.

**매개변수:**

- `protect`: 보호 상태 (기본값: true, true: 보호 활성화, false: 보호 비활성화)

**동작:**

- 보호 활성화 시: 모든 입력 필드 비활성화, 시각적 피드백 제공
- 보호 비활성화 시: 모든 입력 필드 활성화

```typescript
// 폼 보호 활성화
validateFormRef.value?.formProtection(true);

// 폼 보호 비활성화
validateFormRef.value?.formProtection(false);

// 기본값으로 보호 활성화
validateFormRef.value?.formProtection();
```

## 하위 컴포넌트 등록

ValidateForm은 Provide/Inject 패턴을 통해 하위 컴포넌트를 등록합니다. `addComponent` 함수를 inject하여 사용할 수 있습니다:

```vue
<script setup lang="ts">
import { inject, getCurrentInstance, onMounted } from 'vue';
import { VALIDATE_FORM_KEY } from './const';

// ValidateForm에서 제공하는 addComponent 함수를 inject
const { addComponent } = inject(VALIDATE_FORM_KEY) ?? {};
const instance = getCurrentInstance();

// 컴포넌트가 마운트되면 ValidateForm에 등록
onMounted(() => {
  if (addComponent && instance) {
    addComponent(instance.vnode);
  }
});
</script>
```

**장점:**

- 컴포넌트 등록 시점을 정확히 제어할 수 있습니다
- 조건부 등록이 가능합니다
- 커스텀 로직을 추가할 수 있습니다
- 타입 안전성이 보장됩니다

**주의사항:**

- `getCurrentInstance()`는 개발 모드에서만 안정적으로 작동합니다
- 컴포넌트가 ValidateForm 내부에 있어야 합니다
- nullish coalescing operator (`??`) 사용을 권장합니다

## 지원하는 컴포넌트

ValidateForm은 다음 Form 컴포넌트들과 호환됩니다:

- **TextField**: 텍스트 입력 필드
- **SelectBox**: 선택 박스
- **NumberFormat**: 숫자 포맷팅 입력 필드
- **SwitchButton**: 스위치 버튼
- **DatePicker**: 날짜 선택기
- **ValidateWrap**: 커스텀 검증 래퍼

## 내부 구조

### 컴포넌트 관리 방식

ValidateForm은 배열 기반으로 컴포넌트를 관리하여 성능을 최적화했습니다:

- **정적 배열**: `formValidItems` 배열에 등록된 컴포넌트들을 저장
- **자동 정리**: 언마운트된 컴포넌트는 자동으로 배열에서 제거
- **효율적 검증**: 등록된 컴포넌트들만 순회하여 검증 수행

### 상수 및 타입

```typescript
// const.ts
export const validateExplorKey = {
  resetForm: 'resetForm',
  resetValidate: 'resetValidate',
  validate: 'validate',
} as const;

export const VALIDATE_FORM_KEY = Symbol('validateForm') as InjectionKey<ValidateFormInjection>;

// types.d.ts
export interface ValidateFormInjection {
  addComponent: (node: VNode) => void;
}

export type ValidateExplorKey = (typeof validateExplorKey)[keyof typeof validateExplorKey];
```

## 고급 사용 예제

### 커스텀 검증 규칙

```typescript
// 비밀번호 확인 검증
const confirmPasswordRule: RuleFunc = (value: unknown): boolean | string => {
  if (typeof value === 'string' && value !== password.value) {
    return '비밀번호가 일치하지 않습니다.';
  }
  return true;
};

// 숫자 범위 검증
const numberRangeRule = (min: number, max: number): RuleFunc => {
  return (value: unknown): boolean | string => {
    if (typeof value === 'string' && value) {
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < min || numValue > max) {
        return `${min}-${max} 사이의 숫자를 입력해주세요.`;
      }
    }
    return true;
  };
};
```

### 폼 보호 기능 활용

```vue
<template>
  <ValidateForm ref="validateFormRef">
    <!-- 폼 컴포넌트들 -->
  </ValidateForm>

  <button @click="submitForm" :disabled="isSubmitting">
    {{ isSubmitting ? '제출 중...' : '제출' }}
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isSubmitting = ref(false);
const validateFormRef = ref();

const submitForm = async (): Promise<void> => {
  const isValid = validateFormRef.value?.validate();

  if (!isValid) {
    return;
  }

  isSubmitting.value = true;
  validateFormRef.value?.formProtection(true);

  try {
    // API 호출
    await submitData();
    alert('제출 성공!');
  } catch (error) {
    console.error('제출 실패:', error);
  } finally {
    isSubmitting.value = false;
    validateFormRef.value?.formProtection(false);
  }
};
</script>
```

### ValidateWrap과 함께 사용

```vue
<template>
  <ValidateForm ref="validateFormRef">
    <ValidateWrap :check-value="customValue" :error-message="customError" label="커스텀 검증">
      <template #default="{ onBlur }">
        <input v-model="customValue" type="text" @blur="onBlur" />
      </template>
    </ValidateWrap>
  </ValidateForm>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const customValue = ref('');
const customError = ref('');

// 커스텀 에러 설정
const setCustomError = (): void => {
  customError.value = '사용자 정의 에러 메시지입니다.';
};
</script>
```

## 성능 고려사항

- **메모리 관리**: 언마운트된 컴포넌트는 자동으로 배열에서 제거됩니다
- **검증 최적화**: 등록된 컴포넌트만 순회하여 검증하여 불필요한 연산을 방지합니다
- **스크롤 최적화**: 첫 번째 에러 요소만 찾아 스크롤하여 성능을 개선합니다
- **배열 기반 관리**: 정적 배열을 사용하여 반응형 오버헤드를 줄입니다

## 주의사항

1. **하위 컴포넌트 등록**: 모든 하위 컴포넌트는 `addComponent` 함수를 inject하여 등록해야 합니다.

2. **ref 사용**: ValidateForm의 메서드를 호출하려면 ref를 통해 접근해야 합니다.

3. **검증 규칙**: 검증 규칙은 `RuleFunc` 타입을 따라야 하며, `true` 또는 에러 메시지 문자열을 반환해야 합니다.

4. **폼 보호**: 폼 보호 기능 사용 시 모든 입력 필드가 비활성화되므로, 적절한 시점에 해제해야 합니다.

5. **getCurrentInstance 사용**: `getCurrentInstance()`는 개발 모드에서만 안정적으로 작동하므로 주의가 필요합니다.

## 타입 정의

```typescript
// ValidateForm 인스턴스 타입
interface ValidateFormModel {
  validate(silence?: boolean): boolean;
  resetForm(): void;
  resetValidate(): void;
  formProtection(protect?: boolean): void;
}

// 검증 규칙 함수 타입
type RuleFunc = (value: unknown) => boolean | string;

// ValidateForm Injection 타입
interface ValidateFormInjection {
  addComponent: (node: VNode) => void;
}

// 검증 탐색 키 타입
type ValidateExplorKey = 'resetForm' | 'resetValidate' | 'validate';
```

## 브라우저 지원

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 라이센스

MIT License
