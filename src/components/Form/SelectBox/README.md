# SelectBox Component

단일/다중 선택이 가능한 고급 드롭다운 컴포넌트입니다. 검색, 키보드 네비게이션, 유효성 검사, 외부 클릭 감지, 스크롤 이벤트 처리 등 다양한 기능을 제공합니다.

## 주요 기능

- **단일/다중 선택**: 단일 또는 다중 선택 모드 지원
- **검색 기능**: 옵션 내 검색으로 빠른 선택 (300ms 디바운싱)
- **키보드 네비게이션**: 화살표 키, Enter, Escape, Tab 키 지원
- **전체 선택/해제**: 다중 선택 시 전체 선택/해제 기능
- **적용 버튼**: 다중 선택 시 적용 버튼으로 확정
- **유효성 검사**: 커스텀 유효성 검사 함수 지원
- **외부 클릭 감지**: 컴포넌트 외부 클릭 시 자동 닫기
- **스크롤 이벤트 처리**: 스크롤 시 옵션 목록 자동 닫기
- **접근성**: 라벨, 필수 표시, 키보드 접근성 지원
- **반응형**: 스크롤 위치에 따른 드롭다운 방향 자동 조정
- **메모리 최적화**: 이벤트 리스너 자동 정리 및 메모리 누수 방지

## 사용 방법

### 기본 사용법

```vue
<script setup lang="ts">
import { ref } from 'vue';
import SelectBox from '@/components/Form/SelectBox/index.vue';

const selectedValue = ref<string>('');
const options = ref([
  { text: '옵션 1', value: 'option1' },
  { text: '옵션 2', value: 'option2' },
  { text: '옵션 3', value: 'option3' },
]);
</script>

<template>
  <SelectBox v-model="selectedValue" :options="options" placeholder="옵션을 선택하세요" />
</template>
```

### 다중 선택

```vue
<script setup lang="ts">
const selectedValues = ref<string[]>([]);
</script>

<template>
  <SelectBox
    v-model="selectedValues"
    :options="options"
    :multiple="true"
    placeholder="여러 옵션을 선택하세요"
  />
</template>
```

### 검색 기능

```vue
<template>
  <SelectBox
    v-model="selectedValue"
    :options="options"
    :searchable="true"
    placeholder="검색하여 선택하세요"
  />
</template>
```

### 적용 버튼 모드

```vue
<template>
  <SelectBox
    v-model="selectedValues"
    :options="options"
    :multiple="true"
    :btnAccept="true"
    placeholder="적용 버튼이 있는 다중 선택"
  />
</template>
```

### 유효성 검사

```vue
<script setup lang="ts">
const validateRequired = (value: unknown): string | boolean => {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '필수 선택 항목입니다.';
    }
  } else {
    if (!value || value === '') {
      return '필수 선택 항목입니다.';
    }
  }
  return true;
};

const validateMinSelection = (value: unknown): string | boolean => {
  if (Array.isArray(value) && value.length < 2) {
    return '최소 2개 이상 선택해주세요.';
  }
  return true;
};

const validateMaxSelection = (value: unknown): string | boolean => {
  if (Array.isArray(value) && value.length > 3) {
    return '최대 3개까지 선택 가능합니다.';
  }
  return true;
};
</script>

<template>
  <SelectBox
    v-model="selectedValue"
    :options="options"
    :validate="[validateRequired]"
    placeholder="필수 선택"
    required
  />

  <SelectBox
    v-model="selectedValues"
    :options="options"
    :multiple="true"
    :validate="[validateRequired, validateMinSelection, validateMaxSelection]"
    placeholder="2-3개 선택"
    required
  />
</template>
```

### 라벨과 스타일

