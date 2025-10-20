import type { SvgIconProps } from '@mui/material/SvgIcon';
import { layerPosition, transitionOrigin, transitionType } from './const';
import type { TargetAndTransition, Transition } from 'framer-motion';

// selectbox, checkbox 사용 옵션
export interface OptionItem {
  text: string;
  value: string;
}

export interface OptionItemGroup {
  [index: string]: OptionItem[];
}

// 아이콘 컴포넌트 타입
export type IconComponent = React.ComponentType<SvgIconProps>;

export type LayerPositionType = (typeof layerPosition)[keyof typeof layerPosition];
export type TransitionType = (typeof transitionType)[keyof typeof transitionType];
export type TransitionOriginType = (typeof transitionOrigin)[keyof typeof transitionOrigin];

export interface UseLayerPositionProps {
  parent: HTMLElement;
  layer: HTMLElement;
  position: LayerPositionType;
  width?: number;
  height?: number;
  autoPosition?: boolean;
}

export interface TransitionVariants {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  exit: TargetAndTransition;
  transition: Transition;
}
