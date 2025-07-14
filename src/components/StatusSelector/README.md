# StatusSelector 컴포넌트

Vue 3 + TypeScript로 개발된 상태 선택 컴포넌트입니다. 다양한 상태를 시각적으로 표현하고 선택할 수 있는 드롭다운 형태의 컴포넌트입니다.

## 주요 기능

- ✅ **상태 기반 색상 표시**: 각 상태별로 다른 색상 표시
- ✅ **원형 표시기**: 상태를 원형 색상으로 시각화
- ✅ **키보드 접근성**: 완전한 키보드 네비게이션 지원
- ✅ **읽기 전용 모드**: 선택 불가능한 읽기 전용 상태
- ✅ **커스텀 색상**: 미리 정의된 색상 또는 커스텀 색상 지원
- ✅ **반응형 디자인**: 다양한 화면 크기에 대응
- ✅ **TypeScript 지원**: 완전한 타입 안전성 보장

## 기본 사용법

```vue
<template>
  <StatusSelector v-model="selectedStatus" :options="statusOptions" @change="handleStatusChange" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import StatusSelector from '@/components/StatusSelector';
import type { StatusSelectorItem } from '@/components/StatusSelector/types';

const statusOptions: StatusSelectorItem[] = [
  { text: '대기중', value: 'pending', color: 'warning' },
  { text: '진행중', value: 'processing', color: 'info' },
  { text: '완료', value: 'completed', color: 'success' },
  { text: '오류', value: 'error', color: 'error' },
];

const selectedStatus = ref<string>('pending');

const handleStatusChange = (value: string, index: number) => {
  console.log(`상태 변경: ${value} (인덱스: ${index})`);
};
</script>
```

## Props

| Prop         | Type                   | Default     | Description              |
| ------------ | ---------------------- | ----------- | ------------------------ |
| `modelValue` | `string`               | -           | 현재 선택된 값 (v-model) |
| `options`    | `StatusSelectorItem[]` | -           | 선택 가능한 옵션 목록    |
| `circle`     | `boolean`              | `false`     | 원형 표시기 사용 여부    |
| `readOnly`   | `boolean`              | `false`     | 읽기 전용 모드           |
| `bgColor`    | `string`               | `'#efefef'` | 배경 색상                |
| `size`       | `StatusSelectorSize`   | `'medium'`  | 컴포넌트 크기            |

### StatusSelectorSize 타입

```typescript
type StatusSelectorSize = 'small' | 'medium' | 'large';
```

### StatusSelectorItem 타입

```typescript
interface StatusSelectorItem {
  /** 상태 텍스트 */
  text: string;
  /** 상태 값 */
  value: string;
  /** 상태 색상 */
  color: StatusSelectorColor | string;
}
```

## Events

| Event                  | Payload                          | Description                    |
| ---------------------- | -------------------------------- | ------------------------------ |
| `update:modelValue`    | `(value: string)`                | 선택된 값이 변경될 때 발생     |
| `update:selectedIndex` | `(index: number)`                | 선택된 인덱스가 변경될 때 발생 |
| `change`               | `(value: string, index: number)` | 상태가 변경될 때 발생          |

## 색상 시스템

### 미리 정의된 색상

- `primary`: 기본 색상
- `secondary`: 보조 색상
- `success`: 성공 색상
- `warning`: 경고 색상
- `error`: 오류 색상
- `info`: 정보 색상

### 커스텀 색상

CSS 색상 값(hex, rgb, hsl 등)을 직접 사용할 수 있습니다.

```typescript
const customOptions: StatusSelectorItem[] = [
  { text: '높음', value: 'high', color: '#dc3545' },
  { text: '보통', value: 'medium', color: '#ffc107' },
  { text: '낮음', value: 'low', color: '#28a745' },
];
```

## 접근성

### 키보드 네비게이션

- **Enter/Space**: 상태 선택기 열기/닫기
- **Arrow Down/Up**: 옵션 간 이동
- **Escape**: 선택기 닫기

### ARIA 속성

- `role="combobox"`: 콤보박스 역할
- `aria-expanded`: 확장 상태 표시
- `aria-haspopup="true"`: 팝업 메뉴 존재 표시
- `aria-disabled`: 비활성화 상태 표시
- `role="listbox"`: 옵션 목록 역할
- `role="option"`: 개별 옵션 역할
- `aria-selected`: 선택 상태 표시

## 사용 예제

### 기본 사용법

```vue
<StatusSelector v-model="selectedStatus" :options="statusOptions" />
```

### 원형 표시기 포함

```vue
<StatusSelector v-model="selectedStatus" :options="statusOptions" circle />
```

### 사이즈 변형

```vue
<!-- 작은 크기 -->
<StatusSelector v-model="selectedStatus" :options="statusOptions" size="small" />

<!-- 기본 크기 -->
<StatusSelector v-model="selectedStatus" :options="statusOptions" size="medium" />

<!-- 큰 크기 -->
<StatusSelector v-model="selectedStatus" :options="statusOptions" size="large" />
```

### 읽기 전용 모드

```vue
<StatusSelector v-model="selectedStatus" :options="statusOptions" :read-only="true" />
```

### 커스텀 배경 색상

```vue
<StatusSelector v-model="selectedStatus" :options="statusOptions" bg-color="#f0f8ff" />
```

### 이벤트 처리

```vue
<StatusSelector
  v-model="selectedStatus"
  :options="statusOptions"
  @change="handleStatusChange"
  @update:selected-index="handleIndexChange"
/>
```

## 스타일 커스터마이징

컴포넌트는 SCSS 변수와 믹스인을 통해 스타일을 커스터마이징할 수 있습니다.

```scss
.status-selector {
  // 기본 스타일 오버라이드
  .wrap {
    border-radius: 8px;
    font-weight: 600;
  }

  .circle {
    width: 8px;
    height: 8px;
  }

  ul {
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
}
```

## 성능 최적화

- **Computed 속성 활용**: 선택된 옵션과 색상을 computed로 최적화
- **이벤트 위임**: 외부 클릭 감지를 효율적으로 처리
- **메모리 누수 방지**: 컴포넌트 언마운트 시 이벤트 리스너 정리
- **조건부 렌더링**: 불필요한 DOM 요소 제거

## 브라우저 지원

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 업데이트 히스토리

### v2.0.0 (2024-01-XX)

- ✅ TypeScript 타입 안전성 강화
- ✅ 접근성 기능 추가 (키보드 네비게이션, ARIA 속성)
- ✅ 성능 최적화
- ✅ 에러 처리 개선
- ✅ 문서화 완료

### v1.0.0 (2024-01-XX)

- ✅ 기본 기능 구현
- ✅ Vue 3 Composition API 사용
- ✅ 반응형 디자인

## 라이센스

MIT License
