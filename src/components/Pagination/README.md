# Pagination 컴포넌트

Vue 3 + TypeScript로 개발된 고성능 페이지네이션 컴포넌트입니다. 접근성, 반응형 디자인, 키보드 네비게이션을 지원합니다.

## 주요 기능

- ✅ **기본 페이지네이션**: 페이지 이동, 첫/마지막/이전/다음 페이지 이동
- ✅ **접근성**: ARIA 속성, 키보드 네비게이션, 스크린 리더 지원
- ✅ **반응형 디자인**: 모바일 친화적 레이아웃
- ✅ **페이지 크기 선택**: 동적 페이지 크기 변경
- ✅ **키보드 지원**: 화살표 키, Home/End 키로 페이지 이동
- ✅ **타입 안전성**: 완전한 TypeScript 지원

## 설치 및 설정

### 1. Iconify 설치

```bash
npm install @iconify/vue
```

### 2. 전역 등록

```typescript
// main.ts
import Pagination from '@/components/Pagination';

app.component('Pagination', Pagination);
```

## 기본 사용법

```vue
<script setup lang="ts">
import { ref } from 'vue';

const total = ref<number>(16723);
const pageSize = ref<number>(20);
const currentPage = ref<number>(1);

const handlePageChange = (page: number) => {
  currentPage.value = page;
  // API 호출 또는 데이터 로드
};

const handlePageSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1; // 첫 페이지로 리셋
  // API 호출 또는 데이터 로드
};
</script>

<template>
  <div class="pagination-example">
    <h3>현재 페이지: {{ currentPage }}</h3>
    <Pagination
      v-model="currentPage"
      :total="total"
      :size="pageSize"
      :block="10"
      @page-size-change="handlePageSizeChange"
    />
  </div>
</template>
```

## Props

| Prop              | Type       | Default             | Description                |
| ----------------- | ---------- | ------------------- | -------------------------- |
| `modelValue`      | `number`   | `-`                 | 현재 페이지 번호 (v-model) |
| `total`           | `number`   | `0`                 | 데이터의 총 수량           |
| `size`            | `number`   | `20`                | 한 페이지당 데이터 수량    |
| `block`           | `number`   | `10`                | 표시할 페이지 번호 개수    |
| `disabled`        | `boolean`  | `false`             | 비활성화 상태              |
| `ariaLabel`       | `string`   | `'페이지네이션'`    | 접근성 라벨                |
| `pageSizeOptions` | `number[]` | `[10, 20, 50, 100]` | 페이지 크기 옵션           |

## Events

| Event               | Payload          | Description             |
| ------------------- | ---------------- | ----------------------- |
| `update:modelValue` | `(page: number)` | 페이지 변경 이벤트      |
| `pageSizeChange`    | `(size: number)` | 페이지 크기 변경 이벤트 |

## 키보드 네비게이션

- **Tab**: 버튼 간 포커스 이동
- **Enter/Space**: 페이지 이동
- **Arrow Left/Right**: 이전/다음 페이지
- **Home**: 첫 페이지
- **End**: 마지막 페이지

## 접근성

### ARIA 속성

- `role="navigation"`: 페이지네이션 영역
- `aria-label`: 페이지네이션 설명
- `aria-current="page"`: 현재 페이지 표시
- `aria-label`: 각 버튼의 기능 설명

### 스크린 리더 지원

- 시맨틱 HTML 구조 (`nav`, `ul`, `li`, `button`)
- 적절한 라벨링
- 상태 정보 제공

## 반응형 디자인

### 데스크톱 (768px 이상)

- 버튼 크기: 4rem
- 폰트 크기: 1.4rem
- 간격: 1rem

### 태블릿 (480px - 768px)

- 버튼 크기: 3.5rem
- 폰트 크기: 1.2rem
- 간격: 0.8rem

### 모바일 (480px 이하)

- 버튼 크기: 3rem
- 폰트 크기: 1.1rem
- 간격: 0.6rem

## 고급 사용법

### 커스텀 페이지 크기 옵션

```vue
<template>
  <Pagination
    v-model="currentPage"
    :total="total"
    :size="pageSize"
    :page-size-options="[5, 10, 25, 50, 100]"
    @page-size-change="handlePageSizeChange"
  />
</template>
```

### 비활성화 상태

```vue
<template>
  <Pagination v-model="currentPage" :total="total" :size="pageSize" :disabled="isLoading" />
</template>
```

### 커스텀 접근성 라벨

```vue
<template>
  <Pagination
    v-model="currentPage"
    :total="total"
    :size="pageSize"
    aria-label="사용자 목록 페이지네이션"
  />
</template>
```

## 스타일 커스터마이징

CSS 변수를 통해 스타일을 커스터마이징할 수 있습니다:

```scss
.pagination {
  --pagination-border-radius: 0.5rem;
  --pagination-button-size: 4.5rem;
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

- **Computed 속성 활용**: 페이지 계산을 computed로 최적화
- **조건부 렌더링**: 불필요한 DOM 요소 제거
- **이벤트 위임**: 효율적인 이벤트 처리
- **메모이제이션**: 페이지 리스트 생성 최적화

## 브라우저 지원

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 업데이트 히스토리

### v2.0.0 (2024-01-XX)

- ✅ 접근성 강화 (ARIA 속성, 키보드 네비게이션)
- ✅ 반응형 디자인 추가
- ✅ 페이지 크기 선택 기능
- ✅ 타입 안전성 강화
- ✅ 성능 최적화
- ✅ 현대적 스타일링

### v1.0.0 (2024-01-XX)

- ✅ 기본 페이지네이션 기능
- ✅ 페이지 이동 및 블록 네비게이션
- ✅ TypeScript 지원

## 라이센스

MIT License

:arrow_left: [컴포넌트 목록으로이동](https://github.com/dream-insight/ts-vue3/components)
