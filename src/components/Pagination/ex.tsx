import FloatingBackButton from '@/views/FloatingBackButton';
import React, { useCallback, useMemo, useState } from 'react';
import './ex.scss';
import Pagination from './index';

// FloatingBackButton 컴포넌트는 실제 프로젝트에 맞게 import 필요
// import FloatingBackButton from '@/views/FloatingBackButton';

/**
 * Pagination 컴포넌트 예제 (React)
 */
const PaginationExample: React.FC = () => {
  // 샘플 데이터 상태
  const [totalItems, setTotalItems] = useState<number>(16723);
  const [pageSize, setPageSize] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 계산된 값
  const totalPages = useMemo(() => Math.ceil(totalItems / pageSize), [totalItems, pageSize]);
  const startItem = useMemo(() => (currentPage - 1) * pageSize + 1, [currentPage, pageSize]);
  const endItem = useMemo(() => {
    const end = currentPage * pageSize;

    if (end > totalItems) {
      return totalItems;
    }

    return end;
  }, [currentPage, pageSize, totalItems]);

  // 페이지 크기 변경 핸들러
  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1); // 첫 페이지로 리셋
    // 실제로는 API 호출 등 처리
  }, []);

  // 로딩 시뮬레이션
  const simulateLoading = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  // 데이터 변경 시뮬레이션
  const changeTotalItems = useCallback((newTotal: number) => {
    setTotalItems(newTotal);
    setCurrentPage(1);
  }, []);

  return (
    <div id="app">
      <header className="app-header">
        <div className="container">
          <h1>Pagination Component Examples</h1>
          <p>React + TypeScript로 개발된 페이지네이션 컴포넌트</p>
        </div>
      </header>
      <main className="main-content">
        <div className="container">
          {/* 기본 페이지네이션 */}
          <section className="example-section">
            <h2>기본 페이지네이션</h2>
            <div className="example-item">
              <div className="info">
                <p>
                  총 {totalItems}개 항목, {totalPages}페이지
                </p>
                <p>
                  현재 {startItem} - {endItem} / {totalItems}개 항목
                </p>
              </div>
              <Pagination
                value={currentPage}
                total={totalItems}
                size={pageSize}
                block={10}
                onChange={setCurrentPage}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          </section>
          {/* 비활성화 상태 */}
          <section className="example-section">
            <h2>비활성화 상태</h2>
            <div className="example-item">
              <div className="info">
                <p>로딩 중일 때 페이지네이션 비활성화</p>
                <button onClick={simulateLoading} className="demo-button">
                  로딩 시뮬레이션 (2초)
                </button>
              </div>
              <Pagination
                value={currentPage}
                total={totalItems}
                size={pageSize}
                block={10}
                disabled={isLoading}
                onChange={setCurrentPage}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          </section>
          {/* 커스텀 페이지 크기 옵션 */}
          <section className="example-section">
            <h2>커스텀 페이지 크기 옵션</h2>
            <div className="example-item">
              <Pagination
                value={currentPage}
                total={totalItems}
                size={pageSize}
                block={10}
                pageSizeOptions={[5, 10, 25, 50, 100, 200]}
                onChange={setCurrentPage}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          </section>
          {/* 작은 데이터셋 */}
          <section className="example-section">
            <h2>작은 데이터셋</h2>
            <div className="example-item">
              <div className="info">
                <p>적은 수의 데이터로 페이지네이션 테스트</p>
                <div className="button-group">
                  <button onClick={() => changeTotalItems(50)} className="demo-button">
                    50개 항목
                  </button>
                  <button onClick={() => changeTotalItems(10)} className="demo-button">
                    10개 항목
                  </button>
                  <button onClick={() => changeTotalItems(5)} className="demo-button">
                    5개 항목
                  </button>
                  <button onClick={() => changeTotalItems(0)} className="demo-button">
                    0개 항목
                  </button>
                </div>
              </div>
              <Pagination
                value={currentPage}
                total={totalItems}
                size={pageSize}
                block={5}
                onChange={setCurrentPage}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          </section>
          {/* 큰 데이터셋 */}
          <section className="example-section">
            <h2>큰 데이터셋</h2>
            <div className="example-item">
              <div className="info">
                <p>많은 수의 데이터로 페이지네이션 테스트</p>
                <div className="button-group">
                  <button onClick={() => changeTotalItems(100000)} className="demo-button">
                    100,000개 항목
                  </button>
                  <button onClick={() => changeTotalItems(1000000)} className="demo-button">
                    1,000,000개 항목
                  </button>
                </div>
              </div>
              <Pagination
                value={currentPage}
                total={totalItems}
                size={pageSize}
                block={10}
                onChange={setCurrentPage}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          </section>
          {/* 커스텀 접근성 라벨 */}
          <section className="example-section">
            <h2>커스텀 접근성 라벨</h2>
            <div className="example-item">
              <Pagination
                value={currentPage}
                total={totalItems}
                size={pageSize}
                block={10}
                ariaLabel="사용자 목록 페이지네이션"
                onChange={setCurrentPage}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          </section>
          {/* 페이지 크기 선택기 없음 */}
          <section className="example-section">
            <h2>페이지 크기 선택기 없음</h2>
            <div className="example-item">
              <Pagination
                value={currentPage}
                total={totalItems}
                size={pageSize}
                block={10}
                pageSizeOptions={[]}
                onChange={setCurrentPage}
              />
            </div>
          </section>
          {/* 현재 상태 표시 */}
          <section className="example-section">
            <h2>현재 상태</h2>
            <div className="example-item">
              <div className="status-info">
                <div className="status-item">
                  <strong>현재 페이지:</strong> {currentPage}
                </div>
                <div className="status-item">
                  <strong>페이지 크기:</strong> {pageSize}
                </div>
                <div className="status-item">
                  <strong>총 항목:</strong> {totalItems}
                </div>
                <div className="status-item">
                  <strong>총 페이지:</strong> {totalPages}
                </div>
                <div className="status-item">
                  <strong>표시 범위:</strong> {startItem} - {endItem}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <FloatingBackButton />
    </div>
  );
};

export default PaginationExample;
