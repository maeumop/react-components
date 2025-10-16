import { createContext } from 'react';
import type { ValidateFormContext } from './types';

export const VFContext = createContext<ValidateFormContext | null>(null);
