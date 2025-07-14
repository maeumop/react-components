<script setup lang="ts">
import FloatingBackButton from '@/views/FloatingBackButton/index.vue';
import { ref } from 'vue';
import { RuleFunc } from '../../types';
import CheckButton from './index.vue';
import { CheckButtonItem, CheckButtonModel } from './types';

// 기본 체크박스
const selectedHobbies = ref<string[]>([]);
const hobbyItems: CheckButtonItem[] = [
  { text: '독서', value: 'reading' },
  { text: '운동', value: 'sports' },
  { text: '음악 감상', value: 'music' },
  { text: '요리', value: 'cooking' },
  { text: '여행', value: 'travel' },
  { text: '게임', value: 'gaming' },
];

// 라디오 버튼
const selectedGender = ref<string>('');
const genderItems: CheckButtonItem[] = [
  { text: '남성', value: 'male' },
  { text: '여성', value: 'female' },
  { text: '기타', value: 'other' },
];

// 버튼 UI 모드
const selectedOptions = ref<string[]>([]);
const optionItems: CheckButtonItem[] = [
  { text: '옵션 1', value: 'option1' },
  { text: '옵션 2', value: 'option2' },
  { text: '옵션 3', value: 'option3' },
];

// 다양한 색상
const selectedPrimary = ref<string[]>([]);
const selectedSuccess = ref<string[]>([]);
const selectedWarning = ref<string[]>([]);
const selectedError = ref<string[]>([]);
const colorItems: CheckButtonItem[] = [
  { text: '항목 1', value: 'item1' },
  { text: '항목 2', value: 'item2' },
  { text: '항목 3', value: 'item3' },
];

// 최대 선택 제한
const selectedLimited = ref<string[]>([]);
const limitedItems: CheckButtonItem[] = [
  { text: '항목 1', value: 'item1' },
  { text: '항목 2', value: 'item2' },
  { text: '항목 3', value: 'item3' },
  { text: '항목 4', value: 'item4' },
];

// 전체 선택 기능
const selectedAll = ref<string[]>([]);
const allItems: CheckButtonItem[] = [
  { text: '항목 1', value: 'item1' },
  { text: '항목 2', value: 'item2' },
  { text: '항목 3', value: 'item3' },
];

// 유효성 검사
const checkButtonRef = ref<CheckButtonModel>();
const selectedValidated = ref<string[]>([]);
const validatedItems: CheckButtonItem[] = [
  { text: '항목 1', value: 'item1' },
  { text: '항목 2', value: 'item2' },
  { text: '항목 3', value: 'item3' },
];

const validators: RuleFunc[] = [
  (value: unknown) => {
    if (Array.isArray(value) && value.length === 0) {
      return '최소 1개 이상 선택해주세요.';
    }
    return true;
  },
  (value: unknown) => {
    if (Array.isArray(value) && value.length > 2) {
      return '최대 2개까지만 선택 가능합니다.';
    }
    return true;
  },
];

const validate = () => {
  const isValid = checkButtonRef.value?.check();
  console.log('유효성 검사 결과:', isValid);
};

// 라인 제한
const selectedLineLimit = ref<string[]>([]);
const lineLimitItems: CheckButtonItem[] = [
  { text: '항목 1', value: 'item1' },
  { text: '항목 2', value: 'item2' },
  { text: '항목 3', value: 'item3' },
  { text: '항목 4', value: 'item4' },
  { text: '항목 5', value: 'item5' },
  { text: '항목 6', value: 'item6' },
];

// 비활성화 상태
const selectedDisabled = ref<string[]>([]);
const disabledItems: CheckButtonItem[] = [
  { text: '활성 항목 1', value: 'active1' },
  { text: '활성 항목 2', value: 'active2' },
  { text: '활성 항목 3', value: 'active3' },
];

