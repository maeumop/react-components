import { Icon } from '@iconify/react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { dropMenuColor, dropMenuPosition, dropMenuTransition } from './const';
import './style.scss';
import type { DropMenuItem, DropMenuProps } from './types';

// DropMenu 컴포넌트
const DropMenu: React.FC<React.PropsWithChildren<DropMenuProps>> = ({
  items,
  position = dropMenuPosition.bottom,
  transition = dropMenuTransition.slide,
  color = dropMenuColor.primary,
  width,
  disabled = false,
  disableAutoClose = false,
  children,
  ...rest
}) => {
  // 내부 상태
  const [isOpen, setIsOpen] = useState(false);
  const [layerStyle, setLayerStyle] = useState<React.CSSProperties>({});
  const dropMenuRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const ulTransitionRef = useRef<HTMLUListElement>(null);

  // 트랜지션 클래스명
  const transitionName = `${transition}-${position}`;

  // 메뉴 위치 계산
  const calcLayerPosition = useCallback(() => {
    if (!dropMenuRef.current) {
      return;
    }

    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const rect = dropMenuRef.current.getBoundingClientRect();
    const style: React.CSSProperties = {};

    switch (position) {
      case dropMenuPosition.top:
        style.left = `${rect.left}px`;
        style.bottom = `${windowHeight - rect.top}px`;
        break;
      case dropMenuPosition.right:
        style.left = `${rect.right}px`;
        style.top = `${rect.top}px`;
        break;
      case dropMenuPosition.left:
        style.right = `${windowWidth - rect.left}px`;
        style.top = `${rect.top}px`;
        break;
      default:
        style.left = `${rect.left}px`;
        style.top = `${rect.top + rect.height}px`;
        break;
    }

    if (width) {
      style.width = `${width}px`;
    } else {
      style.minWidth = `${rect.width}px`;
    }

    setLayerStyle(style);
  }, [position, width]);

  // 메뉴 열기
  const openMenu = useCallback(() => {
    if (disabled) {
      return;
    }

    calcLayerPosition();
    setIsOpen(true);

    if (rest.onOpen) {
      rest.onOpen();
    }

    setTimeout(() => {
      if (menuRef.current) {
        const first: HTMLElement | null = menuRef.current.querySelector('a, button');

        if (first) {
          first.focus();
        }
      }
    }, 0);
  }, [disabled, calcLayerPosition, rest]);

  // 메뉴 닫기
  const closeMenu = useCallback(() => {
    setIsOpen(false);

    if (rest.onClose) {
      rest.onClose();
    }
  }, [rest]);

  // 토글
  const toggle = useCallback(() => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }, [isOpen, openMenu, closeMenu]);

  // 외부 클릭 닫기
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClick = (e: MouseEvent) => {
      if (disableAutoClose) {
        return;
      }

      if (
        dropMenuRef.current &&
        !dropMenuRef.current.contains(e.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClick);

    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, disableAutoClose, closeMenu]);

  // 스크롤 시 닫기
  useEffect(() => {
    if (!isOpen || disableAutoClose) {
      return;
    }

    const handleScroll = () => closeMenu();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen, disableAutoClose, closeMenu]);

  // 키보드 내비게이션
  const focusNextItem = useCallback(() => {
    if (!menuRef.current) {
      return;
    }

    const focusable = menuRef.current.querySelectorAll('a, button:not([disabled])');
    const current = Array.from(focusable).findIndex(el => el === document.activeElement);
    const next = (current + 1) % focusable.length;

    (focusable[next] as HTMLElement)?.focus();
  }, []);

  const focusPrevItem = useCallback(() => {
    if (!menuRef.current) {
      return;
    }

    const focusable = menuRef.current.querySelectorAll('a, button:not([disabled])');
    const current = Array.from(focusable).findIndex(el => el === document.activeElement);
    const prev = current <= 0 ? focusable.length - 1 : current - 1;

    (focusable[prev] as HTMLElement)?.focus();
  }, []);

  const handleKeydown = useCallback(
    (event: React.KeyboardEvent) => {
      event.preventDefault();

      if (!isOpen) {
        return;
      }

      if (event.key === 'Escape') {
        closeMenu();
      } else if (event.key === 'ArrowDown') {
        focusNextItem();
      } else if (event.key === 'ArrowUp') {
        focusPrevItem();
      }
    },
    [isOpen, closeMenu, focusNextItem, focusPrevItem],
  );

  // 아이템 클릭
  const handleItemClick = useCallback(
    (item: DropMenuItem, index: number, e: React.MouseEvent | React.KeyboardEvent) => {
      e.preventDefault();

      if (item.disabled) {
        return;
      }

      try {
        item.action();
        if (rest.onItemClick) {
          rest.onItemClick(item, index);
        }
      } catch (err) {
        console.error('DropMenu item action error:', err);
      }

      if (!disableAutoClose) {
        closeMenu();
      }
    },
    [rest, closeMenu, disableAutoClose],
  );

  // 트리거 버튼(슬롯) 클릭/키다운
  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  };

  const onKeyDownEvent = (item: DropMenuItem, idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleItemClick(item, idx, e);
    }
  };

  const dropWrapperClassName = useMemo(
    () => ['drop-menu', color, disabled ? 'disabled' : ''].join(' '),
    [color, disabled],
  );

  // 렌더
  return (
    <div
      ref={dropMenuRef}
      className={dropWrapperClassName}
      onClick={toggle}
      onKeyDown={handleTriggerKeyDown}
      role="button"
      aria-expanded={isOpen}
      aria-haspopup="true"
      aria-disabled={disabled}
      tabIndex={0}
    >
      {/* 트리거(슬롯) */}
      {children}
      {/* 드롭다운 메뉴 트랜지션 */}
      <CSSTransition
        in={isOpen}
        timeout={300}
        classNames={transitionName}
        unmountOnExit
        nodeRef={ulTransitionRef}
        onEnter={calcLayerPosition}
      >
        <ul
          ref={el => {
            menuRef.current = el;
            ulTransitionRef.current = el;
          }}
          style={layerStyle}
          className={['drop-menu-wrap', position].join(' ')}
          role="menu"
          aria-label="드롭다운 메뉴"
          onKeyDown={handleKeydown}
        >
          {items.map((item, idx) => (
            <li key={`menu-item-${idx}`} role="none">
              <a
                href="#"
                className={item.disabled ? 'disabled' : ''}
                onClick={e => handleItemClick(item, idx, e)}
                onKeyDown={e => onKeyDownEvent(item, idx, e)}
                role="menuitem"
                aria-disabled={item.disabled}
                tabIndex={item.disabled ? -1 : 0}
              >
                {item.icon && (
                  <Icon icon={item.icon} width={18} height={18} style={{ marginRight: 8 }} />
                )}
                <span>{item.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </CSSTransition>
    </div>
  );
};

export default React.memo(DropMenu);
