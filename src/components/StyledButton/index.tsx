import type { IconifyIcon } from '@iconify/react';
import { Icon } from '@iconify/react';
import type { MouseEventHandler, ReactNode } from 'react';
import React, { useMemo } from 'react';
import './style.scss';

export interface StyledButtonProps {
  href?: string;
  target?: string;
  style?: string;
  color?: string;
  block?: boolean;
  onlyIcon?: boolean;
  loading?: boolean;
  disabled?: boolean;
  iconRight?: boolean;
  small?: boolean;
  default?: boolean;
  large?: boolean;
  outline?: boolean;
  tag?: string;
  dropMenuToggle?: boolean;
  width?: string | number;
  icon?: string | IconifyIcon;
  children?: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLElement>;
}

// StyledButton 컴포넌트
const StyledButton: React.FC<StyledButtonProps> = ({
  href = '#',
  target = '_blank',
  style: btnStyle = 'filled',
  color,
  block = false,
  onlyIcon = false,
  loading = false,
  disabled = false,
  iconRight = false,
  small = false,
  default: isDefault = false,
  large = false,
  outline = false,
  tag = 'a',
  dropMenuToggle = false,
  width,
  icon,
  children,
  className = '',
  onClick,
  ...rest
}) => {
  // 클래스명 계산
  const buttonClass = useMemo(() => {
    const classes = ['btn'];
    if (onlyIcon) {
      classes.push('icon');
    } else if (btnStyle === 'text') {
      classes.push('text');
    }
    if (color) {
      classes.push(color);
    }
    if (large) {
      classes.push('large');
    } else if (isDefault) {
      classes.push('default');
    } else if (small) {
      classes.push('small');
    } else {
      classes.push('default');
    }
    if (btnStyle === 'outline' || outline) {
      classes.push('outline');
    }
    if (block) {
      classes.push('block');
    }
    if (disabled || loading) {
      classes.push('disabled');
    }
    if (className) {
      classes.push(className);
    }
    return classes.join(' ');
  }, [
    onlyIcon,
    btnStyle,
    color,
    large,
    isDefault,
    small,
    outline,
    block,
    disabled,
    loading,
    className,
  ]);

  // 인라인 스타일
  const buttonInlineStyle = useMemo(() => {
    if (width) {
      if (typeof width === 'number') {
        return { width: `${width}px` };
      }
      return { width };
    }
    return undefined;
  }, [width]);

  // 아이콘 크기 계산
  const iconSize = useMemo(() => {
    if (large) {
      return 24;
    }
    if (isDefault) {
      return 20;
    }
    if (small) {
      return 18;
    }
    return 18;
  }, [large, isDefault, small]);

  // 클릭 이벤트 핸들러
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (href === '#') {
      event.preventDefault();
      if (!disabled && !loading && onClick) {
        onClick(event);
      }
    }
  };

  // 렌더링 태그 결정
  const Tag = tag === 'button' ? 'button' : 'a';

  return (
    <Tag
      className={buttonClass}
      style={buttonInlineStyle}
      href={Tag === 'a' ? (disabled ? undefined : href) : undefined}
      target={Tag === 'a' ? target : undefined}
      type={Tag === 'button' ? 'button' : undefined}
      disabled={Tag === 'button' ? disabled : undefined}
      onClick={handleClick}
      {...rest}
    >
      <div className="btn-wrap">
        {!onlyIcon ? (
          <>
            {loading ? (
              <Icon className="loading" icon="mdi:loading" width={iconSize} height={iconSize} />
            ) : (
              <>
                {icon && !iconRight && (
                  <Icon
                    className={dropMenuToggle ? 'rotate' : ''}
                    width={iconSize}
                    height={iconSize}
                    icon={icon as string}
                  />
                )}
                {children}
                {icon && iconRight && (
                  <Icon
                    className={dropMenuToggle ? 'rotate' : ''}
                    width={iconSize}
                    height={iconSize}
                    icon={icon as string}
                  />
                )}
              </>
            )}
          </>
        ) : (
          <div className="only-icon">
            {icon && <Icon width={iconSize} height={iconSize} icon={icon as string} />}
          </div>
        )}
      </div>
    </Tag>
  );
};

export default React.memo(StyledButton);
