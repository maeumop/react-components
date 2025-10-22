# Tabs Component (React)

React + TypeScript로 개발된 탭 컴포넌트입니다. 다양한 스타일과 트랜지션 효과를 지원합니다.

## 항목

1. [사용방법](#1-사용방법)
2. [Options](#2-options)
3. [Event](#3-event)
4. [접근성](#4-접근성)
5. [트랜지션](#5-트랜지션)

---

# 1. 사용방법

## 1.1. 기본 사용법

```tsx
import Tabs from '@/components/Tabs';
import { useState } from 'react';

const tabItems = ['탭 1', '탭 2', '탭 3'];
const [activeTab, setActiveTab] = useState(0);
const disabled = [false, true, false];

<Tabs
  activeTab={activeTab}
  onActiveTabChange={setActiveTab}
  tabItems={tabItems}
  disabled={disabled}
  variant="underline"
  transition="fade"
  inBox
>
  <div>탭 1 내용</div>
  <div>탭 2 내용</div>
  <div>탭 3 내용</div>
</Tabs>;
```

- children의 개수는 tabItems 배열의 길이와 일치해야 합니다.

:arrow_up: [항목](#항목)

---

# 2. options

| Name       | Type                                               | Default   | Description                    |
| ---------- | -------------------------------------------------- | --------- | ------------------------------ |
| tabItems   | string[]                                           | []        | 탭 이름 배열                   |
| inBox      | boolean                                            | false     | 탭 콘텐츠를 박스 스타일로 감쌈 |
| activeTab  | number                                             | 0         | 활성 탭 인덱스(v-model 지원)   |
| disabled   | boolean[]                                          | []        | 각 탭의 비활성화 여부          |
| variant    | 'default' \| 'underline' \| 'pills'                | 'default' | 탭 스타일 변형                 |
| transition | 'slide' \| 'fade' \| 'scale' \| 'flip' \| 'bounce' | 'slide'   | 탭 전환 애니메이션 효과        |

:arrow_up: [항목](#항목)

---

# 3. event

## 3.1. changeTab

- 탭이 변경될 때 발생, 변경된 탭의 index 값을 넘겨줌

:arrow_up: [항목](#항목)

---

# 4. 접근성

- 각 탭은 role="tab"/role="tablist"/aria-selected/aria-disabled 등 ARIA 속성 제공
- 키보드 방향키(←, →), Enter, Space로 탭 전환 가능
- 비활성화 탭은 포커스 및 클릭 불가

:arrow_up: [항목](#항목)

---

# 5. 트랜지션

## 5.1. 지원하는 트랜지션 효과

| 효과   | 설명                | 특징                      |
| ------ | ------------------- | ------------------------- |
| slide  | 좌우 슬라이드 효과  | 가장 자연스러운 전환      |
| fade   | 페이드 인/아웃 효과 | 부드럽고 깔끔한 효과      |
| scale  | 크기 변화 효과      | 시각적 임팩트가 큼        |
| flip   | 3D 플립 효과        | 현대적이고 독특한 효과    |
| bounce | 바운스 애니메이션   | 재미있고 생동감 있는 효과 |

## 5.2. 트랜지션 사용 예제

```tsx
{
  /* 기본 슬라이드 효과 */
}
<Tabs tabItems={tabItems} transition="slide">
  {/* 탭 콘텐츠 */}
</Tabs>;

{
  /* 페이드 효과 */
}
<Tabs tabItems={tabItems} transition="fade">
  {/* 탭 콘텐츠 */}
</Tabs>;

{
  /* 스케일 효과 */
}
<Tabs tabItems={tabItems} transition="scale">
  {/* 탭 콘텐츠 */}
</Tabs>;

{
  /* 플립 효과 */
}
<Tabs tabItems={tabItems} transition="flip">
  {/* 탭 콘텐츠 */}
</Tabs>;

{
  /* 바운스 효과 */
}
<Tabs tabItems={tabItems} transition="bounce">
  {/* 탭 콘텐츠 */}
</Tabs>;
```

## 5.3. 트랜지션 특징

- **slide**: 방향에 따라 왼쪽/오른쪽으로 슬라이드
- **fade**: 투명도 변화로 부드러운 전환
- **scale**: 크기 변화로 시각적 임팩트 제공
- **flip**: 3D 회전 효과로 현대적인 느낌 (방향에 따라 다른 회전 방향)
- **bounce**: 바운스 애니메이션으로 생동감 표현

## 5.4. 방향별 트랜지션 효과

일부 트랜지션은 탭 전환 방향에 따라 다른 효과를 제공합니다:

### slide 트랜지션

- **왼쪽으로 이동**: 새 탭이 오른쪽에서 슬라이드 인, 기존 탭이 왼쪽으로 슬라이드 아웃
- **오른쪽으로 이동**: 새 탭이 왼쪽에서 슬라이드 인, 기존 탭이 오른쪽으로 슬라이드 아웃

### flip 트랜지션

- **왼쪽으로 이동**: 새 탭이 오른쪽에서 Y축 -90도로 플립 인, 기존 탭이 왼쪽으로 Y축 90도로 플립 아웃 (회전 축: 왼쪽)
- **오른쪽으로 이동**: 새 탭이 왼쪽에서 Y축 90도로 플립 인, 기존 탭이 오른쪽으로 Y축 -90도로 플립 아웃 (회전 축: 오른쪽)

:arrow_up: [항목](#항목)

---

# 6. 스타일

- variant: 'default', 'underline', 'pills' 지원
- transition: 'slide', 'fade', 'scale', 'flip', 'bounce' 지원
- 색상 및 간격은 variables.scss 기반으로 커스터마이즈 가능

---

# UPDATE HISTORY

- **2024.12**: Vue에서 React로 마이그레이션, @iconify/react에서 @mui/icons-material로 아이콘 라이브러리 변경
- **2024.06**: 개선: v-model, disabled, variant, 접근성, 스타일 등 확장
- **2024.12**: 추가: 트랜지션 효과 5가지 추가 (slide, fade, scale, flip, bounce)
- **2023.03.08**: 최초 작성
