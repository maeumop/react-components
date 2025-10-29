# StyledButton Component

React + TypeScript로 개발된 다재다능한 버튼 컴포넌트입니다. 다양한 색상, 크기, 스타일을 지원하며 접근성을 고려하여 설계되었습니다.

## 📋 목차

- [설치 및 설정](#설치-및-설정)
- [기본 사용법](#기본-사용법)
- [Props](#props)
- [이벤트](#이벤트)
- [스타일 변형](#스타일-변형)
- [아이콘 전용 버튼](#아이콘-전용-버튼)
- [예제](#예제)
- [접근성](#접근성)

---

## 🚀 설치 및 설정

### 1. 의존성 설치

```bash
npm install @mui/icons-material
```

### 2. 컴포넌트 import

```typescript
import StyledButton from '@/components/StyledButton';
```

---

## 📖 기본 사용법

### 기본 버튼

```tsx
import { Home as HomeIcon, ArrowForward as ArrowIcon, Menu as MenuIcon } from '@mui/icons-material';

<StyledButton>기본 버튼</StyledButton>
<StyledButton color="success">성공 버튼</StyledButton>
<StyledButton color="danger">위험 버튼</StyledButton>
```

### 아이콘 버튼

```tsx
<StyledButton icon={HomeIcon}>홈으로</StyledButton>
<StyledButton icon={ArrowIcon} iconRight>다음</StyledButton>
<StyledButton onlyIcon icon={MenuIcon} />
```

### 아이콘 전용 버튼

```tsx
// 기본 크기
<StyledButton onlyIcon icon={HomeIcon} color="primary" />

// 작은 크기
<StyledButton onlyIcon icon={SearchIcon} color="success" small />

// 큰 크기
<StyledButton onlyIcon icon={SettingsIcon} color="warning" large />
```

---

## ⚙️ Props

| Prop             | Type               | Default     | Description                 |
| ---------------- | ------------------ | ----------- | --------------------------- |
| `color`          | `ButtonColors`     | `'primary'` | 버튼 색상                   |
| `class`          | `string`           | `undefined` | 추가 CSS 클래스             |
| `href`           | `string`           | `'#'`       | 링크 URL (tag가 'a'일 때)   |
| `target`         | `string`           | `'_blank'`  | 링크 타겟                   |
| `icon`           | `IconComponent`    | `undefined` | Material-UI 아이콘 컴포넌트 |
| `iconRight`      | `boolean`          | `false`     | 아이콘을 오른쪽에 배치      |
| `onlyIcon`       | `boolean`          | `false`     | 아이콘만 표시               |
| `text`           | `boolean`          | `false`     | 텍스트 스타일 버튼          |
| `outline`        | `boolean`          | `false`     | 아웃라인 스타일             |
| `block`          | `boolean`          | `false`     | 전체 너비 버튼              |
| `disabled`       | `boolean`          | `false`     | 비활성화 상태               |
| `loading`        | `boolean`          | `false`     | 로딩 상태                   |
| `large`          | `boolean`          | `false`     | 큰 크기                     |
| `small`          | `boolean`          | `false`     | 작은 크기                   |
| `xSmall`         | `boolean`          | `false`     | 매우 작은 크기              |
| `tag`            | `string`           | `'a'`       | HTML 태그 ('a', 'button')   |
| `dropMenuToggle` | `boolean`          | `false`     | 드롭다운 토글 상태          |
| `width`          | `string \| number` | `undefined` | 버튼 너비 (px, %, rem 등)   |

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

```tsx
const handleClick = (event: React.MouseEvent) => {
  console.log('버튼이 클릭되었습니다!', event);
};

<StyledButton onClick={handleClick}>클릭하세요</StyledButton>;
```

---

## 🎨 스타일 변형

### 색상 변형

```tsx
<StyledButton color="primary">Primary</StyledButton>
<StyledButton color="secondary">Secondary</StyledButton>
<StyledButton color="success">Success</StyledButton>
<StyledButton color="warning">Warning</StyledButton>
<StyledButton color="danger">Danger</StyledButton>
<StyledButton color="info">Info</StyledButton>
<StyledButton color="light">Light</StyledButton>
<StyledButton color="dark">Dark</StyledButton>
```

### 크기 변형

```tsx
<StyledButton xSmall>매우 작음</StyledButton>
<StyledButton small>작음</StyledButton>
<StyledButton>기본</StyledButton>
<StyledButton large>큼</StyledButton>
```

### 스타일 변형

```tsx
{
  /* 기본 버튼 */
}
<StyledButton>기본</StyledButton>;

{
  /* 텍스트 버튼 */
}
<StyledButton text>텍스트</StyledButton>;

{
  /* 아웃라인 버튼 */
}
<StyledButton outline>아웃라인</StyledButton>;

{
  /* 아이콘 전용 버튼 */
}
<StyledButton onlyIcon icon={HomeIcon} />;
```

### Width 설정

```tsx
{/* 숫자로 설정 (px 단위) */}
<StyledButton width={120}>120px</StyledButton>

{/* 문자열로 설정 */}
<StyledButton width="200px">200px</StyledButton>
<StyledButton width="50%">50%</StyledButton>
<StyledButton width="10rem">10rem</StyledButton>
<StyledButton width="100%">전체 너비</StyledButton>
```

---

## 🎨 아이콘 전용 버튼

아이콘 전용 버튼은 텍스트 없이 아이콘만 표시하는 완전히 둥근 버튼입니다.

### 특징

- **완전히 둥근 모양**: `border-radius: 50%`
- **색상별 아이콘**: `color` prop에 따라 아이콘 색상 결정
- **호버 효과**: 호버 시 회색 배경 표시
- **3가지 크기**: 작음, 기본, 큼

### 크기별 스펙

| 크기 | 너비/높이 | 사용법                                        |
| ---- | --------- | --------------------------------------------- |
| 작음 | 1.8rem    | `<StyledButton onlyIcon icon={Icon} small />` |
| 기본 | 2.2rem    | `<StyledButton onlyIcon icon={Icon} />`       |
| 큼   | 2.6rem    | `<StyledButton onlyIcon icon={Icon} large />` |

### 색상별 예제

```tsx
import {
  Home as HomeIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  Favorite as HeartIcon,
  Star as StarIcon,
  Email as EmailIcon
} from '@mui/icons-material';

// 기본 크기 - 다양한 색상
<StyledButton onlyIcon icon={HomeIcon} color="primary" />
<StyledButton onlyIcon icon={SearchIcon} color="success" />
<StyledButton onlyIcon icon={SettingsIcon} color="warning" />
<StyledButton onlyIcon icon={HeartIcon} color="error" />
<StyledButton onlyIcon icon={StarIcon} color="info" />
<StyledButton onlyIcon icon={EmailIcon} color="secondary" />

// 크기별 예제
<StyledButton onlyIcon icon={HomeIcon} color="primary" small />
<StyledButton onlyIcon icon={SearchIcon} color="success" />
<StyledButton onlyIcon icon={SettingsIcon} color="warning" large />
```

### 스타일 특징

- **호버 효과**: 호버 시 `background-color: $gray-100` 적용
- **포커스 효과**: 포커스 시 outline과 배경 표시
- **부드러운 전환**: `transition: background-color 0.2s ease`
- **비활성화**: `opacity: 0.5`와 `cursor: not-allowed`

---

## 📝 예제

### 기본 예제

```tsx
import { Add as AddIcon, ArrowForward as ArrowIcon, Menu as MenuIcon } from '@mui/icons-material';

const ButtonExamples = () => {
  return (
    <div className="button-examples">
      {/* 색상별 버튼 */}
      <div className="row">
        <StyledButton color="primary">Primary</StyledButton>
        <StyledButton color="success">Success</StyledButton>
        <StyledButton color="warning">Warning</StyledButton>
        <StyledButton color="danger">Danger</StyledButton>
      </div>

      {/* 크기별 버튼 */}
      <div className="row">
        <StyledButton small>Small</StyledButton>
        <StyledButton>Default</StyledButton>
        <StyledButton large>Large</StyledButton>
      </div>

      {/* 스타일별 버튼 */}
      <div className="row">
        <StyledButton>Filled</StyledButton>
        <StyledButton text>Text</StyledButton>
        <StyledButton outline>Outline</StyledButton>
      </div>

      {/* 아이콘 버튼 */}
      <div className="row">
        <StyledButton icon={AddIcon}>Add Item</StyledButton>
        <StyledButton icon={ArrowIcon} iconRight>
          Next
        </StyledButton>
        <StyledButton onlyIcon icon={MenuIcon} />
      </div>

      {/* 상태별 버튼 */}
      <div className="row">
        <StyledButton loading>Loading</StyledButton>
        <StyledButton disabled>Disabled</StyledButton>
        <StyledButton block>Full Width</StyledButton>
      </div>

      {/* 아이콘 전용 버튼 */}
      <div className="row">
        <StyledButton onlyIcon icon={HomeIcon} color="primary" />
        <StyledButton onlyIcon icon={SearchIcon} color="success" small />
        <StyledButton onlyIcon icon={SettingsIcon} color="warning" large />
        <StyledButton onlyIcon icon={HeartIcon} color="error" />
        <StyledButton onlyIcon icon={StarIcon} color="info" small />
        <StyledButton onlyIcon icon={EmailIcon} color="secondary" large />
      </div>
    </div>
  );
};
```

### 폼 예제

```tsx
import { useState } from 'react';

const FormExample = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // API 호출 로직
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">이메일</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-actions">
        <StyledButton type="button" text onClick={handleCancel}>
          취소
        </StyledButton>
        <StyledButton type="submit" color="success" loading={isSubmitting}>
          {isSubmitting ? '제출 중...' : '제출'}
        </StyledButton>
      </div>
    </form>
  );
};
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
- 아이콘 전용 버튼은 `aria-label`로 접근성 보장

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

- [Material-UI Icons](https://mui.com/material-ui/material-icons/)
- [Material Design Icons](https://fonts.google.com/icons)

---

## 📝 업데이트 히스토리

- **2024.12**: 아이콘 전용 버튼 기능 추가 (완전히 둥근 모양, 색상별 아이콘, 크기별 지원)
- **2024.12**: @iconify/react에서 @mui/icons-material로 아이콘 라이브러리 변경, Vue에서 React로 마이그레이션
- **2024.01.XX**: Iconify 통합 및 디자인 시스템 개선
- **2024.01.XX**: 접근성 개선 및 WCAG 2.1 AA 준수
- **2024.01.XX**: TypeScript 타입 안전성 강화
- **2024.01.XX**: SCSS 변수 시스템 도입
- **2023.05.22**: x-small, large props 추가
- **2023.05.11**: outline 타입 개선 및 light color 제거
- **2023.04.28**: outline 타입 추가
- **2023.04.25**: disabled props 추가
- **2023.04.20**: 최초 작성
