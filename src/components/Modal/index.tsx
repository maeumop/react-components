import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import { modalTransition } from './const';
import './style.scss';
import type { ModalProps } from './types';

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
  const boxRef = useRef<HTMLDivElement>(null);

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

  // 트랜지션 이름
  const transitionName = modalTransition[position] || 'modal-scale';

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

  // 포탈 렌더링
  return createPortal(
    <CSSTransition
      appear
      in={open}
      timeout={200}
      classNames="modal-fade"
      unmountOnExit
      nodeRef={modalRef}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={`modal-bg${fullscreen ? ' fullscreen-bg' : ''}`}
      >
        <CSSTransition
          appear
          in={open}
          timeout={200}
          classNames={transitionName}
          unmountOnExit
          nodeRef={boxRef}
        >
          <div
            ref={boxRef}
            className={`modal-box ${position}${fullscreen ? ' fullscreen' : ''}${screenCover ? ' screen-cover' : ''}`}
            style={boxStyle}
          >
            <div className="modal-header">
              <div className="title-text" id={title ? 'modal-title' : undefined}>
                <span className="text">{title}</span>
              </div>
              {!hideClose && (
                <Icon
                  className="close"
                  aria-label="모달 닫기"
                  onClick={handleClose}
                  icon="mdi:close"
                />
              )}
            </div>
            <div className="modal-body" id={body ? 'modal-body' : undefined}>
              {body}
              {children}
            </div>
            {action && <div className="modal-action">{action(handleClose)}</div>}
          </div>
        </CSSTransition>
      </div>
    </CSSTransition>,
    document.body,
  );
};

export default React.memo(Modal);
