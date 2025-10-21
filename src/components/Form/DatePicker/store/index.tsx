import { createContext, useContext, useRef } from 'react';
import type { ReactNode } from 'react';
import { createDatePickerStore } from './store';
import { useStore } from 'zustand';

// Context 생성
type DatePickerStoreType = ReturnType<typeof createDatePickerStore>;
export const DatePickerStoreContext = createContext<DatePickerStoreType | null>(null);

/**
 * DatePicker Store Provider
 */
export const DatePickerStoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<DatePickerStoreType>(null);

  if (!storeRef.current) {
    storeRef.current = createDatePickerStore();
  }

  return (
    <DatePickerStoreContext.Provider value={storeRef.current}>
      {children}
    </DatePickerStoreContext.Provider>
  );
};

/**
 * DatePicker Store Hook
 */
export const useDatePickerStore = () => {
  const store = useContext(DatePickerStoreContext);

  if (!store) {
    throw new Error('useDatePickerStore must be used within DatePickerStoreProvider');
  }

  return useStore(store);
};

/**
 * DatePicker Store Instance Hook
 * getState()로 최신 상태를 직접 읽을 수 있는 store 인스턴스 반환
 */
export const useDatePickerStoreInstance = () => {
  const store = useContext(DatePickerStoreContext);

  if (!store) {
    throw new Error('useDatePickerStoreInstance must be used within DatePickerStoreProvider');
  }

  return store;
};
