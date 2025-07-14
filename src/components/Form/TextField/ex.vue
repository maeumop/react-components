<script setup lang="ts">
import FloatingBackButton from '@/views/FloatingBackButton/index.vue';
import { ref } from 'vue';

// 기본 입력
const basicText = ref('');
const emailText = ref('');
const passwordText = ref('');

// 유효성 검사
const validateText = ref('');
const validateEmail = ref('');

// 아이콘
const iconText = ref('');
const iconLeftText = ref('');

// textarea
const textareaText = ref('');

// 카운팅
const countingText = ref('');

// 유효성 검사 함수들 - 각각 독립적으로 정의
const validateEmailFn = (value: unknown): string | boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof value !== 'string' || !emailRegex.test(value)) {
    return '올바른 이메일 형식을 입력해주세요.';
  }
  return true;
};

const validateRequired = (value: unknown): string | boolean => {
  if (typeof value !== 'string' || !value.trim()) {
    return '필수 입력 항목입니다.';
  }
  return true;
};

const validateMinLength = (value: unknown): string | boolean => {
  if (typeof value !== 'string' || value.length < 3) {
    return '최소 3자 이상 입력해주세요.';
  }
  return true;
};

// 아이콘 액션
const handleIconClick = () => {
  alert('아이콘이 클릭되었습니다!');
};
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <h1>TextField Component Examples</h1>
        <p>Vue 3 + TypeScript로 개발된 텍스트 입력 컴포넌트</p>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <!-- 기본 입력 -->
        <section class="example-section">
          <h2>기본 입력</h2>
          <div class="example-grid">
            <div class="example-item">
              <TextField v-model="basicText" placeholder="기본 텍스트 입력" />
              <span class="example-label">기본 입력</span>
            </div>
            <div class="example-item">
              <TextField v-model="emailText" type="text" placeholder="이메일 입력" />
              <span class="example-label">이메일 입력</span>
            </div>
            <div class="example-item">
              <TextField v-model="passwordText" type="password" placeholder="비밀번호 입력" />
              <span class="example-label">비밀번호 입력</span>
            </div>
          </div>
        </section>

        <!-- 유효성 검사 -->
        <section class="example-section">
          <h2>유효성 검사</h2>
          <div class="example-grid">
            <div class="example-item">
              <TextField
                v-model="validateText"
                :validate="[validateRequired, validateMinLength]"
                placeholder="필수 입력 (최소 3자)"
                required
                block
              />
              <span class="example-label">필수 + 최소 길이</span>
            </div>
            <div class="example-item">
              <TextField
                v-model="validateEmail"
                :validate="[validateEmailFn]"
                placeholder="이메일 형식 검사"
                block
              />
              <span class="example-label">이메일 형식 검사</span>
            </div>
          </div>
        </section>

        <!-- 아이콘 -->
        <section class="example-section">
          <h2>아이콘</h2>
          <div class="example-grid">
            <div class="example-item">
              <TextField
                v-model="iconText"
                icon="mdi:magnify"
                :iconAction="handleIconClick"
                placeholder="검색어 입력"
                clearable
                block
              />
              <span class="example-label">검색 아이콘 + 클리어</span>
            </div>
            <div class="example-item">
              <TextField
                v-model="iconLeftText"
                icon="mdi:account"
                placeholder="사용자명 입력"
                iconLeft
                block
              />
              <span class="example-label">왼쪽 아이콘</span>
            </div>
          </div>
        </section>

        <!-- textarea -->
        <section class="example-section">
          <h2>Textarea</h2>
          <div class="example-grid">
            <div class="example-item">
              <TextField
                v-model="textareaText"
                :multiline="true"
                :rows="4"
                placeholder="여러 줄 텍스트 입력"
                label="메모"
                block
              />
              <span class="example-label">기본 textarea</span>
            </div>
          </div>
        </section>

        <!-- 글자 수 카운팅 -->
        <section class="example-section">
          <h2>글자 수 카운팅</h2>
          <div class="example-grid">
            <div class="example-item">
              <TextField
                v-model="countingText"
                :isCounting="true"
                :maxLength="50"
                placeholder="최대 50자까지 입력"
                label="소개글"
                block
              />
              <span class="example-label">글자 수 카운팅</span>
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
