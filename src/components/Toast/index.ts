import type { App, VNode } from 'vue';
import { h, isVNode, render } from 'vue';
import ToastComponent from './component.vue';
import { toastColor, toastIcon } from './const';
import type { MessageOptions, ToastModel, ToastOptions } from './types';

export default {
  install: (app: App, options?: ToastOptions) => {
    let vNode: VNode | null = null;
    const body = document.querySelector('body') as HTMLBodyElement;
    const wrapper: HTMLDivElement = document.createElement('div');
    wrapper.id = 'toast';

    body.appendChild(wrapper);

    const props: ToastOptions = {
      maxShowMessage: 4,
      delay: 3000,
      destroy: (): void => {
        if (vNode?.component?.exposed) {
          vNode.component.exposed.clear();
        }
        render(null, wrapper);
        vNode = null;
        if (wrapper.parentNode) {
          wrapper.parentNode.removeChild(wrapper);
        }
      },
    };

    const init = () => {
      if (!isVNode(vNode)) {
        const toastBase = document.querySelector('#toast') as HTMLDivElement;
        if (!toastBase) {
          console.error('Toast wrapper not found');
          return;
        }

        vNode = h(ToastComponent, props);
        render(vNode, toastBase);
      }
    };

    if (options) {
      if ('maxShowMessage' in options) {
        props.maxShowMessage = options.maxShowMessage;
      }

      if ('delay' in options) {
        props.delay = options.delay;
      }
    }

    const setMessage = (opt: MessageOptions | string): void => {
      try {
        init();

        if (vNode?.component?.exposed) {
          const { exposed } = vNode.component;

          if (typeof opt === 'string') {
            // 문자열인 경우 기본 success로 설정
            exposed.setMessage(opt, toastColor.success, toastIcon.success);
          } else if (opt && typeof opt === 'object') {
            // 객체인 경우
            if (!opt.message) {
              console.error('Toast message is required');
              return;
            }

            const color = opt.color ?? toastColor.success;
            const icon = opt.icon ?? toastIcon[color];

            exposed.setMessage(opt.message, color, icon);
          } else {
            console.error('Invalid toast options');
            return;
          }

          exposed.show();
        }
      } catch (error) {
        console.error('Toast error:', error);
      }
    };

    const objectToast: ToastModel = (params: MessageOptions | string): void => {
      setMessage(params);
    };

    // 전역 속성으로 등록
    app.config.globalProperties.$toast = objectToast;

    // provide/inject를 위한 provide
    app.provide('toast', objectToast);
  },
};
