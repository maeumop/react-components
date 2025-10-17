import React, { useMemo } from 'react';
import type { BadgeProps } from './types';
import { badgeSize } from './const';
import './style.scss';

// Badge 컴포넌트
const Badge = ({
  color = 'primary',
  position = 'right',
  size = badgeSize.default,
  text,
  icon,
  wrapperClass = '',
  badgeClass = '',
  children,
  style,
}: React.PropsWithChildren<BadgeProps>) => {
  // 뱃지 스타일 클래스 생성
  const badgeStyle = useMemo(() => {
    const classes = ['badge'];
    if (color) {
      classes.push(color);
    }

    if (position) {
      classes.push(position);
    }

    if (size) {
      classes.push(size);
    }

    if (badgeClass) {
      classes.push(badgeClass);
    }

    return classes.join(' ');
  }, [color, position, size, badgeClass]);

  // 래퍼 클래스 생성
  const wrapperClassName = useMemo(() => {
    const classes = ['badge-wrapper'];
    if (wrapperClass) {
      classes.push(wrapperClass);
    }
    return classes.join(' ');
  }, [wrapperClass]);

  // 접근성 라벨 생성
  const ariaLabel = text ? `${text}개의 알림` : '알림';

  const Icon = icon;

  return (
    <div className={wrapperClassName} style={style}>
      {children}
      <div className={badgeStyle} aria-label={ariaLabel} role="status">
        {Icon ? <Icon sx={{ fontSize: 19 }} /> : text}
      </div>
    </div>
  );
};

export default React.memo(Badge);
