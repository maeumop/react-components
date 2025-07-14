<script setup lang="ts">
import FloatingBackButton from '@/views/FloatingBackButton/index.vue';
import { ref } from 'vue';
import { messageBox, messageBoxTransition } from './index';
import type { MessageBoxTransition } from './types';

const selectedTransition = ref<MessageBoxTransition>(messageBoxTransition.scale);

// 트랜지션 옵션 목록
const transitions = {
  Scale: messageBoxTransition.scale,
  Slide: messageBoxTransition.slide,
  'Slide Up': messageBoxTransition.slideUp,
  Zoom: messageBoxTransition.zoom,
  Bounce: messageBoxTransition.bounce,
  Flip: messageBoxTransition.flip,
  Elastic: messageBoxTransition.elastic,
};

const showAlert = (): void => {
  messageBox.alert('기본 Alert 메시지입니다.');
};

const showConfirm = (): void => {
  messageBox.confirm('기본 Confirm 메시지입니다.');
};

const showAlertWithTransition = (): void => {
  messageBox.alert({
    message: `${selectedTransition.value} 트랜지션을 사용한 Alert입니다.`,
    transition: selectedTransition.value,
  });
};

const showConfirmWithTransition = (): void => {
  messageBox.confirm({
    message: `${selectedTransition.value} 트랜지션을 사용한 Confirm입니다.`,
    transition: selectedTransition.value,
  });
};

// 각 트랜지션 효과를 개별적으로 테스트하는 함수들
const showScaleTransition = (): void => {
  messageBox.alert({
    title: 'Scale 트랜지션',
    message: '기본 스케일 효과가 적용된 메시지입니다.',
    transition: messageBoxTransition.scale,
  });
};

const showSlideTransition = (): void => {
  messageBox.alert({
    title: 'Slide 트랜지션',
    message: '슬라이드 효과가 적용된 메시지입니다.',
    transition: messageBoxTransition.slide,
  });
};

const showSlideUpTransition = (): void => {
  messageBox.alert({
    title: 'Slide Up 트랜지션',
    message: '위로 슬라이드되는 효과가 적용된 메시지입니다.',
    transition: messageBoxTransition.slideUp,
  });
};

const showZoomTransition = (): void => {
  messageBox.alert({
    title: 'Zoom 트랜지션',
    message: '줌 효과가 적용된 메시지입니다.',
    transition: messageBoxTransition.zoom,
  });
};

const showBounceTransition = (): void => {
  messageBox.alert({
    title: 'Bounce 트랜지션',
    message: '바운스 효과가 적용된 메시지입니다.',
    transition: messageBoxTransition.bounce,
  });
};

const showFlipTransition = (): void => {
  messageBox.alert({
    title: 'Flip 트랜지션',
    message: '플립 효과가 적용된 메시지입니다.',
    transition: messageBoxTransition.flip,
  });
};

const showElasticTransition = (): void => {
  messageBox.alert({
    title: 'Elastic 트랜지션',
    message: '탄성 효과가 적용된 메시지입니다.',
    transition: messageBoxTransition.elastic,
  });
};

const showAsyncAlert = (): void => {
  messageBox.alert({
    message: '비동기 처리가 포함된 Alert입니다.',
    asyncOkay: async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Async alert completed');
    },
  });
};

const showAsyncConfirm = (): void => {
  messageBox.confirm({
    message: '비동기 처리가 포함된 Confirm입니다.',
    asyncOkay: async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Async confirm completed');
    },
    cancel: () => {
      console.log('Async confirm cancelled');
    },
  });
};

const showCustomAlert = (): void => {
  messageBox.alert({
    title: '커스텀 Alert',
    message: '제목과 커스텀 버튼 텍스트가 있는 Alert입니다.',
    btnOkayText: '알겠습니다',
    width: '400px',
    transition: messageBoxTransition.bounce,
  });
};

const showCustomConfirm = (): void => {
  messageBox.confirm({
    title: '커스텀 Confirm',
    message: '제목과 커스텀 버튼 텍스트가 있는 Confirm입니다.',
    btnOkayText: '네',
    btnCancelText: '아니오',
    width: '400px',
    transition: messageBoxTransition.flip,
  });
};