// 블록 모드
const selectedBlock = ref<string[]>([]);
const blockItems: CheckButtonItem[] = [
  { text: '블록 항목 1', value: 'block1' },
  { text: '블록 항목 2', value: 'block2' },
  { text: '블록 항목 3', value: 'block3' },
];
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <h1>CheckButton Component Examples</h1>
        <p>Vue CheckButton 컴포넌트 사용 예제</p>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <!-- 기본 체크박스 -->
        <section class="example-section">
          <h2>기본 체크박스</h2>
          <div class="example-item">
            <CheckButton
              v-model="selectedHobbies"
              :items="hobbyItems"
              name="hobbies"
              label="취미"
            />
            <div class="result">선택된 값: {{ selectedHobbies }}</div>
          </div>
        </section>

        <!-- 라디오 버튼 -->
        <section class="example-section">
          <h2>라디오 버튼</h2>
          <div class="example-item">
            <CheckButton
              v-model="selectedGender"
              :items="genderItems"
              name="gender"
              type="radio"
              label="성별"
              required
            />
            <div class="result">선택된 값: {{ selectedGender }}</div>
          </div>
        </section>

        <!-- 버튼 UI 모드 -->
        <section class="example-section">
          <h2>버튼 UI 모드</h2>
          <div class="example-item">
            <CheckButton
              v-model="selectedOptions"
              :items="optionItems"
              name="options"
              button
              color="success"
              label="옵션 선택"
            />
            <div class="result">선택된 값: {{ selectedOptions }}</div>
          </div>
        </section>

        <!-- 다양한 색상 -->
        <section class="example-section">
          <h2>다양한 색상</h2>
          <div class="example-grid">
            <div class="example-item">
              <CheckButton
                v-model="selectedPrimary"
                :items="colorItems"
                name="primary"
                color="primary"
                label="Primary"
              />
              <span class="example-label">Primary</span>
            </div>

            <div class="example-item">
              <CheckButton
                v-model="selectedSuccess"
                :items="colorItems"
                name="success"
                color="success"
                label="Success"
              />
              <span class="example-label">Success</span>
            </div>

            <div class="example-item">
              <CheckButton
                v-model="selectedWarning"
                :items="colorItems"
                name="warning"
                color="warning"
                label="Warning"
              />
              <span class="example-label">Warning</span>
            </div>

            <div class="example-item">
              <CheckButton
                v-model="selectedError"
                :items="colorItems"
                name="error"
                color="error"
                label="Error"
              />
              <span class="example-label">Error</span>
            </div>
          </div>
        </section>

        <!-- 최대 선택 제한 -->
        <section class="example-section">
          <h2>최대 선택 제한 (2개)</h2>
          <div class="example-item">
            <CheckButton
              v-model="selectedLimited"
              :items="limitedItems"
              name="limited"
              :maxLength="2"
              label="최대 2개 선택"
            />
            <div class="result">선택된 값: {{ selectedLimited }}</div>
          </div>
        </section>

        <!-- 전체 선택 기능 -->
        <section class="example-section">
          <h2>전체 선택 기능</h2>
          <div class="example-item">
            <CheckButton
              v-model="selectedAll"
              :items="allItems"
              name="all"
              all
              label="전체 선택 포함"
            />
            <div class="result">선택된 값: {{ selectedAll }}</div>
          </div>
        </section>

        <!-- 유효성 검사 -->
        <section class="example-section">
          <h2>유효성 검사</h2>
          <div class="example-item">
            <CheckButton
              ref="checkButtonRef"
              v-model="selectedValidated"
              :items="validatedItems"
              name="validated"
              :validate="validators"
              label="유효성 검사 (최소 1개, 최대 2개)"
              required
            />
            <div class="result">선택된 값: {{ selectedValidated }}</div>
            <StyledButton color="primary" @click="validate">검증 실행</StyledButton>
          </div>
        </section>

        <!-- 라인 제한 -->
        <section class="example-section">
          <h2>라인 제한 (3개씩)</h2>
          <div class="example-item">
            <CheckButton
              v-model="selectedLineLimit"
              :items="lineLimitItems"
              name="lineLimit"
              :lineLimit="3"
              label="라인 제한"
            />
            <div class="result">선택된 값: {{ selectedLineLimit }}</div>
          </div>
        </section>

        <!-- 비활성화 상태 -->
        <section class="example-section">
          <h2>비활성화 상태</h2>
          <div class="example-item">
            <CheckButton
              v-model="selectedDisabled"
              :items="disabledItems"
              name="disabled"
              disabled
              label="비활성화된 체크박스"
            />
          </div>
        </section>

        <!-- 블록 모드 -->
        <section class="example-section">
          <h2>블록 모드</h2>
          <div class="example-item">
            <CheckButton
              v-model="selectedBlock"
              :items="blockItems"
              name="block"
              block
              label="블록 모드 (전체 너비)"
            />
            <div class="result">선택된 값: {{ selectedBlock }}</div>
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
}

.result {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 0.4rem;
  font-family: 'Courier New', monospace;
  font-size: 1.4rem;
  color: #495057;
  border-left: 4px solid #667eea;
}

.validate-btn {
  margin-top: 1rem;
  padding: 0.8rem 1.6rem;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 0.4rem;
  font-size: 1.4rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #5a6fd8;
  }
}

.example-label {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
  text-align: center;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .example-grid {
    grid-template-columns: 1fr;
  }

  .app-header h1 {
    font-size: 2rem;
  }

  .example-section {
    padding: 1.5rem;
  }
}
</style>
