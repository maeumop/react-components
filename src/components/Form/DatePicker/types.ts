import type { Ref } from 'vue';
import type { RuleFunc } from '../../types';
import { transitionCase } from './const';

export type TransitionCase = (typeof transitionCase)[keyof typeof transitionCase];

export interface ToggleButtonType {
  text: string;
  checked: boolean;
}

export type TimeoutType = Record<string, number>;

export interface DateCellType {
  day: number;
  type: string;
}

export interface DateStateValueType extends Record<string, number> {
  year: number;
  month: number;
}

export interface DateStateType extends Record<string, DateStateValueType> {
  start: DateStateValueType;
  end: DateStateValueType;
}

export interface DateOptionType {
  year: number[];
  month: number[];
}

export interface SelectedDateType extends Record<string, string> {
  start: string;
  end: string;
}

export interface DropdownStateType {
  startYear: boolean;
  startMonth: boolean;
  endYear: boolean;
  endMonth: boolean;
}

export interface DatePickerModel {
  check(silence?: boolean): void;
  resetForm(): void;
  resetValidate(): void;
}

export interface Calendar {
  resetSelected(): void;
  makeCalendar(): void;
}

export interface DatePickerStore {
  startDate: Ref<string>;
  endDate: Ref<string>;
  curYear: Ref<number>;
  curMonth: Ref<number>;
  curDay: Ref<number>;
  dateState: DateStateType;
  beforeState: DateStateType;
  selectedDate: SelectedDateType;
  dropdownState: DropdownStateType;
  setStartDate(v: string): void;
  setEndDate(v: string): void;
  setDateState(main: string, sub: string, v: number): void;
  setSelected(flag: string, v: string): void;
  setDropdownState(flag: 'start' | 'end', type: 'year' | 'month', isOpen: boolean): void;
  closeAllDropdowns(): void;
  init(): void;
}

export interface LayerPosition {
  top: string;
  bottom: string;
  left: string;
  right: string;
  transformOrigin: string;
}

export interface DatePickerHelper {
  getLayerPosition(input: HTMLDivElement, isRange?: boolean): LayerPosition;
  getDateFormat(d: Date, format: string, days?: number): string;
  getDateString(year: number, month: number, day: number, s: string): string;
  getBeforeDay(year: number, month: number, week: number): number;
}

export interface DatePickerProps {
  modelValue: string[] | string;
  validate?: RuleFunc[];
  label?: string;
  placeholder?: string[] | string;
  range?: boolean;
  separator?: string;
  minYear?: number;
  maxYear?: number;
  block?: boolean;
  required?: boolean;
  hideMessage?: boolean;
  maxRange?: number;
  readonly?: boolean;
  disabled?: boolean;
  blurValidate?: boolean;
  defaultDate?: boolean;
}

export interface DatePickerEmits {
  (event: 'update:modelValue', value: string[] | string): void;
  (event: 'update:set', value: string[] | string): void;
  (event: 'blur'): void;
}

export interface CalendarProps {
  end?: boolean;
  range: boolean;
  separator: string;
}

export interface CalendarEmits {
  (event: 'update:date', value: boolean): void;
}

export interface SelectorProps {
  year?: boolean;
  month?: boolean;
  end?: boolean;
  max?: number;
  min?: number;
}

export interface DateControllerProps {
  end?: boolean;
  maxYear: number;
  minYear: number;
}
