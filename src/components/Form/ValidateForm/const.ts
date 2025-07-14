import { InjectionKey } from 'vue';
import { ValidateFormInjection } from './types';

export const validateExplorKey = {
  resetForm: 'resetForm',
  resetValidate: 'resetValidate',
  validate: 'validate',
} as const;

// inject 키 상수
export const VALIDATE_FORM_KEY: InjectionKey<ValidateFormInjection> = Symbol('validateForm');
