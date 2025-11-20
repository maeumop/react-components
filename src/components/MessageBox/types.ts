import type { TransitionType } from '../types';
import type { messageBoxType } from './const';

export interface MessageBoxOptions {
  type?: MessageBoxType;
  message: string;
  title?: string;
  width?: string;
  btnOkayText?: string;
  btnCancelText?: string;
  onClickOkay?: () => void;
  onClickCancel?: () => void;
  onClickAsyncOkay?: () => Promise<void>;
  onClose?: () => void;
  escCancel?: boolean;
  enterOkay?: boolean;
  noScrollStyleClass?: string;
  transition?: TransitionType;
  key?: number;
}

export interface MessageBoxExpose {
  hide(): void;
}

export interface MessageBoxContextType {
  alert: (options: MessageBoxOptions | string) => void;
  confirm: (options: MessageBoxOptions | string) => void;
  destroy: () => void;
}

export type MessageBoxType = (typeof messageBoxType)[keyof typeof messageBoxType];

export interface MessageBoxProviderProps {
  noScrollStyleClass?: string;
  defaultTransition?: TransitionType;
}

// 플러그인 옵션 타입 추가
export interface MessageBoxPluginOptions {
  noScrollStyleClass?: string;
  defaultTransition?: TransitionType;
}
