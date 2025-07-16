import React, { useCallback, useState } from 'react';
import FloatingBackButton from '../../views/FloatingBackButton';
import './ex.scss';
import { SpinnerProvider, useSpinner } from './index';
import type { SpinnerColor } from './types';

const themeList: SpinnerColor[] = [
  'default',
  'primary',
  'secondary',
  'success',
  'warning',
  'error',
  'info',
];

const SpinnerDemo: React.FC = () => {
  const { spinnerShow, spinnerHide } = useSpinner();
  const [status, setStatus] = useState('hidden');
  const [lastMessage, setLastMessage] = useState('');

  // 기본 사용법
  const showBasicSpinner = useCallback(() => {
    spinnerShow();
    setStatus('showing');
    setLastMessage('기본 스피너');
    setTimeout(() => spinnerHide(), 3000);
  }, [spinnerShow, spinnerHide]);

  const showSpinnerWithMessage = useCallback(() => {
    spinnerShow('데이터를 처리중입니다...');
    setStatus('showing');
    setLastMessage('데이터를 처리중입니다...');
    setTimeout(() => spinnerHide(), 3000);
  }, [spinnerShow, spinnerHide]);

  const showSpinnerWithDelay = useCallback(() => {
    setTimeout(() => {
      spinnerShow('1초 후 표시된 스피너');
      setStatus('showing');
      setLastMessage('1초 후 표시된 스피너');
      setTimeout(() => spinnerHide(), 3000);
    }, 1000);
  }, [spinnerShow, spinnerHide]);

  // 테마별
  const showThemeSpinner = useCallback(
    (color: SpinnerColor) => {
      const messages: Record<SpinnerColor, string> = {
        default: '기본 테마 스피너',
        primary: 'Primary 테마 스피너',
        secondary: 'Secondary 테마 스피너',
        success: 'Success 테마 스피너',
        warning: 'Warning 테마 스피너',
        error: 'Error 테마 스피너',
        info: 'Info 테마 스피너',
      };
      spinnerShow(messages[color], { color });
      setStatus('showing');
      setLastMessage(messages[color]);
      setTimeout(() => spinnerHide(), 3000);
    },
    [spinnerShow, spinnerHide],
  );

  // 단계별(고급)
  const showProgressiveSpinner = useCallback(async () => {
    spinnerShow('작업을 시작합니다...', { color: 'primary' });
    setStatus('showing');
    setLastMessage('작업을 시작합니다...');
    await new Promise(res => setTimeout(res, 1000));
    spinnerShow('첫 번째 단계 완료...', { color: 'info' });
    setLastMessage('첫 번째 단계 완료...');
    await new Promise(res => setTimeout(res, 1000));
    spinnerShow('마지막 단계입니다...', { color: 'warning' });
    setLastMessage('마지막 단계입니다...');
    await new Promise(res => setTimeout(res, 1000));
    spinnerShow('모든 작업이 완료되었습니다!', { color: 'success' });
    setLastMessage('모든 작업이 완료되었습니다!');
    setTimeout(() => {
      spinnerHide();
      setStatus('hiding');
    }, 2000);
  }, [spinnerShow, spinnerHide]);

  // API 호출 시뮬레이션
  const simulateApiCall = useCallback(
    async (type: 'success' | 'error' | 'warning') => {
      const themes: Record<string, SpinnerColor> = {
        success: 'success',
        error: 'error',
        warning: 'warning',
      };
      const messages = {
        success: 'API 호출 성공!',
        error: 'API 호출 실패!',
        warning: 'API 호출 경고!',
      };
      spinnerShow(`${type} API 호출 중...`, { color: themes[type] });
      setStatus('showing');
      setLastMessage(`${type} API 호출 중...`);
      try {
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            if (type === 'error') reject(new Error('API 오류'));
            else resolve('성공');
          }, 2000);
        });
        spinnerShow(messages[type], { color: 'success' });
        setLastMessage(messages[type]);
      } catch {
        spinnerShow('오류가 발생했습니다', { color: 'error' });
        setLastMessage('오류가 발생했습니다');
      }
      setTimeout(() => spinnerHide(), 2000);
    },
    [spinnerShow, spinnerHide],
  );

  const simulateLongApiCall = useCallback(async () => {
    spinnerShow('긴 API 호출 중... (10초)', { color: 'info' });
    setStatus('showing');
    setLastMessage('긴 API 호출 중... (10초)');
    try {
      await new Promise(resolve => setTimeout(resolve, 10000));
      spinnerShow('긴 API 호출 완료!', { color: 'success' });
      setLastMessage('긴 API 호출 완료!');
    } catch {
      spinnerShow('타임아웃 발생', { color: 'error' });
      setLastMessage('타임아웃 발생');
    }
    setTimeout(() => spinnerHide(), 2000);
  }, [spinnerShow, spinnerHide]);

  return (
    <div id="app">
      <header className="app-header">
        <div className="container">
          <h1>Spinner Component Examples</h1>
          <p>React + TypeScript로 개발된 로딩 스피너 컴포넌트</p>
        </div>
      </header>
      <main className="main-content">
        <div className="container">
          {/* 기본 사용법 */}
          <section className="example-section">
            <h2>기본 사용법</h2>
            <div className="example-grid">
              <div className="example-item">
                <button className="demo-button" onClick={showBasicSpinner}>
                  기본 스피너
                </button>
                <span className="example-label">기본 스피너</span>
              </div>
              <div className="example-item">
                <button className="demo-button" onClick={showSpinnerWithMessage}>
                  메시지와 함께
                </button>
                <span className="example-label">메시지와 함께</span>
              </div>
              <div className="example-item">
                <button className="demo-button" onClick={showSpinnerWithDelay}>
                  지연 후 표시
                </button>
                <span className="example-label">지연 후 표시</span>
              </div>
            </div>
          </section>
          {/* 테마별 */}
          <section className="example-section">
            <h2>테마별</h2>
            <div className="example-grid">
              {themeList.map(theme => (
                <div className="example-item" key={theme}>
                  <button
                    className={`demo-button theme-${theme}`}
                    onClick={() => showThemeSpinner(theme)}
                  >
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </button>
                  <span className="example-label">
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </section>
          {/* 고급 예제 */}
          <section className="example-section">
            <h2>고급 예제</h2>
            <div className="example-grid">
              <div className="example-item">
                <button className="demo-button advanced" onClick={showProgressiveSpinner}>
                  단계별 테마 변경
                </button>
                <span className="example-label">단계별 테마 변경</span>
              </div>
            </div>
          </section>
          {/* API 호출 시뮬레이션 */}
          <section className="example-section">
            <h2>API 호출 시뮬레이션</h2>
            <div className="example-grid">
              <div className="example-item">
                <button
                  className="demo-button api success"
                  onClick={() => simulateApiCall('success')}
                >
                  성공 API 호출
                </button>
                <span className="example-label">성공 API 호출</span>
              </div>
              <div className="example-item">
                <button className="demo-button api error" onClick={() => simulateApiCall('error')}>
                  실패 API 호출
                </button>
                <span className="example-label">실패 API 호출</span>
              </div>
              <div className="example-item">
                <button
                  className="demo-button api warning"
                  onClick={() => simulateApiCall('warning')}
                >
                  경고 API 호출
                </button>
                <span className="example-label">경고 API 호출</span>
              </div>
              <div className="example-item">
                <button className="demo-button api long" onClick={simulateLongApiCall}>
                  긴 API 호출 (10초)
                </button>
                <span className="example-label">긴 API 호출</span>
              </div>
            </div>
          </section>
          {/* 상태 표시 */}
          <section className="example-section">
            <h2>상태 표시</h2>
            <div className="example-item">
              <div className="info">
                <p>현재 상태: {status}</p>
                <p>마지막 메시지: {lastMessage}</p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <FloatingBackButton />
    </div>
  );
};

const SpinnerExamplePage: React.FC = () => (
  <SpinnerProvider>
    <SpinnerDemo />
  </SpinnerProvider>
);

export default SpinnerExamplePage;
