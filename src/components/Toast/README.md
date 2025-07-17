# Toast 컴포넌트 (React)

React + TypeScript로 구현된 알림(Toast) 컴포넌트입니다. 다양한 테마, 위치, 전역 Provider 패턴, useToast 훅, 부드러운 트랜지션 및 리스트 이동 애니메이션을 지원합니다.

## 주요 기능

- ✅ 다양한 테마: success, error, warning, info, primary, secondary
- ✅ 다양한 위치: top, bottom, top-right, top-left, bottom-right, bottom-left
- ✅ 타입 안전성: TypeScript 기반
- ✅ 전역 Provider 패턴 및 useToast 훅 지원
- ✅ 트랜지션/애니메이션: CSSTransition 기반, position별 진입/퇴장 방향
- ✅ 부드러운 리스트 이동(밀림) 애니메이션
- ✅ 커스터마이즈/확장성

## 설치 및 사용법

### 1. Provider로 감싸기

```tsx
import { ToastProvider } from '@/components/Toast';

function App() {
  return <ToastProvider>{/* ... */}</ToastProvider>;
}
```

### 2. useToast 훅 사용

```tsx
import { useToast } from '@/components/Toast';

const { toast } = useToast();

toast('저장되었습니다!', { color: 'success', position: 'top-right', duration: 2000 });
```

### 3. 예제

```tsx
import React from 'react';
import { ToastProvider, useToast } from '@/components/Toast';

const Example = () => {
  const { toast } = useToast();
  return (
    <>
      <button onClick={() => toast('성공!', { color: 'success' })}>성공 토스트</button>
      <button onClick={() => toast('에러!', { color: 'error' })}>에러 토스트</button>
      <button onClick={() => toast('경고!', { color: 'warning' })}>경고 토스트</button>
      <button onClick={() => toast('정보!', { color: 'info' })}>정보 토스트</button>
    </>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <Example />
    </ToastProvider>
  );
}
```

## API

### useToast()

| 반환값 | 설명                                              |
| ------ | ------------------------------------------------- |
| toast  | (message: string, options?: ToastOptions) => void |

#### ToastOptions

| 옵션     | 타입        | 기본값       | 설명          |
| -------- | ----------- | ------------ | ------------- |
| color    | string      | success      | 테마 색상     |
| duration | number (ms) | 3000         | 표시 시간(ms) |
| position | string      | bottom-right | 위치          |
| onClose  | () => void  |              | 닫힐 때 콜백  |

#### 지원 위치값

- 'top', 'bottom', 'top-right', 'top-left', 'bottom-right', 'bottom-left'

#### 지원 색상값

- 'primary', 'secondary', 'success', 'warning', 'info', 'error'

## 스타일 커스터마이즈

- style.scss에서 .toast, .toast-message, .toast-close, .toast-XXX 등 클래스와 위치, 트랜지션을 커스터마이즈할 수 있습니다.
- position별 진입/퇴장 방향 트랜지션(`toast-fade-top`, `toast-fade-bottom`, `toast-fade-left`, `toast-fade-right`)이 적용됩니다.
- 리스트 이동(밀림) 애니메이션은 .toast에 `transition: transform 0.3s, opacity 0.3s;`로 적용되어 있습니다.

## 접근성

- role="alert" 및 aria 속성 지원
- 키보드 네비게이션 및 스크린리더 지원

## 트러블슈팅

- 반드시 ToastProvider로 감싸야 useToast 훅이 동작합니다.
- 여러 ToastProvider를 중첩하면 가장 가까운 Provider가 적용됩니다.
- 마지막 토스트가 사라질 때 트랜지션이 안 보이면 TransitionGroup의 component 속성을 null로 설정하세요.

## 라이선스

MIT License
