<script setup lang="ts">
import FloatingBackButton from '@/views/FloatingBackButton/index.vue';
import { ref } from 'vue';
import { spinnerStatus } from './const';
import { useSpinner } from './index';
import type { SpinnerColor, SpinnerStatus } from './types';

const { show, hide } = useSpinner();

// 상태 관리
const currentTheme = ref<SpinnerColor>('default');
const status = ref<SpinnerStatus>(spinnerStatus.hidden);
const lastMessage = ref<string>('');

// 기본 사용법
const showBasicSpinner = () => {
  show();
  updateStatus('showing', '기본 스피너');
  setTimeout(() => hide(), 3000);
};

const showSpinnerWithMessage = () => {
  show('데이터를 처리중입니다...');
  updateStatus('showing', '데이터를 처리중입니다...');
  setTimeout(() => hide(), 3000);
};

const showSpinnerWithDelay = () => {
  // 지연 기능은 현재 API에서 지원하지 않으므로 setTimeout으로 대체
  setTimeout(() => {
    show('1초 후 표시된 스피너');
    updateStatus('showing', '1초 후 표시된 스피너');
    setTimeout(() => hide(), 3000);
  }, 1000);
};

// 색상 테마
const showThemeSpinner = (color: SpinnerColor) => {
  const messages: Record<SpinnerColor, string> = {
    default: '기본 테마 스피너',
    primary: 'Primary 테마 스피너',
    secondary: 'Secondary 테마 스피너',
    success: 'Success 테마 스피너',
    warning: 'Warning 테마 스피너',
    error: 'Error 테마 스피너',
    info: 'Info 테마 스피너',
  };

  show(messages[color], { color });
  currentTheme.value = color;
  updateStatus('showing', messages[color]);
  setTimeout(() => hide(), 3000);
};

// 고급 예제
const showProgressiveSpinner = async () => {
  show('작업을 시작합니다...', { color: 'primary' });
  updateStatus('showing', '작업을 시작합니다...');

  await new Promise(resolve => setTimeout(resolve, 1000));
  show('첫 번째 단계 완료...', { color: 'info' });
  updateStatus('showing', '첫 번째 단계 완료...');

  await new Promise(resolve => setTimeout(resolve, 1000));
  show('마지막 단계입니다...', { color: 'warning' });
  updateStatus('showing', '마지막 단계입니다...');

  await new Promise(resolve => setTimeout(resolve, 1000));
  show('모든 작업이 완료되었습니다!', { color: 'success' });
  updateStatus('showing', '모든 작업이 완료되었습니다!');

  setTimeout(() => {
    hide();
    updateStatus('hiding', '');
  }, 2000);
};

// API 호출 시뮬레이션
const simulateApiCall = async (type: 'success' | 'error' | 'warning') => {
  const themes: Record<string, SpinnerColor> = {
    success: 'success',
    error: 'error',
    warning: 'warning',
  };
  const messages = {
    success: 'API 호출 성공!',
    error: 'API 호출 실패!',
    warning: 'API 호출 경고!',
  };

  show(`${type} API 호출 중...`, { color: themes[type] });
  updateStatus('showing', `${type} API 호출 중...`);

  try {
    // API 호출 시뮬레이션
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (type === 'error') {
          reject(new Error('API 오류'));
        } else {
          resolve('성공');
        }
      }, 2000);
    });

    show(messages[type], { color: 'success' });
    updateStatus('showing', messages[type]);
  } catch (error) {
    console.log(error);
    show('오류가 발생했습니다', { color: 'error' });
    updateStatus('showing', '오류가 발생했습니다');
  }

  setTimeout(() => hide(), 2000);
};

const simulateLongApiCall = async () => {
  show('긴 API 호출 중... (10초)', { color: 'info' });
  updateStatus('showing', '긴 API 호출 중... (10초)');

  try {
    await new Promise(resolve => setTimeout(resolve, 10000));
    show('긴 API 호출 완료!', { color: 'success' });
    updateStatus('showing', '긴 API 호출 완료!');
  } catch (error) {
    console.log(error);
    show('타임아웃 발생', { color: 'error' });
    updateStatus('showing', '타임아웃 발생');
  }

  setTimeout(() => hide(), 2000);
};

