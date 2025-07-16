import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import './style.scss';
import type { SpinnerColor } from './types';

interface SpinnerProps {
  show: boolean;
  message?: string;
  color?: SpinnerColor;
  onExited?: () => void;
}

export const Spinner: React.FC<SpinnerProps> = ({ show, message, color = 'default', onExited }) => {
  const overlayNodeRef = useRef<HTMLDivElement>(null);
  const boxNodeRef = useRef<HTMLDivElement>(null);

  return createPortal(
    <CSSTransition
      in={show}
      timeout={200}
      classNames="spinner-fade"
      unmountOnExit
      onExited={onExited}
      appear
      nodeRef={overlayNodeRef}
    >
      <div ref={overlayNodeRef} className="spinner-overlay">
        <CSSTransition
          in={show}
          timeout={200}
          classNames="spinner-scale"
          appear
          nodeRef={boxNodeRef}
        >
          <div className={`spinner-container ${color}`} ref={boxNodeRef}>
            <span className="spinner-icon" />
            <p className="spinner-text">{message || 'Loading...'}</p>
          </div>
        </CSSTransition>
      </div>
    </CSSTransition>,
    document.body,
  );
};
