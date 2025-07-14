<script setup lang="ts">
import FloatingBackButton from '@/views/FloatingBackButton/index.vue';
import { ref } from 'vue';
import DatePicker from './index.vue';

// 기본 선택
const basicDate = ref<string>('');
const rangeDate = ref<string[]>(['', '']);

// 유효성 검사
const validateDate = ref<string>('');
const validateRange = ref<string[]>(['', '']);

// 에러 메시지
const errorDate = ref<string>('');

// 유효성 검사 함수들
const validateRequired = (value: unknown): string | boolean => {
  if (Array.isArray(value)) {
    if (value.length === 0 || value.every(v => !v)) {
      return '필수 선택 항목입니다.';
    }
  } else {
    if (!value || value === '') {
      return '필수 선택 항목입니다.';
    }
  }
  return true;
};

const validateDateRange = (value: unknown): string | boolean => {
  if (Array.isArray(value) && value.length === 2) {
    const [start, end] = value;
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      if (startDate > endDate) {
        return '시작일은 종료일보다 이전이어야 합니다.';
      }
    }
  }
  return true;
};

const validateMaxRange = (value: unknown): string | boolean => {
  if (Array.isArray(value) && value.length === 2) {
    const [start, end] = value;
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 30) {
        return '최대 30일까지 선택 가능합니다.';
      }
    }
  }
  return true;
};
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <h1>DatePicker Component Examples</h1>
        <p>Vue 3 + TypeScript로 개발된 날짜 선택 컴포넌트</p>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <!-- 기본 선택 -->
        <section class="example-section">
          <h2>기본 선택</h2>
          <div class="example-grid">
            <div class="example-item">
              <DatePicker v-model="basicDate" placeholder="날짜를 선택하세요" block />
              <span class="example-label">단일 날짜 선택</span>
            </div>
            <div class="example-item">
              <DatePicker
                v-model="rangeDate"
                :range="true"
                :placeholder="['시작일', '종료일']"
                block
              />
              <span class="example-label">날짜 범위 선택</span>
            </div>
          </div>
        </section>

        <!-- 라벨과 스타일 -->
        <section class="example-section">
          <h2>라벨과 스타일</h2>
          <div class="example-grid">
            <div class="example-item">
              <DatePicker
                v-model="basicDate"
                label="시작일"
                placeholder="시작일을 선택하세요"
                required
                block
              />
              <span class="example-label">라벨 + 필수 표시</span>
            </div>
            <div class="example-item">
              <DatePicker
                v-model="rangeDate"
                :range="true"
                :placeholder="['시작일', '종료일']"
                :max-range="7"
                block
              />
              <span class="example-label">최대 7일 선택</span>
            </div>
          </div>
        </section>

        <!-- 유효성 검사 -->
        <section class="example-section">
          <h2>유효성 검사</h2>
          <div class="example-grid">
            <div class="example-item">
              <DatePicker
                v-model="validateDate"
                :validate="[validateRequired]"
                placeholder="필수 선택"
                required
                block
              />
              <span class="example-label">필수 선택 검사</span>
            </div>
            <div class="example-item">
              <DatePicker
                v-model="validateRange"
                :range="true"
                :validate="[validateRequired, validateDateRange, validateMaxRange]"
                :placeholder="['시작일', '종료일']"
                required
                block
              />
              <span class="example-label">범위 및 최대 기간 검사</span>
            </div>
          </div>
        </section>

        <!-- 상태별 표시 -->
        <section class="example-section">
          <h2>상태별 표시</h2>
          <div class="example-grid">
            <div class="example-item">
              <DatePicker
                v-model="errorDate"
                errorMessage="에러 메시지가 표시됩니다"
                placeholder="에러 상태"
                block
              />
              <span class="example-label">에러 상태</span>
            </div>
            <div class="example-item">
              <DatePicker v-model="basicDate" :disabled="true" placeholder="비활성화 상태" block />
              <span class="example-label">비활성화 상태</span>
            </div>
          </div>
        </section>

        <!-- 연도 범위 설정 -->
        <section class="example-section">
          <h2>연도 범위 설정</h2>
          <div class="example-grid">
            <div class="example-item">
              <DatePicker
                v-model="basicDate"
                :min-year="2020"
                :max-year="2030"
                placeholder="2020-2030년 범위"
                block
              />
              <span class="example-label">2020-2030년 범위</span>
            </div>
            <div class="example-item">
              <DatePicker
                v-model="rangeDate"
                :range="true"
                :min-year="2023"
                :max-year="2025"
                :placeholder="['시작일', '종료일']"
                block
              />
              <span class="example-label">2023-2025년 범위</span>
            </div>
          </div>
        </section>

        <!-- 구분자 설정 -->
        <section class="example-section">
          <h2>구분자 설정</h2>
          <div class="example-grid">
            <div class="example-item">
              <DatePicker v-model="basicDate" separator="/" placeholder="슬래시 구분자" block />
              <span class="example-label">슬래시(/) 구분자</span>
            </div>
            <div class="example-item">
              <DatePicker v-model="basicDate" separator="." placeholder="점 구분자" block />
              <span class="example-label">점(.) 구분자</span>
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
