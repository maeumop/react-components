export const messageBoxType = {
  alert: 'alert',
  confirm: 'confirm',
} as const;

export const messageBoxTransition = {
  scale: 'msg-box-scale',
  slide: 'msg-box-slide',
  slideUp: 'msg-box-slide-up',
  zoom: 'msg-box-zoom',
  bounce: 'msg-box-bounce',
  flip: 'msg-box-flip',
  elastic: 'msg-box-elastic',
} as const;
