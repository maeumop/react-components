import React, { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './style.scss';
import type { ToastItem, ToastListProps, ToastPosition } from './types';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { toastPosition } from './const';

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

// position별 animation variants
const getTransitionVariants = (position: string) => {
  // layout 애니메이션을 위한 transition 설정
  const transition = {
    duration: 0.2,
    ease: 'easeInOut' as const,
  };

  if (position === toastPosition.top) {
    return {
      initial: { opacity: 0, y: '-50%' },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: '-50%' },
      transition,
    };
  } else if (position === toastPosition.bottom) {
    return {
      initial: { opacity: 0, y: '50%' },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: '50%' },
      transition,
    };
  } else if (position === toastPosition.topLeft || position === toastPosition.bottomLeft) {
    return {
      initial: { opacity: 0, x: '-50%' },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: '-50%' },
      transition,
    };
  } else if (position === toastPosition.topRight || position === toastPosition.bottomRight) {
    return {
      initial: { opacity: 0, x: '50%' },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: '50%' },
      transition,
    };
  }

  return {
    initial: { opacity: 0, y: '-50%' },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: '-50%' },
    transition,
  };
};

const ToastList: React.FC<ToastListProps> = ({ toasts, remove }) => {
  const grouped = useMemo(() => groupByPosition(toasts), [toasts]);

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
        const variants = getTransitionVariants(position);

        return (
          <div key={position} className={`toast-portal toast-${position}`}>
            <AnimatePresence mode="sync">
              {list.map(toast => (
                <motion.div
                  key={toast.id}
                  className={`toast toast-${toast.color}`}
                  initial={variants.initial}
                  animate={variants.animate}
                  exit={variants.exit}
                  transition={variants.transition}
                  layout
                >
                  {renderIcon(toast.color)}
                  <span className="toast-message">{toast.message}</span>
                  <CloseIcon
                    className="toast-close"
                    onClick={() => remove(toast.id)}
                    aria-label="닫기"
                    role="button"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        );
      })}
    </>
  );
};

export default ToastList;
