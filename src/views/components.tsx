import { Icon } from '@iconify/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './components.module.scss';
// import StyledButton from '../components/StyledButton'; // 추후 React 변환 시 사용

const components = [
  {
    name: 'Badge',
    path: '/components/badge',
    description: '알림, 상태, 카운터를 표시하는 뱃지 컴포넌트',
    color: 'primary',
    icon: 'mdi:badge-account',
  },
  {
    name: 'DropMenu',
    path: '/components/dropmenu',
    description: '드롭다운 메뉴 컴포넌트',
    color: 'secondary',
    icon: 'mdi:menu-down',
  },
  {
    name: 'ListTable',
    path: '/components/listtable',
    description: '리스트 테이블 컴포넌트',
    color: 'warning',
    icon: 'mdi:table',
  },
  {
    name: 'MessageBox',
    path: '/components/messagebox',
    description: '메시지 박스 컴포넌트',
    color: 'danger',
    icon: 'mdi:message-text',
  },
  {
    name: 'Modal',
    path: '/components/modal',
    description: '모달 다이얼로그 컴포넌트',
    color: 'primary',
    icon: 'mdi:window-maximize',
  },
  {
    name: 'Pagination',
    path: '/components/pagination',
    description: '페이지네이션 컴포넌트',
    color: 'secondary',
    icon: 'mdi:page-layout-body',
  },
  {
    name: 'Spinner',
    path: '/components/spinner',
    description: '로딩 스피너 컴포넌트',
    color: 'info',
    icon: 'svg-spinners:ring-resize',
  },
  {
    name: 'StatusSelector',
    path: '/components/statusselector',
    description: '상태 선택 컴포넌트',
    color: 'success',
    icon: 'mdi:checkbox-multiple-marked',
  },
  {
    name: 'StyledButton',
    path: '/components/buttons',
    description: '스타일된 버튼 컴포넌트',
    color: 'warning',
    icon: 'mdi:button-cursor',
  },
  {
    name: 'Tabs',
    path: '/components/tabs',
    description: '탭 컴포넌트',
    color: 'danger',
    icon: 'mdi:tab',
  },
  {
    name: 'Toast',
    path: '/components/toast',
    description: '토스트 알림 컴포넌트',
    color: 'primary',
    icon: 'mdi:message',
  },
  {
    name: 'Tooltip',
    path: '/components/tooltip',
    description: '툴팁 컴포넌트',
    color: 'secondary',
    icon: 'mdi:tooltip-text',
  },
];

const formComponents = [
  {
    name: 'CheckButton',
    path: '/components/checkbutton',
    description: '체크 버튼 컴포넌트',
    color: 'info',
    icon: 'mdi:checkbox-marked',
  },
  {
    name: 'DatePicker',
    path: '/components/datepicker',
    description: '날짜 선택 컴포넌트',
    color: 'success',
    icon: 'mdi:calendar',
  },
  {
    name: 'NumberFormat',
    path: '/components/numberformat',
    description: '숫자 포맷 컴포넌트',
    color: 'warning',
    icon: 'mdi:format-list-numbered',
  },
  {
    name: 'SelectBox',
    path: '/components/selectbox',
    description: '선택 박스 컴포넌트',
    color: 'danger',
    icon: 'mdi:format-list-bulleted',
  },
  {
    name: 'SwitchButton',
    path: '/components/switchbutton',
    description: '스위치 버튼 컴포넌트',
    color: 'primary',
    icon: 'mdi:toggle-switch',
  },
  {
    name: 'TextField',
    path: '/components/textfield',
    description: '텍스트 필드 컴포넌트',
    color: 'secondary',
    icon: 'mdi:text-box',
  },
  {
    name: 'ValidateForm',
    path: '/components/validateform',
    description: '폼 검증 컴포넌트',
    color: 'info',
    icon: 'mdi:shield-check',
  },
  {
    name: 'ValidateWrap',
    path: '/components/validatewrap',
    description: '검증 래퍼 컴포넌트',
    color: 'success',
    icon: 'mdi:shield-check-outline',
  },
];

const ComponentsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles['components-page']}>
      <header className={styles['page-header']}>
        <div className={styles['container']}>
          <h1>React Components Library</h1>
          <p>사용 가능한 모든 컴포넌트들을 확인하고 테스트해보세요</p>
        </div>
      </header>
      <main className={styles['page-content']}>
        <div className={styles['container']}>
          {/* 기본 컴포넌트 섹션 */}
          <section className={styles['components-section']}>
            <h2>기본 컴포넌트</h2>
            <div className={styles['components-grid']}>
              {components.map(component => (
                <div
                  key={component.name}
                  className={styles['component-card']}
                  onClick={() => navigate(component.path)}
                >
                  <div className={styles['component-icon']}>
                    <Icon icon={component.icon} width={32} height={32} />
                  </div>
                  <div className={styles['component-info']}>
                    <h3>{component.name}</h3>
                    <p>{component.description}</p>
                  </div>
                  {/* <StyledButton color={component.color} href={component.path} small outline className={styles['navigate-btn']}>보기</StyledButton> */}
                </div>
              ))}
            </div>
          </section>

          {/* 폼 컴포넌트 섹션 */}
          <section className={styles['components-section']}>
            <h2>폼 컴포넌트</h2>
            <div className={styles['components-grid']}>
              {formComponents.map(component => (
                <div
                  key={component.name}
                  className={styles['component-card']}
                  onClick={() => navigate(component.path)}
                >
                  <div className={styles['component-icon']}>
                    <Icon icon={component.icon} width={32} height={32} />
                  </div>
                  <div className={styles['component-info']}>
                    <h3>{component.name}</h3>
                    <p>{component.description}</p>
                  </div>
                  {/* <StyledButton color={component.color} href={component.path} small outline className={styles['navigate-btn']}>보기</StyledButton> */}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ComponentsPage;
