import FloatingBackButton from '@/views/FloatingBackButton';
import React, { useRef, useState } from 'react';
import SwitchButton from './index';
import type { SwitchButtonModel } from './types';
import TextField from '../TextField';
import StyledButton from '@/components/StyledButton';

const SwitchButtonExample: React.FC = () => {
  // 상태 정의
  const [basic, setBasic] = useState(false);
  const [color, setColor] = useState(true);
  const [checkbox, setCheckbox] = useState(false);
  const [validateValue, setValidateValue] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [readonly, setReadonly] = useState(false);
  const [small, setSmall] = useState(false);
  const [colorPrimary, setColorPrimary] = useState(false);
  const [colorSecondary, setColorSecondary] = useState(false);
  const [colorSuccess, setColorSuccess] = useState(false);
  const [colorWarning, setColorWarning] = useState(false);
  const [colorError, setColorError] = useState(false);
  const [colorInfo, setColorInfo] = useState(false);
  const [colorDark, setColorDark] = useState(false);

  // 유효성 검사 함수
  const validateFn = (val: unknown) => {
    if (val !== true) {
      return '동의가 필요합니다.';
    }

    return true;
  };

  // 유효성 수동 체크
  const validateRef = useRef<SwitchButtonModel | null>(null);
  const checkValidate = () => {
    if (validateRef.current) {
      validateRef.current.check();
    }
  };

  const [errorTest, setErrorTest] = useState('');
  const [errorMessageText, setErrorMessageText] = useState('');

  const setMessage = () => {
    setErrorMessageText(() => errorTest);
    setErrorTest('');
  };

  return (
    <div id="app">
      <header className="app-header">
        <div className="container">
          <h1>SwitchButton Component Examples</h1>
          <p>React + TypeScript로 개발된 스위치/체크박스 컴포넌트</p>
        </div>
      </header>
      <main className="main-content">
        <div className="container">
          {/* 기본 스위치 */}
          <section className="example-section">
            <h2>기본 스위치</h2>
            <div className="example-grid">
              <div className="example-item">
                <SwitchButton
                  value={basic}
                  onChange={v => {
                    if (typeof v === 'boolean') setBasic(v);
                  }}
                />
                <span className="example-label">기본</span>
              </div>
            </div>
          </section>
          {/* 색상/라벨 */}
          <section className="example-section">
            <h2>색상/라벨</h2>
            <div className="example-grid">
              <div className="example-item">
                <SwitchButton
                  value={color}
                  onChange={v => {
                    if (typeof v === 'boolean') setColor(v);
                  }}
                  label={['OFF', 'ON']}
                  color="primary"
                />
                <span className="example-label">primary, 라벨</span>
              </div>
            </div>
          </section>
          {/* 모든 색상 옵션 */}
          <section className="example-section">
            <h2>모든 색상 옵션</h2>
            <div className="example-grid">
              <div className="example-item">
                <SwitchButton
                  value={colorPrimary}
                  onChange={v => {
                    if (typeof v === 'boolean') setColorPrimary(v);
                  }}
                  color="primary"
                />
                <span className="example-label">primary</span>
              </div>
              <div className="example-item">
                <SwitchButton
                  value={colorSecondary}
                  onChange={v => {
                    if (typeof v === 'boolean') setColorSecondary(v);
                  }}
                  color="secondary"
                />
                <span className="example-label">secondary</span>
              </div>
              <div className="example-item">
                <SwitchButton
                  value={colorSuccess}
                  onChange={v => {
                    if (typeof v === 'boolean') setColorSuccess(v);
                  }}
                  color="success"
                />
                <span className="example-label">success</span>
              </div>
              <div className="example-item">
                <SwitchButton
                  value={colorWarning}
                  onChange={v => {
                    if (typeof v === 'boolean') setColorWarning(v);
                  }}
                  color="warning"
                />
                <span className="example-label">warning</span>
              </div>
              <div className="example-item">
                <SwitchButton
                  value={colorError}
                  onChange={v => {
                    if (typeof v === 'boolean') setColorError(v);
                  }}
                  color="error"
                />
                <span className="example-label">error</span>
              </div>
              <div className="example-item">
                <SwitchButton
                  value={colorInfo}
                  onChange={v => {
                    if (typeof v === 'boolean') setColorInfo(v);
                  }}
                  color="info"
                />
                <span className="example-label">info</span>
              </div>
              <div className="example-item">
                <SwitchButton
                  value={colorDark}
                  onChange={v => {
                    if (typeof v === 'boolean') setColorDark(v);
                  }}
                  color="dark"
                />
                <span className="example-label">dark</span>
              </div>
            </div>
          </section>
          {/* 체크박스 스타일 */}
          <section className="example-section">
            <h2>체크박스 스타일</h2>
            <div className="example-grid">
              <div className="example-item">
                <SwitchButton
                  value={checkbox}
                  onChange={v => {
                    if (typeof v === 'boolean') setCheckbox(v);
                  }}
                  label={['비활성', '활성']}
                  checkbox
                />
                <span className="example-label">체크박스</span>
              </div>
            </div>
          </section>
          {/* 유효성 검사 */}
          <section className="example-section">
            <h2>유효성 검사</h2>
            <div className="example-grid">
              <div className="example-item">
                <SwitchButton
                  ref={validateRef}
                  value={validateValue}
                  onChange={v => {
                    if (typeof v === 'boolean') setValidateValue(v);
                  }}
                  validate={[validateFn]}
                  label={['동의 안함', '동의함']}
                />
                <button className="demo-button" onClick={checkValidate}>
                  유효성 수동 체크
                </button>
                <span className="example-label">유효성 검사</span>
              </div>
            </div>
          </section>
          {/* 비활성/읽기전용 */}
          <section className="example-section">
            <h2>비활성/읽기전용</h2>
            <div className="example-grid">
              <div className="example-item">
                <SwitchButton
                  value={disabled}
                  onChange={v => {
                    if (typeof v === 'boolean') setDisabled(v);
                  }}
                  disabled
                />
                <span className="example-label">disabled</span>
              </div>
              <div className="example-item">
                <SwitchButton
                  value={readonly}
                  onChange={v => {
                    if (typeof v === 'boolean') setReadonly(v);
                  }}
                  readonly
                />
                <span className="example-label">readonly</span>
              </div>
            </div>
          </section>
          {/* small 사이즈 (실제 small prop은 제거됨, 예시만 유지) */}
          <section className="example-section">
            <h2>small 사이즈</h2>
            <div className="example-grid">
              <div className="example-item">
                <SwitchButton
                  value={small}
                  onChange={v => {
                    if (typeof v === 'boolean') setSmall(v);
                  }}
                />
                <span className="example-label">small</span>
              </div>
            </div>
          </section>

          {/* 에러메시지 주입 */}
          <section className="example-section">
            <h2>사용자 에러 메시지 주입</h2>
            <div className="example-grid">
              <div className="example-item">
                <SwitchButton
                  value={basic}
                  errorMessage={errorMessageText}
                  onChange={v => {
                    if (typeof v === 'boolean') setBasic(v);
                  }}
                />
              </div>
            </div>
            <div className="example-grid">
              <div className="example-item error-message-inject">
                <TextField
                  value={errorTest}
                  onChange={setErrorTest}
                  placeholder="여기 입력된 메시지를 위의 SwitchButton에 주입합니다."
                  block
                />
                <StyledButton onClick={setMessage}>에러 메시지 주입</StyledButton>
              </div>
            </div>
          </section>
        </div>
      </main>
      <FloatingBackButton />
    </div>
  );
};

export default SwitchButtonExample;
