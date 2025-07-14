<script setup lang="ts">
import FloatingBackButton from '@/views/FloatingBackButton/index.vue';
import { ref } from 'vue';
import { dropMenuColor, dropMenuPosition, dropMenuTransition } from './const';
import DropMenu from './index.vue';
import type { DropMenuColor, DropMenuItem, DropMenuPosition, DropMenuTransition } from './types';

// 예제 데이터
const menuItems = [
  {
    text: '프로필 보기',
    action: () => alert('프로필 보기 클릭'),
    icon: 'mdi:account',
  },
  {
    text: '설정',
    action: () => alert('설정 클릭'),
    icon: 'mdi:cog',
  },
  {
    text: '로그아웃',
    action: () => alert('로그아웃 클릭'),
    icon: 'mdi:logout',
  },
];

const disabledMenuItems = [
  {
    text: '활성 메뉴',
    action: () => alert('활성 메뉴 클릭'),
    icon: 'mdi:check',
  },
  {
    text: '비활성 메뉴',
    action: () => alert('이 메뉴는 비활성화되어 있습니다'),
    icon: 'mdi:close',
    disabled: true,
  },
  {
    text: '다른 메뉴',
    action: () => alert('다른 메뉴 클릭'),
    icon: 'mdi:star',
  },
];

// 상태 관리
const currentPosition = ref<DropMenuPosition>(dropMenuPosition.bottom);
const currentTransition = ref<DropMenuTransition>(dropMenuTransition.slide);
const currentColor = ref<DropMenuColor>(dropMenuColor.primary);

// 이벤트 핸들러
const handleOpen = () => {
  console.log('드롭메뉴가 열렸습니다');
};

const handleClose = () => {
  console.log('드롭메뉴가 닫혔습니다');
};

const handleItemClick = (item: DropMenuItem, index: number) => {
  console.log(`메뉴 아이템 클릭: ${item.text} (인덱스: ${index})`);
};

// 위치 변경
const changePosition = (position: DropMenuPosition) => {
  currentPosition.value = position;
};

// 트랜지션 변경
const changeTransition = (transition: DropMenuTransition) => {
  currentTransition.value = transition;
};

