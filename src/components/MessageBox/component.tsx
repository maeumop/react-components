import { Icon } from '@iconify/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import { messageBoxTransition } from './const';
import './style.scss';
import type { MessageBoxOptions } from './types';

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
    transition = messageBoxTransition.scale,
    onClose,
  } = props;

  const [isShow, setIsShow] = useState(true);
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
    [enterOkay, escCancel, asyncOkay],
  );

  // 이벤트 주입
  const setEvents = useCallback(() => {
    disableScroll();
    document.addEventListener('keyup', keyupEvent);

    if (msgBoxBgNodeRef.current) {
      msgBoxBgNodeRef.current.focus();
    }
  }, [disableScroll, keyupEvent]);

  // 닫기
  const hide = useCallback(() => {
    setIsShow(false);
  }, []);

  // 트랜지션 종료 후
  const handleExited = useCallback(() => {
    enableScroll();
    document.removeEventListener('keyup', keyupEvent);

    if (typeof onClose === 'function') {
      onClose();
    }
  }, [enableScroll, keyupEvent, onClose]);

  const handleEntered = useCallback(() => {
    if (msgBoxNodeRef.current) {
      msgBoxNodeRef.current.focus();
    }
  }, []);

  // 확인 클릭
  const clickOkay = useCallback(() => {
    if (spinnerShow) {
      return;
    }

    if (okay instanceof Function) {
      okay();
    }

    hide();
  }, [spinnerShow, okay, hide]);

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
      hide();
    }
  }, [spinnerShow, asyncOkay, hide]);

  // 취소 클릭
  const clickCancel = useCallback(() => {
    if (!spinnerShow) {
      if (typeof cancel === 'function') {
        cancel();
      }

      hide();
    }
  }, [spinnerShow, cancel, hide]);

  const onButtonClick = useCallback(() => {
    if (typeof asyncOkay === 'function') {
      asyncClickOkay();
    } else {
      clickOkay();
    }
  }, [asyncOkay, clickOkay, asyncClickOkay]);

  // 마운트 시 이벤트 등록
  useEffect(() => {
    setEvents();

    return () => {
      enableScroll();
      document.removeEventListener('keyup', keyupEvent);
    };
  }, [setEvents, enableScroll, keyupEvent]);

  return createPortal(
    <CSSTransition
      appear
      in={isShow}
      timeout={200}
      classNames="msg-box-fade"
      onExited={handleExited}
      onEntered={handleEntered}
      nodeRef={msgBoxBgNodeRef}
    >
      <div
        ref={msgBoxBgNodeRef}
        className="msg-box-bg"
        tabIndex={0}
        role="dialog"
        aria-labelledby={titleId}
        aria-describedby={contentId}
        aria-modal="true"
      >
        <CSSTransition
          appear
          in={isShow}
          timeout={200}
          classNames={transition}
          nodeRef={msgBoxNodeRef}
        >
          <div className="msg-box" style={{ width }} id={dialogId.current} ref={msgBoxNodeRef}>
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
                className="btn-okay"
                onClick={onButtonClick}
                disabled={spinnerShow}
              >
                {spinnerShow ? (
                  <Icon icon="svg-spinners:ring-resize" className="loading" />
                ) : (
                  btnOkayText
                )}
              </button>
              {type === 'confirm' && (
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={clickCancel}
                  disabled={spinnerShow}
                >
                  {btnCancelText}
                </button>
              )}
            </div>
          </div>
        </CSSTransition>
      </div>
    </CSSTransition>,
    document.body,
  );
};

export default MessageBox;
