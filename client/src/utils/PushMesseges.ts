import checkIcon from '../assets/images/icons/check.png';
import errorIcon from '../assets/images/icons/error.png';

export class PushMessages {
  private static showNotification(
    title: string,
    options?: NotificationOptions,
  ): void {
    if (!('Notification' in window)) {
      console.warn('Этот браузер не поддерживает уведомления.');
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification(title, options);
    }
  }

  public showErrorMessage(title: string, options: NotificationOptions): void {
    PushMessages.showNotification(title, {
      body: options.body,
      icon: errorIcon,
      tag: 'error',
      silent: true,
    });
  }

  public showCheckMessage(title: string, options: NotificationOptions): void {
    PushMessages.showNotification(title, {
      body: options.body,
      icon: checkIcon,
      tag: 'check',
      silent: true,
    });
  }
}
