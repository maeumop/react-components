import React, { useCallback, useMemo } from 'react';
import type { StyledButtonProps } from './types';
import './style.scss';
import { CircularProgress as LoadingIcon } from '@mui/material';

// StyledButton 컴포넌트
const StyledButton = ({
  href = '#',
  target = '_blank',
  btnStyle = 'filled',
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
}: StyledButtonProps) => {
  // 클래스명 계산
  const buttonClass = useMemo(() => {
    const classes = ['btn'];
    if (onlyIcon) {
      classes.push('icon');
    } else if (btnStyle === 'text') {
      classes.push('text');
    }

    if (color) classes.push(color);

    if (large) {
      classes.push('large');
    } else if (isDefault) {
      classes.push('default');
    } else if (small) {
      classes.push('small');
    } else {
      classes.push('default');
    }

    if (btnStyle === 'outline' || outline) classes.push('outline');

    if (block) classes.push('block');

    if (disabled || loading) classes.push('disabled');

    if (className) classes.push(className);

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
  const iconSize = useMemo(() => (large ? 24 : small ? 18 : 20), [large, small]);

  // 클릭 이벤트 핸들러
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();

      if (href === '#') {
        if (!disabled && !loading && onClick) {
          onClick(event);
        }
      }
    },
    [href, disabled, loading, onClick],
  );

  // 렌더링 태그 결정
  const Tag = tag === 'button' ? 'button' : 'a';
  const Icon = icon;

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
              <LoadingIcon size={iconSize} className="loading" />
            ) : (
              <>
                {Icon && !iconRight && (
                  <div
                    className={dropMenuToggle ? 'rotate' : ''}
                    style={{ width: iconSize, height: iconSize }}
                  >
                    <Icon sx={{ width: iconSize, height: iconSize }} />
                  </div>
                )}
                {children}
                {Icon && iconRight && (
                  <div
                    className={dropMenuToggle ? 'rotate' : ''}
                    style={{ width: iconSize, height: iconSize }}
                  >
                    <Icon sx={{ width: iconSize, height: iconSize }} />
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="only-icon">
            {Icon && <Icon sx={{ width: iconSize, height: iconSize }} />}
          </div>
        )}
      </div>
    </Tag>
  );
};

StyledButton.displayName = 'StyledButton';

export default React.memo(StyledButton);