// 색상 변경
const changeColor = (color: DropMenuColor) => {
  currentColor.value = color;
};
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <h1>DropMenu Component Examples</h1>
        <p>Vue 3 + TypeScript로 개발된 드롭다운 메뉴 컴포넌트</p>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <!-- 기본 사용법 -->
        <section class="example-section">
          <h2>기본 사용법</h2>
          <div class="example-grid">
            <div class="example-item">
              <DropMenu
                :items="menuItems"
                @open="handleOpen"
                @close="handleClose"
                @item-click="handleItemClick"
              >
                <button class="demo-button">기본 드롭메뉴</button>
              </DropMenu>
              <span class="example-label">기본 드롭메뉴</span>
            </div>
            <div class="example-item">
              <DropMenu :items="menuItems" :width="200">
                <button class="demo-button">고정 너비</button>
              </DropMenu>
              <span class="example-label">고정 너비 (200px)</span>
            </div>
          </div>
        </section>

        <!-- 위치별 드롭메뉴 -->
        <section class="example-section">
          <h2>위치별 드롭메뉴</h2>
          <div class="position-controls">
            <button
              v-for="position in Object.values(dropMenuPosition)"
              :key="position"
              class="control-button"
              :class="{ active: currentPosition === position }"
              @click="changePosition(position)"
            >
              {{ position }}
            </button>
          </div>
          <div class="example-grid">
            <div class="example-item">
              <DropMenu
                :items="menuItems"
                :position="currentPosition"
                :transition="currentTransition"
                :color="currentColor"
              >
                <button class="demo-button">{{ currentPosition }} 위치</button>
              </DropMenu>
              <span class="example-label">{{ currentPosition }} 위치</span>
            </div>
          </div>
        </section>

        <!-- 트랜지션 효과 -->
        <section class="example-section">
          <h2>트랜지션 효과</h2>
          <div class="transition-description">
            <p>다양한 애니메이션 효과를 체험해보세요:</p>
            <ul>
              <li><strong>Slide</strong>: 부드러운 슬라이드 효과</li>
              <li><strong>Fade</strong>: 페이드 인/아웃 효과</li>
              <li><strong>Scale</strong>: 확대/축소 효과</li>
              <li><strong>Bounce</strong>: 탄성 있는 바운스 효과</li>
              <li><strong>Flip</strong>: 3D 플립 효과</li>
              <li><strong>Elastic</strong>: 고무줄 같은 탄성 효과</li>
              <li><strong>Swing</strong>: 회전하면서 나타나는 효과</li>
            </ul>
          </div>

          <!-- 트랜지션 선택 컨트롤 -->
          <div class="transition-controls">
            <button
              v-for="transition in Object.values(dropMenuTransition)"
              :key="transition"
              class="control-button"
              :class="{ active: currentTransition === transition }"
              @click="changeTransition(transition)"
            >
              {{ transition }}
            </button>
          </div>

          <!-- 선택된 트랜지션 미리보기 -->
          <div class="example-grid">
            <div class="example-item">
              <DropMenu :items="menuItems" :transition="currentTransition" position="bottom">
                <button class="demo-button">{{ currentTransition }} 효과</button>
              </DropMenu>
              <span class="example-label">{{ currentTransition }} 효과</span>
            </div>
          </div>
        </section>

        <!-- 색상 테마 -->
        <section class="example-section">
          <h2>색상 테마</h2>
          <div class="color-controls">
            <button
              v-for="color in Object.values(dropMenuColor)"
              :key="color"
              class="control-button"
              :class="{ active: currentColor === color }"
              @click="changeColor(color)"
            >
              {{ color }}
            </button>
          </div>
          <div class="example-grid">
            <div class="example-item">
              <DropMenu :items="menuItems" :color="currentColor" position="bottom">
                <button class="demo-button">{{ currentColor }} 테마</button>
              </DropMenu>
              <span class="example-label">{{ currentColor }} 테마</span>
            </div>
          </div>
        </section>

        <!-- 비활성화 메뉴 -->
        <section class="example-section">
          <h2>비활성화 메뉴</h2>
          <div class="example-grid">
            <div class="example-item">
              <DropMenu :items="disabledMenuItems" position="bottom">
                <button class="demo-button">비활성화 메뉴</button>
              </DropMenu>
              <span class="example-label">비활성화된 메뉴 아이템 포함</span>
            </div>
            <div class="example-item">
              <DropMenu :items="menuItems" :disabled="true" position="bottom">
                <button class="demo-button">전체 비활성화</button>
              </DropMenu>
              <span class="example-label">전체 드롭메뉴 비활성화</span>
            </div>
          </div>
        </section>

        <!-- 접근성 테스트 -->
        <section class="example-section">
          <h2>접근성 테스트</h2>
          <div class="accessibility-info">
            <h3>키보드 네비게이션</h3>
            <ul>
              <li><strong>Enter/Space</strong>: 드롭메뉴 토글</li>
              <li><strong>Arrow Down/Up</strong>: 메뉴 아이템 간 이동</li>
              <li><strong>Escape</strong>: 드롭메뉴 닫기</li>
            </ul>
          </div>
          <div class="example-grid">
            <div class="example-item">
              <DropMenu :items="menuItems" position="bottom">
                <button class="demo-button">키보드로 테스트</button>
              </DropMenu>
              <span class="example-label">키보드로 네비게이션 테스트</span>
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

  &:hover {
    background: #5a6fd8;
  }
}

.example-label {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
  text-align: center;
}

.position-controls,
.transition-controls,
.color-controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
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

.transition-description {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  margin-bottom: 2rem;

  p {
    margin: 0 0 1rem 0;
    color: #495057;
    font-size: 1rem;
    font-weight: 500;
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

.all-transitions {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e9ecef;

  h3 {
    margin: 0 0 1.5rem 0;
    color: #333;
    font-size: 1.3rem;
    font-weight: 600;
  }
}

@media (max-width: 768px) {
  .example-grid {
    grid-template-columns: 1fr;
  }

  .app-header h1 {
    font-size: 2rem;
  }

  .position-controls,
  .transition-controls,
  .color-controls {
    flex-direction: column;
  }
}
</style>
