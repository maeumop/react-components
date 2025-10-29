import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { UseAppendFormComponentProps, UseValidationProps, UseValidationReturn } from './types';
import { VFContext } from './ValidateForm/context';

export const useValidation = <T = unknown>({
  validate,
  errorMessage = '',
  disabled = false,
  value,
  onValidationChange,
  onMounted,
}: UseValidationProps<T>): UseValidationReturn => {
  const [message, setMessage] = useState<string>('');
  const [errorTransition, setErrorTransition] = useState<boolean>(false);

  // errorMessage 변경시 check를 무한 반복하는 현상을 해결하기 위해 prevErrorMessage 추가
  const prevErrorMessage = useRef<string>(errorMessage);

  const check = useCallback(
    (silence: boolean = false): boolean => {
      // disabled 상태인 경우 유효성 검사 무시
      if (disabled) return true;

      if (errorMessage) {
        if (!silence) {
          setMessage(() => errorMessage);

          if (errorMessage !== prevErrorMessage.current) {
            setErrorTransition(true);
            prevErrorMessage.current = errorMessage;
          }

          onValidationChange?.(false, errorMessage);
        }

        return false;
      }

      prevErrorMessage.current = '';

      if (!validate?.length) {
        if (!silence) {
          setMessage('');
          setErrorTransition(false);
          onValidationChange?.(true, '');
        }

        return true;
      }

      for (let i: number = 0; i < validate.length; i++) {
        const result: string | boolean = validate[i](
          value as string | string[] | number | number[],
        );

        if (typeof result === 'string') {
          if (!silence) {
            setMessage(() => result);
            setErrorTransition(true);
            onValidationChange?.(false, result);
          }

          return false;
        }
      }

      if (!silence) {
        setMessage('');
        setErrorTransition(false);
        onValidationChange?.(true, '');
      }

      return true;
    },
    [disabled, errorMessage, validate, value, onValidationChange],
  );

  const validateValue = useCallback(async (): Promise<boolean> => {
    return new Promise(resolve => {
      const result = check(true);
      resolve(result);
    });
  }, [check]);

  const resetValidate = useCallback((): void => {
    setMessage('');
    setErrorTransition(false);
    onValidationChange?.(true, '');
  }, [onValidationChange]);

  // errorMessage 변경 시 오류 메시지 처리
  useEffect(() => {
    if (errorMessage) {
      setErrorTransition(true);
    }

    setMessage(() => errorMessage);
  }, [errorMessage]);

  // component mounted 처리
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) return;

    isMounted.current = true;

    onMounted?.();
  }, []);

  return {
    isMounted: isMounted.current,
    message,
    errorTransition,
    check,
    resetValidate,
    setMessage,
    setErrorTransition,
    validateValue,
  };
};

/**
 * ValidateForm과 컴포넌트 연계를 위한 hook
 * @param {UseAppendFormComponentProps} { check, resetForm, resetValidate }
 * @returns { { motherRef: React.RefObject<HTMLDivElement> } }
 */
export const useAppendFormComponent = ({
  check,
  resetForm,
  resetValidate,
  motherRef,
}: UseAppendFormComponentProps) => {
  const vfContext = useContext(VFContext);
  const tagRef = motherRef ?? useRef<HTMLDivElement>(null);
  const componentRef = useRef<UseAppendFormComponentProps>({
    check,
    resetForm,
    resetValidate,
  });

  // check, resetForm, resetValidate가 변경될 때마다 ref 업데이트
  useEffect(() => {
    componentRef.current = {
      check,
      resetForm,
      resetValidate,
    };
  }, [check, resetForm, resetValidate]);

  useEffect(() => {
    if (vfContext) {
      vfContext.addComponent(componentRef.current, tagRef.current);

      return () => {
        vfContext.removeComponent(componentRef.current);
      };
    }
  }, [vfContext]);

  return {
    motherRef: tagRef,
  };
};
