<script setup lang="ts">
import FloatingBackButton from '@/views/FloatingBackButton/index.vue';
import { reactive, ref } from 'vue';
import StyledButton from './index.vue';

// 드롭다운 상태
const isDropdownOpen = ref(false);
const isMenuOpen = ref(false);

// 폼 데이터
const formData = reactive({
  email: '',
  message: '',
});

const isSubmitting = ref(false);

// 이벤트 예제 데이터
const clickCount = ref(0);
const lastClickTime = ref('없음');
const counter = ref(0);

// 드롭다운 토글
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// 폼 제출
const submitForm = async () => {
  if (!formData.email || !formData.message) {
    alert('모든 필드를 입력해주세요.');
    return;
  }

  isSubmitting.value = true;

  // API 호출 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('폼 제출:', formData);
  alert('폼이 성공적으로 제출되었습니다!');

  isSubmitting.value = false;
  resetForm();
};

// 폼 리셋
const resetForm = () => {
  formData.email = '';
  formData.message = '';
};

// 클릭 이벤트 처리
const handleClick = (event: MouseEvent) => {
  clickCount.value++;
  lastClickTime.value = new Date().toLocaleTimeString();
  counter.value++;

  console.log('버튼 클릭:', event);
};
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <h1>StyledButton Component Examples</h1>
        <p>Vue 3 + TypeScript로 개발된 다재다능한 버튼 컴포넌트</p>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <!-- 기본 색상 버튼 -->
        <section class="example-section">
          <h2>기본 색상 버튼</h2>
          <div class="example-grid">
            <div class="example-item">
              <StyledButton color="primary">Primary</StyledButton>
              <span class="example-label">Primary</span>
            </div>
            <div class="example-item">
              <StyledButton color="secondary">Secondary</StyledButton>
              <span class="example-label">Secondary</span>
            </div>
            <div class="example-item">
              <StyledButton color="success">Success</StyledButton>
              <span class="example-label">Success</span>
            </div>
            <div class="example-item">
              <StyledButton color="warning">Warning</StyledButton>
              <span class="example-label">Warning</span>
            </div>
            <div class="example-item">
              <StyledButton color="error">Error</StyledButton>
              <span class="example-label">Error</span>
            </div>
            <div class="example-item">
              <StyledButton color="info">Info</StyledButton>
              <span class="example-label">Info</span>
            </div>
            <div class="example-item">
              <StyledButton color="light">Light</StyledButton>
              <span class="example-label">Light</span>
            </div>
            <div class="example-item">
              <StyledButton color="dark">Dark</StyledButton>
              <span class="example-label">Dark</span>
            </div>
          </div>
        </section>

        <!-- 크기별 버튼 -->
        <section class="example-section">
          <h2>크기별 버튼</h2>
          <div class="example-grid">
            <div class="example-item">
              <StyledButton small color="primary">작은 버튼</StyledButton>
              <span class="example-label">Small (가장 작음)</span>
            </div>
            <div class="example-item">
              <StyledButton color="primary">기본</StyledButton>
              <span class="example-label">Default (중간)</span>
            </div>
            <div class="example-item">
              <StyledButton large color="primary">큰 버튼</StyledButton>
              <span class="example-label">Large (가장 큼)</span>
            </div>
          </div>
        </section>

        <!-- 스타일 변형 -->
        <section class="example-section">
          <h2>스타일 변형</h2>
          <div class="example-grid">
            <div class="example-item">
              <StyledButton color="primary">Filled</StyledButton>
              <span class="example-label">Filled (기본)</span>
            </div>
            <div class="example-item">
              <StyledButton :style="'text'" color="primary">Text</StyledButton>
              <span class="example-label">Text</span>
            </div>
            <div class="example-item">
              <StyledButton :style="'outline'" color="primary">Outline</StyledButton>
              <span class="example-label">Outline</span>
            </div>
            <div class="example-item">
              <StyledButton onlyIcon icon="mdi:home" color="primary" />
              <span class="example-label">Icon Only</span>
            </div>
          </div>
        </section>

        <!-- 아이콘 버튼 -->
        <section class="example-section">
          <h2>아이콘 버튼</h2>
          <div class="example-grid">
            <div class="example-item">
              <StyledButton icon="mdi:plus" color="success">추가</StyledButton>
              <span class="example-label">왼쪽 아이콘</span>
            </div>
            <div class="example-item">
              <StyledButton icon="mdi:arrow-right" iconRight color="info">다음</StyledButton>
              <span class="example-label">오른쪽 아이콘</span>
            </div>
            <div class="example-item">
              <StyledButton icon="mdi:download" color="warning">다운로드</StyledButton>
              <span class="example-label">다운로드</span>
            </div>
            <div class="example-item">
              <StyledButton icon="mdi:share" iconRight color="secondary">공유</StyledButton>
              <span class="example-label">공유</span>
            </div>
          </div>
        </section>

        <!-- 아이콘 전용 버튼 -->
        <section class="example-section">
          <h2>아이콘 전용 버튼</h2>
          <div class="example-grid">
            <div class="example-item">
              <StyledButton onlyIcon icon="mdi:menu" color="primary" />
              <span class="example-label">메뉴</span>
            </div>
            <div class="example-item">
              <StyledButton onlyIcon icon="mdi:search" color="secondary" />
              <span class="example-label">검색</span>
            </div>
            <div class="example-item">
              <StyledButton onlyIcon icon="mdi:heart" color="error" />
              <span class="example-label">하트 아이콘</span>
            </div>
            <div class="example-item">
              <StyledButton onlyIcon icon="mdi:star" color="warning" />
              <span class="example-label">즐겨찾기</span>
            </div>
            <div class="example-item">
              <StyledButton onlyIcon icon="mdi:email" color="info" />
              <span class="example-label">메일</span>
            </div>
            <div class="example-item">
              <StyledButton onlyIcon icon="mdi:settings" color="dark" />
              <span class="example-label">설정</span>
            </div>
          </div>
        </section>

        <!-- Width 설정 버튼 -->
        <section class="example-section">
          <h2>Width 설정 버튼</h2>
          <div class="example-grid">
            <div class="example-item">
              <StyledButton :width="120" color="primary">120px</StyledButton>
              <span class="example-label">숫자 (120px)</span>
            </div>
            <div class="example-item">
              <StyledButton width="200px" color="success">200px</StyledButton>
              <span class="example-label">문자열 (200px)</span>
            </div>
            <div class="example-item">
              <StyledButton width="50%" color="warning">50%</StyledButton>
              <span class="example-label">퍼센트 (50%)</span>
            </div>
            <div class="example-item">
              <StyledButton width="10rem" color="info">10rem</StyledButton>
              <span class="example-label">rem 단위 (10rem)</span>
            </div>
            <div class="example-item">
              <StyledButton :width="300" color="secondary">300px</StyledButton>
              <span class="example-label">넓은 버튼 (300px)</span>
            </div>
            <div class="example-item">
              <StyledButton width="100%" color="dark">전체 너비</StyledButton>
              <span class="example-label">전체 너비 (100%)</span>
            </div>
          </div>
        </section>

        <!-- 상태별 버튼 -->
        <section class="example-section">
          <h2>상태별 버튼</h2>
          <div class="example-grid">
            <div class="example-item">
              <StyledButton color="primary">정상</StyledButton>
              <span class="example-label">정상</span>
            </div>
            <div class="example-item">
              <StyledButton loading color="success">로딩 중...</StyledButton>
              <span class="example-label">Loading</span>
            </div>
            <div class="example-item">
              <StyledButton disabled color="error">비활성화</StyledButton>
              <span class="example-label">Disabled</span>
            </div>
            <div class="example-item">
              <StyledButton block color="primary">전체 너비</StyledButton>
              <span class="example-label">Block</span>
            </div>
          </div>
        </section>

        <!-- 드롭다운 토글 버튼 -->
        <section class="example-section">
          <h2>드롭다운 토글 버튼</h2>
          <div class="example-grid">
            <div class="example-item">
              <StyledButton
                icon="mdi:chevron-down"
                :dropMenuToggle="isDropdownOpen"
                @click="toggleDropdown"
                color="primary"
              >
                드롭다운
              </StyledButton>
              <span class="example-label">토글 상태: {{ isDropdownOpen ? '열림' : '닫힘' }}</span>
            </div>
            <div class="example-item">
              <StyledButton
                onlyIcon
                icon="mdi:dots-vertical"
                :dropMenuToggle="isMenuOpen"
                @click="toggleMenu"
                color="secondary"
              />
              <span class="example-label">메뉴 토글</span>
            </div>
          </div>
        </section>

        <!-- 링크 버튼 -->
        <section class="example-section">
          <h2>링크 버튼</h2>
          <div class="example-grid">
            <div class="example-item">
              <StyledButton
                href="https://github.com"
                target="_blank"
                icon="mdi:github"
                color="dark"
              >
                GitHub
              </StyledButton>
              <span class="example-label">외부 링크</span>
            </div>
            <div class="example-item">
              <StyledButton href="/about" icon="mdi:information" color="info"> 정보 </StyledButton>
              <span class="example-label">내부 링크</span>
            </div>
          </div>
        </section>

        <!-- 폼 예제 -->
        <section class="example-section">
          <h2>폼 예제</h2>
          <div class="form-example">
            <div class="form-group">
              <label for="email">이메일</label>
              <input
                id="email"
                type="email"
                v-model="formData.email"
                placeholder="이메일을 입력하세요"
                required
              />
            </div>

            <div class="form-group">
              <label for="message">메시지</label>
              <textarea
                id="message"
                v-model="formData.message"
                placeholder="메시지를 입력하세요"
                rows="3"
              ></textarea>
            </div>

            <div class="form-actions">
              <StyledButton :style="'text'" color="secondary" @click="resetForm">
                취소
              </StyledButton>
              <StyledButton color="success" :loading="isSubmitting" @click="submitForm">
                {{ isSubmitting ? '제출 중...' : '제출' }}
              </StyledButton>
            </div>
          </div>
        </section>

        <!-- 이벤트 예제 -->
        <section class="example-section">
          <h2>이벤트 예제</h2>
          <div class="event-example">
            <div class="event-info">
              <p>클릭 횟수: {{ clickCount }}</p>
              <p>마지막 클릭 시간: {{ lastClickTime }}</p>
            </div>
            <div class="example-grid">
              <div class="example-item">
                <StyledButton color="primary" @click="handleClick"> 클릭하세요 </StyledButton>
                <span class="example-label">클릭 이벤트</span>
              </div>
              <div class="example-item">
                <StyledButton color="warning" @click="handleClick" icon="mdi:plus">
                  카운터 증가
                </StyledButton>
                <span class="example-label">카운터: {{ counter }}</span>
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
  margin-bottom: 3rem;
  padding: 2rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  h2 {
    margin: 0 0 1.5rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #374151;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 0.5rem;
  }
}

.example-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.example-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: #f9fafb;
  transition: all 0.2s ease;

  &:hover {
    border-color: #d1d5db;
    background-color: #f3f4f6;
  }
}

.example-label {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  font-weight: 500;
}

.form-example {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #374151;
  }

  input,
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1rem;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.event-example {
  .event-info {
    background-color: #f3f4f6;
    padding: 1rem;
    border-radius: 0.375rem;
    margin-bottom: 1rem;

    p {
      margin: 0.25rem 0;
      font-family: monospace;
      color: #374151;
    }
  }
}

// 반응형 디자인
@media (max-width: 768px) {
  .example-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .app-header h1 {
    font-size: 2rem;
  }
}
</style>
