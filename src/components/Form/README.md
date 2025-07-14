# Form 컴포넌트 공통 스타일

## 개요

Form 컴포넌트들의 공통 스타일을 관리하는 `common.scss` 파일입니다. 모든 Form 컴포넌트에서 일관된 스타일과 애니메이션을 제공합니다.

## 파일 구조

```
Form/
├── common.scss          # 공통 스타일 정의
├── common.ts           # 공통 유틸리티 함수
├── types.ts            # 공통 타입 정의
├── TextField/          # 텍스트 입력 컴포넌트
├── CheckButton/        # 체크박스 컴포넌트
├── SwitchButton/       # 스위치 버튼 컴포넌트
├── NumberFormat/       # 숫자 포맷 컴포넌트
├── SelectBox/          # 셀렉트 박스 컴포넌트
├── DatePicker/         # 날짜 선택 컴포넌트
├── ValidateWrap/       # 유효성 검사 래퍼 컴포넌트
└── ValidateForm/       # 유효성 검사 폼 컴포넌트
```

## 공통 스타일 사용법

### 1. 스타일 파일에서 import

각 Form 컴포넌트의 `style.scss` 파일에서 공통 스타일을 import합니다:

```scss
@use '../common.scss' as form;
```

### 2. 제공되는 공통 클래스

#### 레이아웃 클래스

- `.block`: 블록 레이아웃 (display: block, width: 100%)
- `.inline-block`: 인라인 블록 레이아웃 (display: inline-block, position: relative, vertical-align: middle)

#### 옵션 래퍼 클래스

- `.options-wrap`: 옵션 래퍼 스타일 (display: flex, justify-content: space-between, align-items: center)

#### 라벨 클래스

- `.input-label`: 입력 라벨 스타일 (font-size: 0.875rem, font-weight: 500, color: #333)
  - `.required`: 필수 표시 스타일 (color: #dc3545)

#### 입력 필드 클래스

- `.form-input`: 기본 입력 필드 스타일 (padding, border, focus, disabled, error 상태 포함)
- `textarea`: textarea 스타일 (form-input 상속 + resize: vertical)

#### 에러 메시지 클래스

- `.feedback`, `.description`: 에러 메시지 스타일 (트랜지션과 애니메이션 포함)
  - `.error`: 에러 상태 스타일

### 3. 제공되는 믹스인

```scss
// 포커스 스타일
@mixin form-focus {
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
  }
}

// 에러 스타일
@mixin form-error {
  &.error {
    border-color: #dc3545;
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
  }
}

// 비활성화 스타일
@mixin form-disabled {
  &:disabled {
    background-color: #f8f9fa;
    color: #6c757d;
    cursor: not-allowed;
  }
}
```

### 4. 공통 애니메이션

#### errorShake 애니메이션

에러 상태일 때 셰이크 효과를 제공합니다:

```scss
@keyframes errorShake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-0.25rem);
  }
  75% {
    transform: translateX(0.25rem);
  }
}
```

## 적용된 컴포넌트

다음 Form 컴포넌트들이 공통 스타일을 사용합니다:

1. **TextField**: 입력 필드, 라벨, 에러 메시지
2. **CheckButton**: 체크박스, 라벨, 에러 메시지
3. **SwitchButton**: 스위치, 라벨, 에러 메시지
4. **NumberFormat**: 숫자 입력 필드, 라벨, 에러 메시지
5. **SelectBox**: 셀렉트 박스, 라벨, 에러 메시지
6. **DatePicker**: 날짜 선택, 라벨, 에러 메시지
7. **ValidateWrap**: 유효성 검사 래퍼, 에러 메시지

## 스타일 일관성

모든 Form 컴포넌트는 다음과 같은 일관된 스타일을 가집니다:

- **색상**: 일관된 색상 팔레트 사용
- **간격**: 통일된 padding, margin 값
- **폰트**: 일관된 font-size, font-weight
- **애니메이션**: 동일한 트랜지션과 애니메이션 효과
- **에러 처리**: 통일된 에러 메시지 스타일과 셰이크 애니메이션

## 유지보수

공통 스타일을 수정할 때는 다음 사항을 고려하세요:

1. 모든 Form 컴포넌트에 영향을 미치므로 신중하게 수정
2. 기존 스타일과의 호환성 확인
3. 반응형 디자인 고려
4. 접근성 가이드라인 준수

## 참고사항

- Sass의 @use 방식을 사용하여 미래 호환성 확보
- 네임스페이스 'form'을 사용하여 다른 모듈과의 충돌 방지
- 공통 스타일은 Form 컴포넌트 전용이므로 다른 컴포넌트에서는 사용하지 않음
