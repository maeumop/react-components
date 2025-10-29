import FloatingButton from '@/views/FloatingBackButton';
import React, { useCallback } from 'react';
import { toastColor, toastPosition } from './const';
import { ToastProvider, useToast } from './index';
import type { ToastColor, ToastPosition } from './types';

const ToastDemo: React.FC = () => {
  const { toast } = useToast();

  // 위치별 토스트
  const showPositionToast = useCallback(
    (position: ToastPosition) => {
      toast(`위치: ${position}`, { position });
    },
    [toast],
  );

  // 색상별 토스트
  const showColorToast = useCallback(
    (color: ToastColor) => {
      toast(`색상: ${color}`, { color });
    },
    [toast],
  );

  // 자동 사라짐
  const showAutoClose = useCallback(() => {
    toast('3초 후 자동 사라집니다.', { duration: 3000 });
  }, [toast]);

  // 닫기 버튼
  const showCloseButton = useCallback(() => {
    toast('닫기 버튼을 눌러보세요!', { color: toastColor.info });
  }, [toast]);

  // 여러 토스트 동시 표시
  const showMultipleToasts = useCallback(() => {
    toast('첫 번째 토스트', { color: toastColor.success });
    setTimeout(() => {
      toast('두 번째 토스트', { color: toastColor.info });
    }, 400);
    setTimeout(() => {
      toast('세 번째 토스트', { color: toastColor.warning });
    }, 800);
  }, [toast]);

  // 빠른 연속 토스트
  const showRapidToasts = useCallback(() => {
    const messages = ['A', 'B', 'C', 'D', 'E'] as const;
    messages.forEach((msg, idx) => {
      setTimeout(() => {
        toast(`빠른 토스트 ${msg}`, { color: toastColor.primary });
      }, idx * 150);
    });
  }, [toast]);

  return (
    <div id="app">
      <header className="app-header">
        <div className="container">
          <h1>Toast Component Examples</h1>
          <p>
            React + TypeScript로 개발된 토스트 알림 컴포넌트
            <br />
            다양한 위치, 색상, 트랜지션, 부드러운 리스트 이동 효과 지원
          </p>
        </div>
      </header>
      <main className="main-content">
        <div className="container">
          {/* 위치별 토스트 */}
          <section className="example-section">
            <h2>위치별 토스트</h2>
            <div className="example-grid">
              {(Object.values(toastPosition) as ToastPosition[]).map(pos => (
                <div className="example-item" key={pos}>
                  <button className="demo-button" onClick={() => showPositionToast(pos)}>
                    {pos}
                  </button>
                </div>
              ))}
            </div>
          </section>
          {/* 색상별 토스트 */}
          <section className="example-section">
            <h2>색상별 토스트</h2>
            <div className="example-grid">
              {(Object.values(toastColor) as ToastColor[]).map(color => (
                <div className="example-item" key={color}>
                  <button
                    className={`demo-button theme-${color}`}
                    onClick={() => showColorToast(color)}
                  >
                    {color}
                  </button>
                </div>
              ))}
            </div>
          </section>
          {/* 자동 사라짐/닫기 버튼 */}
          <section className="example-section">
            <h2>자동 사라짐 & 닫기 버튼</h2>
            <div className="example-grid">
              <div className="example-item">
                <button className="demo-button" onClick={showAutoClose}>
                  3초 후 자동 사라짐
                </button>
              </div>
              <div className="example-item">
                <button className="demo-button" onClick={showCloseButton}>
                  닫기 버튼 토스트
                </button>
              </div>
            </div>
          </section>
          {/* 여러 토스트 동시/연속 */}
          <section className="example-section">
            <h2>여러 토스트 & 빠른 연속 토스트</h2>
            <div className="example-grid">
              <div className="example-item">
                <button className="demo-button" onClick={showMultipleToasts}>
                  여러 토스트 표시
                </button>
              </div>
              <div className="example-item">
                <button className="demo-button" onClick={showRapidToasts}>
                  빠른 연속 토스트
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <FloatingButton />
    </div>
  );
};

const ToastExamplePage: React.FC = () => (
  <ToastProvider>
    <ToastDemo />
  </ToastProvider>
);

export default ToastExamplePage;
