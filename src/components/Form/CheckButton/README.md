# CheckButton 컴포넌트 (React)

React + TypeScript로 구현된 체크박스/라디오/버튼 UI 컴포넌트입니다. 다양한 옵션, 색상, 유효성 검사, 트랜지션, 접근성, 커스텀 스타일을 지원합니다.

## ✨ 주요 기능

- 체크박스/라디오/버튼 UI 지원
- 다양한 색상(primary, secondary, success, warning, error, info, light, dark)
- 전체 선택, 최대 선택 제한, 라인 제한, 블록 모드 등 다양한 옵션
- 유효성 검사 및 에러 메시지 표시
- 부드러운 트랜지션(에러 메시지 애니메이션)
- 접근성(aria, label, required 등)
- React controlled/uncontrolled 패턴 지원
- imperative handle로 check/resetForm/resetValidate 메서드 제공

## 📦 설치

```bash
npm install @iconify/react
```

## 🚀 기본 사용법

```tsx
import React, { useState } from 'react';
import CheckButton from '@/components/Form/CheckButton';

const items = [
  { text: '옵션 1', value: 'option1' },
  { text: '옵션 2', value: 'option2' },
  { text: '옵션 3', value: 'option3' },
];

function Example() {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <CheckButton
      value={selected}
      onChange={setSelected}
      items={items}
      name="example"
      label="옵션 선택"
      color="primary"
    />
  );
}
```

## 🎛️ Props

| Prop            | 타입                          | 기본값     | 설명                     |
| --------------- | ----------------------------- | ---------- | ------------------------ |
| `items`         | `CheckButtonItem[]`           |            | 선택 가능한 항목 목록    |
| `name`          | `string`                      |            | 폼 필드 이름             |
| `value`         | `string` \| `string[]`        |            | 선택된 값(제어형)        |
| `type`          | `'checkbox'` \| `'radio'`     | 'checkbox' | 타입                     |
| `maxLength`     | `number`                      | 0          | 최대 선택 개수(checkbox) |
| `validate`      | `((v) => boolean\|string)[]`  | []         | 유효성 검사 함수 배열    |
| `errorMessage`  | `string`                      |            | 강제 에러 메시지         |
| `button`        | `boolean`                     | false      | 버튼 UI 모드             |
| `block`         | `boolean`                     | false      | 전체 너비 사용           |
| `color`         | `'primary'` 등                | 'primary'  | 색상 테마                |
| `disabled`      | `boolean`                     | false      | 비활성화                 |
| `label`         | `string`                      |            | 라벨 텍스트              |
| `required`      | `boolean`                     | false      | 필수 입력                |
| `lineLimit`     | `number`                      | 0          | 한 줄에 표시할 개수      |
| `all`           | `boolean`                     | false      | 전체 선택 버튼 추가      |
| `onChange`      | `(v: string\|string[])=>void` |            | 값 변경 콜백             |
| `onAfterChange` | `() => void`                  |            | 값 변경 후 콜백          |
| `onIndexChange` | `(i: number) => void`         |            | 클릭 인덱스 콜백         |

## 📡 콜백/이벤트

- `onChange`: 값 변경 시 호출 (value: string | string[])
- `onAfterChange`: 값 변경 후 호출
- `onIndexChange`: 항목 클릭 시 인덱스 전달

## 🧩 Imperative Handle (ref)

- `check(silence?: boolean): boolean` : 유효성 검사 실행
- `resetForm(): void` : 선택값 초기화
- `resetValidate(): void` : 에러/유효성 상태 초기화

```tsx
const ref = useRef<CheckButtonModel>(null);
// 유효성 검사
ref.current?.check();
// 값 초기화
ref.current?.resetForm();
// 에러 상태 초기화
ref.current?.resetValidate();
```

## 🎨 색상/옵션

- color: 'primary', 'secondary', 'success', 'warning', 'error', 'info', 'light', 'dark'
- type: 'checkbox', 'radio'
- button: 버튼 UI 스타일
- block: 전체 너비
- all: 전체 선택 버튼
- lineLimit: 한 줄에 표시할 개수

## 🧩 예제 (ex.tsx 참고)

```tsx
// 기본 체크박스
<CheckButton
  value={selected}
  onChange={setSelected}
  items={hobbyItems}
  name="hobbies"
  label="취미"
/>

// 라디오 버튼
<CheckButton
  value={selectedGender}
  onChange={setSelectedGender}
  items={genderItems}
  name="gender"
  type="radio"
  label="성별"
  required
/>

// 버튼 UI 모드
<CheckButton
  value={selectedOptions}
  onChange={setSelectedOptions}
  items={optionItems}
  name="options"
  button
  color="success"
  label="옵션 선택"
/>

// 다양한 색상, 최대 선택 제한, 전체 선택, 유효성 검사, 라인 제한, 비활성화, 블록 모드 등은 ex.tsx 참고
```

## ♿ 접근성

- label, required, aria- 속성 지원
- 키보드 네비게이션, 스크린리더 호환

## 🎨 스타일/트랜지션

- style.scss, ex.scss에서 커스텀 가능
- 에러 메시지 트랜지션: 상태값 기반 애니메이션 적용

## 🔧 고급 사용법

- 유효성 검사: validate, errorMessage 활용
- imperative handle로 외부에서 check/resetForm/resetValidate 호출 가능
- 전체 선택, 최대 선택 제한, 라인 제한 등 다양한 옵션 조합 가능

---

MIT License
