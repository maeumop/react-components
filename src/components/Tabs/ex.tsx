import React, { useCallback, useState } from 'react';
import { tabsTransition, tabsVariant } from './const';
import './ex.scss';
import Tabs from './index';
import type { TabsTransition, TabsVariant } from './types';
// import FloatingBackButton from '@/views/FloatingBackButton'; // 실제 경로에 맞게 수정 필요

// 기본 탭 데이터
const basicTabItems = ['홈', '프로필', '설정', '도움말'];

// 고급 탭 데이터
const advancedTabItems = ['개요', '상세정보', '통계', '설정', '로그'];
const initialDisabledTabs = [false, false, true, false, false];

// 스타일 변형
const variantTabItems = ['기본', '언더라인', '필스'];

// v-model 테스트
const vModelTabItems = ['탭 1', '탭 2', '탭 3'];

// 트랜지션 테스트
const transitionTabItems = ['첫 번째', '두 번째', '세 번째'];

const TabsExample: React.FC = () => {
  // 상태 관리
  const [advancedActiveTab, setAdvancedActiveTab] = useState(0);
  const [disabledTabs, setDisabledTabs] = useState([...initialDisabledTabs]);
  const [currentVariant, setCurrentVariant] = useState<TabsVariant>('default');
  const [variantActiveTab, setVariantActiveTab] = useState(0);
  const [vModelActiveTab, setVModelActiveTab] = useState(0);
  const [currentTransition, setCurrentTransition] = useState<TabsTransition>('slide');
  const [transitionActiveTab, setTransitionActiveTab] = useState(0);

  // 이벤트 핸들러
  const handleTabChange = useCallback((index: number) => {
    console.log('탭 변경:', index);
  }, []);

  const handleVModelChange = useCallback((index: number) => {
    console.log('v-model 변경:', index);
  }, []);

  const changeVariant = useCallback((variant: TabsVariant) => {
    setCurrentVariant(variant);
    setVariantActiveTab(0);
  }, []);

  const changeTransition = useCallback((transition: TabsTransition) => {
    setCurrentTransition(transition);
    setTransitionActiveTab(0);
  }, []);

  const toggleDisabled = useCallback((index: number) => {
    setDisabledTabs(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }, []);

  return (
    <div id="app">
      <header className="app-header">
        <div className="container">
          <h1>Tabs Component Examples</h1>
          <p>React + TypeScript로 개발된 탭 컴포넌트</p>
        </div>
      </header>
      <main className="main-content">
        <div className="container">
          {/* 기본 사용법 */}
          <section className="example-section">
            <h2>기본 사용법</h2>
            <div className="example-grid">
              <div className="example-item">
                <Tabs tabItems={basicTabItems} onChangeTab={handleTabChange}>
                  <div className="tab-content">
                    <h3>홈 탭</h3>
                    <p>메인 페이지 내용입니다. 사용자가 처음 접하는 화면입니다.</p>
                  </div>
                  <div className="tab-content">
                    <h3>프로필 탭</h3>
                    <p>사용자 프로필 정보를 표시합니다. 개인정보 수정이 가능합니다.</p>
                  </div>
                  <div className="tab-content">
                    <h3>설정 탭</h3>
                    <p>애플리케이션 설정을 관리합니다. 테마, 언어, 알림 등을 설정할 수 있습니다.</p>
                  </div>
                  <div className="tab-content">
                    <h3>도움말 탭</h3>
                    <p>사용법과 FAQ를 제공합니다. 문제 해결을 위한 가이드를 확인하세요.</p>
                  </div>
                </Tabs>
                <span className="example-label">기본 탭 컴포넌트</span>
              </div>
            </div>
          </section>
          {/* v-model 사용법 */}
          <section className="example-section">
            <h2>v-model 사용법</h2>
            <div className="example-grid">
              <div className="example-item">
                <div className="control-panel">
                  <p>
                    현재 활성 탭: <strong>{vModelActiveTab}</strong>
                  </p>
                  <div className="button-group">
                    {vModelTabItems.map((item, index) => (
                      <button
                        key={index}
                        className={`control-button${index === vModelActiveTab ? ' active' : ''}`}
                        onClick={() => setVModelActiveTab(index)}
                        type="button"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <Tabs
                  tabItems={vModelTabItems}
                  activeTab={vModelActiveTab}
                  onUpdateActiveTab={setVModelActiveTab}
                  onChangeTab={handleVModelChange}
                >
                  <div className="tab-content">
                    <h3>첫 번째 탭</h3>
                    <p>v-model로 외부에서 제어되는 탭입니다.</p>
                  </div>
                  <div className="tab-content">
                    <h3>두 번째 탭</h3>
                    <p>버튼을 클릭하여 탭을 전환할 수 있습니다.</p>
                  </div>
                  <div className="tab-content">
                    <h3>세 번째 탭</h3>
                    <p>v-model과 이벤트가 모두 정상 작동합니다.</p>
                  </div>
                </Tabs>
                <span className="example-label">v-model로 외부 제어</span>
              </div>
            </div>
          </section>
          {/* 스타일 변형 */}
          <section className="example-section">
            <h2>스타일 변형</h2>
            <div className="example-grid">
              <div className="example-item">
                <div className="variant-controls">
                  {Object.values(tabsVariant).map(variant => (
                    <button
                      key={variant}
                      className={`variant-button${currentVariant === variant ? ' active' : ''}`}
                      onClick={() => changeVariant(variant as TabsVariant)}
                      type="button"
                    >
                      {variant}
                    </button>
                  ))}
                </div>
                <Tabs
                  tabItems={variantTabItems}
                  variant={currentVariant}
                  activeTab={variantActiveTab}
                  onUpdateActiveTab={setVariantActiveTab}
                >
                  <div className="tab-content">
                    <h3>기본 스타일</h3>
                    <p>기본 탭 스타일입니다. 위쪽에 언더라인이 표시됩니다.</p>
                  </div>
                  <div className="tab-content">
                    <h3>언더라인 스타일</h3>
                    <p>깔끔한 언더라인 스타일입니다. 미니멀한 디자인을 제공합니다.</p>
                  </div>
                  <div className="tab-content">
                    <h3>필스 스타일</h3>
                    <p>둥근 모서리의 필스 스타일입니다. 모던한 느낌을 줍니다.</p>
                  </div>
                </Tabs>
                <span className="example-label">다양한 스타일 변형</span>
              </div>
            </div>
          </section>
          {/* 비활성화 탭 */}
          <section className="example-section">
            <h2>비활성화 탭</h2>
            <div className="example-grid">
              <div className="example-item">
                <div className="disabled-controls">
                  <p>비활성화 상태 토글:</p>
                  <div className="toggle-buttons">
                    {disabledTabs.map((disabled, index) => (
                      <button
                        key={index}
                        className={`toggle-button${disabled ? ' disabled' : ''}`}
                        onClick={() => toggleDisabled(index)}
                        type="button"
                      >
                        탭 {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
                <Tabs
                  tabItems={advancedTabItems}
                  activeTab={advancedActiveTab}
                  onUpdateActiveTab={setAdvancedActiveTab}
                  disabled={disabledTabs}
                >
                  <div className="tab-content">
                    <h3>개요</h3>
                    <p>전체적인 요약 정보를 제공합니다.</p>
                  </div>
                  <div className="tab-content">
                    <h3>상세정보</h3>
                    <p>자세한 정보와 데이터를 표시합니다.</p>
                  </div>
                  <div className="tab-content">
                    <h3>통계</h3>
                    <p>현재 비활성화된 탭입니다.</p>
                  </div>
                  <div className="tab-content">
                    <h3>설정</h3>
                    <p>시스템 설정을 관리합니다.</p>
                  </div>
                  <div className="tab-content">
                    <h3>로그</h3>
                    <p>시스템 로그를 확인합니다.</p>
                  </div>
                </Tabs>
                <span className="example-label">비활성화 탭 기능</span>
              </div>
            </div>
          </section>
          {/* 박스 스타일 */}
          <section className="example-section">
            <h2>박스 스타일</h2>
            <div className="example-grid">
              <div className="example-item">
                <Tabs tabItems={['정보', '설정', '도움말']} inBox>
                  <div className="tab-content none-border">
                    <h3>정보</h3>
                    <p>박스 스타일로 감싸진 탭 콘텐츠입니다.</p>
                    <ul>
                      <li>테두리가 있는 박스 형태</li>
                      <li>내부 패딩이 적용됨</li>
                      <li>깔끔한 구분선 제공</li>
                    </ul>
                  </div>
                  <div className="tab-content none-border">
                    <h3>설정</h3>
                    <p>설정 관련 내용을 박스 안에 표시합니다.</p>
                    <div className="setting-item">
                      <label>테마 설정:</label>
                      <select>
                        <option>라이트</option>
                        <option>다크</option>
                      </select>
                    </div>
                  </div>
                  <div className="tab-content none-border">
                    <h3>도움말</h3>
                    <p>사용법과 FAQ를 제공합니다.</p>
                    <div className="help-item">
                      <strong>Q: 탭을 어떻게 전환하나요?</strong>
                      <p>A: 탭을 클릭하거나 키보드 방향키를 사용하세요.</p>
                    </div>
                  </div>
                </Tabs>
                <span className="example-label">박스 스타일 (in-box)</span>
              </div>
            </div>
          </section>
          {/* 트랜지션 효과 */}
          <section className="example-section">
            <h2>트랜지션 효과</h2>
            <div className="example-grid">
              <div className="example-item">
                <div className="transition-controls">
                  <p>트랜지션 효과 선택:</p>
                  <div className="transition-buttons">
                    {Object.values(tabsTransition).map(transition => (
                      <button
                        key={transition}
                        className={`transition-button${currentTransition === transition ? ' active' : ''}`}
                        onClick={() => changeTransition(transition as TabsTransition)}
                        type="button"
                      >
                        {transition}
                      </button>
                    ))}
                  </div>
                </div>
                <Tabs
                  tabItems={transitionTabItems}
                  transition={currentTransition}
                  activeTab={transitionActiveTab}
                  onUpdateActiveTab={setTransitionActiveTab}
                  inBox
                >
                  <div className="tab-content none-border">
                    <h3>첫 번째 탭</h3>
                    <p>다양한 트랜지션 효과를 확인해보세요.</p>
                    <div className="transition-info">
                      <strong>현재 효과:</strong> {currentTransition}
                    </div>
                    <ul>
                      <li>
                        <strong>slide:</strong> 좌우 슬라이드 효과
                      </li>
                      <li>
                        <strong>fade:</strong> 페이드 인/아웃 효과
                      </li>
                      <li>
                        <strong>scale:</strong> 크기 변화 효과
                      </li>
                      <li>
                        <strong>flip:</strong> 3D 효과로 현대적인 느낌 (방향별 회전)
                      </li>
                      <li>
                        <strong>bounce:</strong> 바운스 애니메이션
                      </li>
                    </ul>
                  </div>
                  <div className="tab-content none-border">
                    <h3>두 번째 탭</h3>
                    <p>각 트랜지션은 고유한 애니메이션을 제공합니다.</p>
                    <div className="animation-demo">
                      <div className="demo-box">
                        <span>애니메이션 미리보기</span>
                      </div>
                    </div>
                  </div>
                  <div className="tab-content none-border">
                    <h3>세 번째 탭</h3>
                    <p>트랜지션 효과는 사용자 경험을 향상시킵니다.</p>
                    <div className="transition-tips">
                      <h4>사용 팁:</h4>
                      <ul>
                        <li>slide: 가장 자연스러운 전환</li>
                        <li>fade: 부드럽고 깔끔한 효과</li>
                        <li>scale: 시각적 임팩트가 큰 효과</li>
                        <li>flip: 3D 효과로 현대적인 느낌 (방향별 회전)</li>
                        <li>bounce: 재미있고 생동감 있는 효과</li>
                      </ul>
                    </div>
                  </div>
                </Tabs>
                <span className="example-label">다양한 트랜지션 효과</span>
              </div>
            </div>
          </section>
          {/* 접근성 정보 */}
          <section className="example-section">
            <h2>접근성</h2>
            <div className="accessibility-info">
              <h3>스크린 리더 지원</h3>
              <ul>
                <li>
                  <strong>role=&quot;tablist&quot;</strong>: 탭 목록 역할
                </li>
                <li>
                  <strong>role=&quot;tab&quot;</strong>: 개별 탭 역할
                </li>
                <li>
                  <strong>aria-selected</strong>: 선택된 탭 표시
                </li>
                <li>
                  <strong>aria-disabled</strong>: 비활성화된 탭 표시
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>
      {/* <FloatingBackButton /> */}
    </div>
  );
};

export default TabsExample;