const showHtmlMessage = (): void => {
  messageBox.alert({
    title: 'HTML 메시지',
    message:
      '<strong>굵은 텍스트</strong>와 <em>기울임 텍스트</em>를 포함한 메시지입니다.<br><br>줄바꿈도 지원됩니다.',
  });
};
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <h1>MessageBox Component Examples</h1>
        <p>Vue 3 + TypeScript로 개발된 모달 메시지 박스 컴포넌트</p>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <!-- 기본 Alert 예제 -->
        <section class="example-section">
          <h2>기본 Alert</h2>
          <div class="example-grid">
            <div class="example-item">
              <button class="demo-button theme-primary" @click="showAlert">기본 Alert</button>
              <span class="example-label">간단한 메시지만 표시</span>
            </div>
          </div>
        </section>

        <!-- HTML 메시지 예제 -->
        <section class="example-section">
          <h2>HTML 메시지</h2>
          <div class="example-grid">
            <div class="example-item">
              <button class="demo-button theme-info" @click="showHtmlMessage">HTML 서식</button>
              <span class="example-label">HTML 태그를 사용한 서식 있는 메시지</span>
            </div>
          </div>
        </section>

        <!-- Confirm 예제 -->
        <section class="example-section">
          <h2>Confirm 다이얼로그</h2>
          <div class="example-grid">
            <div class="example-item">
              <button class="demo-button theme-warning" @click="showConfirm">기본 Confirm</button>
              <span class="example-label">확인/취소 버튼이 있는 다이얼로그</span>
            </div>
          </div>
        </section>

        <!-- 트랜지션 선택기 -->
        <section class="example-section">
          <h2>트랜지션 선택</h2>
          <div class="transition-selector">
            <label for="transition-select">트랜지션 효과 선택:</label>
            <select id="transition-select" v-model="selectedTransition" class="transition-select">
              <option v-for="(value, key) in transitions" :key="key" :value="value">
                {{ key }}
              </option>
            </select>
          </div>
          <div class="example-grid">
            <div class="example-item">
              <button class="demo-button theme-info" @click="showAlertWithTransition">
                선택된 트랜지션으로 Alert
              </button>
              <span class="example-label">선택한 트랜지션 효과 적용</span>
            </div>
            <div class="example-item">
              <button class="demo-button theme-info" @click="showConfirmWithTransition">
                선택된 트랜지션으로 Confirm
              </button>
              <span class="example-label">선택한 트랜지션 효과 적용</span>
            </div>
          </div>
        </section>

        <!-- 개별 트랜지션 테스트 -->
        <section class="example-section">
          <h2>개별 트랜지션 테스트</h2>
          <div class="example-grid">
            <div class="example-item">
              <button class="demo-button theme-secondary" @click="showScaleTransition">
                Scale
              </button>
              <span class="example-label">기본 스케일 효과</span>
            </div>
            <div class="example-item">
              <button class="demo-button theme-secondary" @click="showSlideTransition">
                Slide
              </button>
              <span class="example-label">슬라이드 효과</span>
            </div>
            <div class="example-item">
              <button class="demo-button theme-secondary" @click="showSlideUpTransition">
                Slide Up
              </button>
              <span class="example-label">위로 슬라이드</span>
            </div>
            <div class="example-item">
              <button class="demo-button theme-secondary" @click="showZoomTransition">Zoom</button>
              <span class="example-label">줌 효과</span>
            </div>
            <div class="example-item">
              <button class="demo-button theme-secondary" @click="showBounceTransition">
                Bounce
              </button>
              <span class="example-label">바운스 효과</span>
            </div>
            <div class="example-item">
              <button class="demo-button theme-secondary" @click="showFlipTransition">Flip</button>
              <span class="example-label">플립 효과</span>
            </div>
            <div class="example-item">
              <button class="demo-button theme-secondary" @click="showElasticTransition">
                Elastic
              </button>
              <span class="example-label">탄성 효과</span>
            </div>
          </div>
        </section>

        <!-- 비동기 처리 -->
        <section class="example-section">
          <h2>비동기 처리</h2>
          <div class="example-grid">
            <div class="example-item">
              <button class="demo-button theme-success" @click="showAsyncAlert">Async Alert</button>
              <span class="example-label">비동기 처리 포함 Alert</span>
            </div>
            <div class="example-item">
              <button class="demo-button theme-success" @click="showAsyncConfirm">
                Async Confirm
              </button>
              <span class="example-label">비동기 처리 포함 Confirm</span>
            </div>
          </div>
        </section>

        <!-- 커스텀 옵션 -->
        <section class="example-section">
          <h2>커스텀 옵션</h2>
          <div class="example-grid">
            <div class="example-item">
              <button class="demo-button theme-info" @click="showCustomAlert">Custom Alert</button>
              <span class="example-label">커스텀 버튼 텍스트 포함 Alert</span>
            </div>
            <div class="example-item">
              <button class="demo-button theme-info" @click="showCustomConfirm">
                Custom Confirm
              </button>
              <span class="example-label">커스텀 버튼 텍스트 포함 Confirm</span>
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

.transition-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;

  label {
    font-weight: 600;
    color: #495057;
    min-width: 150px;
  }

  .transition-select {
    padding: 0.5rem 1rem;
    border: 1px solid #ced4da;
    border-radius: 6px;
    font-size: 1rem;
    background: white;
    min-width: 200px;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
    }
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

  .transition-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;

    label {
      min-width: auto;
    }

    .transition-select {
      min-width: 100%;
    }
  }
}
</style>
