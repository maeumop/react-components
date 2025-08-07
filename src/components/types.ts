// selectbox, checkbox 사용 옵션
export interface OptionItem {
  text: string;
  value: string;
}

export interface OptionItemGroup {
  [index: string]: OptionItem[];
}
