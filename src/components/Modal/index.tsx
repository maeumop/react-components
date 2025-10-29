import React, { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { modalPosition } from './const';
import type { ModalProps, ModalPosition } from './types';
import { Close as CloseIcon } from '@mui/icons-material';
import './style.scss';

// position별 animation variants
const getModalVariants = (position: ModalPosition) => {
  const transition = {
    duration: 0.2,
    ease: [0.4, 0, 0.2, 1] as const,
  };

  switch (position) {
    case modalPosition.popup:
      return {
        initial: { opacity: 0, scale: 0.95, y: -10 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: -10 },
        transition,
      };
    case modalPosition.right:
      return {
        initial: { opacity: 0, x: '100%', scale: 0.98 },
        animate: { opacity: 1, x: 0, scale: 1 },
        exit: { opacity: 0, x: '100%', scale: 0.98 },
        transition,
      };
    case modalPosition.left:
      return {
        initial: { opacity: 0, x: '-100%', scale: 0.98 },
        animate: { opacity: 1, x: 0, scale: 1 },
        exit: { opacity: 0, x: '-100%', scale: 0.98 },
        transition,
      };
    case modalPosition.bottom:
      return {
        initial: { opacity: 0, y: '100%', scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: '100%', scale: 0.98 },
        transition,
      };
    default:
      return {
        initial: { opacity: 0, scale: 0.95, y: -10 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: -10 },
        transition,
      };
  }
};

const Modal = ({
  open,
  onClose,
  title,
  position = 'popup',
  width = '320px',
  fullscreen = false,
  escClose = false,
  hideClose = false,
  screenCover = false,
  children,
  body,
  action,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // ESC 키 닫기
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && escClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, escClose, onClose]);

  // body 스크롤 막기
  useEffect(() => {
    if (open) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [open]);

  // 포커스
  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.focus();
    }
  }, [open]);

  // 스타일
  const boxStyle: React.CSSProperties = fullscreen
    ? { width: '100vw', maxWidth: '100vw', height: '100vh', maxHeight: '100vh' }
    : position === 'right' || position === 'left'
      ? { width, maxWidth: width, height: '100vh', maxHeight: '100vh' }
      : { width, maxWidth: width };

  // 모달 닫기
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // animation variants
  const variants = getModalVariants(position);

  // 포탈 렌더링
  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          ref={modalRef}
          tabIndex={-1}
          className={`modal-bg${fullscreen ? ' fullscreen-bg' : ''}`}
        >
          <motion.div
            className={`modal-box ${position}${fullscreen ? ' fullscreen' : ''}${screenCover ? ' screen-cover' : ''}`}
            style={boxStyle}
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={variants.transition}
          >
            <div className="modal-header">
              <div className="title-text" id={title ? 'modal-title' : undefined}>
                <span className="text">{title}</span>
              </div>
              {!hideClose && (
                <CloseIcon className="close" aria-label="모달 닫기" onClick={handleClose} />
              )}
            </div>
            <div className="modal-body" id={body ? 'modal-body' : undefined}>
              {body}
              {children}
            </div>
            {action && <div className="modal-action">{action(handleClose)}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default React.memo(Modal);
