import {BasePage} from "../../../BasePage";

export class BaseAdminPage extends BasePage {
  constructor(page) {
    super(page);
  };

  InheritedFields = {
    DetailViewContainerLocator: '[class*="DetailViewContainer"]',
    ResetButton: '"RESET"',
  };
};
