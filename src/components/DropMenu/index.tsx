import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { dropMenuColor } from './const';
import './style.scss';
import type { DropMenuItem, DropMenuProps } from './types';
import { useComponentHelper } from '../helper';
import { AnimatePresence, motion } from 'framer-motion';
import type { LayerPositionType } from '../types';
import { layerPosition, transitionType } from '../const';

// DropMenu 컴포넌트
const DropMenu = ({
  items,
  position = layerPosition.bottom,
  transition = transitionType.slide,
  color = dropMenuColor.primary,
  width,
  disabled = false,
  disableAutoClose = false,
  children,
  onOpen,
  onClose,
  onItemClick,
}: React.PropsWithChildren<DropMenuProps>) => {
  // 내부 상태
  const [isOpen, setIsOpen] = useState(false);
  const [layerStyle, setLayerStyle] = useState<React.CSSProperties>({});
  const dropMenuRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const ulTransitionRef = useRef<HTMLUListElement>(null);

  const componentHelper = useRef(useComponentHelper());

  // 메뉴 위치 계산
  const setLayerPosition = useCallback(() => {
    if (!dropMenuRef.current) return;

    const rect = dropMenuRef.current.getBoundingClientRect();

    const { style } = componentHelper.current.calcLayerPosition({
      parent: dropMenuRef.current,
      layer: menuRef.current as HTMLElement,
      position,
      width: width ?? rect.width,
    });

    setLayerStyle(() => style);
  }, [position, width]);

  // 메뉴 열기
  const openMenu = useCallback(() => {
    if (disabled) return;

    setLayerPosition();
    setIsOpen(true);

    if (typeof onOpen === 'function') {
      onOpen();
    }

    setTimeout(() => {
      if (menuRef.current) {
        const first: HTMLElement | null = menuRef.current.querySelector('a, button');

        if (first) {
          first.focus();
        }
      }
    }, 0);
  }, [disabled, onOpen]);

  // 메뉴 닫기
  const closeMenu = useCallback(() => {
    setIsOpen(false);

    if (typeof onClose === 'function') {
      onClose();
    }
  }, [onClose]);

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
    if (!isOpen) return;

    const handleClick = (e: MouseEvent) => {
      if (disableAutoClose) return;

      const isClickOutside =
        dropMenuRef.current &&
        !dropMenuRef.current.contains(e.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node);

      if (isClickOutside) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClick);

    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, disableAutoClose, closeMenu]);

  // 스크롤 시 닫기
  useEffect(() => {
    if (!isOpen || disableAutoClose) return;

    const handleScroll = () => closeMenu();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen, disableAutoClose, closeMenu]);

  // 키보드 내비게이션
  const focusOptionItem = useCallback((key: KeyboardEvent['key']) => {
    if (!menuRef.current) return;

    let focusable = menuRef.current.querySelectorAll<HTMLElement>('a, button:not([disabled])');
    let current = Array.from(focusable).findIndex(el => el === document.activeElement);
    let pos = current <= 0 ? focusable.length - 1 : current - 1;

    if (key === 'ArrowDown') {
      focusable = menuRef.current.querySelectorAll<HTMLElement>('a, button:not([disabled])');
      current = Array.from(focusable).findIndex(el => el === document.activeElement);
      pos = (current + 1) % focusable.length;
    }

    (focusable[pos] as HTMLElement)?.focus();
  }, []);

  const handleKeydown = useCallback(
    (event: React.KeyboardEvent) => {
      event.preventDefault();

      if (!isOpen) return;

      if (event.key === 'Escape') {
        closeMenu();
      } else if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
        focusOptionItem(event.key);
      }
    },
    [isOpen, closeMenu, focusOptionItem],
  );

  // 아이템 클릭
  const handleItemClick = useCallback(
    (item: DropMenuItem, index: number, e: React.MouseEvent | React.KeyboardEvent) => {
      e.preventDefault();

      if (item.disabled) return;

      try {
        item.action();

        if (typeof onItemClick === 'function') {
          onItemClick(item, index);
        }
      } catch (err) {
        console.error('DropMenu item action error:', err);
      }

      if (!disableAutoClose) closeMenu();
    },
    [onItemClick, closeMenu, disableAutoClose],
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

  const componentHelperRef = useRef(useComponentHelper());

  const variants = useMemo(() => {
    return componentHelperRef.current.getTransitionVariant(
      transition,
      position as LayerPositionType,
    );
  }, [position, transition]);

  // 렌더
  return (
    <div
      ref={dropMenuRef}
      className={dropWrapperClassName}
      onClick={toggle}
      onKeyDown={handleTriggerKeyDown}
      tabIndex={0}
    >
      {/* 트리거(슬롯) */}
      {children}

      {/* 드롭다운 메뉴 트랜지션 */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            ref={el => {
              menuRef.current = el;
              ulTransitionRef.current = el;
            }}
            style={layerStyle}
            className={['drop-menu-wrap', position].join(' ')}
            onKeyDown={handleKeydown}
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={variants.transition}
          >
            {items.map((item, idx) => (
              <li key={`menu-item-${idx}`}>
                <a
                  href="#"
                  className={item.disabled ? 'disabled' : ''}
                  onClick={e => handleItemClick(item, idx, e)}
                  onKeyDown={e => onKeyDownEvent(item, idx, e)}
                  tabIndex={item.disabled ? -1 : 0}
                >
                  {item.icon && <item.icon width={18} height={18} style={{ marginRight: 8 }} />}
                  <span>{item.text}</span>
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(DropMenu);
