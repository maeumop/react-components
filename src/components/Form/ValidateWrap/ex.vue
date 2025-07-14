<script setup lang="ts">
import FloatingBackButton from '@/views/FloatingBackButton/index.vue';
import { ref } from 'vue';
import type { RuleFunc } from '../../types';
import ValidateWrap from './index.vue';

// 기본 입력
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const age = ref('');
const phone = ref('');

// 커스텀 에러
const customError = ref('');
const customValue = ref('');

// 유효성 검사 함수들
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

const phoneRule: RuleFunc = (value: unknown): boolean | string => {
  if (typeof value === 'string' && value) {
    const phoneRegex = /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/;
    if (!phoneRegex.test(value)) {
      return '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)';
    }
  }
  return true;
};

// 커스텀 에러 토글
const toggleCustomError = (): void => {
  customError.value = customError.value ? '' : '사용자 정의 에러 메시지입니다.';
};

// 전체 폼 검증
const validateForm = (): void => {
  // 각 ValidateWrap의 check 메서드 호출
  const emailRef = ref();
  const passwordRef = ref();
  const confirmPasswordRef = ref();
  const ageRef = ref();
  const phoneRef = ref();
  const customRef = ref();

  const results = [
    emailRef.value?.check(),
    passwordRef.value?.check(),
    confirmPasswordRef.value?.check(),
    ageRef.value?.check(),
    phoneRef.value?.check(),
    customRef.value?.check(),
  ];

  const isValid = results.every(result => result === true);

  if (isValid) {
    alert('모든 검증을 통과했습니다!');
  } else {
    alert('검증에 실패했습니다. 오류 메시지를 확인해주세요.');
  }
};