// 상태 업데이트 헬퍼
const updateStatus = (s: SpinnerStatus, message: string) => {
  status.value = s;

  if (message) {
    lastMessage.value = message;
  }
};
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <h1>Spinner Component Examples</h1>
        <p>Vue 3 + TypeScript로 개발된 로딩 스피너 컴포넌트</p>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <!-- 기본 사용법 -->
        <section class="example-section">
          <h2>기본 사용법</h2>
          <div class="example-grid">
            <div class="example-item">
              <button class="demo-button" @click="showBasicSpinner">기본 스피너</button>
              <span class="example-label">기본 스피너</span>
            </div>
            <div class="example-item">
              <button class="demo-button" @click="showSpinnerWithMessage">메시지와 함께</button>
              <span class="example-label">메시지와 함께</span>
            </div>
            <div class="example-item">
              <button class="demo-button" @click="showSpinnerWithDelay">지연 후 표시</button>
              <span class="example-label">지연 후 표시</span>
            </div>
          </div>
        </section>

        <!-- 색상 테마 -->
        <section class="example-section">
          <h2>색상 테마</h2>
          <div class="example-grid">
            <div class="example-item">
              <button class="demo-button theme-default" @click="showThemeSpinner('default')">
                Default
              </button>
              <span class="example-label">Default</span>
            </div>
            <div class="example-item">
              <button class="demo-button theme-primary" @click="showThemeSpinner('primary')">
                Primary
              </button>
              <span class="example-label">Primary</span>
            </div>
            <div class="example-item">
              <button class="demo-button theme-secondary" @click="showThemeSpinner('secondary')">
                Secondary
              </button>
              <span class="example-label">Secondary</span>
            </div>
            <div class="example-item">
              <button class="demo-button theme-success" @click="showThemeSpinner('success')">
                Success
              </button>
              <span class="example-label">Success</span>
            </div>
            <div class="example-item">
              <button class="demo-button theme-warning" @click="showThemeSpinner('warning')">
                Warning
              </button>
              <span class="example-label">Warning</span>
            </div>
            <div class="example-item">
              <button class="demo-button theme-error" @click="showThemeSpinner('error')">
                Error
              </button>
              <span class="example-label">Error</span>
            </div>
            <div class="example-item">
              <button class="demo-button theme-info" @click="showThemeSpinner('info')">Info</button>
              <span class="example-label">Info</span>
            </div>
          </div>
        </section>

        <!-- 고급 예제 -->
        <section class="example-section">
          <h2>고급 예제</h2>
          <div class="example-grid">
            <div class="example-item">
              <button class="demo-button advanced" @click="showProgressiveSpinner">
                단계별 테마 변경
              </button>
              <span class="example-label">단계별 테마 변경</span>
            </div>
          </div>
        </section>

        <!-- API 호출 시뮬레이션 -->
        <section class="example-section">
          <h2>API 호출 시뮬레이션</h2>
          <div class="example-grid">
            <div class="example-item">
              <button class="demo-button api success" @click="simulateApiCall('success')">
                성공 API 호출
              </button>
              <span class="example-label">성공 API 호출</span>
            </div>
            <div class="example-item">
              <button class="demo-button api error" @click="simulateApiCall('error')">
                실패 API 호출
              </button>
              <span class="example-label">실패 API 호출</span>
            </div>
            <div class="example-item">
              <button class="demo-button api warning" @click="simulateApiCall('warning')">
                경고 API 호출
              </button>
              <span class="example-label">경고 API 호출</span>
            </div>
            <div class="example-item">
              <button class="demo-button api long" @click="simulateLongApiCall">
                긴 API 호출 (타임아웃)
              </button>
              <span class="example-label">긴 API 호출 (타임아웃)</span>
            </div>
          </div>
        </section>

        <!-- 상태 표시 -->
        <section class="example-section">
          <h2>스피너 상태</h2>
          <div class="status-indicator">
            <span :class="['status-light', `status-${status}`]"></span>
            <p>
              현재 상태: <strong>{{ status }}</strong>
            </p>
            <p v-if="lastMessage">
              마지막 메시지: <strong>{{ lastMessage }}</strong>
            </p>
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
  min-width: 120px;

  &:hover {
    background: #5a6fd8;
  }

  // 테마별 색상
  &.theme-default {
    background: #6c757d;
    &:hover {
      background: #5a6268;
    }
  }

  &.theme-primary {
    background: #007bff;
    &:hover {
      background: #0056b3;
    }
  }

  &.theme-secondary {
    background: #6c757d;
    &:hover {
      background: #5a6268;
    }
  }

  &.theme-success {
    background: #28a745;
    &:hover {
      background: #1e7e34;
    }
  }

  &.theme-warning {
    background: #ffc107;
    color: #212529;
    &:hover {
      background: #e0a800;
    }
  }

  &.theme-error {
    background: #dc3545;
    &:hover {
      background: #c82333;
    }
  }

  &.theme-info {
    background: #17a2b8;
    &:hover {
      background: #138496;
    }
  }

  // 고급 예제 버튼
  &.advanced {
    background: transparent;
    color: #667eea;
    border: 2px solid #667eea;

    &:hover {
      background: #667eea;
      color: white;
    }
  }

  // API 버튼
  &.api-success {
    background: #28a745;
    &:hover {
      background: #1e7e34;
    }
  }

  &.api-error {
    background: #dc3545;
    &:hover {
      background: #c82333;
    }
  }

  &.api-warning {
    background: #ffc107;
    color: #212529;
    &:hover {
      background: #e0a800;
    }
  }

  &.api-long {
    background: #17a2b8;
    &:hover {
      background: #138496;
    }
  }
}

.example-label {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
  text-align: center;
}

.status-indicator {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.status-light {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 0.5rem;

  &.status-default {
    background-color: #e9ecef;
  }

  &.status-primary {
    background-color: #cce7ff;
  }

  &.status-secondary {
    background-color: #e2e3e5;
  }

  &.status-success {
    background-color: #d4edda;
  }

  &.status-warning {
    background-color: #fff3cd;
  }

  &.status-error {
    background-color: #f8d7da;
  }

  &.status-info {
    background-color: #d1ecf1;
  }

  &.status-hidden {
    background-color: #e9ecef;
  }

  &.status-showing {
    background-color: #d4edda;
  }

  &.status-hiding {
    background-color: #fff3cd;
  }
}

@media (max-width: 768px) {
  .example-grid {
    grid-template-columns: 1fr;
  }

  .app-header h1 {
    font-size: 2rem;
  }

  .status-indicator {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>
