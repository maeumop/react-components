# ListTable 컴포넌트 (React)

React + TypeScript로 개발된 고성능 테이블 컴포넌트입니다. 체크박스/라디오 선택, 무한 스크롤, 로딩 상태 등 다양한 기능을 제공합니다.

## 주요 기능

- ✅ 체크박스/라디오 선택 (다중/단일 선택)
- ✅ 무한 스크롤 (Intersection Observer)
- ✅ 로딩 상태 표시
- ✅ 반응형 디자인
- ✅ 접근성(ARIA, 키보드 네비게이션)
- ✅ 타입 안전성 (TypeScript)
- ✅ 커스텀 렌더링 지원 (render props)

## 설치

```bash
npm install @mui/icons-material
```

## 기본 사용법

```tsx
import React from 'react';
import ListTable from '@/components/ListTable';
import type { ListTableHeader, ListTableItem } from '@/components/ListTable/types';

const headers: ListTableHeader[] = [
  { text: 'ID', width: '80px', align: 'center' },
  { text: '이름', width: '120px' },
  { text: '이메일', width: '200px' },
  { text: '역할', width: '100px', align: 'center' },
];

const users: ListTableItem[] = [
  { id: 1, name: '홍길동', email: 'hong@example.com', role: '관리자' },
  // ...
];

<ListTable header={headers} items={users}>
  {({ props }) => (
    <>
      <td>{props.id}</td>
      <td>{props.name}</td>
      <td>{props.email}</td>
      <td>{props.role}</td>
    </>
  )}
</ListTable>;
```

## Props

| Prop            | Type                                                    | Default                | 설명               |
| --------------- | ------------------------------------------------------- | ---------------------- | ------------------ |
| `items`         | `T[]`                                                   | `[]`                   | 테이블 데이터 배열 |
| `header`        | `ListTableHeader[]`                                     | `[]`                   | 테이블 헤더 정의   |
| `footer`        | `ListTableFooter[]`                                     | `[]`                   | 테이블 푸터 정의   |
| `emptyText`     | `string`                                                | `'데이터가 없습니다.'` | 빈 데이터 메시지   |
| `width`         | `string`                                                | `undefined`            | 테이블 너비        |
| `height`        | `string`                                                | `undefined`            | 테이블 높이        |
| `observer`      | `boolean`                                               | `false`                | 무한 스크롤 감지   |
| `loading`       | `boolean`                                               | `false`                | 로딩 상태          |
| `checkMode`     | `'checkbox' \| 'radio'`                                 | `undefined`            | 체크 모드          |
| `disableFilter` | `(item: T, index: number) => boolean`                   | `undefined`            | 비활성화 필터 함수 |
| `onCheckedAll`  | `(checked: boolean) => void`                            |                        | 전체 체크 이벤트   |
| `onChecked`     | `(checked: boolean, index: number, items: T[]) => void` |                        | 개별 체크 이벤트   |
| `onObserve`     | `() => void`                                            |                        | 무한 스크롤 이벤트 |

## Render Props (Slot)

- `children`(render props)로 각 행을 자유롭게 렌더링할 수 있습니다.

```tsx
<ListTable header={headers} items={users}>
  {({ props, index, disabled }) => (
    <tr>
      <td>{props.name}</td>
      <td>{props.email}</td>
      <td>
        <button disabled={disabled}>수정</button>
      </td>
    </tr>
  )}
</ListTable>
```

## 체크 모드 예시

### 체크박스 모드

```tsx
<ListTable
  header={headers}
  items={users}
  checkMode="checkbox"
  onChecked={(checked, index, items) => {
    // 선택된 항목: items
  }}
  onCheckedAll={checked => {
    // 전체 선택: checked
  }}
>
  {({ props }) => (
    <>
      <td>{props.name}</td>
      <td>{props.email}</td>
    </>
  )}
</ListTable>
```

### 라디오 모드

```tsx
<ListTable
  header={headers}
  items={users}
  checkMode="radio"
  onChecked={(checked, index, items) => {
    // 선택된 항목: items[0]
  }}
>
  {({ props }) => (
    <>
      <td>{props.name}</td>
      <td>{props.email}</td>
    </>
  )}
</ListTable>
```

## 무한 스크롤 예시

```tsx
<ListTable
  header={headers}
  items={users}
  observer
  height="400px"
  onObserve={() => {
    // 추가 데이터 로드
  }}
>
  {({ props }) => (
    <>
      <td>{props.name}</td>
      <td>{props.email}</td>
    </>
  )}
</ListTable>
```

## 비활성화 필터 예시

```tsx
const disableFilter = (user: User, index: number) => user.role === '관리자';

<ListTable header={headers} items={users} checkMode="checkbox" disableFilter={disableFilter}>
  {({ props }) => (
    <>
      <td>{props.name}</td>
      <td>{props.email}</td>
    </>
  )}
</ListTable>;
```

## 트랜지션/애니메이션

- 트랜지션이 필요한 경우 react-transition-group의 `CSSTransition` 등과 함께 `.list-table-fade-appear`, `.list-table-fade-enter-active` 등 SCSS 클래스를 활용할 수 있습니다.
- style.scss에 트랜지션 클래스가 포함되어 있습니다.

## 타입 안전성/최적화

- 모든 props, 콜백에 타입 명시 필수
- React.memo, useCallback, useMemo 등 최적화 적용
- any 타입 사용 금지

## 접근성

- 키보드 네비게이션(Tab, Enter, Space)
- ARIA 속성, 시맨틱 HTML
- 포커스 인디케이터

## 브라우저 지원

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 업데이트 히스토리

- **2024.12**: @iconify/react에서 @mui/icons-material로 아이콘 라이브러리 변경
- **2024.01**: 체크박스/라디오 선택 기능 추가
- **2023.12**: 무한 스크롤 기능 추가
- **2023.11**: 최초 작성

## 라이센스

MIT License
