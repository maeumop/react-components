# ListTable 컴포넌트

Vue 3 + TypeScript로 개발된 고성능 테이블 컴포넌트입니다. 체크박스/라디오 선택, 무한 스크롤, 로딩 상태 등 다양한 기능을 제공합니다.

## 주요 기능

- ✅ **체크박스/라디오 선택**: 다중/단일 선택 지원
- ✅ **무한 스크롤**: Intersection Observer를 활용한 효율적인 스크롤 감지
- ✅ **로딩 상태**: 스피너를 통한 로딩 표시
- ✅ **반응형 디자인**: 다양한 화면 크기에 대응
- ✅ **접근성**: 키보드 네비게이션 및 스크린 리더 지원
- ✅ **타입 안전성**: 완전한 TypeScript 지원
- ✅ **커스텀 슬롯**: 유연한 컨텐츠 커스터마이징

## 설치 및 설정

### 1. Iconify 설치

```bash
npm install @iconify/vue
```

### 2. 전역 등록

```typescript
// main.ts
import ListTable from '@/components/ListTable';

app.component('ListTable', ListTable);
```

## 기본 사용법

```vue
<script setup lang="ts">
import type { ListTableHeader } from '@/components/ListTable/types';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const users: User[] = [
  { id: 1, name: '홍길동', email: 'hong@example.com', role: '관리자' },
  { id: 2, name: '김철수', email: 'kim@example.com', role: '사용자' },
  { id: 3, name: '이영희', email: 'lee@example.com', role: '사용자' },
];

const headers: ListTableHeader[] = [
  { text: 'ID', width: '80px', align: 'center' },
  { text: '이름', width: '120px' },
  { text: '이메일', width: '200px' },
  { text: '역할', width: '100px', align: 'center' },
];
</script>

<template>
  <ListTable :header="headers" :items="users">
    <template #items="{ props, index }">
      <tr>
        <td>{{ props.id }}</td>
        <td>{{ props.name }}</td>
        <td>{{ props.email }}</td>
        <td>{{ props.role }}</td>
      </tr>
    </template>
  </ListTable>
</template>
```

## Props

| Prop            | Type                                  | Default                | Description        |
| --------------- | ------------------------------------- | ---------------------- | ------------------ |
| `items`         | `T[]`                                 | `[]`                   | 테이블 데이터 배열 |
| `header`        | `ListTableHeader[]`                   | `[]`                   | 테이블 헤더 정의   |
| `footer`        | `ListTableFooter[]`                   | `[]`                   | 테이블 푸터 정의   |
| `emptyText`     | `string`                              | `'데이터가 없습니다.'` | 빈 데이터 메시지   |
| `width`         | `string`                              | `undefined`            | 테이블 너비        |
| `height`        | `string`                              | `undefined`            | 테이블 높이        |
| `observer`      | `boolean`                             | `false`                | 스크롤 감지 활성화 |
| `loading`       | `boolean`                             | `false`                | 로딩 상태          |
| `checkMode`     | `'checkbox' \| 'radio'`               | `undefined`            | 체크 모드          |
| `disableFilter` | `(item: T, index: number) => boolean` | `undefined`            | 비활성화 필터 함수 |

## Events

| Event        | Payload                                         | Description         |
| ------------ | ----------------------------------------------- | ------------------- |
| `checkedAll` | `(checked: boolean)`                            | 전체 체크 상태 변경 |
| `checked`    | `(checked: boolean, index: number, items: T[])` | 개별 체크 상태 변경 |
| `observe`    | `()`                                            | 스크롤 감지 이벤트  |

## Slots

### `header`

테이블 헤더를 커스터마이징합니다.

```vue
<template #header>
  <tr>
    <th>커스텀 헤더</th>
    <th>컬럼 1</th>
    <th>컬럼 2</th>
  </tr>
</template>
```

### `items`

테이블 행을 커스터마이징합니다.

