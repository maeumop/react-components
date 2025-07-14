# DatePicker Component

단일/범위 날짜 선택이 가능한 고급 달력 컴포넌트입니다. 빠른 선택 버튼, 유효성 검사, 외부 클릭 감지, 스크롤 이벤트 처리 등 다양한 기능을 제공합니다.

## 주요 기능

- **단일/범위 선택**: 단일 날짜 또는 날짜 범위 선택 지원
- **빠른 선택 버튼**: 오늘, 어제, 최근 7일, 이번 달 등 자주 사용하는 기간
- **키보드 네비게이션**: Enter, Escape 키 지원
- **유효성 검사**: 커스텀 유효성 검사 함수 지원
- **외부 클릭 감지**: 컴포넌트 외부 클릭 시 자동 닫기
- **스크롤 이벤트 처리**: 스크롤 시 달력 자동 닫기
- **접근성**: ARIA 속성, 키보드 접근성 지원
- **반응형**: 화면 위치에 따른 달력 표시 방향 자동 조정
- **메모리 최적화**: 이벤트 리스너 자동 정리 및 메모리 누수 방지

## 사용 방법

### 기본 사용법

```vue
<script setup lang="ts">
import { ref } from 'vue';
import DatePicker from '@/components/Form/DatePicker/index.vue';

const selectedDate = ref<string>('');
const selectedRange = ref<string[]>(['', '']);
</script>

<template>
  <!-- 단일 날짜 선택 -->
  <DatePicker v-model="selectedDate" placeholder="날짜를 선택하세요" />

  <!-- 날짜 범위 선택 -->
  <DatePicker v-model="selectedRange" :range="true" :placeholder="['시작일', '종료일']" />
</template>
```

### 라벨과 스타일

```vue
<template>
  <!-- 라벨과 필수 표시 -->
  <DatePicker v-model="selectedDate" label="시작일" placeholder="시작일을 선택하세요" required />

  <!-- 최대 선택 기간 설정 -->
  <DatePicker
    v-model="selectedRange"
    :range="true"
    :max-range="7"
    :placeholder="['시작일', '종료일']"
  />
</template>
```

### 유효성 검사

```vue
<script setup lang="ts">
const validateRequired = (value: unknown): string | boolean => {
  if (Array.isArray(value)) {
    if (value.length === 0 || value.every(v => !v)) {
      return '필수 선택 항목입니다.';
    }
  } else {
    if (!value || value === '') {
      return '필수 선택 항목입니다.';
    }
  }
  return true;
};

const validateDateRange = (value: unknown): string | boolean => {
  if (Array.isArray(value) && value.length === 2) {
    const [start, end] = value;
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      if (startDate > endDate) {
        return '시작일은 종료일보다 이전이어야 합니다.';
      }
    }
  }
  return true;
};
</script>

<template>
  <DatePicker
    v-model="selectedRange"
    :range="true"
    :validate="[validateRequired, validateDateRange]"
    :placeholder="['시작일', '종료일']"
    required
  />
</template>
```

### 연도 범위 설정

```vue
<template>
  <DatePicker
    v-model="selectedDate"
    :min-year="2020"
    :max-year="2030"
    placeholder="2020-2030년 범위"
  />
</template>
```

### 구분자 설정

```vue
<template>
  <!-- 슬래시 구분자 -->
  <DatePicker v-model="selectedDate" separator="/" placeholder="슬래시 구분자" />

  <!-- 점 구분자 -->
  <DatePicker v-model="selectedDate" separator="." placeholder="점 구분자" />
</template>
```

## Props

| Name         | Type               | Default | Description             |
| ------------ | ------------------ | ------- | ----------------------- |
| modelValue   | string \| string[] | -       | **필수** - 선택된 날짜  |
| validate     | RuleFunc[]         | []      | 유효성 검사 함수 배열   |
| label        | string             | ''      | 라벨 텍스트             |
| placeholder  | string \| string[] | ''      | 플레이스홀더 텍스트     |
| range        | boolean            | false   | 날짜 범위 선택 모드     |
| separator    | string             | '-'     | 날짜 구분자             |
| minYear      | number             | 1900    | 최소 연도               |
| maxYear      | number             | 현재+10 | 최대 연도               |
| block        | boolean            | false   | display: block으로 표시 |
| required     | boolean            | false   | 필수 선택 표시 (\*)     |
| hideMessage  | boolean            | false   | 에러 메시지 숨김        |
| maxRange     | number             | 0       | 최대 선택 기간 (일)     |
| readonly     | boolean            | false   | 읽기 전용 모드          |
| disabled     | boolean            | false   | 비활성화                |
| blurValidate | boolean            | true    | 블러 시 유효성 검사     |
| defaultDate  | boolean            | false   | 기본 날짜 설정          |

