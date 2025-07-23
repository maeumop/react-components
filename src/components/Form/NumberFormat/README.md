# NumberFormat 컴포넌트 (React)

숫자 입력 필드에 천단위 콤마(,)를 자동으로 포맷팅하는 React + TypeScript 컴포넌트입니다.

## 주요 기능

- **자동 천단위 콤마 포맷팅**: 입력 시 실시간으로 천단위 콤마 추가
- **음수 지원**: 음수 입력 및 표시 지원
- **유효성 검사**: 커스텀 유효성 검사 함수 지원
- **접근성**: 라벨, 필수 표시, 키보드 네비게이션 지원
- **상태 관리**: disabled, readonly 상태 지원
- **에러 메시지 트랜지션**: 에러 메시지 표시 시 애니메이션 효과
- **React.memo 지원**: 불필요한 리렌더링 방지

## 사용 방법

### 기본 사용법

```tsx
import React, { useState } from 'react';
import NumberFormat from './index';

const [price, setPrice] = useState<number>(0);

<NumberFormat value={price} onChange={setPrice} placeholder="가격 입력" />;
```

### 라벨과 필수 표시

```tsx
<NumberFormat
  value={price}
  onChange={setPrice}
  label="가격"
  placeholder="가격을 입력하세요"
  required
  block
/>
```

### 유효성 검사

```tsx
const validateRequired = (value: unknown): string | boolean => {
  if (typeof value !== 'number' || value === 0) {
    return '필수 입력 항목입니다.';
  }
  return true;
};

const validateRange = (value: unknown): string | boolean => {
  if (Number(value) < 1000 || Number(value) > 1000000) {
    return '1,000 ~ 1,000,000 사이의 값을 입력해주세요.';
  }
  return true;
};

<NumberFormat
  value={amount}
  onChange={setAmount}
  validate={[validateRequired, validateRange]}
  placeholder="1,000 ~ 1,000,000"
  required
  block
/>;
```

## Props

| Name         | Type                                            | Default | Description                    |
| ------------ | ----------------------------------------------- | ------- | ------------------------------ |
| value        | number \| string                                | 0       | **필수** - 컴포넌트의 값       |
| onChange     | (value: number) => void                         | -       | 값 변경 핸들러                 |
| onBlur       | (e: React.FocusEvent<HTMLInputElement>) => void | -       | blur 이벤트 핸들러             |
| onFocus      | (e: React.FocusEvent<HTMLInputElement>) => void | -       | focus 이벤트 핸들러            |
| label        | string                                          | ''      | 입력 필드 위에 표시할 라벨     |
| placeholder  | string                                          | ''      | 입력 필드의 placeholder 텍스트 |
| validate     | RuleFunc[]                                      | []      | 유효성 검사 함수 배열          |
| errorMessage | string                                          | ''      | 강제로 표시할 에러 메시지      |
| disabled     | boolean                                         | false   | 입력 필드 비활성화             |
| block        | boolean                                         | false   | display: block으로 표시        |
| width        | string                                          | -       | 컴포넌트의 너비                |
| autofocus    | boolean                                         | false   | 페이지 로드 시 자동 포커스     |
| maxLength    | string \| number                                | -       | 최대 입력 길이                 |
| readonly     | boolean                                         | false   | 읽기 전용 모드                 |
| required     | boolean                                         | false   | 필수 입력 표시 (\*)            |
| hideMessage  | boolean                                         | false   | 에러 메시지 숨김               |

## Exposed Methods (ref)

| Name          | Parameters          | Return  | Description                 |
| ------------- | ------------------- | ------- | --------------------------- |
| check         | (silence?: boolean) | boolean | 유효성 검사 실행            |
| resetForm     | ()                  | void    | 폼 초기화 (값을 0으로 설정) |
| resetValidate | ()                  | void    | 유효성 검사 상태 초기화     |

## 스타일링

컴포넌트는 다음과 같은 CSS 클래스를 제공합니다:

- `.input-wrap`: 메인 컨테이너
- `.input-wrap.with-label`: 라벨이 있는 경우
- `.input-wrap.block`: block 표시 모드
- `.options-wrap`: 라벨과 추가 옵션을 감싸는 컨테이너
- `.input-label`: 라벨 스타일
- `.required`: 필수 표시 (\*) 스타일
- `input.error`: 에러 상태의 입력 필드
- `.feedback`: 에러 메시지 컨테이너
- `.feedback.error`: 에러 메시지 표시 상태

## 특징 및 최적화

- **자동 포맷팅**: 입력 시 실시간으로 천단위 콤마 추가, 음수 입력 지원, 빈 값일 때 0으로 자동 설정
- **포커스/블러 처리**: 포커스 시 값이 0이면 빈 값으로, 블러 시 빈 값이면 0으로 설정
- **유효성 검사**: 커스텀 유효성 검사 함수 지원, 에러 메시지 표시, 트랜지션 효과
- **접근성**: 라벨과 입력 필드 연결, 키보드 네비게이션 지원, 스크린 리더 호환
- **최적화**: React.memo로 export되어 불필요한 리렌더링 방지, 내부적으로 useCallback/useMemo를 적절히 사용하여 성능 최적화
- **함수/값의 참조 동일성**: props로 전달되는 함수(예: onChange, onBlur 등)는 useCallback으로 감싸면 자식 컴포넌트의 불필요한 리렌더링을 방지할 수 있습니다.
- **내부에서만 사용하는 함수는 useCallback이 필수는 아니며, props로 전달/의존성 배열에 들어가는 경우에만 사용하면 됩니다.**

## 예제

더 많은 사용 예제는 [ex.tsx](./ex.tsx)를 참조하세요.

## 주의사항

1. **숫자만 입력 가능**: 숫자와 하이픈(-)만 입력 가능
2. **소수점 미지원**: 현재 버전에서는 정수만 지원
3. **최대값 제한**: JavaScript Number 타입의 제한을 따름

## 변경 이력/주요 개선점

- React + TypeScript 함수형 컴포넌트로 완전 변환
- useCallback, useMemo, React.memo 등 최적화 패턴 적용
- props, expose 메서드, 스타일, 트랜지션 등 최신 코드 반영
- 내부적으로 getNumber, format 등 유틸 함수 분리 및 최적화
- 예제 및 문서 전체 한글화

:arrow_up: [Form Components 목차](../README.md)
