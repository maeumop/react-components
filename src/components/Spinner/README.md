# Spinner 컴포넌트

Vue 3 + TypeScript로 구현된 로딩 스피너 컴포넌트입니다. 다양한 테마와 커스터마이징 옵션을 제공하며, 프로젝트의 디자인 시스템과 일관된 색상을 사용합니다.

## 주요 기능

- 🎨 **다양한 테마**: default, primary, secondary, success, warning, error, info
- 🎯 **커스터마이징**: 색상, 크기, 텍스트 등 자유로운 커스터마이징
- ⚡ **타입 안전성**: TypeScript로 완전한 타입 지원
- 📱 **반응형**: 모바일 환경에 최적화된 반응형 디자인
- 🎭 **애니메이션**: 부드러운 페이드 인/아웃 효과
- 🕐 **타임아웃**: 자동 타임아웃 기능으로 무한 로딩 방지
- 🎨 **디자인 시스템 통합**: CSS 클래스 기반 색상 테마 시스템

## 설치 및 사용법

### 1. 플러그인 등록

```typescript
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { SpinnerPlugin } from '@/components/Spinner';

const app = createApp(App);
app.use(SpinnerPlugin);
app.mount('#app');
```

### 2. 기본 사용법

```vue
<template>
  <div>
    <button @click="showSpinner">스피너 표시</button>
    <button @click="hideSpinner">스피너 숨기기</button>
  </div>
</template>

<script setup lang="ts">
import { useSpinner } from '@/components/Spinner';

const { show, hide } = useSpinner();

const showSpinner = () => {
  show('로딩 중...');
};

const hideSpinner = () => {
  hide();
};
</script>
```

## API

### useSpinner()

스피너를 제어하는 컴포지션 함수입니다.

#### 반환값

```typescript
{
  show: (text?: string, options?: SpinnerOptions) => void
  hide: () => void
  isLoading: Ref<boolean>
}
```

#### show(text?, options?)

스피너를 표시합니다.

- `text` (optional): 표시할 텍스트
- `options` (optional): 스피너 옵션

```typescript
// 기본 사용
show('로딩 중...');

// 옵션과 함께 사용
show('데이터를 불러오는 중...', {
  theme: 'primary',
  limitTime: 15,
});
```

#### hide()

스피너를 숨깁니다.

```typescript
hide();
```

#### isLoading

현재 스피너가 표시되고 있는지 여부를 나타내는 반응형 참조입니다.

```typescript
const { isLoading } = useSpinner()

// 템플릿에서 사용
<div v-if="isLoading">스피너가 표시 중입니다</div>
```

### SpinnerOptions

```typescript
interface SpinnerOptions {
  theme?: SpinnerTheme;
  limitTime?: number;
  colors?: SpinnerColors;
}
```

#### theme

사용할 테마를 지정합니다. 기본값은 `'default'`입니다.

```typescript
type SpinnerTheme = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
```

**사용 가능한 테마:**

