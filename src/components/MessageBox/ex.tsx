import FloatingBackButton from '@/views/FloatingBackButton';
import React, { useState } from 'react';
import './ex.scss';
import { MessageBoxProvider, messageBoxTransition, useMessageBox } from './index';

const transitions = {
  Scale: messageBoxTransition.scale,
  Slide: messageBoxTransition.slide,
  SlideUp: messageBoxTransition.slideUp,
  Zoom: messageBoxTransition.zoom,
  Bounce: messageBoxTransition.bounce,
  Flip: messageBoxTransition.flip,
  Elastic: messageBoxTransition.elastic,
};

const MessageBoxExampleInner: React.FC = () => {
  const [selectedTransition, setSelectedTransition] = useState<
    import('./types').MessageBoxTransition
  >(messageBoxTransition.scale);
  const { alert, confirm } = useMessageBox();

  // Alert/Confirm 호출 함수들
  const showAlert = () => {
    alert('기본 Alert 메시지입니다.');
  };
  const showConfirm = () => {
    confirm('기본 Confirm 메시지입니다.');
  };
  const showAlertWithTransition = () => {
    alert({
      message: `${selectedTransition} 트랜지션을 사용한 Alert입니다.`,
      transition: selectedTransition,
    });
  };
  const showConfirmWithTransition = () => {
    confirm({
      message: `${selectedTransition} 트랜지션을 사용한 Confirm입니다.`,
      transition: selectedTransition,
    });
  };
  const showScaleTransition = () => {
    alert({
      title: 'Scale 트랜지션',
      message: '기본 스케일 효과가 적용된 메시지입니다.',
      transition: messageBoxTransition.scale,
    });
  };
  const showSlideTransition = () => {
    alert({
      title: 'Slide 트랜지션',
      message: '슬라이드 효과가 적용된 메시지입니다.',
      transition: messageBoxTransition.slide,
    });
  };
  const showSlideUpTransition = () => {
    alert({
      title: 'Slide Up 트랜지션',
      message: '위로 슬라이드되는 효과가 적용된 메시지입니다.',
      transition: messageBoxTransition.slideUp,
    });
  };
  const showZoomTransition = () => {
    alert({
      title: 'Zoom 트랜지션',
      message: '줌 효과가 적용된 메시지입니다.',
      transition: messageBoxTransition.zoom,
    });
  };
  const showBounceTransition = () => {
    alert({
      title: 'Bounce 트랜지션',
      message: '바운스 효과가 적용된 메시지입니다.',
      transition: messageBoxTransition.bounce,
    });
  };
  const showFlipTransition = () => {
    alert({
      title: 'Flip 트랜지션',
      message: '플립 효과가 적용된 메시지입니다.',
      transition: messageBoxTransition.flip,
    });
  };
  const showElasticTransition = () => {
    alert({
      title: 'Elastic 트랜지션',
      message: '탄성 효과가 적용된 메시지입니다.',
      transition: messageBoxTransition.elastic,
    });
  };
  const showAsyncAlert = () => {
    alert({
      message: '비동기 처리가 포함된 Alert입니다.',
      asyncOkay: async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('Async alert completed');
      },
    });
  };
  const showAsyncConfirm = () => {
    confirm({
      message: '비동기 처리가 포함된 Confirm입니다.',
      asyncOkay: async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('Async confirm completed');
      },
      cancel: () => {
        console.log('Async confirm cancelled');
      },
    });
  };
  const showCustomAlert = () => {
    alert({
      title: '커스텀 Alert',
      message: '제목과 커스텀 버튼 텍스트가 있는 Alert입니다.',
      btnOkayText: '알겠습니다',
      width: '400px',
      transition: messageBoxTransition.bounce,
    });
  };
  const showCustomConfirm = () => {
    confirm({
      title: '커스텀 Confirm',
      message: '제목과 커스텀 버튼 텍스트가 있는 Confirm입니다.',
      btnOkayText: '네',
      btnCancelText: '아니오',
      width: '400px',
      transition: messageBoxTransition.flip,
    });
  };
  const showHtmlMessage = () => {
    alert({
      title: 'HTML 메시지',
      message:
        '<strong>굵은 텍스트</strong>와 <em>기울임 텍스트</em>를 포함한 메시지입니다.<br><br>줄바꿈도 지원됩니다.',
    });
  };

  return (
    <div id="app">
      <header className="app-header">
        <div className="container">
          <h1>MessageBox Component Examples</h1>
          <p>React + TypeScript로 개발된 모달 메시지 박스 컴포넌트</p>
        </div>
      </header>
      <main className="main-content">
        <div className="container">
          {/* 기본 Alert 예제 */}
          <section className="example-section">
            <h2>기본 Alert</h2>
            <div className="example-grid">
              <div className="example-item">
                <button className="demo-button theme-primary" onClick={showAlert}>
                  기본 Alert
                </button>
                <span className="example-label">간단한 메시지만 표시</span>
              </div>
            </div>
          </section>
          {/* HTML 메시지 예제 */}
          <section className="example-section">
            <h2>HTML 메시지</h2>
            <div className="example-grid">
              <div className="example-item">
                <button className="demo-button theme-info" onClick={showHtmlMessage}>
                  HTML 서식
                </button>
                <span className="example-label">HTML 태그를 사용한 서식 있는 메시지</span>
              </div>
            </div>
          </section>
          {/* Confirm 예제 */}
          <section className="example-section">
            <h2>Confirm 다이얼로그</h2>
            <div className="example-grid">
              <div className="example-item">
                <button className="demo-button theme-warning" onClick={showConfirm}>
                  기본 Confirm
                </button>
                <span className="example-label">확인/취소 버튼이 있는 다이얼로그</span>
              </div>
            </div>
          </section>
          {/* 트랜지션 선택기 */}
          <section className="example-section">
            <h2>트랜지션 선택</h2>
            <div className="transition-selector">
              <label htmlFor="transition-select">트랜지션 효과 선택:</label>
              <select
                id="transition-select"
                className="transition-select"
                value={selectedTransition}
                onChange={e =>
                  setSelectedTransition(e.target.value as import('./types').MessageBoxTransition)
                }
              >
                {Object.entries(transitions).map(([key, value]) => (
                  <option key={key} value={value}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
            <div className="example-grid">
              <div className="example-item">
                <button className="demo-button theme-info" onClick={showAlertWithTransition}>
                  선택된 트랜지션으로 Alert
                </button>
                <span className="example-label">선택한 트랜지션 효과 적용</span>
              </div>
              <div className="example-item">
                <button className="demo-button theme-info" onClick={showConfirmWithTransition}>
                  선택된 트랜지션으로 Confirm
                </button>
                <span className="example-label">선택한 트랜지션 효과 적용</span>
              </div>
            </div>
          </section>
          {/* 개별 트랜지션 테스트 */}
          <section className="example-section">
            <h2>개별 트랜지션 테스트</h2>
            <div className="example-grid">
              <div className="example-item">
                <button className="demo-button theme-secondary" onClick={showScaleTransition}>
                  Scale
                </button>
                <span className="example-label">기본 스케일 효과</span>
              </div>
              <div className="example-item">
                <button className="demo-button theme-secondary" onClick={showSlideTransition}>
                  Slide
                </button>
                <span className="example-label">슬라이드 효과</span>
              </div>
              <div className="example-item">
                <button className="demo-button theme-secondary" onClick={showSlideUpTransition}>
                  Slide Up
                </button>
                <span className="example-label">위로 슬라이드</span>
              </div>
              <div className="example-item">
                <button className="demo-button theme-secondary" onClick={showZoomTransition}>
                  Zoom
                </button>
                <span className="example-label">줌 효과</span>
              </div>
              <div className="example-item">
                <button className="demo-button theme-secondary" onClick={showBounceTransition}>
                  Bounce
                </button>
                <span className="example-label">바운스 효과</span>
              </div>
              <div className="example-item">
                <button className="demo-button theme-secondary" onClick={showFlipTransition}>
                  Flip
                </button>
                <span className="example-label">플립 효과</span>
              </div>
              <div className="example-item">
                <button className="demo-button theme-secondary" onClick={showElasticTransition}>
                  Elastic
                </button>
                <span className="example-label">탄성 효과</span>
              </div>
            </div>
          </section>
          {/* 비동기 처리 */}
          <section className="example-section">
            <h2>비동기 처리</h2>
            <div className="example-grid">
              <div className="example-item">
                <button className="demo-button theme-success" onClick={showAsyncAlert}>
                  Async Alert
                </button>
                <span className="example-label">비동기 처리 포함 Alert</span>
              </div>
              <div className="example-item">
                <button className="demo-button theme-success" onClick={showAsyncConfirm}>
                  Async Confirm
                </button>
                <span className="example-label">비동기 처리 포함 Confirm</span>
              </div>
            </div>
          </section>
          {/* 커스텀 옵션 */}
          <section className="example-section">
            <h2>커스텀 옵션</h2>
            <div className="example-grid">
              <div className="example-item">
                <button className="demo-button theme-info" onClick={showCustomAlert}>
                  Custom Alert
                </button>
                <span className="example-label">커스텀 버튼 텍스트 포함 Alert</span>
              </div>
              <div className="example-item">
                <button className="demo-button theme-info" onClick={showCustomConfirm}>
                  Custom Confirm
                </button>
                <span className="example-label">커스텀 버튼 텍스트 포함 Confirm</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <FloatingBackButton />
    </div>
  );
};

const MessageBoxExample: React.FC = () => {
  return (
    <MessageBoxProvider>
      <MessageBoxExampleInner />
    </MessageBoxProvider>
  );
};

export default MessageBoxExample;
