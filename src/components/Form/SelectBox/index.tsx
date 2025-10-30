import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { OptionList } from './optionList';
import type { SelectBoxModel, SelectBoxProps } from './types';
import {
  CancelRounded as CloseIcon,
  KeyboardArrowDown as ChevronDownIcon,
} from '@mui/icons-material';
import { useSelectBox } from './hook';
import { RenderSelectedText } from './renderLabelText';
import './style.scss';
import { AnimatePresence, motion, type TargetAndTransition } from 'framer-motion';
import { useComponentHelper } from '../../helper';
import type { LayerPositionType } from '../../types';
import { transitionType } from '../../const';
import { useAppendFormComponent } from '../hooks';

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
      onClickClear,
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

    useAppendFormComponent({
      check,
      resetForm,
      resetValidate,
      motherRef: mainRef as React.RefObject<HTMLDivElement>,
    });

    // expose 메서드
    useImperativeHandle(
      ref,
      () => ({
        check,
        resetForm,
        resetValidate,
      }),
      [check, resetForm, resetValidate, selectedValue],
    );

    return (
      <div
        ref={mainRef}
        tabIndex={0}
        style={containerStyle}
        className={containerClassName}
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
        <div ref={selectBoxRef} className={controllerClassName} onClick={toggleOption}>
          {/* 선택 텍스트/태그 */}
          <RenderSelectedText {...selectedTextProps} />

          {/* 클리어 버튼 */}
          {clearButtonShow && (
            <CloseIcon sx={{ fontSize: 20 }} className="clear-value" onClick={onClickClear} />
          )}

          {/* 화살표 아이콘 */}
          <ChevronDownIcon className={iconClassName} sx={{ fontSize: 20 }} />

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
