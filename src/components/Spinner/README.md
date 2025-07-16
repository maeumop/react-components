# Spinner 컴포넌트 (React)

React + TypeScript로 구현된 로딩 스피너 컴포넌트입니다. 다양한 테마, 커스터마이즈 옵션, 전역 Provider 패턴, useSpinner 훅을 제공합니다.

## 주요 기능

- 🎨 다양한 테마: default, primary, secondary, success, warning, error, info
- ⚡ 타입 안전성: TypeScript 기반
- 🌀 전역 Provider 패턴 및 useSpinner 훅 지원
- 📱 반응형 디자인
- 🎬 트랜지션/애니메이션: CSSTransition 기반
- 🛠️ 커스터마이즈/확장성

## 설치 및 사용법

### 1. Provider로 감싸기

```tsx
import { SpinnerProvider } from '@/components/Spinner';

function App() {
  return <SpinnerProvider>{/* ... */}</SpinnerProvider>;
}
```

### 2. useSpinner 훅 사용

```tsx
import { useSpinner } from '@/components/Spinner';

const { show, hide, isLoading } = useSpinner();

// 스피너 표시
show('로딩 중...', { color: 'primary', limitTime: 5 });

// 스피너 숨기기
hide();
```

### 3. 예제

```tsx
import React from 'react';
import { SpinnerProvider, useSpinner } from '@/components/Spinner';

const Example = () => {
  const { show, hide } = useSpinner();
  return (
    <>
      <button onClick={() => show('데이터 처리 중...', { color: 'success' })}>스피너 표시</button>
      <button onClick={hide}>스피너 숨기기</button>
    </>
  );
};

export default function App() {
  return (
    <SpinnerProvider>
      <Example />
    </SpinnerProvider>
  );
}
```

## API

### useSpinner()

| 반환값    | 설명                                             |
| --------- | ------------------------------------------------ |
| show      | (msg?: string, options?: SpinnerOptions) => void |
| hide      | () => void                                       |
| isLoading | boolean (현재 스피너 표시 여부)                  |

#### SpinnerOptions

| 옵션      | 타입         | 기본값  | 설명               |
| --------- | ------------ | ------- | ------------------ |
| color     | SpinnerColor | default | 테마 색상          |
| limitTime | number (초)  | 10      | 최대 표시 시간(초) |

#### SpinnerColor

- 'default', 'primary', 'secondary', 'success', 'warning', 'error', 'info'

## 스타일 커스터마이즈

- style.scss에서 .spinner-container, .spinner-icon, .spinner-text 등 클래스와 테마별 색상, 트랜지션을 커스터마이즈할 수 있습니다.
- 트랜지션은 CSSTransition의 classNames(spinner-fade, spinner-scale)로 제어합니다.

## 트러블슈팅

- 반드시 SpinnerProvider로 감싸야 useSpinner 훅이 동작합니다.
- 여러 SpinnerProvider를 중첩하면 가장 가까운 Provider가 적용됩니다.

## 라이선스

MIT License
