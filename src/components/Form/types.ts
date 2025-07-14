import { ComponentInternalInstance, VNode } from 'vue';

// VNode 타입을 확장하여 name 프로퍼티 포함
export interface VNodeWithName extends VNode {
  type: ComponentWithName | string;
}

export interface ComponentWithName {
  name?: string;
  [key: string]: unknown;
}

// getCurrentInstance의 반환 타입을 확장
export interface ExtendedComponentInstance extends ComponentInternalInstance {
  vnode: VNodeWithName;
}