## Events

| Name              | Parameters                  | Description                  |
| ----------------- | --------------------------- | ---------------------------- |
| update:modelValue | (value: string \| string[]) | 선택된 날짜가 변경될 때 발생 |
| update:set        | (value: string \| string[]) | 날짜가 설정될 때 발생        |
| blur              | ()                          | 포커스가 벗어날 때 발생      |

## Exposed Methods

| Name          | Parameters          | Return  | Description             |
| ------------- | ------------------- | ------- | ----------------------- |
| check         | (silence?: boolean) | boolean | 유효성 검사 실행        |
| resetForm     | ()                  | void    | 폼 초기화               |
| resetValidate | ()                  | void    | 유효성 검사 상태 초기화 |

## 키보드 단축키

- **Enter**: 달력 열기/닫기
- **Escape**: 달력 닫기

## 상호작용 기능

### 외부 클릭 감지

- 컴포넌트 외부 클릭 시 달력 자동 닫기
- 사용자 경험 향상을 위한 직관적인 동작

### 스크롤 이벤트 처리

- window 스크롤 시 달력 자동 닫기
- 부모 요소 스크롤 시 달력 자동 닫기
- overflow: auto/scroll 속성을 가진 모든 상위 요소 감지

### 빠른 선택 버튼

- 오늘, 어제, 최근 7일(오늘 포함), 최근 7일(오늘 제외), 이번 달, 지난 달
- 자주 사용하는 날짜 범위를 빠르게 선택 가능

## 스타일링

컴포넌트는 다음과 같은 CSS 클래스를 제공합니다:

- `.date-picker`: 메인 컨테이너
- `.date-picker.block`: block 표시 모드
- `.options-wrap`: 라벨을 감싸는 컨테이너
- `.input-label`: 라벨 스타일
- `.required`: 필수 표시 (\*) 스타일
- `.picker-date-text`: 날짜 입력 영역
- `.picker-date-text.active`: 활성 상태
- `.picker-date-text.error`: 에러 상태
- `.picker-date-text.disabled`: 비활성화 상태
- `.picker-popup`: 달력 팝업
- `.search-date`: 빠른 선택 버튼 영역
- `.pick-name-text`: 달력 헤더
- `.picker-wrap`: 달력 래퍼
- `.calendar`: 개별 달력
- `.btn-area`: 버튼 영역
- `.select-date`: 선택된 날짜 표시
- `.feedback`: 에러 메시지 컨테이너

## 특징

### 자동 위치 조정

- 화면 위치에 따라 달력이 위/아래로 자동 조정
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

- 날짜 계산 메모이제이션
- 이벤트 리스너 최적화
- 불필요한 리렌더링 방지

## 예제

더 많은 사용 예제는 [예제 페이지](./ex.vue)를 참조하세요.

## 주의사항

1. **날짜 형식**: YYYY-MM-DD 형식으로 반환됩니다
2. **범위 선택**: `range: true` 시 `modelValue`는 배열이어야 함
3. **최대 기간**: `maxRange` 설정 시 해당 일수를 초과하면 선택이 취소됩니다
4. **외부 클릭**: 컴포넌트 외부 클릭 시 자동으로 닫히므로, 모달이나 팝업에서 사용 시 주의
5. **스크롤 이벤트**: 스크롤 가능한 컨테이너 내에서 사용 시 자동으로 닫힘

## 변경 이력

### v1.2.0 (최신)

- 외부 클릭 감지 기능 추가
- 스크롤 이벤트 처리 개선 (window + 부모 요소)
- 접근성 개선 (ARIA 속성, 키보드 지원)
- 성능 최적화 (메모이제이션, 이벤트 리스너 관리)
- 스타일 개선 (deprecated 코드 제거, 반응형 디자인)
- 예제 페이지 및 README 추가

### v1.1.0

- 빠른 선택 버튼 기능 추가
- 유효성 검사 시스템 강화
- 키보드 네비게이션 개선
- 타입 안전성 강화

### v1.0.0

- 초기 버전 릴리즈
- 단일/범위 날짜 선택 기능
- 달력 UI 구현
- 기본 유효성 검사 시스템

:arrow_up: [Form Components 목차](../README.md)
