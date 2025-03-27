interface IPushMessages {
  showNotification: (title: string, options?: NotificationOptions) => void;
}

export class PushMessages implements IPushMessages {
  showNotification(
    title: string,
    options: NotificationOptions = {
      silent: true,
    },
  ): void {
    if (!('Notification' in window)) {
      console.warn('Этот браузер не поддерживает уведомления.');
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification(title, options);
    }
  }
}
