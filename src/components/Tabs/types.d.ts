import { tabsTransition, tabsVariant } from './const';

export type TabsVariant = (typeof tabsVariant)[keyof typeof tabsVariant];
export type TabsTransition = (typeof tabsTransition)[keyof typeof tabsTransition];

export interface TabsProps {
  tabItems: string[];
  inBox?: boolean;
  activeTab?: number;
  disabled?: boolean[];
  variant?: TabsVariant;
  transition?: TabsTransition;
}

export type TabsEmits = {
  (event: 'update:activeTab', value: number): void;
  (event: 'changeTab', value: number): void;
};
