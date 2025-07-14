import type { toastColor, toastIcon } from './const';

export type ToastColor = (typeof toastColor)[keyof typeof toastColor];

export type ToastIcon = (typeof toastIcon)[keyof typeof toastIcon];

export interface ToastOptions {
  maxShowMessage?: number;
  delay?: number;
  destroy: () => void;
}

export interface MessageOptions {
  message: string;
  icon?: ToastIcon;
  color?: ToastColor;
}

export interface ToastModel {
  (params: string | MessageOptions): void;
}

export interface ToastListType {
  key: number;
  color: ToastColor;
  icon: ToastIcon;
  message: string;
}

export interface ToastExpose {
  show(): void;
  setMessage(message: string, color?: ToastColor, icon?: ToastIcon): void;
  hide(index?: number): void;
  clear(): void;
}

// Vue 전역 속성 타입 확장
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $toast: ToastModel;
  }
}
