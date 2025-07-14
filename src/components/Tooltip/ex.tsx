import FloatingBackButton from '@/views/FloatingBackButton/index';
import React, { useCallback, useState } from 'react';
import { tooltipColor, tooltipPosition } from './const';
import './ex.scss';
import Tooltip from './index';
import './style.scss';
import type { TooltipColor, TooltipPosition } from './types';

const messageList = ['첫 번째 도움말 메시지', '두 번째 도움말 메시지', '세 번째 도움말 메시지'];

const TooltipExample: React.FC = () => {
  const [currentPosition, setCurrentPosition] = useState<TooltipPosition>(tooltipPosition.bottom);
  const [currentColor, setCurrentColor] = useState<TooltipColor>(tooltipColor.default);
  const [isHovering, setIsHovering] = useState(true);
  const [isDark, setIsDark] = useState(false);

  // 핸들러
  const changePosition = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentPosition(e.target.value as TooltipPosition);
  }, []);
  const changeColor = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentColor(e.target.value as TooltipColor);
  }, []);

  return (
    <div id="app">
      <header className="app-header">
        <div className="container">
          <h1>Tooltip Component Examples</h1>
          <p>React + TypeScript로 개발된 유연하고 접근성 있는 툴팁 컴포넌트</p>
        </div>
      </header>
      <main className="main-content">
        <div className="container">
          {/* 기본 사용법 */}
          <section className="example-section">
            <h2>기본 사용법</h2>
            <div className="example-grid">
              <div className="example-item">
                <Tooltip message="기본 툴팁 메시지입니다.">
                  <button className="btn-primary">기본 버튼</button>
                </Tooltip>
                <span className="example-label">기본 툴팁</span>
              </div>
              <div className="example-item">
                <Tooltip message="제목이 있는 툴팁" title="도움말">
                  <span className="text-link">도움말 링크</span>
                </Tooltip>
                <span className="example-label">제목 포함</span>
              </div>
              <div className="example-item">
                <Tooltip message={messageList} title="목록 툴팁" width={230}>
                  <div className="info-badge">목록 정보</div>
                </Tooltip>
                <span className="example-label">목록 형태</span>
              </div>
            </div>
          </section>

          {/* 위치별 툴팁 */}
          <section className="example-section">
            <h2>위치별 툴팁</h2>
            <div className="example-grid">
              <div className="example-item">
                <Tooltip position={tooltipPosition.top} message="위쪽에 표시되는 툴팁">
                  <button className="btn-secondary">Top 툴팁</button>
                </Tooltip>
                <span className="example-label">Top</span>
              </div>
              <div className="example-item">
                <Tooltip position={tooltipPosition.bottom} message="아래쪽에 표시되는 툴팁">
                  <button className="btn-secondary">Bottom 툴팁</button>
                </Tooltip>
                <span className="example-label">Bottom</span>
              </div>
              <div className="example-item">
                <Tooltip position={tooltipPosition.left} message="왼쪽에 표시되는 툴팁">
                  <button className="btn-secondary">Left 툴팁</button>
                </Tooltip>
                <span className="example-label">Left</span>
              </div>
              <div className="example-item">
                <Tooltip position={tooltipPosition.right} message="오른쪽에 표시되는 툴팁">
                  <button className="btn-secondary">Right 툴팁</button>
                </Tooltip>
                <span className="example-label">Right</span>
              </div>
            </div>
          </section>

          {/* 색상 테마 */}
          <section className="example-section">
            <h2>색상 테마</h2>
            <div className="example-grid">
              <div className="example-item">
                <Tooltip color={tooltipColor.default} message="기본 테마">
                  <div className="color-badge default">Default</div>
                </Tooltip>
                <span className="example-label">Default</span>
              </div>
              <div className="example-item">
                <Tooltip color={tooltipColor.primary} message="주요 액션">
                  <div className="color-badge primary">Primary</div>
                </Tooltip>
                <span className="example-label">Primary</span>
              </div>
              <div className="example-item">
                <Tooltip color={tooltipColor.secondary} message="보조 액션">
                  <div className="color-badge secondary">Secondary</div>
                </Tooltip>
                <span className="example-label">Secondary</span>
              </div>
              <div className="example-item">
                <Tooltip color={tooltipColor.success} message="성공 메시지">
                  <div className="color-badge success">Success</div>
                </Tooltip>
                <span className="example-label">Success</span>
              </div>
              <div className="example-item">
                <Tooltip color={tooltipColor.warning} message="경고 메시지">
                  <div className="color-badge warning">Warning</div>
                </Tooltip>
                <span className="example-label">Warning</span>
              </div>
              <div className="example-item">
                <Tooltip color={tooltipColor.error} message="오류 메시지">
                  <div className="color-badge error">Error</div>
                </Tooltip>
                <span className="example-label">Error</span>
              </div>
              <div className="example-item">
                <Tooltip color={tooltipColor.info} message="정보 메시지">
                  <div className="color-badge info">Info</div>
                </Tooltip>
                <span className="example-label">Info</span>
              </div>
            </div>
          </section>

          {/* 고급 기능 */}
          <section className="example-section">
            <h2>고급 기능</h2>
            <div className="example-grid">
              <div className="example-item">
                <Tooltip message="호버링으로 표시되는 툴팁" hovering color={tooltipColor.success}>
                  <div className="hover-element">호버 요소</div>
                </Tooltip>
                <span className="example-label">호버링 모드</span>
              </div>
              <div className="example-item">
                <Tooltip message="다크 테마 툴팁" dark>
                  <div className="dark-element">다크 테마</div>
                </Tooltip>
                <span className="example-label">다크 테마</span>
              </div>
              <div className="example-item">
                <Tooltip
                  color={tooltipColor.secondary}
                  hovering
                  width={350}
                  content={() => (
                    <div className="custom-tooltip">
                      <h4>커스텀 내용</h4>
                      <p>커스텀 slot으로 만든 툴팁입니다.</p>
                      <p>커스텀 컨텐츠는 필히 width 속성을 조절 해주세요.</p>
                    </div>
                  )}
                >
                  <div className="custom-element">커스텀 내용</div>
                </Tooltip>
                <span className="example-label">커스텀 내용</span>
              </div>
            </div>
          </section>

          {/* 호버 vs 클릭 비교 */}
          <section className="example-section">
            <h2>호버 vs 클릭 비교</h2>
            <p className="comparison-description">호버 모드와 클릭 모드의 차이점을 비교해보세요.</p>
            <div className="comparison-grid">
              <div className="comparison-item">
                <h3>호버 모드 (hovering: true)</h3>
                <div className="comparison-examples">
                  <div className="comparison-example">
                    <Tooltip
                      message="마우스를 올리면 즉시 나타나고, 벗어나면 사라집니다."
                      color={tooltipColor.success}
                      width={350}
                    >
                      <div className="hover-target">
                        <span>호버하여 표시</span>
                      </div>
                    </Tooltip>
                    <p className="comparison-text">마우스 호버 시 자동 표시/숨김</p>
                  </div>
                </div>
              </div>
              <div className="comparison-item">
                <h3>클릭 모드 (hovering: false)</h3>
                <div className="comparison-examples">
                  <div className="comparison-example">
                    <Tooltip
                      message="클릭하면 나타나고, 다시 클릭하거나 다른 곳을 클릭하면 사라집니다."
                      hovering={false}
                      color={tooltipColor.primary}
                    >
                      <div className="click-target">
                        <span>클릭하여 표시</span>
                      </div>
                    </Tooltip>
                    <p className="comparison-text">클릭 시 수동 표시/숨김</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 상호작용 예제 */}
          <section className="example-section">
            <h2>상호작용 예제</h2>
            <div className="interactive-examples">
              <div className="control-panel">
                <h3>설정 패널</h3>
                <div className="control-group">
                  <label>위치:</label>
                  <select value={currentPosition} onChange={changePosition}>
                    <option value={tooltipPosition.top}>Top</option>
                    <option value={tooltipPosition.bottom}>Bottom</option>
                    <option value={tooltipPosition.left}>Left</option>
                    <option value={tooltipPosition.right}>Right</option>
                  </select>
                </div>
                <div className="control-group">
                  <label>색상:</label>
                  <select value={currentColor} onChange={changeColor}>
                    <option value={tooltipColor.default}>Default</option>
                    <option value={tooltipColor.primary}>Primary</option>
                    <option value={tooltipColor.secondary}>Secondary</option>
                    <option value={tooltipColor.success}>Success</option>
                    <option value={tooltipColor.warning}>Warning</option>
                    <option value={tooltipColor.error}>Error</option>
                    <option value={tooltipColor.info}>Info</option>
                  </select>
                </div>
                <div className="control-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={isHovering}
                      onChange={e => setIsHovering(e.target.checked)}
                    />
                    호버링 모드
                  </label>
                </div>
                <div className="control-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={isDark}
                      onChange={e => setIsDark(e.target.checked)}
                    />
                    다크 테마
                  </label>
                </div>
              </div>
              <div className="preview-area">
                <h3>미리보기</h3>
                <div className="preview-tooltip">
                  <Tooltip
                    message="동적으로 변경되는 툴팁입니다. 설정 패널에서 옵션을 변경해보세요!"
                    title="동적 툴팁"
                    position={currentPosition}
                    color={currentColor}
                    hovering={isHovering}
                    dark={isDark}
                  >
                    <button className="preview-btn">동적 툴팁</button>
                  </Tooltip>
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

export default TooltipExample;
