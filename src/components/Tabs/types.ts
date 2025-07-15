import type { ReactNode } from 'react';
import { tabsTransition, tabsVariant } from './const';

export type TabsVariant = (typeof tabsVariant)[keyof typeof tabsVariant];
export type TabsTransition = (typeof tabsTransition)[keyof typeof tabsTransition];

export interface TabsProps {
  tabItems: string[];
  activeTab?: number;
  disabled?: boolean[];
  variant?: TabsVariant;
  transition?: TabsTransition;
  children: ReactNode[];
  onChangeTab?: (index: number) => void; // 추가
  onUpdateActiveTab?: (index: number) => void; // 추가
}

export type TabsEmits = {
  (event: 'update:activeTab', value: number): void;
  (event: 'changeTab', value: number): void;
};