- `default`: 검은색 배경에 흰색 텍스트/아이콘
- `primary`: 프로젝트 primary 색상 (#4f46e5)
- `secondary`: 프로젝트 secondary 색상 (#64748b)
- `success`: 성공 상태 색상 (#22c55e)
- `warning`: 경고 상태 색상 (#f59e0b)
- `error`: 오류 상태 색상 (#ef4444)
- `info`: 정보 상태 색상 (#3b82f6)

#### limitTime

스피너의 최대 표시 시간(초)을 지정합니다. 기본값은 `10`초입니다.

```typescript
show('로딩 중...', { limitTime: 15 });
```

#### colors

커스텀 색상을 지정합니다. 테마보다 우선순위가 높습니다.

```typescript
interface SpinnerColors {
  icon: string;
  text: string;
  background: string;
  backdrop: string;
}
```

```typescript
show('로딩 중...', {
  colors: {
    icon: '#ff6b6b',
    text: '#ff6b6b',
    background: 'rgba(255, 255, 255, 0.9)',
    backdrop: 'rgba(0, 0, 0, 0.4)',
  },
});
```

## 색상 테마 시스템

Spinner 컴포넌트는 CSS 클래스 기반의 색상 테마 시스템을 사용합니다. 각 테마는 CSS 변수를 통해 색상을 정의하며, 프로젝트의 디자인 시스템과 완전히 통합됩니다.

### 테마 클래스

각 테마는 다음과 같은 CSS 클래스로 정의됩니다:

```scss
.spinner-theme-default {
  --spinner-icon-color: #{$white};
  --spinner-text-color: #{$white};
  --spinner-background-color: rgba(0, 0, 0, 0.7);
  --spinner-backdrop-color: rgba(0, 0, 0, 0.5);
}

.spinner-theme-primary {
  --spinner-icon-color: #{$primary-color};
  --spinner-text-color: #{$primary-color};
  --spinner-background-color: rgba(255, 255, 255, 0.7);
  --spinner-backdrop-color: rgba(0, 0, 0, 0.3);
}

// ... 기타 테마들
```

### CSS 변수

스피너는 다음 CSS 변수들을 사용합니다:

- `--spinner-icon-color`: 아이콘 색상
- `--spinner-text-color`: 텍스트 색상
- `--spinner-background-color`: 스피너 컨테이너 배경색
- `--spinner-backdrop-color`: 전체 오버레이 배경색

### 커스텀 테마 생성

새로운 테마를 생성하려면 CSS 클래스를 정의하면 됩니다:

```scss
.spinner-theme-custom {
  --spinner-icon-color: #ff6b6b;
  --spinner-text-color: #ff6b6b;
  --spinner-background-color: rgba(255, 255, 255, 0.8);
  --spinner-backdrop-color: rgba(0, 0, 0, 0.4);
}
```

## 사용 예제

### 1. 기본 사용

```vue
<template>
  <div>
    <button @click="handleLoad">데이터 로드</button>
  </div>
</template>

<script setup lang="ts">
import { useSpinner } from '@/components/Spinner';

const { show, hide } = useSpinner();

const handleLoad = async () => {
  show('데이터를 불러오는 중...');

  try {
    await fetchData();
  } finally {
    hide();
  }
};
</script>
```

### 2. 테마 사용

```vue
<template>
  <div>
    <button @click="showSuccess">성공 스피너</button>
    <button @click="showError">오류 스피너</button>
  </div>
</template>

<script setup lang="ts">
import { useSpinner } from '@/components/Spinner';

const { show } = useSpinner();

const showSuccess = () => {
  show('성공적으로 처리되었습니다!', { theme: 'success' });
  setTimeout(() => hide(), 2000);
};

const showError = () => {
  show('오류가 발생했습니다', { theme: 'error' });
  setTimeout(() => hide(), 3000);
};
</script>
```

### 3. 커스텀 색상

```vue
<template>
  <div>
    <button @click="showCustom">커스텀 스피너</button>
  </div>
</template>

<script setup lang="ts">
import { useSpinner } from '@/components/Spinner';

const { show } = useSpinner();

const showCustom = () => {
  show('커스텀 스피너', {
    colors: {
      icon: '#ff6b6b',
      text: '#ff6b6b',
      background: 'rgba(255, 255, 255, 0.9)',
      backdrop: 'rgba(0, 0, 0, 0.4)',
    },
  });
};
</script>
```

### 4. 타임아웃 설정

```vue
<template>
  <div>
    <button @click="showWithTimeout">타임아웃 스피너</button>
  </div>
</template>

<script setup lang="ts">
import { useSpinner } from '@/components/Spinner';

const { show } = useSpinner();

const showWithTimeout = () => {
  show('오래 걸리는 작업...', { limitTime: 30 });
};
</script>
```

## 스타일 커스터마이징

### CSS 변수 사용

Spinner 컴포넌트는 CSS 변수를 통해 동적으로 색상을 변경할 수 있습니다:

```css
:root {
  --spinner-icon-color: #ff6b6b;
  --spinner-text-color: #ff6b6b;
  --spinner-background-color: rgba(255, 255, 255, 0.9);
  --spinner-backdrop-color: rgba(0, 0, 0, 0.4);
}
```

### SCSS 변수 사용

프로젝트의 SCSS 변수를 직접 사용할 수도 있습니다:

```scss
@import '@/assets/styles/variables.scss';

.custom-spinner {
  .spinner-icon {
    color: $primary-color;
  }

  .spinner-text {
    color: $primary-color;
  }
}
```

### 테마 클래스 확장

기존 테마를 확장하여 새로운 스타일을 추가할 수 있습니다:

```scss
.spinner-theme-primary {
  --spinner-icon-color: #{$primary-color};
  --spinner-text-color: #{$primary-color};
  --spinner-background-color: rgba(255, 255, 255, 0.7);
  --spinner-backdrop-color: rgba(0, 0, 0, 0.3);

  // 추가 스타일
  .spinner-container {
    border: 2px solid $primary-color;
  }
}
```

## 접근성

- 스크린 리더 지원을 위한 적절한 ARIA 속성
- 키보드 네비게이션 지원
- 고대비 모드 지원
- 애니메이션 감소 설정 지원

## 브라우저 지원

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 라이선스

MIT License
