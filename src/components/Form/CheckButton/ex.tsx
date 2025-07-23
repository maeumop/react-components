import FloatingBackButton from '@/views/FloatingBackButton';
import React, { useEffect, useRef, useState } from 'react';
import './ex.scss';
import CheckButton from './index';
import type { CheckButtonItem, CheckButtonModel } from './types';

const hobbyItems: CheckButtonItem[] = [
  { text: '독서', value: 'reading' },
  { text: '운동', value: 'sports' },
  { text: '음악 감상', value: 'music' },
  { text: '요리', value: 'cooking' },
  { text: '여행', value: 'travel' },
  { text: '게임', value: 'gaming' },
];
const genderItems: CheckButtonItem[] = [
  { text: '남성', value: 'male' },
  { text: '여성', value: 'female' },
  { text: '기타', value: 'other' },
];
const optionItems: CheckButtonItem[] = [
  { text: '옵션 1', value: 'option1' },
  { text: '옵션 2', value: 'option2' },
  { text: '옵션 3', value: 'option3' },
];
const colorItems: CheckButtonItem[] = [
  { text: '항목 1', value: 'item1' },
  { text: '항목 2', value: 'item2' },
  { text: '항목 3', value: 'item3' },
];
const limitedItems: CheckButtonItem[] = [
  { text: '항목 1', value: 'item1' },
  { text: '항목 2', value: 'item2' },
  { text: '항목 3', value: 'item3' },
  { text: '항목 4', value: 'item4' },
];
const allItems: CheckButtonItem[] = [
  { text: '항목 1', value: 'item1' },
  { text: '항목 2', value: 'item2' },
  { text: '항목 3', value: 'item3' },
];
const validatedItems: CheckButtonItem[] = [
  { text: '항목 1', value: 'item1' },
  { text: '항목 2', value: 'item2' },
  { text: '항목 3', value: 'item3' },
];
const lineLimitItems: CheckButtonItem[] = [
  { text: '항목 1', value: 'item1' },
  { text: '항목 2', value: 'item2' },
  { text: '항목 3', value: 'item3' },
  { text: '항목 4', value: 'item4' },
  { text: '항목 5', value: 'item5' },
  { text: '항목 6', value: 'item6' },
];
const disabledItems: CheckButtonItem[] = [
  { text: '활성 항목 1', value: 'active1' },
  { text: '활성 항목 2', value: 'active2' },
  { text: '활성 항목 3', value: 'active3' },
];
const blockItems: CheckButtonItem[] = [
  { text: '블록 항목 1', value: 'block1' },
  { text: '블록 항목 2', value: 'block2' },
  { text: '블록 항목 3', value: 'block3' },
];

const validators = [
  (value: unknown) => {
    if (Array.isArray(value) && value.length === 0) {
      return '최소 1개 이상 선택해주세요.';
    }
    return true;
  },
  (value: unknown) => {
    if (Array.isArray(value) && value.length > 2) {
      return '최대 2개까지만 선택 가능합니다.';
    }
    return true;
  },
];

