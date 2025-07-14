<script setup lang="ts">
import FloatingBackButton from '@/views/FloatingBackButton/index.vue';
import { Icon } from '@iconify/vue';
import { computed, ref } from 'vue';
import { modalPosition } from './const';
import Modal from './index.vue';
import type { ModalPosition } from './types';

const showModal = ref(false);
const showFullscreenModal = ref(false);
const showConfirmModal = ref(false);
const position = ref<ModalPosition>(modalPosition.popup);

const modalTitle = computed(() => {
  const titles = {
    popup: '팝업 모달',
    fullscreen: '전체 화면 모달',
    bottom: '하단 모달',
    left: '좌측 모달',
    right: '우측 모달',
  };
  return titles[position.value];
});

const modalWidth = computed(() => {
  return ['left', 'right', 'bottom'].includes(position.value) ? '400px' : '500px';
});

const openModal = (pos: ModalPosition) => {
  position.value = pos;
  showModal.value = true;
};

const openFullscreenModal = () => {
  showFullscreenModal.value = true;
};

const openConfirmModal = () => {
  showConfirmModal.value = true;
};

const handleConfirm = (close: () => void) => {
  console.log('모달 확인됨');
  close();
};

const handleDelete = (close: () => void) => {
  console.log('삭제 작업 수행');
  close();
};
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <h1>Modal Component Examples</h1>
        <p>Vue 3 + TypeScript로 개발된 모달 컴포넌트</p>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <!-- 기본 사용법 -->
        <section class="example-section">
          <h2>기본 사용법</h2>
          <div class="example-item">
            <div class="info">
              <p>다양한 위치의 모달을 확인해보세요.</p>
            </div>
            <div class="button-group">
              <button @click="openModal('popup')" class="demo-button">팝업 모달</button>
            </div>
          </div>
        </section>

        <!-- 위치별 모달 -->
        <section class="example-section">
          <h2>위치별 모달</h2>
          <div class="example-item">
            <div class="info">
              <p>모달의 위치를 변경하여 다양한 레이아웃을 확인할 수 있습니다.</p>
            </div>
            <div class="button-group">
              <button @click="openModal('bottom')" class="demo-button">하단 모달</button>
              <button @click="openModal('left')" class="demo-button">좌측 모달</button>
              <button @click="openModal('right')" class="demo-button">우측 모달</button>
            </div>
          </div>
        </section>

        <!-- 고급 기능 -->
        <section class="example-section">
          <h2>고급 기능</h2>
          <div class="example-item">
            <div class="info">
              <p>전체 화면, 확인 모달 등 고급 기능을 확인해보세요.</p>
            </div>
            <div class="button-group">
              <button @click="openFullscreenModal" class="demo-button">전체 화면 모달</button>
              <button @click="openConfirmModal" class="demo-button demo-button-danger">
                확인 모달
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- 기본 모달 -->
    <Modal
      v-model="showModal"
      :title="modalTitle"
      :position="position"
      :width="modalWidth"
      esc-close
    >
      <template #body>
        <div class="modal-content">
          <p>
            이것은 <strong>{{ position }}</strong> 위치의 모달입니다.
          </p>
          <p>ESC 키를 눌러서 닫을 수 있습니다.</p>
          <div class="content-demo">
            <h3>모달 내용 예제</h3>
            <p>
              여기에 실제 모달 내용이 들어갑니다. 폼, 리스트, 이미지 등 다양한 콘텐츠를 포함할 수
              있습니다.
            </p>
            <ul>
              <li>첫 번째 항목</li>
              <li>두 번째 항목</li>
              <li>세 번째 항목</li>
            </ul>
          </div>
        </div>
      </template>

      <template #action="{ close }">
        <button @click="() => close()" class="demo-button">취소</button>
        <button @click="() => handleConfirm(close)" class="demo-button">확인</button>
      </template>
    </Modal>

    <!-- 전체 화면 모달 -->
    <Modal v-model="showFullscreenModal" title="전체 화면 모달" fullscreen esc-close>
      <template #body>
        <div class="fullscreen-content">
          <h1>전체 화면 모달</h1>
          <p>화면을 완전히 덮는 모달입니다. 주로 중요한 알림이나 전체 화면 콘텐츠에 사용됩니다.</p>
          <div class="fullscreen-demo">
            <div class="demo-card">
              <h3>카드 1</h3>
              <p>전체 화면 모달 내부의 카드 예제입니다.</p>
            </div>
            <div class="demo-card">
              <h3>카드 2</h3>
              <p>여러 개의 카드를 배치할 수 있습니다.</p>
            </div>
            <div class="demo-card">
              <h3>카드 3</h3>
              <p>반응형 레이아웃으로 구성됩니다.</p>
            </div>
          </div>
        </div>
      </template>

      <template #action="{ close }">
        <button @click="() => close()" class="demo-button">닫기</button>
      </template>
    </Modal>

    <!-- 확인 모달 -->
    <Modal v-model="showConfirmModal" title="확인" width="400px" esc-close>
      <template #body>
        <div class="confirm-content">
          <Icon icon="mdi:alert-circle" size="48" class="confirm-icon" />
          <p>정말로 이 작업을 수행하시겠습니까?</p>
          <p class="confirm-detail">이 작업은 되돌릴 수 없습니다.</p>
        </div>
      </template>

      <template #action="{ close }">
        <button @click="() => close()" class="demo-button">취소</button>
        <button @click="() => handleDelete(close)" class="demo-button demo-button-danger">
          삭제
        </button>
      </template>
    </Modal>

    <!-- Floating Back Button -->
    <FloatingBackButton />
  </div>
