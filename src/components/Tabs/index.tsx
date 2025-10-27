import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
  const [direction, setDirection] = useState<'left' | 'right'>('left');

  // 외부 activeTab prop 변화 감지
  useEffect(() => {
    if (typeof activeTab === 'number' && activeTab !== active) {
      const dir = active < activeTab ? 'left' : 'right';
      setDirection(dir);
      setActive(activeTab);
    }
  }, [activeTab, active]);

  // 탭 클릭 핸들러
  const handleTabClick = useCallback(
    (index: number) => {
      if (disabled?.[index] || active === index) {
        return;
      }
      const dir = active < index ? 'left' : 'right';
      setDirection(dir);
      setActive(index);
      if (rest.onChangeTab) {
        rest.onChangeTab(index);
      }
      if (rest.onUpdateActiveTab) {
        rest.onUpdateActiveTab(index);
      }
    },
    [active, disabled, rest],
  );

  // 렌더링할 children 필터링 (null, undefined, boolean 등 제외)
  const validChildren = useMemo(() => {
    return React.Children.toArray(children).filter(child => React.isValidElement(child));
  }, [children]);

  // 현재 활성 탭 콘텐츠
  const activeContent = useMemo(() => {
    return validChildren[active];
  }, [active, validChildren]);

  // framer-motion variants 생성
  const variants = useMemo(() => {
    const slideDistance = 30;

    switch (transition) {
      case 'slide':
        return {
          initial: {
            opacity: 0,
            x: direction === 'left' ? slideDistance : -slideDistance,
          },
          animate: {
            opacity: 1,
            x: 0,
          },
          exit: {
            opacity: 0,
            x: direction === 'left' ? -slideDistance : slideDistance,
          },
        };

      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };

      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.1 },
        };

      case 'flip':
        return {
          initial: {
            opacity: 0,
            rotateY: direction === 'left' ? -90 : 90,
          },
          animate: {
            opacity: 1,
            rotateY: 0,
          },
          exit: {
            opacity: 0,
            rotateY: direction === 'left' ? 90 : -90,
          },
        };

      case 'bounce':
        return {
          initial: {
            opacity: 0,
            scale: 0.3,
            y: -50,
          },
          animate: {
            opacity: 1,
            scale: 1,
            y: 0,
          },
          exit: {
            opacity: 0,
            scale: 0.3,
            y: 50,
          },
        };

      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
    }
  }, [transition, direction]);

  // transition 설정 메모이제이션
  const transitionConfig = useMemo(() => {
    const duration = 0.3;

    switch (transition) {
      case 'slide':
      case 'scale':
        return { duration, ease: [0.4, 0, 0.2, 1] as const };
      case 'fade':
        return { duration, ease: 'easeInOut' as const };
      case 'flip':
        return { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const };
      case 'bounce':
        return { duration: 0.5, ease: [0.68, -0.55, 0.265, 1.55] as const };
      default:
        return { duration };
    }
  }, [transition]);

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
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`tab-content-${active}`}
              className="tab-panel"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants}
              transition={transitionConfig}
            >
              {activeContent}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

Tabs.displayName = 'Tabs';

export default React.memo(Tabs);
