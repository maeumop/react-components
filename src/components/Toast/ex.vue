<script setup lang="ts">
import FloatingBackButton from '@/views/FloatingBackButton/index.vue';
import { inject } from 'vue';
import { toastIcon } from './const';
import type { ToastColor, ToastModel } from './types';

// Toast 인스턴스 주입
const toast = inject('toast') as ToastModel;

// 기본 토스트 메시지들
const showBasicSuccess = (): void => {
  toast('기본 성공 메시지입니다.');
};

const showBasicError = (): void => {
  toast('기본 오류 메시지입니다.');
};

// 상태별 토스트 메시지들
const showSuccessToast = (): void => {
  toast({
    message: '성공적으로 저장되었습니다!',
    color: 'success',
  });
};

const showWarningToast = (): void => {
  toast({
    message: '주의가 필요한 작업입니다.',
    color: 'warning',
  });
};

const showInfoToast = (): void => {
  toast({
    message: '새로운 업데이트가 있습니다.',
    color: 'info',
  });
};

const showErrorToast = (): void => {
  toast({
    message: '오류가 발생했습니다. 다시 시도해주세요.',
    color: 'error',
  });
};

// 커스텀 아이콘 토스트
const showCustomIconToast = (): void => {
  toast({
    message: '커스텀 아이콘이 적용된 메시지입니다.',
    color: 'info',
    icon: toastIcon.info,
  });
};

// 긴 메시지 토스트
const showLongMessageToast = (): void => {
  toast({
    message:
      '이것은 매우 긴 메시지입니다. 토스트 컴포넌트는 긴 메시지도 잘 처리할 수 있으며, 자동으로 줄바꿈이 적용됩니다.',
    color: 'warning',
  });
};

// 여러 토스트 동시 표시
const showMultipleToasts = (): void => {
  toast({
    message: '첫 번째 토스트 메시지',
    color: 'success',
  });

  setTimeout(() => {
    toast({
      message: '두 번째 토스트 메시지',
      color: 'info',
    });
  }, 500);

  setTimeout(() => {
    toast({
      message: '세 번째 토스트 메시지',
      color: 'warning',
    });
  }, 1000);

  setTimeout(() => {
    toast({
      message: '네 번째 토스트 메시지',
      color: 'error',
    });
  }, 1500);
};

// 빠른 연속 토스트
const showRapidToasts = (): void => {
  const messages = ['첫 번째', '두 번째', '세 번째', '네 번째', '다섯 번째'];

  messages.forEach((msg, index) => {
    setTimeout(() => {
      toast({
        message: `${msg} 빠른 토스트`,
        color: ['success', 'info', 'warning', 'error', 'success'][index] as ToastColor,
      });
    }, index * 200);
  });
};

// HTML 메시지 (v-html 지원)
const showHtmlMessageToast = (): void => {
  toast({
    message: '<strong>굵은 텍스트</strong>와 <em>기울임 텍스트</em>를 포함한 HTML 메시지입니다.',
    color: 'info',
  });
};

// 특별한 상황별 메시지들
const showNetworkError = (): void => {
  toast({
    message: '네트워크 연결을 확인해주세요.',
    color: 'error',
  });
};

const showSaveSuccess = (): void => {
  toast({
    message: '파일이 성공적으로 저장되었습니다.',
    color: 'success',
  });
};

const showUpdateAvailable = (): void => {
  toast({
    message: '새로운 버전이 사용 가능합니다.',
    color: 'info',
  });
};

