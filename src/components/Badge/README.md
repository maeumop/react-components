# Badge Component

뱃지는 알림, 상태, 카운터 등을 표시하는 작은 컴포넌트입니다.

## 📋 목차

- [설치](#설치)
- [기본 사용법](#기본-사용법)
- [Props](#props)
- [예제](#예제)

## 🚀 설치

### 1. Iconify 설치 (필수)

```bash
npm install @iconify/vue
```

### 2. 전역 등록

```typescript
import Badge from '@/components/Badge';

app.component('Badge', Badge);
```

## 💡 기본 사용법

```vue
<template>
  <Badge text="5">
    <Button>알림</Button>
  </Badge>
</template>

<script setup>
import { Icon } from '@iconify/vue';
</script>
```

## 📝 Props

| Prop           | Type            | Default     | Description               |
| -------------- | --------------- | ----------- | ------------------------- |
| `text`         | `string`        | -           | 뱃지에 표시할 텍스트      |
| `color`        | `BadgeColor`    | `'primary'` | 뱃지 색상                 |
| `size`         | `BadgeSize`     | `'default'` | 뱃지 크기                 |
| `position`     | `BadgePosition` | `'right'`   | 뱃지 위치                 |
| `icon`         | `string`        | -           | Iconify 아이콘명          |
| `wrapperClass` | `string`        | -           | 뱃지 래퍼 요소의 클래스명 |
| `badgeClass`   | `string`        | -           | 뱃지 자체의 클래스명      |

### 색상 옵션

```typescript
type BadgeColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'light'
  | 'dark';
```

### 크기 옵션

```typescript
type BadgeSize = 'default' | 'large';
```

### 위치 옵션

```typescript
type BadgePosition = 'right' | 'left' | 'bottom-left' | 'bottom-right';
```

## 🎨 예제

### 기본 뱃지

```vue
<template>
  <Badge text="5">
    <Button>알림</Button>
  </Badge>
</template>
```

### 다양한 색상과 위치

```vue
<template>
  <div class="row">
    <div class="col">
      <Badge color="warning" position="left" text="5">
        <Button>좌측 상단</Button>
      </Badge>
    </div>
    <div class="col">
      <Badge text="5">
        <Button>우측 상단 (기본)</Button>
      </Badge>
    </div>
    <div class="col">
      <Badge color="info" position="bottom-left" text="5">
        <Button>좌측 하단</Button>
      </Badge>
    </div>
    <div class="col">
      <Badge color="success" position="bottom-right" text="5">
        <Button>우측 하단</Button>
      </Badge>
    </div>
  </div>
</template>
```

### 다양한 크기와 아이콘

```vue
<template>
  <div class="row">
    <div class="col">
      <Badge size="large" color="warning" position="left" text="5">
        <Button>큰 뱃지</Button>
      </Badge>
    </div>
    <div class="col">
      <Badge size="large" icon="mdi:bell" color="error">
        <Button>아이콘 뱃지</Button>
      </Badge>
    </div>
  </div>
</template>
```

### 다양한 색상 예제

```vue
<template>
  <div class="row">
    <Badge color="primary" text="Primary">
      <Button>Primary</Button>
    </Badge>
    <Badge color="success" text="Success">
      <Button>Success</Button>
    </Badge>
    <Badge color="warning" text="Warning">
      <Button>Warning</Button>
    </Badge>
    <Badge color="error" text="Error">
      <Button>Error</Button>
    </Badge>
    <Badge color="info" text="Info">
      <Button>Info</Button>
    </Badge>
  </div>
</template>
```

### 커스텀 클래스 사용

```vue
<template>
  <Badge text="5" color="primary" wrapperClass="custom-wrapper" badgeClass="custom-badge">
    <Button>커스텀 스타일</Button>
  </Badge>
</template>

<style scoped>
.custom-wrapper {
  position: relative;
  display: inline-block;
}

.custom-badge {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
```

## 🎯 아이콘 사용법

Iconify를 사용하여 다양한 아이콘을 사용할 수 있습니다:

```vue
<template>
  <!-- Material Design Icons -->
  <Badge icon="mdi:bell" size="large">
    <Button>알림</Button>
  </Badge>

  <!-- Heroicons -->
  <Badge icon="heroicons:user" size="large">
    <Button>사용자</Button>
  </Badge>

  <!-- FontAwesome -->
  <Badge icon="fa:github" size="large">
    <Button>GitHub</Button>
  </Badge>
</template>
```

## ♿ 접근성

- `aria-label` 속성으로 스크린 리더 지원
- `role="status"` 속성으로 상태 정보 제공
- 키보드 네비게이션 지원

## 🔧 기술적 세부사항

### 크기별 스타일

- **default**: 1.6rem × 1.6rem, 0.8rem border-radius
- **large**: 2.2rem × 2.2rem, 1.1rem border-radius

### 색상 시스템

컴포넌트는 공통 색상 시스템을 상속받아 일관된 디자인을 제공합니다.

---

**업데이트 히스토리**

- 2024.01: size prop 도입, 색상 옵션 정리, 커스텀 클래스 지원 추가
- 2023.05: x-small, large props 추가
- 2023.04: 최초 작성
