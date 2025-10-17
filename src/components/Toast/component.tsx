import React, { createRef, useMemo, useRef, type RefObject } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './style.scss';
import type { ToastItem, ToastListProps, ToastPosition } from './types';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

// position별로 그룹핑하는 함수
function groupByPosition(toasts: ToastItem[]) {
  const positions: Record<ToastPosition, ToastItem[]> = {
    top: [],
    bottom: [],
    'top-right': [],
    'top-left': [],
    'bottom-right': [],
    'bottom-left': [],
  };
  toasts.forEach(toast => {
    positions[toast.position]?.push(toast);
  });
  return positions;
}

const getTransitionClass = (position: string) => {
  if (position === 'top') return 'toast-fade-top';
  if (position === 'bottom') return 'toast-fade-bottom';
  if (position === 'top-left' || position === 'bottom-left') return 'toast-fade-left';
  if (position === 'top-right' || position === 'bottom-right') return 'toast-fade-right';
  return 'toast-fade-top';
};

const ToastList: React.FC<ToastListProps> = ({ toasts, remove }) => {
  const grouped = useMemo(() => groupByPosition(toasts), [toasts]);
  // id별 ref를 저장하는 객체
  const nodeRefs = useRef<{ [key: string]: RefObject<HTMLDivElement> }>({});

  // 아이콘 렌더링 함수
  const renderIcon = (color: string) => {
    switch (color) {
      case 'success':
        return <CheckCircleIcon className="toast-icon" />;
      case 'error':
        return <ErrorIcon className="toast-icon" />;
      case 'warning':
        return <WarningIcon className="toast-icon" />;
      case 'info':
        return <InfoIcon className="toast-icon" />;
      default:
        return <CheckCircleIcon className="toast-icon" />;
    }
  };

  return (
    <>
      {Object.entries(grouped).map(([position, list]) => {
        return (
          <div key={position} className={`toast-portal toast-${position}`}>
            <TransitionGroup component={null}>
              {list.map(toast => {
                // id별로 ref를 한 번만 생성
                if (!nodeRefs.current[toast.id]) {
                  nodeRefs.current[toast.id] =
                    createRef<HTMLDivElement>() as RefObject<HTMLDivElement>;
                }
                const nodeRef = nodeRefs.current[toast.id]!;

                return (
                  <CSSTransition
                    key={toast.id}
                    appear
                    timeout={300}
                    classNames={getTransitionClass(position)}
                    nodeRef={nodeRef}
                  >
                    <div className={`toast toast-${toast.color}`} ref={nodeRef}>
                      {renderIcon(toast.color)}
                      <span className="toast-message">{toast.message}</span>
                      <CloseIcon
                        className="toast-close"
                        onClick={() => remove(toast.id)}
                        aria-label="닫기"
                        role="button"
                      />
                    </div>
                  </CSSTransition>
                );
              })}
            </TransitionGroup>
          </div>
        );
      })}
    </>
  );
};

export default ToastList;
