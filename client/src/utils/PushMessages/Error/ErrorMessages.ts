import errorIcon from '../../../assets/images/icons/error.png';
import { PushMessages } from '../PushMessages';

export class ErrorMessage extends PushMessages {
  constructor() {
    super();
  }

  showNotification(title: string, options: NotificationOptions): void {
    const errorTitle = `Error: ${title}`;
    const errorOptions: NotificationOptions = {
      icon: errorIcon,
      tag: 'error',
      ...options,
    };

    super.showNotification(errorTitle, errorOptions);
  }

  // * Пользователь не аутентифицирован
  public HTTP401() {
    this.showNotification('Сессия истекла', {
      body: 'Авторизуйтесь снова',
    });
  }

  // * Пользователь в бане
  public HTTP403() {
    this.showNotification('Вы заблокированы', {
      body: 'Введите себя лучше',
    });
  }
}