```vue
<template>
  <!-- 기본 라벨 -->
  <SelectBox
    v-model="selectedValue"
    :options="options"
    label="카테고리"
    placeholder="카테고리를 선택하세요"
    required
  />

  <!-- 내부 라벨 -->
  <SelectBox
    v-model="selectedValue"
    :options="options"
    :inLabel="true"
    label="카테고리"
    placeholder="카테고리를 선택하세요"
  />

  <!-- 짧은 표시 모드 -->
  <SelectBox
    v-model="selectedValues"
    :options="options"
    :multiple="true"
    :isShort="true"
    placeholder="짧은 표시 모드"
  />
</template>
```

## Props

| Name         | Type               | Default | Description                  |
| ------------ | ------------------ | ------- | ---------------------------- |
| modelValue   | string \| string[] | -       | **필수** - 선택된 값         |
| options      | SelectBoxItem[]    | -       | **필수** - 선택 옵션 배열    |
| label        | string             | ''      | 라벨 텍스트                  |
| inLabel      | boolean            | false   | 라벨을 선택 박스 내부에 표시 |
| placeholder  | string             | ''      | 플레이스홀더 텍스트          |
| block        | boolean            | false   | display: block으로 표시      |
| validate     | RuleFunc[]         | []      | 유효성 검사 함수 배열        |
| errorMessage | string             | ''      | 강제로 표시할 에러 메시지    |
| width        | string             | -       | 컴포넌트 너비                |
| multiple     | boolean            | false   | 다중 선택 모드               |
| readonly     | boolean            | false   | 읽기 전용 모드               |
| disabled     | boolean            | false   | 비활성화                     |
| required     | boolean            | false   | 필수 선택 표시 (\*)          |
| isShort      | boolean            | false   | 짧은 표시 모드               |
| btnAccept    | boolean            | false   | 적용 버튼 표시               |
| labelText    | boolean            | false   | 라벨 텍스트 모드             |
| maxLength    | number             | 0       | 최대 선택 개수               |
| searchable   | boolean            | false   | 검색 기능 활성화             |
| hideMessage  | boolean            | false   | 에러 메시지 숨김             |
| blurValidate | boolean            | true    | 블러 시 유효성 검사          |
| clearable    | boolean            | false   | 클리어 버튼 표시             |
| isLoading    | boolean            | false   | 로딩 상태 표시               |

## Events

| Name                 | Parameters                  | Description                    |
| -------------------- | --------------------------- | ------------------------------ |
| update:modelValue    | (value: string \| string[]) | 선택된 값이 변경될 때 발생     |
| update:selectedIndex | (index: number)             | 선택된 인덱스가 변경될 때 발생 |
| blur                 | (value: string \| string[]) | 포커스가 벗어날 때 발생        |
| focus                | (event: FocusEvent)         | 포커스가 들어올 때 발생        |
| change               | (value: string \| string[]) | 값이 변경될 때 발생            |

## Exposed Methods

| Name          | Parameters          | Return  | Description             |
| ------------- | ------------------- | ------- | ----------------------- |
| check         | (silence?: boolean) | boolean | 유효성 검사 실행        |
| resetForm     | ()                  | void    | 폼 초기화               |
| resetValidate | ()                  | void    | 유효성 검사 상태 초기화 |

## 키보드 단축키

- **화살표 위/아래**: 옵션 간 이동
- **Enter**: 옵션 선택 (다중 선택 시 전체 선택/해제도 지원)
- **Escape**: 드롭다운 닫기
- **Tab**: 포커스 이동 시 드롭다운 닫기

## 상호작용 기능

### 외부 클릭 감지

- 컴포넌트 외부 클릭 시 옵션 목록 자동 닫기
- 적용 버튼 모드에서는 외부 클릭 시 선택 취소

### 스크롤 이벤트 처리

- window 스크롤 시 옵션 목록 자동 닫기
- 부모 요소 스크롤 시 옵션 목록 자동 닫기
- overflow: auto/scroll 속성을 가진 모든 상위 요소 감지

### 검색 기능

