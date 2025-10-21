import React from 'react';

export interface ValidateFormRef {
  formProtection(protect?: boolean): void;
  resetForm(): void;
  validate(silence?: boolean): boolean;
  resetValidate(): void;
}

export type ValidateExplorKey = 'resetForm' | 'resetValidate' | 'validate';

export interface ValidatableComponent {
  check(silence?: boolean): boolean;
  resetForm(): void;
  resetValidate(): void;
}

// Context를 위한 타입 정의
export interface ValidateFormContext {
  addComponent: (ref: ValidatableComponent, element: HTMLElement | null) => void;
  removeComponent: (ref: ValidatableComponent) => void;
}

export interface ValidateFormProps {
  children: React.ReactNode;
}

export interface ComponentEntry {
  ref: ValidatableComponent;
  element: HTMLElement | null;
}
