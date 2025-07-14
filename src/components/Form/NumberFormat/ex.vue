<script setup lang="ts">
import FloatingBackButton from '@/views/FloatingBackButton/index.vue';
import { ref } from 'vue';
import NumberFormat from './index.vue';

// 기본 입력
const basicNumber = ref<number>(0);
const largeNumber = ref<number>(1234567);

// 유효성 검사
const validateNumber = ref<number>(0);
const rangeNumber = ref<number>(0);

// 에러 메시지
const errorNumber = ref<number>(0);

// 유효성 검사 함수들
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

const validatePositive = (value: unknown): string | boolean => {
  if (typeof value !== 'number' || value < 0) {
    return '양수를 입력해주세요.';
  }
  return true;
};
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <h1>NumberFormat Component Examples</h1>
        <p>Vue 3 + TypeScript로 개발된 숫자 포맷팅 컴포넌트</p>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <!-- 기본 입력 -->
        <section class="example-section">
          <h2>기본 입력</h2>
          <div class="example-grid">
            <div class="example-item">
              <NumberFormat v-model="basicNumber" placeholder="숫자 입력" />
              <span class="example-label">기본 숫자 입력</span>
            </div>
            <div class="example-item">
              <NumberFormat v-model="largeNumber" placeholder="큰 숫자 입력" />
              <span class="example-label">큰 숫자 포맷팅</span>
            </div>
          </div>
        </section>

        <!-- 유효성 검사 -->
        <section class="example-section">
          <h2>유효성 검사</h2>
          <div class="example-grid">
            <div class="example-item">
              <NumberFormat
                v-model="validateNumber"
                :validate="[validateRequired, validatePositive]"
                placeholder="필수 입력 (양수)"
                required
                block
              />
              <span class="example-label">필수 + 양수 검사</span>
            </div>
            <div class="example-item">
              <NumberFormat
                v-model="rangeNumber"
                :validate="[validateRange]"
                placeholder="1,000 ~ 1,000,000"
                block
              />
              <span class="example-label">범위 검사</span>
            </div>
          </div>
        </section>

        <!-- 라벨과 스타일 -->
        <section class="example-section">
          <h2>라벨과 스타일</h2>
          <div class="example-grid">
            <div class="example-item">
              <NumberFormat v-model="basicNumber" label="가격" placeholder="가격 입력" block />
              <span class="example-label">라벨 포함</span>
            </div>
            <div class="example-item">
              <NumberFormat
                v-model="largeNumber"
                label="매출액"
                placeholder="매출액 입력"
                required
                block
              />
              <span class="example-label">필수 표시</span>
            </div>
          </div>
        </section>

        <!-- 상태별 표시 -->
        <section class="example-section">
          <h2>상태별 표시</h2>
          <div class="example-grid">
            <div class="example-item">
              <NumberFormat v-model="basicNumber" placeholder="읽기 전용" readonly block />
              <span class="example-label">읽기 전용</span>
            </div>
            <div class="example-item">
              <NumberFormat v-model="basicNumber" placeholder="비활성화" disabled block />
              <span class="example-label">비활성화</span>
            </div>
          </div>
        </section>

        <!-- 에러 메시지 -->
        <section class="example-section">
          <h2>에러 메시지</h2>
          <div class="example-grid">
            <div class="example-item">
              <NumberFormat
                v-model="errorNumber"
                errorMessage="사용할 수 없는 숫자입니다."
                placeholder="에러 메시지 표시"
                block
              />
              <span class="example-label">에러 메시지</span>
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

@media (max-width: 768px) {
  .example-grid {
    grid-template-columns: 1fr;
  }

  .app-header h1 {
    font-size: 2rem;
  }
}
</style>
