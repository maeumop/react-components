# ValidateWrap 컴포넌트

ValidateWrap은 다양한 폼 요소를 감싸서 유효성 검사를 제공하는 범용 컴포넌트입니다. Slot을 활용하여 어떤 컴포넌트든 감쌀 수 있으며, 유연한 유효성 검사 규칙을 적용할 수 있습니다.

## 주요 기능

- **범용성**: Slot을 활용하여 어떤 컴포넌트든 감쌀 수 있습니다.
- **유연한 검증**: 함수형 유효성 검사 규칙을 자유롭게 정의할 수 있습니다.
- **에러 메시지**: 검증 실패 시 시각적 피드백을 제공합니다.
- **접근성**: Label과 required 표시를 지원합니다.
- **애니메이션**: 에러 상태 전환 시 부드러운 애니메이션 효과를 제공합니다.
- **조용한 검증**: silence 모드를 통해 UI 업데이트 없이 검증할 수 있습니다.

## Props

| Prop           | Type         | Default | Description           |
| -------------- | ------------ | ------- | --------------------- |
| `checkValue`   | `unknown`    | -       | 검증할 값 (필수)      |
| `validate`     | `RuleFunc[]` | `[]`    | 유효성 검사 함수 배열 |
| `errorMessage` | `string`     | `''`    | 커스텀 에러 메시지    |
| `label`        | `string`     | -       | 라벨 텍스트           |
| `required`     | `boolean`    | `false` | 필수 입력 여부        |
| `disabled`     | `boolean`    | `false` | 비활성화 여부         |

## Events

| Event               | Description                            |
| ------------------- | -------------------------------------- |
| `update:checkValue` | 검증 값 업데이트 시 발생 (향후 확장용) |

## Slots

| Slot      | Props                    | Description           |
| --------- | ------------------------ | --------------------- |
| `default` | `{ onBlur: () => void }` | 감쌀 컴포넌트         |
| `add-on`  | -                        | 라벨 옆에 추가할 요소 |

## Methods

| Method          | Parameters          | Returns   | Description             |
| --------------- | ------------------- | --------- | ----------------------- |
| `check`         | `silence?: boolean` | `boolean` | 유효성 검사 실행        |
| `resetForm`     | -                   | `void`    | 폼 상태 초기화          |
| `resetValidate` | -                   | `void`    | 유효성 검사 상태 초기화 |

## 기본 사용법

### ValidateWrap 사용 (권장)

```vue
<template>
  <ValidateWrap
    :check-value="email"
    :validate="[requiredRule, emailRule]"
    label="이메일 주소"
    required
  >
    <template #default="{ onBlur }">
      <input type="text" v-model="email" placeholder="이메일을 입력하세요" @blur="onBlur" />
    </template>
  </ValidateWrap>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ValidateWrap from './ValidateWrap/index.vue';
import TextField from '../TextField/index.vue';
import type { RuleFunc } from '../../types';

const email = ref('');

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
</script>
```

### 일반 폼 사용 (비교용)

```vue
<template>
  <div class="form-field" :class="{ 'has-error': emailError }">
    <label class="form-label"> 이메일 주소 <span class="required">*</span> </label>
    <input
      v-model="email"
      type="email"
      class="form-input"
      :class="{ error: emailError }"
      placeholder="이메일을 입력하세요"
      @blur="validateEmail"
    />
    <div class="feedback" :class="{ error: emailError }">
      {{ emailError }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
const emailError = ref('');

const validateEmail = (): void => {
  // 필수 입력 검증
  if (!email.value || email.value.trim() === '') {
    emailError.value = '필수 입력 항목입니다.';
    return;
  }

  // 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    emailError.value = '올바른 이메일 형식이 아닙니다.';
    return;
  }

  emailError.value = '';
};
</script>

<style scoped>
.form-field {
  margin-bottom: 1rem;
}

.form-field.has-error .form-input {
  border-color: #dc3545;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.required {
  color: #dc3545;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
}

.form-input.error {
  border-color: #dc3545;
}

.feedback {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #dc3545;
  min-height: 1rem;
  opacity: 0;
  transform: translateY(-0.25rem);
  transition:
    opacity 0.3s ease-in-out,
    transform 0.3s ease-in-out;
}

.feedback.error {
  opacity: 1;
  transform: translateY(0);
  animation: errorShake 0.3s ease-in-out;
}

@keyframes errorShake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-0.25rem);
  }
  75% {
    transform: translateX(0.25rem);
  }
}
</style>
```

