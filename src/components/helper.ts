import type { Transition } from 'framer-motion';
import type {
  TransitionVariants,
  LayerPositionType,
  TransitionType,
  UseLayerPositionProps,
} from './types';

class ComponentHelper {
  constructor() {}

  public calcLayerPosition({
    parent,
    position,
    width,
    height,
    autoPosition = false,
  }: UseLayerPositionProps): { style: React.CSSProperties; position: LayerPositionType } {
    const windowHeight: number = window.innerHeight;
    const windowWidth: number = window.innerWidth;
    const rect: DOMRect = parent.getBoundingClientRect();

    let pos = position;

    // 레이어 위치 스타일
    const style: React.CSSProperties = {
      position: 'fixed',
      top: '',
      bottom: '',
      right: '',
      left: '',
      width: width ? `${width}px` : 'auto',
      height: height ? `${height}px` : 'auto',
      transformOrigin: '',
      zIndex: 1000,
    };

    const topBottom = windowHeight / 2 < rect.top;
    const leftRight = windowWidth / 2 < rect.left;

    if (autoPosition) {
      // 상, 하, 좌, 우 처리 시 화면의 중앙을 기준으로 위치를 설정
      if (position === 'top' && !topBottom) {
        pos = 'bottom';
      } else if (position === 'bottom' && topBottom) {
        pos = 'top';
      } else if (position === 'left' && !leftRight) {
        pos = 'right';
      } else if (position === 'right' && leftRight) {
        pos = 'left';
      }
    }

    switch (pos) {
      case 'top':
        style.left = `${rect.left}px`;
        style.bottom = `${windowHeight - rect.top}px`;
        style.transformOrigin = 'bottom';
        break;
      case 'right':
        style.left = `${rect.right}px`;
        style.top = `${rect.top}px`;
        style.transformOrigin = 'left';
        break;
      case 'left':
        style.right = `${windowWidth - rect.left}px`;
        style.top = `${rect.top}px`;
        style.transformOrigin = 'right';
        break;
      default:
        style.left = `${rect.left}px`;
        style.top = `${rect.top + rect.height}px`;
        style.transformOrigin = 'top';
        break;
    }

    return { style, position: pos };
  }

