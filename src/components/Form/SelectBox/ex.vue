<script setup lang="ts">
import FloatingBackButton from '@/views/FloatingBackButton/index.vue';
import { ref } from 'vue';
import SelectBox from './index.vue';

// 기본 선택
const basicSelect = ref<string>('');
const multipleSelect = ref<string[]>([]);

// 유효성 검사
const validateSelect = ref<string>('');
const validateMultiple = ref<string[]>([]);

// 검색 기능
const searchableSelect = ref<string>('');

// 옵션 데이터
const options = ref([
  { text: '옵션 1', value: 'option1' },
  { text: '옵션 2', value: 'option2' },
  { text: '옵션 3', value: 'option3' },
  { text: '옵션 4', value: 'option4' },
  { text: '옵션 5', value: 'option5' },
  { text: '옵션 6', value: 'option6' },
  { text: '옵션 7', value: 'option7' },
  { text: '옵션 8', value: 'option8' },
]);

const longOptions = ref([
  { text: '매우 긴 옵션 텍스트 1', value: 'long1' },
  { text: '매우 긴 옵션 텍스트 2', value: 'long2' },
  { text: '매우 긴 옵션 텍스트 3', value: 'long3' },
  { text: '매우 긴 옵션 텍스트 4', value: 'long4' },
  { text: '매우 긴 옵션 텍스트 5', value: 'long5' },
]);

// 유효성 검사 함수들
const validateRequired = (value: unknown): string | boolean => {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '필수 선택 항목입니다.';
    }
  } else {
    if (!value || value === '') {
      return '필수 선택 항목입니다.';
    }
  }
  return true;
};

const validateMinSelection = (value: unknown): string | boolean => {
  if (Array.isArray(value) && value.length < 2) {
    return '최소 2개 이상 선택해주세요.';
  }
  return true;
};

const validateMaxSelection = (value: unknown): string | boolean => {
  if (Array.isArray(value) && value.length > 3) {
    return '최대 3개까지 선택 가능합니다.';
  }
  return true;
};
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <h1>SelectBox Component Examples</h1>
        <p>Vue 3 + TypeScript로 개발된 선택 박스 컴포넌트</p>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <!-- 기본 선택 -->
        <section class="example-section">
          <h2>기본 선택</h2>
          <div class="example-grid">
            <div class="example-item">
              <SelectBox
                v-model="basicSelect"
                :options="options"
                placeholder="옵션을 선택하세요"
                block
              />
              <span class="example-label">단일 선택</span>
            </div>
            <div class="example-item">
              <SelectBox
                v-model="multipleSelect"
                :options="options"
                :multiple="true"
                placeholder="여러 옵션을 선택하세요"
                block
              />
              <span class="example-label">다중 선택</span>
            </div>
          </div>
        </section>

        <!-- 라벨과 스타일 -->
        <section class="example-section">
          <h2>라벨과 스타일</h2>
          <div class="example-grid">
            <div class="example-item">
              <SelectBox
                v-model="basicSelect"
                :options="options"
                label="카테고리"
                placeholder="카테고리를 선택하세요"
                required
                block
              />
              <span class="example-label">라벨 + 필수 표시</span>
            </div>
            <div class="example-item">
              <SelectBox
                v-model="basicSelect"
                :options="longOptions"
                :isShort="true"
                :multiple="true"
                placeholder="짧은 표시 모드"
                block
              />
              <span class="example-label">짧은 표시 모드</span>
            </div>
          </div>
        </section>

        <!-- 유효성 검사 -->
        <section class="example-section">
          <h2>유효성 검사</h2>
          <div class="example-grid">
            <div class="example-item">
              <SelectBox
                v-model="validateSelect"
                :options="options"
                :validate="[validateRequired]"
                placeholder="필수 선택"
                required
                block
              />
              <span class="example-label">필수 선택 검사</span>
            </div>
            <div class="example-item">
              <SelectBox
                v-model="validateMultiple"
                :options="options"
                :multiple="true"
                :validate="[validateRequired, validateMinSelection, validateMaxSelection]"
                placeholder="2-3개 선택"
                required
                block
              />
              <span class="example-label">범위 선택 검사</span>
            </div>
          </div>
        </section>

        <!-- 검색 기능 -->
        <section class="example-section">
          <h2>검색 기능</h2>
          <div class="example-grid">
            <div class="example-item">
              <SelectBox
                v-model="searchableSelect"
                :options="longOptions"
                :searchable="true"
                placeholder="검색하여 선택하세요"
                block
              />
              <span class="example-label">검색 가능한 선택</span>
            </div>
          </div>
        </section>

        <!-- 적용 버튼 -->
        <section class="example-section">
          <h2>적용 버튼</h2>
          <div class="example-grid">
            <div class="example-item">
              <SelectBox
                v-model="multipleSelect"
                :options="options"
                :multiple="true"
                :btnAccept="true"
                placeholder="적용 버튼이 있는 다중 선택"
                block
              />
              <span class="example-label">적용 버튼 모드</span>
            </div>
          </div>
        </section>

        <!-- 상태별 표시 -->
        <section class="example-section">
          <h2>상태별 표시</h2>
          <div class="example-grid">
            <div class="example-item">
              <SelectBox
                v-model="basicSelect"
                :options="options"
                placeholder="읽기 전용"
                readonly
                block
              />
              <span class="example-label">읽기 전용</span>
            </div>
            <div class="example-item">
              <SelectBox
                v-model="basicSelect"
                :options="options"
                :disabled="true"
                placeholder="비활성화 상태"
                block
              />
              <span class="example-label">비활성화 상태</span>
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

// 스크롤 테스트 스타일
.scroll-test-container {
  border: 2px solid #667eea;
  border-radius: 8px;
  background: #f8f9fa;
  padding: 1rem;
}

.scroll-content {
  height: 400px;
  overflow-y: auto;
  padding: 2rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e9ecef;

  p {
    margin: 1rem 0;
    padding: 1rem;
    background: #e3f2fd;
    border-radius: 4px;
    color: #1976d2;
    font-weight: 500;
  }
}

.select-in-scroll {
  margin: 2rem 0;
  padding: 1rem;
  background: #fff3e0;
  border-radius: 6px;
  border: 1px solid #ffb74d;
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
