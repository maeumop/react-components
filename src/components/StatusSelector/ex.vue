<script setup lang="ts">
import FloatingBackButton from '@/views/FloatingBackButton/index.vue';
import { ref } from 'vue';
import StatusSelector from './index.vue';
import type { StatusSelectorItem } from './types';

// 예제 데이터
const statusOptions: StatusSelectorItem[] = [
  { text: '대기중', value: 'pending', color: 'warning' },
  { text: '진행중', value: 'processing', color: 'info' },
  { text: '완료', value: 'completed', color: 'success' },
  { text: '오류', value: 'error', color: 'error' },
  { text: '취소', value: 'cancelled', color: 'secondary' },
];

const customColorOptions: StatusSelectorItem[] = [
  { text: '높음', value: 'high', color: '#dc3545' },
  { text: '보통', value: 'medium', color: '#ffc107' },
  { text: '낮음', value: 'low', color: '#28a745' },
];

// 상태 관리
const selectedStatus = ref<string>('pending');
const selectedCustomStatus = ref<string>('medium');
const selectedReadOnly = ref<string>('completed');

// 이벤트 핸들러
const handleStatusChange = (value: string, index: number) => {
  console.log(`상태 변경: ${value} (인덱스: ${index})`);
};

const handleCustomStatusChange = (value: string, index: number) => {
  console.log(`커스텀 상태 변경: ${value} (인덱스: ${index})`);
};
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <h1>StatusSelector Component Examples</h1>
        <p>Vue 3 + TypeScript로 개발된 상태 선택 컴포넌트</p>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <!-- 기본 사용법 -->
        <section class="example-section">
          <h2>기본 사용법</h2>
          <div class="example-grid">
            <div class="example-item">
              <StatusSelector
                v-model="selectedStatus"
                :options="statusOptions"
                @change="handleStatusChange"
              />
              <span class="example-label">기본 상태 선택기</span>
            </div>
            <div class="example-item">
              <StatusSelector
                v-model="selectedStatus"
                :options="statusOptions"
                circle
                @change="handleStatusChange"
              />
              <span class="example-label">원형 표시기 포함</span>
            </div>
          </div>
        </section>

        <!-- 사이즈 변형 -->
        <section class="example-section">
          <h2>사이즈 변형</h2>
          <div class="example-grid">
            <div class="example-item">
              <StatusSelector
                v-model="selectedStatus"
                :options="statusOptions"
                size="small"
                @change="handleStatusChange"
              />
              <span class="example-label">Small Size</span>
            </div>
            <div class="example-item">
              <StatusSelector
                v-model="selectedStatus"
                :options="statusOptions"
                size="medium"
                @change="handleStatusChange"
              />
              <span class="example-label">Medium Size (기본)</span>
            </div>
            <div class="example-item">
              <StatusSelector
                v-model="selectedStatus"
                :options="statusOptions"
                size="large"
                @change="handleStatusChange"
              />
              <span class="example-label">Large Size</span>
            </div>
          </div>
        </section>

        <!-- 사이즈 + 원형 표시기 -->
        <section class="example-section">
          <h2>사이즈 + 원형 표시기</h2>
          <div class="example-grid">
            <div class="example-item">
              <StatusSelector
                v-model="selectedStatus"
                :options="statusOptions"
                size="small"
                circle
                @change="handleStatusChange"
              />
              <span class="example-label">Small + Circle</span>
            </div>
            <div class="example-item">
              <StatusSelector
                v-model="selectedStatus"
                :options="statusOptions"
                size="medium"
                circle
                @change="handleStatusChange"
              />
              <span class="example-label">Medium + Circle</span>
            </div>
            <div class="example-item">
              <StatusSelector
                v-model="selectedStatus"
                :options="statusOptions"
                size="large"
                circle
                @change="handleStatusChange"
              />
              <span class="example-label">Large + Circle</span>
            </div>
          </div>
        </section>

        <!-- 커스텀 색상 -->
        <section class="example-section">
          <h2>커스텀 색상</h2>
          <div class="example-grid">
            <div class="example-item">
              <StatusSelector
                v-model="selectedCustomStatus"
                :options="customColorOptions"
                @change="handleCustomStatusChange"
              />
              <span class="example-label">커스텀 색상</span>
            </div>
            <div class="example-item">
              <StatusSelector
                v-model="selectedCustomStatus"
                :options="customColorOptions"
                circle
                @change="handleCustomStatusChange"
              />
              <span class="example-label">커스텀 색상 + 원형 표시기</span>
            </div>
          </div>
        </section>

        <!-- 읽기 전용 모드 -->
        <section class="example-section">
          <h2>읽기 전용 모드</h2>
          <div class="example-grid">
            <div class="example-item">
              <StatusSelector
                v-model="selectedReadOnly"
                :options="statusOptions"
                :read-only="true"
              />
              <span class="example-label">읽기 전용</span>
            </div>
            <div class="example-item">
              <StatusSelector
                v-model="selectedReadOnly"
                :options="statusOptions"
                circle
                :read-only="true"
              />
              <span class="example-label">읽기 전용 + 원형 표시기</span>
            </div>
          </div>
        </section>

        <!-- 접근성 테스트 -->
        <section class="example-section">
          <h2>접근성 테스트</h2>
          <div class="accessibility-info">
            <h3>키보드 네비게이션</h3>
            <ul>
              <li><strong>Enter/Space</strong>: 상태 선택기 열기/닫기</li>
              <li><strong>Arrow Down/Up</strong>: 옵션 간 이동</li>
              <li><strong>Escape</strong>: 선택기 닫기</li>
            </ul>
          </div>
          <div class="example-grid">
            <div class="example-item">
              <StatusSelector
                v-model="selectedStatus"
                :options="statusOptions"
                circle
                @change="handleStatusChange"
              />
              <span class="example-label">키보드로 테스트</span>
            </div>
          </div>
        </section>

        <!-- 현재 선택된 값 표시 -->
        <section class="example-section">
          <h2>현재 선택된 값</h2>
          <div class="status-display">
            <div class="status-item"><strong>기본 상태:</strong> {{ selectedStatus }}</div>
            <div class="status-item"><strong>커스텀 상태:</strong> {{ selectedCustomStatus }}</div>
            <div class="status-item"><strong>읽기 전용 상태:</strong> {{ selectedReadOnly }}</div>
          </div>
        </section>
      </div>
    </main>

    <!-- Floating Back Button -->
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
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #f8f9fa;
  transition: box-shadow 0.2s ease;

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

.accessibility-info {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  margin-bottom: 2rem;

  h3 {
    margin: 0 0 1rem 0;
    color: #495057;
    font-size: 1.1rem;
    font-weight: 600;
  }

  ul {
    margin: 0;
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

.status-display {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e9ecef;

  .status-item {
    margin-bottom: 1rem;
    padding: 0.75rem;
    background: white;
    border-radius: 6px;
    border-left: 4px solid #667eea;

    &:last-child {
      margin-bottom: 0;
    }

    strong {
      color: #495057;
      font-weight: 600;
    }
  }
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
