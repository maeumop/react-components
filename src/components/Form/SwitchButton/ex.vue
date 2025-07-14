<script setup lang="ts">
import FloatingBackButton from '@/views/FloatingBackButton/index.vue';
import { ref } from 'vue';
import SwitchButton from './index.vue';

// 기본
const basic = ref(false);
// 색상
const color = ref(true);
// 체크박스
const checkbox = ref(false);
// 유효성
const validateValue = ref(false);
const validateFn = (val: unknown) => {
  if (val !== true) {
    return '동의가 필요합니다.';
  }
  return true;
};
function checkValidate() {
  alert(validateFn(validateValue.value) === true ? '유효' : '유효하지 않음');
}
// 비활성/읽기전용
const disabled = ref(false);
const readonly = ref(false);
// small
const small = ref(false);

// 색상 옵션들
const colorPrimary = ref(false);
const colorSecondary = ref(false);
const colorSuccess = ref(false);
const colorWarning = ref(false);
const colorError = ref(false);
const colorInfo = ref(false);
const colorDark = ref(false);
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <h1>SwitchButton Component Examples</h1>
        <p>Vue 3 + TypeScript로 개발된 스위치/체크박스 컴포넌트</p>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <!-- 기본 스위치 -->
        <section class="example-section">
          <h2>기본 스위치</h2>
          <div class="example-grid">
            <div class="example-item">
              <SwitchButton v-model="basic" />
              <span class="example-label">기본</span>
            </div>
          </div>
        </section>

        <!-- 색상/라벨 -->
        <section class="example-section">
          <h2>색상/라벨</h2>
          <div class="example-grid">
            <div class="example-item">
              <SwitchButton v-model="color" :label="['OFF', 'ON']" color="secondary" />
              <span class="example-label">secondary, 라벨</span>
            </div>
          </div>
        </section>

        <!-- 모든 색상 옵션 -->
        <section class="example-section">
          <h2>모든 색상 옵션</h2>
          <div class="example-grid">
            <div class="example-item">
              <SwitchButton v-model="colorPrimary" color="primary" />
              <span class="example-label">primary</span>
            </div>
            <div class="example-item">
              <SwitchButton v-model="colorSecondary" color="secondary" />
              <span class="example-label">secondary</span>
            </div>
            <div class="example-item">
              <SwitchButton v-model="colorSuccess" color="success" />
              <span class="example-label">success</span>
            </div>
            <div class="example-item">
              <SwitchButton v-model="colorWarning" color="warning" />
              <span class="example-label">warning</span>
            </div>
            <div class="example-item">
              <SwitchButton v-model="colorError" color="error" />
              <span class="example-label">error</span>
            </div>
            <div class="example-item">
              <SwitchButton v-model="colorInfo" color="info" />
              <span class="example-label">info</span>
            </div>
            <div class="example-item">
              <SwitchButton v-model="colorDark" color="dark" />
              <span class="example-label">dark</span>
            </div>
          </div>
        </section>

        <!-- 체크박스 스타일 -->
        <section class="example-section">
          <h2>체크박스 스타일</h2>
          <div class="example-grid">
            <div class="example-item">
              <SwitchButton v-model="checkbox" :label="['비활성', '활성']" :checkbox="true" />
              <span class="example-label">체크박스</span>
            </div>
          </div>
        </section>

        <!-- 유효성 검사 -->
        <section class="example-section">
          <h2>유효성 검사</h2>
          <div class="example-grid">
            <div class="example-item">
              <SwitchButton
                v-model="validateValue"
                :validate="validateFn"
                :label="['동의 안함', '동의함']"
              />
              <button class="demo-button" @click="checkValidate">유효성 수동 체크</button>
              <span class="example-label">유효성 검사</span>
            </div>
          </div>
        </section>

        <!-- 비활성/읽기전용 -->
        <section class="example-section">
          <h2>비활성/읽기전용</h2>
          <div class="example-grid">
            <div class="example-item">
              <SwitchButton v-model="disabled" disabled />
              <span class="example-label">disabled</span>
            </div>
            <div class="example-item">
              <SwitchButton v-model="readonly" readonly />
              <span class="example-label">readonly</span>
            </div>
          </div>
        </section>

        <!-- small 사이즈 -->
        <section class="example-section">
          <h2>small 사이즈</h2>
          <div class="example-grid">
            <div class="example-item">
              <SwitchButton v-model="small" small />
              <span class="example-label">small</span>
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.example-item {
  display: flex;
  flex-direction: column;
  align-items: center;
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

.demo-button {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #5a6fd8;
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