```vue
<template #items="{ props, index, disabled }">
  <tr>
    <td>{{ props.name }}</td>
    <td>{{ props.email }}</td>
    <td>
      <button :disabled="disabled">수정</button>
    </td>
  </tr>
</template>
```

### `empty`

빈 데이터 상태를 커스터마이징합니다.

```vue
<template #empty>
  <div class="custom-empty">
    <p>데이터가 없습니다.</p>
    <button>새로고침</button>
  </div>
</template>
```

### `footer`

테이블 푸터를 커스터마이징합니다.

```vue
<template #footer>
  <tr>
    <td colspan="3">총 {{ items.length }}개 항목</td>
  </tr>
</template>
```

## 체크 모드 사용법

### 체크박스 모드

```vue
<template>
  <ListTable
    :header="headers"
    :items="users"
    check-mode="checkbox"
    @checked="handleCheck"
    @checked-all="handleCheckAll"
  >
    <template #items="{ props, index }">
      <tr>
        <td>{{ props.name }}</td>
        <td>{{ props.email }}</td>
      </tr>
    </template>
  </ListTable>
</template>

<script setup lang="ts">
const handleCheck = (checked: boolean, index: number, items: User[]) => {
  console.log('선택된 항목:', items);
};

const handleCheckAll = (checked: boolean) => {
  console.log('전체 선택:', checked);
};
</script>
```

### 라디오 모드

```vue
<template>
  <ListTable :header="headers" :items="users" check-mode="radio" @checked="handleRadioCheck">
    <template #items="{ props, index }">
      <tr>
        <td>{{ props.name }}</td>
        <td>{{ props.email }}</td>
      </tr>
    </template>
  </ListTable>
</template>
```

## 무한 스크롤

```vue
<template>
  <ListTable :header="headers" :items="users" :observer="true" height="400px" @observe="loadMore">
    <template #items="{ props, index }">
      <tr>
        <td>{{ props.name }}</td>
        <td>{{ props.email }}</td>
      </tr>
    </template>
  </ListTable>
</template>

<script setup lang="ts">
const loadMore = () => {
  // 추가 데이터 로드 로직
  console.log('더 많은 데이터 로드');
};
</script>
```

## 비활성화 필터

```vue
<template>
  <ListTable :header="headers" :items="users" check-mode="checkbox" :disable-filter="disableFilter">
    <template #items="{ props, index }">
      <tr>
        <td>{{ props.name }}</td>
        <td>{{ props.email }}</td>
      </tr>
    </template>
  </ListTable>
</template>

<script setup lang="ts">
const disableFilter = (user: User, index: number): boolean => {
  return user.role === '관리자'; // 관리자는 선택 불가
};
</script>
```

## Methods

### `observerStart(): void`

스크롤 감지를 시작합니다.

### `observerStop(): void`

스크롤 감지를 중지합니다.

### `checkedToggle(checked?: boolean): void`

전체 체크 상태를 토글합니다.

## 성능 최적화

- **Computed 속성 활용**: 선택된 아이템과 선택 가능한 인덱스를 computed로 최적화
- **Intersection Observer**: 효율적인 스크롤 감지
- **Set 자료구조**: 체크 상태 관리 최적화
- **조건부 렌더링**: 불필요한 DOM 요소 제거

## 접근성

- **키보드 네비게이션**: Tab, Enter, Space 키 지원
- **ARIA 속성**: 적절한 역할과 상태 표시
- **스크린 리더**: 시맨틱 HTML 구조
- **포커스 표시**: 명확한 포커스 인디케이터

## 브라우저 지원

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 업데이트 히스토리

### v2.0.0 (2024-01-XX)

- ✅ 코드 리팩토링 및 단순화
- ✅ 타입 안전성 강화
- ✅ 성능 최적화
- ✅ 반응형 디자인 추가
- ✅ 접근성 개선
- ✅ 에러 처리 추가

### v1.0.0 (2024-01-XX)

- ✅ 기본 테이블 기능
- ✅ 체크박스/라디오 선택
- ✅ 무한 스크롤
- ✅ 커스텀 슬롯

## 라이센스

MIT License
