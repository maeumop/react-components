import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { VFContext } from './context';
import type {
  ComponentEntry,
  ValidatableComponent,
  ValidateFormProps,
  ValidateFormRef,
} from './types';
import './style.scss';

const ValidateFormBase = forwardRef<ValidateFormRef, ValidateFormProps>(({ children }, ref) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isCover, setIsCover] = useState<boolean>(false);
  const formValidItemsRef = useRef<ComponentEntry[]>([]);

  /**
   * addComponent 함수를 통해 컴포넌트 인스턴스 추가 된 컴포넌트 유효성 검사
   *
   * @param silence 에러 메세지 무시 여부
   */
  const validate = (silence: boolean = false): boolean => {
    let isValid = true;
    let moveElement: HTMLElement | null = null;

    for (const entry of formValidItemsRef.current) {
      const { ref: componentRef, element } = entry;

      if (typeof componentRef.check === 'function') {
        const result = componentRef.check(silence);

        if (!result && element && moveElement === null) {
          moveElement = element;
          isValid = false;
        }
      }
    }

    if (!isValid && moveElement) {
      targetFirstEl(moveElement);
    }

    return isValid;
  };

  // 첫 번째 에러 요소로 스크롤
  const targetFirstEl = (element: HTMLElement): void => {
    if (formRef.current && element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  /**
   * 폼에 등록된 모든 컴포넌트 값을 리셋 및 유효성 검사 초기화
   */
  const resetForm = (): void => {
    if (formRef.current) {
      for (const entry of formValidItemsRef.current) {
        const { ref: componentRef } = entry;

        if (typeof componentRef.resetForm === 'function') {
          componentRef.resetForm();
        }
      }
    }
  };

  /**
   * 폼에 등록된 모든 컴포넌트 유효성 검사 초기화
   */
  const resetValidate = (): void => {
    if (formRef.current) {
      for (const entry of formValidItemsRef.current) {
        const { ref: componentRef } = entry;

        if (typeof componentRef.resetValidate === 'function') {
          componentRef.resetValidate();
        }
      }
    }
  };

  /**
   * 컴포넌트 인스턴스 추가
   *
   * @param componentRef 컴포넌트 참조
   * @param element DOM 엘리먼트
   */
  const addComponent = (componentRef: ValidatableComponent, element: HTMLElement | null): void => {
    if (formRef.current) {
      formValidItemsRef.current.push({ ref: componentRef, element });
    }
  };

  /**
   * 컴포넌트 인스턴스 제거
   *
   * @param componentRef 컴포넌트 참조
   */
  const removeComponent = (componentRef: ValidatableComponent): void => {
    const index = formValidItemsRef.current.findIndex(entry => entry.ref === componentRef);
    if (index > -1) {
      formValidItemsRef.current.splice(index, 1);
    }
  };

  /**
   * 폼 보호 여부
   *
   * @param protect 폼 보호 여부
   */
  const formProtection = (protect: boolean = true): void => {
    setIsCover(protect);
  };

  useImperativeHandle(ref, () => ({
    formProtection,
    resetValidate,
    resetForm,
    validate,
  }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <VFContext.Provider value={{ addComponent, removeComponent }}>
      <form ref={formRef} className={isCover ? 'validate-form' : ''} onSubmit={handleSubmit}>
        {children}

        {isCover && <div className="form-cover"></div>}
      </form>
    </VFContext.Provider>
  );
});

ValidateFormBase.displayName = 'ValidateForm';

export const ValidateForm = React.memo(ValidateFormBase);
