# Toast 컴포넌트

Vue 3 + TypeScript로 개발된 토스트 알림 컴포넌트입니다. 다양한 상태별 알림을 지원하며, 접근성과 사용자 경험을 고려하여 설계되었습니다.

## 주요 기능

- ✅ **4가지 상태 지원** (success, warning, info, error)
- ✅ **자동 제거** 기능 (설정 가능한 지연 시간)
- ✅ **최대 개수 제한** (기본 4개)
- ✅ **클릭으로 제거** 가능
- ✅ **키보드 접근성** (Enter, Space 키 지원)
- ✅ **부드러운 애니메이션** 효과
- ✅ **Iconify 아이콘** 지원
- ✅ **TypeScript** 완전 지원
- ✅ **Vue 플러그인** 형태 제공

## 설치 및 설정

### 1. 플러그인 설치

```typescript
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import Toast from '@/components/Toast';

const app = createApp(App);

// 기본 설정으로 설치
app.use(Toast);

// 또는 커스텀 옵션으로 설치
app.use(Toast, {
  maxShowMessage: 5,
  delay: 5000, // 5초
});

app.mount('#app');
```

### 2. 사용법

#### Composition API에서 사용

```typescript
import { inject } from 'vue';
import type { ToastModel } from '@/components/Toast/types';

export default {
  setup() {
    const toast = inject('toast') as ToastModel;

    const showSuccessToast = () => {
      toast('성공적으로 저장되었습니다!');
    };

    const showErrorToast = () => {
      toast({
        message: '오류가 발생했습니다.',
        color: 'error',
      });
    };

    return {
      showSuccessToast,
      showErrorToast,
    };
  },
};
```

#### Options API에서 사용

```typescript
export default {
  methods: {
    showToast() {
      this.$toast('토스트 메시지입니다.');
    },
  },
};
```

## API 문서

### ToastModel

```typescript
interface ToastModel {
  (params: string | MessageOptions): void;
}
```

### MessageOptions

| 속성      | 타입         | 기본값      | 설명                                   |
| --------- | ------------ | ----------- | -------------------------------------- |
| `message` | `string`     | -           | **필수** 표시할 메시지                 |
| `color`   | `ToastColor` | `'success'` | 토스트 색상                            |
| `icon`    | `ToastIcon`  | -           | 커스텀 아이콘 (color에 따라 자동 설정) |

### ToastOptions (플러그인 설정)

| 속성             | 타입     | 기본값 | 설명               |
| ---------------- | -------- | ------ | ------------------ |
| `maxShowMessage` | `number` | `4`    | 최대 표시 개수     |
| `delay`          | `number` | `3000` | 표시 시간 (밀리초) |

## 사용 예제

### 1. 기본 사용법

```typescript
// 간단한 성공 메시지
toast('작업이 완료되었습니다.');

// 커스텀 메시지
toast({
  message: '데이터가 저장되었습니다.',
  color: 'success',
});
```

### 2. 다양한 상태별 메시지

```typescript
// 성공 메시지
toast({
  message: '성공적으로 저장되었습니다.',
  color: 'success',
});

// 경고 메시지
toast({
  message: '주의가 필요한 작업입니다.',
  color: 'warning',
});

// 정보 메시지
toast({
  message: '새로운 업데이트가 있습니다.',
  color: 'info',
});

// 오류 메시지
toast({
  message: '오류가 발생했습니다.',
  color: 'error',
});
```

### 3. 커스텀 아이콘

```typescript
import { toastIconCase } from '@/components/Toast';

toast({
  message: '커스텀 아이콘 메시지',
  color: 'info',
  icon: toastIconCase.info,
});
```

## 접근성 기능

### 키보드 네비게이션

- **Tab**: 토스트 메시지 간 이동
- **Enter/Space**: 토스트 메시지 제거
- **포커스 표시**: 명확한 시각적 피드백

### 스크린 리더 지원

- `role="alert"`: 알림 역할 명시
- `aria-live`: 동적 콘텐츠 알림
- `aria-label`: 메시지 내용 설명

## 스타일 커스터마이징

### 기본 스타일 오버라이드

```scss
.toast-bg {
  .toast-body {
    // 커스텀 스타일
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    // 포커스 스타일 커스터마이징
    &:focus {
      outline: 2px solid #your-color;
      outline-offset: 2px;
    }
  }
}
```

### 색상 테마 커스터마이징

```scss
// 성공 상태
.bg-success {
  background-color: #10b981;
  border-left-color: #059669;
}

// 경고 상태
.bg-warning {
  background-color: #f59e0b;
  border-left-color: #d97706;
}

// 정보 상태
.bg-info {
  background-color: #3b82f6;
  border-left-color: #2563eb;
}

// 오류 상태
.bg-error {
  background-color: #ef4444;
  border-left-color: #dc2626;
}
```

## TypeScript 지원

### 타입 정의

```typescript
import type {
  ToastModel,
  MessageOptions,
  ToastColorCase,
  ToastIconCase,
} from '@/components/Toast/types';

// 타입 안전한 사용
const showTypedToast = (message: string, color: ToastColorCase) => {
  toast({ message, color });
};
```

## 성능 최적화

### 메모리 관리

- 자동 timeout 정리
- 컴포넌트 언마운트 시 리소스 정리
- Map 기반 timeout 관리로 메모리 누수 방지

### 애니메이션 최적화

- CSS transform 사용으로 GPU 가속
- 부드러운 cubic-bezier 이징 함수
- 효율적인 TransitionGroup 사용

## 브라우저 지원

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 변경 이력

### v2.0.0 (현재)

- Iconify 아이콘 시스템 도입
- 접근성 기능 대폭 개선
- 메서드 기반 API 제공
- 메모리 누수 방지 개선
- TypeScript 타입 안전성 향상

### v1.0.0

- 초기 릴리즈
- 기본 토스트 기능
- MDI 아이콘 지원

## 라이선스

MIT License
