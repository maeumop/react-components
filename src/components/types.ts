import type { SvgIconProps } from '@mui/material/SvgIcon';

// selectbox, checkbox 사용 옵션
export interface OptionItem {
  text: string;
  value: string;
}

export interface OptionItemGroup {
  [index: string]: OptionItem[];
}

// 아이콘 컴포넌트 타입
export type IconComponent = React.ComponentType<SvgIconProps>;
