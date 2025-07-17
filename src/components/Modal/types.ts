import type { ReactNode } from 'react';
import { modalPosition, modalTransition } from './const';

export type ModalPosition = (typeof modalPosition)[keyof typeof modalPosition];
export type ModalTransition = (typeof modalTransition)[keyof typeof modalTransition];

export interface ModalModel {
  close(callback?: () => void): void;
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  position?: ModalPosition;
  width?: string;
  fullscreen?: boolean;
  escClose?: boolean;
  hideClose?: boolean;
  screenCover?: boolean;
  children?: ReactNode;
  body?: ReactNode;
  action?: (close: () => void) => ReactNode;
}
