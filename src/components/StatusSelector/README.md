# StatusSelector 컴포넌트 (React)

상태를 선택할 수 있는 드롭다운 컴포넌트입니다. 다양한 상태, 색상, 크기, 원형 표시, 읽기 전용, 커스텀 색상, 접근성(키보드 내비게이션) 지원.

## 기본 사용법

```tsx
import StatusSelector from './StatusSelector';
import type { StatusSelectorItem } from './StatusSelector/types';

const statusOptions: StatusSelectorItem[] = [
  { text: '대기중', value: 'pending', color: 'warning' },
  { text: '진행중', value: 'processing', color: 'info' },
  { text: '완료', value: 'completed', color: 'success' },
  { text: '오류', value: 'error', color: 'error' },
  { text: '취소', value: 'cancelled', color: 'secondary' },
];

const [selected, setSelected] = useState('pending');

<StatusSelector
  value={selected}
  options={statusOptions}
  onChange={(value, index) => setSelected(value)}
/>;
```

## Props

| 이름     | 타입                       | 필수 | 기본값   | 설명                  |
| -------- | -------------------------- | ---- | -------- | --------------------- |
| value    | string                     | O    |          | 현재 선택된 값        |
| options  | StatusSelectorItem[]       | O    |          | 선택 가능한 옵션 목록 |
| circle   | boolean                    |      | false    | 원형 표시기 사용 여부 |
| readOnly | boolean                    |      | false    | 읽기 전용 모드        |
| bgColor  | string                     |      | #efefef  | 배경 색상             |
| size     | 'small'\|'medium'\|'large' |      | 'medium' | 컴포넌트 크기         |
| onChange | (value, index) => void     |      |          | 값 변경 시 콜백       |

## StatusSelectorItem 타입

```ts
interface StatusSelectorItem {
  text: string; // 상태 텍스트
  value: string; // 상태 값
  color: string; // 상태 색상 (프리셋 또는 HEX)
}
```

## 이벤트

- onChange: 값이 변경될 때 호출됩니다. (value, index)

## 접근성

- 키보드 내비게이션 지원 (Enter/Space: 열기/닫기, ↑↓: 이동, ESC: 닫기)
- ARIA 속성 적용

## 예제

- 자세한 예제는 ex.tsx 파일 참고

## 스타일

- style.scss, BEM 네이밍, SCSS 사용

---

문의: 프론트엔드팀
