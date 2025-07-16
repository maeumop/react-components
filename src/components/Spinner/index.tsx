import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Spinner } from './component';
import { spinnerDefaultOptions } from './const';
import type {
  SpinnerColor,
  SpinnerContextType,
  SpinnerOptions,
  SpinnerProviderProps,
} from './types';

const SpinnerContext = createContext<SpinnerContextType | undefined>(undefined);

export const SpinnerProvider: React.FC<SpinnerProviderProps> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const [color, setColor] = useState<SpinnerColor>(spinnerDefaultOptions.color);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const spinnerShow = useCallback((msg?: string, options?: SpinnerOptions) => {
    setMessage(msg);
    setColor(options?.color || spinnerDefaultOptions.color);
    setVisible(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const limit = options?.limitTime ?? spinnerDefaultOptions.limitTime;
    timeoutRef.current = setTimeout(() => setVisible(false), limit * 1000);
  }, []);

  const spinnerHide = useCallback(() => {
    setVisible(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return (
    <SpinnerContext.Provider value={{ spinnerShow, spinnerHide, isLoading: visible }}>
      {children}
      <Spinner
        show={visible}
        message={message}
        color={color}
        onExited={() => setMessage(undefined)}
      />
    </SpinnerContext.Provider>
  );
};

export const useSpinner = (): SpinnerContextType => {
  const context = useContext(SpinnerContext);

  if (!context) {
    throw new Error('useSpinner must be used within a SpinnerProvider');
  }

  return context;
};
