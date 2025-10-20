import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { OptionList } from './optionList';
import type { SelectBoxModel, SelectBoxProps } from './types';
import { Close as CloseIcon, KeyboardArrowDown as ChevronDownIcon } from '@mui/icons-material';
import { useSelectBox } from './hook.ts';
import { RenderSelectedText } from './renderLabelText.tsx';
import './style.scss';
import { AnimatePresence, motion, type TargetAndTransition } from 'framer-motion';
import { useComponentHelper } from '@/components/helper.ts';
import type { LayerPositionType } from '@/components/types.ts';
import { transitionType } from '@/components/const.ts';

const SelectBox = React.memo(
  forwardRef<SelectBoxModel, SelectBoxProps>((props, ref) => {
    // props 분해
    const {
      label = '',
      inLabel = false,
      placeholder = '',
      multiple = false,
      required = false,
      isShort = false,
      labelText = false,
      hideMessage = false,
    } = props;

    const {
      optionListProps,
      containerStyle,
      containerClassName,
      mainRef,
      selectBoxRef,
      optionContainerRef,
      layerPositionStyle,
      clearValue,
      resetForm,
      check,
      resetValidate,
      setErrorTransition,
      message,
      selectedValue,
      getShowText,
      clearButtonShow,
      toggleOption,
      onEscapeKeyHandler,
      controllerClassName,
      removeSelected,
      iconClassName,
      isShowOption,
      feedbackStatus,
      position,
    } = useSelectBox(props);

    // expose 메서드
    useImperativeHandle(
      ref,
      () => ({
        check: (silence?: boolean) => {
          const result = check(selectedValue, silence);
          return typeof result === 'boolean' ? result : false;
        },
        resetForm,
        resetValidate,
      }),
      [check, resetForm, resetValidate, selectedValue],
    );

    // 인라인 콜백 메모이제이션
    const handleTransitionExited = () => {};

    const handleErrorAnimationEnd = useCallback(() => {
      setErrorTransition(false);
    }, [setErrorTransition]);

    const selectedTextProps = useMemo(
      () => ({
        multiple,
        getShowText,
        labelText,
        isShort,
        inLabel,
        label,
        placeholder,
        removeSelected,
      }),
      [multiple, getShowText, labelText, isShort, inLabel, label, placeholder, removeSelected],
    );

    // componentHelper를 useRef로 안정화
    const componentHelperRef = useRef(useComponentHelper());

    // variants를 useMemo로 메모이제이션
    const variants = useMemo(
      () =>
        componentHelperRef.current.getTransitionVariant(
          transitionType.slide,
          position as LayerPositionType,
        ),
      [position],
    );

    return (
      <div
        ref={mainRef}
        tabIndex={0}
        style={containerStyle}
        className={containerClassName}
        onClick={toggleOption}
        onKeyDown={onEscapeKeyHandler}
      >
        {label && !inLabel && (
          <div className="options-wrap">
            <label className="input-label">
              {label}
              {required && <span className="required">*</span>}
            </label>
          </div>
        )}
        <div ref={selectBoxRef} className={controllerClassName}>
          {/* 선택 텍스트/태그 */}
          <RenderSelectedText {...selectedTextProps} />

          {/* 클리어 버튼 */}
          {clearButtonShow && (
            <a href="#" className="btn-clear" onClick={clearValue}>
              <CloseIcon sx={{ width: 20, height: 20 }} />
            </a>
          )}

          {/* 화살표 아이콘 */}
          <ChevronDownIcon className={iconClassName} sx={{ width: 20, height: 20 }} />

          {/* 옵션 레이어 */}
          <AnimatePresence onExitComplete={handleTransitionExited}>
            {isShowOption && (
              <motion.div
                style={layerPositionStyle}
                ref={optionContainerRef}
                initial={variants.initial as TargetAndTransition}
                animate={variants.animate as TargetAndTransition}
                exit={variants.exit as TargetAndTransition}
                transition={variants.transition}
              >
                <OptionList {...optionListProps} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 에러 메시지 */}
        {message && !hideMessage && (
          <div className={feedbackStatus} onAnimationEnd={handleErrorAnimationEnd}>
            {message}
          </div>
        )}
      </div>
    );
  }),
);

SelectBox.displayName = 'SelectBox';

export default SelectBox;
