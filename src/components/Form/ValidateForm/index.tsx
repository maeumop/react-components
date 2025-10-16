import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { VFContext } from './context';
import { validateExplorKey } from './const';
import type { ValidatableComponent, ValidateExplorKey, ValidateFormRef } from './types';
import './style.scss';

interface ValidateFormProps {
  children: React.ReactNode;
}

interface ComponentEntry {
  ref: ValidatableComponent;
  element: HTMLElement | null;
}

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
      explore(validateExplorKey.resetForm);
    }
  };

  /**
   * 폼에 등록된 모든 컴포넌트 유효성 검사 초기화
   */
  const resetValidate = (): void => {
    if (formRef.current) {
      explore(validateExplorKey.resetValidate);
    }
  };

  /**
   * 컴포넌트 인스턴스에서 제공하는 함수 호출
   *
   * @param componentRef 컴포넌트 참조
   * @param flag 플래그
   */
  const validateCheck = (componentRef: ValidatableComponent, flag: ValidateExplorKey): void => {
    const { resetForm, resetValidate } = componentRef ?? {};

    switch (flag) {
      case validateExplorKey.resetForm:
        if (typeof resetForm === 'function') {
          resetForm();

          if (typeof resetValidate === 'function') {
            resetValidate();
          }
        }

        break;
      case validateExplorKey.resetValidate:
        if (typeof resetValidate === 'function') {
          resetValidate();
        }
    }
  };

  const explore = (flag: ValidateExplorKey): void => {
    for (const entry of formValidItemsRef.current) {
      validateCheck(entry.ref, flag);
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
