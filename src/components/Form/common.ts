import { getCurrentInstance } from 'vue';
import { ComponentWithName, ExtendedComponentInstance } from './types';

// store 형식의 헬퍼 함수를 만들어 처리 하는 것이 좋을 듯 하다.

// 컴포넌트 타입 가드 함수
function isComponentWithName(type: unknown): type is ComponentWithName {
  return typeof type === 'object' && type !== null;
}

// 컴포넌트 이름을 안전하게 가져오는 함수
function getComponentName(instance: ExtendedComponentInstance | null): string | undefined {
  if (!instance?.vnode?.type) {
    return undefined;
  }

  const { type } = instance.vnode;

  // 문자열인 경우 (예: 'div', 'span' 등)
  if (typeof type === 'string') {
    return type;
  }

  // 컴포넌트 객체인 경우
  if (isComponentWithName(type)) {
    return type.name;
  }

  return undefined;
}

let validateForm: Record<string, unknown> | null = null;

export const useAddFormValidate = () => {
  const instance = getCurrentInstance() as ExtendedComponentInstance | null;

  if (!instance) {
    console.warn('useAddFormValidate: No current instance found');
    return;
  }

  // 컴포넌트 이름 안전하게 가져오기
  const componentName = getComponentName(instance);
  console.log('component', instance);

  if (instance && componentName === 'ValidateForm') {
    validateForm = instance.exposed;
    console.log('validate', instance.exposed, validateForm);
  }

  if (validateForm && instance.vnode) {
    console.log('instance.vnode', validateForm);
    if (typeof validateForm.addComponant === 'function') {
      validateForm.addComponant(instance.vnode);
    }
  }
};
