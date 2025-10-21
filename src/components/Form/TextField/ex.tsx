import FloatingBackButton from '@/views/FloatingBackButton';
import React, { useState } from 'react';
import './ex.scss';
import TextField from './index';
import { Search as SearchIcon, Person as PersonIcon } from '@mui/icons-material';

const validateEmailFn = (value: unknown): string | boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof value !== 'string' || !emailRegex.test(value)) {
    return '올바른 이메일 형식을 입력해주세요.';
  }
  return true;
};

const validateRequired = (value: unknown): string | boolean => {
  if (typeof value !== 'string' || !value.trim()) {
    return '필수 입력 항목입니다.';
  }
  return true;
};

const validateMinLength = (value: unknown): string | boolean => {
  if (typeof value !== 'string' || value.length < 3) {
    return '최소 3자 이상 입력해주세요.';
  }
  return true;
};

const TextFieldExample: React.FC = () => {
  // 상태 정의
  const [basicText, setBasicText] = useState('');
  const [emailText, setEmailText] = useState('');
  const [passwordText, setPasswordText] = useState('');
  const [validateText, setValidateText] = useState('');
  const [validateEmail, setValidateEmail] = useState('');
  const [iconText, setIconText] = useState('');
  const [iconLeftText, setIconLeftText] = useState('');
  const [textareaText, setTextareaText] = useState('');
  const [countingText, setCountingText] = useState('');

  // 아이콘 클릭 핸들러
  const handleIconClick = () => {
    alert('아이콘이 클릭되었습니다!');
  };

  return (
    <div id="app">
      <header className="app-header">
        <div className="container">
          <h1>TextField Component Examples</h1>
          <p>React + TypeScript로 개발된 텍스트 입력 컴포넌트</p>
        </div>
      </header>
      <main className="main-content">
        <div className="container">
          {/* 기본 입력 */}
          <section className="example-section">
            <h2>기본 입력</h2>
            <div className="example-grid">
              <div className="example-item">
                <TextField
                  block
                  value={basicText}
                  onChange={setBasicText}
                  placeholder="기본 텍스트 입력"
                  clearable
                />
                <span className="example-label">기본 입력</span>
              </div>
              <div className="example-item">
                <TextField
                  block
                  value={emailText}
                  onChange={setEmailText}
                  type="text"
                  placeholder="이메일 입력"
                  clearable
                />
                <span className="example-label">이메일 입력</span>
              </div>
              <div className="example-item">
                <TextField
                  block
                  value={passwordText}
                  onChange={setPasswordText}
                  type="password"
                  placeholder="비밀번호 입력"
                  clearable
                />
                <span className="example-label">비밀번호 입력</span>
              </div>
            </div>
          </section>
          {/* 유효성 검사 */}
          <section className="example-section">
            <h2>유효성 검사</h2>
            <div className="example-grid">
              <div className="example-item">
                <TextField
                  value={validateText}
                  onChange={setValidateText}
                  validate={[validateRequired, validateMinLength]}
                  placeholder="필수 입력 (최소 3자)"
                  required
                  block
                />
                <span className="example-label">필수 + 최소 길이</span>
              </div>
              <div className="example-item">
                <TextField
                  value={validateEmail}
                  onChange={setValidateEmail}
                  validate={[validateEmailFn]}
                  placeholder="이메일 형식 검사"
                  block
                />
                <span className="example-label">이메일 형식 검사</span>
              </div>
            </div>
          </section>
          {/* 아이콘 */}
          <section className="example-section">
            <h2>아이콘</h2>
            <div className="example-grid">
              <div className="example-item">
                <TextField
                  value={iconText}
                  onChange={setIconText}
                  icon={SearchIcon}
                  iconAction={handleIconClick}
                  placeholder="검색어 입력"
                  clearable
                  block
                />
                <span className="example-label">검색 아이콘 + 클리어</span>
              </div>
              <div className="example-item">
                <TextField
                  value={iconLeftText}
                  onChange={setIconLeftText}
                  icon={PersonIcon}
                  placeholder="사용자명 입력"
                  iconLeft
                  block
                />
                <span className="example-label">왼쪽 아이콘</span>
              </div>
            </div>
          </section>
          {/* textarea */}
          <section className="example-section">
            <h2>Textarea</h2>
            <div className="example-grid">
              <div className="example-item">
                <TextField
                  value={textareaText}
                  onChange={setTextareaText}
                  multiline
                  rows={4}
                  placeholder="여러 줄 텍스트 입력"
                  label="메모"
                  block
                />
                <span className="example-label">기본 textarea</span>
              </div>
            </div>
          </section>
          {/* 글자 수 카운팅 */}
          <section className="example-section">
            <h2>글자 수 카운팅</h2>
            <div className="example-grid">
              <div className="example-item">
                <TextField
                  value={countingText}
                  onChange={setCountingText}
                  isCounting
                  maxLength={50}
                  placeholder="최대 50자까지 입력"
                  label="소개글"
                  block
                />
                <span className="example-label">글자 수 카운팅</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <FloatingBackButton />
    </div>
  );
};

export default TextFieldExample;
