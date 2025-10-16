import React, { useState } from 'react';
import { DatePicker } from './index';
import FloatingBackButton from '@/views/FloatingBackButton';
import type { RuleFunc } from '../types';
import './ex.scss';

const DatePickerExamples: React.FC = () => {
  // 기본 선택
  const [basicDate, setBasicDate] = useState<string>('');
  const [rangeDate, setRangeDate] = useState<string[]>(['', '']);

  // 유효성 검사
  const [validateDate, setValidateDate] = useState<string>('');
  const [validateRange, setValidateRange] = useState<string[]>(['', '']);

  // 에러 메시지
  const [errorDate, setErrorDate] = useState<string>('');

  // 타입 안전한 핸들러 함수들
  const handleBasicDateChange = (value: string | string[]) => {
    if (typeof value === 'string') {
      setBasicDate(value);
    }
  };

  const handleRangeDateChange = (value: string | string[]) => {
    if (Array.isArray(value)) {
      setRangeDate(value);
    }
  };

  const handleValidateDateChange = (value: string | string[]) => {
    if (typeof value === 'string') {
      setValidateDate(value);
    }
  };

  const handleValidateRangeChange = (value: string | string[]) => {
    if (Array.isArray(value)) {
      setValidateRange(value);
    }
  };

  const handleErrorDateChange = (value: string | string[]) => {
    if (typeof value === 'string') {
      setErrorDate(value);
    }
  };

  // 유효성 검사 함수들
  const validateRequired: RuleFunc = (value: unknown): string | boolean => {
    if (Array.isArray(value)) {
      if (value.length === 0 || value.every(v => !v)) {
        return '필수 선택 항목입니다.';
      }
    } else {
      if (!value || value === '') {
        return '필수 선택 항목입니다.';
      }
    }
    return true;
  };

  const validateDateRange: RuleFunc = (value: unknown): string | boolean => {
    if (Array.isArray(value) && value.length === 2) {
      const [start, end] = value;
      if (start && end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (startDate > endDate) {
          return '시작일은 종료일보다 이전이어야 합니다.';
        }
      }
    }
    return true;
  };

  const validateMaxRange: RuleFunc = (value: unknown): string | boolean => {
    if (Array.isArray(value) && value.length === 2) {
      const [start, end] = value;
      if (start && end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 30) {
          return '최대 30일까지 선택 가능합니다.';
        }
      }
    }
    return true;
  };

  return (
    <div id="app">
      <header className="app-header">
        <div className="container">
          <h1>DatePicker Component Examples</h1>
          <p>React + TypeScript로 개발된 날짜 선택 컴포넌트</p>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {/* 기본 선택 */}
          <section className="example-section">
            <h2>기본 선택</h2>
            <div className="example-grid">
              <div className="example-item">
                <DatePicker
                  value={basicDate}
                  onChange={handleBasicDateChange}
                  onUpdateSet={handleBasicDateChange}
                  placeholder="날짜를 선택하세요"
                  block
                />
                <span className="example-label">단일 날짜 선택</span>
              </div>
              <div className="example-item">
                <DatePicker
                  value={rangeDate}
                  onChange={handleRangeDateChange}
                  onUpdateSet={handleRangeDateChange}
                  range
                  placeholder={['시작일', '종료일']}
                  block
                />
                <span className="example-label">날짜 범위 선택</span>
              </div>
            </div>
          </section>

          {/* 라벨과 스타일 */}
          <section className="example-section">
            <h2>라벨과 스타일</h2>
            <div className="example-grid">
              <div className="example-item">
                <DatePicker
                  value={basicDate}
                  onChange={handleBasicDateChange}
                  onUpdateSet={handleBasicDateChange}
                  label="시작일"
                  placeholder="시작일을 선택하세요"
                  required
                  block
                />
                <span className="example-label">라벨 + 필수 표시</span>
              </div>
              <div className="example-item">
                <DatePicker
                  value={rangeDate}
                  onChange={handleRangeDateChange}
                  onUpdateSet={handleRangeDateChange}
                  range
                  placeholder={['시작일', '종료일']}
                  maxRange={7}
                  block
                />
                <span className="example-label">최대 7일 선택</span>
              </div>
            </div>
          </section>

          {/* 유효성 검사 */}
          <section className="example-section">
            <h2>유효성 검사</h2>
            <div className="example-grid">
              <div className="example-item">
                <DatePicker
                  value={validateDate}
                  onChange={handleValidateDateChange}
                  onUpdateSet={handleValidateDateChange}
                  validate={[validateRequired]}
                  placeholder="필수 선택"
                  required
                  block
                />
                <span className="example-label">필수 선택 검사</span>
              </div>
              <div className="example-item">
                <DatePicker
                  value={validateRange}
                  onChange={handleValidateRangeChange}
                  onUpdateSet={handleValidateRangeChange}
                  range
                  validate={[validateRequired, validateDateRange, validateMaxRange]}
                  placeholder={['시작일', '종료일']}
                  required
                  block
                />
                <span className="example-label">범위 및 최대 기간 검사</span>
              </div>
            </div>
          </section>

          {/* 상태별 표시 */}
          <section className="example-section">
            <h2>상태별 표시</h2>
            <div className="example-grid">
              <div className="example-item">
                <DatePicker
                  value={errorDate}
                  onChange={handleErrorDateChange}
                  onUpdateSet={handleErrorDateChange}
                  placeholder="에러 상태"
                  block
                />
                <span className="example-label">에러 상태</span>
              </div>
              <div className="example-item">
                <DatePicker
                  value={basicDate}
                  onChange={handleBasicDateChange}
                  onUpdateSet={handleBasicDateChange}
                  disabled
                  placeholder="비활성화 상태"
                  block
                />
                <span className="example-label">비활성화 상태</span>
              </div>
            </div>
          </section>

          {/* 연도 범위 설정 */}
          <section className="example-section">
            <h2>연도 범위 설정</h2>
            <div className="example-grid">
              <div className="example-item">
                <DatePicker
                  value={basicDate}
                  onChange={handleBasicDateChange}
                  onUpdateSet={handleBasicDateChange}
                  minYear={2020}
                  maxYear={2030}
                  placeholder="2020-2030년 범위"
                  block
                />
                <span className="example-label">2020-2030년 범위</span>
              </div>
              <div className="example-item">
                <DatePicker
                  value={rangeDate}
                  onChange={handleRangeDateChange}
                  onUpdateSet={handleRangeDateChange}
                  range
                  minYear={2023}
                  maxYear={2025}
                  placeholder={['시작일', '종료일']}
                  block
                />
                <span className="example-label">2023-2025년 범위</span>
              </div>
            </div>
          </section>

          {/* 구분자 설정 */}
          <section className="example-section">
            <h2>구분자 설정</h2>
            <div className="example-grid">
              <div className="example-item">
                <DatePicker
                  value={basicDate}
                  onChange={handleBasicDateChange}
                  onUpdateSet={handleBasicDateChange}
                  separator="/"
                  placeholder="슬래시 구분자"
                  block
                />
                <span className="example-label">슬래시(/) 구분자</span>
              </div>
              <div className="example-item">
                <DatePicker
                  value={basicDate}
                  onChange={handleBasicDateChange}
                  onUpdateSet={handleBasicDateChange}
                  separator="."
                  placeholder="점 구분자"
                  block
                />
                <span className="example-label">점(.) 구분자</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <FloatingBackButton />
    </div>
  );
};

export default DatePickerExamples;
