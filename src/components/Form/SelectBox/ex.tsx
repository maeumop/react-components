import FloatingBackButton from '@/views/FloatingBackButton';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import './ex.scss';
import SelectBox from './index';
import type { OptionItem, SelectBoxModel } from './types';

// 상수 분리
const OPTIONS: OptionItem[] = [
  { text: '옵션 1', value: 'option1' },
  { text: '옵션 2', value: 'option2' },
  { text: '옵션 3', value: 'option3' },
  { text: '옵션 4', value: 'option4' },
  { text: '옵션 5', value: 'option5' },
  { text: '옵션 6', value: 'option6' },
  { text: '옵션 7', value: 'option7' },
  { text: '옵션 8', value: 'option8' },
];

const LONG_OPTIONS: OptionItem[] = [
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

// 개별 예제 컴포넌트들
const BasicSelectExample = React.memo<{
  basicSelect: string | string[];
  setBasicSelect: (value: string | string[]) => void;
  multipleSelect: string[];
  setMultipleSelect: (value: string[]) => void;
}>(({ basicSelect, setBasicSelect, multipleSelect, setMultipleSelect }) => {
  const handleBasicChange = useCallback(
    (v: string | string[]) => {
      if (typeof v === 'string') {
        setBasicSelect(v);
      }
    },
    [setBasicSelect],
  );

  const handleMultipleChange = useCallback(
    (v: string | string[]) => {
      if (Array.isArray(v)) {
        setMultipleSelect(v);
      }
    },
    [setMultipleSelect],
  );

  return (
    <section className="example-section">
      <h2>기본 선택</h2>
      <div className="example-grid">
        <div className="example-item">
          <SelectBox
            value={basicSelect}
            onChange={handleBasicChange}
            options={OPTIONS}
            placeholder="옵션을 선택하세요"
            block
          />
          <span className="example-label">단일 선택</span>
        </div>
        <div className="example-item">
          <SelectBox
            value={multipleSelect}
            onChange={handleMultipleChange}
            options={OPTIONS}
            multiple
            placeholder="여러 옵션을 선택하세요"
            block
          />
          <span className="example-label">다중 선택</span>
        </div>
      </div>
    </section>
  );
});

BasicSelectExample.displayName = 'BasicSelectExample';

const LabelStyleExample = React.memo<{
  basicSelect: string | string[];
  setBasicSelect: (value: string | string[]) => void;
}>(({ basicSelect, setBasicSelect }) => {
  const handleChange = useCallback(
    (v: string | string[]) => {
      setBasicSelect(v);
    },
    [setBasicSelect],
  );

  return (
    <section className="example-section">
      <h2>라벨과 스타일</h2>
      <div className="example-grid">
        <div className="example-item">
          <SelectBox
            value={basicSelect}
            onChange={handleChange}
            options={OPTIONS}
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
            onChange={handleChange}
            options={LONG_OPTIONS}
            isShort
            multiple
            placeholder="짧은 표시 모드"
            block
          />
          <span className="example-label">짧은 표시 모드</span>
        </div>
      </div>
    </section>
  );
});

LabelStyleExample.displayName = 'LabelStyleExample';

const ValidationExample = React.memo<{
  validateSelect: string;
  setValidateSelect: (value: string) => void;
  validateMultiple: string[];
  setValidateMultiple: (value: string[]) => void;
  validateRef: React.RefObject<SelectBoxModel | null>;
}>(({ validateSelect, setValidateSelect, validateMultiple, setValidateMultiple, validateRef }) => {
  const handleValidateChange = useCallback(
    (v: string | string[]) => {
      if (typeof v === 'string') {
        setValidateSelect(v);
      }
    },
    [setValidateSelect],
  );

  const handleValidateMultipleChange = useCallback(
    (v: string | string[]) => {
      if (Array.isArray(v)) {
        setValidateMultiple(v);
      }
    },
    [setValidateMultiple],
  );

  const validateRequiredCallback = useCallback(validateRequired, []);
  const validateMaxSelectionCallback = useCallback(validateMaxSelection, []);

  const validateRules = useMemo(() => [validateRequiredCallback], [validateRequiredCallback]);
  const validateMultipleRules = useMemo(
    () => [validateRequiredCallback, validateMaxSelectionCallback],
    [validateRequiredCallback, validateMaxSelectionCallback],
  );

  return (
    <section className="example-section">
      <h2>유효성 검사</h2>
      <div className="example-grid">
        <div className="example-item">
          <SelectBox
            value={validateSelect}
            onChange={handleValidateChange}
            options={OPTIONS}
            validate={validateRules}
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
            onChange={handleValidateMultipleChange}
            options={OPTIONS}
            multiple
            validate={validateMultipleRules}
            placeholder="최대 3개 선택"
            required
            block
          />
          <span className="example-label">범위 선택 검사</span>
        </div>
      </div>
    </section>
  );
});

ValidationExample.displayName = 'ValidationExample';

const SearchExample = React.memo<{
  searchableSelect: string;
  setSearchableSelect: (value: string) => void;
}>(({ searchableSelect, setSearchableSelect }) => {
  const handleSearchableChange = useCallback(
    (v: string | string[]) => {
      if (typeof v === 'string') {
        setSearchableSelect(v);
      }
    },
    [setSearchableSelect],
  );

  return (
    <section className="example-section">
      <h2>검색 기능</h2>
      <div className="example-grid">
        <div className="example-item">
          <SelectBox
            value={searchableSelect}
            onChange={handleSearchableChange}
            options={LONG_OPTIONS}
            searchable
            placeholder="검색하여 선택하세요"
            block
          />
          <span className="example-label">검색 가능한 선택</span>
        </div>
      </div>
    </section>
  );
});

SearchExample.displayName = 'SearchExample';

const AcceptButtonExample = React.memo<{
  multipleSelect: string[];
  setMultipleSelect: (value: string[]) => void;
}>(({ multipleSelect, setMultipleSelect }) => {
  const handleAcceptChange = useCallback(
    (v: string | string[]) => {
      if (Array.isArray(v)) {
        setMultipleSelect(v);
      }
    },
    [setMultipleSelect],
  );

  return (
    <section className="example-section">
      <h2>적용 버튼</h2>
      <div className="example-grid">
        <div className="example-item">
          <SelectBox
            value={multipleSelect}
            onChange={handleAcceptChange}
            options={OPTIONS}
            multiple
            btnAccept
            placeholder="적용 버튼이 있는 다중 선택"
            block
          />
          <span className="example-label">적용 버튼 모드</span>
        </div>
      </div>
    </section>
  );
});

AcceptButtonExample.displayName = 'AcceptButtonExample';

const StateExample = React.memo<{
  basicSelect: string | string[];
  setBasicSelect: (value: string | string[]) => void;
}>(({ basicSelect, setBasicSelect }) => {
  const handleStateChange = useCallback(
    (v: string | string[]) => {
      if (typeof v === 'string') {
        setBasicSelect(v);
      }
    },
    [setBasicSelect],
  );

  return (
    <section className="example-section">
      <h2>상태별 표시</h2>
      <div className="example-grid">
        <div className="example-item">
          <SelectBox
            value={basicSelect}
            onChange={handleStateChange}
            options={OPTIONS}
            placeholder="읽기 전용"
            readonly
            block
          />
          <span className="example-label">읽기 전용</span>
        </div>
        <div className="example-item">
          <SelectBox
            value={basicSelect}
            onChange={handleStateChange}
            options={OPTIONS}
            disabled
            placeholder="비활성화 상태"
            block
          />
          <span className="example-label">비활성화 상태</span>
        </div>
      </div>
    </section>
  );
});

StateExample.displayName = 'StateExample';

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
          <BasicSelectExample
            basicSelect={basicSelect}
            setBasicSelect={setBasicSelect}
            multipleSelect={multipleSelect}
            setMultipleSelect={setMultipleSelect}
          />
          <LabelStyleExample basicSelect={basicSelect} setBasicSelect={setBasicSelect} />
          <ValidationExample
            validateSelect={validateSelect}
            setValidateSelect={setValidateSelect}
            validateMultiple={validateMultiple}
            setValidateMultiple={setValidateMultiple}
            validateRef={validateRef}
          />
          <SearchExample
            searchableSelect={searchableSelect}
            setSearchableSelect={setSearchableSelect}
          />
          <AcceptButtonExample
            multipleSelect={multipleSelect}
            setMultipleSelect={setMultipleSelect}
          />
          <StateExample basicSelect={basicSelect} setBasicSelect={setBasicSelect} />
        </div>
      </main>
      <FloatingBackButton />
    </div>
  );
};

export default SelectBoxExample;
