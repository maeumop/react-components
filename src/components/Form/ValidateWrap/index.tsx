import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { VFContext } from '../ValidateForm/context';
import type { ValidateWrapProps, ValidateWrapRef } from './types';
import type { ValidateFormContext } from '../ValidateForm/types';
import './style.scss';
import React from 'react';

const ValidateWrapBase = forwardRef<ValidateWrapRef, ValidateWrapProps>(
  (
    {
      checkValue,
      validate = [],
      errorMessage = '',
      label,
      required = false,
      disabled = false,
      children,
      addOn,
    },
    ref,
  ) => {
    const [isValidate, setIsValidate] = useState<boolean>(true);
    const [message, setMessage] = useState<string>('');
    const [errorTransition, setErrorTransition] = useState<boolean>(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const elementRef = useRef<HTMLDivElement>(null);
    const vfContext = useContext<ValidateFormContext | null>(VFContext);

    // checkValue 변경 감지
    useEffect(() => {
      resetForm();
    }, [checkValue]);

    // errorMessage prop 변경 감지
    useEffect(() => {
      setMessage(errorMessage);
    }, [errorMessage]);

    // errorTransition 타이머
    useEffect(() => {
      if (errorTransition) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          setErrorTransition(false);
        }, 300);
      }

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, [errorTransition]);

    const check = (silence: boolean = false): boolean => {
      if (disabled) {
        return true;
      }

      // errorMessage가 설정되어 있으면 해당 메시지 사용
      if (errorMessage) {
        if (!silence) {
          setMessage(errorMessage);
          setErrorTransition(true);
          setIsValidate(false);
        }
        return false;
      }

      // validate 함수들 실행
      if (validate.length) {
        for (const validateFunc of validate) {
          const result = validateFunc(checkValue);

          if (typeof result === 'string') {
            if (!silence) {
              setMessage(result);
              setErrorTransition(true);
              setIsValidate(false);
            }

            return false;
          }
        }
      }

      // 모든 검증 통과
      setMessage('');
      setErrorTransition(false);
      setIsValidate(true);
      return true;
    };

    const resetForm = (): void => {
      setIsValidate(true);
      setMessage('');
      setErrorTransition(false);
    };

    const resetValidate = (): void => {
      resetForm();
    };

    const childBlur = (): void => {
      check();
    };

    const componentRef = useRef({
      check,
      resetForm,
      resetValidate,
    });

    // componentRef를 최신 함수로 업데이트
    useEffect(() => {
      componentRef.current = {
        check,
        resetForm,
        resetValidate,
      };
    });

    // ValidateForm에 컴포넌트 등록
    useEffect(() => {
      if (vfContext) {
        vfContext.addComponent(componentRef.current, elementRef.current);

        return () => {
          vfContext.removeComponent(componentRef.current);
        };
      }
    }, [vfContext]);

    useImperativeHandle(ref, () => ({
      check,
      resetForm,
      resetValidate,
    }));

    return (
      <div className="validate-wrap" ref={elementRef}>
        {label && (
          <div className="options-wrap">
            <label className="input-label">
              {label}
              {required && <span className="required">*</span>}
            </label>
            {addOn && <div className="add-option">{addOn}</div>}
          </div>
        )}

        <div className={`input-wrap ${errorTransition ? 'error' : ''}`}>
          {children({ onBlur: childBlur })}
        </div>

        <div className={`feedback ${errorTransition ? 'error' : ''}`}>{message}</div>
      </div>
    );
  },
);

ValidateWrapBase.displayName = 'ValidateWrap';

export const ValidateWrap = React.memo(ValidateWrapBase);
