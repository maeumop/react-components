# Modal 컴포넌트 (React)

React + TypeScript로 구현된 현대적이고 접근성 높은 모달 컴포넌트입니다.

## ✨ 주요 기능

- 다양한 위치 지원: popup, right, left, bottom
- ESC 키로 닫기, 포커스 관리
- 부드러운 트랜지션(CSSTransition, cubic-bezier)
- 반응형 디자인
- ARIA 속성, 스크린리더 지원
- body/action/title 영역 커스텀
- React Portal 기반, Provider 불필요

## 📦 설치

```bash
npm install @iconify/react react-transition-group
```

## 🚀 기본 사용법

```tsx
import React, { useState } from 'react';
import Modal from '@/components/Modal';

function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>모달 열기</button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="제목"
        width="500px"
        body={<p>모달 내용입니다.</p>}
        action={close => <button onClick={close}>닫기</button>}
      />
    </>
  );
}
```

## 🎛️ Props

| Prop          | 타입                               | 기본값  | 설명                    |
| ------------- | ---------------------------------- | ------- | ----------------------- | --------- | ------- | --------- |
| `open`        | `boolean`                          |         | 모달 표시 여부          |
| `onClose`     | `() => void`                       |         | 모달 닫기 콜백          |
| `title`       | `React.ReactNode`                  |         | 모달 제목               |
| `width`       | `string`                           | '320px' | 모달 너비               |
| `position`    | `'popup'                           | 'right' | 'left'                  | 'bottom'` | 'popup' | 모달 위치 |
| `escClose`    | `boolean`                          | false   | ESC 키로 닫기 가능 여부 |
| `fullscreen`  | `boolean`                          | false   | 전체 화면 모달 여부     |
| `hideClose`   | `boolean`                          | false   | 닫기 버튼 숨김 여부     |
| `screenCover` | `boolean`                          | false   | 화면 전체 덮기 여부     |
| `body`        | `React.ReactNode`                  |         | 모달 본문               |
| `action`      | `(close: () => void) => ReactNode` |         | 액션 영역(버튼 등)      |

## 📡 이벤트/콜백

- `onClose`: 모달 닫기 시 호출
- `action` prop의 close 함수: 모달 내부에서 닫기 버튼 등에 사용

## 🎭 커스텀 영역

- `title`, `body`, `action` prop으로 헤더/본문/액션 영역 커스텀
- children도 body 영역에 추가 가능

## 🎨 위치별 스타일/트랜지션

- popup: 중앙, 스케일 애니메이션
- right/left: 좌/우측 슬라이드
- bottom: 하단 슬라이드업
- 각 위치별 트랜지션은 style.scss에서 커스텀 가능

## 🔧 고급 사용법

### 전체 화면 모달

```tsx
<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="전체 화면 모달"
  fullscreen
  body={<div>전체 화면 내용</div>}
  action={close => <button onClick={close}>닫기</button>}
/>
```

### 액션 버튼 여러 개

```tsx
<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="확인"
  width="400px"
  body={<div>정말로 삭제하시겠습니까?</div>}
  action={close => (
    <>
      <button onClick={close}>취소</button>
      <button
        onClick={() => {
          /* 삭제 */ close();
        }}
      >
        삭제
      </button>
    </>
  )}
/>
```

## ♿ 접근성

- role="dialog", aria-modal, aria-labelledby, aria-describedby 지원
- ESC 키, 포커스 트랩, 스크린리더 호환

## 🎨 스타일 커스터마이즈

- style.scss에서 위치별 트랜지션, 배경, 크기, 색상 등 커스터마이즈 가능

## 🔍 예제 (ex.tsx 참고)

- 다양한 위치, 크기, 전체화면, 액션, 아이콘, FloatingBackButton 등 실제 예제는 ex.tsx 참고

---

MIT License
