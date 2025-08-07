import { useCallback, useEffect, useState } from 'react';
import type { UseValidationProps, UseValidationReturn } from './types';

export const useValidation = <T = unknown>({
  validate,
  errorMessage = '',
  disabled = false,
  value,
  onValidationChange,
}: UseValidationProps<T>): UseValidationReturn<T> => {
  const [message, setMessage] = useState<string>('');
  const [errorTransition, setErrorTransition] = useState<boolean>(false);

  const check = useCallback(
    (valueToCheck: T, silence: boolean = false): boolean => {
      // disabled 상태인 경우 유효성 검사 무시
      if (disabled) {
        return true;
      }

      if (errorMessage) {
        if (!silence) {
          setMessage(errorMessage);
          setErrorTransition(true);
          onValidationChange?.(false, errorMessage);
        }

        return false;
      }

      if (!validate.length) {
        if (!silence) {
          setMessage('');
          setErrorTransition(false);
          onValidationChange?.(true, '');
        }

        return true;
      }

      for (let i: number = 0; i < validate.length; i++) {
        const result: string | boolean = validate[i](
          valueToCheck as string | string[] | number | number[],
        );

        console.log('check result', result);

        if (typeof result === 'string') {
          if (!silence) {
            setMessage(result);
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
    [disabled, errorMessage, validate, onValidationChange],
  );

  const validateValue = useCallback(
    async (valueToValidate: T): Promise<boolean> => {
      return new Promise(resolve => {
        const result = check(valueToValidate, true);
        resolve(result);
      });
    },
    [check],
  );

  const resetValidate = useCallback((): void => {
    setMessage('');
    setErrorTransition(false);
    onValidationChange?.(true, '');
  }, [onValidationChange]);

  // value가 변경될 때 자동으로 유효성 검사 실행
  useEffect(() => {
    if (value !== undefined) {
      check(value, true);
    }
  }, [value, check]);

  return {
    message,
    errorTransition,
    check,
    resetValidate,
    setMessage,
    setErrorTransition,
    validateValue,
  };
};

export const useAsyncState = async <T>({
  v,
  setState,
}: {
  v: T;
  setState: (v: T) => void;
}): Promise<T> => {
  return new Promise(resolve => {
    setState(v);
    resolve(v);
  });
};
