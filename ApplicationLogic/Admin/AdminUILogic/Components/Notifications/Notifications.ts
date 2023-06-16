import {BaseAdminPage} from '../../Pages/BaseAdminPage';

export class Notifications extends BaseAdminPage {
  constructor(page) {
    super(page);
  };

  Containers = {
    MainContainer: this.page.locator('_react=[path="/logandqueues/notifications"]'),
  };
}
