import type { messageBoxTransition, messageBoxType } from './const';

export interface MessageBoxOptions {
  type?: MessageBoxType;
  message: string;
  title?: string;
  width?: string;
  btnOkayText?: string;
  btnCancelText?: string;
  okay?: () => void;
  cancel?: () => void;
  asyncOkay?: () => Promise<void>;
  onClose?: () => void;
  escCancel?: boolean;
  enterOkay?: boolean;
  noScrollStyleClass?: string;
  transition?: MessageBoxTransition;
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
export type MessageBoxTransition = (typeof messageBoxTransition)[keyof typeof messageBoxTransition];

export interface MessageBoxProviderProps {
  noScrollStyleClass?: string;
  defaultTransition?: MessageBoxTransition;
}

// 플러그인 옵션 타입 추가
export interface MessageBoxPluginOptions {
  noScrollStyleClass?: string;
  defaultTransition?: MessageBoxTransition;
}
