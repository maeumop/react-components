# Pagination 컴포넌트 (React)

React + TypeScript로 개발된 고성능 페이지네이션 컴포넌트입니다. 접근성, 반응형 디자인, 키보드 네비게이션을 지원합니다.

## 주요 기능

- ✅ **기본 페이지네이션**: 페이지 이동, 첫/마지막/이전/다음 페이지 이동
- ✅ **접근성**: ARIA 속성, 키보드 네비게이션, 스크린 리더 지원
- ✅ **반응형 디자인**: 모바일 친화적 레이아웃
- ✅ **페이지 크기 선택**: 동적 페이지 크기 변경
- ✅ **키보드 지원**: 화살표, Home/End, Enter/Space 키로 페이지 이동
- ✅ **타입 안전성**: 완전한 TypeScript 지원

## 설치 및 설정

### 1. Material-UI 아이콘 설치

```bash
npm install @mui/icons-material
```

### 2. 컴포넌트 import

```typescript
import Pagination from '@/components/Pagination';
```

## 기본 사용법

```tsx
import React, { useState } from 'react';
import Pagination from '@/components/Pagination';

const Example = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [total, setTotal] = useState<number>(16723);

  return (
    <div>
      <h3>현재 페이지: {currentPage}</h3>
      <Pagination
        value={currentPage}
        total={total}
        size={pageSize}
        block={10}
        onChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
};
```

## Props

| Prop               | Type                     | Default             | 설명                          |
| ------------------ | ------------------------ | ------------------- | ----------------------------- |
| `value`            | `number`                 | `-`                 | 현재 페이지 번호 (controlled) |
| `total`            | `number`                 | `0`                 | 데이터의 총 수량              |
| `size`             | `number`                 | `20`                | 한 페이지당 데이터 수량       |
| `block`            | `number`                 | `10`                | 표시할 페이지 번호 개수       |
| `disabled`         | `boolean`                | `false`             | 비활성화 상태                 |
| `ariaLabel`        | `string`                 | `'페이지네이션'`    | 접근성 라벨                   |
| `pageSizeOptions`  | `number[]`               | `[10, 20, 50, 100]` | 페이지 크기 옵션              |
| `onChange`         | `(page: number) => void` | -                   | 페이지 변경 핸들러            |
| `onPageSizeChange` | `(size: number) => void` | -                   | 페이지 크기 변경 핸들러       |

## 이벤트

- `onChange(page: number)`: 페이지 변경 시 호출
- `onPageSizeChange(size: number)`: 페이지 크기 변경 시 호출

## 키보드 네비게이션

- **Tab**: 버튼 간 포커스 이동
- **Enter/Space**: 페이지 이동
- **Arrow Left/Right**: 이전/다음 페이지
- **Home**: 첫 페이지
- **End**: 마지막 페이지

## 접근성

- `role="navigation"`: 페이지네이션 영역
- `aria-label`: 페이지네이션 설명
- `aria-current="page"`: 현재 페이지 표시
- 각 버튼에 기능별 `aria-label` 제공

## 반응형 디자인

- 데스크탑, 태블릿, 모바일 환경에서 최적화된 스타일 제공
- CSS 변수로 스타일 커스터마이징 가능

## 고급 사용법

### 커스텀 페이지 크기 옵션

```tsx
<Pagination
  value={currentPage}
  total={total}
  size={pageSize}
  pageSizeOptions={[5, 10, 25, 50, 100]}
  onChange={setCurrentPage}
  onPageSizeChange={setPageSize}
/>
```

### 비활성화 상태

```tsx
<Pagination
  value={currentPage}
  total={total}
  size={pageSize}
  disabled={isLoading}
  onChange={setCurrentPage}
/>
```

### 커스텀 접근성 라벨

```tsx
<Pagination
  value={currentPage}
  total={total}
  size={pageSize}
  ariaLabel="사용자 목록 페이지네이션"
  onChange={setCurrentPage}
/>
```

## 스타일 커스터마이징

CSS 변수를 통해 스타일을 커스터마이징할 수 있습니다:

```scss
.pagination {
  --pagination-border-radius: 0.5rem;
  --pagination-button-min-size: 4.5rem;
  --pagination-font-size: 1.6rem;
  --pagination-border-color: #e5e7eb;
  --pagination-hover-bg: #f3f4f6;
  --pagination-active-bg: #3b82f6;
  --pagination-active-color: white;
  --pagination-disabled-color: #d1d5db;
  --pagination-text-color: #374151;
  --pagination-spacing: 1.2rem;
}
```

## 성능 최적화

- React.memo, useCallback, useMemo 등으로 불필요한 렌더링 방지
- 타입 안전성 보장

## 업데이트 히스토리

- **2024.12**: @iconify/react에서 @mui/icons-material로 아이콘 라이브러리 변경
- **2024.01**: 접근성 개선 및 키보드 네비게이션 추가
- **2023.12**: 반응형 디자인 지원
- **2023.11**: 최초 작성

## 라이선스

MIT License
