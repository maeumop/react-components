import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BadgeExample from './components/Badge/ex';
import StyledButtonExample from './components/StyledButton/ex';
import TooltipExample from './components/Tooltip/ex';
import ComponentsPage from './views/components';
// import DropMenuExample from './components/DropMenu/ex';
// import SpinnerExample from './components/Spinner/ex';
// import MessageBoxExample from './components/MessageBox/ex';
// import ToastExample from './components/Toast/ex';
import TabsExample from './components/Tabs/ex';
// import StatusSelectorExample from './components/StatusSelector/ex';
// import ListTableExample from './components/ListTable/ex';
// import PaginationExample from './components/Pagination/ex';
// import ModalExample from './components/Modal/ex';
// import CheckButtonExample from './components/Form/CheckButton/ex';
// import SwitchButtonExample from './components/Form/SwitchButton/ex';
// import TextFieldExample from './components/Form/TextField/ex';
// import NumberFormatExample from './components/Form/NumberFormat/ex';
// import SelectBoxExample from './components/Form/SelectBox/ex';
// import DatePickerExample from './components/Form/DatePicker/ex';
// import ValidateWrapExample from './components/Form/ValidateWrap/ex';
// import ValidateFormExample from './components/Form/ValidateForm/ex';

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ComponentsPage />} />
      <Route path="/components/tooltip" element={<TooltipExample />} />
      <Route path="/components/badge" element={<BadgeExample />} />
      <Route path="/components/buttons" element={<StyledButtonExample />} />
      {/* <Route path="/components/dropmenu" element={<DropMenuExample />} /> */}
      {/* <Route path="/components/spinner" element={<SpinnerExample />} /> */}
      {/* <Route path="/components/messagebox" element={<MessageBoxExample />} /> */}
      {/* <Route path="/components/toast" element={<ToastExample />} /> */}
      <Route path="/components/tabs" element={<TabsExample />} />
      {/* <Route path="/components/statusselector" element={<StatusSelectorExample />} /> */}
      {/* <Route path="/components/listtable" element={<ListTableExample />} /> */}
      {/* <Route path="/components/pagination" element={<PaginationExample />} /> */}
      {/* <Route path="/components/modal" element={<ModalExample />} /> */}
      {/* <Route path="/components/checkbutton" element={<CheckButtonExample />} /> */}
      {/* <Route path="/components/switchbutton" element={<SwitchButtonExample />} /> */}
      {/* <Route path="/components/textfield" element={<TextFieldExample />} /> */}
      {/* <Route path="/components/numberformat" element={<NumberFormatExample />} /> */}
      {/* <Route path="/components/selectbox" element={<SelectBoxExample />} /> */}
      {/* <Route path="/components/datepicker" element={<DatePickerExample />} /> */}
      {/* <Route path="/components/validatewrap" element={<ValidateWrapExample />} /> */}
      {/* <Route path="/components/validateform" element={<ValidateFormExample />} /> */}
    </Routes>
  </BrowserRouter>
);

export default App;
