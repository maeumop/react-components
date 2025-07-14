import FloatingBackButton from '@/views/FloatingBackButton';
import { Icon } from '@iconify/react';
import React from 'react';
import { badgePosition } from './const';
import './ex.scss';
import Badge from './index';

// Badge 예제 페이지
const BadgeExample: React.FC = () => {
  return (
    <div id="app">
      <header className="app-header">
        <div className="container">
          <h1>Badge Component Examples</h1>
          <p>React Badge 컴포넌트 사용 예제</p>
        </div>
      </header>
      <main className="main-content">
        <div className="container">
          {/* 기본 뱃지 예제 */}
          <section className="example-section">
            <h2>기본 뱃지</h2>
            <div className="example-grid">
              <div className="example-item">
                <Badge text="5">
                  <button className="demo-button">알림</button>
                </Badge>
                <span className="example-label">기본 뱃지</span>
              </div>
              <div className="example-item">
                <Badge text="N" color="success">
                  <button className="demo-button">새 메시지</button>
                </Badge>
                <span className="example-label">성공 뱃지</span>
              </div>
              <div className="example-item">
                <Badge text="!" color="error">
                  <button className="demo-button">Error</button>
                </Badge>
                <span className="example-label">Error</span>
              </div>
            </div>
          </section>
          {/* 위치별 뱃지 예제 */}
          <section className="example-section">
            <h2>위치별 뱃지</h2>
            <div className="example-grid">
              <div className="example-item">
                <Badge text="5" position="left">
                  <button className="demo-button">좌측 상단</button>
                </Badge>
                <span className="example-label">좌측 상단</span>
              </div>
              <div className="example-item">
                <Badge text="5" position={badgePosition.bottomLeft}>
                  <button className="demo-button">좌측 하단</button>
                </Badge>
                <span className="example-label">좌측 하단</span>
              </div>
              <div className="example-item">
                <Badge text="5" position={badgePosition.bottomRight}>
                  <button className="demo-button">우측 하단</button>
                </Badge>
                <span className="example-label">우측 하단</span>
              </div>
            </div>
          </section>
          {/* 색상별 뱃지 예제 */}
          <section className="example-section">
            <h2>색상별 뱃지</h2>
            <div className="example-grid">
              <div className="example-item">
                <Badge text="P" color="primary">
                  <button className="demo-button">Primary</button>
                </Badge>
              </div>
              <div className="example-item">
                <Badge text="S" color="secondary">
                  <button className="demo-button">Secondary</button>
                </Badge>
              </div>
              <div className="example-item">
                <Badge text="U" color="success">
                  <button className="demo-button">Success</button>
                </Badge>
              </div>
              <div className="example-item">
                <Badge text="W" color="warning">
                  <button className="demo-button">Warning</button>
                </Badge>
              </div>
              <div className="example-item">
                <Badge text="D" color="error">
                  <button className="demo-button">Error</button>
                </Badge>
              </div>
              <div className="example-item">
                <Badge text="I" color="info">
                  <button className="demo-button">Info</button>
                </Badge>
              </div>
              <div className="example-item">
                <Badge text="L" color="light">
                  <button className="demo-button">Light</button>
                </Badge>
              </div>
              <div className="example-item">
                <Badge text="K" color="dark">
                  <button className="demo-button">Dark</button>
                </Badge>
              </div>
            </div>
          </section>
          {/* 큰 뱃지와 아이콘 예제 */}
          <section className="example-section">
            <h2>큰 뱃지와 아이콘</h2>
            <div className="example-grid">
              <div className="example-item">
                <Badge size="large" text="5">
                  <button className="demo-button">큰 뱃지</button>
                </Badge>
                <span className="example-label">큰 뱃지</span>
              </div>
              <div className="example-item">
                <Badge size="large" icon="mdi:bell" color="warning">
                  <button className="demo-button">알림</button>
                </Badge>
                <span className="example-label">벨 아이콘</span>
              </div>
              <div className="example-item">
                <Badge size="large" icon="mdi:email" color="info">
                  <button className="demo-button">메일</button>
                </Badge>
                <span className="example-label">메일 아이콘</span>
              </div>
              <div className="example-item">
                <Badge size="large" icon="mdi:heart" color="error">
                  <button className="demo-button">Error</button>
                </Badge>
                <span className="example-label">Error</span>
              </div>
              <div className="example-item">
                <Badge size="large" icon="heroicons:user" color="success">
                  <button className="demo-button">사용자</button>
                </Badge>
                <span className="example-label">사용자 아이콘</span>
              </div>
              <div className="example-item">
                <Badge size="large" icon="fa:github" color="dark">
                  <button className="demo-button">GitHub</button>
                </Badge>
                <span className="example-label">GitHub 아이콘</span>
              </div>
            </div>
          </section>
          {/* 실제 사용 예제 */}
          <section className="example-section">
            <h2>실제 사용 예제</h2>
            <div className="example-grid">
              <div className="example-item">
                <Badge text="3" color="error" position={badgePosition.bottomRight}>
                  <div className="notification-item">
                    <Icon icon="mdi:email" width={24} height={24} />
                    <span>메시지</span>
                  </div>
                </Badge>
                <span className="example-label">메시지 알림</span>
              </div>
              <div className="example-item">
                <Badge text="N" color="success" position={badgePosition.right}>
                  <div className="product-item">
                    <Icon icon="mdi:package" width={24} height={24} />
                    <span>상품</span>
                  </div>
                </Badge>
                <span className="example-label">새 상품</span>
              </div>
              <div className="example-item">
                <Badge
                  icon="mdi:star"
                  size="large"
                  color="warning"
                  position={badgePosition.bottomLeft}
                >
                  <div className="favorite-item">
                    <Icon icon="mdi:heart" width={24} height={24} />
                    <span>즐겨찾기</span>
                  </div>
                </Badge>
                <span className="example-label">즐겨찾기</span>
              </div>
            </div>
          </section>
        </div>
      </main>
      {/* Floating Back Button */}
      <FloatingBackButton />
    </div>
  );
};

export default BadgeExample;