// 폼 초기화
const resetForm = (): void => {
  email.value = '';
  password.value = '';
  confirmPassword.value = '';
  age.value = '';
  phone.value = '';
  customValue.value = '';
  customError.value = '';
};
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <h1>ValidateWrap Component Examples</h1>
        <p>Vue 3 + TypeScript로 개발된 유효성 검사 래퍼 컴포넌트</p>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <!-- 기본 사용법 -->
        <section class="example-section">
          <h2>기본 사용법</h2>
          <div class="example-grid">
            <div class="example-item">
              <ValidateWrap
                :check-value="email"
                :validate="[requiredRule, emailRule]"
                label="이메일 주소"
                required
              >
                <template #default="{ onBlur }">
                  <input
                    v-model="email"
                    type="email"
                    class="form-input"
                    placeholder="이메일을 입력하세요"
                    @blur="onBlur"
                  />
                </template>
              </ValidateWrap>
              <span class="example-label">이메일 검증</span>
            </div>
            <div class="example-item">
              <ValidateWrap
                :check-value="password"
                :validate="[requiredRule, minLengthRule(8)]"
                label="비밀번호"
                required
              >
                <template #default="{ onBlur }">
                  <input
                    v-model="password"
                    type="password"
                    class="form-input"
                    placeholder="8자 이상 입력하세요"
                    @blur="onBlur"
                  />
                </template>
              </ValidateWrap>
              <span class="example-label">비밀번호 검증</span>
            </div>
          </div>
        </section>

        <!-- 고급 검증 -->
        <section class="example-section">
          <h2>고급 검증</h2>
          <div class="example-grid">
            <div class="example-item">
              <ValidateWrap
                :check-value="confirmPassword"
                :validate="[requiredRule]"
                label="비밀번호 확인"
                required
              >
                <template #default="{ onBlur }">
                  <input
                    v-model="confirmPassword"
                    type="password"
                    class="form-input"
                    placeholder="비밀번호를 다시 입력하세요"
                    @blur="onBlur"
                  />
                </template>
              </ValidateWrap>
              <span class="example-label">비밀번호 확인</span>
            </div>
            <div class="example-item">
              <ValidateWrap
                :check-value="age"
                :validate="[requiredRule, numberRangeRule(1, 120)]"
                label="나이"
                required
              >
                <template #default="{ onBlur }">
                  <input
                    v-model="age"
                    type="number"
                    class="form-input"
                    placeholder="1-120 사이의 숫자"
                    @blur="onBlur"
                  />
                </template>
              </ValidateWrap>
              <span class="example-label">나이 범위 검증</span>
            </div>
          </div>
        </section>

        <!-- 커스텀 에러 -->
        <section class="example-section">
          <h2>커스텀 에러 메시지</h2>
          <div class="example-grid">
            <div class="example-item">
              <ValidateWrap
                :check-value="customValue"
                :error-message="customError"
                label="커스텀 에러"
              >
                <template #default="{ onBlur }">
                  <input
                    v-model="customValue"
                    type="text"
                    class="form-input"
                    placeholder="아무 값이나 입력하세요"
                    @blur="onBlur"
                  />
                </template>
                <template #add-on>
                  <button type="button" @click="toggleCustomError" class="error-toggle-btn">
                    {{ customError ? '에러 제거' : '에러 추가' }}
                  </button>
                </template>
              </ValidateWrap>
              <span class="example-label">사용자 정의 에러</span>
            </div>
            <div class="example-item">
              <ValidateWrap
                :check-value="phone"
                :validate="[requiredRule, phoneRule]"
                label="전화번호"
                required
              >
                <template #default="{ onBlur }">
                  <input
                    v-model="phone"
                    type="tel"
                    class="form-input"
                    placeholder="010-1234-5678"
                    @blur="onBlur"
                  />
                </template>
              </ValidateWrap>
              <span class="example-label">전화번호 형식 검증</span>
            </div>
          </div>
        </section>

        <!-- 액션 버튼 -->
        <section class="example-section">
          <h2>폼 액션</h2>
          <div class="actions">
            <button type="button" @click="validateForm" class="validate-btn">전체 검증</button>
            <button type="button" @click="resetForm" class="reset-btn">폼 초기화</button>
          </div>
        </section>

        <!-- 특징 설명 -->
        <section class="example-section">
          <h2>ValidateWrap의 특징</h2>
          <div class="features-grid">
            <div class="feature-item">
              <h3>범용성</h3>
              <p>
                Slot을 활용하여 어떤 컴포넌트든 감쌀 수 있습니다. input, select, textarea 등 모든 폼
                요소에 적용 가능합니다.
              </p>
            </div>
            <div class="feature-item">
              <h3>유연한 검증</h3>
              <p>
                함수형 유효성 검사 규칙을 자유롭게 정의할 수 있습니다. 복합적인 검증 로직도 쉽게
                구현할 수 있습니다.
              </p>
            </div>
            <div class="feature-item">
              <h3>일관된 UI</h3>
              <p>
                모든 필드에서 동일한 에러 메시지 스타일과 애니메이션을 제공하여 일관된 사용자 경험을
                제공합니다.
              </p>
            </div>
            <div class="feature-item">
              <h3>재사용성</h3>
              <p>
                유효성 검사 규칙을 함수로 정의하여 여러 곳에서 재사용할 수 있습니다. 코드 중복을
                크게 줄일 수 있습니다.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>

    <FloatingBackButton />
  </div>
</template>

<style lang="scss" scoped>
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  h1 {
    margin: 0 0 0.5rem 0;
    font-size: 2.5rem;
    font-weight: 700;
  }

  p {
    margin: 0;
    font-size: 1.1rem;
    opacity: 0.9;
  }
}

.main-content {
  padding: 3rem 0;
  background-color: #f8f9fa;
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.example-section {
  margin-bottom: 4rem;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  h2 {
    margin: 0 0 2rem 0;
    color: #333;
    font-size: 1.5rem;
    font-weight: 600;
    border-bottom: 2px solid #667eea;
    padding-bottom: 0.5rem;
  }
}

.example-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.example-item {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #f8f9fa;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
}

.example-label {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
  text-align: center;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e9ecef;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #333;
  background-color: #fff;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
  }

  &::placeholder {
    color: #6c757d;
  }
}

.error-toggle-btn {
  padding: 0.5rem 1rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;

  &:hover {
    background: #c82333;
  }
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;

  button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease-in-out;

    &.validate-btn {
      background: #007bff;
      color: white;

      &:hover {
        background: #0056b3;
      }
    }

    &.reset-btn {
      background: #6c757d;
      color: white;

      &:hover {
        background: #545b62;
      }
    }
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.feature-item {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #28a745;

  h3 {
    color: #2c3e50;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  p {
    color: #495057;
    margin: 0;
    line-height: 1.5;
  }
}

@media (max-width: 768px) {
  .example-grid {
    grid-template-columns: 1fr;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .app-header h1 {
    font-size: 2rem;
  }

  .actions {
    flex-direction: column;
  }
}
</style>
