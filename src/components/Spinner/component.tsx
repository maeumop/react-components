import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { SpinnerProps } from './types';
import { AnimatePresence, motion } from 'framer-motion';
import { useComponentHelper } from '../helper';
import { transitionType } from '../const';
import './style.scss';

export const Spinner = ({ show, hide, message, color = 'default', onExited }: SpinnerProps) => {
  const [isShow, setIsShow] = useState(false);

  const overlayNodeRef = useRef<HTMLDivElement>(null);
  const boxNodeRef = useRef<HTMLDivElement>(null);
  const helper = useComponentHelper();
  const variants = helper.getTransitionVariant(transitionType.scale);

  const onExitComplete = useCallback(() => {
    onExited?.();
  }, [onExited]);

  useEffect(() => {
    setIsShow(() => true);
  }, [show]);

  useEffect(() => {
    setIsShow(() => !hide);
  }, [hide]);

  return createPortal(
    <>
      {show && (
        <div ref={overlayNodeRef} className="spinner-overlay">
          <AnimatePresence onExitComplete={onExitComplete}>
            {isShow && (
              <motion.div
                initial={variants.initial}
                animate={variants.animate}
                exit={variants.exit}
                transition={variants.transition}
              >
                <div className={`spinner-container ${color}`} ref={boxNodeRef}>
                  <span className="spinner-icon" />
                  <p className="spinner-text">{message || 'Loading...'}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>,
    document.body,
  );
};
