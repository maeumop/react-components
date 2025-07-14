<script setup lang="ts">
import FloatingBackButton from '@/views/FloatingBackButton/index.vue';
import { computed, ref } from 'vue';
import Pagination from './index.vue';

// 샘플 데이터
const totalItems = ref<number>(16723);
const pageSize = ref<number>(20);
const currentPage = ref<number>(1);
const isLoading = ref<boolean>(false);

// 계산된 속성
const totalPages = computed<number>(() => Math.ceil(totalItems.value / pageSize.value));

const startItem = computed<number>(() => (currentPage.value - 1) * pageSize.value + 1);

const endItem = computed<number>(() =>
  Math.min(currentPage.value * pageSize.value, totalItems.value),
);

// 이벤트 핸들러
const handlePageSizeChange = (size: number): void => {
  pageSize.value = size;
  currentPage.value = 1; // 첫 페이지로 리셋
  console.log('페이지 크기 변경:', size);
  // 실제로는 API 호출
};

// 로딩 시뮬레이션
const simulateLoading = (): void => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 2000);
};

// 데이터 변경 시뮬레이션
const changeTotalItems = (newTotal: number): void => {
  totalItems.value = newTotal;
  currentPage.value = 1;
};
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <h1>Pagination Component Examples</h1>
        <p>Vue 3 + TypeScript로 개발된 페이지네이션 컴포넌트</p>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <!-- 기본 페이지네이션 -->
        <section class="example-section">
          <h2>기본 페이지네이션</h2>
          <div class="example-item">
            <div class="info">
              <p>총 {{ totalItems }}개 항목, {{ totalPages }}페이지</p>
              <p>현재 {{ startItem }} - {{ endItem }} / {{ totalItems }}개 항목</p>
            </div>
            <Pagination
              v-model="currentPage"
              :total="totalItems"
              :size="pageSize"
              :block="10"
              @page-size-change="handlePageSizeChange"
            />
          </div>
        </section>

        <!-- 비활성화 상태 -->
        <section class="example-section">
          <h2>비활성화 상태</h2>
          <div class="example-item">
            <div class="info">
              <p>로딩 중일 때 페이지네이션 비활성화</p>
              <button @click="simulateLoading" class="demo-button">로딩 시뮬레이션 (2초)</button>
            </div>
            <Pagination
              v-model="currentPage"
              :total="totalItems"
              :size="pageSize"
              :block="10"
              :disabled="isLoading"
              @page-size-change="handlePageSizeChange"
            />
          </div>
        </section>

        <!-- 커스텀 페이지 크기 옵션 -->
        <section class="example-section">
          <h2>커스텀 페이지 크기 옵션</h2>
          <div class="example-item">
            <Pagination
              v-model="currentPage"
              :total="totalItems"
              :size="pageSize"
              :block="10"
              :page-size-options="[5, 10, 25, 50, 100, 200]"
              @page-size-change="handlePageSizeChange"
            />
          </div>
        </section>

        <!-- 작은 데이터셋 -->
        <section class="example-section">
          <h2>작은 데이터셋</h2>
          <div class="example-item">
            <div class="info">
              <p>적은 수의 데이터로 페이지네이션 테스트</p>
              <div class="button-group">
                <button @click="changeTotalItems(50)" class="demo-button">50개 항목</button>
                <button @click="changeTotalItems(10)" class="demo-button">10개 항목</button>
                <button @click="changeTotalItems(5)" class="demo-button">5개 항목</button>
                <button @click="changeTotalItems(0)" class="demo-button">0개 항목</button>
              </div>
            </div>
            <Pagination
              v-model="currentPage"
              :total="totalItems"
              :size="pageSize"
              :block="5"
              @page-size-change="handlePageSizeChange"
            />
          </div>
        </section>

        <!-- 큰 데이터셋 -->
        <section class="example-section">
          <h2>큰 데이터셋</h2>
          <div class="example-item">
            <div class="info">
              <p>많은 수의 데이터로 페이지네이션 테스트</p>
              <div class="button-group">
                <button @click="changeTotalItems(100000)" class="demo-button">
                  100,000개 항목
                </button>
                <button @click="changeTotalItems(1000000)" class="demo-button">
                  1,000,000개 항목
                </button>
              </div>
            </div>
            <Pagination
              v-model="currentPage"
              :total="totalItems"
              :size="pageSize"
              :block="10"
              @page-size-change="handlePageSizeChange"
            />
          </div>
        </section>

        <!-- 커스텀 접근성 라벨 -->
        <section class="example-section">
          <h2>커스텀 접근성 라벨</h2>
          <div class="example-item">
            <Pagination
              v-model="currentPage"
              :total="totalItems"
              :size="pageSize"
              :block="10"
              aria-label="사용자 목록 페이지네이션"
              @page-size-change="handlePageSizeChange"
            />
          </div>
        </section>

        <!-- 페이지 크기 선택기 없음 -->
        <section class="example-section">
          <h2>페이지 크기 선택기 없음</h2>
          <div class="example-item">
            <Pagination
              v-model="currentPage"
              :total="totalItems"
              :size="pageSize"
              :block="10"
              :page-size-options="[]"
            />
          </div>
        </section>

        <!-- 현재 상태 표시 -->
        <section class="example-section">
          <h2>현재 상태</h2>
          <div class="example-item">
            <div class="status-info">
              <div class="status-item"><strong>현재 페이지:</strong> {{ currentPage }}</div>
              <div class="status-item"><strong>페이지 크기:</strong> {{ pageSize }}</div>
              <div class="status-item"><strong>총 항목:</strong> {{ totalItems }}</div>
              <div class="status-item"><strong>총 페이지:</strong> {{ totalPages }}</div>
              <div class="status-item">
                <strong>표시 범위:</strong> {{ startItem }} - {{ endItem }}
              </div>
            </div>
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
  align-items: center;
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
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 1rem;
}

.demo-button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;

  &:hover {
    background: #2563eb;
  }

  &:active {
    background: #1d4ed8;
  }
}

.status-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  width: 100%;
  max-width: 600px;

  .status-item {
    background: #f3f4f6;
    padding: 1rem;
    border-radius: 0.25rem;
    text-align: center;

    strong {
      color: #374151;
      display: block;
      margin-bottom: 0.25rem;
    }
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
    align-items: center;
  }

  .status-info {
    grid-template-columns: 1fr;
  }
}
</style>

<script lang="ts">
export default { name: 'PaginationExample' };
</script>
