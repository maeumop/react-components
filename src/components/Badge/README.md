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
npm install @iconify/react
```

### 2. 컴포넌트 import

```typescript
import Badge from '@/components/Badge';
```

## 💡 기본 사용법

```tsx
import React from 'react';
import Badge from '@/components/Badge';

function App() {
  return (
    <Badge text="5">
      <button>알림</button>
    </Badge>
  );
}
```

## 📝 Props

| Prop           | Type                  | Default     | Description               |
| -------------- | --------------------- | ----------- | ------------------------- |
| `text`         | `string \| number`    | -           | 뱃지에 표시할 텍스트      |
| `color`        | `string`              | `'primary'` | 뱃지 색상                 |
| `size`         | `string`              | `'default'` | 뱃지 크기                 |
| `position`     | `string`              | `'right'`   | 뱃지 위치                 |
| `icon`         | `string`              | -           | Iconify 아이콘명          |
| `wrapperClass` | `string`              | -           | 뱃지 래퍼 요소의 클래스명 |
| `badgeClass`   | `string`              | -           | 뱃지 자체의 클래스명      |
| `children`     | `ReactNode`           | -           | 뱃지가 표시될 자식 요소   |
| `style`        | `React.CSSProperties` | -           | 인라인 스타일             |

### 색상 옵션 예시

```typescript
// badgeColor 예시
'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'light' | 'dark';
```

### 크기 옵션 예시

```typescript
// badgeSize 예시
'default' | 'large';
```

### 위치 옵션 예시

```typescript
// badgePosition 예시
'right' | 'left' | 'bottom-left' | 'bottom-right';
```

## 🎨 예제

### 기본 뱃지

```tsx
<Badge text="5">
  <button>알림</button>
</Badge>
```

### 다양한 색상과 위치

```tsx
<div className="row">
  <div className="col">
    <Badge color="warning" position="left" text="5">
      <button>좌측 상단</button>
    </Badge>
  </div>
  <div className="col">
    <Badge text="5">
      <button>우측 상단 (기본)</button>
    </Badge>
  </div>
  <div className="col">
    <Badge color="info" position="bottom-left" text="5">
      <button>좌측 하단</button>
    </Badge>
  </div>
  <div className="col">
    <Badge color="success" position="bottom-right" text="5">
      <button>우측 하단</button>
    </Badge>
  </div>
</div>
```

### 다양한 크기와 아이콘

```tsx
<div className="row">
  <div className="col">
    <Badge size="large" color="warning" position="left" text="5">
      <button>큰 뱃지</button>
    </Badge>
  </div>
  <div className="col">
    <Badge size="large" icon="mdi:bell" color="error">
      <button>아이콘 뱃지</button>
    </Badge>
  </div>
</div>
```

### 다양한 색상 예제

```tsx
<div className="row">
  <Badge color="primary" text="Primary">
    <button>Primary</button>
  </Badge>
  <Badge color="success" text="Success">
    <button>Success</button>
  </Badge>
  <Badge color="warning" text="Warning">
    <button>Warning</button>
  </Badge>
  <Badge color="error" text="Error">
    <button>Error</button>
  </Badge>
  <Badge color="info" text="Info">
    <button>Info</button>
  </Badge>
</div>
```

### 커스텀 클래스 사용

```tsx
<Badge text="5" color="primary" wrapperClass="custom-wrapper" badgeClass="custom-badge">
  <button>커스텀 스타일</button>
</Badge>

// 스타일 예시 (SCSS)
.custom-wrapper {
  position: relative;
  display: inline-block;
}
.custom-badge {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
```

## 🎯 아이콘 사용법

Iconify를 사용하여 다양한 아이콘을 사용할 수 있습니다:

```tsx
import { Icon } from '@iconify/react';

<Badge icon="mdi:bell" size="large">
  <button>알림</button>
</Badge>

<Badge icon="heroicons:user" size="large">
  <button>사용자</button>
</Badge>

<Badge icon="fa:github" size="large">
  <button>GitHub</button>
</Badge>
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
