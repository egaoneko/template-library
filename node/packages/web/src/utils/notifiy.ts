import { ReactNotificationOptions, store } from 'react-notifications-component';

const DEFAULT_NOTIFICATION_OPTIONS = {
  insert: 'top',
  container: 'top-right',
  animationIn: ['animate__animated', 'animate__fadeIn'],
  animationOut: ['animate__animated', 'animate__fadeOut'],
  dismiss: {
    duration: 2000,
  },
};

export function notifyError(message: string, options?: ReactNotificationOptions): string {
  return store.addNotification({
    title: 'Error',
    type: 'danger',
    message,
    ...DEFAULT_NOTIFICATION_OPTIONS,
    ...options,
  } as ReactNotificationOptions);
}

export function notifySuccess(message: string, options?: ReactNotificationOptions): string {
  return store.addNotification({
    title: 'Success',
    type: 'success',
    message,
    ...DEFAULT_NOTIFICATION_OPTIONS,
    ...options,
  } as ReactNotificationOptions);
}
