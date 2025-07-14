import { createApp, type App } from 'vue';
import MessageBoxComponent from './component.vue';
import { messageBoxTransition } from './const';
import type { MessageBoxModel, MessageBoxOptions, MessageBoxPluginOptions } from './types';

let messageBoxInstance: App<Element> | null = null;

// 플러그인 옵션을 저장할 변수
let pluginOptions: MessageBoxPluginOptions = {
  noScrollStyleClass: 'hide-scroll',
  defaultTransition: messageBoxTransition.scale,
};

const createMessageBox = (options: MessageBoxOptions): void => {
  // 플러그인 옵션과 개별 옵션을 병합
  const mergedOptions = {
    ...options,
    noScrollStyleClass: options.noScrollStyleClass ?? pluginOptions.noScrollStyleClass,
    transition: options.transition ?? pluginOptions.defaultTransition,
  };

  // 기존 인스턴스가 있다면 제거
  if (messageBoxInstance) {
    messageBoxInstance.unmount();
    messageBoxInstance = null;
  }

  // 새로운 인스턴스 생성
  messageBoxInstance = createApp(MessageBoxComponent, {
    ...mergedOptions,
    destroy: () => {
      if (messageBoxInstance) {
        messageBoxInstance.unmount();
        messageBoxInstance = null;
      }
    },
  });

  // DOM에 마운트
  const container = document.createElement('div');
  document.body.appendChild(container);
  messageBoxInstance.mount(container);
};

const messageBox: MessageBoxModel = {
  alert(params: MessageBoxOptions | string): void {
    const options = typeof params === 'string' ? { message: params } : params;
    createMessageBox({
      type: 'alert',
      ...options,
    });
  },

  confirm(params: MessageBoxOptions | string): void {
    const options = typeof params === 'string' ? { message: params } : params;
    createMessageBox({
      type: 'confirm',
      ...options,
    });
  },

  destroy(): void {
    if (messageBoxInstance) {
      messageBoxInstance.unmount();
      messageBoxInstance = null;
    }
  },
};

// 플러그인 설치 함수
export const install = (app: App, options: MessageBoxPluginOptions = {}): void => {
  // 플러그인 옵션 업데이트
  pluginOptions = {
    ...pluginOptions,
    ...options,
  };

  // 전역 속성으로 등록
  app.config.globalProperties.$messageBox = messageBox;

  // provide/inject를 위한 provide
  app.provide('messageBox', messageBox);
};

// 타입 선언을 위한 모듈 확장
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $messageBox: MessageBoxModel;
  }
}

export default {
  install,
};

export { messageBox, messageBoxTransition };
export type { MessageBoxModel, MessageBoxOptions, MessageBoxPluginOptions };
