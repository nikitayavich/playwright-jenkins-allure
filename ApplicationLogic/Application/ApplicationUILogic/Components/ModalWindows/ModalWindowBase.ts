import {BaseApplicationPage} from '../../Pages/BaseApplicationPage';

export class ModalWindowBase extends BaseApplicationPage {
  constructor(page) {
    super(page);
  };

  Containers = {
    MainContainer: this.page.locator(this.mainLocators.modalWindowLocator),
    DropdownContainer: this.page.locator(this.mainLocators.dropdownLocator),
  };

  async WaitForModalHiding() {
    const elementHandle = await this.page.$(this.Containers.MainContainer._selector);
    await elementHandle?.waitForElementState('hidden');
  };
};
