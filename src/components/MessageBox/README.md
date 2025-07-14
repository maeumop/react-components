# MessageBox 컴포넌트

Vue 3 + TypeScript로 개발된 모달 메시지 박스 컴포넌트입니다. Alert와 Confirm 다이얼로그를 지원하며, 다양한 트랜지션 효과와 접근성 기능을 제공합니다.

## 주요 기능

- ✅ **Alert & Confirm 다이얼로그** 지원
- ✅ **7가지 트랜지션 효과** (Scale, Slide, Slide Up, Zoom, Bounce, Flip, Elastic)
- ✅ **비동기 처리** 지원 (asyncOkay 콜백)
- ✅ **키보드 접근성** (Enter, ESC 키 지원)
- ✅ **스크롤바 제거** 기능 (배경 스크롤 방지)
- ✅ **HTML 메시지** 지원
- ✅ **커스텀 스타일링** (너비, 버튼 텍스트 등)
- ✅ **Vue 3 Composition API** 기반
- ✅ **TypeScript** 완전 지원
- ✅ **Vue 플러그인** 형태로 제공

## 설치 및 설정

### 1. 플러그인 설치

```typescript
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import MessageBox, { messageBoxTransition } from '@/components/MessageBox';

const app = createApp(App);

// 기본 설정으로 설치
app.use(MessageBox);

// 또는 커스텀 옵션으로 설치
app.use(MessageBox, {
  noScrollStyleClass: 'hide-scroll',
  defaultTransition: messageBoxTransition.scale,
});

app.mount('#app');
```

### 2. 전역 사용법

```typescript
// Composition API에서 사용
import { getCurrentInstance } from 'vue';

export default {
  setup() {
    const { proxy } = getCurrentInstance();

    const showAlert = () => {
      proxy.$messageBox.alert('알림 메시지입니다.');
    };

    const showConfirm = () => {
      proxy.$messageBox.confirm('확인하시겠습니까?');
    };
  },
};
```

### 3. 직접 import 사용법

```typescript
import { messageBox, messageBoxTransition } from '@/components/MessageBox';

// 기본 Alert
messageBox.alert('알림 메시지입니다.');

// 기본 Confirm
messageBox.confirm('확인하시겠습니까?');
```

## API 문서

### MessageBoxOptions

| 속성                 | 타입                   | 기본값          | 설명                             |
| -------------------- | ---------------------- | --------------- | -------------------------------- |
| `type`               | `'alert' \| 'confirm'` | -               | 다이얼로그 타입                  |
| `message`            | `string`               | -               | **필수** 메시지 내용 (HTML 지원) |
| `title`              | `string`               | -               | 다이얼로그 제목                  |
| `width`              | `string`               | `'320px'`       | 다이얼로그 너비                  |
| `btnOkayText`        | `string`               | `'확인'`        | 확인 버튼 텍스트                 |
| `btnCancelText`      | `string`               | `'취소'`        | 취소 버튼 텍스트                 |
| `okay`               | `() => void`           | -               | 확인 버튼 클릭 시 실행할 함수    |
| `cancel`             | `() => void`           | -               | 취소 버튼 클릭 시 실행할 함수    |
| `asyncOkay`          | `() => Promise<void>`  | -               | 비동기 확인 처리 함수            |
| `destroy`            | `() => void`           | -               | 다이얼로그 제거 시 실행할 함수   |
| `escCancel`          | `boolean`              | `true`          | ESC 키로 취소 가능 여부          |
| `enterOkay`          | `boolean`              | `true`          | Enter 키로 확인 가능 여부        |
| `noScrollStyleClass` | `string`               | `'hide-scroll'` | 스크롤 제거 시 적용할 CSS 클래스 |
| `transition`         | `MessageBoxTransition` | `'scale'`       | 트랜지션 효과                    |

### MessageBoxTransition

```typescript
export const messageBoxTransition = {
  scale: 'msg-box-scale', // 기본 스케일 효과
  slide: 'msg-box-slide', // 슬라이드 효과
  slideUp: 'msg-box-slide-up', // 위로 슬라이드
  zoom: 'msg-box-zoom', // 줌 효과
  bounce: 'msg-box-bounce', // 바운스 효과
  flip: 'msg-box-flip', // 플립 효과
  elastic: 'msg-box-elastic', // 탄성 효과
} as const;
```

## 사용 예제

### 1. 기본 사용법

```typescript
// 간단한 Alert
messageBox.alert('작업이 완료되었습니다.');

// 간단한 Confirm
messageBox.confirm('정말 삭제하시겠습니까?');
```

### 2. 제목과 콜백 함수

```typescript
messageBox.alert({
  title: '알림',
  message: '저장이 완료되었습니다.',
  okay: () => {
    console.log('확인 버튼 클릭됨');
  },
});

messageBox.confirm({
  title: '확인',
  message: '정말 삭제하시겠습니까?',
  okay: () => {
    console.log('삭제 실행');
  },
  cancel: () => {
    console.log('삭제 취소');
  },
});
```

### 3. 비동기 처리

```typescript
messageBox.confirm({
  title: '데이터 저장',
  message: '변경사항을 저장하시겠습니까?',
  asyncOkay: async () => {
    // 로딩 스피너가 자동으로 표시됩니다
    await saveData();
    console.log('저장 완료');
  },
  cancel: () => {
    console.log('저장 취소');
  },
});
```

