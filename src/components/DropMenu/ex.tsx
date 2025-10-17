import FloatingBackButton from '@/views/FloatingBackButton/index';
import React, { useCallback, useState } from 'react';
import { dropMenuColor, dropMenuPosition, dropMenuTransition } from './const';
import './ex.scss';
import DropMenu from './index';
import type { DropMenuColor, DropMenuItem, DropMenuPosition, DropMenuTransition } from './types';
import {
  Person as AccountIcon,
  Settings as CogIcon,
  Logout as LogoutIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Star as StarIcon,
} from '@mui/icons-material';

// 예제 데이터
const menuItems: DropMenuItem[] = [
  {
    text: '프로필 보기',
    action: () => alert('프로필 보기 클릭'),
    icon: AccountIcon,
  },
  {
    text: '설정',
    action: () => alert('설정 클릭'),
    icon: CogIcon,
  },
  {
    text: '로그아웃',
    action: () => alert('로그아웃 클릭'),
    icon: LogoutIcon,
  },
];

const disabledMenuItems: DropMenuItem[] = [
  {
    text: '활성 메뉴',
    action: () => alert('활성 메뉴 클릭'),
    icon: CheckIcon,
  },
  {
    text: '비활성 메뉴',
    action: () => alert('이 메뉴는 비활성화되어 있습니다'),
    icon: CloseIcon,
    disabled: true,
  },
  {
    text: '다른 메뉴',
    action: () => alert('다른 메뉴 클릭'),
    icon: StarIcon,
  },
];

