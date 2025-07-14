import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/components'),
    },
    {
      path: '/components/badge',
      name: 'badge',
      component: () => import('../components/Badge/ex'),
    },
    {
      path: '/components/buttons',
      name: 'buttons',
      component: () => import('../components/StyledButton/ex'),
    },
    {
      path: '/components/dropmenu',
      name: 'dropmenu',
      component: () => import('../components/DropMenu/ex'),
    },
    {
      path: '/components/spinner',
      name: 'spinner',
      component: () => import('../components/Spinner/ex'),
    },
    {
      path: '/components/tooltip',
      name: 'tooltip',
      component: () => import('../components/Tooltip/ex'),
    },
    {
      path: '/components/messagebox',
      name: 'messagebox',
      component: () => import('../components/MessageBox/ex'),
    },
    {
      path: '/components/toast',
      name: 'toast',
      component: () => import('../components/Toast/ex'),
    },
    {
      path: '/components/tabs',
      name: 'tabs',
      component: () => import('../components/Tabs/ex'),
    },
    {
      path: '/components/statusselector',
      name: 'statusselector',
      component: () => import('../components/StatusSelector/ex'),
    },
    {
      path: '/components/listtable',
      name: 'listtable',
      component: () => import('../components/ListTable/ex'),
    },
    {
      path: '/components/pagination',
      name: 'pagination',
      component: () => import('../components/Pagination/ex'),
    },
    {
      path: '/components/modal',
      name: 'modal',
      component: () => import('../components/Modal/ex'),
    },
    {
      path: '/components/checkbutton',
      name: 'checkbutton',
      component: () => import('../components/Form/CheckButton/ex'),
    },
    {
      path: '/components/switchbutton',
      name: 'switchbutton',
      component: () => import('../components/Form/SwitchButton/ex'),
    },
    {
      path: '/components/textfield',
      name: 'textfield',
      component: () => import('../components/Form/TextField/ex'),
    },
    {
      path: '/components/numberformat',
      name: 'numberformat',
      component: () => import('../components/Form/NumberFormat/ex'),
    },
    {
      path: '/components/selectbox',
      name: 'selectbox',
      component: () => import('../components/Form/SelectBox/ex'),
    },
    {
      path: '/components/datepicker',
      name: 'datepicker',
      component: () => import('../components/Form/DatePicker/ex'),
    },
    {
      path: '/components/validatewrap',
      name: 'validatewrap',
      component: () => import('../components/Form/ValidateWrap/ex'),
    },
    {
      path: '/components/validateform',
      name: 'validateform',
      component: () => import('../components/Form/ValidateForm/ex'),
    },
  ],
});

export default router;
