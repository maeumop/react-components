import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import MessageBox from './component';
import { messageBoxType } from './const';
import type { MessageBoxContextType, MessageBoxOptions, MessageBoxProviderProps } from './types';
import { transitionType } from '../const';

// Context 생성
const MessageBoxContext = createContext<MessageBoxContextType | undefined>(undefined);

/**
 * MessageBoxProvider
 * - 전역적으로 MessageBox를 사용할 수 있도록 Provider/Context/Hook 제공
 */
export const MessageBoxProvider = ({
  children,
  noScrollStyleClass = 'hide-scroll',
  defaultTransition = transitionType.scale,
}: React.PropsWithChildren<MessageBoxProviderProps>) => {
  // 현재 표시 중인 MessageBox 옵션
  const [box, setBox] = useState<MessageBoxOptions | null>(null);
  const boxKey = useRef(0);

  // 닫기
  const handleClose = useCallback(() => {
    setBox(null);
  }, []);

  // alert
  const alert = useCallback(
    (params: MessageBoxOptions | string) => {
      boxKey.current += 1;
      const options = typeof params === 'string' ? { message: params } : params;

      setBox({
        ...options,
        type: messageBoxType.alert,
        noScrollStyleClass,
        transition: options.transition ?? defaultTransition,
        key: boxKey.current,
      });
    },
    [noScrollStyleClass, defaultTransition],
  );

  // confirm
  const confirm = useCallback(
    (params: MessageBoxOptions | string) => {
      boxKey.current += 1;
      const options = typeof params === 'string' ? { message: params } : params;

      setBox({
        ...options,
        type: messageBoxType.confirm,
        noScrollStyleClass,
        transition: options.transition ?? defaultTransition,
        key: boxKey.current,
      });
    },
    [noScrollStyleClass, defaultTransition],
  );

  // destroy
  const destroy = useCallback(() => {
    setBox(null);
  }, []);

  // Context 값
  const contextValue: MessageBoxContextType = {
    alert,
    confirm,
    destroy,
  };

  return (
    <MessageBoxContext.Provider value={contextValue}>
      {children}
      {box &&
        (() => {
          const { key, ...rest } = box;
          return <MessageBox key={key} {...rest} onClose={handleClose} />;
        })()}
    </MessageBoxContext.Provider>
  );
};

/**
 * useMessageBox 훅
 * - Provider 하위에서 alert/confirm/destroy 사용 가능
 */
export const useMessageBox = (): MessageBoxContextType => {
  const context = useContext(MessageBoxContext);

  if (!context) {
    throw new Error('useMessageBox는 반드시 <MessageBoxProvider> 하위에서 사용해야 합니다.');
  }

  return context;
};
