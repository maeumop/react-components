<script setup lang="ts">
import FloatingBackButton from '@/views/FloatingBackButton/index.vue';
import { badgePosition, badgeSize } from './const';
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <h1>Badge Component Examples</h1>
        <p>Vue Badge 컴포넌트 사용 예제</p>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <!-- 기본 뱃지 예제 -->
        <section class="example-section">
          <h2>기본 뱃지</h2>
          <div class="example-grid">
            <div class="example-item">
              <Badge text="5">
                <button class="demo-button">알림</button>
              </Badge>
              <span class="example-label">기본 뱃지</span>
            </div>
            <div class="example-item">
              <Badge text="N" color="success">
                <button class="demo-button">새 메시지</button>
              </Badge>
              <span class="example-label">성공 뱃지</span>
            </div>
            <div class="example-item">
              <Badge text="!" color="error">
                <button class="demo-button">Error</button>
              </Badge>
              <span class="example-label">Error</span>
            </div>
          </div>
        </section>

        <!-- 위치별 뱃지 예제 -->
        <section class="example-section">
          <h2>위치별 뱃지</h2>
          <div class="example-grid">
            <div class="example-item">
              <Badge text="5" position="left">
                <button class="demo-button">좌측 상단</button>
              </Badge>
              <span class="example-label">좌측 상단</span>
            </div>
            <div class="example-item">
              <Badge text="5" :position="badgePosition.bottomLeft">
                <button class="demo-button">좌측 하단</button>
              </Badge>
              <span class="example-label">좌측 하단</span>
            </div>
            <div class="example-item">
              <Badge text="5" :position="badgePosition.bottomRight">
                <button class="demo-button">우측 하단</button>
              </Badge>
              <span class="example-label">우측 하단</span>
            </div>
          </div>
        </section>

        <!-- 색상별 뱃지 예제 -->
        <section class="example-section">
          <h2>색상별 뱃지</h2>
          <div class="example-grid">
            <div class="example-item">
              <Badge text="P" color="primary">
                <button class="demo-button">Primary</button>
              </Badge>
            </div>
            <div class="example-item">
              <Badge text="S" color="secondary">
                <button class="demo-button">Secondary</button>
              </Badge>
            </div>
            <div class="example-item">
              <Badge text="U" color="success">
                <button class="demo-button">Success</button>
              </Badge>
            </div>
            <div class="example-item">
              <Badge text="W" color="warning">
                <button class="demo-button">Warning</button>
              </Badge>
            </div>
            <div class="example-item">
              <Badge text="D" color="error">
                <button class="demo-button">Error</button>
              </Badge>
            </div>
            <div class="example-item">
              <Badge text="I" color="info">
                <button class="demo-button">Info</button>
              </Badge>
            </div>
            <div class="example-item">
              <Badge text="L" color="light">
                <button class="demo-button">Light</button>
              </Badge>
            </div>
            <div class="example-item">
              <Badge text="K" color="dark">
                <button class="demo-button">Dark</button>
              </Badge>
            </div>
          </div>
        </section>

        <!-- 큰 뱃지와 아이콘 예제 -->
        <section class="example-section">
          <h2>큰 뱃지와 아이콘</h2>
          <div class="example-grid">
            <div class="example-item">
              <Badge size="large" text="5">
                <button class="demo-button">큰 뱃지</button>
              </Badge>
              <span class="example-label">큰 뱃지</span>
            </div>
            <div class="example-item">
              <Badge size="large" icon="mdi:bell" color="warning">
                <button class="demo-button">알림</button>
              </Badge>
              <span class="example-label">벨 아이콘</span>
            </div>
            <div class="example-item">
              <Badge size="large" icon="mdi:email" color="info">
                <button class="demo-button">메일</button>
              </Badge>
              <span class="example-label">메일 아이콘</span>
            </div>
            <div class="example-item">
              <Badge :size="badgeSize.large" icon="mdi:heart" color="error">
                <button class="demo-button">Error</button>
              </Badge>
              <span class="example-label">Error</span>
            </div>
            <div class="example-item">
              <Badge :size="badgeSize.large" icon="heroicons:user" color="success">
                <button class="demo-button">사용자</button>
              </Badge>
              <span class="example-label">사용자 아이콘</span>
            </div>
            <div class="example-item">
              <Badge :size="badgeSize.large" icon="fa:github" color="dark">
                <button class="demo-button">GitHub</button>
              </Badge>
              <span class="example-label">GitHub 아이콘</span>
            </div>
          </div>
        </section>

        <!-- 실제 사용 예제 -->
        <section class="example-section">
          <h2>실제 사용 예제</h2>
          <div class="example-grid">
            <div class="example-item">
              <Badge text="3" color="error" :position="badgePosition.bottomRight">
                <div class="notification-item">
                  <Icon icon="mdi:email" width="24" height="24" />
                  <span>메시지</span>
                </div>
              </Badge>
              <span class="example-label">메시지 알림</span>
            </div>
            <div class="example-item">
              <Badge text="N" color="success" :position="badgePosition.right">
                <div class="product-item">
                  <Icon icon="mdi:package" width="24" height="24" />
                  <span>상품</span>
                </div>
              </Badge>
              <span class="example-label">새 상품</span>
            </div>
            <div class="example-item">
              <Badge icon="mdi:star" large color="warning" :position="badgePosition.bottomLeft">
                <div class="favorite-item">
                  <Icon icon="mdi:heart" width="24" height="24" />
                  <span>즐겨찾기</span>
                </div>
              </Badge>
              <span class="example-label">즐겨찾기</span>
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

.notification-item,
.product-item,
.favorite-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #495057;
  min-width: 120px;
  justify-content: center;
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
