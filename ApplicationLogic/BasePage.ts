import {expect, Page} from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly pageLocator: string;

  constructor(page : Page, pageLocator: string = '') {
    this.page = page;
    this.pageLocator = pageLocator;
    if (!!pageLocator) {
      expect(this.page.isVisible(this.pageLocator)).toBeTruthy;
    }
  };

  mainLocators = {
    notificationLocator: '[data-testid="snackbar"]',
    modalWindowLocator: '[data-testid="modal"]',
    dropdownLocator: '[data-testid="dropdown-popper-list"]',
  };

  async WaitForNotificationHiding() {
    await this.page.locator(this.mainLocators.notificationLocator).waitFor();
    const elementHandle = await this.page.$(this.mainLocators.notificationLocator);
    await elementHandle?.waitForElementState('hidden');
  };
}
