import { Icon } from '@iconify/react';
import type { CSSProperties, ReactNode } from 'react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { tooltipColor, tooltipPosition } from './const';
import './style.scss';
import type { TooltipPosition, TooltipProps } from './types';

// TooltipProps는 types.ts로 분리(이미 정의됨)

const Tooltip: React.FC<
  TooltipProps & {
    children: ReactNode;
    content?: (props: { close: () => void }) => ReactNode;
  }
> = ({
  message,
  title,
  position = tooltipPosition.bottom,
  hovering = true,
  btnClose = false,
  block = false,
  color = tooltipColor.default,
  dark = false,
  width = 140,
  padding,
  children,
  content,
}) => {
  const [isShow, setIsShow] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<TooltipPosition>(position);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // 스타일 계산
  const bindingStyle = useMemo<CSSProperties>(
    () => ({
      width: width ? `${width}px` : undefined,
      padding,
    }),
    [width, padding],
  );

  // 툴팁 위치 계산
  const calculatePosition = useCallback(() => {
    const tooltip = tooltipRef.current;
    const container = containerRef.current;
    if (!tooltip || !container) return;

    // 툴팁이 아직 렌더링 중이면 재시도
    if (tooltip.offsetWidth === 0 || tooltip.offsetHeight === 0) {
      setTimeout(calculatePosition, 10);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const gap = 8;
    let left = '',
      top = '',
      right = '',
      bottom = '';

    switch (position) {
      case tooltipPosition.right:
        left = `${containerRect.width + gap}px`;
        top = `${(containerRect.height - tooltip.offsetHeight) / 2}px`;
        break;
      case tooltipPosition.left:
        right = `${containerRect.width + gap}px`;
        top = `${(containerRect.height - tooltip.offsetHeight) / 2}px`;
        break;
      case tooltipPosition.top:
        left = `${(containerRect.width - tooltip.offsetWidth) / 2}px`;
        bottom = `${containerRect.height + gap}px`;
        break;
      default: // bottom
        left = `${(containerRect.width - tooltip.offsetWidth) / 2}px`;
        top = `${containerRect.height + gap}px`;
        break;
    }
    tooltip.style.left = left;
    tooltip.style.top = top;
    tooltip.style.right = right;
    tooltip.style.bottom = bottom;
  }, [position]);

  // 툴팁 표시/숨김
  const showTooltip = useCallback(() => {
    setIsShow(true);
    setTimeout(calculatePosition, 0);
  }, [calculatePosition]);
  const hideTooltip = useCallback(() => setIsShow(false), []);

  // 마우스 이벤트
  const onMouseEnter = useCallback(() => {
    if (hovering) showTooltip();
  }, [hovering, showTooltip]);
  const onMouseLeave = useCallback(() => {
    if (hovering) hideTooltip();
  }, [hovering, hideTooltip]);
  const onClick = useCallback(() => {
    if (!hovering) {
      setIsShow(prev => !prev);
      setTimeout(calculatePosition, 0);
    }
  }, [hovering, calculatePosition]);

  // 외부 클릭 감지
  useEffect(() => {
    if (!isShow || hovering) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        hideTooltip();
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isShow, hovering, hideTooltip]);

  // 리사이즈 감지
  useEffect(() => {
    if (!isShow) return;
    const handleResize = () => setTimeout(calculatePosition, 0);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isShow, calculatePosition]);

  // position, hovering prop 변경 감지
  useEffect(() => setCurrentPosition(position), [position]);
  useEffect(() => setIsShow(false), [hovering]);

  // 클래스 계산
  const tooltipClass = useMemo(
    () =>
      ['tooltip-layer', currentPosition, `tooltip-color-${color}`, dark ? 'dark' : ''].join(' '),
    [currentPosition, color, dark],
  );

  // 닫기 함수
  const close = useCallback(() => hideTooltip(), [hideTooltip]);

  return (
    <div
      ref={containerRef}
      className={`tooltip-container${block ? ' block' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {children}
      <CSSTransition
        in={isShow}
        timeout={200}
        classNames="tooltip-fade"
        unmountOnExit
        nodeRef={tooltipRef}
        onEnter={calculatePosition}
        onEntered={calculatePosition}
      >
        <div
          ref={tooltipRef}
          style={bindingStyle}
          className={tooltipClass}
          role="tooltip"
          aria-label={Array.isArray(message) ? message.join(', ') : message}
        >
          {content ? (
            content({ close })
          ) : Array.isArray(message) ? (
            <>
              {(title || btnClose) && (
                <div className="title">
                  {title && <h5>{title}</h5>}
                  {btnClose && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        hideTooltip();
                      }}
                      className="close-btn"
                      type="button"
                      aria-label="툴팁 닫기"
                    >
                      <Icon icon="mdi:window-close" className="close" width={14} height={14} />
                    </button>
                  )}
                </div>
              )}
              <ul className="message-list">
                {message.map((msg, idx) => (
                  <li key={`tooltip-message-${idx}`}>{msg}</li>
                ))}
              </ul>
            </>
          ) : (
            <div className="single-message">{message}</div>
          )}
        </div>
      </CSSTransition>
    </div>
  );
};

export default React.memo(Tooltip);
