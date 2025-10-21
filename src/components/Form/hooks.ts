import React, { useCallback, useMemo, useState } from 'react';
import type { UseValidationProps, UseValidationReturn } from './types';

export const useValidation = <T = unknown>({
  validate,
  errorMessage = '',
  disabled = false,
  value,
  onValidationChange,
}: UseValidationProps<T>): UseValidationReturn => {
  const [message, setMessage] = useState<string>('');
  const [errorTransition, setErrorTransition] = useState<boolean>(false);

  const check = useCallback(
    (silence: boolean = false): boolean => {
      // disabled 상태인 경우 유효성 검사 무시
      if (disabled) return true;

      if (errorMessage) {
        if (!silence) {
          setMessage(() => errorMessage);
          setErrorTransition(() => true);
          onValidationChange?.(false, errorMessage);
        }

        return false;
      }

      if (!validate?.length) {
        if (!silence) {
          setMessage(() => '');
          setErrorTransition(() => false);
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
            setErrorTransition(() => true);
            onValidationChange?.(false, result);
          }

          return false;
        }
      }

      if (!silence) {
        setMessage(() => '');
        setErrorTransition(() => false);
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
    setMessage(() => '');
    setErrorTransition(() => false);
    onValidationChange?.(true, '');
  }, [onValidationChange]);

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
