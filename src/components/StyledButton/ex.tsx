import FloatingBackButton from '@/views/FloatingBackButton';
import React, { useState } from 'react';
import './ex.scss';
import StyledButton from './index';

const StyledButtonExample: React.FC = () => {
  // 폼 데이터
  const [formData, setFormData] = useState({ email: '', message: '' });
  const [isSubmitting, setSubmitting] = useState(false);

  // 이벤트 예제 데이터
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState('없음');
  const [counter, setCounter] = useState(0);

  // 폼 제출
  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.message) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('폼이 성공적으로 제출되었습니다!');
    setSubmitting(false);
    setFormData({ email: '', message: '' });
  };

  // 클릭 이벤트 처리
  const handleClick = () => {
    setClickCount(c => c + 1);
    setLastClickTime(new Date().toLocaleTimeString());
    setCounter(c => c + 1);
  };

  return (
    <div id="app">
      <header className="app-header">
        <div className="container">
          <h1>StyledButton Component Examples</h1>
          <p>React + TypeScript로 개발된 다재다능한 버튼 컴포넌트</p>
        </div>
      </header>
      <main className="main-content">
        <div className="container">
          {/* 기본 색상 버튼 */}
          <section className="example-section">
            <h2>기본 색상 버튼</h2>
            <div className="example-grid">
              <div className="example-item">
                <StyledButton color="primary" onClick={handleClick}>
                  Primary
                </StyledButton>
                <span className="example-label">Primary</span>
              </div>
              <div className="example-item">
                <StyledButton color="secondary">Secondary</StyledButton>
                <span className="example-label">Secondary</span>
              </div>
              <div className="example-item">
                <StyledButton color="success">Success</StyledButton>
                <span className="example-label">Success</span>
              </div>
              <div className="example-item">
                <StyledButton color="warning">Warning</StyledButton>
                <span className="example-label">Warning</span>
              </div>
              <div className="example-item">
                <StyledButton color="error">Error</StyledButton>
                <span className="example-label">Error</span>
              </div>
              <div className="example-item">
                <StyledButton color="info">Info</StyledButton>
                <span className="example-label">Info</span>
              </div>
              <div className="example-item">
                <StyledButton color="light">Light</StyledButton>
                <span className="example-label">Light</span>
              </div>
              <div className="example-item">
                <StyledButton color="dark">Dark</StyledButton>
                <span className="example-label">Dark</span>
              </div>
            </div>
          </section>

          {/* 크기별 버튼 */}
          <section className="example-section">
            <h2>크기별 버튼</h2>
            <div className="example-grid">
              <div className="example-item">
                <StyledButton small color="primary">
                  작은 버튼
                </StyledButton>
                <span className="example-label">Small (가장 작음)</span>
              </div>
              <div className="example-item">
                <StyledButton color="primary">기본</StyledButton>
                <span className="example-label">Default (중간)</span>
              </div>
              <div className="example-item">
                <StyledButton large color="primary">
                  큰 버튼
                </StyledButton>
                <span className="example-label">Large (가장 큼)</span>
              </div>
            </div>
          </section>

          {/* 스타일 변형 */}
          <section className="example-section">
            <h2>스타일 변형</h2>
            <div className="example-grid">
              <div className="example-item">
                <StyledButton color="primary">Filled</StyledButton>
                <span className="example-label">Filled (기본)</span>
              </div>
              <div className="example-item">
                <StyledButton style="text" color="primary">
                  Text
                </StyledButton>
                <span className="example-label">Text</span>
              </div>
              <div className="example-item">
                <StyledButton style="outline" color="primary">
                  Outline
                </StyledButton>
                <span className="example-label">Outline</span>
              </div>
              <div className="example-item">
                <StyledButton onlyIcon icon="mdi:home" color="primary" />
                <span className="example-label">Icon Only</span>
              </div>
            </div>
          </section>

          {/* 아이콘 버튼 */}
          <section className="example-section">
            <h2>아이콘 버튼</h2>
            <div className="example-grid">
              <div className="example-item">
                <StyledButton icon="mdi:plus" color="success">
                  추가
                </StyledButton>
                <span className="example-label">왼쪽 아이콘</span>
              </div>
              <div className="example-item">
                <StyledButton icon="mdi:arrow-right" iconRight color="info">
                  다음
                </StyledButton>
                <span className="example-label">오른쪽 아이콘</span>
              </div>
              <div className="example-item">
                <StyledButton icon="mdi:download" color="warning">
                  다운로드
                </StyledButton>
                <span className="example-label">다운로드</span>
              </div>
              <div className="example-item">
                <StyledButton icon="mdi:share" iconRight color="secondary">
                  공유
                </StyledButton>
                <span className="example-label">공유</span>
              </div>
            </div>
          </section>

          {/* 아이콘 전용 버튼 */}
          <section className="example-section">
            <h2>아이콘 전용 버튼</h2>
            <div className="example-grid">
              <div className="example-item">
                <StyledButton onlyIcon icon="mdi:menu" color="primary" />
                <span className="example-label">메뉴</span>
              </div>
              <div className="example-item">
                <StyledButton onlyIcon icon="mdi:search" color="secondary" />
                <span className="example-label">검색</span>
              </div>
              <div className="example-item">
                <StyledButton onlyIcon icon="mdi:heart" color="error" />
                <span className="example-label">하트 아이콘</span>
              </div>
              <div className="example-item">
                <StyledButton onlyIcon icon="mdi:star" color="warning" />
                <span className="example-label">즐겨찾기</span>
              </div>
              <div className="example-item">
                <StyledButton onlyIcon icon="mdi:email" color="info" />
                <span className="example-label">메일</span>
              </div>
              <div className="example-item">
                <StyledButton onlyIcon icon="mdi:settings" color="dark" />
                <span className="example-label">설정</span>
              </div>
            </div>
          </section>

          {/* 상태별 버튼 */}
          <section className="example-section">
            <h2>상태별 버튼</h2>
            <div className="example-grid">
              <div className="example-item">
                <StyledButton color="primary">정상</StyledButton>
                <span className="example-label">정상</span>
              </div>
              <div className="example-item">
                <StyledButton color="error" disabled>
                  비활성화
                </StyledButton>
                <span className="example-label">비활성화</span>
              </div>
              <div className="example-item">
                <StyledButton color="success" loading>
                  로딩중
                </StyledButton>
                <span className="example-label">로딩중</span>
              </div>
            </div>
          </section>

          {/* 폼 예제 */}
          <section className="example-section">
            <h2>폼 예제</h2>
            <form className="example-form" onSubmit={submitForm}>
              <input
                type="email"
                placeholder="이메일"
                value={formData.email}
                onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                disabled={isSubmitting}
                required
              />
              <textarea
                placeholder="메시지"
                value={formData.message}
                onChange={e => setFormData(f => ({ ...f, message: e.target.value }))}
                disabled={isSubmitting}
                required
              />
              <StyledButton color="primary" loading={isSubmitting} disabled={isSubmitting}>
                {isSubmitting ? '제출 중...' : '제출'}
              </StyledButton>
            </form>
          </section>

          {/* 클릭 이벤트 예제 */}
          <section className="example-section">
            <h2>이벤트/카운터 예제</h2>
            <div className="example-grid">
              <div className="example-item">
                <StyledButton color="info" onClick={handleClick}>
                  클릭 카운트: {clickCount}
                </StyledButton>
                <span className="example-label">마지막 클릭: {lastClickTime}</span>
              </div>
              <div className="example-item">
                <StyledButton color="success" onClick={() => setCounter(c => c + 1)}>
                  Counter: {counter}
                </StyledButton>
                <span className="example-label">Counter 증가</span>
              </div>
            </div>
          </section>
        </div>
      </main>
      <FloatingBackButton />
    </div>
  );
};

export default StyledButtonExample;
