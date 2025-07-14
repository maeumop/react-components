<script setup lang="ts">
import FloatingBackButton from '@/views/FloatingBackButton/index.vue';
import { ref } from 'vue';
import { tabsTransition, tabsVariant } from './const';
import Tabs from './index.vue';
import type { TabsTransition, TabsVariant } from './types.d';

// 기본 탭 데이터
const basicTabItems = ['홈', '프로필', '설정', '도움말'];

// 고급 탭 데이터
const advancedTabItems = ['개요', '상세정보', '통계', '설정', '로그'];
const advancedActiveTab = ref(0);
const disabledTabs = ref([false, false, true, false, false]);

// 스타일 변형
const currentVariant = ref<TabsVariant>('default');
const variantActiveTab = ref(0);
const variantTabItems = ['기본', '언더라인', '필스'];

// v-model 테스트
const vModelActiveTab = ref(0);
const vModelTabItems = ['탭 1', '탭 2', '탭 3'];

// 트랜지션 테스트
const currentTransition = ref<TabsTransition>('slide');
const transitionActiveTab = ref(0);
const transitionTabItems = ['첫 번째', '두 번째', '세 번째'];

// 이벤트 핸들러
const handleTabChange = (index: number): void => {
  console.log('탭 변경:', index);
};

const handleVModelChange = (index: number): void => {
  console.log('v-model 변경:', index);
};

// 스타일 변경
const changeVariant = (variant: TabsVariant): void => {
  currentVariant.value = variant;
  variantActiveTab.value = 0;
};

// 트랜지션 변경
const changeTransition = (transition: TabsTransition): void => {
  currentTransition.value = transition;
  transitionActiveTab.value = 0;
};