## 유효성 검사 함수 작성

유효성 검사 함수는 `RuleFunc` 타입을 따르며, 다음 규칙을 준수해야 합니다:

```typescript
type RuleFunc = (value: unknown) => boolean | string;
```

- **성공 시**: `true` 반환
- **실패 시**: 에러 메시지 문자열 반환

### 예제 유효성 검사 함수들

```typescript
// 필수 입력 검증
const requiredRule: RuleFunc = (value: unknown): boolean | string => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return '필수 입력 항목입니다.';
  }
  return true;
};

// 이메일 형식 검증
const emailRule: RuleFunc = (value: unknown): boolean | string => {
  if (typeof value === 'string' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return '올바른 이메일 형식이 아닙니다.';
    }
  }
  return true;
};

// 최소 길이 검증
const minLengthRule = (min: number): RuleFunc => {
  return (value: unknown): boolean | string => {
    if (typeof value === 'string' && value.length < min) {
      return `최소 ${min}자 이상 입력해주세요.`;
    }
    return true;
  };
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

## 고급 사용법

### 커스텀 에러 메시지

#### ValidateWrap 사용

```vue
<ValidateWrap :check-value="value" :error-message="customError" label="커스텀 에러">
  <template #default="{ onBlur }">
    <TextField v-model="value" @blur="onBlur" />
  </template>
  <template #add-on>
    <button @click="toggleError">에러 토글</button>
  </template>
</ValidateWrap>
```

#### 일반 폼 사용

```vue
<template>
  <div class="form-field">
    <label class="form-label">커스텀 에러</label>
    <input v-model="value" class="form-input" :class="{ error: customError }" />
    <div class="feedback" :class="{ error: customError }">{{ customError }}</div>
    <button @click="toggleError">에러 토글</button>
  </div>
</template>

<script setup>
const value = ref('');
const customError = ref('');

const toggleError = () => {
  customError.value = customError.value ? '' : '사용자 정의 에러 메시지입니다.';
};
</script>
```

### 조용한 검증 (Silence Mode)

#### ValidateWrap 사용

```vue
<script setup>
const validateWrapRef = ref();

const validateSilently = () => {
  // UI 업데이트 없이 검증만 수행
  const isValid = validateWrapRef.value?.check(true);
  console.log('검증 결과:', isValid);
};
</script>
```

#### 일반 폼 사용

```vue
<script setup>
const validateSilently = () => {
  // 수동으로 검증 로직 실행 (UI 업데이트 없음)
  const emailValid = validateEmailLogic(email.value);
  const passwordValid = validatePasswordLogic(password.value);

  const isValid = emailValid && passwordValid;
  console.log('검증 결과:', isValid);
};
</script>
```

### 복합 유효성 검사

#### ValidateWrap 사용

```vue
<ValidateWrap
  :check-value="password"
  :validate="[requiredRule, minLengthRule(8), passwordStrengthRule]"
  label="비밀번호"
  required
>
  <template #default="{ onBlur }">
    <TextField
      v-model="password"
      type="password"
      placeholder="비밀번호를 입력하세요"
      @blur="onBlur"
    />
  </template>
</ValidateWrap>
```

#### 일반 폼 사용

```vue
<template>
  <div class="form-field" :class="{ 'has-error': passwordError }">
    <label class="form-label"> 비밀번호 <span class="required">*</span> </label>
    <input
      v-model="password"
      type="password"
      class="form-input"
      :class="{ error: passwordError }"
      placeholder="비밀번호를 입력하세요"
      @blur="validatePassword"
    />
    <div class="feedback" :class="{ error: passwordError }">
      {{ passwordError }}
    </div>
  </div>
</template>

<script setup>
const password = ref('');
const passwordError = ref('');

