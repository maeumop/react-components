import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ToastList from './component';
import { toastDefaultOptions } from './const';
import type { ToastContextType, ToastItem, ToastOptions } from './types';

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: React.PropsWithChildren) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const remove = useCallback(
    (id: string) => {
      setToasts(prev => prev.filter(t => t.id !== id));
    },
    [setToasts],
  );

  const toast = useCallback(
    (message: string, options?: ToastOptions) => {
      const id = `${Date.now()}-${idRef.current++}`;
      const newToast: ToastItem = {
        id,
        message,
        color: options?.color ?? toastDefaultOptions.color,
        duration: options?.duration ?? toastDefaultOptions.duration,
        position: options?.position ?? toastDefaultOptions.position,
        onClose: options?.onClose,
      };

      setToasts(prev => [...prev, newToast]);

      setTimeout(() => {
        remove(id);

        if (typeof newToast.onClose === 'function') {
          newToast.onClose();
        }
      }, newToast.duration);
    },
    [remove, setToasts, remove, idRef],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {createPortal(<ToastList toasts={toasts} remove={remove} />, document.body)}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};