// 탭 활성화/비활성화 토글
const toggleDisabled = (index: number): void => {
  disabledTabs.value[index] = !disabledTabs.value[index];
};
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <h1>Tabs Component Examples</h1>
        <p>Vue 3 + TypeScript로 개발된 탭 컴포넌트</p>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <!-- 기본 사용법 -->
        <section class="example-section">
          <h2>기본 사용법</h2>
          <div class="example-grid">
            <div class="example-item">
              <Tabs :tab-items="basicTabItems" @change-tab="handleTabChange">
                <div class="tab-content">
                  <h3>홈 탭</h3>
                  <p>메인 페이지 내용입니다. 사용자가 처음 접하는 화면입니다.</p>
                </div>
                <div class="tab-content">
                  <h3>프로필 탭</h3>
                  <p>사용자 프로필 정보를 표시합니다. 개인정보 수정이 가능합니다.</p>
                </div>
                <div class="tab-content">
                  <h3>설정 탭</h3>
                  <p>애플리케이션 설정을 관리합니다. 테마, 언어, 알림 등을 설정할 수 있습니다.</p>
                </div>
                <div class="tab-content">
                  <h3>도움말 탭</h3>
                  <p>사용법과 FAQ를 제공합니다. 문제 해결을 위한 가이드를 확인하세요.</p>
                </div>
              </Tabs>
              <span class="example-label">기본 탭 컴포넌트</span>
            </div>
          </div>
        </section>

        <!-- v-model 사용법 -->
        <section class="example-section">
          <h2>v-model 사용법</h2>
          <div class="example-grid">
            <div class="example-item">
              <div class="control-panel">
                <p>
                  현재 활성 탭: <strong>{{ vModelActiveTab }}</strong>
                </p>
                <div class="button-group">
                  <button
                    v-for="(item, index) in vModelTabItems"
                    :key="index"
                    class="control-button"
                    :class="{ active: index === vModelActiveTab }"
                    @click="vModelActiveTab = index"
                  >
                    {{ item }}
                  </button>
                </div>
              </div>
              <Tabs
                v-model:active-tab="vModelActiveTab"
                :tab-items="vModelTabItems"
                @change-tab="handleVModelChange"
              >
                <div class="tab-content">
                  <h3>첫 번째 탭</h3>
                  <p>v-model로 외부에서 제어되는 탭입니다.</p>
                </div>
                <div class="tab-content">
                  <h3>두 번째 탭</h3>
                  <p>버튼을 클릭하여 탭을 전환할 수 있습니다.</p>
                </div>
                <div class="tab-content">
                  <h3>세 번째 탭</h3>
                  <p>v-model과 이벤트가 모두 정상 작동합니다.</p>
                </div>
              </Tabs>
              <span class="example-label">v-model로 외부 제어</span>
            </div>
          </div>
        </section>

        <!-- 스타일 변형 -->
        <section class="example-section">
          <h2>스타일 변형</h2>
          <div class="example-grid">
            <div class="example-item">
              <div class="variant-controls">
                <button
                  v-for="variant in Object.values(tabsVariant)"
                  :key="variant"
                  class="variant-button"
                  :class="{ active: currentVariant === variant }"
                  @click="changeVariant(variant)"
                >
                  {{ variant }}
                </button>
              </div>
              <Tabs
                v-model:active-tab="variantActiveTab"
                :tab-items="variantTabItems"
                :variant="currentVariant"
              >
                <div class="tab-content">
                  <h3>기본 스타일</h3>
                  <p>기본 탭 스타일입니다. 위쪽에 언더라인이 표시됩니다.</p>
                </div>
                <div class="tab-content">
                  <h3>언더라인 스타일</h3>
                  <p>깔끔한 언더라인 스타일입니다. 미니멀한 디자인을 제공합니다.</p>
                </div>
                <div class="tab-content">
                  <h3>필스 스타일</h3>
                  <p>둥근 모서리의 필스 스타일입니다. 모던한 느낌을 줍니다.</p>
                </div>
              </Tabs>
              <span class="example-label">다양한 스타일 변형</span>
            </div>
          </div>
        </section>

        <!-- 비활성화 탭 -->
        <section class="example-section">
          <h2>비활성화 탭</h2>
          <div class="example-grid">
            <div class="example-item">
              <div class="disabled-controls">
                <p>비활성화 상태 토글:</p>
                <div class="toggle-buttons">
                  <button
                    v-for="(disabled, index) in disabledTabs"
                    :key="index"
                    class="toggle-button"
                    :class="{ disabled: disabled }"
                    @click="toggleDisabled(index)"
                  >
                    탭 {{ index + 1 }}
                  </button>
                </div>
              </div>
              <Tabs
                v-model:active-tab="advancedActiveTab"
                :tab-items="advancedTabItems"
                :disabled="disabledTabs"
              >
                <div class="tab-content">
                  <h3>개요</h3>
                  <p>전체적인 요약 정보를 제공합니다.</p>
                </div>
                <div class="tab-content">
                  <h3>상세정보</h3>
                  <p>자세한 정보와 데이터를 표시합니다.</p>
                </div>
                <div class="tab-content">
                  <h3>통계</h3>
                  <p>현재 비활성화된 탭입니다.</p>
                </div>
                <div class="tab-content">
                  <h3>설정</h3>
                  <p>시스템 설정을 관리합니다.</p>
                </div>
                <div class="tab-content">
                  <h3>로그</h3>
                  <p>시스템 로그를 확인합니다.</p>
                </div>
              </Tabs>
              <span class="example-label">비활성화 탭 기능</span>
            </div>
          </div>
        </section>

        <!-- 박스 스타일 -->
        <section class="example-section">
          <h2>박스 스타일</h2>
          <div class="example-grid">
            <div class="example-item">
              <Tabs :tab-items="['정보', '설정', '도움말']" in-box>
                <div class="tab-content none-border">
                  <h3>정보</h3>
                  <p>박스 스타일로 감싸진 탭 콘텐츠입니다.</p>
                  <ul>
                    <li>테두리가 있는 박스 형태</li>
                    <li>내부 패딩이 적용됨</li>
                    <li>깔끔한 구분선 제공</li>
                  </ul>
                </div>
                <div class="tab-content none-border">
                  <h3>설정</h3>
                  <p>설정 관련 내용을 박스 안에 표시합니다.</p>
                  <div class="setting-item">
                    <label>테마 설정:</label>
                    <select>
                      <option>라이트</option>
                      <option>다크</option>
                    </select>
                  </div>
                </div>
                <div class="tab-content none-border">
                  <h3>도움말</h3>
                  <p>사용법과 FAQ를 제공합니다.</p>
                  <div class="help-item">
                    <strong>Q: 탭을 어떻게 전환하나요?</strong>
                    <p>A: 탭을 클릭하거나 키보드 방향키를 사용하세요.</p>
                  </div>
                </div>
              </Tabs>
              <span class="example-label">박스 스타일 (in-box)</span>
            </div>
          </div>
        </section>

        <!-- 트랜지션 효과 -->
        <section class="example-section">
          <h2>트랜지션 효과</h2>
          <div class="example-grid">
            <div class="example-item">
              <div class="transition-controls">
                <p>트랜지션 효과 선택:</p>
                <div class="transition-buttons">
                  <button
                    v-for="transition in Object.values(tabsTransition) as TabsTransition[]"
                    :key="transition"
                    class="transition-button"
                    :class="{ active: currentTransition === transition }"
                    @click="changeTransition(transition)"
                  >
                    {{ transition }}
                  </button>
                </div>
              </div>
              <Tabs
                v-model:active-tab="transitionActiveTab"
                :tab-items="transitionTabItems"
                :transition="currentTransition"
                in-box
              >
                <div class="tab-content none-border">
                  <h3>첫 번째 탭</h3>
                  <p>다양한 트랜지션 효과를 확인해보세요.</p>
                  <div class="transition-info">
                    <strong>현재 효과:</strong> {{ currentTransition }}
                  </div>
                  <ul>
                    <li><strong>slide:</strong> 좌우 슬라이드 효과</li>
                    <li><strong>fade:</strong> 페이드 인/아웃 효과</li>
                    <li><strong>scale:</strong> 크기 변화 효과</li>
                    <li><strong>flip:</strong> 3D 효과로 현대적인 느낌 (방향별 회전)</li>
                    <li><strong>bounce:</strong> 바운스 애니메이션</li>
                  </ul>
                </div>
                <div class="tab-content none-border">
                  <h3>두 번째 탭</h3>
                  <p>각 트랜지션은 고유한 애니메이션을 제공합니다.</p>
                  <div class="animation-demo">
                    <div class="demo-box">
                      <span>애니메이션 미리보기</span>
                    </div>
                  </div>
                </div>
                <div class="tab-content none-border">
                  <h3>세 번째 탭</h3>
                  <p>트랜지션 효과는 사용자 경험을 향상시킵니다.</p>
                  <div class="transition-tips">
                    <h4>사용 팁:</h4>
                    <ul>
                      <li>slide: 가장 자연스러운 전환</li>
                      <li>fade: 부드럽고 깔끔한 효과</li>
                      <li>scale: 시각적 임팩트가 큰 효과</li>
                      <li>flip: 3D 효과로 현대적인 느낌 (방향별 회전)</li>
                      <li>bounce: 재미있고 생동감 있는 효과</li>
                    </ul>
                  </div>
                </div>
              </Tabs>
              <span class="example-label">다양한 트랜지션 효과</span>
            </div>
          </div>
        </section>

        <!-- 접근성 정보 -->
        <section class="example-section">
          <h2>접근성</h2>
          <div class="accessibility-info">
            <h3>스크린 리더 지원</h3>
            <ul>
              <li><strong>role="tablist"</strong>: 탭 목록 역할</li>
              <li><strong>role="tab"</strong>: 개별 탭 역할</li>
              <li><strong>aria-selected</strong>: 선택된 탭 표시</li>
              <li><strong>aria-disabled</strong>: 비활성화된 탭 표시</li>
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
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
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

