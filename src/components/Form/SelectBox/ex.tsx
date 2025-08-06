import FloatingBackButton from '@/views/FloatingBackButton';
import React, { useRef, useState } from 'react';
import './ex.scss';
import SelectBox from './index';
import type { OptionItem, SelectBoxModel } from './types';

const options: OptionItem[] = [
  { text: '옵션 1', value: 'option1' },
  { text: '옵션 2', value: 'option2' },
  { text: '옵션 3', value: 'option3' },
  { text: '옵션 4', value: 'option4' },
  { text: '옵션 5', value: 'option5' },
  { text: '옵션 6', value: 'option6' },
  { text: '옵션 7', value: 'option7' },
  { text: '옵션 8', value: 'option8' },
];

const longOptions: OptionItem[] = [
  { text: '매우 긴 옵션 텍스트 1', value: 'long1' },
  { text: '매우 긴 옵션 텍스트 2', value: 'long2' },
  { text: '매우 긴 옵션 텍스트 3', value: 'long3' },
  { text: '매우 긴 옵션 텍스트 4', value: 'long4' },
  { text: '매우 긴 옵션 텍스트 5', value: 'long5' },
];

// 유효성 검사 함수
const validateRequired = (value: unknown): string | boolean => {
  if (Array.isArray(value) && value.length === 0) {
    return '필수 선택 항목입니다.';
  } else if (!value || value === '') {
    return '필수 선택 항목입니다.';
  }

  return true;
};

const validateMaxSelection = (value: unknown): string | boolean => {
  if (Array.isArray(value) && value.length > 3) {
    return '최대 3개까지 선택 가능합니다.';
  }
  return true;
};

const SelectBoxExample: React.FC = () => {
  // 상태 정의
  const [basicSelect, setBasicSelect] = useState<string | string[]>('');
  const [multipleSelect, setMultipleSelect] = useState<string[]>([]);
  const [validateSelect, setValidateSelect] = useState('');
  const [validateMultiple, setValidateMultiple] = useState<string[]>([]);
  const [searchableSelect, setSearchableSelect] = useState('');

  // ref 예시 (expose 메서드)
  const validateRef = useRef<SelectBoxModel | null>(null);

  return (
    <div id="app">
      <header className="app-header">
        <div className="container">
          <h1>SelectBox Component Examples</h1>
          <p>React + TypeScript로 개발된 선택 박스 컴포넌트</p>
        </div>
      </header>
      <main className="main-content">
        <div className="container">
          {/* 기본 선택 */}
          <section className="example-section">
            <h2>기본 선택</h2>
            <div className="example-grid">
              <div className="example-item">
                <SelectBox
                  value={basicSelect}
                  onChange={v => {
                    if (typeof v === 'string') setBasicSelect(v);
                  }}
                  options={options}
                  placeholder="옵션을 선택하세요"
                  block
                />
                <span className="example-label">단일 선택</span>
              </div>
              <div className="example-item">
                <SelectBox
                  value={multipleSelect}
                  onChange={v => {
                    if (Array.isArray(v)) setMultipleSelect(v);
                  }}
                  options={options}
                  multiple
                  placeholder="여러 옵션을 선택하세요"
                  block
                />
                <span className="example-label">다중 선택</span>
              </div>
            </div>
          </section>
          {/* 라벨과 스타일 */}
          <section className="example-section">
            <h2>라벨과 스타일</h2>
            <div className="example-grid">
              <div className="example-item">
                <SelectBox
                  value={basicSelect}
                  onChange={setBasicSelect}
                  options={options}
                  label="카테고리"
                  placeholder="카테고리를 선택하세요"
                  required
                  block
                />
                <span className="example-label">라벨 + 필수 표시</span>
              </div>
              <div className="example-item">
                <SelectBox
                  value={basicSelect}
                  onChange={setBasicSelect}
                  options={longOptions}
                  isShort
                  multiple
                  placeholder="짧은 표시 모드"
                  block
                />
                <span className="example-label">짧은 표시 모드</span>
              </div>
            </div>
          </section>
          {/* 유효성 검사 */}
          <section className="example-section">
            <h2>유효성 검사</h2>
            <div className="example-grid">
              <div className="example-item">
                <SelectBox
                  value={validateSelect}
                  onChange={v => {
                    if (typeof v === 'string') setValidateSelect(v);
                  }}
                  options={options}
                  validate={[validateRequired]}
                  placeholder="필수 선택"
                  required
                  block
                  ref={validateRef}
                />
                <span className="example-label">필수 선택 검사</span>
              </div>
              <div className="example-item">
                <SelectBox
                  value={validateMultiple}
                  onChange={v => {
                    if (Array.isArray(v)) setValidateMultiple(v);
                  }}
                  options={options}
                  multiple
                  validate={[validateRequired, validateMaxSelection]}
                  placeholder="2-3개 선택"
                  required
                  block
                />
                <span className="example-label">범위 선택 검사</span>
              </div>
            </div>
          </section>
          {/* 검색 기능 */}
          <section className="example-section">
            <h2>검색 기능</h2>
            <div className="example-grid">
              <div className="example-item">
                <SelectBox
                  value={searchableSelect}
                  onChange={v => {
                    if (typeof v === 'string') setSearchableSelect(v);
                  }}
                  options={longOptions}
                  searchable
                  placeholder="검색하여 선택하세요"
                  block
                />
                <span className="example-label">검색 가능한 선택</span>
              </div>
            </div>
          </section>
          {/* 적용 버튼 */}
          <section className="example-section">
            <h2>적용 버튼</h2>
            <div className="example-grid">
              <div className="example-item">
                <SelectBox
                  value={multipleSelect}
                  onChange={v => {
                    if (Array.isArray(v)) setMultipleSelect(v);
                  }}
                  options={options}
                  multiple
                  btnAccept
                  placeholder="적용 버튼이 있는 다중 선택"
                  block
                />
                <span className="example-label">적용 버튼 모드</span>
              </div>
            </div>
          </section>
          {/* 상태별 표시 */}
          <section className="example-section">
            <h2>상태별 표시</h2>
            <div className="example-grid">
              <div className="example-item">
                <SelectBox
                  value={basicSelect}
                  onChange={v => {
                    if (typeof v === 'string') setBasicSelect(v);
                  }}
                  options={options}
                  placeholder="읽기 전용"
                  readonly
                  block
                />
                <span className="example-label">읽기 전용</span>
              </div>
              <div className="example-item">
                <SelectBox
                  value={basicSelect}
                  onChange={v => {
                    if (typeof v === 'string') setBasicSelect(v);
                  }}
                  options={options}
                  disabled
                  placeholder="비활성화 상태"
                  block
                />
                <span className="example-label">비활성화 상태</span>
              </div>
            </div>
          </section>
        </div>
      </main>
      <FloatingBackButton />
    </div>
  );
};

export default SelectBoxExample;
