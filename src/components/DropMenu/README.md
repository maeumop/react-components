# DropMenu Component

Vue 3 + TypeScript로 개발된 접근성과 사용성을 고려한 드롭다운 메뉴 컴포넌트입니다. 다양한 애니메이션 효과와 색상 테마를 지원하며, 키보드 네비게이션과 ARIA 속성을 통해 완전한 접근성을 제공합니다.

## ✨ 주요 기능

- 🎨 **7가지 트랜지션 효과**: slide, fade, scale, bounce, flip, elastic, swing
- 🎯 **4가지 위치**: top, bottom, left, right
- 🌈 **8가지 색상 테마**: primary, secondary, success, warning, error, info, light, dark
- ♿ **완전한 접근성**: 키보드 네비게이션, ARIA 속성, 스크린 리더 지원
- 📱 **반응형 디자인**: 모든 디바이스에서 최적화된 경험
- ⚡ **성능 최적화**: GPU 가속 애니메이션, 스크롤 이벤트 처리

## 목차

1. [사용방법](#1-사용방법)
2. [Props](#2-props)
3. [Events](#3-events)
4. [Slots](#4-slots)
5. [Types](#5-types)
6. [접근성](#6-접근성)
7. [예제](#7-예제)

---

## 1. 사용방법

### 1.1. 기본 사용법

```vue
<template>
  <DropMenu :items="menuItems">
    <button>드롭메뉴 열기</button>
  </DropMenu>
</template>

<script setup lang="ts">
import DropMenu from '@/components/DropMenu';
import type { DropMenuItem } from '@/components/DropMenu/types';

const menuItems: DropMenuItem[] = [
  {
    text: '프로필 보기',
    action: () => console.log('프로필 보기'),
    icon: 'mdi:account',
  },
  {
    text: '설정',
    action: () => console.log('설정'),
    icon: 'mdi:cog',
  },
  {
    text: '로그아웃',
    action: () => console.log('로그아웃'),
    icon: 'mdi:logout',
  },
];
</script>
```

### 1.2. 고급 사용법

```vue
<template>
  <DropMenu
    :items="menuItems"
    position="bottom"
    transition="bounce"
    color="primary"
    :width="200"
    @open="handleOpen"
    @close="handleClose"
    @item-click="handleItemClick"
  >
    <button>고급 드롭메뉴</button>
  </DropMenu>
</template>

<script setup lang="ts">
import DropMenu from '@/components/DropMenu';
import { dropMenuPosition, dropMenuTransition, dropMenuColor } from '@/components/DropMenu/const';

const handleOpen = () => {
  console.log('드롭메뉴가 열렸습니다');
};

const handleClose = () => {
  console.log('드롭메뉴가 닫혔습니다');
};

const handleItemClick = (item: DropMenuItem, index: number) => {
  console.log(`메뉴 아이템 클릭: ${item.text} (인덱스: ${index})`);
};
</script>
```

---

## 2. Props

| Name               | Type                 | Default     | Description               |
| ------------------ | -------------------- | ----------- | ------------------------- |
| `items`            | `DropMenuItem[]`     | **필수**    | 드롭다운 메뉴 아이템 목록 |
| `position`         | `DropMenuPosition`   | `'bottom'`  | 메뉴가 표시될 위치        |
| `transition`       | `DropMenuTransition` | `'slide'`   | 애니메이션 효과           |
| `width`            | `number`             | `undefined` | 메뉴 너비 (픽셀)          |
| `color`            | `DropMenuColor`      | `'primary'` | 메뉴 색상 테마            |
| `disabled`         | `boolean`            | `false`     | 전체 드롭메뉴 비활성화    |
| `disableAutoClose` | `boolean`            | `false`     | 자동 닫힘 비활성화        |

### 2.1. Position 옵션

- `'top'`: 위쪽에 표시
- `'bottom'`: 아래쪽에 표시 (기본값)
- `'left'`: 왼쪽에 표시
- `'right'`: 오른쪽에 표시

### 2.2. Transition 옵션

- `'slide'`: 부드러운 슬라이드 효과 (기본값)
- `'fade'`: 페이드 인/아웃 효과
- `'scale'`: 확대/축소 효과
- `'bounce'`: 탄성 있는 바운스 효과
- `'flip'`: 3D 플립 효과
- `'elastic'`: 고무줄 같은 탄성 효과
- `'swing'`: 회전하면서 나타나는 효과

**모든 트랜지션은 0.3초로 통일된 지속 시간을 가집니다.**

### 2.3. Color 옵션

- `'primary'`: 주요 색상 (기본값)
- `'secondary'`: 보조 색상
- `'success'`: 성공 색상
- `'warning'`: 경고 색상
- `'error'`: 오류 색상
- `'info'`: 정보 색상
- `'light'`: 밝은 색상
- `'dark'`: 어두운 색상

---

## 3. Events

| Event        | Payload                               | Description              |
| ------------ | ------------------------------------- | ------------------------ |
| `open`       | -                                     | 드롭메뉴가 열릴 때 발생  |
| `close`      | -                                     | 드롭메뉴가 닫힐 때 발생  |
| `item-click` | `(item: DropMenuItem, index: number)` | 메뉴 아이템 클릭 시 발생 |

---

## 4. Slots

### 4.1. Default Slot

드롭메뉴를 활성화할 트리거 요소를 포함합니다.

#### Slot Props

| Name     | Type      | Description             |
| -------- | --------- | ----------------------- |
| `toggle` | `boolean` | 드롭메뉴 열림/닫힘 상태 |

#### 예제

```vue
<template>
  <DropMenu :items="menuItems">
    <template #default="{ toggle }">
      <button :class="{ active: toggle }">메뉴 {{ toggle ? '닫기' : '열기' }}</button>
    </template>
  </DropMenu>
</template>
```

---

## 5. Types

### 5.1. DropMenuItem

```typescript
interface DropMenuItem {
  /** 메뉴 아이템 텍스트 */
  text: string;
  /** 클릭 시 실행할 함수 */
  action: () => void;
  /** 아이콘 (Iconify 아이콘명) */
  icon?: string;
  /** 비활성화 여부 */
  disabled?: boolean;
}
```

### 5.2. DropMenuProps

```typescript
interface DropMenuProps {
  /** 드롭다운 메뉴 아이템 목록 */
  items: DropMenuItem[];
  /** 메뉴가 표시될 위치 */
  position?: DropMenuPosition;
  /** 애니메이션 효과 */
  transition?: DropMenuTransition;
  /** 메뉴 너비 (픽셀) */
  width?: number;
  /** 메뉴 색상 테마 */
  color?: DropMenuColor;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 자동 닫힘 비활성화 */
  disableAutoClose?: boolean;
}
```

### 5.3. 타입 정의

```typescript
type DropMenuPosition = 'top' | 'bottom' | 'left' | 'right';
type DropMenuTransition = 'slide' | 'fade' | 'scale' | 'bounce' | 'flip' | 'elastic' | 'swing';
type DropMenuColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'light'
  | 'dark';
```

---

## 6. 접근성

### 6.1. 키보드 네비게이션

- **Enter/Space**: 드롭메뉴 토글
- **Arrow Down/Up**: 메뉴 아이템 간 이동
- **Escape**: 드롭메뉴 닫기

### 6.2. ARIA 속성

- `role="button"`: 트리거 요소의 역할
- `aria-expanded`: 드롭메뉴 열림/닫힘 상태
- `aria-haspopup="true"`: 팝업 메뉴 존재 표시
- `role="menu"`: 메뉴 컨테이너 역할
- `role="menuitem"`: 메뉴 아이템 역할
- `aria-disabled`: 비활성화 상태 표시

### 6.3. 포커스 관리

- 드롭메뉴가 열리면 첫 번째 메뉴 아이템에 자동 포커스
- 메뉴 아이템 간 순환 포커스 지원
- 외부 클릭 시 자동 닫힘
- 스크롤 시 자동 닫힘 (disableAutoClose가 false인 경우)

---

## 7. 예제

### 7.1. 비활성화된 메뉴 아이템

```vue
<template>
  <DropMenu :items="menuItemsWithDisabled">
    <button>비활성화 메뉴</button>
  </DropMenu>
</template>

<script setup lang="ts">
const menuItemsWithDisabled: DropMenuItem[] = [
  {
    text: '활성 메뉴',
    action: () => console.log('활성 메뉴 클릭'),
    icon: 'mdi:check',
  },
  {
    text: '비활성 메뉴',
    action: () => console.log('이 메뉴는 비활성화되어 있습니다'),
    icon: 'mdi:close',
    disabled: true,
  },
  {
    text: '다른 메뉴',
    action: () => console.log('다른 메뉴 클릭'),
    icon: 'mdi:star',
  },
];
</script>
```

### 7.2. 자동 닫힘 비활성화

```vue
<template>
  <DropMenu :items="menuItems" :disable-auto-close="true">
    <button>자동 닫힘 비활성화</button>
  </DropMenu>
</template>
```

### 7.3. 고정 너비 설정

```vue
<template>
  <DropMenu :items="menuItems" :width="250">
    <button>고정 너비 메뉴</button>
  </DropMenu>
</template>
```

---

## 업데이트 히스토리

- **2024.12.XX**: 트랜지션 효과 통일 (0.3초), zoom 효과 제거, 스크롤 이벤트 처리 개선
- **2024.12.XX**: 새로운 트랜지션 효과 추가 (bounce, flip, elastic, swing), danger → error 색상 변경
- **2024.12.XX**: 접근성 개선, 키보드 네비게이션 추가, 색상 테마 확장
- **2023.05.12**: props color 추가, 메뉴 icon 옵션 추가
- **2023.04.24**: 최초 작성