.tab-content {
  padding: 1rem;
  background: white;
  border-radius: 0 0 6px 6px;
  border: 1px solid #e9ecef;
  border-top: none !important;

  &.none-border {
    border: none !important;
  }

  h3 {
    margin: 0 0 1rem 0;
    color: #333;
    font-size: 1.2rem;
    font-weight: 600;
  }

  p {
    margin: 0 0 1rem 0;
    color: #666;
    line-height: 1.6;
  }

  ul {
    margin: 0;
    padding-left: 1.5rem;

    li {
      margin-bottom: 0.5rem;
      color: #666;
    }
  }
}

.control-panel {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  margin-bottom: 1rem;

  p {
    margin: 0 0 1rem 0;
    color: #666;
  }
}

.button-group {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.control-button {
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background: #e9ecef;
  }

  &.active {
    background: #667eea;
    color: white;
    border-color: #667eea;
  }
}

.variant-controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.variant-button {
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background: #e9ecef;
  }

  &.active {
    background: #667eea;
    color: white;
    border-color: #667eea;
  }
}

.disabled-controls {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  margin-bottom: 1rem;

  p {
    margin: 0 0 1rem 0;
    color: #666;
    font-weight: 500;
  }
}

.toggle-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.toggle-button {
  padding: 0.5rem 1rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background: #218838;
  }

  &.disabled {
    background: #dc3545;

    &:hover {
      background: #c82333;
    }
  }
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  label {
    font-weight: 500;
    color: #333;
    min-width: 100px;
  }

  select {
    padding: 0.5rem;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    background: white;
  }
}

.help-item {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  border-left: 4px solid #667eea;

  strong {
    color: #333;
    display: block;
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0;
    color: #666;
  }
}

.example-label {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
  text-align: center;
  margin-top: 1rem;
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

.transition-controls {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  margin-bottom: 1rem;

  p {
    margin: 0 0 1rem 0;
    color: #666;
    font-weight: 500;
  }
}

.transition-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.transition-button {
  padding: 0.5rem 1rem;
  background: #17a2b8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background: #138496;
  }

  &.active {
    background: #6f42c1;
    box-shadow: 0 2px 4px rgba(111, 66, 193, 0.3);
  }
}

.transition-info {
  background: #e3f2fd;
  padding: 1rem;
  border-radius: 4px;
  border-left: 4px solid #2196f3;
  margin-bottom: 1rem;

  strong {
    color: #1976d2;
  }
}

.animation-demo {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

.demo-box {
  width: 220px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: demo-pulse 2s ease-in-out infinite;
}

@keyframes demo-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.transition-tips {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #e9ecef;

  h4 {
    margin: 0 0 0.5rem 0;
    color: #495057;
    font-size: 1rem;
    font-weight: 600;
  }

  ul {
    margin: 0;
    padding-left: 1.5rem;

    li {
      margin-bottom: 0.25rem;
      color: #6c757d;
      font-size: 0.9rem;
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

  .button-group,
  .variant-controls,
  .toggle-buttons,
  .transition-buttons {
    flex-direction: column;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
