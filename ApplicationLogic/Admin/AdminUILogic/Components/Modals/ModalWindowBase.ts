import {BaseAdminPage} from '../../Pages/BaseAdminPage';

export class ModalWindowBase extends BaseAdminPage {
  constructor(page) {
    super(page);
  };

  Containers = {
    MainContainer: this.page.locator(this.mainLocators.modalWindowLocator),
    DropdownContainer: this.page.locator(this.mainLocators.dropdownLocator),
  };
};
