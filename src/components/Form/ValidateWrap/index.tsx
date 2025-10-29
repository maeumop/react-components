import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { VFContext } from '../ValidateForm/context';
import { useValidation } from '../hooks';
import type { ValidateWrapProps, ValidateWrapRef } from './types';
import type { ValidateFormContext } from '../ValidateForm/types';
import './style.scss';
import { ErrorMessage } from '../ErrorMessage';

const ValidateWrapBase = forwardRef<ValidateWrapRef, ValidateWrapProps>(
  (
    {
      checkValue,
      validate = [],
      errorMessage = '',
      label,
      required = false,
      disabled = false,
      addOn,
      className,
      children,
      resetValue,
    },
    ref,
  ) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const { message, errorTransition, check, resetValidate, setMessage, setErrorTransition } =
      useValidation<string | string[] | number | number[]>({
        validate,
        errorMessage,
        disabled,
        value: checkValue,
      });

    const transitionEnd = useCallback((): void => {
      setErrorTransition(false);
    }, [setErrorTransition]);

    const resetForm = useCallback((): void => {
      setMessage('');
      setErrorTransition(false);
      resetValue?.();
    }, [setMessage, setErrorTransition]);

    const childBlur = useCallback((): void => {
      check();
    }, [check]);

    // errorMessage prop 변경 감지
    useEffect(() => {
      if (errorMessage) {
        setErrorTransition(true);
      }

      setMessage(errorMessage);
    }, [errorMessage, setMessage, setErrorTransition]);

    // errorTransition 타이머
    useEffect(() => {
      if (errorTransition) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, [errorTransition]);

    // className 메모이제이션
    const wrapClassName = useMemo(() => `validate-wrap ${className || ''}`, [className]);
    const inputWrapClassName = useMemo(
      () => `input-wrap ${errorTransition ? 'error' : ''}`,
      [errorTransition],
    );

    // children에 전달할 props 메모이제이션
    const childProps = useMemo(() => ({ onBlur: childBlur }), [childBlur]);

    // componentRef를 최신 함수로 업데이트 (ValidateForm에서 사용)
    const motherRef = useRef<HTMLDivElement>(null);
    const vfContext = useContext<ValidateFormContext | null>(VFContext);
    const componentRef = useRef({
      check,
      resetForm,
      resetValidate,
    });

    // ValidateForm에 컴포넌트 등록
    useEffect(() => {
      if (vfContext) {
        vfContext.addComponent(componentRef.current, motherRef.current);

        return () => {
          vfContext.removeComponent(componentRef.current);
        };
      }
    }, []);

    // useImperativeHandle로 ref 노출
    useImperativeHandle(
      ref,
      () => ({
        check,
        resetForm,
        resetValidate,
      }),
      [check, resetForm, resetValidate],
    );

    return (
      <div className={wrapClassName} ref={motherRef}>
        {label && (
          <div className="options-wrap">
            <label className="input-label">
              {label}
              {required && <span className="required">*</span>}
            </label>
            {addOn && <div className="add-option">{addOn}</div>}
          </div>
        )}

        <div className={inputWrapClassName}>{children(childProps)}</div>

        {message && (
          <ErrorMessage
            message={message}
            errorTransition={errorTransition}
            onAnimationEnd={transitionEnd}
          />
        )}
      </div>
    );
  },
);

ValidateWrapBase.displayName = 'ValidateWrap';

// React.memo 비교 함수 - props가 실제로 변경되었을 때만 리렌더링
export default React.memo(ValidateWrapBase, (prevProps, nextProps) => {
  // checkValue가 변경되면 리렌더링 필요
  if (prevProps.checkValue !== nextProps.checkValue) {
    return false;
  }

  // errorMessage가 변경되면 리렌더링 필요
  if (prevProps.errorMessage !== nextProps.errorMessage) {
    return false;
  }

  // label, required, disabled, className이 변경되면 리렌더링 필요
  if (
    prevProps.label !== nextProps.label ||
    prevProps.required !== nextProps.required ||
    prevProps.disabled !== nextProps.disabled ||
    prevProps.className !== nextProps.className
  ) {
    return false;
  }

  // validate 배열의 참조가 변경되면 리렌더링 필요
  if (prevProps.validate !== nextProps.validate) {
    return false;
  }

  // children 함수는 비교하지 않음 (항상 같다고 가정)
  // addOn은 변경 가능성이 낮으므로 참조 비교
  if (prevProps.addOn !== nextProps.addOn) {
    return false;
  }

  // 모든 조건을 통과하면 리렌더링 하지 않음
  return true;
});
