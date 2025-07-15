import FloatingBackButton from '@/views/FloatingBackButton/index';
import React, { useCallback, useState } from 'react';
import './ex.scss';
import StatusSelector from './index';
import type { StatusSelectorItem } from './types';

// 예제 데이터
const statusOptions: StatusSelectorItem[] = [
  { text: '대기중', value: 'pending', color: 'warning' },
  { text: '진행중', value: 'processing', color: 'info' },
  { text: '완료', value: 'completed', color: 'success' },
  { text: '오류', value: 'error', color: 'error' },
  { text: '취소', value: 'cancelled', color: 'secondary' },
];

const customColorOptions: StatusSelectorItem[] = [
  { text: '높음', value: 'high', color: '#dc3545' },
  { text: '보통', value: 'medium', color: '#ffc107' },
  { text: '낮음', value: 'low', color: '#28a745' },
];

const StatusSelectorExample: React.FC = () => {
  // 상태 관리
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [selectedCustomStatus, setSelectedCustomStatus] = useState('medium');
  const selectedReadOnly = 'completed'; // 읽기 전용은 상수로 대체

  // 이벤트 핸들러
  const handleStatusChange = useCallback((value: string, index: number) => {
    console.log(`상태 변경: ${value} (인덱스: ${index})`);
    setSelectedStatus(value);
  }, []);

  const handleCustomStatusChange = useCallback((value: string, index: number) => {
    console.log(`커스텀 상태 변경: ${value} (인덱스: ${index})`);
    setSelectedCustomStatus(value);
  }, []);

  return (
    <div id="app">
      <header className="app-header">
        <div className="container">
          <h1>StatusSelector Component Examples</h1>
          <p>React + TypeScript로 개발된 상태 선택 컴포넌트</p>
        </div>
      </header>
      <main className="main-content">
        <div className="container">
          {/* 기본 사용법 */}
          <section className="example-section">
            <h2>기본 사용법</h2>
            <div className="example-grid">
              <div className="example-item">
                <StatusSelector
                  value={selectedStatus}
                  options={statusOptions}
                  onChange={handleStatusChange}
                />
                <span className="example-label">기본 상태 선택기</span>
              </div>
              <div className="example-item">
                <StatusSelector
                  value={selectedStatus}
                  options={statusOptions}
                  circle
                  onChange={handleStatusChange}
                />
                <span className="example-label">원형 표시기 포함</span>
              </div>
            </div>
          </section>
          {/* 사이즈 변형 */}
          <section className="example-section">
            <h2>사이즈 변형</h2>
            <div className="example-grid">
              <div className="example-item">
                <StatusSelector
                  value={selectedStatus}
                  options={statusOptions}
                  size="small"
                  onChange={handleStatusChange}
                />
                <span className="example-label">Small Size</span>
              </div>
              <div className="example-item">
                <StatusSelector
                  value={selectedStatus}
                  options={statusOptions}
                  size="medium"
                  onChange={handleStatusChange}
                />
                <span className="example-label">Medium Size (기본)</span>
              </div>
              <div className="example-item">
                <StatusSelector
                  value={selectedStatus}
                  options={statusOptions}
                  size="large"
                  onChange={handleStatusChange}
                />
                <span className="example-label">Large Size</span>
              </div>
            </div>
          </section>
          {/* 사이즈 + 원형 표시기 */}
          <section className="example-section">
            <h2>사이즈 + 원형 표시기</h2>
            <div className="example-grid">
              <div className="example-item">
                <StatusSelector
                  value={selectedStatus}
                  options={statusOptions}
                  size="small"
                  circle
                  onChange={handleStatusChange}
                />
                <span className="example-label">Small + Circle</span>
              </div>
              <div className="example-item">
                <StatusSelector
                  value={selectedStatus}
                  options={statusOptions}
                  size="medium"
                  circle
                  onChange={handleStatusChange}
                />
                <span className="example-label">Medium + Circle</span>
              </div>
              <div className="example-item">
                <StatusSelector
                  value={selectedStatus}
                  options={statusOptions}
                  size="large"
                  circle
                  onChange={handleStatusChange}
                />
                <span className="example-label">Large + Circle</span>
              </div>
            </div>
          </section>
          {/* 커스텀 색상 */}
          <section className="example-section">
            <h2>커스텀 색상</h2>
            <div className="example-grid">
              <div className="example-item">
                <StatusSelector
                  value={selectedCustomStatus}
                  options={customColorOptions}
                  onChange={handleCustomStatusChange}
                />
                <span className="example-label">커스텀 색상</span>
              </div>
              <div className="example-item">
                <StatusSelector
                  value={selectedCustomStatus}
                  options={customColorOptions}
                  circle
                  onChange={handleCustomStatusChange}
                />
                <span className="example-label">커스텀 색상 + 원형 표시기</span>
              </div>
            </div>
          </section>
          {/* 읽기 전용 모드 */}
          <section className="example-section">
            <h2>읽기 전용 모드</h2>
            <div className="example-grid">
              <div className="example-item">
                <StatusSelector value={selectedReadOnly} options={statusOptions} readOnly />
                <span className="example-label">읽기 전용</span>
              </div>
              <div className="example-item">
                <StatusSelector value={selectedReadOnly} options={statusOptions} circle readOnly />
                <span className="example-label">읽기 전용 + 원형 표시기</span>
              </div>
            </div>
          </section>
          {/* 접근성 테스트 */}
          <section className="example-section">
            <h2>접근성 테스트</h2>
            <div className="accessibility-info">
              <h3>키보드 네비게이션</h3>
              <ul>
                <li>
                  <strong>Enter/Space</strong>: 상태 선택기 열기/닫기
                </li>
                <li>
                  <strong>Arrow Down/Up</strong>: 옵션 간 이동
                </li>
                <li>
                  <strong>Escape</strong>: 선택기 닫기
                </li>
              </ul>
            </div>
            <div className="example-grid">
              <div className="example-item">
                <StatusSelector
                  value={selectedStatus}
                  options={statusOptions}
                  circle
                  onChange={handleStatusChange}
                />
                <span className="example-label">키보드로 테스트</span>
              </div>
            </div>
          </section>
          {/* 현재 선택된 값 표시 */}
          <section className="example-section">
            <h2>현재 선택된 값</h2>
            <div className="status-display">
              <div className="status-item">
                <strong>기본 상태:</strong> {selectedStatus}
              </div>
              <div className="status-item">
                <strong>커스텀 상태:</strong> {selectedCustomStatus}
              </div>
              <div className="status-item">
                <strong>읽기 전용 상태:</strong> {selectedReadOnly}
              </div>
            </div>
          </section>
        </div>
      </main>
      {/* Floating Back Button */}
      <FloatingBackButton />
    </div>
  );
};

export default StatusSelectorExample;
