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
