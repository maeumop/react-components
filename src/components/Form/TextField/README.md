# TextField 컴포넌트 (React)

React + TypeScript로 개발된 텍스트 입력 컴포넌트입니다. 기본 입력, 유효성 검사, 아이콘, textarea 등 다양한 기능을 지원합니다.

## 주요 기능

- ✅ 기본 텍스트 입력 (input, textarea)
- ✅ 유효성 검사 (validate 함수, pattern)
- ✅ 아이콘 지원 (왼쪽/오른쪽 위치)
- ✅ 글자 수 카운팅
- ✅ 클리어 버튼
- ✅ 에러 메시지 표시 (트랜지션 효과)
- ✅ 자동 포커스
- ✅ 비활성화/읽기 전용 모드
- ✅ 반응형 디자인 (block prop)

## Props

| Prop           | Type                                                                     | Default  | Description               |
| -------------- | ------------------------------------------------------------------------ | -------- | ------------------------- |
| `value`        | `string`                                                                 | `''`     | 입력값 (컨트롤드)         |
| `onChange`     | `(value: string) => void`                                                |          | 값 변경 핸들러            |
| `onBlur`       | `(e: React.FocusEvent<HTMLInputElement \| HTMLTextAreaElement>) => void` |          | blur 이벤트 핸들러        |
| `type`         | `'text' \| 'password' \| 'number' \| 'tel'`                              | `'text'` | 입력 타입                 |
| `placeholder`  | `string`                                                                 | `''`     | 플레이스홀더 텍스트       |
| `label`        | `string`                                                                 | `''`     | 라벨 텍스트               |
| `required`     | `boolean`                                                                | `false`  | 필수 입력 여부            |
| `disabled`     | `boolean`                                                                | `false`  | 비활성화 여부             |
| `readonly`     | `boolean`                                                                | `false`  | 읽기 전용 여부            |
| `multiline`    | `boolean`                                                                | `false`  | textarea 모드 여부        |
| `rows`         | `number`                                                                 | `5`      | textarea 행 수            |
| `height`       | `string`                                                                 | `''`     | textarea 높이             |
| `width`        | `string`                                                                 | `''`     | 입력 필드 너비            |
| `block`        | `boolean`                                                                | `false`  | 전체 너비 사용 여부       |
| `icon`         | `string`                                                                 | `''`     | 아이콘 이름               |
| `iconLeft`     | `boolean`                                                                | `false`  | 아이콘을 왼쪽에 배치      |
| `iconAction`   | `(event: React.MouseEvent) => void`                                      |          | 아이콘 클릭 이벤트        |
| `clearable`    | `boolean`                                                                | `false`  | 클리어 버튼 표시 여부     |
| `isCounting`   | `boolean`                                                                | `false`  | 글자 수 카운팅 여부       |
| `maxLength`    | `number`                                                                 | `0`      | 최대 글자 수              |
| `autofocus`    | `boolean`                                                                | `false`  | 자동 포커스 여부          |
| `validate`     | `RuleFunc[]`                                                             | `[]`     | 유효성 검사 함수 배열     |
| `pattern`      | `[RegExp, string]`                                                       |          | 정규식 패턴과 에러 메시지 |
| `blurValidate` | `boolean`                                                                | `true`   | blur 시 유효성 검사 여부  |
| `errorMessage` | `string`                                                                 | `''`     | 에러 메시지               |
| `hideMessage`  | `boolean`                                                                | `false`  | 에러 메시지 숨김 여부     |

## Expose Methods (ref)

| Method          | Parameters            | Return    | Description             |
| --------------- | --------------------- | --------- | ----------------------- |
| `check`         | `(silence?: boolean)` | `boolean` | 유효성 검사 실행        |
| `resetForm`     | -                     | `void`    | 폼 초기화               |
| `resetValidate` | -                     | `void`    | 유효성 검사 상태 초기화 |

## 사용 예제

### 기본 입력

```tsx
import React, { useState } from 'react';
import TextField from './index';

const [text, setText] = useState('');

<TextField block value={text} onChange={setText} placeholder="기본 텍스트 입력" />;
```

### 유효성 검사

```tsx
import React, { useState } from 'react';
import TextField from './index';

const [email, setEmail] = useState('');
const validateEmail = (value: unknown) => {
  if (typeof value !== 'string') return '문자열을 입력해주세요.';
  const emailRegex = /^[^\s@]+@[^ 0-9]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return '올바른 이메일 형식을 입력해주세요.';
  }
  return true;
};

<TextField
  block
  value={email}
  onChange={setEmail}
  validate={[validateEmail]}
  placeholder="이메일 입력"
/>;
```

### 아이콘과 클리어 버튼

```tsx
import React, { useState } from 'react';
import TextField from './index';

const [searchText, setSearchText] = useState('');
const handleSearch = () => {
  alert('검색!');
};

<TextField
  block
  value={searchText}
  onChange={setSearchText}
  icon="mdi:magnify"
  iconAction={handleSearch}
  placeholder="검색어 입력"
  clearable
/>;
```

### Textarea

```tsx
import React, { useState } from 'react';
import TextField from './index';

const [content, setContent] = useState('');

<TextField
  block
  value={content}
  onChange={setContent}
  multiline
  rows={4}
  placeholder="여러 줄 텍스트 입력"
  label="메모"
/>;
```

### 글자 수 카운팅

```tsx
import React, { useState } from 'react';
import TextField from './index';

const [description, setDescription] = useState('');

<TextField
  block
  value={description}
  onChange={setDescription}
  isCounting
  maxLength={100}
  placeholder="최대 100자까지 입력"
  label="소개글"
/>;
```

### 패턴 검사

```tsx
import React, { useState } from 'react';
import TextField from './index';

const [phoneNumber, setPhoneNumber] = useState('');
const phonePattern = /^\d{3}-\d{4}-\d{4}$/;

<TextField
  block
  value={phoneNumber}
  onChange={setPhoneNumber}
  pattern={[phonePattern, '올바른 전화번호 형식을 입력해주세요.']}
  placeholder="전화번호 입력 (000-0000-0000)"
/>;
```

## 스타일 커스터마이징

컴포넌트는 SCSS로 작성되어 있으며, CSS 변수를 통해 테마를 커스터마이징할 수 있습니다.

```scss
// 주요 CSS 변수
:root {
  --textfield-border-color: #e9ecef;
  --textfield-focus-color: #667eea;
  --textfield-error-color: #dc3545;
  --textfield-text-color: #333;
  --textfield-placeholder-color: #6c757d;
}
```

## 트랜지션/애니메이션

- 에러 메시지는 트랜지션 효과와 함께 표시됩니다.
- 트랜지션은 SCSS와 React 상태를 활용하여 구현되었습니다.

## 접근성

- ARIA 라벨 지원
- 키보드 네비게이션 지원
- 스크린 리더 호환성
- 포커스 표시기 제공

## 브라우저 지원

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 변경 이력/주요 개선점

- isValidate 상태 제거 (불필요한 중복 상태 제거)
- 트랜지션 효과 개선 (onAnimationEnd 활용)
- block prop 예제 기본 적용
- inputClass, wrapperClass, feedbackStatus 등 className 계산 최적화
- 타입 정의를 React 패턴에 맞게 개선
