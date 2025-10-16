import React, { useRef, useState } from 'react';
import type { RuleFunc } from '../types';
import { ValidateWrap } from './index';
import type { ValidateWrapRef } from './types';
import './ex.scss';

const ValidateWrapExample: React.FC = () => {
  // 기본 입력
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');

  // 커스텀 에러
  const [customError, setCustomError] = useState('');
  const [customValue, setCustomValue] = useState('');

  // refs
  const emailRef = useRef<ValidateWrapRef>(null);
  const passwordRef = useRef<ValidateWrapRef>(null);
  const confirmPasswordRef = useRef<ValidateWrapRef>(null);
  const ageRef = useRef<ValidateWrapRef>(null);
  const phoneRef = useRef<ValidateWrapRef>(null);
  const customRef = useRef<ValidateWrapRef>(null);

  // 유효성 검사 함수들
  const requiredRule: RuleFunc = (value: unknown): boolean | string => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return '필수 입력 항목입니다.';
    }
    return true;
  };

  const emailRule: RuleFunc = (value: unknown): boolean | string => {
    if (typeof value === 'string' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return '올바른 이메일 형식이 아닙니다.';
      }
    }
    return true;
  };

  const minLengthRule = (min: number): RuleFunc => {
    return (value: unknown): boolean | string => {
      if (typeof value === 'string' && value.length < min) {
        return `최소 ${min}자 이상 입력해주세요.`;
      }
      return true;
    };
  };

  const numberRangeRule = (min: number, max: number): RuleFunc => {
    return (value: unknown): boolean | string => {
      if (typeof value === 'string' && value) {
        const numValue = Number(value);
        if (isNaN(numValue) || numValue < min || numValue > max) {
          return `${min}-${max} 사이의 숫자를 입력해주세요.`;
        }
      }
      return true;
    };
  };

  const phoneRule: RuleFunc = (value: unknown): boolean | string => {
    if (typeof value === 'string' && value) {
      const phoneRegex = /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/;
      if (!phoneRegex.test(value)) {
        return '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)';
      }
    }
    return true;
  };

  // 커스텀 에러 토글
  const toggleCustomError = (): void => {
    setCustomError(customError ? '' : '사용자 정의 에러 메시지입니다.');
  };

  // 전체 폼 검증
  const validateForm = (): void => {
    const results = [
      emailRef.current?.check(),
      passwordRef.current?.check(),
      confirmPasswordRef.current?.check(),
      ageRef.current?.check(),
      phoneRef.current?.check(),
      customRef.current?.check(),
    ];

    const isValid = results.every(result => result === true);

    if (isValid) {
      alert('모든 검증을 통과했습니다!');
    } else {
      alert('검증에 실패했습니다. 오류 메시지를 확인해주세요.');
    }
  };

  // 폼 초기화
  const resetForm = (): void => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setAge('');
    setPhone('');
    setCustomValue('');
    setCustomError('');

    emailRef.current?.resetForm();
    passwordRef.current?.resetForm();
    confirmPasswordRef.current?.resetForm();
    ageRef.current?.resetForm();
    phoneRef.current?.resetForm();
    customRef.current?.resetForm();
  };

  return (
    <div id="app">
      <header className="app-header">
        <div className="container">
          <h1>ValidateWrap Component Examples</h1>
          <p>React + TypeScript로 개발된 유효성 검사 래퍼 컴포넌트</p>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {/* 기본 사용법 */}
          <section className="example-section">
            <h2>기본 사용법</h2>
            <div className="example-grid">
              <div className="example-item">
                <ValidateWrap
                  ref={emailRef}
                  checkValue={email}
                  validate={[requiredRule, emailRule]}
                  label="이메일 주소"
                  required
                >
                  {({ onBlur }) => (
                    <input
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onBlur={onBlur}
                      type="email"
                      className="form-input"
                      placeholder="이메일을 입력하세요"
                    />
                  )}
                </ValidateWrap>
                <span className="example-label">이메일 검증</span>
              </div>
              <div className="example-item">
                <ValidateWrap
                  ref={passwordRef}
                  checkValue={password}
                  validate={[requiredRule, minLengthRule(8)]}
                  label="비밀번호"
                  required
                >
                  {({ onBlur }) => (
                    <input
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onBlur={onBlur}
                      type="password"
                      className="form-input"
                      placeholder="8자 이상 입력하세요"
                    />
                  )}
                </ValidateWrap>
                <span className="example-label">비밀번호 검증</span>
              </div>
            </div>
          </section>

          {/* 고급 검증 */}
          <section className="example-section">
            <h2>고급 검증</h2>
            <div className="example-grid">
              <div className="example-item">
                <ValidateWrap
                  ref={confirmPasswordRef}
                  checkValue={confirmPassword}
                  validate={[requiredRule]}
                  label="비밀번호 확인"
                  required
                >
                  {({ onBlur }) => (
                    <input
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      onBlur={onBlur}
                      type="password"
                      className="form-input"
                      placeholder="비밀번호를 다시 입력하세요"
                    />
                  )}
                </ValidateWrap>
                <span className="example-label">비밀번호 확인</span>
              </div>
              <div className="example-item">
                <ValidateWrap
                  ref={ageRef}
                  checkValue={age}
                  validate={[requiredRule, numberRangeRule(1, 120)]}
                  label="나이"
                  required
                >
                  {({ onBlur }) => (
                    <input
                      value={age}
                      onChange={e => setAge(e.target.value)}
                      onBlur={onBlur}
                      type="number"
                      className="form-input"
                      placeholder="1-120 사이의 숫자"
                    />
                  )}
                </ValidateWrap>
                <span className="example-label">나이 범위 검증</span>
              </div>
            </div>
          </section>

          {/* 커스텀 에러 */}
          <section className="example-section">
            <h2>커스텀 에러 메시지</h2>
            <div className="example-grid">
              <div className="example-item">
                <ValidateWrap
                  ref={customRef}
                  checkValue={customValue}
                  errorMessage={customError}
                  label="커스텀 에러"
                  addOn={
                    <button type="button" onClick={toggleCustomError} className="error-toggle-btn">
                      {customError ? '에러 제거' : '에러 추가'}
                    </button>
                  }
                >
                  {({ onBlur }) => (
                    <input
                      value={customValue}
                      onChange={e => setCustomValue(e.target.value)}
                      onBlur={onBlur}
                      type="text"
                      className="form-input"
                      placeholder="아무 값이나 입력하세요"
                    />
                  )}
                </ValidateWrap>
                <span className="example-label">사용자 정의 에러</span>
              </div>
              <div className="example-item">
                <ValidateWrap
                  ref={phoneRef}
                  checkValue={phone}
                  validate={[requiredRule, phoneRule]}
                  label="전화번호"
                  required
                >
                  {({ onBlur }) => (
                    <input
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      onBlur={onBlur}
                      type="tel"
                      className="form-input"
                      placeholder="010-1234-5678"
                    />
                  )}
                </ValidateWrap>
                <span className="example-label">전화번호 형식 검증</span>
              </div>
            </div>
          </section>

          {/* 액션 버튼 */}
          <section className="example-section">
            <h2>폼 액션</h2>
            <div className="actions">
              <button type="button" onClick={validateForm} className="validate-btn">
                전체 검증
              </button>
              <button type="button" onClick={resetForm} className="reset-btn">
                폼 초기화
              </button>
            </div>
          </section>

          {/* 특징 설명 */}
          <section className="example-section">
            <h2>ValidateWrap의 특징</h2>
            <div className="features-grid">
              <div className="feature-item">
                <h3>범용성</h3>
                <p>
                  Render Props를 활용하여 어떤 컴포넌트든 감쌀 수 있습니다. input, select, textarea
                  등 모든 폼 요소에 적용 가능합니다.
                </p>
              </div>
              <div className="feature-item">
                <h3>유연한 검증</h3>
                <p>
                  함수형 유효성 검사 규칙을 자유롭게 정의할 수 있습니다. 복합적인 검증 로직도 쉽게
                  구현할 수 있습니다.
                </p>
              </div>
              <div className="feature-item">
                <h3>일관된 UI</h3>
                <p>
                  모든 필드에서 동일한 에러 메시지 스타일과 애니메이션을 제공하여 일관된 사용자
                  경험을 제공합니다.
                </p>
              </div>
              <div className="feature-item">
                <h3>재사용성</h3>
                <p>
                  유효성 검사 규칙을 함수로 정의하여 여러 곳에서 재사용할 수 있습니다. 코드 중복을
                  크게 줄일 수 있습니다.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ValidateWrapExample;
