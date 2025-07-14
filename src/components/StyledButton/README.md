# StyledButton Component

Vue 3 + TypeScript로 개발된 다재다능한 버튼 컴포넌트입니다. 다양한 색상, 크기, 스타일을 지원하며 접근성을 고려하여 설계되었습니다.

## 📋 목차

- [설치 및 설정](#설치-및-설정)
- [기본 사용법](#기본-사용법)
- [Props](#props)
- [이벤트](#이벤트)
- [스타일 변형](#스타일-변형)
- [예제](#예제)
- [접근성](#접근성)

---

## 🚀 설치 및 설정

### 1. 의존성 설치

```bash
npm install @iconify/vue
```

### 2. 전역 등록 (선택사항)

```typescript
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import StyledButton from '@/components/StyledButton';

const app = createApp(App);
app.component('StyledButton', StyledButton);
app.mount('#app');
```

### 3. 개별 import 사용

```vue
<script setup lang="ts">
import StyledButton from '@/components/StyledButton';
</script>
```

---

## 📖 기본 사용법

### 기본 버튼

```vue
<template>
  <StyledButton>기본 버튼</StyledButton>
  <StyledButton color="success">성공 버튼</StyledButton>
  <StyledButton color="danger">위험 버튼</StyledButton>
</template>
```

### 아이콘 버튼

```vue
<template>
  <StyledButton icon="mdi:home">홈으로</StyledButton>
  <StyledButton icon="mdi:arrow-right" iconRight>다음</StyledButton>
  <StyledButton onlyIcon icon="mdi:menu" />
</template>
```

---

## ⚙️ Props

| Prop             | Type               | Default     | Description               |
| ---------------- | ------------------ | ----------- | ------------------------- |
| `color`          | `ButtonColors`     | `'primary'` | 버튼 색상                 |
| `class`          | `string`           | `undefined` | 추가 CSS 클래스           |
| `href`           | `string`           | `'#'`       | 링크 URL (tag가 'a'일 때) |
| `target`         | `string`           | `'_blank'`  | 링크 타겟                 |
| `icon`           | `string`           | `undefined` | Iconify 아이콘명          |
| `iconRight`      | `boolean`          | `false`     | 아이콘을 오른쪽에 배치    |
| `onlyIcon`       | `boolean`          | `false`     | 아이콘만 표시             |
| `text`           | `boolean`          | `false`     | 텍스트 스타일 버튼        |
| `outline`        | `boolean`          | `false`     | 아웃라인 스타일           |
| `block`          | `boolean`          | `false`     | 전체 너비 버튼            |
| `disabled`       | `boolean`          | `false`     | 비활성화 상태             |
| `loading`        | `boolean`          | `false`     | 로딩 상태                 |
| `large`          | `boolean`          | `false`     | 큰 크기                   |
| `small`          | `boolean`          | `false`     | 작은 크기                 |
| `xSmall`         | `boolean`          | `false`     | 매우 작은 크기            |
| `tag`            | `string`           | `'a'`       | HTML 태그 ('a', 'button') |
| `dropMenuToggle` | `boolean`          | `false`     | 드롭다운 토글 상태        |
| `width`          | `string \| number` | `undefined` | 버튼 너비 (px, %, rem 등) |

### ButtonColors 타입

```typescript
type ButtonColors =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'light'
  | 'dark';
```

---

## 🎯 이벤트

| Event   | Payload      | Description       |
| ------- | ------------ | ----------------- |
| `click` | `MouseEvent` | 버튼 클릭 시 발생 |

```vue
<template>
  <StyledButton @click="handleClick">클릭하세요</StyledButton>
</template>

<script setup lang="ts">
const handleClick = (event: MouseEvent) => {
  console.log('버튼이 클릭되었습니다!', event);
};
</script>
```

---

## 🎨 스타일 변형

### 색상 변형

```vue
<template>
  <StyledButton color="primary">Primary</StyledButton>
  <StyledButton color="secondary">Secondary</StyledButton>
  <StyledButton color="success">Success</StyledButton>
  <StyledButton color="warning">Warning</StyledButton>
  <StyledButton color="danger">Danger</StyledButton>
  <StyledButton color="info">Info</StyledButton>
  <StyledButton color="light">Light</StyledButton>
  <StyledButton color="dark">Dark</StyledButton>
</template>
```

### 크기 변형

```vue
<template>
  <StyledButton xSmall>매우 작음</StyledButton>
  <StyledButton small>작음</StyledButton>
  <StyledButton>기본</StyledButton>
  <StyledButton large>큼</StyledButton>
</template>
```

### 스타일 변형

```vue
<template>
  <!-- 기본 버튼 -->
  <StyledButton>기본</StyledButton>

  <!-- 텍스트 버튼 -->
  <StyledButton text>텍스트</StyledButton>

  <!-- 아웃라인 버튼 -->
  <StyledButton outline>아웃라인</StyledButton>

  <!-- 아이콘 전용 버튼 -->
  <StyledButton onlyIcon icon="mdi:home" />
</template>
```

### Width 설정

```vue
<template>
  <!-- 숫자로 설정 (px 단위) -->
  <StyledButton :width="120">120px</StyledButton>

  <!-- 문자열로 설정 -->
  <StyledButton width="200px">200px</StyledButton>
  <StyledButton width="50%">50%</StyledButton>
  <StyledButton width="10rem">10rem</StyledButton>
  <StyledButton width="100%">전체 너비</StyledButton>
</template>
```

---

## 📝 예제

### 기본 예제

```vue
<template>
  <div class="button-examples">
    <!-- 색상별 버튼 -->
    <div class="row">
      <StyledButton color="primary">Primary</StyledButton>
      <StyledButton color="success">Success</StyledButton>
      <StyledButton color="warning">Warning</StyledButton>
      <StyledButton color="danger">Danger</StyledButton>
    </div>

    <!-- 크기별 버튼 -->
    <div class="row">
      <StyledButton small>Small</StyledButton>
      <StyledButton>Default</StyledButton>
      <StyledButton large>Large</StyledButton>
    </div>

    <!-- 스타일별 버튼 -->
    <div class="row">
      <StyledButton>Filled</StyledButton>
      <StyledButton text>Text</StyledButton>
      <StyledButton outline>Outline</StyledButton>
    </div>

    <!-- 아이콘 버튼 -->
    <div class="row">
      <StyledButton icon="mdi:plus">Add Item</StyledButton>
      <StyledButton icon="mdi:arrow-right" iconRight>Next</StyledButton>
      <StyledButton onlyIcon icon="mdi:menu" />
    </div>

    <!-- 상태별 버튼 -->
    <div class="row">
      <StyledButton loading>Loading</StyledButton>
      <StyledButton disabled>Disabled</StyledButton>
      <StyledButton block>Full Width</StyledButton>
    </div>
  </div>
</template>

<style scoped>
.button-examples {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
</style>
```

### 폼 예제

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <label for="email">이메일</label>
      <input id="email" type="email" v-model="email" required />
    </div>

    <div class="form-actions">
      <StyledButton type="button" text @click="handleCancel"> 취소 </StyledButton>
      <StyledButton type="submit" color="success" :loading="isSubmitting">
        {{ isSubmitting ? '제출 중...' : '제출' }}
      </StyledButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
const isSubmitting = ref(false);

const handleSubmit = async () => {
  isSubmitting.value = true;
  // API 호출 로직
  await new Promise(resolve => setTimeout(resolve, 2000));
  isSubmitting.value = false;
};

const handleCancel = () => {
  email.value = '';
};
</script>
```

---

## ♿ 접근성

StyledButton 컴포넌트는 WCAG 2.1 AA 기준을 준수하도록 설계되었습니다:

### 키보드 네비게이션

- `Tab` 키로 포커스 가능
- `Enter` 또는 `Space` 키로 클릭 가능
- 포커스 시 시각적 표시 제공

### 스크린 리더 지원

- 적절한 `role` 속성
- `aria-label` 지원 (아이콘 전용 버튼)
- 로딩 상태 시 `aria-busy` 속성

### 색상 대비

- 모든 색상 조합이 최소 4.5:1 대비율 준수
- 비활성화 상태에서도 충분한 대비 제공

---

## 🎯 디자인 시스템

### 색상 팔레트

- **Primary**: `#4f46e5` (인디고)
- **Secondary**: `#64748b` (슬레이트)
- **Success**: `#22c55e` (그린)
- **Warning**: `#f59e0b` (옐로우)
- **Danger**: `#ef4444` (레드)
- **Info**: `#3b82f6` (블루)
- **Light**: `#f3f4f6` (라이트 그레이)
- **Dark**: `#1f2937` (다크 그레이)

### 크기 시스템

- **xSmall**: 2.4rem 높이, 16px 아이콘
- **Small**: 3.2rem 높이, 18px 아이콘
- **Default**: 4rem 높이, 20px 아이콘
- **Large**: 4.8rem 높이, 24px 아이콘

### 간격 시스템

- 프로젝트의 `$spacing-*` 변수 활용
- 일관된 패딩과 마진 적용

---

## 🔧 커스터마이징

### CSS 변수 오버라이드

```scss
.btn {
  --btn-border-radius: 0.5rem;
  --btn-transition: 0.3s ease;
}
```

### 테마별 스타일링

```scss
.btn {
  &[data-theme='dark'] {
    background-color: var(--dark-bg);
    color: var(--dark-text);
  }
}
```

---

## 📚 추가 리소스

- [Iconify 아이콘 검색](https://icones.js.org/)
- [Material Design Icons](https://pictogrammers.com/library/mdi/)
- [Heroicons](https://heroicons.com/)
- [Font Awesome](https://fontawesome.com/)

---

## 📝 업데이트 히스토리

- **2024.01.XX**: Iconify 통합 및 디자인 시스템 개선
- **2024.01.XX**: 접근성 개선 및 WCAG 2.1 AA 준수
- **2024.01.XX**: TypeScript 타입 안전성 강화
- **2024.01.XX**: SCSS 변수 시스템 도입
- **2023.05.22**: x-small, large props 추가
- **2023.05.11**: outline 타입 개선 및 light color 제거
- **2023.04.28**: outline 타입 추가
- **2023.04.25**: disabled props 추가
- **2023.04.20**: 최초 작성