const CheckButtonExample: React.FC = () => {
  const [selectedHobbies, setSelectedHobbies] = useState<string | string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string | string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string | string[]>([]);
  const [selectedPrimary, setSelectedPrimary] = useState<string | string[]>([]);
  const [selectedSuccess, setSelectedSuccess] = useState<string | string[]>([]);
  const [selectedWarning, setSelectedWarning] = useState<string | string[]>([]);
  const [selectedError, setSelectedError] = useState<string | string[]>([]);
  const [selectedLimited, setSelectedLimited] = useState<string | string[]>([]);
  const [selectedAll, setSelectedAll] = useState<string | string[]>([]);
  const [selectedValidated, setSelectedValidated] = useState<string | string[]>([]);
  const [selectedLineLimit, setSelectedLineLimit] = useState<string | string[]>([]);
  const [selectedDisabled, setSelectedDisabled] = useState<string | string[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string | string[]>([]);
  const checkButtonRef = useRef<CheckButtonModel>(null);

  const validate = () => {
    checkButtonRef.current?.check();
  };

  useEffect(() => {
    console.log('main reload');
  }, []);

  return (
    <div id="app">
      <header className="app-header">
        <div className="container">
          <h1>CheckButton Component Examples</h1>
          <p>React CheckButton 컴포넌트 사용 예제</p>
        </div>
      </header>
      <main className="main-content">
        <div className="container">
          {/* 기본 체크박스 */}
          <section className="example-section">
            <h2>기본 체크박스</h2>
            <div className="example-item">
              <CheckButton
                value={selectedHobbies}
                onChange={setSelectedHobbies}
                items={hobbyItems}
                name="hobbies"
                label="취미"
              />
              <div className="result">선택된 값: {JSON.stringify(selectedHobbies)}</div>
            </div>
          </section>
          {/* 라디오 버튼 */}
          <section className="example-section">
            <h2>라디오 버튼</h2>
            <div className="example-item">
              <CheckButton
                value={selectedGender}
                onChange={setSelectedGender}
                items={genderItems}
                name="gender"
                type="radio"
                label="성별"
                required
              />
              <div className="result">선택된 값: {selectedGender}</div>
            </div>
          </section>
          {/* 버튼 UI 모드 */}
          <section className="example-section">
            <h2>버튼 UI 모드</h2>
            <div className="example-item">
              <CheckButton
                value={selectedOptions}
                onChange={setSelectedOptions}
                items={optionItems}
                name="options"
                button
                color="success"
                label="옵션 선택"
              />
              <div className="result">선택된 값: {JSON.stringify(selectedOptions)}</div>
            </div>
          </section>
          {/* 다양한 색상 */}
          <section className="example-section">
            <h2>다양한 색상</h2>
            <div className="example-grid">
              <div className="example-item">
                <CheckButton
                  value={selectedPrimary}
                  onChange={setSelectedPrimary}
                  items={colorItems}
                  name="primary"
                  color="primary"
                  label="Primary"
                />
                <span className="example-label">Primary</span>
              </div>
              <div className="example-item">
                <CheckButton
                  value={selectedSuccess}
                  onChange={setSelectedSuccess}
                  items={colorItems}
                  name="success"
                  color="success"
                  label="Success"
                />
                <span className="example-label">Success</span>
              </div>
              <div className="example-item">
                <CheckButton
                  value={selectedWarning}
                  onChange={setSelectedWarning}
                  items={colorItems}
                  name="warning"
                  color="warning"
                  label="Warning"
                />
                <span className="example-label">Warning</span>
              </div>
              <div className="example-item">
                <CheckButton
                  value={selectedError}
                  onChange={setSelectedError}
                  items={colorItems}
                  name="error"
                  color="error"
                  label="Error"
                />
                <span className="example-label">Error</span>
              </div>
            </div>
          </section>
          {/* 최대 선택 제한 */}
          <section className="example-section">
            <h2>최대 선택 제한 (2개)</h2>
            <div className="example-item">
              <CheckButton
                value={selectedLimited}
                onChange={setSelectedLimited}
                items={limitedItems}
                name="limited"
                maxLength={2}
                label="최대 2개 선택"
              />
              <div className="result">선택된 값: {JSON.stringify(selectedLimited)}</div>
            </div>
          </section>
          {/* 전체 선택 기능 */}
          <section className="example-section">
            <h2>전체 선택 기능</h2>
            <div className="example-item">
              <CheckButton
                value={selectedAll}
                onChange={setSelectedAll}
                items={allItems}
                name="all"
                all
                label="전체 선택"
              />
              <div className="result">선택된 값: {JSON.stringify(selectedAll)}</div>
            </div>
          </section>
          {/* 유효성 검사 */}
          <section className="example-section">
            <h2>유효성 검사</h2>
            <div className="example-item">
              <CheckButton
                ref={checkButtonRef}
                value={selectedValidated}
                onChange={setSelectedValidated}
                items={validatedItems}
                name="validated"
                label="유효성 체크"
                validate={validators}
              />
              <div className="result">선택된 값: {JSON.stringify(selectedValidated)}</div>
              <button className="demo-button mt-2 block" onClick={validate}>
                유효성 검사
              </button>
            </div>
          </section>
          {/* 라인 제한 */}
          <section className="example-section">
            <h2>라인 제한 (한 줄에 3개)</h2>
            <div className="example-item">
              <CheckButton
                value={selectedLineLimit}
                onChange={setSelectedLineLimit}
                items={lineLimitItems}
                name="linelimit"
                lineLimit={3}
                label="라인 제한"
              />
              <div className="result">선택된 값: {JSON.stringify(selectedLineLimit)}</div>
            </div>
          </section>
          {/* 비활성화 상태 */}
          <section className="example-section">
            <h2>비활성화 상태</h2>
            <div className="example-item">
              <CheckButton
                value={selectedDisabled}
                onChange={setSelectedDisabled}
                items={disabledItems}
                name="disabled"
                disabled
                label="비활성화"
              />
              <div className="result">선택된 값: {JSON.stringify(selectedDisabled)}</div>
            </div>
          </section>
          {/* 블록 모드 */}
          <section className="example-section">
            <h2>블록 모드</h2>
            <div className="example-item">
              <CheckButton
                value={selectedBlock}
                onChange={setSelectedBlock}
                items={blockItems}
                name="block"
                block
                label="블록 모드"
              />
              <div className="result">선택된 값: {JSON.stringify(selectedBlock)}</div>
            </div>
          </section>
        </div>
      </main>
      <FloatingBackButton />
    </div>
  );
};

export default CheckButtonExample;