- 300ms 디바운싱으로 성능 최적화
- 실시간 검색 결과 필터링
- 검색 중 키보드 네비게이션 지원

## 스타일링

컴포넌트는 다음과 같은 CSS 클래스를 제공합니다:

- `.select-box`: 메인 컨테이너
- `.select-box.block`: block 표시 모드
- `.options-wrap`: 라벨을 감싸는 컨테이너
- `.input-label`: 라벨 스타일
- `.required`: 필수 표시 (\*) 스타일
- `.control-wrap`: 선택 박스 컨트롤
- `.control-wrap.active`: 활성 상태
- `.control-wrap.error`: 에러 상태
- `.control-wrap.disabled`: 비활성화 상태
- `.text`: 선택된 텍스트 표시 영역
- `.text.ph`: 플레이스홀더 스타일
- `.item`: 다중 선택 시 선택된 항목
- `.btn-clear`: 클리어 버튼
- `.arrow`: 화살표 아이콘 (25px × 25px)
- `.option-list`: 드롭다운 옵션 리스트
- `.option-item`: 개별 옵션
- `.option-item.selected`: 선택된 옵션
- `.option-item.key-selected`: 키보드로 선택된 옵션
- `.checkbox`: 체크박스 컨테이너 (20px × 20px)
- `.search-wrap`: 검색 입력 영역
- `.btn-accept`: 적용 버튼
- `.feedback`: 에러 메시지 컨테이너

## 특징

### 자동 위치 조정

- 스크롤 위치에 따라 드롭다운이 위/아래로 자동 조정
- 화면 밖으로 나가지 않도록 위치 계산
- 동적 위치 재계산

### 메모리 최적화

- 이벤트 리스너 자동 정리
- 스크롤 이벤트 리스너 배열 관리
- 컴포넌트 언마운트 시 모든 리스너 정리
- 메모이제이션을 통한 성능 최적화

### 접근성

- 키보드 네비게이션 지원
- 스크린 리더 호환
- ARIA 속성 지원
- 포커스 관리

### 반응형 디자인

- 모바일 환경 최적화
- 터치 인터페이스 지원
- 다양한 화면 크기 대응

### 성능 최적화

- 옵션 리스트 메모이제이션
- 검색 디바운싱
- 이벤트 리스너 최적화
- 불필요한 리렌더링 방지

## 예제

더 많은 사용 예제는 [예제 페이지](./ex.vue)를 참조하세요.

## 주의사항

1. **옵션 데이터 구조**: `{ text: string, value: string }` 형태 필수
2. **다중 선택**: `multiple: true` 시 `modelValue`는 배열이어야 함
3. **검색 기능**: `searchable: true` 시 검색 입력 필드가 표시됨
4. **적용 버튼**: `btnAccept: true` 시 다중 선택에서 적용 버튼이 표시됨
5. **외부 클릭**: 컴포넌트 외부 클릭 시 자동으로 닫히므로, 모달이나 팝업에서 사용 시 주의
6. **스크롤 이벤트**: 스크롤 가능한 컨테이너 내에서 사용 시 자동으로 닫힘

## 변경 이력

### v1.2.0 (최신)

- 외부 클릭 감지 기능 추가
- 스크롤 이벤트 처리 개선 (window + 부모 요소)
- 체크박스 크기 개선 (20px × 20px)
- 화살표 아이콘 크기 증가 (25px × 25px)
- 검색 아이콘 크기 조정 (28px × 28px)
- 메모리 누수 방지 개선
- 타입 안전성 강화

### v1.1.0

- 검색 기능 디바운싱 추가
- 키보드 네비게이션 개선
- 유효성 검사 시스템 강화
- 접근성 개선

### v1.0.0

- 초기 버전 릴리즈
- 단일/다중 선택 기능
- 검색 기능
- 키보드 네비게이션
- 유효성 검사 시스템

:arrow_up: [Form Components 목차](../README.md)
