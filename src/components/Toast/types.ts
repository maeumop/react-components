import type { toastColor, toastIcon, toastPosition } from './const';

export type ToastColor = (typeof toastColor)[keyof typeof toastColor];
export type ToastIcon = (typeof toastIcon)[keyof typeof toastIcon];
export type ToastPosition = (typeof toastPosition)[keyof typeof toastPosition];

export interface ToastOptions {
  color?: ToastColor;
  duration?: number; // ms
  position?: ToastPosition;
  onClose?: () => void;
}

export interface ToastListProps {
  toasts: ToastItem[];
  remove: (id: string) => void;
}

export interface ToastItem {
  id: string;
  message: string;
  color: ToastColor;
  duration: number;
  position: ToastPosition;
  onClose?: () => void;
}

export interface ToastContextType {
  toast: (message: string, options?: ToastOptions) => void;
}

export interface ToastProviderProps {
  children: React.ReactNode;
}
