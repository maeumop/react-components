import FloatingBackButton from '@/views/FloatingBackButton';
import React, { useState } from 'react';
import NumberFormat from './index';
import TextField from '../TextField';
import StyledButton from '@/components/StyledButton';

const validateRequired = (value: unknown): string | boolean => {
  if (typeof value !== 'number' || value === 0) {
    return '필수 입력 항목입니다.';
  }
  return true;
};

const validateRange = (value: unknown): string | boolean => {
  if (Number(value) < 1000 || Number(value) > 1000000) {
    return '1,000 ~ 1,000,000 사이의 값을 입력해주세요.';
  }
  return true;
};

const validatePositive = (value: unknown): string | boolean => {
  if (typeof value !== 'number' || value < 0) {
    return '양수를 입력해주세요.';
  }
  return true;
};

const NumberFormatExample: React.FC = () => {
  // 상태 정의
  const [basicNumber, setBasicNumber] = useState<number>(0);
  const [largeNumber, setLargeNumber] = useState<number>(1234567);
  const [validateNumber, setValidateNumber] = useState<number>(0);
  const [rangeNumber, setRangeNumber] = useState<number>(0);
  const [errorNumber, setErrorNumber] = useState<number>(0);

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
          <h1>NumberFormat Component Examples</h1>
          <p>React + TypeScript로 개발된 숫자 포맷팅 컴포넌트</p>
        </div>
      </header>
      <main className="main-content">
        <div className="container">
          {/* 기본 입력 */}
          <section className="example-section">
            <h2>기본 입력</h2>
            <div className="example-grid">
              <div className="example-item">
                <NumberFormat
                  block
                  value={basicNumber}
                  onChange={setBasicNumber}
                  placeholder="숫자 입력"
                />
                <span className="example-label">기본 숫자 입력</span>
              </div>
              <div className="example-item">
                <NumberFormat
                  block
                  value={largeNumber}
                  onChange={setLargeNumber}
                  placeholder="큰 숫자 입력"
                />
                <span className="example-label">큰 숫자 포맷팅</span>
              </div>
            </div>
          </section>
          {/* 유효성 검사 */}
          <section className="example-section">
            <h2>유효성 검사</h2>
            <div className="example-grid">
              <div className="example-item">
                <NumberFormat
                  value={validateNumber}
                  onChange={setValidateNumber}
                  validate={[validateRequired, validatePositive]}
                  placeholder="필수 입력 (양수)"
                  required
                  block
                />
                <span className="example-label">필수 + 양수 검사</span>
              </div>
              <div className="example-item">
                <NumberFormat
                  value={rangeNumber}
                  onChange={setRangeNumber}
                  validate={[validateRange]}
                  placeholder="1,000 ~ 1,000,000"
                  block
                />
                <span className="example-label">범위 검사</span>
              </div>
            </div>
          </section>
          {/* 라벨과 스타일 */}
          <section className="example-section">
            <h2>라벨과 스타일</h2>
            <div className="example-grid">
              <div className="example-item">
                <NumberFormat
                  value={basicNumber}
                  onChange={setBasicNumber}
                  label="가격"
                  placeholder="가격 입력"
                  block
                />
                <span className="example-label">라벨 포함</span>
              </div>
              <div className="example-item">
                <NumberFormat
                  value={largeNumber}
                  onChange={setLargeNumber}
                  label="매출액"
                  placeholder="매출액 입력"
                  required
                  block
                />
                <span className="example-label">필수 표시</span>
              </div>
            </div>
          </section>
          {/* 상태별 표시 */}
          <section className="example-section">
            <h2>상태별 표시</h2>
            <div className="example-grid">
              <div className="example-item">
                <NumberFormat
                  value={basicNumber}
                  onChange={setBasicNumber}
                  placeholder="읽기 전용"
                  readonly
                  block
                />
                <span className="example-label">읽기 전용</span>
              </div>
              <div className="example-item">
                <NumberFormat
                  value={basicNumber}
                  onChange={setBasicNumber}
                  placeholder="비활성화"
                  disabled
                  block
                />
                <span className="example-label">비활성화</span>
              </div>
            </div>
          </section>

          {/* 에러 메시지 */}
          <section className="example-section">
            <h2>사용자 에러 메시지 주입</h2>
            <div className="example-grid">
              <div className="example-item">
                <NumberFormat
                  value={errorNumber}
                  onChange={setErrorNumber}
                  errorMessage={errorMessageText}
                  placeholder="에러 메시지 표시"
                  block
                />
              </div>
            </div>
            <div className="example-grid">
              <div className="example-item error-message-inject">
                <TextField
                  value={errorTest}
                  onChange={setErrorTest}
                  placeholder="여기 입력된 메시지를 위의 TextField에 주입합니다."
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

export default NumberFormatExample;
