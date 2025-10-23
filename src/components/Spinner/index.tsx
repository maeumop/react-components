import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Spinner } from './component';
import { spinnerDefaultOptions } from './const';
import type { SpinnerColor, SpinnerContextType, SpinnerOptions } from './types';

const SpinnerContext = createContext<SpinnerContextType | undefined>(undefined);

export const SpinnerProvider = ({ children }: React.PropsWithChildren) => {
  const [visible, setVisible] = useState(false);
  const [hide, setHide] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [color, setColor] = useState<SpinnerColor>(spinnerDefaultOptions.color);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const spinnerShow = useCallback(
    (msg?: string, options?: SpinnerOptions) => {
      setMessage(msg || '');
      setColor(options?.color || spinnerDefaultOptions.color);
      setVisible(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const limit = options?.limitTime ?? spinnerDefaultOptions.limitTime;
      timeoutRef.current = setTimeout(() => setVisible(false), limit * 1000);
    },
    [timeoutRef, setColor],
  );

  const spinnerHide = useCallback(() => {
    setHide(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [timeoutRef]);

  const onExited = useCallback(() => {
    setMessage('');

    // provider로 유지되고 있기 때문에 hide값을 변경 해줘야만 다음 번에 사용 될때 정상 작동
    setHide(false);
    setVisible(false);
  }, []);

  return (
    <SpinnerContext.Provider value={{ spinnerShow, spinnerHide, isLoading: visible }}>
      {children}

      <Spinner show={visible} hide={hide} message={message} color={color} onExited={onExited} />
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
