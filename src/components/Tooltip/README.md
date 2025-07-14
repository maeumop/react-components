# Tooltip 컴포넌트

Vue 3 + TypeScript 기반의 유연하고 접근성 높은 툴팁 컴포넌트입니다.

## 📋 목차

1. [기능](#기능)
2. [설치 및 사용법](#설치-및-사용법)
3. [Props](#props)
4. [Slots](#slots)
5. [Methods](#methods)
6. [색상 테마](#색상-테마)
7. [예제](#예제)

---

## ✨ 기능

- 🎯 **4방향 위치 지원**: top, bottom, left, right
- 🎨 **7가지 색상 테마**: default, primary, secondary, success, warning, error, info
- 🌙 **다크 테마 지원**: `dark` prop으로 테마 변경
- 🖱️ **호버링 모드**: 마우스 호버로 툴팁 표시
- 📱 **반응형 디자인**: 모바일 환경 최적화
- ♿ **접근성**: ARIA 속성 및 키보드 네비게이션 지원
- 🎭 **커스터마이징**: slot을 통한 완전한 커스터마이징
- 🔄 **자동 위치 조정**: 윈도우 리사이즈 시 자동 재계산
- 📜 **스크롤 감지**: 부모 요소 스크롤 시 자동 닫기

---

## 🚀 설치 및 사용법

### 전역 등록

```typescript
import Tooltip from '@/components/Tooltip';

app.component('Tooltip', Tooltip);
```

### 컴포넌트에서 사용

```vue
<script setup lang="ts">
import Tooltip from '@/components/Tooltip';
</script>

<template>
  <Tooltip message="도움말 메시지입니다." />
</template>
```

---

## 📖 Props

| Prop       | Type                                                                                   | Default             | Description                            |
| ---------- | -------------------------------------------------------------------------------------- | ------------------- | -------------------------------------- |
| `message`  | `string \| string[]`                                                                   | -                   | 툴팁 메시지 (배열 입력 시 리스트 형태) |
| `title`    | `string`                                                                               | -                   | 툴팁 제목                              |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'`                                               | `'bottom'`          | 툴팁 표시 위치                         |
| `width`    | `number`                                                                               | -                   | 툴팁 최대 너비 (px)                    |
| `hovering` | `boolean`                                                                              | `false`             | 호버링 모드 활성화                     |
| `btnClose` | `boolean`                                                                              | `false`             | 닫기 버튼 표시                         |
| `icon`     | `string`                                                                               | `'mdi:help-circle'` | 아이콘 이름 (Iconify 형식)             |
| `iconSize` | `string`                                                                               | -                   | 아이콘 크기                            |
| `dark`     | `boolean`                                                                              | `false`             | 다크 테마 적용                         |
| `padding`  | `string`                                                                               | -                   | 패딩 스타일                            |
| `block`    | `boolean`                                                                              | `false`             | 블록 레벨 요소로 표시                  |
| `color`    | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'`         | 색상 테마                              |

### Position 상수 사용

```typescript
import { tooltipPosition } from '@/components/Tooltip/const'

// 사용 예시
<Tooltip :position="tooltipPosition.TOP" message="위쪽 툴팁" />
<Tooltip :position="tooltipPosition.BOTTOM" message="아래쪽 툴팁" />
<Tooltip :position="tooltipPosition.LEFT" message="왼쪽 툴팁" />
<Tooltip :position="tooltipPosition.RIGHT" message="오른쪽 툴팁" />
```

---

## 🎭 Slots

### default

툴팁을 표시할 대상 요소를 정의합니다.

```vue
<Tooltip message="커스텀 버튼">
  <button>클릭하세요</button>
</Tooltip>
```

**Slot Props:**

- `toggle: () => void` - 툴팁 토글 함수

### content

툴팁 내용을 완전히 커스터마이징합니다.

```vue
<Tooltip>
  <template #content="{ close }">
    <div class="custom-content">
      <h3>커스텀 제목</h3>
      <p>커스텀 내용</p>
      <button @click="close">닫기</button>
    </div>
  </template>
</Tooltip>
```

**Slot Props:**

- `close: () => void` - 툴팁 닫기 함수

---

## 🔧 Methods

### close()

툴팁을 즉시 닫습니다 (트랜지션 없음).

```vue
<script setup lang="ts">
import { ref } from 'vue';

const tooltipRef = ref();

const closeTooltip = () => {
  tooltipRef.value?.close();
};
</script>

<template>
  <Tooltip ref="tooltipRef" message="테스트" />
  <button @click="closeTooltip">툴팁 닫기</button>
</template>
```

---

## 🎨 색상 테마

### 기본 테마

Tooltip 컴포넌트는 7가지 색상 테마를 제공합니다:

- **default**: 기본 회색 테마
- **primary**: 주요 액션용 파란색 테마
- **secondary**: 보조 액션용 회색 테마
- **success**: 성공 메시지용 초록색 테마
- **warning**: 경고 메시지용 주황색 테마
- **error**: 오류 메시지용 빨간색 테마
- **info**: 정보 메시지용 파란색 테마

### 테마 상수 사용

```typescript
import { tooltipColor } from '@/components/Tooltip/const'

// 사용 예시
<Tooltip :color="tooltipColor.PRIMARY" message="주요 액션" />
<Tooltip :color="tooltipColor.SUCCESS" message="성공 메시지" />
<Tooltip :color="tooltipColor.ERROR" message="오류 메시지" />
```

### CSS 변수

테마별 CSS 변수를 통해 스타일을 오버라이드할 수 있습니다:

```scss
.tooltip-wrap {
  --tooltip-background-color: #custom-bg;
  --tooltip-border-color: #custom-border;
  --tooltip-text-color: #custom-text;
  --tooltip-icon-color: #custom-icon;
  --tooltip-shadow: custom-shadow;
}
```

---

## 📝 예제

### 기본 사용법

```vue
<template>
  <div class="examples">
    <!-- 기본 툴팁 -->
    <Tooltip message="기본 툴팁 메시지" />

    <!-- 위치별 툴팁 -->
    <Tooltip position="top" message="위쪽 툴팁" />
    <Tooltip position="right" message="오른쪽 툴팁" />
    <Tooltip position="left" message="왼쪽 툴팁" />
    <Tooltip position="bottom" message="아래쪽 툴팁" />
  </div>
</template>
```

### 색상 테마 예제

```vue
<script setup lang="ts">
import { tooltipColor } from '@/components/Tooltip/const';
</script>

<template>
  <div class="theme-examples">
    <!-- 기본 테마 -->
    <Tooltip color="default" message="기본 테마" />

    <!-- 색상별 테마 -->
    <Tooltip :color="tooltipColor.PRIMARY" message="주요 액션" />
    <Tooltip :color="tooltipColor.SECONDARY" message="보조 액션" />
    <Tooltip :color="tooltipColor.SUCCESS" message="성공 메시지" />
    <Tooltip :color="tooltipColor.WARNING" message="경고 메시지" />
    <Tooltip :color="tooltipColor.ERROR" message="오류 메시지" />
    <Tooltip :color="tooltipColor.INFO" message="정보 메시지" />
  </div>
</template>
```

### 고급 사용법

```

```
