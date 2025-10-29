import type { CSSProperties } from 'react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { tooltipColor, tooltipPosition } from './const';
import './style.scss';
import type { TooltipPosition, TooltipProps } from './types';
import { Close as CloseIcon } from '@mui/icons-material';

// Animation variants (기존 CSS transition과 동일한 효과)
const tooltipVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: {
    duration: 0.1,
    ease: 'easeIn' as const,
  },
};

const Tooltip = ({
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
}: React.PropsWithChildren<TooltipProps>) => {
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

  const hideTooltip = useCallback(() => setIsShow(false), [setIsShow]);

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

  // 툴팁 표시 시 위치 계산 (onEnter, onEntered 대체)
  useEffect(() => {
    if (isShow) {
      calculatePosition();
    }
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

  const onClickClose = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      hideTooltip();
    },
    [hideTooltip],
  );

  return (
    <div
      ref={containerRef}
      className={`tooltip-container${block ? ' block' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {children}
      <AnimatePresence>
        {isShow && (
          <motion.div
            ref={tooltipRef}
            style={bindingStyle}
            className={tooltipClass}
            initial={tooltipVariants.initial}
            animate={tooltipVariants.animate}
            exit={tooltipVariants.exit}
            transition={tooltipVariants.transition}
          >
            {content ? (
              content({ close })
            ) : Array.isArray(message) ? (
              <>
                {(title || btnClose) && (
                  <div className="title">
                    {title && <h5>{title}</h5>}
                    {btnClose && (
                      <button onClick={onClickClose} className="close-btn" type="button">
                        <CloseIcon className="close" sx={{ width: 14, height: 14 }} />
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(Tooltip);
