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

export function notifyError(message: string | [], options?: ReactNotificationOptions): string {
  return notify('Error', 'danger', message, options);
}

export function notifySuccess(message: string | [], options?: ReactNotificationOptions): string {
  return notify('Success', 'success', message, options);
}

export function notify(
  title: string,
  type: 'success' | 'danger' | 'info' | 'default' | 'warning' | undefined,
  message: string | [],
  options?: ReactNotificationOptions,
): string {
  return store.addNotification({
    title,
    type,
    message: Array.isArray(message) ? message.join(', ') : message,
    ...DEFAULT_NOTIFICATION_OPTIONS,
    ...options,
  } as ReactNotificationOptions);
}