  /**
   * DropMenu용 framer-motion variants 생성
   * SCSS의 transition 설정을 framer-motion으로 변환
   *
   * @param transitionType - transition 종류 (slide, scale, fade, bounce, flip, elastic, swing)
   * @param position - 메뉴 위치 (top, right, left, bottom)
   * @returns DropMenuVariants - framer-motion variants 객체
   */
  public getTransitionVariant(
    transitionType: TransitionType,
    position: LayerPositionType = 'bottom',
  ): TransitionVariants {
    // position에 따른 방향 설정
    const directions = {
      top: { y: '1em', x: 0 },
      bottom: { y: '-1em', x: 0 },
      left: { x: '1em', y: 0 },
      right: { x: '-1em', y: 0 },
    };
    const dir = directions[position];
    const duration = 0.2;

    // Transition 설정
    const transitionConfigs: Record<TransitionType, Transition> = {
      slide: { duration },
      fade: { duration },
      scale: { duration },
      bounce: { duration, ease: [0.68, -0.55, 0.265, 1.55] },
      elastic: { duration, ease: [0.175, 0.885, 0.32, 1.275] },
      swing: { duration, ease: [0.25, 0.46, 0.45, 0.94] },
      flip: { duration, ease: [0.455, 0.03, 0.515, 0.955] },
    };

    const transition = transitionConfigs[transitionType];

    switch (transitionType) {
      case 'slide':
        return {
          initial: { opacity: 0, x: dir?.x ?? 0, y: dir?.y ?? 0 },
          animate: { opacity: 1, x: 0, y: 0 },
          exit: { opacity: 0, x: dir?.x ?? 0, y: dir?.y ?? 0 },
          transition,
        };

      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition,
        };

      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.7 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.7 },
          transition,
        };

      case 'bounce':
        return {
          initial: {
            opacity: 0,
            x: dir.x !== 0 ? (dir.x === '1em' ? '2em' : '-2em') : 0,
            y: dir.y !== 0 ? (dir.y === '1em' ? '2em' : '-2em') : 0,
            scale: 0.7,
          },
          animate: { opacity: 1, x: 0, y: 0, scale: 1 },
          exit: {
            opacity: 0,
            x: dir.x !== 0 ? (dir.x === '1em' ? '2em' : '-2em') : 0,
            y: dir.y !== 0 ? (dir.y === '1em' ? '2em' : '-2em') : 0,
            scale: 0.7,
          },
          transition,
        };

      case 'flip':
        return {
          initial: {
            opacity: 0,
            x: dir?.x ?? 0,
            y: dir?.y ?? 0,
            rotateX: position === 'bottom' || position === 'top' ? -90 : 0,
            rotateY: position === 'left' || position === 'right' ? -90 : 0,
            scale: 0.8,
          },
          animate: { opacity: 1, x: 0, y: 0, rotateX: 0, rotateY: 0, scale: 1 },
          exit: {
            opacity: 0,
            x: dir?.x ?? 0,
            y: dir?.y ?? 0,
            rotateX: position === 'bottom' || position === 'top' ? -90 : 0,
            rotateY: position === 'left' || position === 'right' ? -90 : 0,
            scale: 0.8,
          },
          transition,
        };

      case 'elastic':
        return {
          initial: {
            opacity: 0,
            x: dir.x !== 0 ? (dir.x === '1em' ? '3em' : '-3em') : 0,
            y: dir.y !== 0 ? (dir.y === '1em' ? '3em' : '-3em') : 0,
            scale: 0.7,
          },
          animate: { opacity: 1, x: 0, y: 0, scale: 1 },
          exit: {
            opacity: 0,
            x: dir.x !== 0 ? (dir.x === '1em' ? '3em' : '-3em') : 0,
            y: dir.y !== 0 ? (dir.y === '1em' ? '3em' : '-3em') : 0,
            scale: 0.7,
          },
          transition,
        };

      case 'swing':
        return {
          initial: {
            opacity: 0,
            x: dir?.x ?? 0,
            y: dir?.y ?? 0,
            rotate:
              position === 'right'
                ? 15
                : position === 'left'
                  ? -15
                  : position === 'bottom'
                    ? -15
                    : 15,
          },
          animate: { opacity: 1, x: 0, y: 0, rotate: 0 },
          exit: {
            opacity: 0,
            x: dir?.x ?? 0,
            y: dir?.y ?? 0,
            rotate:
              position === 'right'
                ? 15
                : position === 'left'
                  ? -15
                  : position === 'bottom'
                    ? -15
                    : 15,
          },
          transition,
        };
    }
  }

  /**
   * 천단위로 콤마 포맷
   * @param v - 숫자
   * @returns 천단위 콤마 포맷팅된 문자열
   */
  public numberFormat(v: number | string): string {
    if (v === '-' || v === '') {
      return String(v);
    }

    const num = Number(v);

    if (isNaN(num)) {
      return '0';
    }

    return new Intl.NumberFormat().format(num);
  }

  /**
   * 천단위 콤마 포맷되어 있는 문자열을 숫자로 전환
   * @param v - 천단위 콤마 포맷되어 있는 문자열
   * @returns  number
   */
  public commaStringToNumber(v: string): number {
    let val = v
      .replace(/[^\d-]/g, '')
      .replace(/-{2,}/g, '-')
      .replace(/^$/, '');

    val = val.charAt(0) === '-' ? '-' + val.replace(/[-]/g, '') : val.replace(/[-]/g, '');

    return Number(val);
  }
}

export const useComponentHelper = () => {
  return new ComponentHelper();
};
