import checkIcon from '../../../assets/images/icons/check.png';
import { PushMessages } from '../PushMessages';

export class CheckMessage extends PushMessages {
  constructor() {
    super();
  }

  showNotification(title: string, options: NotificationOptions): void {
    const checkTitle = title;
    const checkOptions: NotificationOptions = {
      icon: checkIcon,
      tag: 'check',
      ...options,
    };

    super.showNotification(checkTitle, checkOptions);
  }

  /**
   * * AuthSuccess
   */
  public AuthSuccess() {
    this.showNotification('Авторизация успешна', { body: 'Хорошего дня!' });
  }
}
