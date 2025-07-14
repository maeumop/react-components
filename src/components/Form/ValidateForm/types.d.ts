import type { VNode } from 'vue';

export interface ValidateFormModel {
  formProtection(protect?: boolean): void;
  resetForm(): void;
  validate(silence?: boolean): boolean;
  resetValidate(): void;
}

export type ValidateExplorKey = (typeof ValidateExplorKey)[keyof typeof ValidateExplorKey];

interface ValidatableComponent {
  check(silence?: boolean): boolean;
  resetForm(): void;
  resetValidate(): void;
}

// inject를 위한 타입 정의
export interface ValidateFormInjection {
  addComponent: (node: VNode) => void;
}
