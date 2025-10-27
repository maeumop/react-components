export const tabsVariant = {
  default: 'default',
  underline: 'underline',
  pills: 'pills',
} as const;

export const tabsTransition = {
  slide: 'slide',
  fade: 'fade',
  scale: 'scale',
  flip: 'flip',
  bounce: 'bounce',
} as const;

/**
 * framer-motion transition 설정
 * 각 transition 타입별 duration과 easing 정의
 */
export const transitionConfigs = {
  slide: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1] as const,
  },
  fade: {
    duration: 0.3,
    ease: 'easeInOut' as const,
  },
  scale: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1] as const,
  },
  flip: {
    duration: 0.4,
    ease: [0.4, 0, 0.2, 1] as const,
  },
  bounce: {
    duration: 0.5,
    ease: [0.68, -0.55, 0.265, 1.55] as const,
  },
} as const;

/**
 * framer-motion variants 생성 함수용 상수
 */
export const variantSettings = {
  slideDistance: 30,
  scaleInitial: 0.8,
  scaleExit: 1.1,
  bounceScale: 0.3,
  bounceYDistance: 50,
  flipRotation: 90,
} as const;
