# DropMenu 컴포넌트 (React)

React + TypeScript로 개발된 접근성과 사용성을 고려한 드롭다운 메뉴 컴포넌트입니다. 다양한 애니메이션 효과와 색상 테마를 지원하며, 키보드 네비게이션과 ARIA 속성을 통해 완전한 접근성을 제공합니다.

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
3. [이벤트](#3-이벤트)
4. [타입](#4-타입)
5. [접근성](#5-접근성)
6. [예제](#6-예제)

---

## 1. 사용방법

### 1.1. 기본 사용법

```tsx
import DropMenu from './DropMenu';
import type { DropMenuItem } from './DropMenu/types';

import {
  Person as AccountIcon,
  Settings as CogIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

const menuItems: DropMenuItem[] = [
  { text: '프로필 보기', action: () => console.log('프로필 보기'), icon: AccountIcon },
  { text: '설정', action: () => console.log('설정'), icon: CogIcon },
  { text: '로그아웃', action: () => console.log('로그아웃'), icon: LogoutIcon },
];

<DropMenu items={menuItems}>
  <button>드롭메뉴 열기</button>
</DropMenu>;
```

### 1.2. 고급 사용법

```tsx
import DropMenu from './DropMenu';
import { dropMenuPosition, dropMenuTransition, dropMenuColor } from './DropMenu/const';

const handleOpen = () => {
  console.log('드롭메뉴가 열렸습니다');
};
const handleClose = () => {
  console.log('드롭메뉴가 닫혔습니다');
};
const handleItemClick = (item: DropMenuItem, index: number) => {
  console.log(`메뉴 아이템 클릭: ${item.text} (인덱스: ${index})`);
};

<DropMenu
  items={menuItems}
  position={dropMenuPosition.bottom}
  transition={dropMenuTransition.bounce}
  color={dropMenuColor.primary}
  width={200}
  onOpen={handleOpen}
  onClose={handleClose}
  onItemClick={handleItemClick}
>
  <button>고급 드롭메뉴</button>
</DropMenu>;
```

---

## 2. Props

| 이름             | 타입                | 기본값    | 설명                      |
| ---------------- | ------------------- | --------- | ------------------------- |
| items            | DropMenuItem[]      | **필수**  | 드롭다운 메뉴 아이템 목록 |
| position         | DropMenuPosition    | 'bottom'  | 메뉴가 표시될 위치        |
| transition       | DropMenuTransition  | 'slide'   | 애니메이션 효과           |
| width            | number              | undefined | 메뉴 너비 (픽셀)          |
| color            | DropMenuColor       | 'primary' | 메뉴 색상 테마            |
| disabled         | boolean             | false     | 전체 드롭메뉴 비활성화    |
| disableAutoClose | boolean             | false     | 자동 닫힘 비활성화        |
| onOpen           | () => void          |           | 메뉴가 열릴 때 콜백       |
| onClose          | () => void          |           | 메뉴가 닫힐 때 콜백       |
| onItemClick      | (item, idx) => void |           | 메뉴 아이템 클릭 시 콜백  |

### 2.1. Position 옵션

- 'top', 'bottom'(기본값), 'left', 'right'

### 2.2. Transition 옵션

- 'slide'(기본값), 'fade', 'scale', 'bounce', 'flip', 'elastic', 'swing'
- 모든 트랜지션은 0.3초로 통일된 지속 시간을 가집니다.

### 2.3. Color 옵션

- 'primary'(기본값), 'secondary', 'success', 'warning', 'error', 'info', 'light', 'dark'

---

## 3. 이벤트

| 이름        | 인자                              | 설명                     |
| ----------- | --------------------------------- | ------------------------ |
| onOpen      | -                                 | 드롭메뉴가 열릴 때 호출  |
| onClose     | -                                 | 드롭메뉴가 닫힐 때 호출  |
| onItemClick | (item: DropMenuItem, idx: number) | 메뉴 아이템 클릭 시 호출 |

---

## 4. 타입

### 4.1. DropMenuItem

```ts
interface DropMenuItem {
  text: string; // 메뉴 아이템 텍스트
  action: () => void; // 클릭 시 실행할 함수
  icon?: IconComponent; // 아이콘 (Material-UI 아이콘 컴포넌트)
  disabled?: boolean; // 비활성화 여부
}
```

### 4.2. DropMenuProps

```ts
interface DropMenuProps {
  items: DropMenuItem[];
  position?: DropMenuPosition;
  transition?: DropMenuTransition;
  width?: number;
  color?: DropMenuColor;
  disabled?: boolean;
  disableAutoClose?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onItemClick?: (item: DropMenuItem, idx: number) => void;
}
```

### 4.3. 기타 타입

```ts
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

## 5. 접근성

- **Enter/Space**: 드롭메뉴 토글
- **Arrow Down/Up**: 메뉴 아이템 간 이동
- **Escape**: 드롭메뉴 닫기
- 드롭메뉴가 열리면 첫 번째 메뉴 아이템에 자동 포커스
- 메뉴 아이템 간 순환 포커스 지원
- 외부 클릭/스크롤 시 자동 닫힘 (disableAutoClose가 false인 경우)
- ARIA 속성: role="button", aria-expanded, aria-haspopup, role="menu", role="menuitem", aria-disabled 등 적용

---

## 6. 예제

자세한 예제는 ex.tsx 파일을 참고하세요.

```tsx
<DropMenu items={menuItems} color="success" transition="flip">
  <button>플립 효과 + 성공 테마</button>
</DropMenu>
```

---

## 업데이트 히스토리

- **2024.12.XX**: @iconify/react에서 @mui/icons-material로 아이콘 라이브러리 변경
- **2024.12.XX**: 트랜지션 효과 통일 (0.3초), zoom 효과 제거, 스크롤 이벤트 처리 개선
- **2024.12.XX**: 새로운 트랜지션 효과 추가 (bounce, flip, elastic, swing), danger → error 색상 변경
- **2024.12.XX**: 접근성 개선, 키보드 네비게이션 추가, 색상 테마 확장
- **2023.05.12**: props color 추가, 메뉴 icon 옵션 추가
- **2023.04.24**: 최초 작성
