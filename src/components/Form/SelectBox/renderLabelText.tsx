import React from 'react';
import { Close as CloseIcon } from '@mui/icons-material';
import type { RenderSelectedTextProps } from './types';

// 선택된 텍스트 렌더링 (복잡한 JSX 분리)
const RenderSelectedText = React.memo<RenderSelectedTextProps>(
  ({ multiple, getShowText, labelText, isShort, inLabel, label, placeholder, removeSelected }) => {
    // inLabel이 있는 경우의 레이블
    const labelPrefix = inLabel ? <span className="label">{label}: </span> : null;

    // multiple 모드
    if (multiple) {
      if (getShowText.length === 0) {
        // 선택 없음
        return (
          <div className="text ph">
            {labelPrefix}
            {placeholder}
          </div>
        );
      }

      // 선택된 항목이 있음
      return (
        <div className="text">
          {labelText ? (
            // 태그 형태로 표시
            isShort ? (
              <div>
                <span>{getShowText[0]}</span>
                {getShowText.length > 1 && ` + ${getShowText.length - 1}`}
              </div>
            ) : (
              getShowText.map((txt, i) => (
                <span className="item" key={i}>
                  {txt}
                  <CloseIcon
                    className="remove-icon"
                    sx={{ width: 13, height: 13 }}
                    onClick={e => removeSelected(i, e)}
                  />
                </span>
              ))
            )
          ) : (
            // 텍스트 형태로 표시
            <>
              {labelPrefix}
              {isShort
                ? `${getShowText[0]}${getShowText.length > 1 ? ` + ${getShowText.length - 1}` : ''}`
                : getShowText.join(', ')}
            </>
          )}
        </div>
      );
    }

    // single 모드
    if (getShowText.length > 0) {
      return (
        <div className="text">
          {labelPrefix}
          {getShowText[0]}
        </div>
      );
    }

    // placeholder
    return (
      <div className="text ph">
        {labelPrefix}
        {placeholder}
      </div>
    );
  },
);

RenderSelectedText.displayName = 'RenderSelectedText';

export { RenderSelectedText };
