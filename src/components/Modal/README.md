# Modal 컴포넌트

Vue 3 + TypeScript로 개발된 현대적이고 접근성 높은 모달 컴포넌트입니다.

## ✨ 주요 기능

- 🎯 **다양한 위치 지원**: popup, center, top, bottom, left, right
- ⌨️ **키보드 접근성**: ESC 키로 닫기, 포커스 관리
- 🎨 **부드러운 애니메이션**: CSS 트랜지션과 cubic-bezier 이징
- 📱 **반응형 디자인**: 모바일 친화적 레이아웃
- ♿ **접근성 준수**: ARIA 속성, 스크린 리더 지원
- 🎭 **슬롯 기반**: 헤더, 바디, 액션 영역 커스터마이징
- 🔒 **뒤로가기 방지**: 라우터 네비게이션 제어

## 📦 설치

```bash
npm install @iconify/vue
```

## 🚀 기본 사용법

```vue
<template>
  <div>
    <button @click="showModal = true">모달 열기</button>

    <Modal v-model="showModal" title="제목" width="500px">
      <template #body>
        <p>모달 내용입니다.</p>
      </template>

      <template #action="{ close }">
        <button @click="close">닫기</button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Modal from '@/components/Modal';

const showModal = ref(false);
</script>
```

## 🎛️ Props

| Prop          | 타입            | 기본값    | 설명                    |
| ------------- | --------------- | --------- | ----------------------- |
| `modelValue`  | `boolean`       | `false`   | 모달 표시 여부          |
| `title`       | `string`        | `''`      | 모달 제목               |
| `width`       | `string`        | `'320px'` | 모달 너비               |
| `position`    | `ModalPosition` | `'popup'` | 모달 위치               |
| `escClose`    | `boolean`       | `false`   | ESC 키로 닫기 가능 여부 |
| `screenCover` | `boolean`       | `false`   | 화면 전체 덮기 여부     |
| `hideClose`   | `boolean`       | `false`   | 닫기 버튼 숨김 여부     |
| `accessBack`  | `boolean`       | `false`   | 뒤로가기 방지 여부      |

### ModalPosition 타입

```typescript
type ModalPosition = 'popup' | 'center' | 'top' | 'bottom' | 'left' | 'right';
```

## 📡 Events

| Event               | 타입                       | 설명                |
| ------------------- | -------------------------- | ------------------- |
| `update:modelValue` | `(value: boolean) => void` | 모달 표시 상태 변경 |
| `close`             | `() => void`               | 모달 닫힘           |

## 🎭 Slots

### 기본 슬롯

| Slot     | Props                   | 설명                   |
| -------- | ----------------------- | ---------------------- |
| `header` | `{ close: () => void }` | 헤더 영역 커스터마이징 |
| `body`   | `{ close: () => void }` | 바디 영역 (필수)       |
| `action` | `{ close: () => void }` | 액션 영역 (버튼 등)    |
| `title`  | -                       | 제목 영역 추가 콘텐츠  |

## 🎨 위치별 스타일

### popup (기본)

- 중앙에 표시
- 스케일 애니메이션
- 둥근 모서리

### center

- 중앙에 표시
- 페이드 애니메이션
- 둥근 모서리

### top

- 상단에 표시
- 슬라이드 다운 애니메이션
- 둥근 모서리

### bottom

- 하단에서 슬라이드 업
- 전체 너비
- 상단만 둥근 모서리

### left/right

- 좌/우측에서 슬라이드
- 전체 높이
- 한쪽만 둥근 모서리

## 🔧 고급 사용법

### 커스텀 헤더

```vue
<Modal v-model="showModal" width="600px">
  <template #header="{ close }">
    <div class="custom-header">
      <h2>커스텀 헤더</h2>
      <button @click="close">×</button>
    </div>
  </template>

  <template #body>
    <p>커스텀 헤더가 있는 모달입니다.</p>
  </template>
</Modal>
```

### 화면 전체 덮기

```vue
<Modal v-model="showModal" position="center" screen-cover width="100%">
  <template #body>
    <div class="fullscreen-content">
      <h1>전체 화면 모달</h1>
      <p>화면을 완전히 덮는 모달입니다.</p>
    </div>
  </template>
</Modal>
```

### 뒤로가기 방지

```vue
<Modal v-model="showModal" access-back>
  <template #body>
    <p>뒤로가기 버튼이 비활성화됩니다.</p>
  </template>
</Modal>
```

## ♿ 접근성

- `role="dialog"` 속성으로 스크린 리더 인식
- `aria-modal="true"`로 모달 상태 명시
- `aria-labelledby`로 제목 연결
- `aria-describedby`로 내용 연결
- 키보드 포커스 관리
- ESC 키 지원 (옵션)

## 🎨 스타일 커스터마이징

### CSS 변수

```scss
.modal-bg {
  --modal-backdrop-color: rgba(0, 0, 0, 0.5);
  --modal-backdrop-blur: 4px;
  --modal-border-radius: 0.8rem;
  --modal-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
```

### 트랜지션 커스터마이징

```scss
.modal-scale-enter-active,
.modal-scale-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 🔍 예제

```vue
<template>
  <div class="modal-examples">
    <h2>Modal 컴포넌트 예제</h2>

    <div class="button-group">
      <button @click="openModal('popup')">팝업 모달</button>
      <button @click="openModal('center')">중앙 모달</button>
      <button @click="openModal('top')">상단 모달</button>
      <button @click="openModal('bottom')">하단 모달</button>
      <button @click="openModal('left')">좌측 모달</button>
      <button @click="openModal('right')">우측 모달</button>
    </div>

    <Modal
      v-model="showModal"
      :title="modalTitle"
      :position="modalPosition"
      :width="modalWidth"
      esc-close
    >
      <template #body>
        <div class="modal-content">
          <p>이것은 {{ modalPosition }} 위치의 모달입니다.</p>
          <p>ESC 키를 눌러서 닫을 수 있습니다.</p>
        </div>
      </template>

      <template #action="{ close }">
        <button @click="close" class="btn-primary">확인</button>
        <button @click="close" class="btn-secondary">취소</button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Modal from '@/components/Modal';
import type { ModalPosition } from '@/components/Modal/types';

const showModal = ref(false);
const modalPosition = ref<ModalPosition>('popup');

const modalTitle = computed(() => {
  const titles = {
    popup: '팝업 모달',
    center: '중앙 모달',
    top: '상단 모달',
    bottom: '하단 모달',
    left: '좌측 모달',
    right: '우측 모달',
  };
  return titles[modalPosition.value];
});

const modalWidth = computed(() => {
  return ['left', 'right', 'bottom'].includes(modalPosition.value) ? '400px' : '500px';
});

const openModal = (position: ModalPosition) => {
  modalPosition.value = position;
  showModal.value = true;
};
</script>
```

## 🐛 문제 해결

### 모달이 열리지 않는 경우

- `v-model` 바인딩 확인
- `modelValue` prop이 올바르게 전달되는지 확인

### ESC 키가 작동하지 않는 경우

- `esc-close` prop이 `true`로 설정되어 있는지 확인

### 스타일이 적용되지 않는 경우

- SCSS 파일이 올바르게 import되었는지 확인
- CSS 변수가 정의되어 있는지 확인

## 📝 변경 이력

### v2.0.0

- Vue 3 Composition API로 마이그레이션
- TypeScript 지원 추가
- 접근성 개선
- 성능 최적화
- 현대적인 디자인 적용

### v1.0.0

- 초기 버전 릴리즈
- 기본 모달 기능 구현
