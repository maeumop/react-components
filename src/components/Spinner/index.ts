import type { App, VNode } from 'vue';
import { h, isVNode, ref, render } from 'vue';
import SpinnerComponent from './component.vue';
import { spinnerDefaultOptions } from './const';
import type { SpinnerColor, SpinnerExpose, SpinnerModel, SpinnerOptions } from './types';

// 전역 Spinner 인스턴스 관리
let globalSpinner: Spinner | null = null;

// useSpinner 컴포지션 함수
export function useSpinner() {
  const isLoading = ref(false);

  // 전역 Spinner 인스턴스 가져오기
  const getSpinner = (): Spinner => {
    globalSpinner ??= new Spinner();
    return globalSpinner;
  };

  const show = (text?: string, options?: SpinnerOptions) => {
    const spinner = getSpinner();

    if (options?.color) {
      spinner.setColor(options.color);
    }

    if (options?.limitTime) {
      spinner.timeout(options.limitTime);
    }

    spinner.show(text ?? '');
    isLoading.value = true;
  };

  const hide = () => {
    if (globalSpinner) {
      globalSpinner.hide();
      isLoading.value = false;
    }
  };

  return {
    show,
    hide,
    isLoading,
  };
}

export class Spinner implements SpinnerModel {
  private body: HTMLBodyElement;
  private vNode: VNode | null = null;
  private limitTime: number;
  private color: SpinnerColor;

  constructor(options: SpinnerOptions = {}) {
    const { limitTime = spinnerDefaultOptions.limitTime, color = spinnerDefaultOptions.color } =
      options;

    this.limitTime = limitTime;
    this.color = color;
    this.body = document.querySelector('body') as HTMLBodyElement;

    if (!this.body) {
      throw new Error('Body element not found');
    }
  }

  private createNode(): void {
    if (!isVNode(this.vNode)) {
      this.vNode = h(SpinnerComponent, {
        limitTime: this.limitTime,
        color: this.color,
        destroy: this.destroy.bind(this),
      });

      render(this.vNode, this.body);
    }
  }

  private getExposed(): SpinnerExpose | null {
    return (this.vNode?.component?.exposed as SpinnerExpose) || null;
  }

  /**
   * 스피너 최대 표시 시간을 설정
   * @param limit 최대 표시 시간 (초)
   * @returns 메서드 체이닝을 위한 this
   */
  public timeout(limit: number): this {
    if (limit <= 0) {
      throw new Error('Limit time must be greater than 0');
    }

    this.createNode();
    this.limitTime = limit;

    if (this.vNode?.component) {
      this.vNode.component.props.limitTime = limit;
    }

    return this;
  }

  /**
   * 메서드 실행 지연 시간 설정
   * @param sec 지연 시간 (초)
   * @returns 메서드 체이닝을 위한 this
   */
  public delay(sec: number): this {
    if (sec < 0) {
      throw new Error('Delay time must be non-negative');
    }

    this.createNode();

    const exposed = this.getExposed();
    if (exposed) {
      exposed.delay.value = sec;
    }

    return this;
  }

  /**
   * 스피너 색상 설정
   * @param color 색상
   * @returns 메서드 체이닝을 위한 this
   */
  public setColor(color: SpinnerColor): this {
    this.createNode();
    this.color = color;

    const exposed = this.getExposed();
    if (exposed) {
      exposed.setColor(color);
    }

    return this;
  }

  /**
   * 스피너를 표시
   * @param msg 표시할 메시지
   */
  public show(msg: string = ''): void {
    this.createNode();

    const exposed = this.getExposed();
    if (exposed) {
      exposed.show(msg);
    }
  }

  /**
   * 스피너를 숨김 (점진적으로)
   */
  public hide(): void {
    const exposed = this.getExposed();
    if (exposed) {
      exposed.hide();
    }
  }

  /**
   * 스피너를 즉시 닫음
   */
  public close(): void {
    const exposed = this.getExposed();
    if (exposed) {
      exposed.close();
    }
  }

  /**
   * 컴포넌트 정리
   */
  private destroy(): void {
    if (this.vNode) {
      render(null, this.body);
      this.vNode = null;
    }
  }
}

// Vue 플러그인으로 등록
export default {
  install: (app: App, options: SpinnerOptions = {}): void => {
    const { limitTime = spinnerDefaultOptions.limitTime, color = spinnerDefaultOptions.color } =
      options;

    // 전역 Spinner 인스턴스 생성
    globalSpinner = new Spinner({ limitTime, color });

    app.provide('Spinner', globalSpinner);

    // 전역 속성으로도 등록 (선택사항)
    app.config.globalProperties.$spinner = globalSpinner;
  },
};

// 타입 선언
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $spinner: Spinner;
  }
}
