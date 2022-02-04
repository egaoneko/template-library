import Toast from 'react-native-toast-message';
import { ToastProps } from 'react-native-toast-message/lib/src/types';

const DEFAULT_NOTIFICATION_OPTIONS = {
  position: 'top',
  visibilityTime: 2000,
} as ToastProps;

export function notifyError(message: string | [], options?: ToastProps): void {
  notify('Error', 'error', message, options);
}

export function notifySuccess(message: string | [], options?: ToastProps): void {
  notify('Success', 'success', message, options);
}

export function notify(
  title: string,
  type: 'success' | 'error' | 'info' | undefined,
  message: string | [],
  options?: ToastProps,
): void {
  Toast.show({
    text1: title,
    text2: Array.isArray(message) ? message.join(', ') : message,
    type,
    ...DEFAULT_NOTIFICATION_OPTIONS,
    ...options,
  } as ToastProps);
}