const showPermissionDenied = (): void => {
  toast({
    message: '권한이 거부되었습니다.',
    color: 'error',
  });
};
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <h1>Toast Component Examples</h1>
        <p>Vue 3 + TypeScript로 개발된 토스트 알림 컴포넌트</p>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <!-- 기본 사용법 -->
        <section class="example-section">
          <h2>기본 사용법</h2>
          <div class="example-grid">
            <div class="example-item">
              <button class="demo-button theme-success" @click="showBasicSuccess">
                기본 성공 메시지
              </button>
              <span class="example-label">문자열만 전달하는 간단한 사용법</span>
            </div>
            <div class="example-item">
              <button class="demo-button theme-error" @click="showBasicError">
                기본 오류 메시지
              </button>
              <span class="example-label">기본적으로 error 색상 적용</span>
            </div>
          </div>
        </section>

        <!-- 상태별 토스트 -->
        <section class="example-section">
          <h2>상태별 토스트</h2>
          <div class="example-grid">
            <div class="example-item">
              <button class="demo-button theme-success" @click="showSuccessToast">
                Success 토스트
              </button>
              <span class="example-label">성공 상태 (초록색)</span>
            </div>
            <div class="example-item">
              <button class="demo-button theme-warning" @click="showWarningToast">
                Warning 토스트
              </button>
              <span class="example-label">경고 상태 (주황색)</span>
            </div>
            <div class="example-item">
              <button class="demo-button theme-info" @click="showInfoToast">Info 토스트</button>
              <span class="example-label">정보 상태 (파란색)</span>
            </div>
            <div class="example-item">
              <button class="demo-button theme-error" @click="showErrorToast">Error 토스트</button>
              <span class="example-label">오류 상태 (빨간색)</span>
            </div>
          </div>
        </section>

        <!-- 특별한 기능들 -->
        <section class="example-section">
          <h2>특별한 기능들</h2>
          <div class="example-grid">
            <div class="example-item">
              <button class="demo-button theme-secondary" @click="showCustomIconToast">
                커스텀 아이콘
              </button>
              <span class="example-label">사용자 정의 아이콘 적용</span>
            </div>
            <div class="example-item">
              <button class="demo-button theme-secondary" @click="showLongMessageToast">
                긴 메시지
              </button>
              <span class="example-label">자동 줄바꿈 지원</span>
            </div>
            <div class="example-item">
              <button class="demo-button theme-secondary" @click="showHtmlMessageToast">
                HTML 메시지
              </button>
              <span class="example-label">HTML 태그 지원</span>
            </div>
          </div>
        </section>

        <!-- 다중 토스트 -->
        <section class="example-section">
          <h2>다중 토스트</h2>
          <div class="example-grid">
            <div class="example-item">
              <button class="demo-button theme-primary" @click="showMultipleToasts">
                여러 토스트 표시
              </button>
              <span class="example-label">순차적으로 여러 토스트 표시</span>
            </div>
            <div class="example-item">
              <button class="demo-button theme-primary" @click="showRapidToasts">
                빠른 연속 토스트
              </button>
              <span class="example-label">최대 개수 제한 확인</span>
            </div>
          </div>
        </section>

        <!-- 실제 사용 시나리오 -->
        <section class="example-section">
          <h2>실제 사용 시나리오</h2>
          <div class="example-grid">
            <div class="example-item">
              <button class="demo-button theme-success" @click="showSaveSuccess">저장 성공</button>
              <span class="example-label">파일 저장 완료 알림</span>
            </div>
            <div class="example-item">
              <button class="demo-button theme-info" @click="showUpdateAvailable">
                업데이트 알림
              </button>
              <span class="example-label">새 버전 사용 가능</span>
            </div>
            <div class="example-item">
              <button class="demo-button theme-error" @click="showNetworkError">
                네트워크 오류
              </button>
              <span class="example-label">연결 오류 알림</span>
            </div>
            <div class="example-item">
              <button class="demo-button theme-error" @click="showPermissionDenied">
                권한 거부
              </button>
              <span class="example-label">접근 권한 오류</span>
            </div>
          </div>
        </section>

        <!-- 접근성 정보 -->
        <section class="example-section">
          <h2>접근성 기능</h2>
          <div class="accessibility-info">
            <h3>키보드 네비게이션</h3>
            <ul>
              <li><strong>Tab</strong>: 토스트 메시지 간 이동</li>
              <li><strong>Enter/Space</strong>: 토스트 메시지 제거</li>
              <li><strong>포커스 표시</strong>: 명확한 시각적 피드백</li>
            </ul>

            <h3>스크린 리더 지원</h3>
            <ul>
              <li><strong>role="alert"</strong>: 알림 역할 명시</li>
              <li><strong>aria-live</strong>: 동적 콘텐츠 알림</li>
              <li><strong>aria-label</strong>: 메시지 내용 설명</li>
            </ul>
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
}

.example-label {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
  text-align: center;
}

.accessibility-info {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e9ecef;

  h3 {
    margin: 0 0 1rem 0;
    color: #495057;
    font-size: 1.1rem;
    font-weight: 600;
  }

  ul {
    margin: 0 0 1.5rem 0;
    padding-left: 1.5rem;

    li {
      margin-bottom: 0.5rem;
      color: #6c757d;
      line-height: 1.5;

      strong {
        color: #495057;
        font-weight: 600;
      }
    }
  }
}

.app-footer {
  background: #343a40;
  color: white;
  text-align: center;
  padding: 1rem 0;
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
