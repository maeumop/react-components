import BadgeExample from '@/components/Badge/ex';
import DropMenuExample from '@/components/DropMenu/ex';
import CheckButtonExample from '@/components/Form/CheckButton/ex';
import NumberFormatExample from '@/components/Form/NumberFormat/ex';
import SwitchButtonExample from '@/components/Form/SwitchButton/ex';
import TextFieldExample from '@/components/Form/TextField/ex';
import ListTableExample from '@/components/ListTable/ex';
import MessageBoxExample from '@/components/MessageBox/ex';
import ModalExample from '@/components/Modal/ex';
import PaginationExample from '@/components/Pagination/ex';
import SpinnerExample from '@/components/Spinner/ex';
import StatusSelectorExample from '@/components/StatusSelector/ex';
import StyledButtonExample from '@/components/StyledButton/ex';
import TabsExample from '@/components/Tabs/ex';
import ToastExample from '@/components/Toast/ex';
import TooltipExample from '@/components/Tooltip/ex';
import ComponentsPage from '@/views/components';
// import SelectBoxExample from './components/Form/SelectBox/ex';
// import DatePickerExample from './components/Form/DatePicker/ex';
// import ValidateWrapExample from './components/Form/ValidateWrap/ex';
// import ValidateFormExample from './components/Form/ValidateForm/ex';

export const routes = [
  { path: '/', element: <ComponentsPage /> },
  { path: '/components/tooltip', element: <TooltipExample /> },
  { path: '/components/badge', element: <BadgeExample /> },
  { path: '/components/buttons', element: <StyledButtonExample /> },
  { path: '/components/dropmenu', element: <DropMenuExample /> },
  { path: '/components/spinner', element: <SpinnerExample /> },
  { path: '/components/messagebox', element: <MessageBoxExample /> },
  { path: '/components/toast', element: <ToastExample /> },
  { path: '/components/tabs', element: <TabsExample /> },
  { path: '/components/statusselector', element: <StatusSelectorExample /> },
  { path: '/components/listtable', element: <ListTableExample /> },
  { path: '/components/pagination', element: <PaginationExample /> },
  { path: '/components/modal', element: <ModalExample /> },
  { path: '/components/checkbutton', element: <CheckButtonExample /> },
  { path: '/components/textfield', element: <TextFieldExample /> },
  { path: '/components/numberformat', element: <NumberFormatExample /> },
  { path: '/components/switchbutton', element: <SwitchButtonExample /> },
];