</template>

<style lang="scss" scoped>
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 0;
  text-align: center;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  p {
    font-size: 1.1rem;
    opacity: 0.9;
    margin: 0;
  }
}

.main-content {
  padding: 3rem 0;
  background-color: #f8fafc;
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.example-section {
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);

  h2 {
    color: #1f2937;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    font-weight: 600;
  }
}

.example-item {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info {
  text-align: center;
  margin-bottom: 1rem;

  p {
    margin: 0.5rem 0;
    color: #6b7280;
    font-size: 0.95rem;
  }
}

.button-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.demo-button {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  padding: 0.875rem 1.75rem;
  border-radius: 0.75rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-right: 0.5rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);

    &::before {
      left: 100%;
    }
  }

  &:active {
    background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  &:disabled {
    background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &.demo-button-danger {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);

    &:hover {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
    }

    &:active {
      background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }

    &:disabled {
      background: linear-gradient(135deg, #fca5a5 0%, #f87171 100%);
      box-shadow: none;
    }
  }
}

.modal-content {
  .content-demo {
    margin-top: 2rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-radius: 0.75rem;
    border-left: 4px solid #3b82f6;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(59, 130, 246, 0.2) 50%,
        transparent 100%
      );
    }

    h3 {
      margin: 0 0 1rem 0;
      color: #1e293b;
      font-weight: 700;
      font-size: 1.25rem;
    }

    ul {
      margin: 1rem 0 0 0;
      padding-left: 1.5rem;

      li {
        margin-bottom: 0.5rem;
        color: #475569;
        position: relative;

        &::before {
          content: '•';
          color: #3b82f6;
          font-weight: bold;
          position: absolute;
          left: -1.25rem;
        }
      }
    }
  }
}

.fullscreen-content {
  text-align: center;
  padding: 3rem;

  h1 {
    font-size: 3rem;
    font-weight: 800;
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1.5rem;
    letter-spacing: -0.025em;
  }

  p {
    font-size: 1.25rem;
    color: #64748b;
    margin-bottom: 3rem;
    line-height: 1.6;
  }

  .fullscreen-demo {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2.5rem;
    margin-top: 3rem;

    .demo-card {
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      padding: 2.5rem;
      border-radius: 1rem;
      box-shadow:
        0 10px 25px -5px rgba(0, 0, 0, 0.1),
        0 0 0 1px rgba(255, 255, 255, 0.1) inset;
      border: 1px solid rgba(226, 232, 240, 0.8);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(255, 255, 255, 0.8) 50%,
          transparent 100%
        );
      }

      &:hover {
        transform: translateY(-4px);
        box-shadow:
          0 20px 40px -10px rgba(0, 0, 0, 0.15),
          0 0 0 1px rgba(255, 255, 255, 0.2) inset;
      }

      h3 {
        color: #1e293b;
        margin-bottom: 1.5rem;
        font-weight: 700;
        font-size: 1.5rem;
      }

      p {
        color: #64748b;
        margin: 0;
        line-height: 1.6;
      }
    }
  }
}

.confirm-content {
  text-align: center;
  padding: 2rem 0;

  .confirm-icon {
    color: #f59e0b;
    margin-bottom: 1.5rem;
    filter: drop-shadow(0 4px 8px rgba(245, 158, 11, 0.3));
  }

  p {
    margin: 1rem 0;
    color: #1e293b;
    font-size: 1.1rem;
    line-height: 1.6;
  }

  .confirm-detail {
    color: #64748b;
    font-size: 0.95rem;
    font-style: italic;
  }
}

// 반응형 디자인
@media (max-width: 768px) {
  .app-header {
    padding: 2rem 0;

    h1 {
      font-size: 2rem;
    }

    p {
      font-size: 1rem;
    }
  }

  .main-content {
    padding: 2rem 0;
  }

  .container {
    padding: 0 1rem;
  }

  .example-section {
    padding: 1.5rem;
  }

  .button-group {
    flex-direction: column;
  }

  .demo-button {
    display: block;
    width: 100%;
    margin-bottom: 0.5rem;
    margin-right: 0;
  }

  .fullscreen-demo {
    grid-template-columns: 1fr;
  }
}
</style>

<script lang="ts">
export default { name: 'ModalExample' };
</script>