### 4. HTML 메시지

```typescript
messageBox.alert({
  title: 'HTML 메시지',
  message:
    '<strong>굵은 텍스트</strong>와 <em>기울임 텍스트</em>를 포함한 메시지입니다.<br><br>줄바꿈도 지원됩니다.',
});
```

### 5. 커스텀 스타일링

```typescript
messageBox.alert({
  title: '커스텀 Alert',
  message: '커스텀 스타일이 적용된 메시지입니다.',
  width: '500px',
  btnOkayText: '알겠습니다',
  transition: messageBoxTransition.bounce,
});
```

### 6. 다양한 트랜지션 효과

```typescript
// Scale 트랜지션 (기본)
messageBox.alert({
  message: '기본 스케일 효과',
  transition: messageBoxTransition.scale,
});

// Slide 트랜지션
messageBox.alert({
  message: '슬라이드 효과',
  transition: messageBoxTransition.slide,
});

// Bounce 트랜지션
messageBox.alert({
  message: '바운스 효과',
  transition: messageBoxTransition.bounce,
});

// Elastic 트랜지션
messageBox.alert({
  message: '탄성 효과',
  transition: messageBoxTransition.elastic,
});
```

### 7. 프로그래밍 방식으로 제어

```typescript
// 다이얼로그 인스턴스 생성
const messageBoxApp = createApp(MessageBoxComponent, {
  title: '제어 가능한 다이얼로그',
  message: '프로그래밍 방식으로 제어할 수 있습니다.',
  destroy: () => {
    messageBoxApp.unmount();
  },
});

// DOM에 마운트
const container = document.createElement('div');
document.body.appendChild(container);
const instance = messageBoxApp.mount(container);

// 프로그래밍 방식으로 숨기기
instance.hide();
```

## 키보드 접근성

- **Enter 키**: 확인 버튼 클릭 (기본값: `true`)
- **ESC 키**: 취소 버튼 클릭 (기본값: `true`)

```typescript
messageBox.confirm({
  message: '키보드 접근성이 비활성화된 다이얼로그',
  escCancel: false, // ESC 키 비활성화
  enterOkay: false, // Enter 키 비활성화
});
```

## 스크롤바 제거 기능

다이얼로그가 열릴 때 배경 스크롤을 방지하는 기능을 제공합니다.

```typescript
// 기본 설정 (hide-scroll 클래스 사용)
messageBox.alert('스크롤바가 제거된 메시지');

// 커스텀 클래스 사용
messageBox.alert({
  message: '커스텀 스크롤 제거 클래스 사용',
  noScrollStyleClass: 'custom-no-scroll',
});
```

## CSS 스타일링

### 기본 스타일 오버라이드

```scss
// 다이얼로그 배경
.msg-box-bg {
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

// 다이얼로그 컨테이너
.msg-box {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

// 제목
.msg-box .title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

// 메시지 내용
.msg-box .contents {
  color: #6b7280;
  line-height: 1.6;
}

// 버튼
.msg-box .btn-okay {
  background-color: #3b82f6;
  color: white;

  &:hover {
    background-color: #2563eb;
  }
}

.msg-box .btn-cancel {
  background-color: #6b7280;
  color: white;

  &:hover {
    background-color: #4b5563;
  }
}
```

### 스크롤 제거 스타일

```scss
.hide-scroll {
  overflow: hidden !important;
  padding-right: var(--scrollbar-width, 0px);
}
```

## 트랜지션 효과

### 사용 가능한 트랜지션

1. **Scale** (기본): 중앙에서 확대/축소
2. **Slide**: 좌우 슬라이드
3. **Slide Up**: 아래에서 위로 슬라이드
4. **Zoom**: 줌 인/아웃 효과
5. **Bounce**: 바운스 효과
6. **Flip**: 플립 효과
7. **Elastic**: 탄성 효과

### 커스텀 트랜지션 추가

```scss
// 커스텀 트랜지션 정의
.msg-box-custom-enter-active,
.msg-box-custom-leave-active {
  transition: all 0.3s ease;
}

.msg-box-custom-enter-from {
  opacity: 0;
  transform: rotate(180deg) scale(0.5);
}

.msg-box-custom-leave-to {
  opacity: 0;
  transform: rotate(-180deg) scale(0.5);
}
```

## TypeScript 지원

### 타입 정의

```typescript
import type {
  MessageBoxOptions,
  MessageBoxExpose,
  MessageBoxModel,
  MessageBoxTransition,
} from '@/components/MessageBox';

// 옵션 타입 사용
const options: MessageBoxOptions = {
  message: '타입 안전한 메시지',
  title: '타입 체크',
  transition: messageBoxTransition.bounce,
};

// 트랜지션 타입 사용
const transition: MessageBoxTransition = messageBoxTransition.scale;
```

## 브라우저 지원

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 라이선스

MIT License

## 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 변경 이력

### v1.0.0

- 초기 릴리즈
- Alert 및 Confirm 다이얼로그 지원
- 7가지 트랜지션 효과
- 키보드 접근성
- 비동기 처리 지원
- Vue 3 플러그인 형태 제공
