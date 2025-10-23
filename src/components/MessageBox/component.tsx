'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { MessageBoxOptions } from './types';
import { CircularProgress as LoadingIcon } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useComponentHelper } from '../helper';
import { transitionType } from '../const';
import './style.scss';

/**
 * MessageBox 컴포넌트
 */
const MessageBox: React.FC<MessageBoxOptions & { onClose: () => void }> = props => {
  const {
    type = 'alert',
    message,
    title,
    width = '320px',
    btnOkayText = '확인',
    btnCancelText = '취소',
    okay,
    cancel,
    asyncOkay,
    escCancel = true,
    enterOkay = true,
    noScrollStyleClass = 'hide-scroll',
    transition = transitionType.scale,
    onClose,
  } = props;

  const [isShow, setIsShow] = useState(true);
  const [boxShow, setBoxShow] = useState(false);
  const [spinnerShow, setSpinnerShow] = useState(false);
  const msgBoxBgNodeRef = useRef<HTMLDivElement>(null);
  const msgBoxNodeRef = useRef<HTMLDivElement>(null);
  const dialogId = useRef(`messagebox-${Date.now()}`);
  const titleId = `${dialogId.current}-title`;
  const contentId = `${dialogId.current}-content`;

  // 스크롤바 너비 계산
  const getScrollbarWidth = useCallback((): number => {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);
    const inner = document.createElement('div');
    outer.appendChild(inner);
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode?.removeChild(outer);

    return scrollbarWidth;
  }, []);

  // 스크롤바 공간 설정
  const setScrollbarSpace = useCallback(() => {
    const scrollbarWidth = getScrollbarWidth();

    if (scrollbarWidth > 0) {
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    }
  }, [getScrollbarWidth]);

  // 스크롤바 공간 제거
  const removeScrollbarSpace = useCallback(() => {
    document.documentElement.style.removeProperty('--scrollbar-width');
  }, []);

  // 스크롤바 제거
  const disableScroll = useCallback(() => {
    if (noScrollStyleClass) {
      setScrollbarSpace();
      document.body.classList.add(noScrollStyleClass);
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `var(--scrollbar-width, 0px)`;
    }
  }, [noScrollStyleClass, setScrollbarSpace]);

  // 스크롤바 복원
  const enableScroll = useCallback(() => {
    if (noScrollStyleClass) {
      document.body.classList.remove(noScrollStyleClass);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      removeScrollbarSpace();
    }
  }, [noScrollStyleClass, removeScrollbarSpace]);

  // 확인 클릭
  const clickOkay = useCallback(() => {
    if (spinnerShow) {
      return;
    }

    if (okay instanceof Function) {
      okay();
    }

    setBoxShow(() => false);
  }, [spinnerShow, okay]);

  // 비동기 확인 클릭
  const asyncClickOkay = useCallback(async () => {
    if (spinnerShow) {
      return;
    }

    setSpinnerShow(true);

    try {
      if (asyncOkay instanceof Function) {
        await asyncOkay();
      }
    } catch (error) {
      console.error('MessageBox asyncOkay error:', error);
    } finally {
      setBoxShow(() => false);
    }
  }, [spinnerShow, asyncOkay]);

  // 취소 클릭
  const clickCancel = useCallback(() => {
    if (!spinnerShow) {
      if (typeof cancel === 'function') {
        cancel();
      }

      setBoxShow(() => false);
    }
  }, [spinnerShow, cancel]);

  // 키보드 이벤트
  const keyupEvent = useCallback(
    (evt: KeyboardEvent) => {
      if (evt.key === 'Enter' && enterOkay) {
        if (typeof asyncOkay === 'function') {
          asyncClickOkay();
        } else {
          clickOkay();
        }
      }

      if (evt.key === 'Escape' && escCancel) {
        clickCancel();
      }
    },
    [enterOkay, escCancel, asyncOkay, clickOkay, asyncClickOkay, clickCancel],
  );

  // 트랜지션 종료 후
  const handleExited = useCallback(() => {
    console.log('handleExited');
    setIsShow(() => false);
    enableScroll();
    document.removeEventListener('keyup', keyupEvent);

    if (typeof onClose === 'function') {
      onClose();
    }
  }, [enableScroll, keyupEvent, onClose]);

  const onButtonClick = useCallback(() => {
    if (typeof asyncOkay === 'function') {
      asyncClickOkay();
    } else {
      clickOkay();
    }
  }, [asyncOkay, clickOkay, asyncClickOkay]);

  // 트랜지션 variant 계산
  const helper = useComponentHelper();
  const variants = helper.getTransitionVariant(transition);

  // 마운트 시 이벤트 등록
  useEffect(() => {
    disableScroll();
    document.addEventListener('keyup', keyupEvent);

    if (msgBoxBgNodeRef.current) {
      msgBoxBgNodeRef.current.focus();
    }

    return () => {
      enableScroll();
      document.removeEventListener('keyup', keyupEvent);
    };
  }, []);

  useEffect(() => {
    setBoxShow(true);
  }, [isShow]);

  return createPortal(
    <>
      {isShow && (
        <div ref={msgBoxBgNodeRef} className="msg-box-bg" tabIndex={0}>
          <AnimatePresence onExitComplete={handleExited}>
            {boxShow && (
              <motion.div
                className="msg-box"
                style={{ width }}
                id={dialogId.current}
                ref={msgBoxNodeRef}
                initial={variants.initial}
                animate={variants.animate}
                exit={variants.exit}
                transition={variants.transition}
              >
                {title && (
                  <h5 className="title" id={titleId}>
                    {title}
                  </h5>
                )}
                <div
                  className="contents"
                  id={contentId}
                  dangerouslySetInnerHTML={{ __html: message }}
                />
                <div className="actions">
                  <button
                    type="button"
                    className="okay-button"
                    onClick={onButtonClick}
                    disabled={spinnerShow}
                  >
                    {spinnerShow ? <LoadingIcon size={18} className="loading" /> : btnOkayText}
                  </button>
                  {type === 'confirm' && (
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={clickCancel}
                      disabled={spinnerShow}
                    >
                      {btnCancelText}
                    </button>
                  )}
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

MessageBox.displayName = 'MessageBox';
export default React.memo(MessageBox);
