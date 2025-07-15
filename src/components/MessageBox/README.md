# MessageBox 컴포넌트 (React)

React + TypeScript로 개발된 모달 메시지 박스 컴포넌트입니다. Provider/Hook 구조로 전역에서 간편하게 사용할 수 있으며, 다양한 트랜지션, 접근성, 비동기 처리, 커스텀 버튼, 반응형 디자인을 지원합니다.

## 주요 기능

- ✅ **Provider/Hook 기반 전역 메시지 박스**
- ✅ **Alert/Confirm 지원**
- ✅ **다양한 트랜지션 효과**
- ✅ **비동기 확인 처리**
- ✅ **접근성(ARIA) 및 키보드 네비게이션**
- ✅ **반응형 디자인**
- ✅ **스타일 커스터마이징(CSS 변수)**

---

## 설치

```bash
npm install @iconify/react react-transition-group
```

## 사용법

### 1. Provider로 감싸기

```tsx
import { MessageBoxProvider } from '@/components/MessageBox';

function App() {
  return (
    <MessageBoxProvider>
      <YourApp />
    </MessageBoxProvider>
  );
}
```

### 2. Hook으로 사용

```tsx
import { useMessageBox } from '@/components/MessageBox';

function MyComponent() {
  const { alert, confirm } = useMessageBox();

  return (
    <>
      <button onClick={() => alert('알림 메시지!')}>Alert</button>
      <button onClick={() => confirm('확인하시겠습니까?')}>Confirm</button>
    </>
  );
}
```

---

## 예제 (ex.tsx)

```tsx
import React, { useState } from 'react';
import { MessageBoxProvider, useMessageBox, messageBoxTransition } from '@/components/MessageBox';

const Example = () => {
  const [selectedTransition, setSelectedTransition] = useState(messageBoxTransition.scale);
  const { alert, confirm } = useMessageBox();

  return (
    <>
      <button onClick={() => alert('기본 Alert 메시지입니다.')}>Alert</button>
      <button onClick={() => confirm('기본 Confirm 메시지입니다.')}>Confirm</button>
      <select value={selectedTransition} onChange={e => setSelectedTransition(e.target.value)}>
        {Object.entries(messageBoxTransition).map(([k, v]) => (
          <option key={k} value={v}>
            {k}
          </option>
        ))}
      </select>
      <button onClick={() => alert({ message: '트랜지션 Alert', transition: selectedTransition })}>
        트랜지션 Alert
      </button>
      <button
        onClick={() => confirm({ message: '트랜지션 Confirm', transition: selectedTransition })}
      >
        트랜지션 Confirm
      </button>
    </>
  );
};

export default function ExamplePage() {
  return (
    <MessageBoxProvider>
      <Example />
    </MessageBoxProvider>
  );
}
```

---

## Props

| Prop                 | Type                  | Default           | 설명                            |
| -------------------- | --------------------- | ----------------- | ------------------------------- |
| `type`               | `string`              | `'alert'`         | 메시지 박스 타입(alert/confirm) |
| `message`            | `string`              | `-`               | 메시지(HTML 지원)               |
| `title`              | `string`              | `-`               | 제목                            |
| `width`              | `string`              | `'320px'`         | 박스 너비                       |
| `btnOkayText`        | `string`              | `'확인'`          | 확인 버튼 텍스트                |
| `btnCancelText`      | `string`              | `'취소'`          | 취소 버튼 텍스트                |
| `okay`               | `() => void`          | `-`               | 확인 클릭 콜백                  |
| `cancel`             | `() => void`          | `-`               | 취소 클릭 콜백                  |
| `asyncOkay`          | `() => Promise<void>` | `-`               | 비동기 확인 콜백                |
| `escCancel`          | `boolean`             | `true`            | ESC로 닫기 허용                 |
| `enterOkay`          | `boolean`             | `true`            | Enter로 확인 허용               |
| `noScrollStyleClass` | `string`              | `'hide-scroll'`   | 스크롤 제거 클래스              |
| `transition`         | `string`              | `'msg-box-scale'` | 트랜지션 효과                   |

---

## 트랜지션 효과

- `msg-box-scale` (기본)
- `msg-box-slide`
- `msg-box-slide-up`
- `msg-box-zoom`
- `msg-box-bounce`
- `msg-box-flip`
- `msg-box-elastic`

---

## 고급 사용법

### 비동기 확인 처리

```tsx
alert({
  message: '비동기 Alert',
  asyncOkay: async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 완료 후 자동 닫힘
  },
});
```

### 커스텀 버튼/타이틀/HTML 메시지

```tsx
confirm({
  title: '커스텀 Confirm',
  message: '<b>HTML 메시지</b>도 지원합니다.',
  btnOkayText: '네',
  btnCancelText: '아니오',
  width: '400px',
  transition: messageBoxTransition.flip,
});
```

---

## 스타일 커스터마이징

SCSS 변수로 스타일을 쉽게 커스터마이징할 수 있습니다.

```scss
.msg-box {
  --msg-box-border-radius: 8px;
  --msg-box-bg: #fff;
  // ...
}
```

---

## 접근성/키보드 네비게이션

- `role="dialog"`, `aria-modal`, `aria-labelledby`, `aria-describedby` 등 ARIA 속성 적용
- Enter/ESC 키 지원
- 포커스 트랩 및 스크롤 제어

---

## 성능 최적화

- React.memo, useCallback, useMemo 등으로 불필요한 렌더링 방지
- 타입 안전성 보장

---

## 라이선스

MIT License