const DropMenuExample: React.FC = () => {
  // 상태 관리
  const [currentPosition, setCurrentPosition] = useState<DropMenuPosition>(dropMenuPosition.bottom);
  const [currentTransition, setCurrentTransition] = useState<DropMenuTransition>(
    dropMenuTransition.slide,
  );
  const [currentColor, setCurrentColor] = useState<DropMenuColor>(dropMenuColor.primary);

  // 이벤트 핸들러
  const handleOpen = useCallback(() => {
    console.log('드롭메뉴가 열렸습니다');
  }, []);
  const handleClose = useCallback(() => {
    console.log('드롭메뉴가 닫혔습니다');
  }, []);
  const handleItemClick = useCallback((item: DropMenuItem, index: number) => {
    console.log(`메뉴 아이템 클릭: ${item.text} (인덱스: ${index})`);
  }, []);

  // 위치/트랜지션/색상 변경
  const changePosition = (position: DropMenuPosition) => setCurrentPosition(position);
  const changeTransition = (transition: DropMenuTransition) => setCurrentTransition(transition);
  const changeColor = (color: DropMenuColor) => setCurrentColor(color);

  return (
    <div id="app">
      <header className="app-header">
        <div className="container">
          <h1>DropMenu Component Examples</h1>
          <p>React + TypeScript로 개발된 드롭다운 메뉴 컴포넌트</p>
        </div>
      </header>
      <main className="main-content">
        <div className="container">
          {/* 기본 사용법 */}
          <section className="example-section">
            <h2>기본 사용법</h2>
            <div className="example-grid">
              <div className="example-item">
                <DropMenu
                  items={menuItems}
                  onOpen={handleOpen}
                  onClose={handleClose}
                  onItemClick={handleItemClick}
                >
                  <button className="demo-button">기본 드롭메뉴</button>
                </DropMenu>
                <span className="example-label">기본 드롭메뉴</span>
              </div>
              <div className="example-item">
                <DropMenu items={menuItems} width={200}>
                  <button className="demo-button">고정 너비</button>
                </DropMenu>
                <span className="example-label">고정 너비 (200px)</span>
              </div>
            </div>
          </section>
          {/* 위치별 드롭메뉴 */}
          <section className="example-section">
            <h2>위치별 드롭메뉴</h2>
            <div className="position-controls">
              {Object.values(dropMenuPosition).map(position => (
                <button
                  key={position}
                  className={`control-button${currentPosition === position ? ' active' : ''}`}
                  onClick={() => changePosition(position)}
                  type="button"
                >
                  {position}
                </button>
              ))}
            </div>
            <div className="example-grid">
              <div className="example-item">
                <DropMenu
                  items={menuItems}
                  position={currentPosition}
                  transition={currentTransition}
                  color={currentColor}
                >
                  <button className="demo-button">{currentPosition} 위치</button>
                </DropMenu>
                <span className="example-label">{currentPosition} 위치</span>
              </div>
            </div>
          </section>
          {/* 트랜지션 효과 */}
          <section className="example-section">
            <h2>트랜지션 효과</h2>
            <div className="transition-description">
              <p>다양한 애니메이션 효과를 체험해보세요:</p>
              <ul>
                <li>
                  <strong>Slide</strong>: 부드러운 슬라이드 효과
                </li>
                <li>
                  <strong>Fade</strong>: 페이드 인/아웃 효과
                </li>
                <li>
                  <strong>Scale</strong>: 확대/축소 효과
                </li>
                <li>
                  <strong>Bounce</strong>: 탄성 있는 바운스 효과
                </li>
                <li>
                  <strong>Flip</strong>: 3D 플립 효과
                </li>
                <li>
                  <strong>Elastic</strong>: 고무줄 같은 탄성 효과
                </li>
                <li>
                  <strong>Swing</strong>: 회전하면서 나타나는 효과
                </li>
              </ul>
            </div>
            <div className="transition-controls">
              {Object.values(dropMenuTransition).map(transition => (
                <button
                  key={transition}
                  className={`control-button${currentTransition === transition ? ' active' : ''}`}
                  onClick={() => changeTransition(transition)}
                  type="button"
                >
                  {transition}
                </button>
              ))}
            </div>
            <div className="example-grid">
              <div className="example-item">
                <DropMenu items={menuItems} transition={currentTransition} position="bottom">
                  <button className="demo-button">{currentTransition} 효과</button>
                </DropMenu>
                <span className="example-label">{currentTransition} 효과</span>
              </div>
            </div>
          </section>
          {/* 색상 테마 */}
          <section className="example-section">
            <h2>색상 테마</h2>
            <div className="color-controls">
              {Object.values(dropMenuColor).map(color => (
                <button
                  key={color}
                  className={`control-button${currentColor === color ? ' active' : ''}`}
                  onClick={() => changeColor(color)}
                  type="button"
                >
                  {color}
                </button>
              ))}
            </div>
            <div className="example-grid">
              <div className="example-item">
                <DropMenu items={menuItems} color={currentColor} position="bottom">
                  <button className="demo-button">{currentColor} 테마</button>
                </DropMenu>
                <span className="example-label">{currentColor} 테마</span>
              </div>
            </div>
          </section>
          {/* 비활성화 메뉴 */}
          <section className="example-section">
            <h2>비활성화 메뉴</h2>
            <div className="example-grid">
              <div className="example-item">
                <DropMenu items={disabledMenuItems} position="bottom">
                  <button className="demo-button">비활성화 메뉴</button>
                </DropMenu>
                <span className="example-label">비활성화된 메뉴 아이템 포함</span>
              </div>
              <div className="example-item">
                <DropMenu items={menuItems} disabled position="bottom">
                  <button className="demo-button">전체 비활성화</button>
                </DropMenu>
                <span className="example-label">전체 드롭메뉴 비활성화</span>
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
                  <strong>Enter/Space</strong>: 드롭메뉴 토글
                </li>
                <li>
                  <strong>Arrow Down/Up</strong>: 메뉴 아이템 간 이동
                </li>
                <li>
                  <strong>Escape</strong>: 드롭메뉴 닫기
                </li>
              </ul>
            </div>
            <div className="example-grid">
              <div className="example-item">
                <DropMenu items={menuItems} position="bottom">
                  <button className="demo-button">키보드로 테스트</button>
                </DropMenu>
                <span className="example-label">키보드로 네비게이션 테스트</span>
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

export default DropMenuExample;
