import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import './style.scss';
import type { TabsProps } from './types';

// Tabs 컴포넌트
const Tabs = ({
  tabItems,
  activeTab = 0,
  disabled = [],
  variant = 'default',
  transition = 'slide',
  children,
  ...rest
}: TabsProps) => {
  // 내부 상태 관리
  const [active, setActive] = useState<number>(activeTab);
  const [currentTransition, setCurrentTransition] = useState<string>('tab-slide-left');
  const transitionWrapperRef = useRef<HTMLDivElement>(null);

  // 외부 activeTab prop 변화 감지
  useEffect(() => {
    if (typeof activeTab === 'number' && activeTab !== active) {
      const direction = active < activeTab ? 'left' : 'right';
      setCurrentTransition(getTransitionName(direction));
      setActive(activeTab);
    }
  }, [activeTab]);

  // 트랜지션 이름 결정 함수
  const getTransitionName = useCallback(
    (direction: 'left' | 'right'): string => {
      if (transition === 'slide') {
        return direction === 'left' ? 'tab-slide-left' : 'tab-slide-right';
      }

      if (transition === 'flip') {
        return direction === 'left' ? 'tab-flip-left' : 'tab-flip-right';
      }

      return `tab-${transition}`;
    },
    [transition],
  );

  // 탭 클릭 핸들러
  const handleTabClick = useCallback(
    (index: number) => {
      if (disabled?.[index] || active === index) {
        return;
      }
      const direction = active < index ? 'left' : 'right';
      setCurrentTransition(getTransitionName(direction));
      setActive(index);
      if (rest.onChangeTab) {
        rest.onChangeTab(index);
      }
      if (rest.onUpdateActiveTab) {
        rest.onUpdateActiveTab(index);
      }
    },
    [active, disabled, getTransitionName, rest],
  );

  // 렌더링할 children 필터링 (null, undefined, boolean 등 제외)
  const validChildren = useMemo(() => {
    return React.Children.toArray(children).filter(child => React.isValidElement(child));
  }, [children]);

  // 현재 활성 탭 콘텐츠
  const activeContent = useMemo(() => {
    return validChildren[active];
  }, [active, validChildren]);

  return (
    <div className="tabs" data-variant={variant}>
      <div className="tab-item-wrap">
        <ul className="tab-items" role="tablist">
          {tabItems.map((item, index) => (
            <li
              key={`tabs-${index}`}
              className={[
                index === active ? 'active' : '',
                disabled && disabled[index] ? 'disabled' : '',
                variant,
              ].join(' ')}
              role="tab"
              aria-selected={index === active}
              aria-disabled={disabled && disabled[index] ? 'true' : 'false'}
              tabIndex={disabled && disabled[index] ? -1 : 0}
              onClick={() => handleTabClick(index)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="tab-contents">
        <div className="transition-wrapper">
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={`tab-content-${active}`}
              classNames={currentTransition}
              timeout={300}
              nodeRef={transitionWrapperRef}
            >
              <div ref={transitionWrapperRef} className="tab-panel">
                {activeContent}
              </div>
            </CSSTransition>
          </SwitchTransition>
        </div>
      </div>
    </div>
  );
};

Tabs.displayName = 'Tabs';

export default React.memo(Tabs);