const validatePassword = (): void => {
  // 필수 입력 검증
  if (!password.value || password.value.trim() === '') {
    passwordError.value = '필수 입력 항목입니다.';
    return;
  }

  // 최소 길이 검증
  if (password.value.length < 8) {
    passwordError.value = '최소 8자 이상 입력해주세요.';
    return;
  }

  // 비밀번호 강도 검증
  const hasUpperCase = /[A-Z]/.test(password.value);
  const hasLowerCase = /[a-z]/.test(password.value);
  const hasNumbers = /\d/.test(password.value);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    passwordError.value = '대문자, 소문자, 숫자를 포함해야 합니다.';
    return;
  }

  passwordError.value = '';
};
</script>
```

## 스타일링

ValidateWrap 컴포넌트는 다음과 같은 CSS 클래스를 제공합니다:

- `.validate-wrap`: 최상위 컨테이너
- `.validate-wrap .options-wrap`: 라벨과 추가 옵션 영역
- `.validate-wrap .input-wrap`: 입력 필드 래퍼
- `.validate-wrap .input-wrap.error`: 에러 상태
- `.validate-wrap .feedback`: 피드백 메시지 영역
- `.validate-wrap .feedback.error`: 에러 메시지 상태

### 커스텀 스타일링 예제

```scss
.validate-wrap {
  .input-wrap {
    &.error {
      .input-field {
        border-color: #dc3545;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
      }
    }
  }

  .feedback {
    &.error {
      background-color: #f8d7da;
      color: #721c24;
      border-color: #f5c6cb;
      animation: shake 0.5s ease-in-out;
    }
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}
```

## 접근성

ValidateWrap 컴포넌트는 다음과 같은 접근성 기능을 제공합니다:

- **라벨 연결**: `label` prop을 통해 입력 필드와 라벨을 연결
- **필수 표시**: `required` prop을 통해 필수 입력 항목 표시
- **에러 메시지**: 검증 실패 시 명확한 에러 메시지 제공
- **키보드 네비게이션**: 포커스 관리 지원

## 주의사항

1. **검증 순서**: `validate` 배열의 순서대로 검증이 실행되며, 첫 번째 실패 시 검증이 중단됩니다.
2. **타입 안전성**: `checkValue`는 `unknown` 타입이므로 검증 함수 내에서 적절한 타입 체크가 필요합니다.
3. **성능**: 많은 수의 검증 함수를 등록할 경우 성능에 영향을 줄 수 있습니다.
4. **에러 메시지 우선순위**: `errorMessage`가 설정되어 있으면 `validate` 함수는 무시됩니다.

## ValidateWrap vs 일반 폼 비교

| 항목          | ValidateWrap                  | 일반 폼                    |
| ------------- | ----------------------------- | -------------------------- |
| **코드량**    | 적음 (재사용 가능한 컴포넌트) | 많음 (각 필드마다 반복)    |
| **유지보수**  | 쉬움 (중앙 집중식 관리)       | 어려움 (분산된 로직)       |
| **일관성**    | 보장됨 (통일된 UI/UX)         | 보장 어려움 (개별 구현)    |
| **재사용성**  | 높음 (함수형 규칙)            | 낮음 (하드코딩)            |
| **학습 곡선** | 있음 (컴포넌트 학습 필요)     | 없음 (기본 HTML)           |
| **유연성**    | 높음 (Slot 기반)              | 높음 (완전한 커스터마이징) |

### 언제 ValidateWrap을 사용해야 할까?

✅ **권장하는 경우:**

- 여러 폼에서 동일한 유효성 검사 패턴을 사용할 때
- 일관된 UI/UX가 중요한 프로젝트
- 개발 시간을 단축하고 싶을 때
- 유지보수성을 중시하는 프로젝트

❌ **권장하지 않는 경우:**

- 매우 특수한 유효성 검사가 필요한 경우
- 완전히 커스텀된 UI가 필요한 경우
- 단순한 폼 (1-2개 필드)

## 예제

더 많은 사용 예제는 `ex.vue` 파일을 참조하세요. 예제에서는 ValidateWrap을 사용하지 않는 일반 폼과 ValidateWrap을 사용한 폼을 비교하여 보여줍니다.
